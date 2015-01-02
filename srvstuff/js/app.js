(function($){
	
$.fn.popupWindow = function(instanceSettings){

	return this.each(function(){

	$(this).click(function(){

	$.fn.popupWindow.defaultSettings = {
		centerBrowser:0, 		// center window over browser window? {1 (YES) or 0 (NO)}. overrides top and left
		centerScreen:0, 		// center window over entire screen? {1 (YES) or 0 (NO)}. overrides top and left
		height:500, 			// sets the height in pixels of the window.
		left:0, 				// left position when the window appears.
		location:0, 			// determines whether the address bar is displayed {1 (YES) or 0 (NO)}.
		menubar:0, 				// determines whether the menu bar is displayed {1 (YES) or 0 (NO)}.
		resizable:0, 			// whether the window can be resized {1 (YES) or 0 (NO)}. Can also be overloaded using resizable.
		scrollbars:0, 			// determines whether scrollbars appear on the window {1 (YES) or 0 (NO)}.
		status:0, 				// whether a status line appears at the bottom of the window {1 (YES) or 0 (NO)}.
		width:500, 				// sets the width in pixels of the window.
		windowName:null, 		// name of window set from the name attribute of the element that invokes the click
		windowURL:null, 		// url used for the popup
		top:0, 					// top position when the window appears.
		toolbar:0 				// determines whether a toolbar (includes the forward and back buttons) is displayed {1 (YES) or 0 (NO)}.
	};

	settings = $.extend({}, $.fn.popupWindow.defaultSettings, instanceSettings || {});

	var windowFeatures =    'height=' + settings.height +
							',width=' + settings.width +
							',toolbar=' + settings.toolbar +
							',scrollbars=' + settings.scrollbars +
							',status=' + settings.status + 
							',resizable=' + settings.resizable +
							',location=' + settings.location +
							',menuBar=' + settings.menubar;

			settings.windowName = this.name || settings.windowName;
			settings.windowURL = this.href || settings.windowURL;
			var centeredY,centeredX;

			if(settings.centerBrowser){

				if ($.browser.msie) {	//hacked together for IE browsers
					centeredY = (window.screenTop - 120) + ((((document.documentElement.clientHeight + 120)/2) - (settings.height/2)));
					centeredX = window.screenLeft + ((((document.body.offsetWidth + 20)/2) - (settings.width/2)));
				}else{
					centeredY = window.screenY + (((window.outerHeight/2) - (settings.height/2)));
					centeredX = window.screenX + (((window.outerWidth/2) - (settings.width/2)));
				}
				window.open(settings.windowURL, settings.windowName, windowFeatures+',left=' + centeredX +',top=' + centeredY).focus();
			}else if(settings.centerScreen){
				centeredY = (screen.height - settings.height)/2;
				centeredX = (screen.width - settings.width)/2;
				window.open(settings.windowURL, settings.windowName, windowFeatures+',left=' + centeredX +',top=' + centeredY).focus();
			}else{
				window.open(settings.windowURL, settings.windowName, windowFeatures+',left=' + settings.left +',top=' + settings.top).focus();	
			}
			return false;
		});

	});	
};

window.GWDEBUG = true;

// A check to see if the nav menu is closing
var navCloser;

// Sub Nav Area Functionality
var subNavCloser;

function SubNav(event){

	if (event.type === 'mouseover') {
		if (typeof navCloser !== 'undefined') {
			return undefined;
		}
	}

	window.clearTimeout(subNavCloser);
	var target;
	if (event.target.tagName === 'A') {
		target = $(event.target.parentNode).attr('targ');
	} else {
		target = $(event.target).attr('targ');
	}

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
$("#MainNav").on("click.nav mouseover.nav", "ul li", SubNav);


function CloseSubNav (event) {
	var mainWidth = $('#MainContent').css('left');
	mainWidth = mainWidth.replace('px', '');
	mainWidth = parseInt(mainWidth);
	// if the nav bar is open close the sub nav
	if (mainWidth >= 175) {
		subNavCloser = window.setTimeout(function () {
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
$('main').on('mouseenter.nav', CloseSubNav);


function ClickMenu(event) {
	if ($('#MainContent').css('left') == '30px') {
		$('#MainContent').css('left','175px');
		BackgroundPosition(175);
	} else {
		navCloser = true;
		$('#MainContent').css('left','30px');
		BackgroundPosition(30);
		window.setTimeout(function () { navCloser = undefined; }, 1000);
	}
}

$('.shownav').on('click.navbutton', ClickMenu);
	
	
	
function BringToTop(event) {
	$('html, body').animate({ scrollTop: 0 }, 'fast');
}	
	
$('#BringToTopButton').on('click', BringToTop);

	

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
	$('.modal-dialog').css('padding-top', $('#HeaderContent').height() + 10);
}
	
function FixMobileWidth(mainmargin, windowwidth) {
	/* Change the Article Holder to a variable width when in mobile */
	if($(window).width() < 867){
		thiswidth = parseInt(windowwidth) - parseInt(mainmargin) - 1;
		$('#MainContent').css('width', thiswidth);
	} else {
		$('#MainContent').css('width', '100%');
	}
}

function BackgroundPosition(mainmargin) {
	var mainwidth = $('#MainContent').width();
	var headercontent = $('#HeaderContent').height();
	var combinedwidth = mainmargin + parseInt(mainwidth);
	var combinedpos = combinedwidth + 'px ' + (headercontent + 10) + 'px'
	$('body, html').css('background-position', combinedpos);
}

function ResizeEverything(){
	///  On Load functions to run.	
	HeaderHeight();
	SideBar();
	FixMobileWidth($('#MainContent').position().left, $(window).width());
	BackgroundPosition($('#MainContent').position().left);
}

ResizeEverything();

$(window).resize(function(event) {
	ResizeEverything();
})

/**  Keep the sidebar up top **/
function keepSidebarUp (e) {
	$("#SideBar").stop();
	SideBar();
}

// watch for scroll with namespace sidebar
$(window).on('scroll.sidebar', keepSidebarUp);



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
    theme:"dark-2"
});
	
$(".additional-videos").mCustomScrollbar({
    axis:"y", // vertical scrollbar
    theme:"light-2"
});


// *********** Tabs Functionality Init.  ************ //
function showTab (event) {
	event.preventDefault();
	$(this).tab('show');
}

$('#tabs a').on('click.aside', showTab);

})(jQuery);
