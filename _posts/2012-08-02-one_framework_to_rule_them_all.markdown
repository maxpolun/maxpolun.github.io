---
layout: post
title: One framework to rule them all: Are Meteor and Derby the future of web frameworks?
date: 2012-08-02  9:29:46
category: nodejs
---

[Meteor](http://meteor.com/) and [Derby](http://derbyjs.com/) are next-gen javascript web frameworks. The main thing they bring is writing the same code on the server and the client -- they render the page server-side first and then update it client-side using the same code and templates. This is pretty awesome, even if they're still quiete immature. It's hard to argue with the performance and DRY-ness of the approach used in these frameworks, however is this what we'll be using for everything in 5 years?

The short answer is probably not. However, I'd imagine that these will have the same effect rails had way back when it first came out: hybrid frameworks will become a mainstream choice with a large number of different options, like there are for MV* frameworks you see now. Remember that there are still people doing vanilla php development. There are a few reasons why you wouldn't want to use one of these of frameworks

* Legacy: This is by far the biggest issue: these frameworks don't really play well with having any legacy technology, so they're only good for new projects. As of right now you can't even use a legacy datastore with one of these app frameworks (only Mongo for both), though I'm sure that will change in time.

* Control: So you're working on a new project, should you use one of these frameworks? Well, if you need to do something that doesn't match the model of these frameworks then you'll probably want to bypass them and use more traditional types of frameworks.

* APIs: Someone might come up with a solution to this in the future, but as of right now, it looks like it would be hard to share much code with an api. You can't use the built-in data passing these frameworks provide because the client and server are much too coupled in these types of frameworks (the coupling is not normally too much of an issue, because it's transparent to the developer). 

* Languages: If you prefer another language over javascript (or coffeescript), then these types of frameworks will probably be inaccessible. Google wrote a Java->Javascript compiler for [GWT](https://developers.google.com/web-toolkit/), but even that has a lot of downsides vs. using native javascript on the client. I will predict that compiling to javascript will become even more popular than it is now, and some frameworks for server web programming will be ported, I doubt these will be mainstream. It will be mostly javascript (and coffeescript which has the advantage of playing very nicely with javascript).

There are lots of advantages though:

* Speed: Launch fast by using server-side rendering, and update quickly on the client side

* DRY: The same code is used on the client and server (baring sensitive things that only run server-side: authentication and the like), cutting down duplication a lot.

* Live updates: These frameworks build-in updates to each client when the data changes (and in Derby the code as well), with little extra work needed. This makes a chat app nearly trivial.

* Offline mode: This is in Derby now and probably will be in Meteor soon: all data changes can be cached on the client when a data connection is lost and sent when the connection is restored. conflicts can be resolved in a variety of ways.

What *will* probably happen is currently popular client-side frameworks will become much less popular. Why use rails+backbone (or django+angular or whatever your favorite combination is) if you can just use Meteor or Derby? Server-side programming is probably safe for the most part, but if you want a "single page app" (I hate that term) as opposed to a more traditional webapp I suspect people will end up using these hybrid frameworks. Right now the niche for Meteor and Derby is probably highly interactive and collaberative webapps that have complex UIs and data models that need high performance. I'm excited to see what happens with these frameworks, and I'll probably be using one of these on my next personal project.

