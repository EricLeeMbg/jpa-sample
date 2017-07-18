function goToPage(pageNo) {

    $("input[name=pageNo]").val(pageNo);
    $("#pageForm").submit();

}

$("#thumb-img").find("img").click(function () {
    $("#main-img").find("img").attr("src", $(this).parent().find('input[name=imageUrl]').val());
});

var channelCms={};

var bagSlider = $('#bagListImg').bxSlider({
    // mode: 'vertical',
    nextSelector: '#bagControlNext',
    prevSelector: '#bagControlPrev',
    nextText: '&#9654;',
    prevText: '&#9664;',
    slideWidth: 90,
    hideControlOnEnd: true,
    pager: true,
    pagerType: 'short'
});

channelCms= {
    init: function () {

        this.loadTimeOut = function () {
        };
        channelCms.quickMenuList();
    },
    quickMenu: function(ele){
        var quickMenu = $('#'+ele),
            quickTop = quickMenu.offset(),
            quicTopHeight = quickTop.top+quickMenu.outerHeight();
        //console.log((quickTop.top+quickMenu.outerHeight())+"-----"+$("body").height());
        if(quicTopHeight > $("body").height()){
            quickMenu.offset({top:38});
        }
        $(window).scroll(function(){

            if  ($(this).scrollTop() > quickTop.top){
                quickMenu.addClass('fixed');
            }else {
                quickMenu.removeClass('fixed');
            }
            // quickMenu.stop();
            // quickMenu.animate( { "top": scrTop + quickTop + "px" }, 500 ); //스크롤 내려갈 때의 속도
        });
    },
    quickMenuList: function(){
        var recentViewData = channelCms.getCookie("recentView");

        var jsonData = JSON.parse(JSON.parse(recentViewData)) == null ? 0 : JSON.parse(JSON.parse(recentViewData));
        var jsonLength = jsonData.length == undefined ? 0 : jsonData.length;

        $('.recently').find('strong').text(jsonLength);
        $('#bagListImg').empty();
        $('.bag-control').hide();
        for(var i = 0; i < jsonLength; i++) {
            var srcUrl = jsonData[i].url;
            if(!srcUrl){
                srcUrl = "/img/noimg.jpg"
            }

            if(i==0){
                $('#bagListImg').append("<li><a href=\"" + jsonData[i].link + "\"><img src=\"" + srcUrl + "\"></a></li>");
            }
            else if(i>0 && i <5) {
                $('#bagListImg li:first-child').append("<a href=\"" + jsonData[i].link + "\"><img src=\"" + srcUrl + "\"></a>");
            }
            else if(i==5){
                $('#bagListImg').append("<li><a href=\"" + jsonData[i].link + "\"><img src=\"" + srcUrl + "\"></a></li>");
            }
            else {
                $('#bagListImg li:last-child').append("<a href=\"" + jsonData[i].link + "\"><img src=\"" + srcUrl + "\"></a>");
            }

        }

        if(jsonLength > 5){
            $('.bag-control').show();
            bagSlider.reloadSlider();
            $("#bag-list .bx-wrapper").css("padding-bottom", "45px")
        }else{
            // if(jsonLength == 0){
            //     $('#bagListImg').append('<li class="no-data">최근 본 제품 없음</li>');
            // }
            bagSlider.destroySlider();
        }

        if($('#estimate_bag').length >0 ){
            channelCms.quickMenu('estimate_bag');
        }
    },
    getCookie: function(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

}
channelCms.init();


$( document ).ready(function() {

    $(".ellipsis").ellipsis();

    $(window).on('load', function()  {
        var lnbMenu = $('#channelLnbMenu');
        var GnbMenu = $('#categoryGnb');

        var lnbArea = $('#lnbArea');
        var lnbWidth = 0;
        lnbMenu.find('li').each(function() {
            lnbWidth += $(this).width()
        });

        if(lnbArea.width() < lnbWidth && lnbMenu.length>0){
            $('.lnb-btn').css({
                'margin-left':-25,
                'margin-right':-25,
            });
            lnbArea.lemmonSlider();
        }

        var GnbArea = $('#gnbArea');
        if(GnbMenu.length>0){
            GnbArea.lemmonSlider();
        }
    });


    if($("#mainScreen").find("li").length > 1){
        $('#mainScreen').bxSlider({
            mode: 'fade',
            pager: true,
            controls: false,
            autoControls: true,
            auto: true,
            onSliderLoad: function(currentIndex) {
                $('#mainScreen').find('li').removeClass('active-slide');
                $('#mainScreen').find('li').eq(currentIndex + 1).addClass('active-slide');
            },
            onSlideBefore: function($slideElement){
                $('#mainScreen').find('li').removeClass('active-slide');
                $slideElement.addClass('active-slide');
            }
        });
    }

    var oneSlider = ($('#recommendDetail').children().length < 2);
    var recommendSlider = $("#recommendDetail").bxSlider({
        mode: 'fade',
        pagerCustom: '#recommendPager',
        controls: false,
        autoControls: false,
        auto:  (!oneSlider),
        pager: (!oneSlider),
        onSlideAfter: function() {
            recommendSlider.stopAuto();
            recommendSlider.startAuto();
        }
    });

    $('#recommendList').on('click', ".recommend-list-promotion", function(e){
        e.preventDefault();
        var targetNo = $(this).attr('href').replace('#', '');

        $('.product-image').find('a').each(function(){
            if($(this).attr('id') == targetNo){
                if($(this).css("display") == "none"){
                    $(this).fadeIn();
                }
            } else {
                if($(this).css("display") == "block"){
                    $(this).fadeOut();
                }
            }
        });

    });

    if($("#thumbList").find("li").length > 3) {
        $('#thumb-img').find('.thumb-img-control').removeClass('hidden');
        $('#thumbList').bxSlider({
            auto: true,
            pause: 5000,
            nextSelector: '.big-right-arrow',
            prevSelector: '.big-left-arrow',
            nextText: '',
            prevText: '',
            slideWidth: 520,
            minSlides: 4,
            maxSlides: 4,
            moveSlides: 1,
            slideMargin: 10,
            pager:false,
            hideControlOnEnd: true,
            onSlideNext: function ($slideElement, oldIndex, newIndex) {
                $("#main-img img").eq(oldIndex).fadeOut();
                $("#main-img img").eq(newIndex).fadeIn();
            },
            onSlidePrev: function ($slideElement, oldIndex, newIndex) {
                $("#main-img img").eq(oldIndex).fadeOut();
                $("#main-img img").eq(newIndex).fadeIn();
            }
        });
    }

    $('#thumbList').on('click', ".thumb-product-list", function(e){
        e.preventDefault();
        var targetNo = $(this).attr('href').replace('#', '');

        $('#main-img').find('img').each(function(){
            if($(this).attr('id') == targetNo){
                if($(this).css("display") == "none"){
                    $(this).fadeIn();
                }
            } else {
                if($(this).css("display") == "block"){
                    $(this).fadeOut();
                }
            }
        });

    });


});