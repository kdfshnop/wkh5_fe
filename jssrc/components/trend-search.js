/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：components -> trendSearch（搜索框的组件）
 3. 作者：liyang@lifang.com
    参数说明：
    selectName 点击的class
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

define(function(){
    let that;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击icon搜索框的出现
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    let selectFun = function (select) {
        $(`.${select}`).click(function () {
            $('#search').show();
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            // Storage取值渲染搜索历史
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            if (JSON.parse(localStorage.getItem('searchTrendHistory')) ) {
                $('.history').show();
                let searchHistory = JSON.parse(localStorage.getItem('searchTrendHistory')).reverse();
                let listSearchHistory ='';
                /* 埋点的参数*/
                let bigdata =encodeURIComponent(JSON.stringify({
                    eventName: '1203005',
                    channel:"channelFlag" ,
                    type: 2
                }));
                searchHistory.forEach(function (item,index) {
                        listSearchHistory += `<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.id}" data-name="${item.key}" data-address="${item.address}"><p>${item.key}</p><span>${item.address}</span></li>`
                });
                $('#resultHistory').empty().append(listSearchHistory);
                // 历史搜索点击
                $('#resultHistory >li').click(function () {
                    let singleData = {
                        "key":$(this).attr('data-name'),
                        "id": $(this).attr('data-value'),
                        "address": $(this).attr('data-address'),
                        "type":$(this).attr('data-type'),
                    };
                    historyList(singleData)
                })
            }else {
                $('.history').hide();
            }
        });
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击icon搜索框的隐藏
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $('.icon-fanhui').click(function () {
        $('#search').hide();
    });
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    点击icon搜索框的清空
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $('.icon-close').click(function () {
        $('#searchInput').val('');
        $('#showResult').empty().append().parent().hide();
        $(this).hide();
        $('.no-result').hide();
    });
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    阻止表单的默认行为：
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $('.input-kw-form').submit(function(event){
        event.preventDefault();
    });
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    清楚搜索历史
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $('#clearHistory').click(function () {
        localStorage.removeItem('searchTrendHistory');
        $('#resultHistory').empty();
        $('.history').hide();
    });
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    联想词的检索
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    $('#searchInput').on('keyup input',function () {
        if ($(this).val()) {
            $('.icon-close').show();
            $('.history').hide();
            let listData; // 搜索联想结果
            let searchaAcWord =''; // 拼装dome节点
            let sendData={
                key:$(this).val(),
                cityId:$.cookie('cityId') || 43,
                pageName:"oldhouselist"
            };
            /* 埋点的参数*/
            let bigdata =encodeURIComponent(JSON.stringify({
                eventName: '1203004',
                channel:"channelFlag" ,
                type: 2
            }));
            that.request(that.apiUrl.common.acWord,sendData,{successCallback(data){
                      listData = data.data;
                    if (listData.secondHouseList){
                       $('.have-result').show();
                       $('.no-result').hide();
                        let titleName ='';
                        let addreName = '';
                        listData.secondHouseList.forEach(function (item,index) {  // 循环出搜索结果
                            if (item.type == 1 || item.type == 2 || item.type == 5) {
                                titleName = item.estateDesc.replace(item.markname, `<span>${item.markname}</span>`);
                                addreName = item.address.replace(item.markname, `<span>${item.markname}</span>`);
                                searchaAcWord += `<li data-bigdata="${bigdata} " data-type="${item.type}" data-value="${item.value}" data-name="${item.estateDesc}" data-address="${item.address}"><p>${titleName}</p><span>${addreName}</span></li>`
                            }
                        }) ;
                        $('#showResult').empty().append(searchaAcWord);
                    }else {
                        $('#showResult').empty();
                        $('.have-result').hide();
                        $('.no-result').show();
                    }
                    $('#showResult > li').click(function () {
                        let singleData = {
                            "key":$(this).attr('data-name'),
                            "id": $(this).attr('data-value'),
                            "address": $(this).attr('data-address'),
                            "type":$(this).attr('data-type'),
                        };
                        historyList(singleData)
                    })
                }});
            if (searchaAcWord) { // enter键出发的搜索
                if (event.keyCode == 13) {
                    let singleData = {
                        "key": $('#showResult>li:eq(0)').attr('data-name'),
                        "id": $('#showResult>li:eq(0)').attr('data-value'),
                        "address": $('#showResult>li:eq(0)').attr('data-address'),
                        "type": $('#showResult>li:eq(0)').attr('data-type'),
                    };
                    historyList(singleData)
                }
            }
        }else {
            $('#showResult').empty().parent().hide();
            $('.icon-close').hide();
            if (localStorage.getItem('searchTrendHistory')){
                $('.history').show();
            }else {
                $('.history').hide();
            }

        }
    });
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    联想词的检索历史储存到localStorage
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    let historyList = function (singleData) {
       let  saveLocalStorage = JSON.parse(localStorage.getItem('searchTrendHistory')) ? JSON.parse(localStorage.getItem('searchTrendHistory')) : [];
        saveLocalStorage.forEach(function (item, index) {
            if (item.id == singleData.id && item.type == singleData.type) {
                saveLocalStorage.splice(index, 1)
            }
        });
        if (saveLocalStorage.length > 4) {
            saveLocalStorage.reverse().splice(4)
        }
        let saveLocal = saveLocalStorage.reverse();
        saveLocal.push(singleData);
        localStorage.setItem("searchTrendHistory", JSON.stringify(saveLocal));
    };
    return {
        init: function(c){
            that = c;
        },
        selectFun : selectFun
    }
});