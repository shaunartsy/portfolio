/*
  [JS Index]
  
  ---
  
  Template Name: Ultimex - One Page Portfolio Template
  Author:  ex-nihilo
  Version: 1.2
*/


/*
  1. preloader

  2. lifting control
  3. mobile menu closer
  4. GSAP Horizontal Scroll
    4.1. horizontal scroll initialization
  5. magnificPopup
    5.1. magnificPopup single
    5.2. magnificPopup gallery
  6. swiper slider
  7. facts counter
  8. chart skills
  9. clone function
    9.1. vertical lines
  10. contact form
*/


$(function () {
    "use strict";


    $(window).on("load", function () {
        // 1. preloader
        $("#preloader").delay(1200).fadeOut(600);
        $(".preloader-bg").delay(1600).fadeOut(600);
    });

    // 2. lifting control
    $(".navbar-collapse ul li a").on("click", function (e) {
        e.preventDefault();
        animateSlider(this.hash);
    });
    function animateSlider(hash) {
        if (!$("#containerOT div.open").length) {
            if (hash == "#about") {
                openPopup(hash);
            }
            if (hash == "#services") {
                openPopup(hash);
            }
            if (hash == "#works") {
                openPopup(hash);
            }
            if (hash == "#news") {
                openPopup(hash);
            }
            if (hash == "#contact") {
                openPopup(hash);
            }
        } else {
            if (hash == "#home") {
                openAndClose(hash);
                $("#overlay").fadeOut(600);
            }
            if (hash == "#about") {
                openAndClose(hash);
            }
            if (hash == "#services") {
                openAndClose(hash);
            }
            if (hash == "#works") {
                openAndClose(hash);
            }
            if (hash == "#news") {
                openAndClose(hash);
            }
            if (hash == "#contact") {
                openAndClose(hash);
            }
        }
    }
    function openPopup(hash) {
        $(hash + "-lifting").slideToggle().addClass("open");
        $("#overlay").fadeIn(600);
        refreshOverlayScroller(hash);
        animateOverlayContent(hash);
    }
    function openAndClose(hash) {
        if ($(hash + "-lifting").hasClass("open")) {
            $($(hash + "-lifting")).slideToggle().removeClass();
            $("#overlay").fadeOut(600);
        } else {
            $("#containerOT div.open").slideToggle().removeClass();
            $(hash + "-lifting").slideToggle().addClass("open");
            refreshOverlayScroller(hash);
            animateOverlayContent(hash);
        }
    }
    $("#overlay").on("click", function () {
        $("#containerOT div.open").slideToggle().removeClass();
        $("#overlay").fadeOut(600);
    });

    // 3. mobile menu closer
    $(".navbar-collapse ul li a").on("click", function () {
        $(".navbar-toggle:visible").click();
    });

    // 4. GSAP Horizontal Scroll for Overlay Sections
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Horizontal scroll configuration for each overlay
    function initHorizontalScroll(containerId, wrapperId, navId) {
        const container = document.getElementById(containerId);
        const wrapper = document.getElementById(wrapperId);
        const navContainer = document.getElementById(navId);

        if (!container || !wrapper) return;

        const slides = wrapper.querySelectorAll('.gsap-horizontal-slide');
        const totalSlides = slides.length;
        let currentSlide = 0;

        // Set initial slide widths to match container
        function updateSlideWidths() {
            const containerWidth = container.offsetWidth;
            slides.forEach(slide => {
                slide.style.width = containerWidth + 'px';
                slide.style.minWidth = containerWidth + 'px';
            });
        }
        updateSlideWidths();
        window.addEventListener('resize', updateSlideWidths);

        // Navigate to a specific slide
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentSlide = index;

            const containerWidth = container.offsetWidth;
            gsap.to(wrapper, {
                x: -currentSlide * containerWidth,
                duration: 1.5,
                ease: 'power3.out'
            });

            updateNavButtons();
        }

        // Create navigation buttons
        function createNavButtons() {
            if (!navContainer) return;

            navContainer.innerHTML = '';

            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="ion-chevron-left"></i>';
            prevBtn.className = 'gsap-nav-prev';
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));

            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="ion-chevron-right"></i>';
            nextBtn.className = 'gsap-nav-next';
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

            navContainer.appendChild(prevBtn);
            navContainer.appendChild(nextBtn);
        }
        createNavButtons();

        // Update navigation button states
        function updateNavButtons() {
            if (!navContainer) return;
            const prevBtn = navContainer.querySelector('.gsap-nav-prev');
            const nextBtn = navContainer.querySelector('.gsap-nav-next');

            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide >= totalSlides - 1;
        }
        updateNavButtons();

        // Handle wheel events for horizontal scroll
        let isScrolling = false;
        container.addEventListener('wheel', function (e) {
            if (isScrolling) return;

            // Find the scrollable element in the current slide
            const currentSlideEl = slides[currentSlide];
            const scrollableContent = currentSlideEl.querySelector('.post-block-second');
            let isAtBottom = true;
            let isAtTop = true;

            if (scrollableContent) {
                // Check if content is scrollable
                if (scrollableContent.scrollHeight > scrollableContent.clientHeight) {
                    // Check limits with a small tolerance for rounding
                    isAtBottom = scrollableContent.scrollTop + scrollableContent.clientHeight >= scrollableContent.scrollHeight - 2;
                    isAtTop = scrollableContent.scrollTop <= 0;
                }
            }

            // Prevent default only if we can scroll in that direction AND we hit the vertical limit
            const canScrollLeft = currentSlide > 0;
            const canScrollRight = currentSlide < totalSlides - 1;

            if (e.deltaY > 0) {
                // Scrolling DOWN
                if (!isAtBottom) {
                    // Let normal vertical scroll happen
                    e.stopPropagation(); // Stop bubbling to prevent other handlers
                    return;
                }
                if (canScrollRight) {
                    e.preventDefault();
                    isScrolling = true;
                    goToSlide(currentSlide + 1);
                    setTimeout(() => { isScrolling = false; }, 1500);
                }
            } else if (e.deltaY < 0) {
                // Scrolling UP
                if (!isAtTop) {
                    // Let normal vertical scroll happen
                    e.stopPropagation();
                    return;
                }
                if (canScrollLeft) {
                    e.preventDefault();
                    isScrolling = true;
                    goToSlide(currentSlide - 1);
                    setTimeout(() => { isScrolling = false; }, 1500);
                }
            }
        }, { passive: false });

        // Handle touch events for mobile swipe
        // Handle touch events for mobile swipe
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        container.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        container.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Only trigger if horizontal movement is greater than vertical movement
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > swipeThreshold) {
                    if (diffX > 0) {
                        // Swipe left - next slide
                        goToSlide(currentSlide + 1);
                    } else {
                        // Swipe right - previous slide
                        goToSlide(currentSlide - 1);
                    }
                }
            }
        }

        // Reset to first slide when overlay is opened
        return {
            reset: function () {
                currentSlide = 0;
                gsap.set(wrapper, { x: 0 });
                updateNavButtons();
            },
            update: updateSlideWidths
        };
    }

    // Initialize horizontal scroll for each overlay section
    const aboutScroller = initHorizontalScroll('about-scroller', 'about-wrapper', 'about-nav');
    const servicesScroller = initHorizontalScroll('services-scroller', 'services-wrapper', 'services-nav');
    const worksScroller = initHorizontalScroll('works-scroller', 'works-wrapper', 'works-nav');
    const contactScroller = initHorizontalScroll('contact-scroller', 'contact-wrapper', 'contact-nav');

    // Helper to refresh scroller when overlay opens
    function refreshOverlayScroller(hash) {
        let scroller = null;
        if (hash === '#about') scroller = aboutScroller;
        if (hash === '#services') scroller = servicesScroller;
        if (hash === '#works') scroller = worksScroller;
        if (hash === '#contact') scroller = contactScroller;

        if (scroller) {
            // Slight delay to allow display:block to take effect if needed
            setTimeout(() => {
                scroller.update();
                scroller.reset();
            }, 50);
        }
    }

    // Helper to animate content when overlay opens
    function animateOverlayContent(hash) {
        var overlay = $(hash + "-lifting");

        // Select elements to animate
        var elements = overlay.find(".page-title-content, .section-heading, .post-heading, .post-title, p, .post-box, .works-item, .facts, .contact-form, .btn");

        // Kill existing animations
        gsap.killTweensOf(elements);

        // Set initial state (hidden and pushed down)
        gsap.set(elements, { y: 30, opacity: 0 });

        // Animate to visible state
        gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.2, // Wait for slideToggle to open a bit
            clearProps: "transform" // Keep opacity 1, remove transform to avoid blurring or fixed positions
        });
    }

    // 5. magnificPopup
    // 5.1. magnificPopup single
    $(".popup-photo-single").magnificPopup({
        type: "image",
        gallery: {
            enabled: false
        },
        removalDelay: 100,
        mainClass: "mfp-fade"
    });
    // 5.2. magnificPopup gallery
    $(".popup-photo-gallery").each(function () {
        $(this).magnificPopup({
            delegate: "a",
            type: "image",
            gallery: {
                enabled: true
            },
            removalDelay: 100,
            mainClass: "mfp-fade"
            // fixedContentPos: false
        });
    });

    // 6. swiper slider
    var swiper = new Swiper(".hero-slider .swiper-container", {
        preloadImages: false,
        loop: true,
        resistance: true,
        resistanceRatio: 0.85,
        parallax: false,
        effect: "slide",
        mousewheel: {
            enable: true
        },
        grabCursor: true,
        centeredSlides: false,
        speed: 2500,
        spaceBetween: 0,
        init: true,
        pagination: {
            el: ".swiper-slide-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".slide-next",
            prevEl: ".slide-prev"
        },
        autoplay: {
            delay: 4500,
            disableOnInteraction: false
        },
        breakpoints: {
            768: {
                pagination: false
            }
        }
    });
    var imgSwiper = new Swiper(".hero-slider-img .swiper-container", {
        preloadImages: false,
        loop: true,
        resistance: true,
        parallax: true,
        effect: "slide",
        mousewheel: {
            enable: true
        }
    });
    swiper.controller.control = imgSwiper;
    imgSwiper.controller.control = swiper;
    var playButton = $(".swiper-slide-controls-play-pause-wrapper");
    function autoEnd() {
        playButton.removeClass("slider-on-off");
        swiper.autoplay.stop();
    }
    function autoStart() {
        playButton.addClass("slider-on-off");
        swiper.autoplay.start();
    }
    playButton.on("click", function () {
        if (playButton.hasClass("slider-on-off")) autoEnd();
        else autoStart();
        return false;
    });

    // 7. facts counter
    $(".facts-counter-number").appear(function () {
        var count = $(this);
        count.countTo({
            from: 0,
            to: count.html(),
            speed: 1200,
            refreshInterval: 60
        });
    });

    // 8. chart skills
    $(".chart-appear-skills").appear(function () {
        $(".chart-skills").easyPieChart({
            easing: "easeOutBounce",
            onStep: function (from, to, percent) {
                $(this.el).find(".percent-skills").text(Math.round(percent));
            }
        });
    });

    // 9. clone function
    $.fn.duplicate = function (count, cloneEvents, callback) {
        var stack = [],
            el;
        while (count--) {
            el = this.clone(cloneEvents);
            callback && callback.call(el);
            stack.push(el.get()[0]);
        }
        return this.pushStack(stack);
    };
    // 9.1. vertical lines
    $("<div class='vertical-lines-wrapper'></div>").appendTo(".vertical-lines");
    $("<div class='vertical-effect'></div>").duplicate(3).appendTo(".vertical-lines-wrapper");

    // 10. contact form
    $("form#form").on("submit", function () {
        $("form#form .error").remove();
        var s = !1;
        if ($(".requiredField").each(function () {
            if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="error">This field is required</span>'), $(this).addClass(
                "inputError"), s = !0;
            else if ($(this).hasClass("email")) {
                var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="error">Invalid email address</span>'), $(this).addClass(
                    "inputError"), s = !0);
            }
        }), !s) {
            $("#submit").fadeOut("normal", function () {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.ajax({
                type: "POST",
                url: $(this).attr("action"),
                data: r,
                dataType: "json",
                success: function () {
                    $("form#form").slideUp("fast", function () {
                        $(this).before('<div class="success">Your email was sent successfully.</div>');
                    });
                },
                error: function () {
                    $("#submit").fadeIn("normal");
                    $("#form").append('<div class="error">Could not send message. Please try again later.</div>');
                }
            });
        }
        return !1;
    });


});