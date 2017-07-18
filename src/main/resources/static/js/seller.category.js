var msg;
var sortable = $("#sortable");
var sortableItems = sortable.find("li");

$(function(){
    sortable.sortable({
        axis: "y",
        containment: "parent",
        handle: ".handle",
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
                    $(this).parent().find("input[name=categoryNo]").attr("data-same", "false");
                }else{
                    $(this).attr("data-same", "true");
                    $(this).parent().find("input[name=categoryNo]").attr("data-same", "true");
                }
            });

        },
        disabled: true
    }).disableSelection();
});
function btnDisabled() {
    $("#categoryAdd").attr("disabled", true);
    $(".btn-category-modify").attr("disabled", true);
};
function btnEnabled() {
    $("#categoryAdd").removeAttr("disabled");
    $(".btn-category-modify").removeAttr("disabled");
};
function activeSortable() {
    var sortable = $("#sortable");

    sortable.sortable( "option", { disabled: false } );
    sortable.addClass("order-modify-show");
    sortable.find(".modify-show").removeClass("modify-show");
    btnDisabled();

    $("#categoryOrder").addClass("hidden");
    $(".btn-order").removeClass("hidden");
};
function isSortable( msg ) {
    var sortable = $("#sortable");

    sortable.sortable( "option", { disabled: true } );
    sortable.removeClass("order-modify-show");

    btnEnabled()

    $("#categoryOrder").removeClass("hidden");
    $(".btn-order").addClass("hidden");

    if(msg){
        cms.pgAlert({
            "aClass": 'warning', //success warning error
            "aContent": msg
        });
    }
};

