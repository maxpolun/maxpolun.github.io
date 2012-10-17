
---
layout: post
title: A javascript dependency injection framework in under 20 lines of code
date: 2012-10-16 20:41:12
category: js
---
So my [last post]({% 2012-09-19-how_and_why_to_do_dependency_injection_in_javascript %}) described why you might want to use dependency injection and how to do it by hand. That's all well and good, but there's a problem with doing dependency injection by hand -- it's a big pain in the ass. You have to wire up everything by yourself, you end up with tons of factories, it's just not not feasible once you get above a certain level of complexity. So a dependency injection framework is super useful, and it's also super easy to make a simple one.

If you look historically, the first dependency injection frameworks came from Java and [used XML](http://www.vogella.com/articles/SpringDependencyInjection/article.html#usagexml) (yuck) as configuration, but has mostly moved on to using things like `@Inject` annotations. Statically typed languages like Java have one advantage over dynamically typed ones like javascript, in that you know what type of thing to inject based on the static type. So a modern Java DI framework looks something like:

{% highlight java linenos %}
class Thing {
    Frobulator mFrob;
    AbstractBeanFactoryFactory mComplex
    public Thing(@Inject Frobulator frob,
                 @Inject AbstractBeanFactoryFactory complex) {
            mFrob = frob;
            mComplex = complex;
    }
}
{% endhighlight %}

You're already specifying what type of thing you need in the type signature, so you just have to tell the framework what parameters need to be injected. In javascript, you need to come up with some other method, and the one that's most obvious is to base it on names. So you'll ask for a `http` dependency, and the framework will find one for you. How do you specify what dependencies you need? [Angular](http://angularjs.org/) does some clever [magic](http://merrickchristensen.com/articles/javascript-dependency-injection.html) with converting functions to strings to figure out the names of their dependencies, but even they have several ways to specify explicitly what you need (mostly because of code minification).

So you'll end up with an api where you do something like the following to make a service that can be injected:

{% highlight js linenos%}
injector.service({
    name: "myservice",
    inject: ["filesystem", "http", "json"],
    factory: function(filesystem, http, json) {
        // do stuff with your dependencies
    }
})
{% endhighlight %}

And you get dependencies manually (which you ideally only need to do for your entrypoint) using a function like:

{% highlight js linenos%}
myservice = injector.injectDependencies("myservice")
{% endhighlight %}

It looks a lot like node modules, no? Several node DI frameworks use node modules as their basic level of abstraction, but I prefer to keep it at a smaller level than that. Anyways, this is simple to implement, I've made one in about an hour in under 20 lines of code, you can see it at [github](https://github.com/maxpolun/hypospray). I've called it hypospray, after the injector things they use in Star Trek :-)

It's quite simple, you have a services object:

{% highlight js linenos%}
var services = {}
{% endhighlight %}

and then you have a simple function for registering your dependencies:

{% highlight js linenos%}
function service(args){
    services[args.name] = {
        factory: args.factory,
        inject: args.inject
    }
}
{% endhighlight %}

Then to resolve dependencies all you do is recursively inject services for the service's `inject` list and then apply the factory function to it:

{% highlight js linenos%}
function injectService(servicename) {
    var service = services[servicename]
    var resolvedDeps = []
    for(var i = 0; i< service.inject.length; i++){
resolvedDeps.push(injectService(service.inject[i]))
}
return service.factory.apply(null, resolvedDeps)
}
{% endhighlight %}

To see it in use, look at [my example script](https://github.com/maxpolun/hypospray/blob/master/example.js). There's a lot that would be needed before using this in production. For one, you aren't really saving any boilerplate here, however you could implement on top of this a high-level framework for whatever it is you're doing. A web framework might look something like this:

{% highlight js linenos%}
function TaskView(request, response, renderer, tasks) {
var task = tasks.getById(request.forms.id)
response.write(renderer.render("taskView", task))
}
TaskListView.inject = ["request", "response", "renderer", "tasks"]
{% endhighlight %}

That looks pretty clean, right? You could even use the sort of magic angular uses and get dependencies by the function input names.
