---
date: "2013-10-15"
title: 'Getting to know BTRFS'
description: 'Or why lxc-clone will probably be the next "big thing" on vagrant-lxc'
tags:
- vagrant
- lxc
- btrfs
- copy on write
---

I've been playing a lot with [Docker](http://docker.io) recently and while learning
[more about it](http://docs.docker.io/en/latest/terms/layer/#layers) I came across
["Another Union File System"](http://aufs.sourceforge.net/aufs.html) (AUFS) + its
[Copy On Write](http://en.wikipedia.org/wiki/Copy-on-write) (COW) capabilities and have
been pretty impressed by it. In short, by using a COW + [union file system](http://en.wikipedia.org/wiki/Union_mount)
Docker makes things _really cheap_ when it comes to disk usage.

The idea of COW filesystems along with [a couple](https://github.com/dotcloud/docker/issues/443)
[GitHub issues](https://github.com/fgrehm/vagrant-lxc/issues/81), some tweets
exchanged with [@rcarmo](https://twitter.com/rcarmo) and [this post](http://s3hh.wordpress.com/2013/05/02/lxc-improved-clone-support/)
on improvements made on `lxc-clone` was enough to trigger my interest on [BTRFS](https://btrfs.wiki.kernel.org/index.php/Main_Page)
and I went out to learn more about it.

## What's with Copy on Write (aka COW)?

Some googling pointed me to [this comprehensive](http://faif.objectis.net/download-copy-on-write-based-file-systems)
thesis on Copy On Write Based File Systems by Sakis Kasampalis and while I havent
read the whole thesis yet, I found this pretty nice definition about COW on
page 19:

> COW generally follows a simple principle. As long as multiple programs need
> read only access to a data structure, providing them only pointers which
> point to the same data structure, instead of copying the whole structure to
> a new one, is enough.

If you've never heard of COW take the time to grasp those words and think about
applying that to a File System. If you can't get the big picture don't worry, just
keep reading :)

Going further, Kasampalis writes:

> If at least one of the programs needs at some point
> write access to the data structure, create a private copy for it. The same holds
> for each one of the programs which will need write access to the data structure.
> A new private copy will be created for them.

> Let's assume that we have an array data structure called "foo", and two programs
> called "Bob" and "Alice" which need to access it in read/write mode. If during the
> access, none of the programs tries to change the contents of "foo", both "Bob" and
> "Alice" will actually use exactly the same "foo" array. If at some point "Bob"
> changes the contents of "foo", a private copy of the changed data of "foo" will
> automatically be created by the COW system and provided to "Bob". Note
> that the unchanged data can still be shared between "Bob" and "Alice". This
> is a powerful feature of COW.

He also highlights the benefits of COW file systems on page 20:

> I believe that COW's major contributions to file systems are the support for (1)
> taking cheap snapshots, (2) ensuring both data and metadata consistency and
> integrity with acceptable performance.

As another COW example, we have [Ruby Enterprise Edition](http://www.rubyenterpriseedition.com/faq.html#what_is_this),
that shipped with a "_copy-on-write friendly garbage collector, capable of reducing
Ruby on Rails applications’ memory usage by 33% on average_" and had its EOL
anounced once a copy-on-write patch was checked into Ruby 2.0. For other use
cases please refer to [Wikipedia](http://en.wikipedia.org/wiki/Copy-on-write#Other_applications_of_copy-on-write).

## B-tree data structure

If you forgot about your data structure lessons, here's the definition from [Wikipedia](http://en.wikipedia.org/wiki/B-tree):

> In computer science, a B-tree is a tree data structure that keeps data sorted and
> allows searches, sequential access, insertions, and deletions in logarithmic time.
> The B-tree is a generalization of a binary search tree in that a node can have more
> than two children. (Comer 1979, p. 123) Unlike self-balancing binary search trees,
> the B-tree is optimized for systems that read and write large blocks of data.
> It is commonly used in databases and filesystems.

## B-tree file system (aka BTRFS)

From [Wikipedia](http://en.wikipedia.org/wiki/Btrfs) again:

> Btrfs \[...\] is a GPL-licensed experimental copy-on-write file system for Linux.
> \[...\] Btrfs is intended to address the lack of pooling, snapshots, checksums
> and integral multi-device spanning in Linux file systems, these features being
> crucial as Linux use scales upward into the larger storage configurations common
> in enterprise. Chris Mason, the principal Btrfs author, has stated that its goal
> was "to let Linux scale for the storage that will be available. Scaling is not
> just about addressing the storage but also means being able to administer and
> to manage it with a clean interface that lets people see what's being used and
> makes it more reliable."

Although it looks pretty exciting from outside when you play with it, there are
some things to keep in mind:

> It is still in heavy development and marked as unstable. Especially when the
> filesystem becomes full, no-space conditions arise which might make it
> challenging to delete files.

## Trying it out (aka "What it means for vagrant-lxc?")

Enough theory and copy and pasting! Because an [asciicast](http://asciinema.org/) is
worth more than a thousand words, check out the one below. I used the `quantal`
machine from [vagrant-lxc-vbox-hosts](https://github.com/fgrehm/vagrant-lxc-vbox-hosts)
to fire up a VBox machine ready to rock and recorded the asciicast from there.

<div class="asciicast-container">
  <script type="text/javascript" src="http://asciinema.org/a/5922.js" id="asciicast-5922" async="true"></script>
</div>

<p>
  You can find out more about and play with BTRFS by looking at
  <a href="http://www.funtoo.org/BTRFS_Fun">this entry</a> from
  <a href="http://www.funtoo.org/wiki/Welcome">Funtoo Linux</a> Wiki.
</p>

I hope I gave you enough reason to watch the asciicast with the information above
but if you ended up not watching it, I'd just like to let you know that I was able
to "break" one of the most basic Physics law that states that two things cannot occupy
the same space at the same time by using [`lxc-clone` and its snapshotting capabilities](https://help.ubuntu.com/lts/serverguide/lxc.html#lxc-cloning)
:P Thanks to BTRFS I was capable of fitting **22 GB** of data into just **405MB**!

So, can you guess what does that mean for vagrant-lxc? Basically even faster container
creation times (under 0.1 millisecond for `lxc-clone` + BTRFS snapshotting) and lower
disk usage. This also means that support for vagrant-lxc container [snapshots](https://github.com/fgrehm/vagrant-lxc/issues/32)
should be _easier_ to implement once the cloning functionality is in place.

## That's awesome! I want it now!

Well... Unfortunately I'm not sure when this is going to be easily supported from
vagrant-lxc, so for now you'll need to do things by hand. Please check the asciicast
in order to find out how to set things up and to "trick" vagrant-lxc into using your
cloned containers.

One thing that I know for sure is that we'll have to wait for Vagrant 1.4 because
of [this pull request](https://github.com/mitchellh/vagrant/pull/2327) which enables
us to [hook](https://github.com/mitchellh/vagrant/pull/2327/files#diff-5d84fa7a300da3b9958d69831795c066R49)
into Vagrant's process of removing base boxes. The reason behind that is that
we'll need to keep a "base container" around in order to create our lxc clones
from and without that we are not able to automatically delete the base
container rootfs in case the user removes a vagrant-lxc base box, leaving
unused containers behind.

On a side note, I've had some trouble using `lxc-clone` with vagrant-lxc containers
on both an Ubuntu 13.04 VBox VM and my own laptop so I had to switch back to a
12.10 VM in order to record the asciicast. I haven't had the chance to find out
what's going on yet [but it seems that I'm not the only one having trouble with it](http://s3hh.wordpress.com/2013/05/02/lxc-improved-clone-support/#comment-902).

To finish this up, I want to make clear that I've only done some initial experiments
with BTRFS and I have no idea how it behaves on the wild but I'll definitely look into
adding some experimental support for `lxc-clone` in a future vagrant-lxc version. I'm
not really sure how that will look like but on the spirit of eating my own dog food
I'll try to create a BTRFS partition on my physical HD soon as a start see how it goes :)
