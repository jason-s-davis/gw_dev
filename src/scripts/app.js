var angular = require('angular');
var $ = require('jquery-browserify');
var bootstrap = require('bootstrap');
require('jquery-mousewheel')($);
var jQuery = $;
require('../../libs/scrollbar/jquery.mCustomScrollbar');
require('../../libs/slick/slick.min');
require('./infscr');
// require('./ads');
require('./scores');


(function($){


/// Sub Nav Area Functionality
var closer;

function SubNav(event){

	window.clearTimeout(closer);
	
	var target = $(event.target).attr('targ')

	// remove red from item and link
	$('#MainNav ul li').removeClass('selected');
	$('#MainNav ul li a').removeClass('selected');
	
	// add red background to hovered item
	$(event.target).addClass('selected');
	// hide all of the sub nav
	$('#SideSubNav ul').hide();
	// show the subnav for the hovered item
	$('#' + target + '-nav').css('display', 'block');

	// slide the main content over to the right
	$('#MainContent').css('margin-left', '320px');

}

// activate SubNav on mouseover or click of main nav
$("#MainNav").on("click mouseover", "ul li", SubNav);


function CloseSubNav (event) {
	var mainWidth = $('#MainContent').css('margin-left');
	mainWidth = mainWidth.replace('px', '');
	mainWidth = parseInt(mainWidth);
	// if the nav bar is open close the sub nav
	if (mainWidth >= 175) {
		closer = window.setTimeout(function () {
			$('#MainContent').css('margin-left', '175px');
		}, 500);
	}
}


// if the mouse enters the main content close the subnav
$('main').on('mouseenter', CloseSubNav);

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

// *********** Tabs Functionality Init.  ************ //
$('#tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})

})(jQuery);
