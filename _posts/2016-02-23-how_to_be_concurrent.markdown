---
layout: post
title: How to be concurrent
date: 2016-02-23 16:54:04
category: coding
---

There are lots of ways that different languages do concurrency, and I want to
talk about the general ways they do it, without getting bogged down in
language details.

So what is concurrency? It's not parallelism, that's for sure. It's at it's
simplest the ability to do work in the background while not pausing work in
the foreground. Some forms of concurrency can use parallel hardware resources
(CPU cores, etc), but not all.

I'm going to clasify low-level concurrency features (as opposed to high-level
patterns that can use multiple features at once) along the following axes:

1. Shared/Seperate memory

If two concurrent tasks share an memory, then sending data between them is
trivial but it's possible to corrupt data that isn't protected somehow. The
protection can either be locking of some sort, transactions, or just explicit
switching between tasks.

2. Allows parallelism / no parallelism

Concurrency is not parallelism, but if you have parallel hardware (multiple
cores, etc) it can often make sense to do parallel computation with the same
abstraction you use for concurrency. However the downsides are the need for
additional synchronization which can wash out any advantages you get from
parallelism.

3. Implicit / explicit task switching

If your tasks switch implicitly, you have to protect any data that can be
shared between different tasks. Explicit task switching removes that need, but
has boilerplate and can cause global slowdowns if a single task does not yield.

## Forms of concurrentcy

### Processes

* Seperate memory
* Allows parallelism
* Implicit task switching

Processes are extremely safe to use. You can't share data, and you can't
freeze the system through negligence (though deadlock is always an option).
However, these process can be quite heavyweight in imperative programming
(they can be lighter weight in a functional system because zero copying is
necessary in order to send messages between processes)

Examples:

* OS processes (heavyweight but general. Literally any language can use seperate OS processes)
* Erlang processes (lightweight, but tied tightly to a particular system and language)

### Threads

* Shared memory
* Can allow parallelism (depends on language/implementation)
* implicit task switching

Moving from the safest interface to the least safe, threads can extremely
easily to corrupt your memory. For this reason some languages reduce the risk
with a global lock (python's GIL or ruby's GVL). I think threads work very
badly with dynamically typed languages because all writes are read/writes.
That makes correct locking extremly difficult. You still need to lock any
shared data.

However threads are extremely flexible. It's what most other types of concurrency (including processes, inside the OS) are implemented with.

Examples:

* OS threads (supported by most languages)
* Goroutines

### Async functions

* Shared memory
* No parallelism
* Explicit task switching

This is what javascript uses. You schedule some task (usually some form of IO)
and wait for it to complete or fail. No async tasks are completed until you
either ask for them (in lower level languages), or all of your code has
returned (in higher level languages, especially javascript).

Examples:

* poll/select/epoll/kqueue
* javascript
* event machine/twisted/tornado/etc

Why do most forms of concurrency fit one of these groupings? Let's look at the others:

* Seperate memory
* No parallelism
* explicit task switching

This just seems to not have any benefits: you can't share data, you can't do
anything in parallel, and you have to explicitly switch tasks all the time. If
you've got seperate memory there's no reason to not allow implicit task
switching and parallelism.

* Seperate memory
* No parallelism
* implicit task switching

This is a bit better. Erlang used to be like this (only one thread was
multiplexed between processes), but it's really just a matter of technology to
allow parallelism. Again, if you have seperate memory you might as well allow
parallelism. That said, this is a perfectly reasonable initial implementation.

* Shared memory
* No parallelism
* implicit task switching

Running go with GOMAXPROCS=1 is basically this. Same with greenlets. You still
need to protect your data from access by multiple threads, but in practice
less is required, you can get away with being sloppy. It's kind of like the
old erlang processes: you don't lose anything by being parallel so you might
as well do it down the line, though it's more of a tradeoff here than a pure win.

## Variants

These general categories of concurrency features have different tradeoffs, but
those can be changed somewhat by implementation choices. The fundamentals
don't really change, but what's cheap or expensive can change:

### Processes

* Lightweight processes

If you multiplex many processes onto a small, fixed numer of OS
threads/processes, you can make processes mor elightweight. The tradeoff with
lightweight versus full processes is that lightweight process generally cannot
call C code easily and directly, but they use less memory.

### Threads

* Lightweight threads

Lightweight threads are multiplexed onto a small number (usually equal to the
number of CPUs) of hardware threads. They have similar tradeoffs as
lightweight processes -- they make interaction with the OS and hardware more
difficult, but use less memory so more can be started.

* Static verification

