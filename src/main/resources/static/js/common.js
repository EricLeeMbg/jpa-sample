var cms={};
cms={
    init: function() {
        this.loadTimeOut = function() {};
        /*
        cms.loadingImage({
            "state": "start",
            "timeout": 1000, // 로딩 종료 시간
            "onTimeOut": function() { // 로딩 종료 콜백
                // 로딩 종료
                cms.loadingImage({
                    "state": "end"
                });
            }
        });
        */
        $( document ).ajaxStart(function() {
            //$('body').addClass('loading-area');
            cms.loadingImage({
                "state": "start"
            });
        });
        $( document ).ajaxComplete(function() {
            //$('body').removeClass('loading-area');
            cms.loadingImage({
                "state": "end"
            });
        });
    },
    // 로딩
    loadingImage: function(options) {
        var $body = $("body")
            , html = '<div id="loadingImage"><div class="img-loading"></div></div>' ;

        if (options.state === "start") {
            $body.append(html);
        } else if (options.state === "end") {
            $("#loadingImage").remove();
            clearTimeout(cms.loadTimeOut);
        };

        if (typeof(options.onTimeOut) == "function" ) {
            cms.loadTimeOut = setTimeout(function() {
                options.onTimeOut();
            }, options.timeout);
        };
    },
    NavSlideToggle: function(ele, openName) {
        var $this = $(ele).children("ul")
            , activeEle = $this.children("li")
            , openClass = openName == "" ? "nav01": openName.split('_')[0]
            , pageLocation = $(".page-location").children("ul");

        if(openClass){
            $this.find("."+openClass).addClass("open");
            pageLocation.append('<li><span>'+$this.find('.'+openClass).children('a').text()+'</span></li>');
            if(openName.length>5){
                $this.find("."+openName+">a").addClass("on");
                pageLocation.append('<li><span>'+$this.find("."+openName+">a").text()+'</span></li>');
            }
            pageLocation.find("li").last().addClass("active");
        }

        if(activeEle.hasClass("open")){
            var openEle = $this.find(".open");
            if(openEle.find("ul").length>0 ){
                openEle.children("ul").show();//stop().slideDown("slow");
            }
        }

        activeEle.mouseover(function(){
            $(this).addClass("active");
            if($(this).find("ul").length>0 ){
                $(this).children("ul").stop().slideDown("slow");
            }
        });
        activeEle.mouseout(function(){
            if($(this).closest("active") && $(this).attr("class").indexOf("open") < 0){
                $(this).removeClass("active");
                $(this).children("ul").stop().slideUp("slow");
            }
        });
    },
    // 폰번호 포맷 변경
    phoneFormat: function(phoneNumber){
        var phoneReplace = phoneNumber.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/g,"$1-$2-$3");
        return phoneReplace;
    },
    // 사업자 번호 포맷 변경
    bizNumFormat: function(ele){
        var bizNum = $("."+ele);
        $(bizNum ).each(function(){
            var bizNumReplace = $(this).text().replace(/([0-9]{3})([0-9]{2})([0-9]{5})/g,"$1-$2-$3");
            $(this).empty().append(bizNumReplace);
        });
    },
    // input data monitoring
    inputMonitoring: function(){
        var input = $("input, textarea");
        input.bind('change keyup paste', function(){
            var thisVal = $(this).val();
            var oldVal = $(this).data("value");
            if(thisVal != oldVal){
                $(this).attr("data-same", "false");
                //$(this).data("same", "false");
            }
        })
    },
    allCheckBox: function(masterId, slaveName, msgClass){
        var $master = $('#'+ masterId)
            , $slave = $('input[name=' + slaveName +']')
            , $msgTraget = $('.'+msgClass);
        $msgTraget.hide();
        $master.on('change',function(){
            if($master.prop("checked")) {
                $slave.prop("checked",true);
                $msgTraget.hide();
            } else {
                $slave.prop("checked",false);
                $msgTraget.show();
            }
        });

        $slave.on('change', function(){
            if($slave.length == $('input[name='+slaveName+']:checked').length){
                $master.prop('checked', true);
            }
            else {
                $master.prop('checked', false);
            }
        });
    },
    seriailzeMonitoringBlank: function($form){
        var result = $form.clone().find("[data-same]").each(function() {
            if ($(this).attr("data-same") == 'true') {
                $(this).attr('disabled','disabled');
            }
        }).end().serializeArray();
        $form.find("[data-same=false]").removeAttr("disabled");

        return result;
    },
    ajaxGet: function (options) {
        var defaults = {
            "url" : $("form").attr( "action" ),
            "formData": $("form").serialize(),
            "callback": null
        };
        var settings = $.extend({}, defaults, options);
        // console.log(JSON.stringify(settings.formData));

        $.ajax({
            url: settings.url,
            type: "GET",
            data: settings.formData,
            success: function (result) {
                if(result.result.resCode == "0000"){
                    // 정상처리
                    if ( typeof(settings.callback) == "function" ) {
                        settings.callback( result );
                    }else{
                        alert(result.result.resMsg);
                        document.location.reload();
                    };
                }else{
                    alert(result.result.resMsg);
                }
                // console.log("success:"+JSON.stringify(result));
            },
            beforeSend:function(){
                cms.loadingImage({
                    "state": "start",
                    "timeout": 1000, // 로딩 종료 시간
                    "onTimeOut": function() { // 로딩 종료 콜백
                        // 로딩 종료
                        cms.loadingImage({
                            "state": "end"
                        });
                    }
                });
            }
            ,complete:function(){
                cms.loadingImage({
                    "state": "end"
                });
            },
            error: function(request, status, error){
                alert("request:"+request + "/ status :" + status + "/ error :"+ error);
            }
        });
    },
    ajaxPost: function (options) {
        var defaults = {
            "url" : $("form").attr( "action" ),
            "formData": $("form").serializeArray(),
            "callback": null
        };
        var settings = $.extend({}, defaults, options);

        console.log(JSON.stringify(settings.formData));

        $.ajax({
            url: settings.url,
            type: "POST",
            data: settings.formData,
            success: function (result) {
                console.log(JSON.stringify(result));
                if(result.result.resCode == "0000"){
                    // 정상처리
                    if ( typeof(settings.callback) == "function" ) {
                        settings.callback( result );
                    }else{
                        cms.pgAlert({
                            "aClass": 'success', //confirm, success warning error
                            "aContent": result.result.resMsg,
                            "aCloseCallback": function(){
                                document.location.reload();
                            }
                        });
                    };
                }else{
                    cms.pgAlert({
                        "aClass": 'error', //success warning error
                        "aContent": result.result.resMsg
                    });
                }
                //console.log("success:"+JSON.stringify(result));
            },
            error: function(request, status, error){
                alert("request:"+request + "/ status :" + status + "/ error :"+ error);
            }
        });
    },
    ajaxListPost: function (options) {
        var defaults = {
            "url" : $("form").attr( "action" ),
            "formData": $("form").serializeArray(),
            "callback": null
        };
        var settings = $.extend({}, defaults, options);

        // var jsonParamList = JSON.stringify(settings.formData);
        // console.log(JSON.stringify({ jsonParam: jsonParamList }));

        $.ajax({
            url: settings.url,
            type: "POST",
            data: settings.formData,
            processData: false,
            contentType: false,
            success: function (result) {
                if(result.result.resCode == "0000"){
                    // 정상처리
                    if ( typeof(settings.callback) == "function" ) {
                        settings.callback( result );
                    }else{
                        cms.pgAlert({
                            "aClass": 'success', //confirm, success warning error
                            "aContent": result.result.resMsg,
                            "aCloseCallback": function(){
                                document.location.reload();
                            }
                        });
                        document.location.reload();
                    };
                }else{
                    cms.pgAlert({
                        "aClass": 'error', //success warning error
                        "aContent": result.result.resMsg
                    });
                }
                //console.log("success:"+JSON.stringify(result));
            },
            error: function(request, status, error){
                alert("request:"+request + "/ status :" + status + "/ error :"+ error);
            }
        });
    },
    // 탭
    cropPopup: function(options) {
        // Default Options
        var defaults = {
            "croptBn" : ".cropPopup",
            "cropBtnTarget": ".cropPopup",
            "maxW": 100,
            "maxH": 75,
            "inputName": "cid",
            "callback": null
        };
        var settings = $.extend(defaults, options);

        settings.cropBtn.on("click.eventCustom", function(event) {
            e.preventDefault();
            var parentId = $(this).closest("form").attr("id");
            var url = "/crop?maxW="+settings.maxW+"&maxH="+settings.maxH+"&formId="+parentId+"&btn="+settings.cropBtnTarget;
            window.open(url, "_blank", "width=900px, height=800px, toolbar=no, menubar=no, scrollbars=no, resizable=no");

            // 콜백 호출
            if ( typeof(settings.callback) == "function" ) {
                settings.callback.call( $(this) );
            };
        });

        return this;
    },
    setImgUrl:function (url, cid, id, btnTarget) {
        var formEle = $("#"+id);
        var lastIndex = url.lastIndexOf("=");
        var imgName = url.substring(lastIndex + 1);

        formEle.find('input[name=CompanyLogoCid]').val(cid).trigger('change');
        if(formEle.find('.file-thumb-img img').length > 0){
            formEle.find('img').attr('src', url);
        }else{
            formEle.find(".file-thumb-img").append('<img src="'+url+'">');
        }

        formEle.find(btnTarget).empty().text("이미지 변경");
        formEle.find(".img-info").empty().text(imgName);

        /** cid 별도 저장 후 서버 전송 **/
    },
    selectBoxDesign: function(options){
        // Default Options
        var defaults = {
            "selectRoot": 'div.dropdown-radio',
            "selectValue": 'div.dropdown-radio .sel_value',
            "selectInput": 'div.dropdown-radio > div > label > input[type=radio]',
            "selectLabel": 'div.dropdown-radio > div > label'
        };
        var settings = $.extend(defaults, options);


        // Radio Default Value
        $(settings.selectValue).each(function(){
            var default_value = $(this).next('div').find('input[checked]').parents('label').text();
            if(default_value != "")
                $(this).find("strong").empty().text(default_value);
        });

        // Line
        $(settings.selectValue).bind('focusin',function(){
            $(this).addClass('outline');
            $(this).parents(settings.selectRoot).toggleClass('open');
        });
        $(settings.selectValue).bind('focusout',function(){
            $(this).removeClass('outline');
        });
        $(settings.selectInput).bind('focusin',function(){
            $(this).parents(settings.selectRoot).children(settings.selectValue).addClass('outline');
        });
        $(settings.selectInput).bind('focusout',function(){
            $(this).parents(settings.selectRoot).children(settings.selectValue).removeClass('outline');
        });

        // Show
        function show_option(){
            $(this).parents(settings.selectRoot).addClass('open');
        }

        // Hover
        function i_hover(){
            $(this).parents('div').first().children('label').removeClass('hover');
            $(this).first().toggleClass('hover');
        }

        // Hide
        function hide_option(){
            var t = $(this);
            setTimeout(function(){
                t.parents(settings.selectRoot).removeClass('open');
            }, 1);
        }

        // Set Input
        function set_label(){
            var v = $(this).parents('label').text();
            $(this).parents('div').first().prev(settings.selectValue).find("strong").empty().text(v);
        }

        $(settings.selectValue).click(show_option);
        $(settings.selectRoot).removeClass('open');
        $(settings.selectRoot).mouseleave(function(){
            $(this).removeClass('open');
        });
        $(settings.selectInput).change(set_label);//.focus(set_label);
        $(settings.selectLabel).hover(i_hover).click(hide_option);
    },
    seriailzeWithoutBlank: function($form){
        var result = $form.clone().find("input").each(function() {
            if ($.trim($(this).val()) == '') {
                $(this).attr('disabled','disabled');
            }
        }).end().serializeArray();
        $form.find("input:disabled").removeAttr("disabled");

        return result;
    },
    seriailzeArray: function($form){
        var arrayData, objectData;
        arrayData = $form.serializeArray();
        objectData = {};

        $.each(arrayData, function() {
            var value;
            if (this.value !=  null && this.value !=  "") {
                value = this.value;
            } else {
                value = "null";
            }

            if (objectData[this.name] != null) {
                if (!objectData[this.name].push) {
                    objectData[this.name] = [objectData[this.name]];
                }
                objectData[this.name].push(value);
            } else {
                objectData[this.name] = value;
            }
        });

        return objectData;
    },
    pgAlert: function(options){  //jquery ui dialog
        // Default Options
        var defaults = {
            "aTitle": '',
            "aClass": 'confirm', //success warning error
            "aContent": '<p>ok</p>',
            "aButton": [
                {
                    text: "확인",
                    "class": 'btn-confirm',
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            ],
            "aCloseCallback": null
        };
        var settings = $.extend(defaults, options);

        var $dialog = $('<div class="alert-'+ settings.aClass +'"></div>')
            .html( settings.aContent)
            .dialog({
                modal: true,
                title: settings.aTitle,
                buttons: settings.aButton,
                close: function(event, ui)
                {
                    $(this).dialog('close');

                    if ( typeof(settings.aCloseCallback) == "function" ) {
                        settings.aCloseCallback.call( $(this) );
                    };
                    $(this).remove();
                },
                resizable: false,
                draggable: false
            });

        $dialog.dialog('open');

    }

}
cms.init();

(function($) {
    $.fn.ellipsis = function()
    {
        return this.each(function()
        {
            var el = $(this),
                text = el.text(),
                elH = el.height();

            var t = $(this.cloneNode(true))
                .hide()
                .css('position', 'absolute')
                .css('overflow', 'visible')
                .width(el.width())
                .height('auto');

            el.after(t);

            if(elH <= t.height()){
                var start = 1, length = 0;
                var end = text.length;

                while (start < end){
                    length = Math.ceil((start + end) / 2);
                    t.text(text.slice(0, length) + "...");

                    if (t.height() <= elH) {
                        start = length;
                    } else {
                        end = length - 1;
                    }
                }
                // console.log(text);

                text = text.slice(0, start);

                el.text(text+"...");
            }
            t.remove();
        });
    };
})(jQuery);