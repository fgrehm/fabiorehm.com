---
date: "2014-09-11"
title: Running GUI apps with Docker
description: "I've been doing all of my real (paid) work on VMs / containers for a while now but when it comes to writing Java code..."
tags:
- docker
- x11
- firefox
- netbeans
- java
---

I've been doing all of my real (paid) work on VMs / containers for a while now but when it comes to writing Java code for some projects for university I still
need to move away from using vim and install some full blown IDE in order to be
productive. This has been bothering me for quite some time but this week I
was finally able put the pieces together to run NetBeans in a Docker container so that I can avoid
installing a lot of Java stuff on my machine that I don't use on a daily basis.

There are a few different options to run GUI applications inside a Docker
container like using [SSH with X11 forwarding](http://blog.docker.com/2013/07/docker-desktop-your-desktop-over-ssh-running-inside-of-a-docker-container/),
or [VNC](http://stackoverflow.com/a/16311264) but the simplest one that I
figured out was to share my X11 socket with the container and use it directly.

The idea is pretty simple and you can easily it give a try by running a Firefox
container using the following `Dockerfile` as a starting point:

{{< highlight dockerfile >}}
FROM ubuntu:14.04

RUN apt-get update && apt-get install -y firefox

# Replace 1000 with your user / group id
RUN export uid=1000 gid=1000 && \
    mkdir -p /home/developer && \
    echo "developer:x:${uid}:${gid}:Developer,,,:/home/developer:/bin/bash" >> /etc/passwd && \
    echo "developer:x:${uid}:" >> /etc/group && \
    echo "developer ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/developer && \
    chmod 0440 /etc/sudoers.d/developer && \
    chown ${uid}:${gid} -R /home/developer

USER developer
ENV HOME /home/developer
CMD /usr/bin/firefox
{{< /highlight >}}

`docker build -t firefox .` it and run the container with:

{{< highlight sh >}}
docker run -ti --rm \
       -e DISPLAY=$DISPLAY \
       -v /tmp/.X11-unix:/tmp/.X11-unix \
       firefox
{{< /highlight >}}

If all goes well you should see Firefox running from within a Docker container.

<figure class="center">
  <a href="/images/posts/2014-09-11/firefox-demo.gif"><img src="/images/posts/2014-09-11/firefox-demo.gif"></a>
</figure>

## Getting a NetBeans container up and running

Preparing a NetBeans base image was not that straightforward since we need to
install some additional dependencies (namely the `libxext-dev`, `libxrender-dev`
and `libxtst-dev` packages) in order to get it to connect to the X11 socket
properly. I also had trouble using OpenJDK and had to switch to Oracle's Java
for it to work.

After lots of trial and error, I was finally able to make it work and the result
is a base image available at the [Docker Hub](https://registry.hub.docker.com/u/fgrehm/netbeans/)
with sources on [GitHub](https://github.com/fgrehm/docker-netbeans).

Here's a quick demo of it in action:

<figure class="center">
  <a href="/images/posts/2014-09-11/firefox-demo.gif"><img src="/images/posts/2014-09-11/netbeans-demo.gif"></a>
</figure>

## Future work

Over the next few months I'll be working on a [Play!](https://www.playframework.com/)
app and will hopefully write a blog post on the workflow I used. Stay tunned for more :)

----------------------------------------

_PS: This approach of sharing the X11 socket also be applied to [vagrant-lxc](https://github.com/fgrehm/vagrant-lxc)
containers and I'll document that on the project's Wiki when I
have a chance._