$(document).ready(function() {
    cms.inputMonitoring();

    $("input[name=isActivated], input[name=isExpose]").change(function() {
        var thisVal = $(this).val();
        var oldVal = $(this).attr("data-value");

        if(this.checked) {
            $(this).attr("checked", true).val("Y");
            thisVal = "Y";
        }else {
            $(this).attr("checked", false).val("N");
            thisVal = "N";
        }

        if(thisVal != oldVal){
            $(this).attr("data-same", "false");
        }else{
            $(this).attr("data-same", "true");
        }
    });

    // 순서 변경 활성화
    $("#categoryOrder").click(function(){
        if(sortableItems.length>1){
            activeSortable();
        } else {
            alert("최소 2개 이상일때 순서 변경이 가능합니다.");
        }
    });
    // 순서 변경 취소
    $("#mallOrderReset").click(function(){
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

    });

    // 등록
    $("#categoryAdd").click(function(){
        var categoryEle = $(".category-list").find("li");
        var categoryNo = categoryEle.length;
        $("#addSellerProductCategory").find(".category-no").empty().html(categoryNo+1);

        $("#addSellerProductCategory").slideToggle();
        $(this).attr("disabled", true);
        $("#addSellerProductCategory input[name=categoryName]").removeAttr("readonly");
        $("#addSellerProductCategory input[name=categoryDesc]").removeAttr("readonly");

        if(categoryNo > 0){
            $(".btn-category-modify").attr("disabled", true);
        }
    });

    // 등록 취소
    $("#addCancel").click(function(){
        var $parent = $(this).closest("form");
        $parent[0].reset();

        $("#addSellerProductCategory").slideToggle();
        $("#categoryAdd").removeAttr("disabled");
        $(".btn-category-modify").removeAttr("disabled");
    });


    // 등록하기
    $( "#addSellerProductCategory" ).submit(function( event ) {
        event.preventDefault();
        var $form = $(this),
            $url = $form.attr("action"),
            $formData = $form.serializeArray();

        if(!$.trim($form.find('input[name=categoryName]').val()).length){
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '카테고리명은 필수 입니다.'
            });
            return false;
        }

        if(!$form.find("input[name=isActivated]").prop("checked")){
            $formData.push({"name":"isActivated", "value": "N"});
        }

        if ( $form.parsley().isValid() ) {
            cms.ajaxPost({
                "url" : $url ,
                "formData": $formData
            });
        }
        else{
            var errorEle = $form.find('.parsley-error-list li');
            var errorMsg = errorEle.text();
            if(errorEle.length > 1){
                errorMsg = errorMsg.replace('요', '요\n');
            }
            cms.pgAlert({
                "aClass": 'error', //success warning error
                "aContent": errorMsg
            });
        }


    });

    $(".btn-modify").click(function(){
        var $parent = $(this).closest("form");
        $parent.addClass("modify-show");
        btnDisabled();
        $("input[name=categoryName]").removeAttr("readonly");
        $("input[name=categoryDesc]").removeAttr("readonly");
        var isActivated = $parent.find("input[name=isActivated]");
        var isExpose = $parent.find("input[name=isExpose]");
        if(isActivated.val() == "Y"){
            isActivated.attr("checked", true);
        }else {
            isActivated.removeAttr("checked");
        }
        if(isExpose.val() == "Y"){
            isExpose.attr("checked", true);
        }else {
            isExpose.removeAttr("checked");
        }
    });

    // 편집 취소
    $(".btn-modify-cancel").click(function( event ){
        event.stopPropagation();
        var $parent = $(this).closest("form");
        $parent.removeClass("modify-show");
        btnEnabled();
        $("input[name=categoryName]").attr("readonly", true);
        $("input[name=categoryDesc]").attr("readonly", true);

        $parent.find("[data-value]").each(function(){
            var value = $(this).data("value");
        });
    });

    // 편집
    $(".btn-modify-submit").click(function ( event ) {
        event.preventDefault();
        var $form = $(this).closest("form"),
            $url = $form.attr("action"),
            $formData = cms.seriailzeMonitoringBlank($form),
            $categoryNo = $form.find("input[name=categoryNo]").val(),
            sameDataLength = $form.find("[data-same='false']").length;

        if(!$.trim($form.find('input[name=categoryName]').val()).length) {
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '카테고리명은 필수 입니다.'
            });
            return false;
        }

        if(sameDataLength==0){
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": '수정된 내용이 없습니다.'
            });
            return false;
        }

        $formData.push({"name":"categoryNo", "value": $categoryNo});
        if(!$form.find("input[name=isActivated]").prop("checked")){
            $formData.push({"name":"isActivated", "value": "N"});
        }
        if(!$form.find("input[name=isExpose]").prop("checked")){
            $formData.push({"name":"isExpose", "value": "N"});
        }


        if ( $form.parsley().isValid() ) {
            cms.ajaxPost({
                "url" : $url,
                "formData": $formData,
                "callback": function (result) {

                    $.each($formData, function() {
                        var value = this.value;
                        var targetInput = $form.find('[name='+this.name+']');
                        if(this.name == "isActivated"){
                            if(value == "Y"){
                                $form.parents("li").removeClass("isactive");
                            }else{
                                $form.parents("li").addClass("isactive");
                            }
                        }
                        if(this.name == "isExpose"){
                            if(value == "Y"){
                                $form.find(".category-expose").empty().append('<span class="icon-expose"></span>');
                            }else{
                                $form.find(".category-expose").empty();
                            }
                        }

                        targetInput.attr("data-value", value);
                        targetInput.attr("value", value);
                    });
                    $form.find("[data-same=false]").attr("data-same", "true");
                    $(".btn-modify-cancel").click();

                    cms.pgAlert({
                        "aClass": 'success', //success warning error
                        "aContent": result.result.resMsg
                    });
                }
            });
        }
        else{
            var errorEle = $form.find('.parsley-error-list li');
            var errorMsg = errorEle.text();
            if(errorEle.length > 1){
                errorMsg = errorMsg.replace('요', '요\n');
            }
            cms.pgAlert({
                "aClass": 'warning', //success warning error
                "aContent": errorMsg
            });
        }


    });

    // 삭제
    $(".btn-delete").click(function () {
        var $form = $(this).closest("form"),
            $url = "/seller/mall/category-delete",
            $formData = $form.find("input[name=categoryNo]").serializeArray();

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
    
    // 순서변경 적용
    $("#mallOrderSubmit").click(function (event) {
        event.preventDefault();
        var $form = $("#sortable"),
            $url = "/seller/mall/category-switch-order",
            $formData = [],
            sameDataLength = $form.find("[data-same='false']").length;

        if(sameDataLength==0){
            alert("수정된 내용이 없습니다.")
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
            }
        });

        console.log(JSON.stringify($formData));
        var formData = new FormData();
        formData.append("jsonParam", JSON.stringify($formData));

        msg ="순서가 변경되었습니다.";
        cms.ajaxListPost({
            "url" : $url ,
            "formData": formData,
            // "callback": function () {
            //     $("#sortable").find(".category-no").each(function (idx) {
            //         $(this).empty().html(idx+1);
            //     })
            //
            //     $("#sortable").find("[data-same=false]").attr("data-same", "true");
            //     isSortable(msg);
            //     sortable.sortable( "refreshPositions" );
            // }
        });

        $("#categoryAdd").removeAttr("disabled");
    });



    $(".category-productlist-view").click(function (event) {
        event.preventDefault();
        var $parents = $(this).closest("li"),
            $url = "/seller/mall/category-product",
            $tt = $(this).next("input").val();
            $ttTarget = $("#categoryProductTitle"),
            $categoryNo = $parents.find("input[name=categoryNo]").val(),
            $formData = "pageNo=1&categoryNo="+$categoryNo,
            $resultArea = $("#categoryProductList"),
            $resultListArea = $resultArea.find("#categoryProductDetailList");

        $ttTarget.show();
        $ttTarget.find("strong").empty().text($tt);
        $parents.addClass("select-category");

        addProductList($url, $formData);

        $resultArea.scroll(function(){
            if (Math.round($resultArea.scrollTop()) == $resultListArea.outerHeight(true) - $resultArea.height()){
                var currentPage = $("#productPageNum").val(),
                    totalPage = $("#productPageTotal").val();

                if(currentPage < totalPage) {
                    var pageNum = parseInt(currentPage) + 1;
                    $formData = "pageNo="+pageNum+"&categoryNo="+$categoryNo;

                    addProductList($url, $formData);
                }
            }
        });

    });

});

