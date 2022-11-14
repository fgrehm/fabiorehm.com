---
date: "2014-09-25"
title: "Devstep updates"
description: "Check out the latest Devstep goodies"
tags:
- docker
- devstep
- golang
---

The third release of the [Devstep](http://fgrehm.viewdocs.io/devstep) Docker image
came out last night along with a brand new Golang CLI featuring some very nice
improvements and new functionality. The CHANGELOG is [here](https://github.com/fgrehm/devstep/releases/tag/v0.2.0)
and on this post I'll cover some exciting new stuff I was able to get in place.

## Docker image updates

Starting with the base image updates, the 0.2.0 release dropped from `1.168GB` down to `867.7MB` MB
representing a `~25%` reduction on disk usage. This is a big win for those who live short on disk space
like me and you can expect it to shrink even more on upcoming releases. If you are interested on
updates about that, keep an eye on [GH-62](https://github.com/fgrehm/devstep/issues/62).

Another change I made was related to the image we use as a starting point for Devstep's base image. Prior to
this release we were basing the `fgrehm/devstep` image from `progrium/cedarish` and [Heroku's Cedar script](https://github.com/heroku/stack-images/blob/master/bin/cedar.sh),
on 0.2.0 I switched it to `progrium/cedarish:cedar14` which not only helped to reduce the disk usage but
also got us closer to [Heroku's next `cedar-14` stack](https://blog.heroku.com/archives/2014/8/19/cedar-14-public-beta)
(big win if you are deploying apps to Heroku).

## Heroku rubies

On the previous releases I chose to leverage [rvm](https://rvm.io/) to install rubies but on
0.2.0 we'll now use the exact same Ruby installation that you'll get on Heroku. If you are
deploying your apps there, this is as close as you might get to [production parity](http://12factor.net/dev-prod-parity)
when it comes to the Ruby version used in prod.

We are not using the default Heroku buildpack to set things up yet but Devstep's custom Ruby buildpack
has been updated to download and install rubies from the same source as the default buildpack. I did
try my best to adapt the default buildpack for usage with Devstep but it ended up becoming a huge mess
of monkey patches.

## New Golang CLI

The new Golang CLI is a big one. Not because it is the first "non-trivial" Golang I wrote but
because of the new features it brings to the table.

### YAML configs

Support for configuration files is something that is not new to the CLI, with the Bash version
of it we were able to specify configurations on project's `.devsteprc` (or globally from `$HOME/.devsteprc`)
in the form of environmental variables. Those files would be bash `source`d on every `devstep`
command run.

Starting with this initial release of the new CLI we now have a proper configuration file
with a well defined format. For example, this is the global settings I have in place on my `$HOME/devstep.yml`:

{{< highlight yaml >}}
cache_dir: '{{env "HOME"}}/devstep/cache'
volumes:
  - '{% raw %}{{env "HOME"}}{% endraw %}/.netrc:/.devstep/.netrc'
  - '{% raw %}{{env "HOME"}}{% endraw %}/.gem/credentials:/.devstep/.gem/credentials'
  - '{% raw %}{{env "HOME"}}{% endraw %}/.gitconfig:/.devstep/.gitconfig'
  - '{% raw %}{{env "HOME"}}{% endraw %}/.ssh:/.devstep/.ssh'
  - '{% raw %}{{env "SSH_AUTH_SOCK"}}{% endraw %}:/tmp/ssh-auth-sock'
environment:
  SSH_AUTH_SOCK: "/tmp/ssh-auth-sock"
{{< /highlight >}}

What that does is make sure devstep cached packages persist between computer restarts and that
I have a `devstep hack` experience inside the container as if I was working from my machine.
Meaning I can `ssh` / `git pull` / `git commit` / `gem push` / `heroku run` from within
containers if I want / need to.

As for a project specific config, here's a real world example from a Rails app I worked on recently:

{{< highlight yaml >}}
# Link containers with existing postgres / redis instances (not managed by devstep)
links:
- "postgres:db"
- "redis:redis"

# Custom commands section that can be run with `devstep run -- CMD`
commands:
  server:
    cmd: ["rails", "server"]
    publish: ["3000:3000"]
  # No custom options, used only for generating binstubs
  # (more on that below)
  guard:
    # intentionally left blank
  rake:
    # intentionally left blank
{{< /highlight >}}

### Aliases and binstubs

As you might have noticed on the example above, custom devstep commands can be specified on
configuration files. Those commands will be made available from `devstep run -- CMD` and they
will get the Docker options you specify on `devstep.yml`s.

Aliases can save you a few keystrokes (like omitting `-p 3000:3000` with the `server` command
above) but its true power comes in combination with some custom binstubs. By appending an
`export PATH=".devstep/bin:${PATH}"` to our `$BASH/.bashrc`, we can even ommit the
`devstep run` prefix when running custom commands. It's pretty cool to run just `rake spec`
on Ruby projects from my laptop and let devstep take care of the rest without the need to
`devstep hack` first in order to get into a shell with project's dependencies in place :)

### Experimental plugins support

Last but not least, the new CLI leverages the [otto](https://github.com/robertkrimen/otto)
project and comes with an experimental support for JavaScript plugins that can be used to
hook into the CLI runtime to modify its configuration at specific points
during commands execution. With that I was able to write a [pretty cool plugin](https://github.com/fgrehm/devstep-squid3-ssl)
that does some magic to configure devstep containers with a Squid3 caching proxy that has
SSL enabled and will cache both `http://` and `https://` requests, reducing the overall
dependencies installation time even more.

Plugins are be installed to `$HOME/devstep/plugins/<PLUGIN_NAME>/plugin.js`
on the machine that is executing `devstep` commands and the only requirement is
that a plugin folder should have a `plugin.js` file.

The current functionality is very rudimentary and is likely to be changed so right
now it is best explained by the [squid3-ssl proxy](https://github.com/fgrehm/devstep-squid3-ssl)
plugin source which is currently the only plugin available:

{{< highlight js >}}
// `_currentPluginPath` is the host path where the JavaScript file is located
// and is provided by Devstep's CLI plugin runtime, we keep its value on a
// separate variable because its value gets changed for each plugin that
// gets loaded.
squidRoot = _currentPluginPath;

// squidShared is the path were squid will keep both downloaded files on the host
// machine and also the generated self signed certificate so that Devstep
// containers can trust.
squidShared = squidRoot + "/shared";

// Hook into the `configLoaded` event that gets triggered right after configuration
// files are loaded (eg: `$HOME/devstep.yml` and `CURRENT_DIR/devstep.yml`)
devstep.on('configLoaded', function(config) {
  config
    // Link CLI created containers with the squid container
    .addLink('squid3:squid3.dev')
    // Share the certificate file with Devstep containers
    .addVolume(squidShared + '/certs/squid3.dev.crt:/usr/share/ca-certificates/squid3.dev.crt')
    .setEnv('HTTPS_PROXY_CERT', 'squid3.dev.crt');
    // Inject the script that will trust the squid container certificate
    .addVolume(squidRoot + '/proxy.sh:/etc/my_init.d/proxy.sh')

    // Sets environmental variables so that programs make use of the cache
    .setEnv('http_proxy', 'http://squid3.dev:3128')
    .setEnv('https_proxy', 'http://squid3.dev:3128')
});
{{< /highlight >}}

The code above is the equivalent of passing in `-e`, `-v` and `--link` parameters
to `devstep` commands.

> The current functionality provided by the plugin runtime is pretty rudimentary
so if you have ideas for other plugins that you think would be useful, feel free to
reach out on the [CLI issue tracker](https://github.com/fgrehm/devstep-cli/issues/new)
or on [Gitter](https://gitter.im/fgrehm/devstep) so that it can be further discussed
as it will likely involve changes on the CLI itself.

## That's it

For now those are the cool new stuff I've got around, stay tunned for more :)
