---
date: "2013-07-15"
title: 'Vundler: Dead easy plugin management for Vagrant'
description: 'Avoid Vagrant plugins Dependency Hell with Vundler'
tags:
- vagrant
- bundler
- vundler
- vagrant plugins
---

**UPDATE** (23 JUL 2013): Vundler has been [renamed](/blog/2013/07/23/vundler-is-now-bindler)
to Bindler!

Vagrant's plugin "ecossystem" just keep growing and recently there has been a
lot of interest on having an easy way for managing project's specific plugin
dependencies to avoid [Dependency Hell](http://en.wikipedia.org/wiki/Dependency_hell)
and / or to reduce the amount of steps someone has to take when joining an
ongoing project. There are at least 4 issues on Vagrant's issue tracker ([#1874](https://github.com/mitchellh/vagrant/issues/1874),
[#1789](https://github.com/mitchellh/vagrant/issues/1789), [#1700](https://github.com/mitchellh/vagrant/issues/1700)
and [#1574](https://github.com/mitchellh/vagrant/issues/1574))
and one [initiative](https://github.com/tknerr/vagrant-plugin-bundler)
by [@tknerr](https://github.com/tknerr) to solve the problem.

As I said on [this comment](https://github.com/mitchellh/vagrant/issues/1874#issuecomment-20137913)
and later clarified on this [other one](https://github.com/mitchellh/vagrant/issues/1874#issuecomment-20146703):

> TBH I don't think this belongs on vagrant core itself. An analogy would be
> having this logic from inside Ruby on Rails instead of relying on Bundler,
> which IMHO does not make sense. Rails just provides the foundation for others
> to build plugins and relies on Bundler to get things in place and load plugins' code.

> I really believe we need some sort of Bundler for Vagrant as there are
> plugins being created almost every month. I just don't think it belongs on
> Vagrant's core.

So I knew that it was something doable but I also knew that it would require some
good knowledge of RubyGems and Vagrant's internals. I've been brewing the idea on
my head for a while and I had a vague idea of how it could be implemented. Last
week I had some free time and decided to timebox my take on the problem. The result
of 2 hours worth of work is a new plugin called [Vundler](https://github.com/fgrehm/vundler),
a _"soon-to-be [Bundler](http://bundler.io/v1.3/rationale.html) for Vagrant"_.

It basically adds a new `vagrant plugin bundle` command that reads from a project
specific `plugins.json` [file](https://github.com/fgrehm/vundler#usage) and *[bends](https://github.com/fgrehm/vundler/blob/master/lib/vundler/bend_vagrant.rb)*
Vagrant to do its job with a handful of monkey patches.

Have a look at the asciicast to see it in action:

<div class="asciicast-container">
  <script type="text/javascript" src="https://asciinema.org/a/4193.js" id="asciicast-4193" async></script>
</div>

## How does it work?

First we need to ensure Vundler is the one and only third party plugin that Vagrant
will load automatically and then do our magic. If other plugins are loaded before
Vundler, there is a huge chance that conflicts will happen as you might have
a globally installed version of a plugin that is different from the version a
project needs.

The simplest thing that could possibly work (and that I can think of right now)
is to trick Vagrant's plugin loading mechanism to only load Vundler and to benefit
from Vagrant's configuration loading order. That is accomplished by making sure
our `$HOME/.vagrant.d/plugins.json` have only Vundler listed as a plugin and
by having an explicit `require "vundler"` on our `$HOME/.vagrant.d/Vagrantfile`.
Because of the way vagrant works, that `Vagrantfile` will be loaded prior to
any project defined one and we'd be good to go.

This initial setup is handled by `vagrant vundler setup` that should be invoked right
after the plugin gets installed. The command will move the other plugins defined
on the system wide `plugins.json` file to `$HOME/.vagrant.d/global-plugins.json`
and will add the explicit `require` to the system wide `Vagrantfile`.

Once things are properly set up, you should be able to add a `plugins.json` file
like the one below to your project and just run `vagrant plugin bundle` to install
the required dependencies:

{{< highlight json >}}
[
  "vagrant-lxc",
  {"vagrant-cachier": "0.2.0"}
]
{{< /highlight >}}

And that's it! Vundler will even be little bit smart and will only install the plugins
that you haven't installed yet ;)


## Declaring plugins on a JSON file outside of a Vagranfile

I wanted to make things transparent to those that don't have an urge to use Vundler
(like myself) and also to avoid having to write a parser for this "Vundlerfile". Also
because JSON is bundled with Ruby 1.9.3+ (shipped with Vagrant) and this approach is
more aligned with Vagrant's core that uses a JSON file to keep track of installed plugins.
If by any remote chance this kind of stuff gets into Vagrant's core, this is how I
believe it will look like.

This is actually one of the reasons why I decided to start from scratch and chose not
to fork @tknerr's awesome [vagrant-plugin-bundler](https://github.com/tknerr/vagrant-plugin-bundler)
or follow other users' syntax proposed on Vagrant's issue tracker.


## Project specific gems / plugins sandbox

With the plugins manifest format defined, I was able to [find my way](https://github.com/fgrehm/vundler/blob/master/lib/vundler/plugin_command/bundle.rb)
to install project specific plugins without issues but a problem showed up because
of system wide plugins installation.

On its current state Vagrant [prunes](https://github.com/mitchellh/vagrant/blob/master/plugins/commands/plugin/action/prune_gems.rb)
gems [after a plugin](https://github.com/mitchellh/vagrant/blob/master/plugins/commands/plugin/action.rb#L12-L13)
have been installed / uninstalled and that would mean that users would be required
to install dependencies again when switching projects. I'm pretty sure Mitchell
have a good reason to do that prunning so I decided to not to change this behavior.

When you run a `vagrant plugin bundle`, Vundler will configure RubyGems to install
missing plugins to a local `.vagrant/gems` folder. When you run other vagrant commands,
Vundler will ensure that the local plugins sandbox takes precedence over the system
wide gems home and you'll be able to use system wide plugins along with project specific
ones.


## What's with all that [monkey patching](https://github.com/fgrehm/vundler/blob/master/lib/vundler/bend_vagrant.rb)?

Well, you know... I timeboxed the development to 2 hours only, that means I had to take
some shortcuts ;) I did my best to document the patches I had to make and I'm willing
to look into a way of better accomodating this kind of plugin from within Vagrant's
core.


## It's just a start

Vundler is not as powerful as his older brother [Bundler](http://bundler.io) and there
are a few things that are currently not supported:

* There is no way to [specify a custom RubyGems source](http://bundler.io/v1.3/man/gemfile.5.html#SOURCES-source-)
* There is no such thing as a [lock file](http://stackoverflow.com/a/7518215)
* It is not possible to use [plugins from GitHub](http://bundler.io/v1.3/man/gemfile.5.html#GIT-git-)
* It does not attempt to solve conflicts. As an example, if two plugins have different
  gem dependency requirements, Vundler won't be able to solve conflicts and things might
  start acting weird.

I'm pretty sure we can leverage Bundler itself to have those features in place and I'll
have a look at Bundler's codebase once I have the need for those "advanced" features.
To be really honest I personally haven't had the need for a tool like Vundler (yet) as
I'm currently the only Vagrant user on my project at work and my "plugin stack" is
basically:

* [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier)
* [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)
* [vagrant-notify](https://github.com/fgrehm/vagrant-notify)
* [vagrant-pristine](https://github.com/fgrehm/vagrant-pristine)
* [vagrant-vbox-snapshot](https://github.com/dergachev/vagrant-vbox-snapshot)

<p>
  If you look into the <code>.gemspec</code> of each plugin you'll notice that none of them have a
  dependency other than Vagrant itself, so I haven't been bitten by Dependency Hell (yet).
  <s>But I'm willing to push the plugin development further as I do see myself using it
  on the future.</s>
<p>

<p>
  <s>
    I'll be more than happy to look into pull requests and discuss future directions for the
    plugin. I'm also planning to use the <a href="http://felixge.de/2013/03/11/the-pull-request-hack.html">Pull Request Hack</a>
    as I did with <a href="https://github.com/fgrehm/vagrant-cachier/issues/10">vagrant-cachier</a>
    since I'm not gonna be able to do this alone ;)
  </s>
</p>

<p>
  <b>UPDATE</b> (26 AUG 2014): Since Vagrant 1.5 came out with a <a href="https://github.com/mitchellh/vagrant/pull/2769">tight integration</a>
  with Bundler, Bindler is no longer being maintained as it would basically
  require a rewrite of the plugin. The functionality provided by the plugin is
  not yet provided by Vagrant itself but it is likely to be on some future release.
</p>
