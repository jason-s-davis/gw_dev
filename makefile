URL="http://assets.golfweek.com/assets/js/"


# Use wget to get each of these files from the server
# should probably write a for loop for these files 
get: clean
	cd ./srvstuff/js; \
	wget $(URL)ads.js; \
	wget $(URL)app.js; \
	wget $(URL)infscr.js; \
	wget $(URL)related_stories.js; \
	wget $(URL)scores.js

# Maybe force clean to check that the git status is clear
# before removing the files?
clean:
	cd ./srvstuff/js; \
	rm *.js; \
	echo Removed JS files.


all:
	get
