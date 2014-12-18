(function ($) {
	

/* toggleFullStory uses jQuery's getJSON call to fetch 
 * the full story content for the clicked story then 
 * toggle the blurb / story open / closed
 *
 */
function toggleFullStory (e) {
	e.preventDefault();
	
  // get the clicked url
  var ref = $(this).find('a').attr('href');
  var elem = $(this).children('div.hidden')[0];

  var daddy = $(elem).parent();

  if (!(daddy.attr('data-fetch') === 'done')) {
  	// get the story from url here
  	$.getJSON('http://golfweek.com' + ref + '?json')
  		.success(function (data) {
  			
  			// set the img src
  			var img = $(elem).find('img')[0];
  			$(img).attr('src', data.story[0].photourl);

  			// set the story content
  			var p = $(elem).find('p.story_content')[0];
  			$(p).html(data.story[0].body);

        daddy.attr('data-fetch', 'done')
  		})
  		.error(function (err) { console.error(err); });
  }

	/* add loading css stuff here */
	// this toggles between story and blurb
	var elems = $(this).children('.row');
	elems.toggleClass('hidden');

	// this toggles the arrow open / closed
	var arrow = $($(this).find('div.more-divider')[0]).children('i')[0];
	$(arrow).toggleClass('fa-arrow-circle-down');
	$(arrow).toggleClass('fa-arrow-circle-up');
			
}

// $('.related-item').on('click.stories', toggleFullStory);


// Add the inViewport function to jquery
$.extend({
  inViewport: function (/*elem, callback*/) {
    var el = arguments[0], callback;

    if (el instanceof $) {
      el = el[0];
    } else {
      el = $(el)[0];
    }

    var rect = el.getBoundingClientRect();
    var isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    // only element provided
    if (arguments.length === 1) {
      return isInViewport;
    } else if (arguments.length === 2) {
      callback = arguments[1];
      return callback(el, isInViewport);
    }
  }
});


function pageUpdate (url) {
  // takes state object , title (ignored in ff), and url
  window.history.pushState({}, '', url);
  // refresh ads on the page when url changes
  googletag.pubads().refresh();
  console.log('%c ADS RELOADED ', "color: yellow; background-color: grey");
};

var LOADING = false;
var load_timer;

function getThisStory (elem, visible) {
  // the div containing the loading spinner
  var loadSpan = '<div class="loading_spinner"><span class="loader"><span class="loader-inner"></span></span></div>';
  // find the row elements to hide during load
  var elems = $(elem).children('.row');



  // if the element is visible and doesn't have data
  if (visible) {

    // get the url to fetch in xhr or change to
    var ref = $(elem).find('a').attr('href');
    var url_update = 'http://dev.golfweek.com/' + ref;

    if ($(elem).attr('data-fetch') !== 'done') {
      // set the loading indicator to true while loading data
      LOADING = true;

      /** VISUAL EFFECTS **/

      // hide the rows
      $(elems).css('visibility', 'hidden');

      // if the loading spinner div is not present add it
      if ($(elem).find('.loading_spinner').length < 1) {
        $(elem).append(loadSpan);
      }

      /** XHR **/

      // update url / refresh ads
      pageUpdate(url_update);

      if (window.GWDEBUG) {
        console.log("%c\n\n*****\n\tJason change the get url\n\tback to the golfweek\n\tpage when this is live!\n*****\n\n",'color: #fff; background-color: #24232E');
      }
      // TODO swap the getJSON lines below on production go live

      $.getJSON('http://assets.golfweek.com/assets/ops/getpage.php?url=' + ref)
      // $.getJSON('http://golfweek.com' + ref + '?json')
        .success(function (data) {
          // set the img src of the second image tag (the first is in the blurb)
          var img = $(elem).find('img')[1];
          $(img).attr('src', data.story[0].photourl);

          // set the story content (story content p only exists in second row)
          var p = $(elem).find('p.story_content')[0];
          $(p).html(data.story[0].body);

          // add marker so this element wont be fetched again
          $(elem).attr('data-fetch', 'done');

          /** MORE VISUAL STUFF **/
          // show the new story and remove the loading spinner
          $(elems).delay(600).css('visibility', 'visible');
          $('.loading_spinner').delay(600).fadeOut(200).remove();


          // toggles between story and blurb
          elems.toggleClass('hidden');
          
          // wait a bit before allowing the next story to load
          load_timer = window.setTimeout(function () {
            LOADING = false;
            window.clearTimeout(load_timer);
            load_timer = undefined;
          }, 1300);

        })
        .error(function (err) {
          console.warn(err);
          // add something so this element wont be fetched again
          $(elem).attr('data-fetch', 'done');
          LOADING = false;
        });
    } else {
      // update url / refresh ads
      pageUpdate(url_update);
    }
  }
}

var wait_to_check;

function relatedWatcher (event) {
  if (typeof wait_to_check === "undefined") {
    wait_to_check = window.setTimeout(function () {
      $.each($('.related-item'), function (i, val) {
        if (!LOADING) {
            var top = $(val).children('.related-top')[0];
            var bottom = $(val).children('.related-bottom')[0];
            if ($.inViewport(top) || $.inViewport(bottom)) {
              getThisStory(val, true);
            }
            // $.inViewport(val, getThisStory);
        }
      });
      wait_to_check = undefined;
    }, 400);
  }

}

$(window).on('load.stories scroll.stories', relatedWatcher);

})(jQuery);