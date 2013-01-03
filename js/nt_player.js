/* 
 *  @copyright The Royal National Theatre
 *  @author John-Paul Drawneek <jdrawneek@nationaltheatre.org.uk>
 */

function nt_player_init_player(player_id) {
    var player = new MediaElementPlayer('#' + player_id, {
        features: ['playpause','current','progress','duration','volume'],
        plugins: ['flash'],
        pluginPath: Drupal.settings.nt_player.swf,
        flashName: 'flashmediaelement.swf',
        success: function(media, node, player) {
          var flag = false;
          media.addEventListener('play', function(e) {
            if (!flag) {
              var ext = player.media.currentSrc.split('.').pop().toLowerCase();
              var type = 'unknown';
              if (ext == 'mp4' || ext == 'webm') {
                type = 'video';
              } else if (ext == 'mp3' || ext == 'ogg') {
                type = 'audio';
              }
              _gaq.push(['_trackEvent', type, 'plays', player.media.currentSrc]);
            }
            flag = true;
          });
        }
  });
  if (!Drupal.settings.hasOwnProperty('nt_player')) {
    Drupal.settings.nt_player = {};
  }
  if (!Drupal.settings.nt_player.hasOwnProperty('players')) {
    Drupal.settings.nt_player.players = {};
  }
  var play_list = new Object();
  play_list[player_id] = player;
  jQuery.extend(
    Drupal.settings.nt_player.players,
    play_list
  );
}

jQuery(document).ready(function() {
      /* gallery control */
    jQuery("#gallery a").click(function () {
        var galleryinfo = jQuery(this).attr('rel'),
            galleryfile = jQuery(this).attr('href'),
            galleryother = jQuery(this).attr('source'),
            galleryinfocredit = jQuery(this).children('span').text(),
            mediaclass = '';
        if (jQuery(this).hasClass('image')) {
            jQuery('#galleryshow').html('<img src=' + galleryinfo + ' alt="" width="' + Drupal.settings.nt_player.width + '" height="' + Drupal.settings.nt_player.height + '"><span class="credit">' + galleryinfocredit + '</span>');
        }
        if (jQuery(this).hasClass('video') || jQuery(this).hasClass('audio')) {
            if (galleryother.length > 0) {
                if (jQuery(this).hasClass('video')) {
                    galleryother = '<source type="video/webm" src="' + galleryother + '" />';
                    mediaclass = 'video';
                }
                if (jQuery(this).hasClass('audio')) {
                    galleryother = '<source type="audio/ogg" src="' + galleryother + '" />';
                    mediaclass = 'audio';
                }
            } else {
                galleryother = '';
                if (jQuery(this).hasClass('video')) {
                    mediaclass = 'video';
                }
                if (jQuery(this).hasClass('audio')) {
                    mediaclass = 'audio';
                }
            }
            jQuery('#galleryshow').html('<div class="' + mediaclass + '"><video id="player1" width="' + Drupal.settings.nt_player.width + '" height="' + Drupal.settings.nt_player.height + '" poster="' + galleryinfo + '" controls="controls" preload="none"><source type="audio/mp3" src="' + galleryfile + '" />' + galleryother + '</video></div>');
            nt_player_init_player('player1');
        }
        jQuery('#main-content-box #topBox .description').remove();
        jQuery('#main-content-box #topBox').append(jQuery(this).find(".description").clone());
        jQuery('#main-content-box #topBox .description').append('<div class="close" />');
        return false;
    });
    /* if gallery items is >6 show carousel controls */
    var gallerycount = jQuery('#gallery li').length;
    if (gallerycount > 6) {
        jQuery('#gallery ul').removeClass('noslide');
        media_gallery = jQuery('#gallery ul').bxSlider({
            displaySlideQty: 6,
            moveSlideQty: 6,
            infiniteLoop: false,
            hideControlOnEnd: true,
            speed: 1000,
            easing: 'easeOutQuint'
        });
        jQuery('#gallery ul').css('left','-618px');
        jQuery('#gallery .bx-prev').text('');
        jQuery('#gallery .bx-next').text('');
        jQuery('#gallery').append('<span class="bx-prev-disabled"></span><span class="bx-next-disabled"></span>');
    }

    /* need to add class for every nth item to get video tool tip position correect. need this as span needs to be outside gallery div due to overflow hidden on carousel */
    jQuery('#production .row2').append('<span id="video-title"></span>');
    jQuery("#gallery ul.noslide li:nth-child(6n+1) span").addClass('265px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+1) span").addClass('302px');

    jQuery("#gallery ul.noslide li:nth-child(6n+2) span").addClass('368px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+2) span").addClass('405px');

    jQuery("#gallery ul.noslide li:nth-child(6n+3) span").addClass('471px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+3) span").addClass('508px');

    jQuery("#gallery ul.noslide li:nth-child(6n+4) span").addClass('574px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+4) span").addClass('611px');

    jQuery("#gallery ul.noslide li:nth-child(6n+5) span").addClass('677px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+5) span").addClass('714px');

    jQuery("#gallery ul.noslide li:nth-child(6n+6) span").addClass('780px');
    jQuery("#gallery .bx-wrapper ul li:nth-child(6n+6) span").addClass('817px');

    jQuery("#gallery a.video, #gallery a.image").hover(
        function () {
            var videotitle = jQuery(this).children('span').text(),
                videoleft = jQuery(this).children('span').attr('class'),
                videoactive = jQuery(this).parent('li');
            jQuery('#video-title').text(videotitle).css('left', videoleft);
            jQuery('#video-title').fadeIn(100);
            jQuery('#gallery li').not(videoactive).fadeTo("fast", 0.5);
        },
        function () {
            jQuery('#video-title').fadeOut(100);
            jQuery('#gallery li').fadeTo("fast", 1);
        }
    );
});
