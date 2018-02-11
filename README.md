# PALP

**PALP** (**P**rogrammierungs**a**ufgaben **L**oesungs**p**ruefer) is a simple automated code
assessment platform. You just need to create the tests of problem and the solution
will be tested in Docker container.

**Important to notice** that this project lacks a lot of functionality (admin panel,
viewing results, support of other programming languages, ...)
and good practices (e.g. tests, installation and usage guide,
security good practices, ...). I unterstand this.
It's my first experience to make such big project alone in short deadlines
and combining with my study in university and other open-source projects. But
it's my first web project and I should have something. Something is better than nothing.
Here you can find some architecture ideas that allow to painlessly scale
the monolithic code base both in frontend and backend.

## Demo

Click to watch on YouTube:

[![Demo Picture](https://raw.githubusercontent.com/bogem/palp/master/Demo.png)](https://youtu.be/5g_6eyKyP2o)

## Motivation
I worked for my university and we were looking for such platforms, but didn't
find suitable and simple enough platform. As a student I tried to develop
my own platform. The project is frozen due to fact that I can't develop and
support alone this quite big for me project (~2k lines of Go + ~2.5k lines of JS).

Two things I wanted to learn from this project are **modern state of frontend**
and **how to build big and scalable web project** based on good practices.

## New Technologies
List of libraries and tools that I used for first time and my **brief** opinions
about them:

**Frontend (JS)**
* [**Yarn**](https://yarnpkg.com/lang/en/) (🌟🌟🌟🌟🌟) - simple and clear alternative to npm.
* [**React**](https://reactjs.org/) (🌟🌟🌟🌟🌟) - powerful JS library for building UIs. I really enjoyed when I learned it.
* [**Redux**](https://redux.js.org/) (🌟🌟🌟🌟🌟) - well-working concept for state management with immutable approact. The problems are: prolixity and hard integration with flow-type, but it's actually worth it.
* [**React Router**](https://reacttraining.com/react-router/) (🌟🌟🌟🌟🌟) - easy to learn and work with.
* [**Flow**](https://flow.org/) (🌟🌟🌟🌟🌟) - fast and powerful static type checker. I also considered TypeScript, but chose flow because it's developed in Facebook, so I thought it's better integrated with React ecosystem. I was not mistaken.
* [**Blueprint**](http://blueprintjs.com/) (🌟🌟🌟🌟🌟) - beautiful, configurable and big component-library. Everytime I has a pleasure working with it.
* [**Babel**](https://babeljs.io/) (🌟🌟🌟🌟🌟) - JS compiler. Almost never had problems with it. Really love it.
* [**ESLint**](https://eslint.org/) (🌟🌟🌟🌟🌟) - simple and configurable linter for JS. Integration with flow works not so well though.
* [**Webpack**](https://webpack.js.org/) (⭐️⭐️⭐️) - very powerful, but too complex to configure. Had a lot of pain and wasted a lot of time to find information about some common things.

**Backend (Go)**
* [**dep**](https://golang.github.io/dep/) (🌟🌟🌟🌟🌟) - best vendoring tool for Go I worked with. Really simple and works as expected *(if project has right semantic versioning)*.
* [**Docker API**](https://godoc.org/github.com/moby/moby) (⭐️⭐️⭐️) - very powerful, but sometimes complex to understand library, because of a few examples. Some methods have outdated examples in docs. For example, I had to read Docker CLI source code to understand, how client.ContainerWait(...) actually works, because there is an outdated example of this method in docs. Also important to notice, that moby/moby didn't make new version since 17.03, so I met painful problems with versioning. Anyway I love Docker as a tool.

