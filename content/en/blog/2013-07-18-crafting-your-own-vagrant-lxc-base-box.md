---
date: "2013-07-18"
title: Crafting your own vagrant-lxc base box
description: 'How to build your own vagrant-lxc base boxes'
tags:
- vagrant
- vagrant-lxc
- lxc
- linux containers
---

As I [said before](/blog/2013/06/10/improving-vagrant-lxc-boxes/), "next generation"
[vagrant-lxc](https://github.com/fgrehm/vagrant-lxc) boxes should simplify the process
of "promoting" existing containers to base boxes. To back that up I've wrote
a detailed step-by-step for creating an Ubuntu Precise and Debian Squeeze base boxes
from an Ubuntu Host and I'm pretty sure it is possible to reuse the ideas from this
post to build base boxes for / from other distros that suits everyone's needs.

I've followed the steps on an Ubuntu 12.10 VirtualBox VM and if you want to follow
along you might want to grab yourself a copy of the same [Vagrantfile](https://gist.github.com/fgrehm/b07c6370a710be622807#file-ubuntu-host-rb)
I used and fire it up with `vagrant up --provider=virtualbox`. I'm also assuming
that you'll follow each step within the same shell session as we'll be reusing
some variables between steps.

_If you want a "copy & paste version" of this post check this [gist](https://gist.github.com/fgrehm/6034400)
out_

## Bootstrapping the guest container rootfs

The first thing we'll do is create the base container with `lxc-create` with
[vanilla templates](https://github.com/lxc/lxc/tree/staging/templates), for
Ubuntu guests that means:

{{< highlight bash >}}
RELEASE=precise
ARCH=amd64
sudo lxc-create -n ${RELEASE}-base -t ubuntu -- --release ${RELEASE} --arch ${ARCH}
{{< /highlight >}}

And for Debian guests:

{{< highlight bash >}}
SUITE=squeeze
RELEASE=$SUITE
sudo lxc-create -n ${RELEASE}-base -t debian
{{< /highlight >}}

_Before you ask, I decided to set both a `SUITE` and a `RELEASE` variables because
the debian template [expects](https://github.com/lxc/lxc/blob/staging/templates/lxc-debian.in#L23)
a `SUITE` env var to specify the release version and we'll be referencing it
by just `$RELEASE` on the rest of the post to make things easier :)_

If you want to know more about the parameters a template accepts, try running
`lxc-create -t <template-name> -- --help` or look into the scripts at `/usr/share/lxc/templates`.

To finish up this initial setup, some aditional steps are required to make sure
the Debian containers will get to play well with Vagrant / vagrant-lxc:

{{< highlight bash >}}
rootfs="/var/lib/lxc/${RELEASE}-base/rootfs"

# This fixes some networking issues
# See https://github.com/fgrehm/vagrant-lxc/issues/91 for more info
sudo sed -i -e "s/\(127.0.0.1\s\+localhost\)/\1\n127.0.1.1\t${RELEASE}-base\n/g" ${rootfs}/etc/hosts

# This ensures that `/tmp` does not get cleared on halt
# See https://github.com/fgrehm/vagrant-lxc/issues/68 for more info
sudo chroot $rootfs /usr/sbin/update-rc.d -f checkroot-bootclean.sh remove
sudo chroot $rootfs /usr/sbin/update-rc.d -f mountall-bootclean.sh remove
sudo chroot $rootfs /usr/sbin/update-rc.d -f mountnfs-bootclean.sh remove
{{< /highlight >}}


## Configure the vagrant user

The Ubuntu template [creates](https://github.com/lxc/lxc/blob/staging/templates/lxc-ubuntu.in#L79-L80)
an `ubuntu` user by default and we'll just rename it to `vagrant` in order to
avoid the need to specify [Vagrant's](http://docs.vagrantup.com/v2/vagrantfile/ssh_settings.html)
`config.default.username` on our Vagrantfiles:

{{< highlight bash >}}
ROOTFS=/var/lib/lxc/${RELEASE}-base/rootfs
sudo chroot ${ROOTFS} usermod -l vagrant -d /home/vagrant ubuntu
{{< /highlight >}}

The Debian template does not create any user so we'll just add it with `adduser`:

{{< highlight bash >}}
ROOTFS=/var/lib/lxc/${RELEASE}-base/rootfs
sudo chroot ${ROOTFS} useradd --create-home -s /bin/bash vagrant
{{< /highlight >}}

At this point it is a good idea to set `vagrant` as the password too since most
boxes I've used had this set up like that. The following applies to both Debian
and Ubuntu guests:

{{< highlight bash >}}
echo -n 'vagrant:vagrant' | sudo chroot ${ROOTFS} chpasswd
{{< /highlight >}}

### Set up SSH access and passwordless `sudo`

The steps above ensures the `vagrant` user exists, but we still need to set up
SSH access by allowing connections using the [default Vagrant SSH key](https://github.com/mitchellh/vagrant/blob/master/keys/vagrant.pub)
and also [enable passwordless `sudo`](http://docs-v1.vagrantup.com/v1/docs/base_boxes.html)
for things to work properly.

Before we get to that, make sure that `sudo` is installed on Debian guests and
that the `vagrant` user belongs to the `sudo` group by running:

{{< highlight bash >}}
sudo chroot ${ROOTFS} apt-get install sudo -y --force-yes
sudo chroot ${ROOTFS} adduser vagrant sudo
{{< /highlight >}}

If everything went fine, you should now be able to run the commands
below to set up SSH access and enable passwordless `sudo`:

{{< highlight bash >}}
# Configure SSH access
sudo mkdir -p ${ROOTFS}/home/vagrant/.ssh
sudo wget https://raw.github.com/mitchellh/vagrant/master/keys/vagrant.pub -O ${ROOTFS}/home/vagrant/.ssh/authorized_keys
sudo chroot ${ROOTFS} chown -R vagrant:vagrant /home/vagrant/.ssh

# Enable passwordless sudo for users under the "sudo" group
sudo cp ${ROOTFS}/etc/sudoers{,.orig}
sudo sed -i -e \
      's/%sudo\s\+ALL=(ALL\(:ALL\)\?)\s\+ALL/%sudo ALL=NOPASSWD:ALL/g' \
      ${ROOTFS}/etc/sudoers
{{< /highlight >}}

This is basically enough for us to [export the container's rootfs and prepare
the vagrant-lxc box](#build_box_package) but the container is pretty <s>dumb</s> rough
and we can do some work to make it a better place :)

## Add YourStuff™ to the base container

After the guest container has been created, bring it up with
`sudo lxc-start -n ${RELEASE}-base` and log in using `vagrant` as both the user
and password, once you are logged into the container you can do whatever you
want with it. Below you'll find some things that I found useful when building
the current vagrant-lxc boxes.

_Please note that all of the code below is meant to be run from inside the container_

### Avoid certificate warnings when installing packages on Debian guests

If you try to install some package on the container you'll notice that a warning
shows up saying that the packages cannot be authenticated. In order to make it go
away you'll need to install the `ca-certificates` package and run a `apt-get update`:

{{< highlight bash >}}
sudo apt-get install -y --force-yes ca-certificates
sudo apt-get update
{{< /highlight >}}

### Add some basic packages

Make your container a better place and install some "must-have" packages:

{{< highlight bash >}}
PACKAGES=(vim curl wget manpages bash-completion)
sudo apt-get install ${PACKAGES[*]} -y --force-yes
{{< /highlight >}}

### Install Chef

If you want to have [Chef](http://www.opscode.com/chef/) pre installed on the
base box, you can run:

{{< highlight bash >}}
curl -L https://www.opscode.com/chef/install.sh -k | sudo bash
{{< /highlight >}}

### Install Puppet

If you want to have [Puppet](https://puppetlabs.com/) pre installed on the base
box, you can run:

{{< highlight bash >}}
wget http://apt.puppetlabs.com/puppetlabs-release-stable.deb -O "/tmp/puppetlabs-release-stable.deb"
dpkg -i "/tmp/puppetlabs-release-stable.deb"
sudo apt-get update
sudo apt-get install puppet -y --force-yes
{{< /highlight >}}

### Free up some disk space

When you are done configuring the container, make sure you run the code below from
within the container to reduce the rootfs / box size:

{{< highlight bash >}}
sudo rm -rf /tmp/*
sudo apt-get clean
{{< /highlight >}}


## Build box package

After configuring the container, shut it down by running `sudo halt` and follow
the steps below from the host to build the `.box` file:

{{< highlight bash >}}
# Set up a working dir
mkdir -p /tmp/vagrant-lxc-${RELEASE}

# Compress container's rootfs
cd /var/lib/lxc/${RELEASE}-base
sudo tar --numeric-owner -czf /tmp/vagrant-lxc-${RELEASE}/rootfs.tar.gz ./rootfs/*

# Prepare package contents
cd /tmp/vagrant-lxc-${RELEASE}
sudo chown $USER:`id -gn` rootfs.tar.gz
wget https://raw.github.com/fgrehm/vagrant-lxc/master/boxes/common/lxc-template
wget https://raw.github.com/fgrehm/vagrant-lxc/master/boxes/common/lxc.conf
wget https://raw.github.com/fgrehm/vagrant-lxc/master/boxes/common/metadata.json
chmod +x lxc-template

# Vagrant box!
tar -czf vagrant-lxc-${RELEASE}.box ./*
{{< /highlight >}}


## Try it out

To make sure you are able to use the container with vagrant-lxc, try importing
the base box and bring it up with:

{{< highlight bash >}}
mkdir -p /tmp/test-import && cd /tmp/test-import
vagrant init my-box /tmp/vagrant-lxc-${RELEASE}/vagrant-lxc-${RELEASE}.box
vagrant up --provider=lxc
{{< /highlight >}}

If everything went fine, you should be able to SSH into it with `vagrant ssh`
without issues.

When you are done with the base container, make sure you destroy it using
`sudo lxc-destroy -n ${RELEASE}-base` to free up some disc space.


## Coming up

Over the following weeks I'll be going through the process of using this approach
to build the "official" Ubuntu base boxes instead of some hand made [Rake task](https://github.com/fgrehm/vagrant-lxc/blob/master/tasks)
and [bash scripts](https://github.com/fgrehm/vagrant-lxc/tree/master/boxes). One of
the good things about following this approach is that because the built-in Ubuntu
template keeps a [rootfs cache](https://github.com/lxc/lxc/blob/staging/templates/lxc-ubuntu.in#L340-L345)
around, which means that the base container creation time gets a lot lower and
I'm able to iterate over new base boxes a lot faster. After this is proven to work,
I'll try to get my head around [Go](http://golang.org/) and will look into adding
support for building lxc root file systems for [Packer](http://www.packer.io/).

That's it! I hope this opens up for others to fill in [the Wiki](https://github.com/fgrehm/vagrant-lxc/wiki/Base-boxes)
with instructions for building other distros and [http://www.vagrantbox.es/](http://www.vagrantbox.es/)
with pre built boxes :)
