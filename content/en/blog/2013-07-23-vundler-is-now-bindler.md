---
date: "2013-07-23"
title: 'Vundler is now Bindler!'
description: 'Quick update about Vundler (Vagrant plugin)'
tags:
- vagrant
- vundler
- bundler
- bindler
---

Quick update about [Vundler](/blog/2013/07/15/vundler-dead-easy-plugin-management-for-vagrant):
lots of people got confused about the plugin name because of [Vim's Vundle](https://github.com/gmarik/vundle)
so we decided to rename it to _Bindler_. The name was originally [proposed](https://github.com/mitchellh/vagrant/issues/1789#issuecomment-21018873)
by [Patrick Connolly](https://github.com/patcon) and after seeing the pictures
[he pointed out](https://www.google.ca/search?q=bindle&tbm=isch) (just forget
about the first row ;) I thought that it'd fit nicely with a vagrant :)

Please note that you'll need to [uninstall and revert](https://github.com/fgrehm/bindler#notice)
Vundler's installation before upgrading to Bindler. Vundler wasn't even `0.1.0`
and is still highly experimental so I decided not to worry about keeping it
backwards compatible.

So who's up for creating our logo? ;)

**UPDATE** (26 AUG 2014): Since Vagrant 1.5 came out with a [tight integration](https://github.com/mitchellh/vagrant/pull/2769)
with Bundler, Bindler is no longer being maintained as it would basically
require a rewrite of the plugin. The functionality provided by the plugin is
not yet provided by Vagrant itself but it is likely to be on some future release.
