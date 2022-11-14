---
date: "2014-08-09"
title: "Get notified of long running CLI tasks completion with 'lmk'"
description: 'My very first Golang project'
tags:
- golang
- lmk
---

`lmk` is a simple [command line tool written in Go](https://github.com/fgrehm/lmk)
that I released last February. I wrote it to draw my attention to a terminal when
some long command finishes running.


## WTF?!?

Yeah, it may sound silly but how often do you run a command that you know that
takes a lot of time to complete, you go do something else and forget that the
command was running? Even worse, what about when you get side tracked for a bit
longer than you should and when you Alt+Tab to check if the command has finished
it actually errored along the way?

Those situations happen to me more than you might think. Throughout the day I
might run many `bundle install`s, `vagrant up`s, `rake spec`s, etc.. that takes
more than a few seconds to complete. Because looking at a black screen with a
blinking cursor and a whole lot of output is pretty boring, during that period I
usually Alt+Tab to check my emails or twitter and many times I get side tracked
before realizing that I should have been doing something else.


## How does it work?

Let's say you want to run the specs for that legacy project you have just been
assigned and the full run takes 5 minutes to complete. With `lmk` you can run
`lmk rake spec` and as soon as `rake spec` finishes running you'll see a `notify-send`
notification poping up on your desktop.

But that's not enough, what if you miss the notification while you are away from
the keyboard? Well, in that case `lmk` will keep letting you know that the
command finished every 30 seconds until you go back to the terminal session that
you left the command running and hit Enter.

For more information and installation instructions please check [the project's README](https://github.com/fgrehm/lmk#readme)
