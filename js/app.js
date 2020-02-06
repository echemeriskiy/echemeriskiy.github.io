

window.onload = function(){

};


var windowInnerWidth = window.innerWidth;


$(document).ready(function(){
    App.init();
    App.resize();
    console.log("ready")



    $(window).resize(function() {
        App.resize();
    });
});

var App = {
    popup: {
        open: function (name) {
            let popupWrap = $(`.popup-wrap[data-type="${name}"]`),
                popup = popupWrap.find('.popup');

            popupWrap.fadeIn()
            setTimeout(()=>{
                popup.addClass('active')
            },300)

        },
        close: function (name) {
            let popupWrap = $(`.popup-wrap[data-type="${name}"]`),
                popup = popupWrap.find('.popup');

            if(!event || !$(event.target).closest('.popup').length){
                popup.removeClass('active')
                setTimeout(()=>{
                    popupWrap.fadeOut()
                },300)
            }
        }

    },
    slider:{
        tariff:function (index) {
            let wrap = $('.tariff__list'),
                items = wrap.find('.tariff__item'),
                wrapWidth = wrap.width(),
                dots = $('.dot[data-dot="tariff"]'),
                itemsWidth = items.outerWidth()*items.length;

            switch (index) {
                case 2:
                    wrap.css({transform: `translateX(${(wrapWidth-itemsWidth)/2}px)`});
                    break
                case 0:
                   wrap.css({transform: `translateX(${(itemsWidth-wrapWidth)/2}px)`});
                    break
                default:
                    wrap.css({transform: `translateX(0px)`});
                    break
            }
            dots.removeClass('active');
            dots.eq(index).addClass('active');

            wrap.attr("data-active", index)
        },
        changeSlide : function (index, sliderName) {
            if(!sliderName){
                sliderName = $(event.target).data("dot")
            }


            let wrap = $(`[data-slider=${sliderName}]`),
                items = wrap.find(`[data-slider-item]`),
                wrapWidth = wrap.width(),
                dots = $(`[data-dot=${sliderName}]`),
                itemsWidth = items.outerWidth()*items.length;

            wrap.css({transform: `translateX(-${(items.outerWidth()*index)}px)`});

            dots.removeClass('active');
            dots.eq(index).addClass('active');

            wrap.attr("data-active", index)
        }

    },
    form:{
        clear: function (form) {
            form.find('input').each((i,el) => {
                let type = $(el).attr('type');
                if(type !== 'checkbox' && type !== "radio"){
                    $(el).val("")
                } else {
                    $(el).removeAttr('checked')
                    $(el).prop('checked',false)
                }
            })
            form.find('textarea').val("")
        },
        send : function (form){


            let inputs = Array.prototype.slice.call(form.find('input,textarea').map((i,item )=> {
                    return {
                        key : item.name,
                        value : item.value
                    }
                })),
                data = {};
                for( let i in inputs){
                    data[inputs[i].key] = inputs[i].value
                }

        },
        submit : function() {
            event.preventDefault();
            let form = $(event.target),
                errorMessage = form.find('.popup__form-error'),
                popupName = form.closest('.popup-wrap').length ? form.closest('.popup-wrap').attr("data-type") : null;
            form.find('input, textarea').each((i,el) =>{
                this.checkInput(el)
            })

            if(form.find('label.error').length){
                errorMessage.html('Всі поля мають бути заповнені');
                errorMessage.slideDown();
                errorMessage.addClass('active');
                console.log('error inputs')

            } else {
                errorMessage.removeClass('active');
                errorMessage.slideUp();
                errorMessage.empty();

                this.send(form);
                if(popupName){
                    App.popup.close(popupName)
                    console.log(popupName)
                }

                this.clear(form);
            }
        },
        checkInput: (input) => {
            if(!input){
                input = event.target
            }
            input = $(input);
            let type = input.attr("data-type"),
                withError = true,
                value = input.val().trim(),
                label = input.closest('label');


            switch (type) {
               case 'email':
                   let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                   withError = !regEmail.test(value.toLowerCase());
                    break
               case 'ipn':
                   if(!isNaN(value) && (value.length === 10 || value.length === 8)){
                       withError = false;
                   }
                    break
               case 'tel':
               case 'pib':
               case 'company':
               case 'position':
               case 'message':
                default:
                    if(value.length > 0){
                        withError = false;
                    }
                    break
            }

            if(withError){
                label.addClass('error');
                label.removeClass('good');
            } else {
                label.addClass('good');
                label.removeClass('error');
            }
        }
    },
    init: function(){

        $('input[type=tel]').mask('+38 (099) - 999 - 99 - 99');




        $('.tariff__list').on('touchstart',function () {
            let currentTariff = $(this).attr("data-active") ?  +$(this).attr("data-active") : 1,
                tariffItems = $('.tariff__item'),
                scrollToChange = tariffItems.outerWidth()/3,
                maxTariff = tariffItems.length - 1,
                start = event.touches[0].clientX || event.touches[0].screenX,
                changeTariff = () => {
                    let currentPos = event.touches[0].clientX || event.touches[0].screenX,
                        cange = start - currentPos;
                    if(Math.abs(cange) > scrollToChange){
                        let newTariff = currentTariff + (cange > 0 ? 1 : -1);

                        newTariff < 0 ? newTariff = maxTariff : newTariff > maxTariff ? newTariff = 0 : '';
                        App.slider.tariff(newTariff);
                        currentTariff = newTariff;
                        start = currentPos;

                    }
                };


            $(this).on('touchmove', changeTariff)
            $(this).on('touchend', function () {
                $(this).off('touchmove', changeTariff)
            })

        })

        $('[data-slider]').on('touchstart',function () {
            let currentTariff = $(this).attr("data-active") ?  +$(this).attr("data-active") : 1,
                tariffItems = $(this).find(`[data-slider-item]`),
                scrollToChange = tariffItems.outerWidth()/3,
                sliderName = $(this).attr("data-slider"),
                maxTariff = tariffItems.length - 1,
                start = event.touches[0].clientX || event.touches[0].screenX,
                changeTariff = () => {
                    let currentPos = event.touches[0].clientX || event.touches[0].screenX,
                        cange = start - currentPos;
                    if(Math.abs(cange) > scrollToChange){
                        let newTariff = currentTariff + (cange > 0 ? 1 : -1);

                        newTariff < 0 ? newTariff = maxTariff : newTariff > maxTariff ? newTariff = 0 : '';
                        App.slider.changeSlide(newTariff,sliderName);
                        currentTariff = newTariff;
                        start = currentPos;

                    }
                };


            if(sliderName !== "tariff"){
                $(this).on('touchmove', changeTariff)
                $(this).on('touchend', function () {
                    $(this).off('touchmove', changeTariff)
                })
            }


        })

        var  reportImages = $('.report__images .slider');
        var  reportSlider = $('.report__slider .slider');
        var  reportSliderNav = $('.report__slider .report__nav__items');

        if(reportImages.length){
            reportImages.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                useTransform: false,
                arrows: false,
                rows: 0,
                autoplay: false,
                dots: false,
                draggable: true,
                infinite: true,
                touchThreshold: 100,
                adaptiveHeight: true,
                fade: true,
                cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
                asNavFor: reportSlider ? reportSlider : null
            });
        }

        if(reportSlider.length){

            reportSlider.on('init', function(event, slick){
                setActiveNavItem(slick.$dots)
            });

            reportSlider.on('afterChange', function(event, slick){
                setActiveNavItem(slick.$dots)
            });

            reportSlider.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                useTransform: false,
                arrows: true,
                prevArrow: '<button type="button" class="slick-prev "><span class="icon-chevron-left"></span></button>',
                nextArrow: '<button type="button" class="slick-next"><span class="icon-chevron-right"></span></button>',
                rows: 0,
                autoplay: false,
                dots: true,
                draggable: true,
                infinite: true,
                adaptiveHeight: true,
                touchThreshold: 100,
                appendDots: $('.report__nav__items'),
                asNavFor: reportImages ? reportImages : null,
                responsive: [
                    {
                        breakpoint: 767,
                        settings: {
                            arrows: false,
                        }
                    }
                ],
                customPaging : function(slider, i) {
                    var name = $(slider.$slides[i]).data('name');
                    return '<span>' + name + '</span>';
                },
            });

            function setActiveNavItem(items){
                var dots = items;
                var activeDot = dots.find('.slick-active span');
                var position = activeDot.position();
                var width = activeDot.width();
                let wrap = $('.report__nav'),
                    wrapWidth = wrap.width();
                if(+position.left+width > wrapWidth){
                    position.left = wrapWidth - width
                }


                let nav = $('.simplebar-content-wrapper'),
                    offsetLeft = activeDot[0].offsetLeft;

                let count = 0,
                    timeConst = 2;
                if(nav[0].scrollLeft <= offsetLeft+width - wrapWidth/2){
                    for(let scrollLeft = nav[0].scrollLeft; scrollLeft <= offsetLeft+width - wrapWidth/2; scrollLeft+=10){
                        count++
                        setTimeout(()=> {
                            nav[0].scrollLeft = scrollLeft
                        }, count *timeConst)
                    }
                } else {
                    for(let scrollLeft = nav[0].scrollLeft; scrollLeft > offsetLeft+width - wrapWidth/2; scrollLeft-=10){
                        count++
                        setTimeout(()=> {
                            nav[0].scrollLeft = scrollLeft
                        }, count *timeConst)
                    }
                }


                // nav[0].scrollLeft = offsetLeft+width - wrapWidth/2;
                setTimeout(()=>{
                    $(".report__nav__slider").css({
                        "left": + activeDot.position().left,
                        "width": width
                    });
                },count*timeConst)
                // if(offsetLeft+width > wrapWidth && $(window).width() > 767){
                //     nav.css({
                //         transform: `translateX(-${offsetLeft+width - wrapWidth}px)`
                //     })
                // } else {
                //     nav.css({
                //         transform: `translateX(0px)`
                //     })
                // }


            }
              }


        $('.simplebar-content-wrapper').on('wheel', function (event) {
            event.preventDefault()
            $('.simplebar-content-wrapper')[0].scrollLeft+=event.originalEvent.deltaY;
        })

        var controller = new ScrollMagic.Controller();

        function defOnCompleteFunc(arr){
            return true
        }
        var defOpacity = 0,
            defDuration = .8,
            defEase = "sine.inOut",
            defTranslateY =  '25px';

        let showItems = (wrap,defOpacityLocal = defOpacity, duration = defDuration,triggerElement = wrap[0]) => {
            let wrapTimeLine = gsap.timeline();

            wrapTimeLine.fromTo(wrap,{
                opacity: defOpacityLocal,
                y: defTranslateY
            },{
                y:'0px',
                duration,
                opacity: 1,
                onEnd : function(){

                },
                ease: defEase,
            })

            let screen = new ScrollMagic.Scene({
                triggerElement,
                duration: 0,
                triggerHook: 1
            })
                .setTween(wrapTimeLine)
                .addTo(controller)

            screen.on("leave", function (event) {
                // screen = screen.destroy();

            });

        }




        var laptop = $('.main__laptop');
        var title = $('.title h2'),
            titleTimeline = gsap.timeline();
        var mainTimeline = gsap.timeline();
        var laptopTimeline = gsap.timeline();

        showItems($('.main__content .list li'))
        showItems($('.crm__button'))


        titleTimeline.fromTo(title,{
            color: '#8B8B8B',
            opacity: .3
        },{
            opacity: 1,

            duration: 1.2,
            color: '#ffffff',
            ease: defEase,
        });

        let laptopScroll = new ScrollMagic.Scene({
            triggerElement: laptop[0],
            duration: 0,
            triggerHook: .95
        })
            .setTween(titleTimeline)
            .addTo(controller)

        laptopScroll.on("leave", function (event) {
            // laptopScroll = laptopScroll.destroy();
        });

        laptopTimeline
            .fromTo(laptop, {
                opacity: 0,
                y: '40px'
            },{
                y:'0px',
                duration: .9,
                opacity: 1,
                ease: defEase,
            })
            .fromTo($('.main__bg'), {
                opacity: .0,
                scale: .5
            },{
                duration: .7,
                opacity: 0.7,
                scale: 1,
                ease: defEase,
            });


        let mainBgScroll = new ScrollMagic.Scene({
            triggerElement: laptop[0],
            duration: 0,
            triggerHook: .86
        })
            .setTween(laptopTimeline)
            .addTo(controller)

        mainBgScroll.on("leave", function (event) {
            // mainBgScroll = mainBgScroll.destroy();
        });


        var mainInfo = $('.main__info__content');

        showItems(mainInfo.find('.list li'))





        let mainAction = mainInfo.find('.main__action'),
            mainActionText = mainAction.next();

        showItems(mainInfo.find('.main__action'))
        showItems(mainInfo.find('.main__action').next())




        var columns = $('.columns__item');



        let slider = $('.report__sliders');

        showItems($('.report__list__item'))
        showItems(slider)






        columns.each((i,el) => {
            showItems($(el),0)
        })
        $('.report__question-item').each((i,el) => {
            showItems($(el),0)
        })

        $('.title').each((i,el) => {
            showItems($(el),0)
        })
        $('.report__item').each((i,el) => {
            showItems($(el),0)
        })

        showItems($('.report__link'),0);

        let reportInfo = $('.report__info');
        showItems($('.section__item'));
        showItems(reportInfo.find('.actions'));
        showItems(reportInfo.find('.description'));

        showItems($('.callback__title'));
        showItems($('.callback__subtitle'));


        showItems($('.crm__header'));
        $('.crm__examples-item').each((i,el) => {
            showItems($(el),0)
        })

        $('.crm__adventages-item').each((i,el) => {
            showItems($(el),0)
        })

        $('.tariff__item').each((i,el) => {
            showItems($(el),0)
        })

        $('.tariff__block').each((i,el) => {
            showItems($(el),)
        })

        $('#api .list li').each((i,el) => {
            showItems($(el),)
        })

        $('.tariff__question-item').each((i,el) => {
            showItems($(el),)
        })





        showItems($('.videoPlayer'));
        showItems($('.tariff__bottom .btn'));
        showItems($('.friends__item'));
        showItems($('.callback .actions'));





        var performanceItems = $('.performance__item'),
            updateItems = $('.update__item'),
            performanceAction = gsap.timeline(),
            updateAction = gsap.timeline();


        $.each(performanceItems, function(i, item){
            performanceAction.fromTo(item, {
                y: defTranslateY,
                opacity: defOpacity
            }, {
                duration: defDuration,
                y: '0%',
                opacity: 1,
                ease: defEase,
                onStart: showEements,
                onStartParams: [item, i]
            },  0.05);

            function showEements(item, i){
                var countEl = $(item).find('.count');
                countEl.countTo({
                    from: 0,
                    to: countEl.data('to'),
                    speed: 600,
                    refreshInterval: 50,
                    formatter: function (value, options) {
                        return value.toFixed().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                    },
                });
            }
        });

        let perfomanceScroll = new ScrollMagic.Scene({
            triggerElement: performanceItems[0],
            duration: 0,
            triggerHook: 0.95
        })
            .setTween(performanceAction)
            .addTo(controller)

        perfomanceScroll.on("leave", function (event) {
            // perfomanceScroll = perfomanceScroll.destroy();
        });

        $.each(updateItems, function(i, item){
            updateAction.fromTo(item, {
                y: defTranslateY,
                opacity: defOpacity
            }, {
                duration: defDuration,
                y: '0%',
                opacity: 1,
                ease: defEase,
                onStart: showEements,
                onStartParams: [item, i]
            }, 0.05);

            function showEements(item, i){
                var countEl = $(item).find('.count');
                countEl.countTo({
                    from: 0,
                    to: countEl.data('to'),
                    speed: 600,
                    refreshInterval: 50,
                    formatter: function (value, options) {
                        return value.toFixed().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                    },
                });
            }
        });

        let updateScroll = new ScrollMagic.Scene({
            triggerElement: updateItems[0],
            duration: 0,
            triggerHook: 0.95
        })
            .setTween(updateAction)
            .addTo(controller)


        updateScroll.on("leave", function (event) {
            // updateScroll = updateScroll.destroy();
        });


        $('.footer__nav').on('click', '.footer__title', function(){

            if(windowInnerWidth < 767){

                var item = $(this);
                var itemParent = item.closest('.footer__item');

                if(!item.hasClass('active')){
                    item.addClass('active');
                    itemParent.find('.footer__list').showDown()
                } else {
                    item.removeClass('active');
                    itemParent.find('.footer__list').hideUp()
                }

            } else {
                return false;
            }
        });

        $('.main').on('click', '.logo', function(){

            if(windowInnerWidth < 767){

                var logo = $(this);
                var mainHeader = logo.closest('.main__header'),
                    nav = mainHeader.find('.nav');

                if(!mainHeader.hasClass('active')){
                    mainHeader.addClass('active');
                    nav.showDown()
                } else {
                    mainHeader.removeClass('active');
                    nav.hideUp()
                }

            } else {
                return false;
            }
        });

        $('.panel').on('click', '.panel__link', function(){

            if(windowInnerWidth < 767){

                var link = $(this);
                var panel = link.closest('.panel'),
                    nav = panel.find('.panel__nav');

                if(!panel.hasClass('active')){
                    panel.addClass('active');
                    nav.showDown()
                } else {
                    panel.removeClass('active');
                    nav.hideUp()
                }

            } else {
                return false;
            }
        });

        $('.main__header .nav__item a').on('click', function(event) {
            event.preventDefault();

            var $this = $(this);
            var element = $($this.attr('href'));

            if(element.length > 0){
                var topOffset = element.offset().top;

                if($this.closest('.main__header').length) {
                    var mainHeader = $this.closest('.main__header'),
                        nav = mainHeader.find('.nav');

                    if(mainHeader.hasClass('active')){
                        mainHeader.removeClass('active');
                        nav.hideUp();
                    }

                    setTimeout(function(){
                        scrollToAnchor(topOffset);
                    },600);

                } else {
                    scrollToAnchor(topOffset);
                }
            } else {

                window.location.href = '/' + $this.attr('href');
            }

        });

        function scrollToAnchor(offset){
            $('html, body').stop().animate({
                scrollTop: offset
            }, 1000, 'linear');
        }


        $(window).on('click', function(event) {
            if (!$(event.target).closest('.panel').length && $('.panel').hasClass('active') ) {
                $('.panel').removeClass('active');
                $('.panel__nav').hideUp();
            };

            if (!$(event.target).closest('.main__header').length && $('.main__header').hasClass('active') ) {
                $('.main__header').removeClass('active');
                $('.main__header .nav').hideUp();
            };
        });


        let player = $('#api-video')[0];
        $(player).off('ended');
        $(player).on('ended',function() {
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=replay]`).addClass('active');
        });

        function setActiveNavLink(item){
            let activeLink = item ? item : $('.nav__item.active')[0],
                width = activeLink ? $(activeLink).width() : 0,
                left = activeLink ?  activeLink.offsetLeft : 0,
                line = $('.nav__line');

            line.css({
                width:width,
                left: left
            })
        }

        $('.nav__item').on('mouseover', function () {
            setActiveNavLink(this)
        })

        $('.nav__item').on('mouseout', function () {
            setActiveNavLink()
        })

        setActiveNavLink()
        $(document).on('scroll', function () {
            let header = $('header'),
                beforeScrolled = header.attr('data-scrolled') ? header.attr('data-scrolled') : 0;

            let scrolled = $(document).scrollTop(),
                videoSection = $('#api')[0].offsetTop,
                topOfSection = $('.apiPlayerContainer')[0].offsetTop,
                sectionHeigt = $('#api').height(),
                videoHeight = $('#api-video').height();


            if(scrolled > 0){
                header.addClass('scrolled')
                if(beforeScrolled < pageYOffset ){
                    header.addClass('--bottom')
                } else {
                    header.removeClass('--bottom')
                }
            } else {
                header.removeClass('scrolled --bottom')
            }
            header.attr("data-scrolled",pageYOffset)


            let $sections = $('.section');
            $sections.each(function(i,el){
                let topEl  = $(el).offset().top - 100 < 0 ? 0 : $(el).offset().top - 100;
                let bottom = topEl +$(el).height();
                let scroll = $(window).scrollTop();
                let id = $(el).attr('id');
                if( scroll > topEl && scroll < bottom && $(el).css("display") !== "none"){
                    $('.nav__item').removeClass('active');
                    $('a[href="#'+id+'"]').closest('.nav__item').addClass('active');
                    setActiveNavLink()

                }
            })

        })


    },
    resize: function(){
        windowInnerWidth = window.innerWidth;
        App.slider.tariff(0)

        var innerWidth = window.innerWidth;
        if(innerWidth > 766){
            var footerItems = $('.footer__nav .footer__title');
            $.each(footerItems, function(i, item){
                var el = $(item);
                var list = el.closest('.footer__item').find('.footer__list');
                if(el.hasClass('active')){
                    el.removeClass('active');
                }

                list.attr('style') && list.removeAttr('style');
            });


            var mainHeader = $('.main__header'),
                mainHeaderNav =  mainHeader.find('.nav');
            if(mainHeader.hasClass('active')){
                mainHeader.removeClass('active');
            }

            mainHeaderNav.attr('style') && mainHeaderNav.removeAttr('style');

            var panel = $('.panel'),
                panelNav =  mainHeader.find('.panel__nav');
            if(panel.hasClass('active')){
                panel.removeClass('active');
            }

            panelNav.attr('style') && panelNav.removeAttr('style');
        }

        var sectionColumnsSlider = $('.section__columns');

        if(window.innerWidth <= 766){
            if(sectionColumnsSlider.length && !sectionColumnsSlider.hasClass('slick-initialized') ){
                sectionColumnsSlider.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    prevArrow: '',
                    nextArrow: '',
                    rows: 0,
                    autoplay: false,
                    dots: true,
                    draggable: true,
                    infinite: true,
                    touchThreshold: 100
                });
            }
        } else {
            App.destroySlider(sectionColumnsSlider);
        }
    },
    destroySlider: function(slider){
        if(slider.length && slider.hasClass('slick-initialized')) {
            slider.slick('unslick');
        }
    },
    videoApi: {
        toggle : function(){
            if($(`.videoPlayer__btn[data-type=pause]`).hasClass('active')){
                this.pause()
            } else {
                this.play()
            }
        },
        play :() => {
            let player = $('#api-video')[0];
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=pause]`).addClass('active');
            player.play();
            player.onended = function() {
                $('.videoPlayer__btn').removeClass('active');
                $(`.videoPlayer__btn[data-type=replay]`).addClass('active');
            };
            console.log('play')
        },
        replay :() => {
            let player = $('#api-video')[0];
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=pause]`).addClass('active');
            player.load();
            console.log('replay')

        },
        pause :() => {
            let player = $('#api-video')[0];
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=play]`).addClass('active');
            player.pause()
            console.log('pause')
        },

    },
    videoPreview: {
        play :() => {
                let player = $('#previevVideo')[0];
                player.play();
        },
        replay :() => {
            let player = $('#previevVideo')[0];
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=pause]`).addClass('active');
            player.load();
            console.log('replay')

        },
        pause :() => {
            let player = $('#previevVideo')[0];
            $('.videoPlayer__btn').removeClass('active');
            $(`.videoPlayer__btn[data-type=play]`).addClass('active');
            player.pause()
            console.log('pause')
        },

    }
};



(function($) {
    'use strict';

    var getAnimOpts = function (a, b, c) {
            if (!a) { return {duration: 'normal'}; }
            if (!!c) { return {duration: a, easing: b, complete: c}; }
            if (!!b) { return {duration: a, complete: b}; }
            if (typeof a === 'object') { return a; }
            return { duration: a };
        },
        getUnqueuedOpts = function (opts) {
            return {
                queue: false,
                duration: opts.duration,
                easing: opts.easing
            };
        };

    $.fn.showDown = function (a, b, c) {
        var slideOpts = getAnimOpts(a, b, c), fadeOpts = getUnqueuedOpts(slideOpts);
        $(this).hide().css('opacity', 0).slideDown(slideOpts).animate({ opacity: 1 }, fadeOpts);
    };
    $.fn.hideUp = function (a, b, c) {
        var slideOpts = getAnimOpts(a, b, c), fadeOpts = getUnqueuedOpts(slideOpts);
        $(this).show().css('opacity', 1).slideUp(slideOpts).animate({ opacity: 0 }, fadeOpts);
    };
}(jQuery));