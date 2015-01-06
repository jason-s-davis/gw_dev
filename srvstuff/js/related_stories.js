(function ($) {

function RelatedStories (element) {
  if (element) {
    if (element instanceof $) {
      this.elem = element[0];
    } else {
      this.elem = $(element)[0];
    }
    this.rows = $(this.elem).children('.row');
    this.top = $(this.elem).children('.related-top')[0];
    this.load();
  }
}

RelatedStories.prototype = {
  load: function () {
    var scope = this;

    $(window).on('load.stories scroll.stories', function () {
      var pct = scope.percentSeen(scope.elem);
      if (pct > 15) {
        if ($(scope.elem).attr('data-fetch') !== 'done') {
          scope.showLoader();
          scope.setUrl();
          scope.getStory();
        }
        if (pct > 30 && pct < 84) {
          if ($('.related-item:in-viewport')[0] === scope.elem || $('.related-item:in-viewport')[1] === scope.elem) {
            if (window.location.href.indexOf(scope.ref) === -1) {
              scope.getAd(scope);
              scope.updateUrl(scope);
            }
          }
        }
      }


      // if ($.inArray($(scope.elem).find('div.related-story-ad')[0], $('.related-story-ad:above-the-top'))) {
      //   scope.clearAd(scope);
      // }

    });
  },
  gettingStory: false,
  /* getStory uses jquery getJson to 
   * fetch the story and load it into 
   * the element
   */
  getStory: function () {
    if (window.GWDEBUG) {
      console.log("%c\n\n*****\n\tJason change the get url" +
                  "\n\tback to the golfweek\n\tpage when this" + 
                  " is live!\n*****\n\n"
                  , 'color: #fff; background-color: #24232E');
    }

    if (!RelatedStories.gettingStory) {
      RelatedStories.gettingStory = true;
 
      var scope = this;


      this.xhr = $.ajax({
        url: 'http://dev.golfweek.com' + this.ref + '?rel'
      });

      this.xhr.then(function (story_data) {

          var img = $(scope.elem).find('img.lead_photo')[0];
          $(img).attr('src', $(story_data).find('div#photo_url').html());

          var p = $(scope.elem).find('p.story_content')[0];
          $(p).html($(story_data).find('div#story_content').html());

          // add marker so this element wont be fetched again
          $(scope.elem).attr('data-fetch', 'done');

          // toggles between story and blurb
          $(scope.rows).toggleClass('hidden');

          // bitly stuff
          scope.storyId = $(story_data).find('#related_load').attr('story_id');
          scope.socText = $(story_data).find('div#social').attr('twitter_text');
          scope.hashVia = $(story_data).find('div#social').attr('twitter_hash');

          scope.getBit(scope);

          // hide the load image
          scope.hideLoader();
        }, 
        function (err) { 
          console.warn(err);
        });

    }
  },
  loaderVisible: false,
  loadDiv: '<div class="loading_spinner">' + 
            '<span class="loader">' + 
              '<span class="loader-inner"></span>' + 
            '</span>' + 
           '</div>',
  /* showLoader shows
   * the loading image 
   * during ajax load
   */
  showLoader: function () {
    if (!this.loaderVisible) {
      this.loaderVisible = true;
      // hide the rows
      $(this.rows).css('visibility', 'hidden');

      // if the loading spinner div is not present add it
      if ($(this.elem).find('.loading_spinner').length < 1) {
        $(this.elem).append(this.loadDiv);
      }
    }
  },
  hideLoader: function () {
    if (this.loaderVisible) {
      // show the rows 
      $(this.rows).delay(600).css('visibility', 'visible');
      // remove the loading spinner
      $('.loading_spinner').remove();
      this.loaderVisible = false;
      RelatedStories.gettingStory = false;
    }
  },
  /* setUrl gets the url to fetch from
   * information in the div itself
   */
  setUrl: function (url) {
    if (!url) {
      this.ref = $(this.elem).find('a').attr('href');
    } else {
      this.ref = url;
    }
  },
  percentSeen: function (elem) {
    var $element = $(elem),
        $win = $(window);
    var viewportHeight = $win.height(),
        scrollTop = $win.scrollTop(),
        elementOffsetTop = $element.offset().top,
        elementHeight = $element.height();

    if (elementOffsetTop > (scrollTop + viewportHeight)) {
        return 0;
    } else if ((elementOffsetTop + elementHeight) < scrollTop) {
        return 100;
    } else {
        var distance = (scrollTop + viewportHeight) - elementOffsetTop;
        var percentage = distance / ((viewportHeight + elementHeight) / 100);
        percentage = Math.round(percentage);
        return percentage;
    }
  },
  site_url: 'http://dev.golfweek.com',
  updating: false,
  updateUrl: function (scope) {
    if (!RelatedStories.updating) {
      if (typeof scope.ref !== 'undefined') {
        if (window.location.href.indexOf(scope.ref) === -1) {
          RelatedStories.updating = true;
          var site_url = 'http://dev.golfweek.com';

          // takes state object , title (ignored in ff), and url
          window.history.pushState({}, '', site_url + scope.ref);
          
          // refresh this ad on the page when url changes
          if (typeof window.googletag !== 'undefined') {
            // window.googletag.cmd.push(function() {
              // window.googletag.pubads().refresh([scope.gptAdSlot]);
              window.googletag.pubads().refresh([window.gptAdSlots[0]]);
              window.googletag.pubads().refresh([window.gptAdSlots[1]]);
            // });
          }

          console.log('%c ADS RELOADED ', "color: yellow; background-color: grey");
          window.setTimeout(function () { RelatedStories.updating = false; }, 1300);
        }
      }
    }
  },
  // adFetched should be used to ensure that getAd is only run once per scope
  adFetched: false,
  /* find the ad div and fetch 
   * a google ad there
   * depends on a scope parameter
   */
  getAd: function (scope) {
    // if the ad has not been fetched get it
    if (!scope.adFetched && typeof window.googletag !== 'undefined') {
      if (typeof scope.gptAdSlot === 'undefined') {
        scope.gptAdSlot = undefined;
      }
      scope.adId = $(scope.elem).find('div.related-story-ad').attr('id');

      scope.adFetched = true;

      if (window.GWDEBUG) {
        console.log('*******\nNote:\n\tusing ROS here\n*******');
      }
      window.googletag.cmd.push(function() {
        scope.gptAdSlot = window.googletag.defineSlot('/310322/a.site152.tmus/ROS', [300, 250], scope.adId)
                            .addService(window.googletag.pubads());
        window.googletag.enableServices();
        window.googletag.cmd.push(function () {
          window.googletag.display(scope.adId);
        });
      });    
    }
  },
  // clear the ad if it is above the top
  clearAd: function (scope) {
    // if the ad is above the top of the screen then clear the ad
    if (typeof window.googletag !== 'undefined' && typeof scope.adId !== 'undefined') {
      window.googletag.cmd.push(function() {
       window.googletag.pubads().clear(scope.gptAdSlot);
      });
    }
  },
  bitFetched: false,
  /* getBit calls the bitly url shortener
   * for all twitter link buttons
   */
  getBit: function (scope) {
    if (!scope.bitFetched) {
      var bitK = 'R_0bb3a2bd58efcf7f43919bc4d1503474',
          log = 'o_1ji3urg5mu',
          urlBase = 'http://api.bitly.com/v3/shorten?apiKey=' + bitK + '&login=' + log + '&longUrl=http://golfweek.com';
      $.ajax({
        dataType: "json",
        url: urlBase + scope.ref
      })
      .success(function (res) {

        var tinyurl = res.data.url,
            hashandvia = scope.hashVia;

            // Using the format "hashtag,hashtag,hashtag|via,via,via"
            hashandvia = hashandvia.replace(/ /g, '');
            hashandvia = hashandvia.split('|');

            var url = 'http://golfweek.com',
            link = "https://twitter.com/intent/tweet?original_referer=" + url + scope.ref + "&text=" + scope.socText + "&url=" + tinyurl
            if(hashandvia[0] > ""){
              link = link + "&hashtags=" + hashandvia[0];
            }
            if(hashandvia[1] > ""){
              link = link + "&via=" + hashandvia[1];
            }

            $(scope.elem).find('a.twitter-link').attr('href', link);
      })
      .error(function (err) {
        console.warn(err);
      });
    }
  }
}



// the page url from page load
var pageStart = window.location.href;
// all of the related story items
var rel_items = $('.related-item');
// container for RelatedStory objects
var rel_stories = [];

for (var i = 0; i < rel_items.length; i++) {
  rel_stories[i] = new RelatedStories(rel_items[i]);  
};


if ($('.related-item').length > 0) {
  // if none of the related stories are visible set the page url back to the original
  $(window).on('scroll.stories', function () {
    if ($('.related-item:in-viewport').length === 0) window.history.pushState({},'', pageStart);
  });
}



})(jQuery);