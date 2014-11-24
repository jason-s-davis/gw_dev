(function (angular) {
var infscr = angular.module('infscr', []);

infscr.config(function ($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


// scrollDiv defines the object to be used as a directive
function scrollDiv ($window) {
  'use strict';

  // this function loads on the defined element
  return function (scope, element, attrs) {
      // position starts at 0
      scope.position = 0;

      // wait for the LOADDONE event
      scope.$on('LOADDONE', function (event) {
        scope.position = Math.floor(((window.pageYOffset + $(window).height()) / $(document).height()) * 100);
        
        angular.element(window).bind('scroll', function () {          
          scope.position = Math.floor(((this.pageYOffset + $(window).height()) / $(document).height()) * 100);
          if (scope.position > 85) {
            scope.getMore();
          }
          scope.$apply();
        });

        if (scope.count >= 60) {
          angular.element(window).unbind('scroll');
        }
      });

    }
}

// assign scrollDiv to a directive
// in a minification safe manner
infscr.directive('scrollDiv', ['$window', scrollDiv]);






// The getStoryList function uses angularjs' $http
// object to make xhr's to get stories
function getStoryList ($http) {

  // the url to request stories from
  var url = 'http://golfweek.com/json/';

  return {
    // the get function should suffice for most normal uses
    // it accepts a context object to get info about the sections
    // ctx also needs a success function to return the data
    get: function (ctx) {
      // the category function is here for future use with sections and sub sections
      // currently it is not used
      var category = (ctx.section === undefined) ? '' : ctx.section;
      category += (ctx.sub === undefined || ctx.sub === 'all') ? '' : '/' + ctx.sub;
      category += (ctx.subsub === undefined) ? '' : '/' + ctx.subsub;
      category += (ctx.subsubsub === undefined) ? '' : '/' + ctx.subsubsub;
      
      // the count is at minimum 15 but must be in increments of 15 currently
      var count = (ctx.count === undefined) ? 15 : ctx.count;
      
      // make the request to golfweek 
      // ***MUST BE A POST OR ELLINGTON BLOCKS IT***
      $http.post(url + 'section/?Section=' + category + '&Num=' + count)
        .success(function (data) {  
          ctx.success(data);
        })
        .error(function (data, status) {
          console.log(data, status);
        });
    }
  }
}


// Assign getStoryList as an angular factory 
// in a manner safe for minification
infscr.factory('getStoryList', ['$http', getStoryList]);



// the getStoryContent function is intended to load the clicked
// story into the selected div
function getStoryContent ($http) {
  
  // the base url to request the storydata from
  var url = 'http://golfweek.com/';

  return {
    get: function (ctx) {      
      $http.post(url + ctx.slug)
        .success(function (data) {
          ctx.storySuccess(data);
        })
        .error(function (data, status) {
          console.log(data, status);
        });
    }
  }
}


// Assign getStoryList as an angular factory 
// in a manner safe for minification
infscr.factory('getStoryContent', ['$http', getStoryContent]);



// the infScrollController function is intended to be used 
// in the div where the stories should be added for infinite 
// scrolling
function infScrollController ($scope, $window, storyList, story) {
	$scope.count = 15;  // number of stories to get
	$scope.fetching = false; // are we fetching right now?
  $scope.stories = []; // starts out as an empty array

  $scope.$on('LOAD', function (e) { $scope.fetching = true; });
  $scope.$on('LOADDONE', function (e) { $scope.fetching = false; });

  // this is the success handler when data is received
  $scope.success = function (data) {
    angular.forEach(data.stories, function (val, key) {
      this[key] = val;
    }, $scope.stories);
    console.log('%O', $scope.stories[0]);
    // let everything know we are done loading
    $scope.$emit('LOADDONE');
  }

  // get the stories the first time
  storyList.get($scope);

  // getMore should be used when the div is scrolled
	$scope.getMore = function () {
		// if page position is bigger than 88 
		// fetch more stories
		if (!$scope.fetching) {
      $scope.$emit('LOAD');
      $scope.count = ($scope.count === 60) ? 60 : $scope.count + 15;
			// let everything know we are loading
      storyList.get($scope);

		}
	}

  $scope.storySuccess = function (data) {
    // set the data here to the expanding div for the story
    console.log(data);
  }


  $scope.storyClick = function (slug) {
    $scope.slug = slug;
    story.get($scope);
  }


}


// Assign infScrollController as an angular controller 
// in a manner safe for minification
infscr.controller('infScrollCtrl', ['$scope', '$window', 'getStoryList', 'getStoryContent', infScrollController]);

})(angular);