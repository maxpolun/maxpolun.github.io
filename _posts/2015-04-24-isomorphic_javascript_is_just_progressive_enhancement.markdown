---
layout: post
title: Isomorphic Javascript is just Progressive Enhancement done right
date: 2015-04-24 15:45:03
category: javascript
---

I was just at [Fluent](http://fluentconf.com/javascript-html-2015) this week, and I had an interesting thought,
spurred by several things, but really crystalized when I saw
[this talk by Eric Meyer](https://www.youtube.com/watch?v=r38al1w-h4k&index=10&list=PL055Epbe6d5ZqIHE7NA5f6Iq_bZNjuWvS).

So, the (perhaps badly named) [concept of Isomorphic Javascript](http://isomorphic.net/) is usually sold as a performance optimization for
loading time in single-page applications, which is one benefit it provides. However it actually fixes the problem
with single-page apps -- they break the web. A single-page app that does not render on the server (isn't isomorphic) doesn't just degrade
[when javascript doesn't work](http://kryogenix.org/code/browser/everyonehasjs.html), it's totally broken. Like, blank page. This is a problem on any page, but practically, it's biggest on the open web (not behind a login). Closed sites (and especially enterprise sites/apps) can usually get away with doing various odd things, even though they probably shouldn't. Things like web spiders, users on crappy mobile connections, users behind odd firewalls, these usually matter more on the open web. (Accessibility is also easier when rendering on the server, but can be made to work with javascript-only sites)

The thing is, older jquery-based progressivly enhanced sites had a number of problems:

1. You either had to have double the rendering code, or have your page look and work dramatically different without javascript
2. You might have a page that was technically usable, but in practice terrible without JS -- datepickers are the most common thing I can think of. In a typical jquery-type date-picker progressive enhancement situation, there's a text input with a particular format you need to use, which is much mor epainful to use than a datepicker.
3. As you move more logic into the client, maintenence and code orginization becomes a problem that traditional tools like jquery plugins just can't solve.

The first-attempt solution to these issues was with the various first-gen javascript app frameworks. Angular 1, Backbone, Ember 1, etc. These frameworks were developed with the closed web in mind -- enterprise apps, or at least ones that needed a login. I'm not sure the creators of those frameworks envisioned things like blogs using these frameworks, and indeed, it has caused problems when they do. They were tightly coupled to the actual DOM, so though [they could be made to prerender the page with enough work](https://github.com/tmpvar/jsdom), it wasn't easy. [Various](https://www.meteor.com/) [frameworks](http://derbyjs.com/) attempted to make rendering on the client and server equally easy, but it wasn't really until [React](https://facebook.github.io/react/) came out that the idea went mainstream. Now all of the next-gen frameworks (including Angular 2 and Ember 2) will be much easier to render isomorphically.

Which brings me to my point: Isomorphic javascript is just progressive enhancement done right. You always serve up a usable page, but you can do it without sacrificing all the benefits of single-page apps. Of all the ways to do progressive enhancement, it's the most:

1. Accurate -- the markup will be the same because it's rendered by the same code
2. Maintainable -- one codebase, one rendering path
3. Quickly rendering -- we can use all the tricks of traditional html rendering sites to get the page to render fast
4. Quickly updating -- user input is captured instantly and processed by javascript when available.

Isomorphic javascript can actually do things that are usually infeasible to do in typical progressive enhancement as well -- it can render the page with your open modal or datepicker in it on the server, and have it work exactly like when javascript is working. None of this comes *for free* -- testing and hard work is still needed -- but things become feasible that weren't before.