function addProductList(url, formData) {
    var resultArea = $("#categoryProductList"),
        resultListArea = resultArea.find("#categoryProductDetailList");

    cms.ajaxGet({
        "url" : url ,
        "formData": formData,
        "callback": function (result) {
            var $total = result.data.totalCount,
                $product = result.data.list,
                $curPage = result.data.pageInfo.curPage,
                $totalPage = result.data.pageInfo.totalPage;

            $resultArea.addClass("active");
            if($total > 0){
                if($curPage == 1){
                    $ttTarget.find("span").empty().text("+"+$total);
                    $resultArea.find(".no-list").hide();
                    $resultListArea.empty();
                    $("#productPageTotal").val($totalPage);
                }

                $("#productPageNum").val($curPage);

                for (var i = 0; i < $product.length; i++) {
                    var pdNo = ($product[i].productNo),
                        pdName = ($product[i].productName),
                        pdId = ($product[i].productId),
                        ctgNo = ($product[i].categoryNo),
                        li = $('<li/>');

                    if(i == 0){
                        li.attr("id", $curPage);
                    }
                    li.append('<a href="/seller/mall/product/'+ pdNo +'">[' + pdId + '] ' +pdName + '</a>');
                    resultListArea.append(li);
                }

            }else {
                $ttTarget.find("span").empty().text($total);
                $resultArea.find(".no-list").show().find("a").attr("href", "/seller/mall/product-reg?categoryNo="+$categoryNo);
                $resultListArea.empty();
            };

        }
    });


}