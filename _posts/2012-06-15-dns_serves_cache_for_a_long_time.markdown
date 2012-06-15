---
layout: post
title: DNS serves cache for a long time
date: 2012-06-15 11:12:34
category: site-matters
---
So, this is up on github pages now, but the DNS cach is taking a looong time to update. It gives me time play with jekyll, and figure out how I want things to work. I want to wait for the site to be on maxpolun.com before I set up comments. I guess I'll use disqus.

I did have a thought on how to set up some nice js/ajax-y stuff on a static site like this, though I'm not sure if I'll implement it. It's really pretty simple, you have a rake task (or if I was hosting this myself, a jekyll plugin) that generates static json files. So you could end up with somethign like:

    
    /posts.json (has a listing of all the postings)
    /api/2012-06-15-title_of_the_post.json 

and then in the posts.json file it would be like:

{% highlight js %}
[
	{"title": "Title of the post", 
	"url": "/api/2012-06-15-title_of_the_post.json"},
	{...}
]
{% endhighlight %}

Youd basically serialize all of the jekyll compile time data structures to static json files. You could even do a single page blog that uses HTML5 history. I don't think it would be that hard, but since jekyll is static I'm not sure how much you'd gain other than eye candy. You could possibly cover up some of jekyll's shortcomings, like making tag index pages and the like, but is that really easier than the other standard solution, generating them using rake (or a plugin if you're not on github pages)?

Anyways, something to think about. I might give it a shot when I have some free time (which would be unusual).