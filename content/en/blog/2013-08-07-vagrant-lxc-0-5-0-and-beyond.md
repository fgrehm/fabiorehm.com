---
date: "2013-08-07"
title: vagrant-lxc 0.5.0 and beyond
slug: 'vagrant-lxc-0-5-0-and-beyond'
description: 'Find out more about the new version of the plugin and the upcoming work I have planned for it'
tags:
- vagrant-lxc
- vagrant
---
Last week I was able to release vagrant-lxc 0.5.0 and on this post you'll get to
know about some cool new stuff and the upcoming work I have in mind to reach what
I believe would be a nice 1.0.0 milestone.


## 0.5.0 goodies

This release it mostly related to the "user experience" of using the plugin. Apart
from some highlights you'll get to know below, there are a few small things that
makes people's lives a bit easier:

* Forwarded ports collision detection - the plugin no longer keeps silent about
  forwarding ports that are already in use by the host.
* The plugin now errors if required dependencies are not installed - no more
  silent errors or stacktraces if the `lxc` and / or `redir` packages are not installed.
* Support for `redir` [logging](https://github.com/fgrehm/vagrant-lxc/wiki/Troubleshooting)
  to syslog - [some people](https://github.com/fgrehm/vagrant-lxc/issues/51#issuecomment-19782247)
  got bitten by `redir` issues this so I thought it would be nice to have this
  in places

### Support for a `sudo` wrapper script, aka no more `sudo` passwords!

If you are using the plugin from within a VM on a Windows / Mac host you probably
haven't suffered from the pain of typing in your password quite a few times during the day while using
the plugin. While there are certainly smarter ways to work around that, I ended
up adding support for a wrapper / proxy script that allow us to add a single [passwordless sudo](http://askubuntu.com/a/159009)
entry on our `/etc/sudoers` for the plugin to use when `sudo` is required.

As stated on the [the README](https://github.com/fgrehm/vagrant-lxc#avoiding-sudo-passwords),
right now the script I'm using is **really dumb AND INSECURE** but it does the
trick. It's basically a ruby script that acts as a proxy for executing the commands:

{{< highlight ruby >}}
#!/usr/bin/env ruby
exec ARGV.join(' ')
{{< /highlight >}}

With that in place we can then add a single entry to our `/usr/bin/lxc-vagrant-wrapper`
like the one below:

{{< highlight bash >}}
USERNAME ALL=NOPASSWD:/usr/bin/lxc-vagrant-wrapper
{{< /highlight >}}

And tell vagrant-lxc to use it on our `Vagrantfile`s:

{{< highlight ruby >}}
# Protip: Drop this into your ~/.vagrant.d/Vagrantfile to apply the configuration to all vagrant-lxc VMs
Vagrant.configure("2") do |config|
  config.vm.provider :lxc do |lxc|
    lxc.sudo_wrapper = '/usr/bin/lxc-vagrant-wrapper'
  end
end
{{< /highlight >}}

That's it, no more typing in your password when using vagrant-lxc boxes :)

Since [user namespaces](https://wiki.ubuntu.com/UserNamespace) will be
supported at some point, I'm not willing to give much attention on improving
this for now and this is the reason I'm not bundling this with the plugin. Feel
free to submit a Pull Request in case you have a better idea of doing this,
I'll be more than happy to review it ;)

### "Promiscuous" port forwarding

On my [very first vagrant-lxc post](/blog/2013/04/28/lxc-provider-for-vagrant#usage_on_os_x__windows)
I showed an example of a `Vagrantfile` that could be used for setting up a VirtualBox
VM between Mac / Windows hosts and vagrant-lxc containers but because vagrant-lxc < 0.5.0
used to bind forwarded ports with `redir` only to `127.0.0.1` there was no easy way of
hitting the guest container directy from the host machine. Starting with 0.5.0 that set
up now works out of the box because the port forwarding will work for any of the
configured VBox IP.

{{< highlight ruby >}}
Vagrant.configure("2") do |config|
  config.vm.box = "quantal64"

  config.vm.define :vbox do |vb_config|
    # Exposes access to the container
    vb_config.vm.network :forwarded_port, guest: 8000, host: 8080
    vb_config.vm.network :forwarded_port, guest: 2221, host: 2000
  end

  config.vm.define :lxc do |lxc_config|
    # Exposes a web server and SSH access
    lxc_config.vm.network :forwarded_port, guest: 80, host: 8000
    lxc_config.vm.network :forwarded_port, guest: 22, host: 2221
  end
end
{{< /highlight >}}

So using a Vagrantfile similiar to the one above you should be able to SSH into
the `vbox` VM, bring up the `lxc` container and hit a web server running on the
container on port `80` through `http://localhost:8080` from your host or SSH
directly into the guest container from your host with `ssh vagrant@localhost -p 2000`.

### Improved customizations

Prior to 0.5.0 the provided [customizations](https://github.com/fgrehm/vagrant-lxc#advanced-configuration)
and shared folders bind mounts where passed in as `-s` parameters to `lxc-start`.
While that was working fine, it was a PITA to debug which of the configurations
were giving us a bad time because it made us look into Vagrant debug logs to find
out exactly which arguments were being passed in.

Starting with 0.5.0 those customizations are writen out to the container configuration
file (usualy kept under `/var/lib/lxc/<container>/config`) prior to bringing
it up with `lxc-start`.

A side effect of that is that in case the container is not able to boot, you can
start the container on the foreground with something like `lxc-start -n $(cat .vagrant/machines/<machine-name>/lxc/id)`
and replicate vagrant-lxc's behavior. With that you'll be able to find out more
information on why things are not working and you'll be able to tweak the Vagrantfile
/ lxc config file in order to track the issue down.

You can also benefit from this if you want to enable [LXC Upstart Jobs](https://help.ubuntu.com/lts/serverguide/lxc.html#lxc-upstart)
for your vagrant-lxc containers on a real server. Although the VM won't be provisioned
automatically and ports won't be forwarded like it normally would when using `vagrant up`,
shared folders should work just fine and you can easily set up some shared socket
for communication between the host and the guest container to avoid the need of using
forwarded ports.

### Demo

To better understand the new port forwarding, upstart and debugging capabilities
check out the Asciicasts below. To save you some wait time, I'll use the setup
described on [this gist](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc)
with the [VBox VM](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc#file-02-vagrantfile-rb-L5-L19)
already running and the inner [vagrant-lxc container](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc#file-02-vagrantfile-rb-L21-L36)
created. The VBox VM has [Nginx](http://wiki.nginx.org/Main)
installed and is [configured](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc#file-03-provision-vbox-sh-L11-L29)
to use proxy `/unicorn` requests to a Ruby [Rack](http://rack.github.io/)
"Hello world" [application](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc#file-04-provision-lxc-sh-L33-L37)
running behind an [Unicorn](https://github.com/defunkt/unicorn) Server
listening on an UNIX socket [shared](https://gist.github.com/fgrehm/8084ac5442e9cb2b93fc#file-02-vagrantfile-rb-L29)
between the VBox VM and vagrant-lxc container.

I've had some trouble recording the Asciicast in one go, so I had to split it
into 2 recordings:

<div class="asciicast-container">
  <script type="text/javascript" src="http://asciinema.org/a/4580.js" id="asciicast-4580" async></script>
  <p>
    Part I - Debugging and port forwarding
  </p>
</div>

<div class="asciicast-container">
  <script type="text/javascript" src="http://asciinema.org/a/4581.js" id="asciicast-4581" async></script>
  <p>
    Part II - vagrant-lxc container upstart and shared folders
  </p>
</div>

## How does vagrant-lxc 1.0 look like?

I've been asking myself that question for a while now and I think I have a good
list of things to accomplish to reach 1.0. I believe the plugin is pretty stable
at this point (at least for myself) and most of the pain points from the initial
releases have been sorted out (like `sudo`ing and forwarded ports collision detection)
so I _might_ slow down a bit and focus on other projects for a while.

Of course the list is subject to change but here's what I have in mind:

<ul>
  <li>
    First class networking support, allowing configuration for both
    <a href="https://github.com/fgrehm/vagrant-lxc/issues/119">public</a> and
    <a href="https://github.com/fgrehm/vagrant-lxc/issues/120">private</a> networks.
  </li>
  <li>
    Extract port forwarding with <code>redir</code> out to a
    <a href="https://github.com/fgrehm/vagrant-lxc/issues/101">separate plugin</a>.
  </li>
  <li>
    Write <a href="https://github.com/fgrehm/vagrant-lxc/issues?direction=desc&amp;labels=documentation&amp;page=1&amp;sort=updated">documentation</a>
    for using the plugin on at least 2 distros other than Ubuntu and Debian (and
    probably do some <a href="https://github.com/fgrehm/vagrant-lxc/issues/117#issuecomment-21866996">internal changes</a>
    along the way to make things smoother).
  </li>
  <li>
    Find ways of <a href="https://github.com/fgrehm/vagrant-lxc/issues/99">leveraging lxc-clone / BTRFS</a>.
  </li>
  <li>
    Add support for <a href="https://github.com/fgrehm/vagrant-lxc/issues/32">VirtualBox-like snapshots</a>
    and <a href="https://github.com/fgrehm/vagrant-lxc/issues/33">ephemeral containers</a>.
  </li>
</ul>

If you can think of something else or have any suggestion feel free to reach out ;)


_**UPDATE**: Please check out [this other post](/blog/2013/12/12/so-i-released-a-lot-of-vagrant-plugins-now-what-s-next)
to find out more about my latest plans regarding 1.0_
