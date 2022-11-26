---
date: "2013-09-18"
title: Brought to you by jekyll
description: 'Some information on migrating from middleman to jekyll'
tags:
- ruby
- middleman
- jekyll
draft: true
---

If you came across this blog before you have probably noticed that the layout has
changed a lot. This is thanks to [Michael Rose](http://mademistakes.com/about.html)
and his awesome <a href="http://mademistakes.com/">Minimal Mistakes</a>
theme for [jekyll](http://jekyllrb.com/) that recently replaced the "old school"
[octopress](http://octopress.org/) theme I had in place.

I had looked at jekyll and other static site generators when I first started writing
this blog but decided to stick to [middleman](http://middlemanapp.com/)
because it [comes](http://middlemanapp.com/asset-pipeline/) with [sprockets](https://github.com/sstephenson/sprockets)
and [Tilt](https://github.com/rtomayko/tilt) support out of the box,
allowing me to use things like [CoffeeScript](http://coffeescript.org/), [Slim](http://slim-lang.com/)
and [SASS](http://sass-lang.com/) pretty easily _in case I wanted_. That sounds
great for Ruby on Rails developers but I have to admit that after almost 9 months
since the initial "heavy lifting" and the traditional _"Hello World"_ post, I
haven't wrote a single line of CoffeeScript nor SASS neither have I changed the
initial Slim code :P

While looking around for simpler alternatives I came across [Michael Rose](http://mademistakes.com/about.html)'s
themes and decided to give jekyll another try. Jekyll [is behind GitHub pages](http://pages.github.com/) and I've been hearing
good things about it since the [1.0.0](http://jekyllrb.com/news/2013/05/05/jekyll-1-0-0-released/)
release. The migration was pretty straightforward and I thought I would write
down just enought information on how did the process go in case someone is
interested on doing the same or on writing a [migrator](http://jekyllrb.com/docs/migrations/)
for it.


## Migrating posts

Like jekyll, [middleman-blog](https://github.com/middleman/middleman-blog) supports
the [Markdown](http://daringfireball.net/projects/markdown/) + [YAML Frontmatter](http://jekyllrb.com/docs/frontmatter/)
combo so migrating the posts to jekyll is as simple as moving files around. If you
happen to be using [middleman-blog-drafts](https://github.com/fgrehm/middleman-blog-drafts),
just move your drafts folder contents over to `_drafts` on the jekyll project and pass
in `--drafts` to the `jekyll serve` command when you want to preview them in your
browser.

After moving things around you'll probably have to adjust posts' YAML data so that
things are rendered properly. In my case I had to add a `layout: post` to all posts
and rename the `summary` attribute I was using to `description` in order to properly
render [meta description](http://en.wikipedia.org/wiki/Meta_element#The_description_attribute)
tags using the new template. The reason why I chose to not change the original theme
to make it use the old attribute is that I might have less trouble when pulling in
changes from the original GitHub [repo](https://github.com/mmistakes/minimal-mistakes/).

One thing you really need to pay attention to are your permalinks. The theme I used
[comes with](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L50)
`/:categories/:title` configured by default and I was already using the `/:categories/:year/:month/:day/:title/`
format. If you don't want to "lose" those old links pointing to your site, make sure
you have that config set up properly as you've had before or use your "[mod_rewrite](http://httpd.apache.org/docs/current/mod/mod_rewrite.html)-fu"
to redirect users to the new URL.


## Running locally

Different from [middleman](http://middlemanapp.com/getting-started/#toc_9), jekyll
[does not](http://jekyllrb.com/docs/configuration/#build_command_options) rebuild
your posts by default in case you change them and you have to pass in `--watch`
to it. Because the theme I'm using is built using [LESS](http://lesscss.org/)
and [Grunt](http://gruntjs.com/), I have also to fire up another `grunt watch`
process in order to preview the CSS / JS changes I make.

Another difference I found was that jekyll does not support [build specific](https://github.com/middleman/middleman/blob/a3e030e8468fb96c2f7a2f83fc80d9059a002314/middleman-core/lib/middleman-core/templates/shared/config.tt#L69-L85)
configs out of the box. In order to work around that, I used a separate development
YAML file that overrides the default configs using the `-c` flag. For more
information about this and some other tips, check out Ken Collins' awesome
[blog post](http://metaskills.net/2013/09/02/jekyll-tips-and-tricks/#toc_1).

Because I'd definitely forget about all the params used to fire things up and to
make things easier for my brain, I wrote a simple `Procfile` for usage with [foreman](https://github.com/ddollar/foreman)
so that I can just `cd` to the blog's folder and run `foreman start` to start
writing. If you like the idea, go ahead and adapt the code below:

{{< highlight ruby >}}
jekyll: bundle exec jekyll serve -w --verbose -c _config.yml,_config.yml.dev --drafts
grunt: grunt watch
{{< /highlight >}}


## Deployment

This was also an easy one to change. I was using [middleman-deploy](https://github.com/tvaughan/middleman-deploy)
+ `rsync` before and already had the web server properly configured, so I ended
up writing some pretty simple [Rake](http://rake.rubyforge.org/) tasks to automate
the process:

{{< highlight ruby >}}
desc 'Build the site using Jekyll + Grunt'
task :build do
  sh 'grunt'
  sh 'jekyll build --lsi --verbose'
end

desc 'Deploy to production'
task :deploy => :build do
  sh "rsync -avze 'ssh -p PORT' --delete _site/ SERVER_URL:REMOTE_PATH"
end
{{< /highlight >}}


## So you are saying that jekyll is better than middleman?

No, just use whatever fits your needs, middleman was awesome to bootstrap this
blog but it has too many features for my needs :)
