var angular = require('angular');
var $ = require('jquery-browserify');
var bootstrap = require('bootstrap');
require('jquery-mousewheel')($);
var jQuery = $;
require('../../libs/scrollbar/jquery.mCustomScrollbar');
require('./infscr');


// ********* Init custom scrollbars here  ********* //
$("#MainNav").mCustomScrollbar({
    axis:"y", // vertical scrollbar
    theme:"minimal"
});

$("#SideSubNav").mCustomScrollbar({
    axis:"y", // vertical scrollbar
    theme:"minimal"
});

$(".TabPanel").mCustomScrollbar({
    axis:"y", // vertical scrollbar
    theme:"minimal-dark"
});

/// Sub Nav Area Functionality

function SubNav(){

	var target = $(event.target).attr('targ')
	// console.log(event.target);
	$('#MainNav ul li').removeClass('selected');
	$('#MainNav ul li a').removeClass('selected');
	$(event.target).addClass('selected');
	$('#SideSubNav ul').hide();
	
	$('#' + target + '-nav').css('display', 'block');
	$('#MainContent').css('margin-left', '320px');
}

$( "#MainNav ul li" ).mouseover(function() {
  SubNav();
});

$( "#MainNav ul li" ).click(function() {
  SubNav();
});


function SideBar(){
	if($("#sidebar-ad-placeholder").height() < 250){
		ad_offset = 250
	} else {
		ad_offset = $("#sidebar-ad-placeholder").height();
	}
	var offset =  $(window).height() - ($('#HeaderContent').height() + ad_offset + 70);
	$("#SideBar").css({'margin-top': ($(window).scrollTop()), 'height': offset});
	$("#sidebar-ad-placeholder").css({'position': 'fixed', 'bottom': 10});
}

function HeaderHeight() {
	$('.header-push').css('padding-top', $('#HeaderContent').height() + 10);
}


$(document).ready( function(){
	HeaderHeight();
	SideBar();

	$(window).resize(function() {
		SideBar();
		HeaderHeight();
	})

	/**  Keep the sidebar up top **/
	$(window).scroll(function(){
	$("#SideBar")
		.stop()
		SideBar();
});
});


/*******************************************************/

// Move Content Area left and right on click on menu button
$( ".shownav" ).click(function() {
	// If nav closed, open it.
	if ($('#MainContent').css('margin-left') == '30px') {
		$('#MainContent').css('margin-left','175px');
	} else {
		$('#MainContent').css('margin-left','30px');
	}
});



/*******************************************************/

///  Tabs Functionality Init.
$('#tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})