This is rust's big trick. Rust's rules of ownership disallow data races at
compile time. In order to share data between threads you need a mutex or other
protection, and this is impossible to mess up in safe rust. This makes more
ambitious use of threads feasible. However it increases the complexity of the
language and can only catch a subset of concurrency problems (in rust's case,
only data races).

### Async

* Promises/Futures

Promises (or Futures) are the representation of some value that will be
available eventually. They provide a good abstraction for building async
combinators on top of, which raw callbacks do not. Callbacks are more general,
but promises are a good basis for dealing with common concurrent patterns.

* Async/await

First coming from C#, but now spreading to many languages,
this makes async programming look serial, but keeps all task switching
explicit. It can also be faked if you have a coroutine abstraction. The
tradeoff here is language complexity vs development efficiency.

## In-depth examples

### Erlang

Erlang is intended to be used in highly reliable systems. It does this by
having many processes that are isolated from each other and a tree of
processes monitoring each other, so that lower level process are restarted by
higher level processes. This leads to a lightweight process model: you don't
want processes to have hidden dependencies on each other, because then you
can't kill and restart them if something goes wrong, and you want to be able
to start a truly huge number of processes. Erlang is deeply affected by this
concurrency model -- no types that cannot be efficiently serialized and sent
between processes that are possibly on different machines exist in erlang.
This makes erlang extremely well-suited for what it was designed for: highly
reliable networking infrastructure, but less well suited for many other types
of programming.

### Go

Go was designed as a reaction to C++, and draws some inspiration from erlang,
specifically it has goroutines which are lightweight threads. Unlike erlang
however, goroutines are not prohibited from sharing memory (socially it's
recommended to communicate by message passing, but sharing memory is allowed,
and easy to do by mistake). This takes away many of both the benefits and
drawbacks of erlang's model. This has the side-effect of making Go more of a
Java competitor, rather than a C++ competitor: interacting with the system (as
in, calling C) has lots of overhead and complexity. That said, having threads
be cheap makes many nice patterns feasible that would be prohibitively slow in
other languages. Go also *does* provide good tools for communicating using
message passing, and strongly recommends it's use. This has the effect of
having concurrency be much like the rest of the language: simple, pragmatic,
but full of boilerplate and pitfalls.

### Rust

Rust is also a reaction to C++, but has much stronger *compile-time*
abstractions (as opposed to Go having almost all *run-time* abstractions). For
concurrency, rust experimented with many different forms: for a long time it
supported go style lightweight threads, however now it only supports
native threads built in (though like all languages you can spawn additional OS
processes, or use async functions). The advantage of rust over C++ in
concurrency is that rust enforces proper memory accesses at compile time. This
adds some complexity to the language (though rust gets great bang for the
buck: the same compile time check to ensure proper memory use with threads,
also ensures proper memory use within a thread), and can be hard to learn, but
matches the way that systems programmers generally already write code. This
makes rust a true systems language: low runtime overhead, interacting with the
system is basically free, and but more difficult to program in than higher-level
languages.

### Node

Node's answer to concurrency issues is to just always be single-threaded, and
use async functions for all concurrency. In fact, it doesnt have blocking
functions for many IO operations (and even ones it does have are rarely used).
This infamously leads to giant chains of callbacks, though these days promises
and async/await can help with this dramatically. It does split all javascript
functions into sync and async functions, something that has to be kept in mind
always while writing node code. The plus side is that it doesn't make any
promises it can't fufill, unlike other dynamic languages (like python and ruby
which offer threads but have locks on running all python/ruby code). Since
there's almost no blocking IO, it also means that each node process can handle
quite a bit of IO, making it great for networking applications or web servers.
However node doesn't have a great story for handling computation heavy code
yet. You can spawn a different OS process, but it's still not an easy
operation. At some point node may introduce a lightweight process, but node is
probably never going to offer shared memory concurrency.

### nginx

nginx is a great example of how to combine different concurrency models. It
spawns a thread for each CPU, and then within each thread uses async functions
to do ant actual IO. This makes for a highly efficient system: it can handle
*lots* of connections, but unlike somethign like node, if there's some heavy
computation that needs to happen at some point other threads will pick up the
slack while one thread is blocked. Node can work around the issue sometimes with multiple processes, but multiple threads

# Conclusions

This is more of an overview than anything, but I hope that it helped you
understand what different types of concurrency are available, and what the
different tradeoffs are. You could write a whole book about this topic.

My own opinion has shifted over time to think that lightweight threads and
processes are over-hyped. They aren't bad ideas, but it's not a pure win like
so many portry it as.
