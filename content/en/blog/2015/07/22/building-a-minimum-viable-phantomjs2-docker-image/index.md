---
date: "2015-07-22"
title: "Building a minimum viable PhantomJS 2 Docker image"
description: "How did I build and release the smallest PhantomJS image you'll see on the Docker Hub"
tags:
- docker
- dockerize
- phantomjs
---

As part of something I've been hacking on the side, I have a need to run a bunch of
[PhantomJS](http://phantomjs.org/) 2.0 containers on a Docker host. While I could've just
built an image that includes its binary and consider it done, there is currently [a need
to build the phantomjs binary from sources for Linux machines](https://github.com/ariya/phantomjs/issues/12948).
Not only that is a PITA but it also requires us to do some "juggling" to clean up build-time
dependencies and it still produces a somewhat large Docker image as a result (something in
the ~400mb).

After some initial research I could find [a Docker image](https://registry.hub.docker.com/u/rosenhouse/phantomjs2/)
that does that [heavy lifting](https://github.com/rosenhouse/phantomjs2/blob/1df72b25bc231693c3d059d71ec40cd6e27d6872/Dockerfile#L12-L38)
but I still wanted a smaller image as I have been bitten by the "minimalist docker images" bug
after coming across [this blog post](http://blog.oddbit.com/2015/02/05/creating-minimal-docker-images/)
and also getting to know [Alpine Linux](http://alpinelinux.org/).

## Compiling from sources under `gliderlabs/alpine` (failed)

My first attempt was to use the [gliderlabs/alpine](http://gliderlabs.viewdocs.io/docker-alpine/about)
image and build phantomjs from sources but unfortunately that didn't work. I'm not sure
what is the actual root cause for that but I had lots of weird compilation errors. I risk
saying it is because of [musl libc](http://gliderlabs.viewdocs.io/docker-alpine/about#user-content-musl-libc)
or the compiler available to Alpine Linux but I haven't had a chance to dig into it yet.
I even tried using Alpine's prebuilt QtWebKit packages (required by PhantomJS) but had no
luck as well.

## Using [dockerize](https://github.com/larsks/dockerize) to produce a minimalist image

After failing at compiling PhantomJS from sources, I decided to take a stab on using
[dockerize](https://github.com/larsks/dockerize) to produce the bare minimum required
to run the phantomjs CLI.

`dockerize` is a pretty cool tool for creating minimal Docker images from dynamically linked
[ELF binaries](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format). Its CLI has
many [different options](https://github.com/larsks/dockerize#synopsis) and the idea is that
you can run a simple `dockerize -t sed /bin/sed` and get a minimal image with everything
that is needed for `sed` to run [using `scratch` as the starting point](http://docs.docker.com/articles/baseimages/#creating-a-simple-base-image-using-scratch).

In order to make things simpler, I created [an environment](https://github.com/fgrehm/docker-phantomjs2/blob/master/Dockerfile.dockerize)
based off of [rosenhouse/phantomjs2](https://registry.hub.docker.com/u/rosenhouse/phantomjs2/)
with `dockerize` in place and started hacking away on top of it. After lots of experiments,
this is what I put together to produce the sources for a minimalist PhantomJS image:

{{< highlight sh >}}
# For the most up to date version of this, please check the link below:
#   https://github.com/fgrehm/docker-phantomjs2/blob/master/dockerize-phantomjs
dockerize -n -o dockerized-phantomjs \
          -e $(which phantomjs) \
          -a /bin/dash /bin/sh \
          -a /etc/fonts /etc  \
          -a /etc/ssl /etc  \
          --verbose \
          $(which phantomjs) \
          /usr/bin/curl
{{< /highlight >}}

Can't get any easier than that right?

But that actually took me a while to get it right. As you might imagine, things did not work
on my first interactions with `dockerize`. The tool itself works perfectly, but for reasons
that I haven't figured out yet the `phantomjs` CLI did not work properly on my new image
unless I also vendor `curl` related dependencies. Another thing that gave me trouble was
the fact that system fonts were not being included on the new image and screenshots produced
by `phantomjs` for some apps would come out with blank text blocks because of that.

My advice in case you decide to try out `dockerize` with some other executable is
to provision a container with the executable within a `docker run` and `docker diff CONTAINER_ID`
afterwards, looking for potential "suspects" that might be missing on your minimal
image.

## Publishing the image on Docker Hub

With everything running smooth locally, the next step was to set up an [Automated Build](http://docs.docker.com/docker-hub/builds/)
and get the image on the [hub](http://hub.docker.com/). There is just a small gotcha around
that: AFAIK there is no way we can docker inside `docker build` as it [does not support the `--privileged` flag](https://github.com/docker/docker/issues/1916)
that is [required to run nested docker instances](https://github.com/jpetazzo/dind#quickstart).

To work aroud that, I created a [GitHub release](https://github.com/fgrehm/docker-phantomjs2/releases)
on the project with a tarball of all dependencies that can be extracted under `/`.

Based on the [`Dockerfile` I used to build the image locally](https://github.com/fgrehm/docker-phantomjs2/blob/master/Dockerfile.localbuild#L3),
my initial `Dockerfile` looked like this:

{{< highlight dockerfile >}}
FROM scratch
ADD https://github.com/fgrehm/docker-phantomjs2/releases/download/v2.0.0-20150722/dockerized-phantomjs.tar.gz /
ENTRYPOINT ["/usr/local/bin/phantomjs"]
{{< /highlight >}}

But that did not work and the reason can be found in the [`ADD` instruction](http://docs.docker.com/reference/builder/#add)
docs:

> If `<src>` is a local tar archive in a recognized compression format (identity, gzip, bzip2 or xz) then it is unpacked as a directory. Resources from remote URLs are not decompressed. When a directory is copied or unpacked, it has the same behavior as `tar -x`, the result is the union of:
>
> 1.   Whatever existed at the destination path and
> 2.   The contents of the source tree, with conflicts resolved in favor of “2.” on a file-by-file basis.

I got tricked by the fact that local files `ADD`ed to an image are automagically extracted but
remote `ADD`ed files are not. Since the `scratch` image has an empty filesystem, my solution
to this was to keep things simple again and just switch to an Alpine Linux base image that
includes `tar` and `curl` so I can download the tarball from GitHub and extract it on top of
the image's `/` without relying on the `ADD` behavior:

{{< highlight dockerfile >}}
FROM gliderlabs/alpine:3.2
RUN apk-install curl \
    && curl -Ls https://github.com/fgrehm/docker-phantomjs2/releases/download/v2.0.0-20150722/dockerized-phantomjs.tar.gz \
       | tar xz -C /
ENTRYPOINT ["/usr/local/bin/phantomjs"]
{{< /highlight >}}

That's mostly because the phantomjs tarball has ~50Mb and I didn't want to include it on
source control, but if your executable is small, I'd recommend keeping it around and
sticking to the `FROM scratch` + `ADD tarball.tgz /` combo when possible.

## That's it

The image is already available on the Docker Hub as `fgrehm/phantomjs2` so feel free to
give it a try.

Some of you might question the security out of using my image as it involves extracting a
remote tarball on top of `/`. If you are one of those feel free to build the image yourself,
its as easy as a `git clone` and a `make build.local`. If you want to go hardcore and / or
have the time to spend building phantomjs from sources, you can `make phantomjs.build build.local` :)

So far things have been working fine for the examples provided by the [phantomjs project itself](https://github.com/ariya/phantomjs/tree/master/examples)
and some other hacks I put together, but please [let me know](https://github.com/fgrehm/docker-phantomjs2/issues/new)
in case you have any trouble!
