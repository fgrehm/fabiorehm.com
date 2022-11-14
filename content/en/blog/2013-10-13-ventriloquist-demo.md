---
date: "2013-10-13"
title: Ventriloquist demo
description: 'From zero to Discourse in a few lines of code'
tags:
- vagrant
- ventriloquist
- docker
- lxc
- discourse
---

A while ago I stumbled across [this benchmark](https://www.stackmachine.com/blog/web-development-on-a-vm-is-it-slower)
by Brandon Liu on [StackMachine](https://www.stackmachine.com)'s blog comparing
the numbers for performing some typical tasks on his physical machine and doing
the same thing using virtual machines.

The measurements [were made](https://www.stackmachine.com/blog/web-development-on-a-vm-is-it-slower#test_setup)
using [Discourse](https://github.com/discourse/discourse) and compared the numbers
of doing things on VirtualBox and VMware Fusion so I [got curious](https://twitter.com/fgrehm/status/359445585738211330)
to see how well [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc) shared folders
would perform. What I ended up finding is that it seems that Discourse provides a
base box that was configured [by hand](https://github.com/discourse/discourse/blob/master/docs/DEVELOPER-ADVANCED.md#building-your-own-vagrant-vm)
and the Chef cookbooks [used](https://github.com/discourse/discourse/blob/aca567b4d7b9a7a654e12a5de35bee7d9c36e881/Vagrantfile#L37-L48)
only deal with [some basic stuff](https://github.com/discourse/discourse/blob/aca567b4d7b9a7a654e12a5de35bee7d9c36e881/chef/cookbooks/discourse/recipes/default.rb)
and I'd have to either do things by hand or write some provisioning scripts on
my own.

That was actually one of the reasons that made me push [Ventriloquist](https://github.com/fgrehm/ventriloquist)
development forward on its "last miles" before open sourcing it (and it is the
reason why it is used as an example on the project's README BTW ;) While I could
contribute back a set of Chef cookbooks, I decided to set Discourse needs as my
target for deciding when to open source Ventriloquist.

If you want to see the Ventriloquist in action check out the following Asciicast
or read the step by step right below it.

<div class="asciicast-container">
  <script type="text/javascript" src="http://asciinema.org/a/5900.js" id="asciicast-5900" async="true" data-speed="2"></script>
</div>


## Try it out

First things first, so given you have Vagrant around, do a `vagrant plugin install ventriloquist`,
`git clone https://github.com/discourse/discourse.git` and replace the [Chef provisioner]()
code on the `Vagrantfile` with the code below:

{{< highlight ruby >}}
config.vm.provision :ventriloquist do |env|
  env.services  << %w( redis pg:9.1 mailcatcher )
  env.platforms << %w( nodejs ruby )
end
{{< /highlight >}}

You'll also need to change the base box used to an Ubuntu 13.04 machine, in my
case I've used [this](http://bit.ly/vagrant-lxc-raring64-2013-09-28-) vagrant-lxc
box, so the related Vagrant section looks like:

{{< highlight ruby >}}
config.vm.box = 'raring64'
config.vm.box_url = 'http://bit.ly/vagrant-lxc-raring64-2013-09-28-'
{{< /highlight >}}

At this point your `Vagrantfile` should look like [this one](https://gist.github.com/fgrehm/db49cf1207d062f6f8ce)
and you should be able to `vagrant up` the machine to watch Ventriloquist provisioning
take place. It will take a while to finish depending on your internet connection
so grab a coffee while it does its magic.

Once provisioning has finished, go ahead and `vagrant ssh` into the VM and run the
following commands to set things up:

{{< highlight bash >}}
cd /vagrant
./script/setup_dev
rake db:test:prepare
gem install foreman --no-ri --no-rdoc
cp .env.sample .env
echo -e "\nPORT=3000" >> .env
{{< /highlight >}}

To test that things are set up properly, run the specs with `rake spec`
and fire up a server with `foreman start`. If everything went fine, you
should see a green build and verify that Discourse is running by visiting http://localhost:4000
on your browser and signing up. To read the confirmation mail, please visit [MailCatcher]()'s
web interface at http://localhost:4080.

## Coming up

Since Ventriloquist can be used to set things up across multiple Vagrant providers,
I'll soon try to get the numbers comparing VirtualBox with [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)
and [vagrant-digitalocean](https://github.com/smdahlen/vagrant-digitalocean) to
see how it goes.

_**UPDATE** (26 AUG 2014): I've stepped down as a maintainer of the plugin, feel
free to [reach out in case you want to take over responsibility for the project](https://github.com/fgrehm/ventriloquist/issues/63)_
