---
date: "2013-10-01"
title: 'Sharing Chef Cookbooks'
description: 'My journey on setting things up to push chef-dokku to Opscode Community'
tags:
- chef
- cookbook
- dokku
- devops
---

I've been trying to publish my [Dokku](https://github.com/progrium/dokku) Cookbook
to [Opscode Community](http://www.opscode.com/community/) since I [open sourced it](https://github.com/fgrehm/chef-dokku)
a couple weeks ago but didn't have much success until last night. The initial
configuration was not so straightforward to me so I thought I'd write it down
in case I need to do it again. The information on this post is probably documented
somewhere but I failed to find it, feel free to comment with links to official docs
or other blog posts related :)

[chef-dokku](https://github.com/fgrehm/chef-dokku) is the result of my initial
interaction with [Chef](http://www.opscode.com/chef/) which I've been using as
part of another project which I plan to release "soon". It allows you to manage
a Dokku installation, allowing configuration of application's [environment variables](https://github.com/progrium/dokku#environment-setup)
and installation of [Dokku plugins](https://github.com/progrium/dokku/wiki/Plugins).

Since I come from a [Puppet](http://puppetlabs.com/puppet/what-is-puppet) background,
I had no idea what to do in order to publish the Cookbook to Opscode Community.
Thanks to [@juanjeojeda](https://twitter.com/juanjeojeda/status/376398727822340096)
I got to know the command used for publishing but sadly that wasn't enough to
make it work.

I've been using the plugin from within Vagrant machines only and didn't have the
[`knife`](http://docs.opscode.com/knife.html) command available on my laptop so
first thing I had to do was a `gem install chef` to get `knife` around. With Chef
installed, my first attempt was to run the command Juanje suggested from a clean
`git clone` but had no luck:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other
WARNING: No knife configuration file found
ERROR: Chef::Exceptions::CookbookNotFoundInRepo: Cannot find a cookbook named dokku;
did you forget to add metadata to a cookbook? (http://wiki.opscode.com/display/chef/Metadata)</pre>
</div>

It turns out that `knife` [doesn't like the chef-dokku folder name and you need to pass in some extra options](http://starkandwayne.com/articles/2013/05/07/tdd-your-devops-with-test-kitchen/#sharing_the_cookbook),
so I created a `chef-cookbooks` folder under my `~/projects` to keep Chef
cookbooks, moved `chef-dokku`'s code into `~/projects/chef-cookbooks/dokku` and
the error message changed:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other -o ../
WARNING: No knife configuration file found
ERROR: Your private key could not be loaded from /etc/chef/client.pem
Check your configuration file and ensure that your private key is readable</pre>
</div>

That error message led me to the `knife.rb` [docs](http://docs.opscode.com/config_rb_knife.html)
and I found out that I need to specify the `client_key` config on `~/.chef/knife.rb`
or on `.chef/knife.rb` under the project's root. I also found out that I could
save a few keystrokes and avoid the `-o` parameter by specifying the `cookbook_path`
option. As a result, I've added my client key to `~/.chef/client.pem` and created a
`~/.chef/knife.rb` file with:

{{< highlight ruby >}}
client_key "#{ENV['HOME']}/.chef/client.pem"
cookbook_path "#{ENV['HOME']}/projects/chef-cookbooks"
{{< /highlight >}}

With that in place I tried to share the Cookbook again without luck:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other
ERROR: Errno::EACCES: Permission denied - /var/chef</pre>
</div>

It turns out that knife / chef needs some folders in order to do its job. I
couldn't find a way to change the folder it uses so after some trial and error
I ended up creating the directories required with `sudo mkdir -p /var/chef/cache/checksums`,
`chown`ed it to my user with `sudo chown -R fabio: /var/chef` to avoid using
`sudo` and the error message changed again:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other
Generating metadata for dokku from /tmp/chef-dokku-build20131001-18021-ypq6jp/dokku/metadata.rb
Making tarball dokku.tgz
ERROR: Error uploading cookbook dokku to the Opscode Cookbook Site:
undefined method `strip' for nil:NilClass. Set log level to debug (-l debug) for more information.</pre>
</div>

I've tried to enable debug logging with `-l debug` as the error message suggests
but it didn't work. Looking at `knife -h` I found out that the proper way to enable
debugging is to provide `-VV` to the `knife` command and that gave me a pretty
stacktrace to look into:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other -VV
# ... lots of debugging statements ...
Making tarball dokku.tgz
DEBUG: Executing tar -czf dokku.tgz dokku
DEBUG: ---- Begin output of tar -czf dokku.tgz dokku ----
DEBUG: STDOUT:
DEBUG: STDERR:
DEBUG: ---- End output of tar -czf dokku.tgz dokku ----
DEBUG: Ran tar -czf dokku.tgz dokku returned 0
DEBUG: Signing: method: post, path: /api/v1/cookbooks, file: #< File:0x007f584a01ed08 >, User-id: , Timestamp: 2013-10-01T14:39:46Z
ERROR: Error uploading cookbook dokku to the Opscode Cookbook Site: undefined method `strip' for nil:NilClass. Set log level to debug (-l debug) for more information.
DEBUG:
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/2.0.0/net/http/header.rb:17:in `block in initialize_http_header'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/2.0.0/net/http/header.rb:15:in `each'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/2.0.0/net/http/header.rb:15:in `initialize_http_header'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/2.0.0/net/http/generic_request.rb:44:in `initialize'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/2.0.0/net/http/request.rb:14:in `initialize'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/cookbook_site_streaming_uploader.rb:137:in `new'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/cookbook_site_streaming_uploader.rb:137:in `make_request'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/cookbook_site_streaming_uploader.rb:67:in `post'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/knife/cookbook_site_share.rb:89:in `do_upload'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/knife/cookbook_site_share.rb:67:in `run'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/knife.rb:466:in `run_with_pretty_exceptions'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/knife.rb:173:in `run'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/lib/chef/application/knife.rb:123:in `run'
/home/fabio/.rbenv/versions/2.0.0-p247/lib/ruby/gems/2.0.0/gems/chef-11.6.0/bin/knife:25:in `< top (required)>'
/home/fabio/.rbenv/versions/2.0.0-p247/bin/knife:23:in load'
/home/fabio/.rbenv/versions/2.0.0-p247/bin/knife:23:in `< main>'
/home/fabio/.rbenv/versions/2.0.0-p247/bin/ruby_noexec_wrapper:14:in `eval'
/home/fabio/.rbenv/versions/2.0.0-p247/bin/ruby_noexec_wrapper:14:in `< main>'</pre>
</div>

Looking at that stacktrace I noticed that the `User-id` was missing and I went
off to Chef sources to find out where that should come from. Looking at [these lines](https://github.com/opscode/chef/blob/56a5ae1f9b7f7d5854c6532566995d1c8a276e6e/lib/chef/knife/cookbook_site_share.rb#L67)
I found out that that parameter comes from the `node_name` defined on our knife
configs and I added it my `~/.chef/knife.rb`:

{{< highlight ruby >}}
# Replace with your Opscode username
node_name "fgrehm"
{{< /highlight >}}

But that still wasn't enough and the error message changed one more time:

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other
knife cookbook site share dokku Other
Generating metadata for dokku from /tmp/chef-dokku-build20131001-3501-1srzrdt/dokku/metadata.rb
Making tarball dokku.tgz
ERROR: Error uploading cookbook dokku to the Opscode Cookbook Site:
wrong number of arguments (2 for 1). Set log level to debug (-l debug) for more information.</pre>
</div>

Some googling led me to [this issue](https://tickets.opscode.com/browse/CHEF-4456)
on Chef's issue tracker and I found out that I had to downgrade to Ruby 1.9 as I
was using 2.0.  After downgrading and installing Chef again I was finally able to
share the cookbook \o/

<div class="highlight">
  <pre>$ knife cookbook site share dokku Other
Generating metadata for dokku from /tmp/chef-dokku-build20131001-16730-1rlofvz/dokku/metadata.rb
Making tarball dokku.tgz
Upload complete!</pre>
</div>

Summing up, here's what you need to share your cookbook:

* Ruby 1.9
* Chef gem
* [An account at Opscode](https://getchef.opscode.com/signup?ref=community)
* Make sure the cookbooks are kept on a folder with the same name as the cookbook itself (ex: `chef-dokku` should be cloned to `dokku`)
* `~/.chef/knife.rb` or `./.chef/knife.rb` configured with:
  * `client_key`: you should have seen it while registering with Opscode, if you didn't save it get a new one at [https://www.opscode.com/account/password](https://www.opscode.com/account/password)
  * `node_name`: your Opscode username
  * `cookbook_path`: this is optional and will allow you to omit the `-o` parameter when sharing your cookbooks
