---
date: "2013-11-12"
title: 'Meet Viewdocs'
description: 'Put those long and boring READMEs on a diet with this awesome new project'
tags:
- oss
- github
- documentation
- golang
---

Last week [@progrium](https://twitter.com/progrium) striked again with one more
great example of how we should strive for keeping things simple. Five months after
releasing [Dokku](http://progrium.com/blog/2013/06/19/dokku-the-smallest-paas-implementation-youve-ever-seen)
which is a [Docker](http://www.docker.io/) powered mini-[Heroku](https://www.heroku.com/)
written in around **100 lines of Bash**, he has just open sourced [viewdocs](http://viewdocs.io/):

<blockquote class="twitter-tweet"><p>Easy, elegant project documentation in Markdown using Viewdocs -- Read the Docs meets Gist.io <a href="https://t.co/FIDrwPLgKc">https://t.co/FIDrwPLgKc</a></p>&mdash; Jeff Lindsay (@progrium) <a href="https://twitter.com/progrium/statuses/399734531592171520">November 11, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

As with Dokku, the project is pretty small and (as of this writing) converts
**~200 lines of Golang code** into a powerful tool for small to medium sized
open source projects hosted on GitHub. Viewdocs combines the _dynamics_ of
[Read the Docs](https://readthedocs.org/) and the _simplicity_ of
[Gist.io](http://gist.io/) by rendering [Markdown](http://daringfireball.net/projects/markdown/)
on the fly from your repository's `docs` directory as _simple static pages_.
It even supports custom layouts and rendering specific [git references](http://git-scm.com/book/en/Git-Internals-Git-References)
(like a tag, branch or a specific commit). How cool is that? :)

Seriously, the project is so simple that when Jeff opened up the code, it didn't
have support for rendering specific git revisions and even with [less than a month](https://github.com/fgrehm/go-tour/commit/13391f7c2cb19280b4cb273e50caa293db211ec7)
worth of Golang experience I was able to [implement the code to support that](https://github.com/progrium/viewdocs/pull/2).


## Why not [GitHub Pages](http://pages.github.com/) / *\<static site generator of choice>* / Wikis?

If you've never heard about [GitHub Pages](https://help.github.com/articles/what-are-github-pages),
they are "public webpages freely hosted and easily published through GitHub's site"
or with "plain old `git push`". It differs from Viewdocs as it serves _html files_
or _[jekyll sites](https://help.github.com/articles/using-jekyll-with-pages)_
available on the [`gh-pages`](https://help.github.com/articles/user-organization-and-project-pages#project-pages)
branch of your project and it comes with an [automatic page generator](https://help.github.com/articles/creating-pages-with-the-automatic-generator)
that takes in a `README.md` + Google Analytics tracking code and spits
out a HTML page with some [nice looking templates](https://github.com/blog/1081-instantly-beautiful-project-pages).

Although GH Pages have the automatic page generator, in my opinion they lack that
awesome "live documentation" feeling as it requires _human intervention_ in order
to be updated, either in the form of a few clicks on the automatic generator or a:

{{< highlight sh >}}
git checkout gh-pages
...hack & commit...
git push
git checkout master
{{< /highlight >}}

For bigger projects with lots of contributors, having a separate branch _and_
ensuring it is always up to date _might_ not be an issue but for smaller ones
(where there are one or two main devs) there's a huge chance they'll end up
forgetting to update the branch after a release. Apart from that, as [@patcon](https://github.com/patcon)
pointed out on this [vagrant-cachier issue](https://github.com/fgrehm/vagrant-cachier/issues/56#issuecomment-27989250),
it's harder to "enforce updated documentation as part of any Pull Request".

An alternative to make docs more dynamic, you can use project's Wiki so that
users can easily contribute back in case they think things can be improved. The
drawbacks of that are probably the same of using GitHub Pages as you are not only
on a separate branch but also on a different repository.

The cool thing about Viewdocs is that documentation _just get updated_ along
with the the rest of the project's sources right there from `master`. Because
it supports git references, you'll get _tagged documentation_ like
([ruby-doc](http://ruby-doc.org/gems/docs/v/vagrant-lxc-0.6.4/)) for free!
For example, if your project goes through some drastic 2.0 changes that makes
it incompatible with the previous 1.0 releases, you can just add a link to
`http://<user>.viewdocs.io/<project>~v1.0/` somewhere on the new docs so that
users can read the docs of the version they are using. Oh, and because it works
across forks, you can even preview Pull Requests changes by visiting
`http://<other user>.viewdocs.io/<your project>~<pr-branch>` from _anywhere_,
there's no need to get into your laptop to run some commands or fire up a server
in order to look at them.

Please don't get me wrong, GitHub Pages and Middleman are a great fit if you
are working on a static website of its own but IMHO Viewdocs is a better tool
for maintaining / hosting open source project's documentation (and it comes
with a  _high level of "hackability"_ built in ;)


## Viewdocs is a building block!

Would you imagine that we could have project's analytics with [a badge on project's
READMEs](https://bitdeli.com/)?

Imagine if you could drop in some JS into your custom layout that reads things
from some other service using AJAX and somehow enhances the static docs with
some additional behavior? I'm not sure what might come out of that but it looks
promising.

For now I'll just start by putting some [fat](https://github.com/fgrehm/vagrant-cachier/blob/master/README.md)
[READMEs](https://github.com/fgrehm/ventriloquist/blob/master/README.md) on a
diet :)
