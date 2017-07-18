$(function(){
    $("#pageForm").submit(function() {
        $(this).find(":input").filter(function(){ return !this.value; }).attr("disabled", "disabled");
        return true;
    });
});


$(document).ready(function() {
    var oEditors = [];
    cms.inputMonitoring();

    $('input:checkbox[name=chkRep]').click(function(){

        $(this).find(":input").filter(function(){ return !this.value; }).attr("disabled", "disabled");

        var $form = $(this).closest('form'),
            $productNo = $('#productNo').val();

        var $formData = $form.serialize() + "&productNo=" + $productNo;

        cms.ajaxPost({
            "url" : "/seller/mall/product/image-change-main",
            "formData": $formData
        });
    });

    $('.imglist-btn-area').find('button[name=btnDelete]').click(function() {
        var $form = $(this).closest('form'),
            $formData = $form.serialize();

        cms.pgAlert({
            "aClass": 'confirm',
            "aContent": '삭제하시겠습니까?',
            "aButton": [
                {
                    text: "확인",
                    "class": 'btn-confirm',
                    click: function() {
                        cms.ajaxPost({
                            "url" : "/seller/mall/product/image-del",
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

    $('.btn-delete').click(function() {
        var $form = $('#productDelete');
        cms.pgAlert({
            "aClass": 'confirm',
            "aContent": '삭제하시겠습니까?',
            "aButton": [
                {
                    text: "확인",
                    "class": 'btn-confirm',
                    click: function() {
                        $form.submit();
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

    $('#sellerProductModify').submit(function(event) {
        event.preventDefault();
        var $form = $(this),
            $url = $form.attr("action"),
            $productNo = $('#productNo').val(),
            cidArray = [];

        oEditors.getById["productContent"].exec("UPDATE_CONTENTS_FIELD", []);
        if($('#productContent').val() == "<p>&nbsp;</p>" || $('#productContent').val() == ""){
            $('#productContent').val('');
        }

        $('#showProductContent').empty().append($('#productContent').val());
        if($.trim($('#showProductContent').html()) == $.trim($('.producto-content').html())){
            $('#productContent').attr('data-same', true);
        }
        else{
            $('#productContent').attr('data-same', false);
        }
        
        $('#showProductContent').find('img').each(function(){
            var cid = new RegExp('[\?&]cid=([^&#]*)').exec($(this).attr('src'));
            cidArray.push(cid[1]);
        });

        $('#contentCidList').val(cidArray.join());
        if(!$('#contentCidList').val()){
            $('#contentCidList').val('');
        }
        
        //업로드 이미지 개수 제한
        if(cidArray.length > 32){
            cms.pgAlert({
                "aClass": 'warning',
                "aContent": '이미지는 32개 이상 첨부할 수 없습니다.'
            });
            return false;
        }

        var sameDataLength = $form.find("[data-same='false']").length
        if(sameDataLength==0){
            // isValid = false;
            cms.pgAlert({
                "aClass": 'warning',
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        if ( $form.parsley().isValid() ) {
            var $formData = $form.serialize()+ "&productNo=" + $productNo;
            //console.log($formData);
            cms.ajaxPost({
                "url" : $url,
                "formData": $formData
            });
        }

    });

    $('.table-list').find('tr').click(function() {
        var productNo = $(this).find('input[name=productNo]').val();

        location.href = "/seller/mall/product/" + productNo;
    });

    $(":input:radio[name=curCategoryNo], :input:radio[name=curIsActivated]").change(function(){

        // 등록 폼에서는 동작하면 안되기 때문에 문서 이름으로 판단 //
        var docName = document.location.href.match(/[^\/]+$/)[0];

        if(docName.indexOf("product-reg") !== -1)
            return;

        setProductFilter();

        // 첫페이지로 초기화 //
        goToPage(1);
    });

    $( "#sellerProductReg" ).on('submit', function( event ) {
        event.preventDefault();
        var $form = $(this);

        if ( $form.parsley().isValid() ) {
            $form.get(0).submit();
        }
    });
    
    // 수정
    $(".btn-modify").click(function(){
        var $parent = $(this).closest("form");
        var isPromotionVal = $parent.find('.input-val[data-name=isPromotion]').text();
        var isActivatedVal = $parent.find('.input-val[data-name=isActivated]').text();
        $parent.addClass("modify-show");

        $parent.find('input[name=isPromotion]').prop('checked', false);
        $parent.find('input[name=isPromotion][value='+isPromotionVal+']').prop('checked', true);
        $parent.find('input[name=isActivated]').prop('checked', false);
        $parent.find('input[name=isActivated][value='+isActivatedVal+']').prop('checked', true);

        $('#imgListDd').removeClass('hidden');

        oEditors = [];
        nhn.husky.EZCreator.createInIFrame({
            oAppRef: oEditors,
            elPlaceHolder: "productContent",
            sSkinURI: "/js/se2/SmartEditor2Skin.html",
            fCreator: "createSEditor2"
        });

    });

    // 수정 취소
    $(".btn-modify-cancel").click(function( event ){
        event.preventDefault();
        var $parent = $(this).closest("form");
        $parent.removeClass("modify-show");
        $('#imgListDd').addClass('hidden');

        $parent.find("input[type=radio]").removeAttr('data-same');
        $parent.find("[data-value]").each(function(){
            var value = $(this).attr("data-value");
            $(this).val(value);
        });
        $parent.find("#productContent").next('iframe').remove();
    });


    // 이미지 등록 crop popup
    $('.crop-popup').click(function(e) {
        e.preventDefault();

        var parentId = $(this).closest("form").attr("id");
        var url = "/crop?maxW=720&maxH=540&formId="+parentId;

        if(window._childwin != null) {
            window._childwin.focus();
        }
        else {
            window._childwin = window.open(url, "_blank", "width=900px, height=800px, toolbar=no, menubar=no, scrollbars=no, resizable=no");
        }
    });


});

function setImgUrl(url, cid, id) {

    /** cid 별도 저장 후 서버 전송 **/
    var $form = $('#'+id);

    // $form.find('input[name=imageCid]').val(cid);

    var $url = $form.attr("action");
    var $productNo = $('#productNo').val();
    var $formData = $form.serialize() + "&productNo=" + $productNo + "&imageCid=" + cid;

    cms.ajaxPost({
        "url" : $url,
        "formData": $formData
    });
}

function goToPage(pageNo) {

    $("input[name=pageNo]").val(pageNo);

    setProductFilter();

    $("#pageForm").submit();
}

function setProductFilter() {

    var categoryNo = $(":input:radio[name=curCategoryNo]:checked").val();
    var isActivated = $(":input:radio[name=curIsActivated]:checked").val();

    if (categoryNo != null || categoryNo != "") {
        $("#categoryNo").val(categoryNo);
    }

    if (isActivated != null && isActivated != "") {
        $("#isActivated").val(isActivated);
    }
}

