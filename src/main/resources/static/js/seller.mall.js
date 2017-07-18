var msg;
var sortable = $("#sortable");
var sortableItems = $(".myinfo-screen-view");

$(function(){
    sortable.sortable({
        axis: "y",
        containment: "parent",
        handle: ".drag-handle",
        helper: 'clone',
        //opacity: 0.5,
        placeholder: "ui-state-highlight",
        scroll: false,
        tolerance: 'pointer',
        stop: function(event, ui) {
            //var data = sortable.sortable('toArray', { attribute: 'data-logoNo' });
            //console.log("stop:" + data);

            var order = $('input[name=displayOrder]');
            order.each(function(idx){
                $(this).val(idx);
                var oldVal = $(this).data("value");
                if(idx != oldVal){
                    $(this).attr("data-same", "false");
                    $(this).parent().find("input[name=logoNo]").attr("data-same", "false");
                }else{
                    $(this).attr("data-same", "true");
                    $(this).parent().find("input[name=logoNo]").attr("data-same", "true");
                }
            });

        },
        disabled: true
    }).disableSelection();
});

function activeSortable() {
    var sortable = $("#sortable");

    sortable.sortable( "option", { disabled: false } );
    sortable.addClass("order-modify-show");
    sortable.find(".modify-show").removeClass("modify-show");
    btnDisabled();

    $(".btn-order-active").addClass("hidden");
    $(".btn-order-form").removeClass("hidden");
};
function btnDisabled() {
    $("#mallLogoAdd").attr("disabled", true);
    $(".btn-logo-modify").attr("disabled", true);
};
function btnEnabled() {
    $("#mallLogoAdd").removeAttr("disabled");
    $(".btn-logo-modify").removeAttr("disabled");
};

function isSortable( msg ) {
    var sortable = $("#sortable");

    sortable.sortable( "option", { disabled: true } );
    sortable.removeClass("order-modify-show");
    btnEnabled();

    $(".btn-order-active").removeClass("hidden");
    $(".btn-order-form").addClass("hidden");

    if(msg){
        cms.pgAlert({
            "aClass": 'warning',
            "aContent": msg
        });
    }
};

function setImgUrl(url, cid, id) {
    var formEle = $("#"+id);
    var lastIndex = url.lastIndexOf("=");
    var imgName = url.substring(lastIndex + 1);

    formEle.find('input[name=LogoCid]').val(cid).trigger('change');
    if(formEle.find('.file-thumb-img img').length > 0){
        formEle.find('img').attr('src', url);
    }else{
        formEle.find(".file-thumb-img").append('<img src="'+url+'">');
    }
//                formEle.find(".btn-file").css("background-color", "transparent");
    formEle.find(".btn-file>button>span").empty().text("이미지 변경");
    formEle.find(".img-info").empty().text(imgName);

    /** cid 별도 저장 후 서버 전송 **/
}

