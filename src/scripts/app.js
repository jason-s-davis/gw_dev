var $ = require('jquery');
var angular = require('angular');

var url = 'http://golfweek.com/news/2014/oct/26/pga-tour-robert-streb-mcgladrey-classic-2014/?json';

$.getJSON(url, function (d) {
	$('#stuff').html(d.story[0].body);
});