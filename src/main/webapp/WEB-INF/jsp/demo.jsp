<%--
  Created by IntelliJ IDEA.
  User: doohwan.yoo
  Date: 2016. 11. 7.
  Time: 오후 2:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>견적의신</title>
    <link href="/css/jquery.Jcrop.min.css" rel="stylesheet" />

    <!--[if lt IE 9]>
    <script src="/js/lib/html5shiv.min.js"></script>
    <script src="/js/IE9.js"></script>
    <![endif]-->
</head>
<body onbeforeunload="closePage()">

<div id="wrap">
    <div id="header">
        <h1>이미지 편집</h1>
        <div class="control-list top-right">
            <div class="img-control">
                <input type="radio" name="imgSize" id="imgSize0" value="0"/><label for="imgSize0">원본</label>
                <input type="radio" name="imgSize" id="imgSize1" value="1"/><label for="imgSize1">75%</label>
                <input type="radio" name="imgSize" id="imgSize2" value="2"/><label for="imgSize2">50%</label>
                <input type="radio" name="imgSize" id="imgSize3" value="3"/><label for="imgSize3">25%</label>
            </div>
            <form id="formCrop" class="img-file-info">
                <span id="imgInputArea" class="btn-file">
                	<label for="imgInput">이미지 변경</label>
                	<input type="file" class="input-file" id="imgInput" name="imgInput">
                </span>
                <input type="hidden" id="x" name="x" value="0">
                <input type="hidden" id="y" name="y" value="0">
                <input type="hidden" id="w" name="w" value="0">
                <input type="hidden" id="h" name="h" value="0">
                <input type="hidden" id="maxW" name="maxW" value="${param.maxW}">
                <input type="hidden" id="maxH" name="maxH" value="${param.maxH}">
                <input type="hidden" id="isCropImage" name="isCropImage" value="true">
                <input type="hidden" id="parentId" name="parentId" value="${param.formId}">
            </form>
        </div>
    </div>
    <div id="container">
        <div id="imgAdd">
            <p>
                <strong>편집할 이미지를 등록해주세요.</strong><br>
                (등록가능 확장자 : jpg, jpeg, png, bmp)
            </p>
            <button type="button" id="btnAddimg">이미지 첨부</button>
        </div>
        <img src="" class="input-img" id="imgSrc" name="imgSrc">
    </div>
    <div id="footer">
        <button type="button" id="closeCrop" class="btn-cancel">취소</button>
        <button type="button" id="doCrop" class="btn-success">저장</button>
    </div>
</div>

