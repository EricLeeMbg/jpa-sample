$(document).ready(function(){
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
                    $('.btn-base').focus();
                }
            });
        }
        else {
            inputTarget.focus();
        }
    });

    $( "#memberId" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this);

        if($form.parsley('validate')){
            if(!$('#mobileConfirmGet').data('validate')){
                $('#mobileConfirmGet').focus();
                return false;
            }
            if(!$('#mobileConfirmPost').data('validate')){
                $('#mobileConfirmPost').focus();
                return false;
            }
            $form.get(0).submit();
        }
    });

    $( "#memberPw" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this);

        if($form.parsley('validate')){
            if(!$('#mobileConfirmGet').data('validate')){
                $('#mobileConfirmGet').focus();
                return false;
            }
            if(!$('#mobileConfirmPost').data('validate')){
                $('#mobileConfirmPost').focus();
                return false;
            }

            $form.get(0).submit();
        }
    });

    $( "#memberPwChange" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this);

        if($form.parsley('validate')){
            $form.get(0).submit();
        }
    });

});