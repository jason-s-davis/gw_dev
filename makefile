URL="http://assets.golfweek.com/assets/js/"
EMPTY=
JSDIR=srvstuff/js/
JSFILES=$(wildcard $(JSDIR)*.js)

.PHONY: all
all:
	get


# Use wget to get each of these files from the server
# should probably write a for loop for these files 
get: clean
	cd ./srvstuff/js; \
	wget $(URL)ads.js; \
	wget $(URL)app.js; \
	wget $(URL)infscr.js; \
	wget $(URL)related_stories.js; \
	wget $(URL)scores.js

# Maybe force clean to check 
# that the git status is clear
# before removing the files?
# phony here tells make that the 
# clean target is not associated with a file
.PHONY: clean
clean:
	rm $(wildcard $(JSDIR)*.js)

getjs: clean
	cd $(JSDIR); \
	for file in $(subst $(JSDIR),$(URL),$(JSFILES)); do \
		wget $$file; \
	done
