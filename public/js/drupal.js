(function($) {

  "use strict";

  Drupal.behaviors.textfield_placeholder = {
    attach: function (context, settings) {
      $(".input-field", context).each(function() {
          var $this = $(this);
          if ($this.val().length) {
              $this.parent().addClass("input--filled")
          }
          $this.on("focus", function() {
              $this.parent().addClass("input--filled");
          });
          $this.on("blur", function() {
              if (!$this.val().length) {
                  $this.parent().removeClass("input--filled")
              }
          })
      });
    }
  };


  Drupal.behaviors.tb_megamenu_align = {
    attach: function (context, settings) {
      //$('.mega-align-right .mn-sub', context).addClass('to-left');
    }
  };

/*  Drupal.behaviors.mobile_menu_click_fix = {
    attach: function (context, settings) {
      $('.has-dropdown > a', context).click(function(e) {
      });
    }
  };
*/

  Drupal.behaviors.skillBars = {
    attach: function (context, settings) {
    
      var $skillBars = $(".skillbar-container:first", context).parent(),
          $skillBar = $skillBars.find(".skillbar-bar"),
          $allSklBrs = $(".skillbar-bar", context),
          $winWidth = $(window).width();

      setTimeout(function() {
        if ($skillBars.length) {
            if ($winWidth >= 768) {
                $skillBars.waypoint(function() {
                    $skillBar.each(function() {
                        var $this = $(this);
                        $this.width($this.data("percent"));
                    });
                }, {
                    offset: "60%"
                });
            } else {
                $allSklBrs.each(function() {
                    var $this = $(this);
                    $this.width($this.data("percent"));
                });
            }
        }
      }, 1000);
      
    }
  };

  Drupal.behaviors.team_carousel = {
    attach: function (context, settings) {
    
        // Team slider
        // -------------
        $(".team-carousel" ,context).each(function() {
          var columns = $(this).data('columns');
          $(this).owlCarousel({
              autoplay: true,
              autoplaySpeed: 1000,
              autoplayTimeout: 5000,
              loop: false,
              margin: 0,
              nav: false,
              autoplayHoverPause: true,
              smartSpeed: 200,
              rewind: true,
              center: false,
              dots: true,
              mouseDrag: true,
              responsive: {
                  0: {
                      items: 1
                  },
                  667: {
                      items: columns
                  }
              }
          });
          $(this).find(".owl-dots").addClass("dotstyle-fall");      
        });
    }
  };

  $(document).ready(function(){    
    full_height();
    parent_height();
    vertical_align();
  });

  window.onresize = function(event) {
    full_height();
    parent_height();
    vertical_align();
  }

  function full_height() {
    $('.full-height').css({'height': $(window).height()});
  }

  function parent_height() {
    $('.parent-height').each(function() {
      $(this).css({'height': $(this).parent().height()});
    });
  }

  function vertical_align() {
    $('.vertical-align').each(function() {
      var padding = ($(this).parent().height() - $(this).height()) / 2 ;
      $(this).css({'padding-top': padding});  
    });
    
  }

})(jQuery);