$(document).ready(function(){

    cms.inputMonitoring();

    $('.crop-popup').click(function(e) {
        e.preventDefault();
        var parentId = $(this).closest("form").attr("id");
        var url = "/crop?maxW=1000&maxH=300&formId="+parentId;

        if(window._childwin != null) {
            window._childwin.focus();
        }
        else{
            window._childwin = window.open(url, "crop", "width=900px, height=800px, toolbar=no, menubar=no, scrollbars=no, resizable=no");
        }
    });

    // 순서 변경 활성화
    $("#mallLogoOrder").click(function(){
        if(sortableItems.length>1){
            activeSortable();
        } else {
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '최소 2개 이상일때 순서 변경이 가능합니다.'
            });
        }
    });

    // 순서 변경 적용
    $("#mallLogoOrderSubmit").click(function(event){
        event.preventDefault();
        var $form = $("#sortable"),
            $url = "/seller/mall/logo-switch-order",
            $formData = [],
            //$formData = {"jsonParam":[]},
            sameDataLength = $form.find("[data-same='false']").length;

        if(sameDataLength==0){
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        $form.find("form").each(function () {
            var param = {};
            var data = $(this).find("[data-same=false]").serializeArray();
            $.map(data, function(x){
                param[x.name] = x.value;
            });
            if(!$.isEmptyObject(param)){
                $formData.push(param);
                //$formData.jsonParam.push(param);
            }
        });

        var formData = new FormData();
        formData.append("jsonParam", JSON.stringify($formData));
        //console.log(formData);

        msg ="순서가 변경되었습니다.";
        cms.ajaxListPost({
            "url" : $url ,
            "formData": formData,
            // "callback": function (result) {
            //     $("#sortable").find("[data-same=false]").attr("data-same", "true");
            //
            //     $("#sortable").find(".logo-no").each(function (idx) {
            //         $(this).empty().html(idx+1);
            //     })
            //
            //     isSortable(msg);
            //     sortable.sortable('refresh');
            // }
        });

        $("#mallLogoAdd").removeAttr("disabled");
    });

    // 순서 변경 취소
    $("#mallLogoOrderReset").click(function(){

        cms.pgAlert({
            "aClass": 'confirm',
            "aContent": '순서변경을 취소 하면 처음 순서로 돌아갑니다!',
            "aButton": [
                {
                     text: "확인",
                     "class": 'btn-confirm',
                     click: function() {
                         sortable.sortable( "cancel" );
                         msg ="취소되었습니다.";
                         $("#sortable").find("[data-same=false]").attr("data-same", "true");
                         isSortable(msg);
                         $(this).dialog("close");
                     }
                },
                {
                     text: "취소",
                    "class": 'btn-cancel',
                     click: function() {
                         $(this).dialog("close");

                         cms.pgAlert({
                             "aClass": 'success',
                             "aContent": '변경이 가능합니다.'
                         });
                     }
                }
            ]
        });
/*
        var r = confirm("순서변경을 취소 하면 처음 순서로 돌아갑니다!");
        if (r == true) {
            sortable.sortable( "cancel" );
            msg ="취소되었습니다.";
            $("#sortable").find("[data-same=false]").attr("data-same", "true");
            isSortable(msg);
        } else {
            alert("변경이 가능합니다.");
        }
*/
    });

    // 등록하기
    $("#mallLogoAdd").click(function(){
        var logoEle = $(".myinfo-screen-view");
        var logoNo = $(".myinfo-screen-view-list").find("li").length;
        $("#sellerMallLogo").find(".myinfo-screen-num").empty().html(logoNo+1);

        $("#sellerMallLogo").slideToggle();

        $(this).attr("disabled", true);
        if(logoEle.length > 0){
            $(".btn-logo-modify").attr("disabled", true);
        }
    });

    // 등록 취소
    $("#addCancel").click(function(){
        var $parent = $(this).closest("form");
        $parent[0].reset();
        $parent.find(".file-thumb-img").empty();

        $("#sellerMallLogo").slideToggle();
        $("#mallLogoAdd").removeAttr("disabled");
        $(".btn-logo-modify").removeAttr("disabled");
    });

    // 편집
    $(".btn-modify").click(function(){
        var $parent = $(this).closest("form");
        $parent.addClass("modify-show");
        btnDisabled();
    });

    // 삭제
    $(".btn-delete").click(function () {
        var $form = $(this).closest("form"),
            $url = "/seller/mall/logo-delete",
            $formData = $form.find("input[name=logoNo]").serializeArray();

        cms.pgAlert({
            "aClass": 'confirm',
            "aContent": '삭제하시겠습니까?',
            "aButton": [
                {
                    text: "확인",
                    "class": 'btn-confirm',
                    click: function() {
                        cms.ajaxPost({
                            "url" : $url,
                            "formData": $formData
                        });
                        $(this).dialog("close");
                    }
                },
                {
                    text: "취소",
                    "class": 'btn-cancel',
                    click: function() {
                        $(this).dialog("close");
                    }
                }
            ]
        });

    });

    // 등록하기
    $( "#sellerMallLogo" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this),
            $url = $form.attr("action"),
            $formData = cms.seriailzeMonitoringBlank($form);

        if($("input[name=LogoCid]").val() == ""){
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '메인배너 이미지는 필수 입니다.'
            });
            return false;
        }

        cms.ajaxPost({
            "url" : $url ,
            "formData": $formData
        });

    });

    // 편집 취소
    $(".btn-modify-cancel").click(function( event ){
        event.stopPropagation();
        var $parent = $(this).closest("form");
        $parent.removeClass("modify-show");
        btnEnabled();

        $parent.find(".parsley-error-list").remove();
        $parent.find("[data-value]").each(function(){
            var value = $(this).data("value");
            // 이미지 복구
            if($(this).get(0).tagName == "IMG"){
                $(this).attr("src", value);
            }
            // 이미지 파일명 복구
            else if($(this).hasClass("img-info")){
                $(this).empty().text(value)
            }
            else {
                $(this).val(value);
            }
        });

    });

    // 편집
    $(".btn-modify-submit").click(function ( event ) {
        event.preventDefault();

        var $form = $(this).closest("form"),
            $url = $form.attr("action"),
            $formData = cms.seriailzeMonitoringBlank($form),
            $logoNo = $form.find("input[name=logoNo]").val(),
            sameDataLength = $form.find("[data-same='false']").length;

        if(sameDataLength==0){
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        $formData.push({"name":"logoNo", "value": $logoNo});
        // console.log($formData);

        console.log("imgUrl2:"+$form.find("[data-name=LogoUrl]").attr("src"));

        cms.ajaxPost({
            "url" : $url,
            "formData": $formData,
            "callback": function (result) {

                $.each($formData, function() {
                    var value = this.value;
                    var targetInput = $form.find('[name='+this.name+']');
                    var targetName = $form.find('[data-name='+ this.name +']');

                    // img src 및 파일명
                    if(targetName.data("name") == "LogoCid"){
                        var imgLogo = $form.find("[data-name=LogoUrl]");
                        var imgSrc = imgLogo.attr("src");
                        imgLogo.attr("src", imgSrc).attr("data-value", imgSrc);
                        value = $form.find(".img-info").text();
                    } else {
                        targetInput.attr("data-value", value);
                        targetInput.attr("value", value);
                    }
                    targetName.empty().html(value);
                });
                $form.find("[data-same=false]").attr("data-same", "true");
                $(".btn-modify-cancel").click();

                cms.pgAlert({
                    "aClass": 'warning', //success warning error
                    "aContent": result.result.resMsg
                });
            }
        });
    });

});