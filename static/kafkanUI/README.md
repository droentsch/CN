# This is a very simple angular2+ seed project
## set up
### clone this repository
### rename it to your project, and reset the git origin
`git remote add origin [path/to/your/repo]`

`git push -u origin master`

Boom.  The seed code is in your repo.  You could fork the project, but that's a long-term relationship.

## NOTE WELL

The package versions in this bootstrap project *are not pinned*.  When you use them in your own project, you will want to pin the versions of the dependencies in `package.json`.

Pinning a version means removing the ^ or ~ that precedes the version number.  Leaving a package version unpinned means you are susceptible to breaking code in an automatic upgrade to one of these packages.

And that's pretty annoying.

### install
Go to your new local directory.

`npm install`

or

`gradlew npmInstall`

### build

`gradlew rebuild`

### build with a minified codebase

`gradlew rebuildMin`

### run locally

`gradlew start`

When you run locally, you have to build first.  Yeah.  I don't like running the server on the source files.  If we're going to serve the code, it should be on the code in its distributable form.  I don't see how it's a reliable test, otherwise.

#### check it out in the browser

after you run start, go to http://localhost:4453/index.html .  You should see 'Hello World!' appear in the browser.

### run tests

`gradlew test`

## Some notes on the project
### why gradle?
CI.  That's the long and the short of it.  One of the best things about gradle is that you can put it on an empty disk, run `gradlew [task]` and the gradle wrapper will find the version of gradle specified in the wrapper task (I specified 2.11 for this project), download it, and run it.

On the CI box, we want to run `gradlew npmInstall` first

### Self-bootstrapping codebase
It's the latest rage, and we use it here.  In virtually all of the literature, you store a module loader config file with your distributables, and then call `System.import()` in your index.html.

With the build plugin `systemjs-builder`, we can tell the build to merge all the angular dependences *plus* our code into a single file, minified or unminified.  After which the application will bootstrap itself without help from code in the html page.