<script type="text/javascript" src="/js/lib/jquery.min.js"></script>
<script type="text/javascript" src="/js/lib/jquery.Jcrop.min.js"></script>
<script language="javascript" type="text/javascript">
    $(document).ready(function() {
        var reader = new FileReader();

        var cropMaxW = $('#maxW').val(),
            cropMaxH = $('#maxH').val(),
            originW = 0,
            originH = 0,
            isNewImg = false,
            jcrop_api = null,
            curSrc = null;

        function showCoords(obj) {
            $("#x").val(obj.x);
            $("#y").val(obj.y);
            $("#w").val(obj.w);
            $("#h").val(obj.h);
        };

        $("#btnAddimg").click(function(){
            $('#imgInput').click();
        });

        $('#imgInput').change(function() {
            var size = 0;
            var maxSize = 5;

            if (window.FileReader && window.File && window.FileList && window.Blob) {
                // HTML5 File API Supported
                size = $(this)[0].files[0].size / 1048576;
            }
            else {
                // Need to use ActiveX to read the file size
                var myFSO = new ActiveXObject("Scripting.FileSystemObject");
                var filepath = $(this).val();
                var thefile = myFSO.getFile(filepath);
                size = thefile.size / 1048576;
            }

            if (size > maxSize) {
                alert('5MB이하의 이미지 파일만 등록할 수 있습니다. ' + maxSize + 'MB');
                return false;
            }

            reader.onload = function(e) {
                curSrc = e.target.result;
                if (curSrc.match(/^data:image\//)) {
                    $("#imgAdd").hide();
                    $("#imgInputArea").show();

                    $('input:radio[name="imgSize"][value="0"]').prop('checked', true);
                    $("#imgSrc").css({"height": "auto","width": "auto"});

                    if(!isNewImg) {
                        isNewImg = true;
                    }

                    if(jcrop_api != null) {
                        jcrop_api.destroy();
                    }

                    $("#imgSrc").attr("src", curSrc);
                } else {
                    alert("이미지가 아닙니다.");
                    curSrc = $("#imgSrc").attr("src");
                    return false;
                }

            }

            reader.readAsDataURL(this.files[0]);
        });

        $("#imgSrc").load(function(){

            if(isNewImg) {
                originW = $(this).width();
                originH = $(this).height();
                isNewImg = false;
            }

            $('.img-control').show();

            var cropDefWidth = ($(this).width() > cropMaxW ? cropMaxW : ($(this).width() > $(this).height() ? $('#maxH').val() / $('#maxW').val() * $(this).height(): $(this).width()));
            var cropDefHeight = ($(this).height() > cropMaxH ? cropMaxH :($(this).height() > $(this).width() ? $('#maxW').val() / $('#maxH').val() * $(this).width(): $(this).height()));

            if(cropDefHeight == $(this).height() || cropDefWidth == $(this).width()) {
                if(cropDefHeight < cropDefWidth)
                    cropDefWidth = $('#maxW').val() / $('#maxH').val() * cropDefHeight;
                else
                    cropDefHeight = $('#maxH').val() / $('#maxW').val() * cropDefWidth;
            }

            jcrop_api = $.Jcrop('#imgSrc', {
                onChange : showCoords,
                onSelect : showCoords,
                bgColor:     'black',
                bgOpacity:   .4,
                minSize: [cropDefWidth, cropDefHeight],
                setSelect:   [ 0, 0, cropDefWidth, cropDefHeight ],
                aspectRatio: $('#maxW').val() / $('#maxH').val()
            });
        });

        $("input[name='imgSize']").change(function(){
            var type = $(':radio[name="imgSize"]:checked').val(),
                width = 0,
                height = 0;

            switch(type) {
                case "0":
                    width = originW;
                    height = originH;
                    break;
                case "1":
                    width = originW * 0.75;
                    height = originH * 0.75;
                    break;
                case "2":
                    width = originW * 0.50;
                    height = originH * 0.50;
                    break;
                case "3":
                    width = originW * 0.25;
                    height = originH * 0.25;
                    break;
                default:
                    width = originW;
                    height = originH;
            }

            jcrop_api.destroy();
            $("#imgSrc").attr("src", curSrc).css({"width": width, "height": height});
        });

        $('#closeCrop').click(function(){
            self.close();
        });

        $('#doCrop').click(function() {
            var formData = new FormData();
            formData.append("fileData",$("input[name=imgInput]")[0].files[0]);
            formData.append("x", parseInt($('#x').val()));
            formData.append("y", parseInt($('#y').val()));
            formData.append("w", parseInt($('#w').val()));
            formData.append("h", parseInt($('#h').val()));
            formData.append("maxW", $('#maxW').val());
            formData.append("maxH", $('#maxH').val());
            formData.append("imgW", $('#imgSrc').width());
            formData.append("imgH", $('#imgSrc').height());
            formData.append("isCropImage", 'Y');

            var parentId = $("#parentId").val();

            $.ajax('/upload', {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (result) {
                    window.opener.setImgUrl(result.data.attachUrl, result.data.cid, parentId);
                    self.close();
                },
                error: function () {
                    alert('Upload error');
                }
            });
        });
    });

    function closePage() {
        window.opener._childwin = null;
    }

</script>

</body>
</html>