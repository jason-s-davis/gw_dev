# Golfweek Dev Boilerplate


## Setup

* install [nvm](https://github.com/creationix/nvm)
    * install node version 0.10.x as some of the node modules don't work with v0.11.13
* changed to less as it is easier to setup
	* download [lesshat](http://lesshat.madebysource.com/) for mixins 
	* or just use bootstrap's mixins which will be downloaded into node_modules
* clone the repository and ```cd gw_dev```
* run ```npm install``` to install all dependencies
* now you are ready to start working
* all of the editing should be done in the src folder _NOT_ the build folder
* you can view your work with auto reload at localhost:3000

### TODO
[] Add Karma / Jasmine Tests - for JS functionality testing
[] Add CasperJS Tests? - for user action testing
[] PageSpeed / Phantomas / Performance Budget

[further reading](http://rupl.github.io/frontend-testing/#/)