---
layout: post
title: What rails could learn from pyramid
date: 2012-06-22 10:30:16
category: webdev
---
I like to look at new web frameworks every once in a while. I've used and enjoyed rails, I've used django, I've used bottle, but it's hard to find a new one that I like. Too many have weird ideas of what webdev should be like. [Pyramid](http://www.pylonsproject.org/) has some odd ideas, but it also has some really good ideas.

First some terminology: in pyramid you have Models (using whatever sort of ORM you want, usually sqlalchemy), Views (which are similar to rails controllers), Renderers (similar to rails views), and configuration (which is used for a variety of things, but mainly routing).

Here's what I think is valuable in pyramid:

* Easy to test views: The views (again, corresponding roughly to rails controllers) are very easy to test, they're just functions (or methods, or callable objects of any sort) that take a request object and return a response. Actually, in the common case that you don't need to set any special headers or anything, you can just return a dict. In rails, most people I'm aaware of don't bother with unit tests of controllers and just do integration tests. That at least in part because you're mutating a controller object rather than just returning a simple dict. It's not impossible, but having a good TDD workflow is all about making testing easy. And then when you return the dict, you set the renderer that gets called via an annotation. So you would have code that looks like this:
~~~~
{% highlight python %}
# in views.py:
@view_config(route_name='myroute' renderer='templates/myroute.jinja2')
def myroute(request):
	return {"hello": request.matchdict["name"]}
#in tests.py
class MyRouteTest(unittest.TestCase):
	def test_name(self):
		request = testing.DummyRequest()
		request.matchdict['name'] = 'Test'
		response = myroute(request)
		self.assertEqual(response['name'], 'Test')
{% endhighlight %}
~~~~

* flexible routing: routing can be done in two ways for pyramid projects, regex matching (like rails does it), and traversal of an object graph. traversal of the object graph lets you do things like give people nested folders easily, without having special routing logic. I also like how the regex matching routing works, but that's a toss-up if it's actually better.

* A component system: this is kind of cool, but you can access assets of other packages by using a name like mypackage:templates/template.jinja2 This seems simpler to me than having to run a rake task to initialize and import all assets when you're adding some third-party component like you do in rails. I know when using spree I have wished a few times that I could access some of the default project assets without having to copy the whole views/ folder into my project.

* Scaling up and scaling down: This is one of the main hooks the pyramid devs like yo talk about, it's easy to set up a single-file pyramid project, but it also scales up better than most microframeworks. It's pretty rare to see a "medium-sized" framework like this. You can use it for simple projects with confidance that it'll be ok when things become more complex.

Some things are really judgement calls, rails is very convention based: you don't have to tell it what view to call, it inferrs that from the name of your controller method. Pyramid is much more configuration based, which is more pythonic, but maybe not better (or worse, just different). I prefer configuration when it's simple (like in pyramid), but it can get out of control. 

