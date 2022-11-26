---
date: "2013-01-22"
title: Announcing letter_opener_web 1.0
slug: 'announcing-letter_opener_web-1-0'
description: 'An inbox for Ruby on Rails ActionMailer on your browser'
tags:
- ruby
- rails
- letter_opener_web
- vagrant
---


![letter_opener_web UI](ui.png#c)

One of the things I missed the most after going [100% on Vagrant](/blog/2013-01-17-100-percent-on-vagrant)
was the ability to preview Rails apps sent mails on my browser. I got used to the
awesome [letter_opener](https://github.com/ryanb/letter_opener) gem which depends
on [launchy](https://github.com/copiousfreetime/launchy) to fire up a new browser
window with the email preview instead of sending. As `launchy` on its own wouldn't
be able to open up a browser window on the host machine from the guest box, I started
to look around for alternatives and wasn't able to find something else that worked
for me.

To work around `launchy`, I first thought of overwriting the executable on the guest
machine as I did with [notify-send](https://github.com/fgrehm/vagrant-notify)
but I then realized that `letter_opener`
[does not use the executable](https://github.com/ryanb/letter_opener/blob/master/lib/letter_opener/delivery_method.rb#L15)
and this approach wouldn't work. That was when I eventually came across
[this pull request](https://github.com/ryanb/letter_opener/pull/12) and went through
with the idea of creating a Rails Engine to provide a web interface to browse
sent mails and [letter_opener_web](https://github.com/fgrehm/letter_opener_web)
was born.

After almost 3 weeks, ~46 commits and testing on 3 different projects, today I was
able to release an RC for what I believe should be a 1.0 version. I'm keeping it
as a RC until I have the chance to try it out on a couple more projects.

Since the gem has been downloaded ~390 times as of now I'm also waiting for some
feedback. If you have any, feel free to drop a comment here or [report an issue](
https://github.com/fgrehm/letter_opener_web/issues) on GitHub.

**UPDATE** (06 FEB 2013): I finally had the chance to try it out on another project
and ended up [fixing a bug](https://github.com/fgrehm/letter_opener_web/commit/e51b3c4ea9b6880ae24b3f7df1ca91ba38830f20)
that was present since its early stages. I've released the final version and added
a [demo app](https://github.com/fgrehm/letter_opener_web#try-it-out) using
[tiny-rails](https://github.com/fgrehm/tiny-rails) in case you want to try it out.
