function setImgUrl(url, cid, id) {
    var formEle = $("#"+id);
    var lastIndex = url.lastIndexOf("=");
    var imgName = url.substring(lastIndex + 1);

    formEle.find('input[name=CompanyLogoCid]').val(cid).trigger('change');
    // img tag 유무
    if(formEle.find('.file-thumb-img img').length > 0){
        formEle.find('img').attr('src', url);
    }else{
        formEle.find(".file-thumb-img").append('<img src="'+url+'">');
    }
    
    //버튼 text 변경
    formEle.find(".crop-popup").empty().text("이미지 변경");
    formEle.find(".img-info").empty().text(imgName);

    /** cid 별도 저장 후 서버 전송 **/
}

$(document).ready(function(){
    // input data monitoring
    cms.inputMonitoring();

    $(".btn-modify").click(function(){
        var $parent = $(this).closest("form");
        $parent.addClass("modify-show");
    });

    // 수정 취소
    $(".btn-modify-cancel").click(function( event ){
        event.preventDefault();
        var $parent = $(this).closest("form");
        $parent.removeClass("modify-show");
        $parent.find(".parsley-error-list").remove();
        $parent.find("[data-value]").each(function(){
            var value = $(this).attr("data-value");
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

    //기본정보 수정
    $( "#sellerUpdate" ).submit(function( event ) {
        event.preventDefault();
        var $form = $( this ),
            url = $form.attr( "action" ),
            sameDataLength = $form.find("[data-same='false']").length;

        if(sameDataLength==0){
            // isValid = false;
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        if ( $form.parsley().isValid() ) {
            var formData = $form.serializeArray();

            cms.ajaxPost({
                "url" : url,
                "formData": formData,
                "callback": function (result) {

                    $.each(formData, function() {
                        var value = this.value;
                        $form.find('#'+ this.name).attr("data-value", value);
                        $form.find('#'+ this.name).attr("value", value);

                        if (this.name == "OfsPhoneNum"){
                            value = cms.phoneFormat(value);
                        }
                        $form.find('[data-name='+ this.name +']').empty().html(value);
                    });
                    $form.find("[data-same=false]").attr("data-same", "true");
                    $(".btn-modify-cancel").click();

                    cms.pgAlert({
                        "aClass": 'warning', //success warning error
                        "aContent": result.result.resMsg
                    });

                }
            });

        }
    });
    
    // 기업로고 삭제
    // $("#companyLogoDel").click(function(){
    //     var $parent = $(this).closest("form");
    //     $parent.find(".file-thumb-img img").attr("src", "");
    //     $parent.find("input[name=CompanyLogoCid]").val("").trigger('change');
    // });


    //추가정보 수정
    $( "#sellerExtraInfo" ).submit(function( event ) {
        event.preventDefault();
        var $form = $( this ),
            url = $form.attr( "action" ),
            sameDataLength = $form.find("[data-same='false']").length;

        if(sameDataLength==0){
            // isValid = false;
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        if ( $form.parsley().isValid()) {
            var logocid = $("input[name=CompanyLogoCid]");

            if(logocid.val() == "" || logocid.data('same')){
                logocid.attr('disabled','disabled');
            }
            var formData = $form.serializeArray();
            logocid.removeAttr('disabled');

            cms.ajaxPost({
                "url" : url,
                "formData": formData
            });
        }
    });

    //비밀번호 변경
    $("#passwordComplete").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            MemPwd = $('input[name=MemPwd]'),
            NewMemPwd = $('input[name=newMemPwd]');

        if (MemPwd.val() == NewMemPwd.val()) {
            $("#pwdError").empty().text("현재 비밀번와 변경 비밀번호는 같을 수 없습니다.");
            NewMemPwd.focus();
            return false;
        }
        if ( $form.parsley().isValid() ) {
            $form.get(0).submit();
        }
    });

    // 이미지 등록 crop popup
    $('.crop-popup').click(function(e) {
        e.preventDefault();
        var parentId = $(this).closest("form").attr("id");
        var url = "/crop?maxW=155&maxH=155&formId="+parentId;
        window.open(url, "_blank", "width=900px, height=800px, toolbar=no, menubar=no, scrollbars=no, resizable=no");
    });

});