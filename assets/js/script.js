/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch = "ontouchstart" in window,

    plugins = {
      pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      bootstrapModalDialog: $('.modal'),
      bootstrapTabs: $(".tabs"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      prettyComments: $('.prettyComments'),
      datePicker: $('.form-input[type="date"]'),
      responsiveTabs: $(".responsive-tabs"),
      owl: $(".owl-carousel"),
      swiper: $(".swiper-slider"),
      statefulButton: $('.btn-stateful'),
      isotope: $(".isotope"),
      popover: $('[data-toggle="popover"]'),
      viewAnimate: $('.view-animate'),
      photoSwipeGallery: $("[data-photo-swipe-item]"),
      radio: $("input[type='radio']"),
      checkbox: $("input[type='checkbox']"),
      customToggle: $("[data-custom-toggle]"),
      dateCountdown: $('.DateCountdown'),
      countDown: $(".countdown"),
      counter: $(".counter"),
      progressBarCustom: $(".progress-bar-js"),
      selectFilter: $(".select2"),
      stepper: $("input[type='number']"),
      progressBar: $(".progress-linear"),
      slick: $('.slick-slider'),
      clipboard: $(".clipboard-btn"),
      customWaypoints: $('[data-custom-scroll-to]')
    };

/**
 * Initialize All Scripts
 */
$document.ready(function () {
 
  if($html.hasClass('desktop')) {
    // apply matchHeight to each item container's items
    $('.equalize-height--js').each(function() {
      $(this).children('.eh-item--js').matchHeight({
        byRow: true
      });
    });
  }  

  
  /**
   * getSwiperHeight
   * @description  calculate the height of swiper slider basing on data attr
   */
  function getSwiperHeight(object, attr) {
    var val = object.attr("data-" + attr),
        dim;

    if (!val) {
      return undefined;
    }

    dim = val.match(/(px)|(%)|(vh)$/i);

    if (dim.length) {
      switch (dim[0]) {
        case "px":
          return parseFloat(val);
        case "vh":
          return $(window).height() * (parseFloat(val) / 100);
        case "%":
          return object.width() * (parseFloat(val) / 100);
      }
    } else {
      return undefined;
    }
  }

  /**
   * toggleSwiperInnerVideos
   * @description  toggle swiper videos on active slides
   */
  function toggleSwiperInnerVideos(swiper) {
    var prevSlide = $(swiper.slides[swiper.previousIndex]),
        nextSlide = $(swiper.slides[swiper.activeIndex]),
        videos;

    prevSlide.find("video").each(function () {
      this.pause();
    });

    videos = nextSlide.find("video");
    if (videos.length) {
      videos.get(0).play();
    }
  }

  /**
   * toggleSwiperCaptionAnimation
   * @description  toggle swiper animations on active slides
   */
  function toggleSwiperCaptionAnimation(swiper) {
    var prevSlide = $(swiper.container),
        nextSlide = $(swiper.slides[swiper.activeIndex]);

    prevSlide
        .find("[data-caption-animate]")
        .each(function () {
          var $this = $(this);
          $this
              .removeClass("animated")
              .removeClass($this.attr("data-caption-animate"))
              .addClass("not-animated");
        });

    nextSlide
        .find("[data-caption-animate]")
        .each(function () {
          var $this = $(this),
              delay = $this.attr("data-caption-delay"),
              duration = $this.attr('data-caption-duration');

          setTimeout(function () {
            $this
                .removeClass("not-animated")
                .addClass($this.attr("data-caption-animate"))
                .addClass("animated");

            if (duration) {
              $this.css('animation-duration', duration + 'ms');
            }
          }, delay ? parseInt(delay) : 0);
        });
  }

  /**
   * makeParallax
   * @description  create swiper parallax scrolling effect
   */
  function makeParallax(el, speed, wrapper, prevScroll) {
    var scrollY = window.scrollY || window.pageYOffset;

    if (prevScroll != scrollY) {
      prevScroll = scrollY;
      el.addClass('no-transition');
      el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
      el.height();
      el.removeClass('no-transition');

      if (el.attr('data-fade') === 'true') {
        var bound = el[0].getBoundingClientRect(),
            offsetTop = bound.top * 2 + scrollY,
            sceneHeight = wrapper.outerHeight(),
            sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
            layerDevider = offsetTop + el.outerHeight() / 2.0,
            pos = sceneHeight / 6.0,
            opacity;
        if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
          el[0].style["opacity"] = 1;
        } else {
          if (sceneDevider - pos < layerDevider) {
            opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
          } else {
            opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
          }
          el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
        }
      }
    }

    requestAnimationFrame(function () {
      makeParallax(el, speed, wrapper, prevScroll);
    });
  }

  /**
   * isScrolledIntoView
   * @description  check the element whas been scrolled into the view
   */
  function isScrolledIntoView(elem) {
    var $window = $(window);
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * initOnView
   * @description  calls a function when element has been scrolled into the view
   */
  function lazyInit(element, func) {
    var $win = jQuery(window);
    $win.on('load scroll', function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    });
  }

  /**
   * attachFormValidator
   * @description  attach form validation to elements
   */
  function attachFormValidator(elements) {
    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) {
        o.addClass("form-control-last-child");
      }
    }

    elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;

          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }

          if ($this.parents('.rd-mailform').hasClass('success')) {
            return;
          }

          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');
  }

  /**
   * isValidated
   * @description  check if all elemnts pass validation
   */
  function isValidated(elements) {
    var results, errors = 0;
    if (elements.length) {
      for (j = 0; j < elements.length; j++) {

        var $input = $(elements[j]);

        if ((results = $input.regula('validate')).length) {
          for (k = 0; k < results.length; k++) {
            errors++;
            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
          }
        } else {
          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }

      return errors == 0;
    }
    return true;
  }

  /**
   * Init Bootstrap tooltip
   * @description  calls a function when need to init bootstrap tooltips
   */
  function initBootstrapTooltip(tooltipPlacement) {
    if (window.innerWidth < 599) {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltip({
        placement: 'bottom'
      });
    } else {
      plugins.bootstrapTooltip.tooltip('destroy');
      plugins.bootstrapTooltip.tooltipPlacement;
      plugins.bootstrapTooltip.tooltip();
    }
  }


  /**
   * makeWaypointScroll
   * @description  init smooth anchor animations
   */
  function makeWaypointScroll(obj, offsetTop) { console.log(offsetTop);
    var $this = $(obj);
    $this.on('click', function (e) {
      e.preventDefault();
      $("body, html").stop().animate({
        scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top+parseInt(offsetTop)
      }, 1000, function () {
        $window.trigger("resize");
      });
    });
  }



  /**
   * Copyright Year
   * @description  Evaluates correct copyright year
   */
  var o = $("#copyright-year");
  if (o.length) {
    o.text(initialDate.getFullYear());
  }

  /**
   * IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (isIE < 10) {
      $html.addClass("lt-ie-10");
    }

    if (isIE < 11) {
      if (plugins.pointerEvents) {
        $.getScript(plugins.pointerEvents)
            .done(function () {
              $html.addClass("ie-10");
              PointerEventsPolyfill.initialize({});
            });
      }
    }

    if (isIE === 11) {
      $("html").addClass("ie-11");
    }

    if (isIE === 12) {
      $("html").addClass("ie-edge");
    }
  }

  /**
   * Bootstrap Tooltips
   * @description Activate Bootstrap Tooltips
   */
  if (plugins.bootstrapTooltip.length) {
    var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
    initBootstrapTooltip(tooltipPlacement);
    $(window).on('resize orientationchange', function () {
      initBootstrapTooltip(tooltipPlacement);
    })
  }

  /**
   * bootstrapModalDialog
   * @description Stap vioeo in bootstrapModalDialog
   */
  if (plugins.bootstrapModalDialog.length > 0) {
    var i = 0;

    for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
      var modalItem = $(plugins.bootstrapModalDialog[i]);

      modalItem.on('hidden.bs.modal', $.proxy(function () {
        var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');

        if (rdVideoInside.length) {
          rdVideoInside[0].pause();
        }

        if (youTubeVideoInside.length) {
          var videoUrl = youTubeVideoInside.attr('src');

          youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
        }
      }, modalItem))
    }
  }

  /**
   * Progress bar
   * @description  Enable progress bar
   */
  if (plugins.progressBar.length) {
    for (i = 0; i < plugins.progressBar.length; i++) {
      var progressBar = $(plugins.progressBar[i]);
      $window
          .on("scroll load", $.proxy(function () {
            var bar = $(this);
            if (!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
              var end = bar.attr("data-to");
              bar.find('.progress-bar-linear').css({width: end + '%'});
              bar.find('.progress-value').countTo({
                refreshInterval: 40,
                from: 0,
                to: end,
                speed: 500
              });
              bar.addClass('animated-first');
            }
          }, progressBar));
    }
  }


  /**
   * Responsive Tabs
   * @description Enables Responsive Tabs plugin
   */
  if (plugins.responsiveTabs.length > 0) {
    var i;

    for (i = 0; i < plugins.responsiveTabs.length; i++) {
      var responsiveTabsItem = $(plugins.responsiveTabs[i]);

      responsiveTabsItem.easyResponsiveTabs({
        type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
      });

      //If have owl carousel inside tab - resize owl carousel on click
      if (responsiveTabsItem.find('.owl-carousel').length) {
        responsiveTabsItem.find('.resp-tab-item').on('click', $.proxy(function (event) {
          var $this = $(this),
              carouselObj = ($this.find('.resp-tab-content-active .owl-carousel').owlCarousel()).data('owlCarousel');

          if (carouselObj && typeof carouselObj.onResize === "function") {
            carouselObj.onResize();
          }
        }, responsiveTabsItem));

        responsiveTabsItem.find('.resp-accordion').on('click', $.proxy(function (event) {
          var $this = $(this),
              carouselObj = ($this.find('.resp-tab-content-active .owl-carousel').owlCarousel()).data('owlCarousel');

          if (carouselObj && typeof carouselObj.onResize === "function") {
            carouselObj.onResize();
          }
        }, responsiveTabsItem));
      }

      //If have slick carousel inside tab - resize slick carousel on click
      if (responsiveTabsItem.find('.slick-slider').length) {

        responsiveTabsItem.find('.resp-tab-item').on('click', $.proxy(function (event) {
          var $this = $(this);
          $this.find('.resp-tab-content-active .slick-slider').slick('setPosition');
        }, responsiveTabsItem));

        responsiveTabsItem.find('.resp-accordion').on('click', $.proxy(function (event) {
          var $this = $(this);

          $this.find('.resp-tab-content-active .slick-slider').slick('setPosition');
          console.log(1);
        }, responsiveTabsItem));
      }

      // Enable external buttons (prev, text tab)
      if (responsiveTabsItem.attr('data-external-buttons') == "true") {
        var list = responsiveTabsItem.find('.resp-tabs-list li'),
            newList = '<ul class="resp-tabs-extertal-list">';

        for (var j = 0; j < list.length; j++) {
          newList += '<li><span>' + $(list[j]).text() + '</span></li>';
        }
        newList += '</ul>';


        responsiveTabsItem.find('.resp-tabs-container').before('<div class="resp-tab-external-prev"></div>')
        responsiveTabsItem.find('.resp-tab-external-prev').html(newList);
        responsiveTabsItem.find('.resp-tabs-container').after('<div class="resp-tab-external-next"></div>');
        responsiveTabsItem.find('.resp-tab-external-next').html(newList);

        changeExternalButtons(responsiveTabsItem);

        responsiveTabsItem.find('.resp-tab-external-prev').on('click', $.proxy(function (event) {
          var $this = $(this);

          changeExternalButtons($this, 'prev');
        }, responsiveTabsItem));

        responsiveTabsItem.find('.resp-tab-external-next').on('click', $.proxy(function (event) {
          var $this = $(this);

          changeExternalButtons($this, 'next');
        }, responsiveTabsItem));

        responsiveTabsItem.find('.resp-tabs-list .resp-tab-item').on('click', $.proxy(function (event) {
          var $this = $(this);

          changeExternalButtons($this);
        }, responsiveTabsItem));
      }
    }
  }


  /**
   * Radio
   * @description Add custom styling options for input[type="radio"]
   */
  if (plugins.radio.length) {
    var i;
    for (i = 0; i < plugins.radio.length; i++) {
      var $this = $(plugins.radio[i]);
      $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
    }
  }

  /**
   * Checkbox
   * @description Add custom styling options for input[type="checkbox"]
   */
  if (plugins.checkbox.length) {
    var i;
    for (i = 0; i < plugins.checkbox.length; i++) {
      var $this = $(plugins.checkbox[i]);
      $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
    }
  }

  /**
   * Popovers
   * @description Enables Popovers plugin
   */
  if (plugins.popover.length) {
    if (window.innerWidth < 767) {
      plugins.popover.attr('data-placement', 'bottom');
      plugins.popover.popover();
    }
    else {
      plugins.popover.popover();
    }
  }

  /**
   * Bootstrap Buttons
   * @description  Enable Bootstrap Buttons plugin
   */
  if (plugins.statefulButton.length) {
    $(plugins.statefulButton).on('click', function () {
      var statefulButtonLoading = $(this).button('loading');

      setTimeout(function () {
        statefulButtonLoading.button('reset')
      }, 2000);
    })
  }


  /**
   * ViewPort Universal
   * @description Add class in viewport
   */
  if (plugins.viewAnimate.length) {
    var i;
    for (i = 0; i < plugins.viewAnimate.length; i++) {
      var $view = $(plugins.viewAnimate[i]).not('.active');
      $document.on("scroll", $.proxy(function () {
            if (isScrolledIntoView(this)) {
              this.addClass("active");
            }
          }, $view))
          .trigger("scroll");
    }
  }

  /**
   * Swiper 3.4.1 (Old: 3.1.7)
   * @description  Enable Swiper Slider
   */
  if (plugins.swiper.length) {
    var i;
    for (i = 0; i < plugins.swiper.length; i++) {
      var s = $(plugins.swiper[i]);
      var pag = s.find(".swiper-pagination"),
          next = s.find(".swiper-button-next"),
          prev = s.find(".swiper-button-prev"),
          bar = s.find(".swiper-scrollbar"),
          parallax = s.parents('.rd-parallax').length,
          swiperSlide = s.find(".swiper-slide");

      for (j = 0; j < swiperSlide.length; j++) {
        var $this = $(swiperSlide[j]),
            url;

        if (url = $this.attr("data-slide-bg")) {
          $this.css({
            "background-image": "url(" + url + ")",
            "background-size": "cover"
          })
        }
      }

      swiperSlide.end()
          .find("[data-caption-animate]")
          .addClass("not-animated")
          .end()
          .swiper({
            autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
            direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
            effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
            speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
            keyboardControl: s.attr('data-keyboard') === "true",
            mousewheelControl: s.attr('data-mousewheel') === "true",
            mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
            nextButton: next.length ? next.get(0) : null,
            prevButton: prev.length ? prev.get(0) : null,
            pagination: pag.length ? pag.get(0) : null,
            paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
            paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            } : null : null,
            scrollbar: bar.length ? bar.get(0) : null,
            scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
            scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
            loop: (s.attr('data-loop') !== "false" || loopSwitcher == 'off') ? false : true,
            simulateTouch: s.attr('data-simulate-touch') ? s.attr('data-simulate-touch') === "true" : false,
            onTransitionStart: function (swiper) {
              toggleSwiperInnerVideos(swiper);
            },
            onTransitionEnd: function (swiper) {
              toggleSwiperCaptionAnimation(swiper);
            },
            onInit: function (swiper) {
              toggleSwiperInnerVideos(swiper);
              toggleSwiperCaptionAnimation(swiper);

              var swiperParalax = s.find(".swiper-parallax");
              
              if(swiper.slides.length === 1 ) var loopSwitcher = 'off';

              for (var k = 0; k < swiperParalax.length; k++) {
                var $this = $(swiperParalax[k]),
                    speed;

                if (parallax && !isIEBrows && !isMobile) {
                  if (speed = $this.attr("data-speed")) {
                    makeParallax($this, speed, s, false);
                  }
                }
              }
              $(window).on('resize', function () {
                swiper.update(true);
              })
            }
          });

      $(window)
          .on("resize", function () {
            var mh = getSwiperHeight(s, "min-height"),
                h = getSwiperHeight(s, "height");
            if (h) {
              s.css("height", mh ? mh > h ? mh : h : h);
            }
          })
          .trigger("resize");
    }
  }


  /**
   * Owl carousel
   * @description Enables Owl carousel plugin
   */
  if (plugins.owl.length) {
    var i;
    for (i = 0; i < plugins.owl.length; i++) {
      var c = $(plugins.owl[i]),
          responsive = {};

      var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
          values = [0, 480, 768, 992, 1200],
          j, k;

      for (j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
          }
        }
      }

      c.owlCarousel({
        autoplay: c.attr("data-autoplay") === "true",
        loop: c.attr("data-loop") !== "false",
        items: 1,
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
        animateIn: 'fadeIn',
        animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
        responsive: responsive,
        navText: [],
        center: c.attr("data-center") === "true",
        navSpeed: 800,
      });
    }
  }

  /**
   * Isotope
   * @description Enables Isotope plugin
   */
  if (plugins.isotope.length) {
    var i, j, isogroup = [];
    for (i = 0; i < plugins.isotope.length; i++) {
      var isotopeItem = plugins.isotope[i],
          filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
          iso;

      iso = new Isotope(isotopeItem, {
        itemSelector: '.isotope-item',
        layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
        filter: '*',
        masonry: {
          columnWidth: 0.66
        }
      });

      isogroup.push(iso);

      filterItems.on("click", function (e) {
        e.preventDefault();
        var filter = $(this),
            iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
            filtersContainer = filter.closest(".isotope-filters");

        filtersContainer
            .find('.active')
            .removeClass("active");
        filter.addClass("active");

        iso.isotope({
          itemSelector: '.isotope-item',
          layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
          filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]',
          masonry: {
            columnWidth: 0.66
          }
        });

        $window.trigger('resize');

        // If d3Charts contains in isotop, resize it on click.
        if (filtersContainer.hasClass('isotope-has-d3-graphs') && c3ChartsArray != undefined) {
          setTimeout(function () {
            for (var j = 0; j < c3ChartsArray.length; j++) {
              c3ChartsArray[j].resize();
            }
          }, 500);
        }

      }).eq(0).trigger("click");
    }

    $(window).on('load', function () {
      setTimeout(function () {
        var i;
        for (i = 0; i < isogroup.length; i++) {
          isogroup[i].element.className += " isotope--loaded";
          isogroup[i].layout();
        }
      }, 600);
    });
  }

  /**
   * Select2
   * @description Enables select2 plugin
   */
  if (plugins.selectFilter.length) {
    var i;
    for (i = 0; i < plugins.selectFilter.length; i++) {
      var select = $(plugins.selectFilter[i]);

      select.select2({
        theme: "bootstrap"
      }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
    }
  }

  /**
   * WOW
   * @description Enables Wow animation plugin
   */
  if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
    new WOW().init();
  }

  /**
   * Bootstrap tabs
   * @description Activate Bootstrap Tabs
   */
  if (plugins.bootstrapTabs.length) {
    var i;
    for (i = 0; i < plugins.bootstrapTabs.length; i++) {
      var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

      bootstrapTabsItem.on("click", "a", function (event) {
        event.preventDefault();
        $(this).tab('show');
      });
    }
  }

  /**
   * jQuery Count To
   * @description Enables Count To plugin
   */
  if (plugins.counter.length) {
    var i;

    for (i = 0; i < plugins.counter.length; i++) {
      var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
      $document
          .on("scroll", $.proxy(function () {
            var $this = this;

            if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
              $this.countTo({
                refreshInterval: 40,
                speed: $this.attr("data-speed") || 1000
              });
              $this.addClass('animated');
            }
          }, $counterNotAnimated))
          .trigger("scroll");
    }
  }

  /**
   * jQuery Countdown
   * @description  Enable countdown plugin
   */
  if (plugins.countDown.length) {
    var i;
    for (i = 0; i < plugins.countDown.length; i++) {
      var countDownItem = plugins.countDown[i],
          d = new Date(),
          type = countDownItem.getAttribute('data-type'),
          time = countDownItem.getAttribute('data-time'),
          format = countDownItem.getAttribute('data-format'),
          settings = [];

      d.setTime(Date.parse(time)).toLocaleString();
      settings[type] = d;
      settings['format'] = format;
      $(countDownItem).countdown(settings);
    }
  }

  /**
   * TimeCircles
   * @description  Enable TimeCircles plugin
   */
  if (plugins.dateCountdown.length) {
    var i;
    for (i = 0; i < plugins.dateCountdown.length; i++) {
      var dateCountdownItem = $(plugins.dateCountdown[i]),
          time = {
            "Days": {
              "text": "Days",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Hours": {
              "text": "Hours",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Minutes": {
              "text": "Minutes",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            },
            "Seconds": {
              "text": "Seconds",
              "show": true,
              color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
            }
          };

      dateCountdownItem.TimeCircles({
        color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "rgba(247, 247, 247, 1)",
        animation: "smooth",
        bg_width: dateCountdownItem.attr("data-bg-width") ? dateCountdownItem.attr("data-bg-width") : 1.1,
        circle_bg_color: dateCountdownItem.attr("data-bg") ? dateCountdownItem.attr("data-bg") : "rgba(0, 0, 0, 1)",
        fg_width: dateCountdownItem.attr("data-width") ? dateCountdownItem.attr("data-width") : 0.04
      });

      $(window).on('load resize orientationchange', function () {
        if (window.innerWidth < 479) {
          dateCountdownItem.TimeCircles({
            time: {
              "Days": {
                "text": "Days",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Hours": {
                "text": "Hours",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Minutes": {
                "text": "Minutes",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              Seconds: {
                "text": "Seconds",
                show: false,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              }
            }
          }).rebuild();
        } else if (window.innerWidth < 767) {
          dateCountdownItem.TimeCircles({
            time: {
              "Days": {
                "text": "Days",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Hours": {
                "text": "Hours",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Minutes": {
                "text": "Minutes",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              Seconds: {
                "text": "Seconds",
                show: false,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              }
            }
          }).rebuild();
        } else {
          dateCountdownItem.TimeCircles({
            time: {
              "Days": {
                "text": "Days",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Hours": {
                "text": "Hours",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Minutes": {
                "text": "Minutes",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              },
              "Seconds": {
                "text": "Seconds",
                "show": true,
                color: dateCountdownItem.attr("data-color") ? dateCountdownItem.attr("data-color") : "#f9f9f9"
              }
            }
          }).rebuild();
        }
      });
    }
  }

  /**
   * PhotoSwipe Gallery
   * @description Enables PhotoSwipe Gallery plugin
   */
  if (plugins.photoSwipeGallery.length) {
    // init image click event
    $document.delegate("[data-photo-swipe-item]", "click", function(event) {
      event.preventDefault();

      var $el = $(this),
          $galleryItems = $el.parents("[data-photo-swipe-gallery]").find("a[data-photo-swipe-item]"),
          pswpElement = document.querySelectorAll('.pswp')[0],
          encounteredItems = {},
          pswpItems = [],
          options,
          pswpIndex = 0,
          pswp;

      if ($galleryItems.length == 0) {
        $galleryItems = $el;
      }

      // loop over the gallery to build up the photoswipe items
      $galleryItems.each(function () {
        var $item = $(this),
            src = $item.attr('href'),
            size = $item.attr('data-size').split('x'),
            pswdItem;

        if ($item.is(':visible')) {

          // if we have this image the first time
          if (!encounteredItems[src]) {
            // build the photoswipe item
            pswdItem = {
              src: src,
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10),
              el: $item // save link to element for getThumbBoundsFn
            };

            // store that we already had this item
            encounteredItems[src] = {
              item: pswdItem,
              index: pswpIndex
            };

            // push the item to the photoswipe list
            pswpItems.push(pswdItem);
            pswpIndex++;
          }
        }
      });

      options = {
        index: encounteredItems[$el.attr('href')].index,

        getThumbBoundsFn: function (index) {
          var $el = pswpItems[index].el,
              offset = $el.offset();

          return {
            x: offset.left,
            y: offset.top,
            w: $el.width()
          };
        }
      };

      // open the photoswipe gallery
      pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswpItems, options);
      pswp.init();
    });
  }

  
  /**
   * Custom Toggles
   */
  if (plugins.customToggle.length) {
    var i;

    for (i = 0; i < plugins.customToggle.length; i++) {
      var $this = $(plugins.customToggle[i]);

      $this.on('click', $.proxy(function (event) {
        event.preventDefault();
        var $ctx = $(this);
        $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
      }, $this));

      if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
        $("body").on("click", $this, function (e) {
          if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length == 0) {
            $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
          }
        })
      }
    }
  }

  /**
   * Progress bar
   * @description  Enable progress bar
   */
  if (plugins.progressBarCustom.length) {
    var i,
        bar,
        type;

    for (i = 0; i < plugins.progressBarCustom.length; i++) {
      var progressItem = plugins.progressBarCustom[i];
      bar = null;

      if (progressItem.className.indexOf("progress-bar-horizontal") > -1) {
        type = 'Line';
      }

      if (progressItem.className.indexOf("progress-bar-radial") > -1) {
        type = 'Circle';
      }

      if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
        bar = new ProgressBar[type](progressItem, {
          strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100),
          trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0,
          text: {
            value: progressItem.getAttribute("data-counter") === "true" ? '0' : null,
            className: 'progress-bar__body',
            style: null
          }
        });
        bar.svg.setAttribute('preserveAspectRatio', "none meet");
        if (type === 'Line') {
          bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
        }

        bar.path.removeAttribute("stroke");
        bar.path.className.baseVal = "progress-bar__stroke";
        if (bar.trail) {
          bar.trail.removeAttribute("stroke");
          bar.trail.className.baseVal = "progress-bar__trail";
        }

        if (progressItem.getAttribute("data-easing") && !isIE) {
          $(document)
              .on("scroll", {"barItem": bar}, $.proxy(function (event) {
                var bar = event.data.barItem;
                var $this = $(this);

                if (isScrolledIntoView($this) && this.className.indexOf("progress-bar--animated") === -1) {
                  this.className += " progress-bar--animated";
                  bar.animate(parseInt($this.attr("data-value")) / 100.0, {
                    easing: $this.attr("data-easing"),
                    duration: $this.attr("data-duration") ? parseInt($this.attr("data-duration")) : 800,
                    step: function (state, b) {
                      if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                          b._container.className.indexOf("progress-bar-vertical") > -1) {
                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                      }
                      b.setText(Math.abs(b.value() * 100).toFixed(0));
                    }
                  });
                }
              }, progressItem))
              .trigger("scroll");
        } else {
          bar.set(parseInt($(progressItem).attr("data-value")) / 100.0);
          bar.setText($(progressItem).attr("data-value"));
          if (type === 'Line') {
            bar.text.style.width = parseInt($(progressItem).attr("data-value")) + "%";
          }
        }
      } else {
        console.error(progressItem.className + ": progress bar type is not defined");
      }
    }
  }

  /**
   * Stepper
   * @description Enables Stepper Plugin
   */
  if (plugins.stepper.length) {
    plugins.stepper.stepper({
      labels: {
        up: "",
        down: ""
      }
    });
  }

  /**
   * Slick carousel
   * @description  Enable Slick carousel plugin
   */
  if (plugins.slick.length) {
    var i;
    for (i = 0; i < plugins.slick.length; i++) {
      var $slickItem = $(plugins.slick[i]);

      $slickItem.slick({
        //slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
        asNavFor: $slickItem.attr('data-for') || false,
        dots: $slickItem.attr("data-dots") == "true",
        infinite: $slickItem.attr("data-loop") == "true",
        focusOnSelect: true,
        pauseOnHover: ($slickItem.attr("data-pause-hover") === "false") ? false : true,
        arrows: $slickItem.attr("data-arrows") == "true",
        swipe: $slickItem.attr("data-swipe") == "true",
        autoplay: $slickItem.attr("data-autoplay") == "true",
        autoplaySpeed: $slickItem.attr("data-autoplay-speed") || 3000,
        vertical: $slickItem.attr("data-vertical") == "true",
        centerMode: $slickItem.attr("data-center-mode") == "true",
        centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
        fade: $slickItem.attr("data-transition-fade") ? true : false,
        speed: $slickItem.attr("data-transition-speed") ? $slickItem.attr("data-transition-speed") : 700,
        mobileFirst: true,
        responsive: [
          {
            breakpoint: 0,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
              slidesToScroll: parseInt($slickItem.attr('data-items')) || 1,
            }
          },
          {
            breakpoint: 479,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
              slidesToScroll: parseInt($slickItem.attr('data-xs-items')) || 1,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
              slidesToScroll:  parseInt($slickItem.attr('data-sm-items')) || 1,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
              slidesToScroll: parseInt($slickItem.attr('data-md-items')) || 1,
            }
          },
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
              slidesToScroll: parseInt($slickItem.attr('data-lg-items')) || 1,
            }
          },
          {
            breakpoint: 1799,
            settings: {
              slidesToShow: parseInt($slickItem.attr('data-xl-items')) || 1,
              slidesToScroll: parseInt($slickItem.attr('data-xl-items')) || 1,
            }
          },
        ]
      }).on('afterChange', function (event, slick, currentSlide, nextSlide) {
            var $this = $(this),
                childCarousel = $this.attr('data-child');

            if (childCarousel) {
              $(childCarousel + ' .slick-slide').removeClass('slick-current');
              $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
            }
          });
    }
  }

  /**
   * prettyComments
   * @description Enables PrettyComments Plugin
   */
  if (plugins.prettyComments.length) {
    $('.prettyComments').prettyComments({
      animate: true, //true/false
      animationSpeed: 'slow', //'slow'/'normal'/'fast'
      maxHeight: 3000 // numeric value
    });
  }

  /**
   * Custom Waypoints
   */
  if (plugins.customWaypoints.length) {
    var i;
    for (i = 0; i < plugins.customWaypoints.length; i++) {
      var $this = $(plugins.customWaypoints[i]);
      var offsetTop = $this.attr('data-custom-scroll-to-pos');
      makeWaypointScroll($this, offsetTop);
    }
  }


  /**
   * RD Input Label
   * @description Enables RD Input Label Plugin
   */
  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }

  /**
   * Regula
   * @description Enables Regula plugin
   */
  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }

  /**
   * RD Mailform
   */
  if (plugins.rdMailForm.length) {
    var i, j, k,
        msg = {
          'MF000': 'Successfully sent!',
          'MF001': 'Recipients are not set!',
          'MF002': 'Form will not work locally!',
          'MF003': 'Please, define email field in your form!',
          'MF004': 'Please, define type of your form!',
          'MF254': 'Something went wrong with PHPMailer!',
          'MF255': 'Aw, snap! Something went wrong.'
        };

    for (i = 0; i < plugins.rdMailForm.length; i++) {
      var $form = $(plugins.rdMailForm[i]);

      $form.attr('novalidate', 'novalidate').ajaxForm({
        data: {
          "form-type": $form.attr("data-form-type") || "contact",
          "counter": i
        },
        beforeSubmit: function () {
          var form = $(plugins.rdMailForm[this.extraData.counter]);
          var inputs = form.find("[data-constraints]");
          if (isValidated(inputs)) {
            var output = $("#" + form.attr("data-form-output"));

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              output.addClass("active");
            }
          } else {
            return false;
          }
        },
        error: function (result) {
          var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output"));
          output.text(msg[result]);
        },
        success: function (result) {
          var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output")),
              $select = form.find('select');

          // Clear select2 after submit form
          if ($select.length) {
            for (j = 0; j < $select.length; j++) {
              var $selectitem = $($select[j]);
              $selectitem.select2('val', null);
            }
          }

          form.addClass('success');
          result = result.length == 5 ? result : 'MF255';
          output.text(msg[result]);

          if (result === "MF000") {
            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
            }
            output.addClass("success active");
          } else {
            if (output.hasClass("snackbars")) {
              output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
            }
            output.addClass("error active");
          }

          form.clearForm();
          form.find('input, textarea').blur();

          setTimeout(function () {
            output.removeClass("active error success");
            form.removeClass('success');
          }, 5000);
        }
      });
    }
  }

  

  /**
   * Misc
   *
  **/
  $('.slidepanel_toggle').click(function() {
    $('.slidepanel, .slidepanel_toggle').toggleClass('active');
  })

  // Clipboard plugin
  if (plugins.clipboard.length) {
    new Clipboard('.clipboard-btn');
  }

 
});
