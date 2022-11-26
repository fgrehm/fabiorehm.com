---
date: "2013-11-12"
title: Set the default Vagrant provider from your Vagrantfile
description: 'Just in case you need to do that'
tags:
- vagrant
- ruby
---

There are times that you might need / want to use a specific provider for your
Vagrant boxes that differs from VirtualBox or whatever provider you have set on
your [`VAGRANT_DEFAULT_PROVIDER` environmental variable](http://docs.vagrantup.com/v2/providers/default.html).

For experienced Ruby users this might seem something trivial to do but since
Vagrant's community is made of people from many different programming languages
background, I thought it would be nice to share this little trick I find useful
when I need to make sure the VMs goes up with the right provider.

I personally have [my `VAGRANT_DEFAULT_PROVIDER` set to `lxc`](https://github.com/fgrehm/dotfiles/blob/master/bash/exports#L7)
by default but there are times that I really don't want to use Vagrant with lxc.
For instance, when someone opens up a bug report on GitHub what I usually do in case
I'm not able to reproduce on my laptop is to bring up one of the Vagrant VirtualBox
VMs available at [vagrant-lxc-vbox-hosts](https://github.com/fgrehm/vagrant-lxc-vbox-hosts)
from scratch and run vagrant-lxc from there as an attempt to reproduce the issue on
a clean and shared working environment that can be booted on any VirtualBox / Vagrant
supported OS (this helps **a lot** if you are not sitting next to the user that
reported the bug ;)

Because I have forgotten to pass in `--provider=virtualbox` _way too many times_
and because other users might have `VAGRANT_DEFAULT_PROVIDER` set to something else
(like `digitalocean` or `aws`) I ended up adding the line below to the project's
[Vagrantfile](https://github.com/fgrehm/vagrant-lxc-vbox-hosts/blob/master/Vagrantfile#L6):

{{< highlight ruby >}}
ENV['VAGRANT_DEFAULT_PROVIDER'] = 'virtualbox'
{{< /highlight >}}

With that in place I can guarantee that anyone that tries to bring one of those
VMs up (myself included) will end up using VirtualBox unless explicitly specified.


## UPDATE: This is wrong!

Vagrant 1.7+ has a smart mechanism to handle default providers, please see the
`Default Provider` section of the documentation at: https://docs.vagrantup.com/v2/providers/basic_usage.html
for more
