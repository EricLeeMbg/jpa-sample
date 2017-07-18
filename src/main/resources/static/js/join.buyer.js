$(document).ready(function(){
    if($('#joinTerms').length > 0){
        cms.allCheckBox('allCheckbox', 'agreement', 'agreement-msg');

        $( '#joinTerms' ).submit(function( event ) {
            event.preventDefault();
            var $form = $(this);

            if($('#allCheckbox').prop('checked')){
                $form.get(0).submit();
            }
            else {
                $('.agreement-msg').show();
            }
        });

    }


    //id 중복 쳌크
    $('#memEmailDuplication').click(function () {
        var inputTarget = $('#memId');
        var $this = $(this);

        if(inputTarget.parsley('validate')){
            cms.ajaxPost({
                "url": "/checkId/buyer",
                "formData": inputTarget.serialize(),
                "callback": function(result){
                    $('#memIdResult').empty().text('사용가능한 메일입니다.');
                    $this.attr('data-validate', 'true');
                    $('#memPwd').focus();
                }
            });
        }
        else {
            inputTarget.focus();
        }
    });

    //인증번호 전송
    $('#mobileConfirmGet').click(function(){
        var inputTarget = $('#phoneNum');
        var $this = $(this);

        if(inputTarget.parsley('validate')){
            cms.ajaxPost({
                "url": "/reqSmsAuth",
                "formData": inputTarget.serialize(),
                "callback": function(result){
                    $this.attr('data-validate', 'true');
                    $('#authForm').removeClass("hidden");
                    $('#authId').val(result.data['authId']);
                    $('#authNo').focus();
                }
            });
        }
        else {
            inputTarget.focus();
        }
    });

    //인증 확인
    $('#mobileConfirmPost').click(function(){
        var inputTarget = $('#authNo');
        var $this = $(this);
        console.log($('#authForm input').serializeArray());

        if(inputTarget.parsley('validate')){
            cms.ajaxPost({
                "url": "/checkSmsAuth",
                "formData": $('#authForm input').serializeArray(),
                "callback": function(result){
                    $this.attr('data-validate', 'true');
                    $('#authNoResult').empty().text('인증되었습니다.');
                    $('.btn-join').focus();
                }
            });
        }
        else {
            inputTarget.focus();
        }
    });

    $( "#memberJoin" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this),
            url = $form.attr( "action" ),
            formData = $form.serializeArray();

        if($form.parsley('validate')){
            if(!$('#memEmailDuplication').data('validate')){
                $('#memEmailDuplication').focus();
                return false;
            }
            if(!$('#mobileConfirmGet').data('validate')){
                $('#mobileConfirmGet').focus();
                return false;
            }
            if(!$('#mobileConfirmPost').data('validate')){
                $('#mobileConfirmPost').focus();
                return false;
            }

            // $form.get(0).submit();
            cms.ajaxPost({
                "url" : url,
                "formData": formData,
                "callback": function (result) {
                    $(location).attr('href', '/join/complete ');
                }
            });

        }
    });

});