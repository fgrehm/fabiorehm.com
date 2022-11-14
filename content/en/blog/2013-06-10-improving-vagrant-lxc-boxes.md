---
date: "2013-06-10"
title: Improving vagrant-lxc boxes
description: 'Updates about V3 vagrant-lxc base boxes'
tags:
- vagrant
- vagrant-lxc
- lxc
- linux containers
---
So I've played with [Docker](http://www.docker.io/) once again and have been
looking around its codebase to find out how things work over there. Even though
I've never wrote a single line of [Go](http://golang.org/), it gave me some
interesting insights about LXC itself and about packing up containers which
influenced heavily the "[next generation](https://github.com/fgrehm/vagrant-lxc/issues/89)"
vagrant-lxc base boxes and the upcoming work I have in mind for the provider.

Starting with V3 boxes, vagrant-lxc will introduce a better approach for
building base boxes and will also simplify the process of "promoting" existing
containers to base vagrant boxes. While it won't introduce breaking changes,
V3 boxes should be pushing more work into the base box preparation allowing
us to eventually have "generic" creation scripts + lxc configs built into
vagrant-lxc itself.

I haven't tried yet but at least in theory you could set up the `vagrant` user on
an existing container, compress its rootfs and combine it with the [new lxc
template script](https://github.com/fgrehm/vagrant-lxc/pull/89/files#diff-1),
[config file](https://github.com/fgrehm/vagrant-lxc/pull/89/files#diff-2) and
[metadata.json](https://github.com/fgrehm/vagrant-lxc/pull/89/files#diff-3)
files to build a box. Eventually there will only be the need to have just the
rootfs tarball and the metadata.json files, but for now I'd rather to not go
in that direction until I'm 100% sure that this approach will work fine.

Because there is [less work](https://github.com/fgrehm/vagrant-lxc/blob/83377bf8a4b0e5d2aa53dd6c8ce6abd111bc0426/boxes/common/lxc-template)
involved on creating new containers than it [used to be](https://github.com/fgrehm/vagrant-lxc/blob/5eb15d86676bc0587b7ce80c1e29e69ebebaf9c7/boxes/debian/lxc-template),
as you can see from the [Asciicast](http://ascii.io/) below I was able to cut
down around `47%` / `~9sec` of the time taken to bring a vagrant-lxc container
up from scratch.

<div class="asciicast-container">
  <script type="text/javascript" src="https://asciinema.org/a/3490.js" id="asciicast-3490" async></script>
  <p>
    As a side note, I got to know <a href="https://asciinema.org/">asciinema.org/</a> since
    the <a href="/blog/2013/04/28/lxc-provider-for-vagrant/">last video</a> I
    recorded and I'm pretty impressed by how easy it is to record a terminal
    session with it. You might want to check it out ;)
  </p>
</div>

I've already rebuilt all of the current 6 boxes we've got and I'm doing some
testing around them to see if things are working fine before release.

Ubuntu 13.10 comes with **9** different lxc templates apart from Ubuntu itself
and Debian. I really hope this encourages people to contribute new boxes back
to the project. As with [Vagrant itself](https://github.com/mitchellh/vagrant/wiki/Available-Vagrant-Boxes)
I don't have plans to "officially" support boxes other than Ubuntu ones on the
short term. Feel free to ping me in case you have trouble building them.

_**UPDATE:** If you want to know more about building your own box have a look
at this [other post](/blog/2013/07/18/crafting-your-own-vagrant-lxc-base-box/)_
