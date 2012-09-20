---
layout: post
title: How and why to do dependency injection in javascript
date: 2012-09-19 15:59:06
category: js
---

So on a recent episode of [nodeup](http://nodeup.com/), the topic came up where
they were talking about when you have to deal with an external API or something,
how do you test that efficiently? If you do the naive thing you'll end up with
tests that are fragile and take hours to run, because you're  calling out to the
API every time you run a test. So there are a couple of ways to deal with this
problem. You can on the one hand use something like
[nock](https://github.com/flatiron/nock) and have it intercept your http calls
and return something nice for testing without actually doing any http calls, or
you can use set up your code in a dependency injected style and then you run 90%
of your tests as true unit tests, not even needing to call out to the external
API, and you have 10% of your tests being integration tests that do real calls
out to APIs and external databases, etc. One of these styles is not really
better than the other (and in fact they are complementary), but doing dependency
injection is of general value for your codebase, so I'm going to talk about how
to do it in js.

The basic rule with dependency injection is that you never call 'new' (or the
equivalent in other languages) in your code that actually does work. You have
code that does stuff, and then you have glue that ties those parts together.
The glue is what allocates objects. The reason you don't call new in your code
is that doing this hard codes what you're going to do. Instead of calling new,
you take all of the objects you need as parameters either to a function, or to
your constructor for your object.

Let's make this a bit more practical. If you were going to call some random API, the code you would use might be like:


{% highlight js%}
// version 1, no DI
function getUserPosts(username, postId) {
	var request = http.request({
		'host': 'api.randomsite.com',
		'path': '/users/' + username + "/posts/" + postId
	},
	function(response) {
		response.on("data", function (chunk){
			analyzePost(chunk)
		})
	});
	request.end()
}
{% endhighlight %}


A traditional dependency injection style (which largely comes from java) might do the following:

{% highlight js%}
// version 2, java-style DI
function UserPostsGetter(requester, postAnalyzer) {
	this.requester = requester
}
UserPostsGetter.prototype.get = function() {
	requester.request(function(response){
		response.on("data", function(chunk){
			postAnalyzer.analyze(chunk)
		})
	})
}

// in your main file:
function getUserPosts(username, postId){
	var requester = new Requester({
		'host': 'api.randomsite.com',
		'path': '/users/' + username + "/posts/" + postId
	})
	var postAnalyzer = new PostAnalyzer()
	var postGetter = new UserPostGetter(requester, postAnalyzer)
	postGetter.get()
}
{% endhighlight %}


However that's a bit heavyweight for javascript. The main thing you want to do
with dependency injection is to not hard code your dependencies. A more
functional style might be something like:


{% highlight js%}
// version 3, functional DI
function getUserPosts(username, postId, requestFactory, callback) {
	var request = requestFactory({
		'host': 'api.randomsite.com',
		'path': '/users/' + username + "/posts/" + postId
	},
	function(response) {
		response.on("data", function (chunk){
			callback(chunk)
		})
	});
	request.end()
}

// in your main file:
function getUserPostReal(username, postId) { // this isn't a very good name
	getUserPosts(username, postId, http.request, analyzePost)
}
{% endhighlight %}


So dependency injection adds some overhead, but the real benefit comes in testing. For version 1 above, you'd have to use nock or a similar tool to run tests without actually interacting with the service. For the others you might have to use mocks or fakes, but they can be very simple. For example a fake requestFactory for version 3 might be:


{% highlight js%}
function fakeRequestFactory(responseText) {
	return function(notUsed, callback){
		return {
			end: function() {callback(responseText)}
		}
	}
}
{% endhighlight %}

and the actual test would be something like:

{% highlight js%}
getUserPosts("testUser", "1", fakeRequestFactory("this is a test post"), function(responseText){
	assert.equal(responseText, "this is a test post")
})
{% endhighlight %}


So that's the basic idea behind dependency injection. In the Java world people
use a lot of very powerful DI frameworks (like
[Guice](http://code.google.com/p/google-guice/)) that automate a lot of the
generation of the glue between your components. Such a thing doesn't exist in
javascript, but it's a lot less needed because of the power of the language.
However anything other than version 1 above does add complexity and you need
to decide how much testing you're going to do (almost certainly not 100%), and
how much will be integration testing and how much will be unit testing before
you decide whether to use a dependency injected style or not. What I've
started to do is to have 2 parts to my code: one part that is basically pure
(it might store state during calculation, but it appears pure to the outside
world) and never tries to do IO even indirectly (so you don't need mocks).
Then I have a driver that's all IO. This means I can unit test most of my code
in total isolation, and I run integration tests for the driver. If you've ever
programmed in Haskell you'll see that this is similar to the way you work with
Monads.

Here are some talks on Dependency injection and testing:

* The Clean Code Talks - Don't Look For Things! [youtube](http://www.youtube.com/watch?feature=player_embedded&v=RlfLCWKxHJ0) [reddit](http://www.reddit.com/r/techlectures/comments/1064fp/the_clean_code_talks_dont_look_for_things_google/)
* Architecture the Lost Years [video](http://confreaks.com/videos/759-rubymidwest2011-keynote-architecture-the-lost-years) [reddit](http://www.reddit.com/r/techlectures/comments/pjq9i/architecture_the_lost_years_robert_martin_ruby/)