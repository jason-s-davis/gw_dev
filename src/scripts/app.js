require('./infscr');
require('./ads');
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
	$('#MainContent').css('left', '320px');
	BackgroundPosition(320);
}

// activate SubNav on mouseover or click of main nav
$("#MainNav").on("click mouseover", "ul li", SubNav);


function CloseSubNav (event) {
	var mainWidth = $('#MainContent').css('left');
	mainWidth = mainWidth.replace('px', '');
	mainWidth = parseInt(mainWidth);
	// if the nav bar is open close the sub nav
	if (mainWidth >= 175) {
		closer = window.setTimeout(function () {
			// remove red from item and link
			$('#MainNav ul li').removeClass('selected');
			$('#MainNav ul li a').removeClass('selected');
			// close the sub nav
			$('#MainContent').css('left', '175px');
			// adjust the ad
			BackgroundPosition(175);
		}, 500);
	}
}


// if the mouse enters the main content close the subnav
$('main').on('mouseenter', CloseSubNav);


function ClickMenu(event) {
	if ($('#MainContent').css('left') == '30px') {
		$('#MainContent').css('left','175px');
		BackgroundPosition(175);
	} else {
		$('#MainContent').css('left','30px');
		BackgroundPosition(30);
	}
}

$('.shownav').on('click', ClickMenu);

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

function BackgroundPosition(mainmargin) {
	var mainwidth = $('#MainContent').width();
	var headercontent = $('#HeaderContent').height();
	var combinedwidth = mainmargin + parseInt(mainwidth);
	var combinedpos = combinedwidth + 'px ' + (headercontent + 10) + 'px'
	//console.log(combinedpos);
	$('body, html').css('background-position', combinedpos);
}

HeaderHeight();
SideBar();
BackgroundPosition($('#MainContent').position().left);

$(window).resize(function(event) {
	SideBar();
	HeaderHeight();
	BackgroundPosition($('#MainContent').position().left);
})

/**  Keep the sidebar up top **/
$(window).scroll(function(event){
$("#SideBar")
	.stop()
	SideBar();
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
