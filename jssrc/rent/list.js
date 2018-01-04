/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


class ListController extends Controller {
    constructor() {
        super();
        this.readyFun();
        this.choseFun();
        let that = this;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取城市区域
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.cityAreas,{houseType:3,cityId:3},{successCallback(data){
                if (data.status == 1){
                    let dataRes = data;
                    that.giveAreasData(dataRes);
                }
            }});
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        请求接口 获取地铁
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.request(this.apiUrl.rent.list.citySubway,{cityId:3},{successCallback(data){
                if (data.status == 1){
                    let dataRes = data;
                    that.giveSubwayData(dataRes);
                }
            }});
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的初始化函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    readyFun() {
        $('.dic').hide();
        $('.bac').hide();
        $('.price-total').hide();
        $('.house-type').hide();
        $('.more').hide();
        $('.sort-chose').hide();
        $('.content-hight').height($('.dic').height() - $('.tabs').height());
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    条件选择的区域选择的点击效果函数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    choseFun() {
            /* 条件选择点击事件*/
        $('.rent-list > ul > li').click(function () {
            let listI =  $('.rent-list > ul > li > span >i');  // 获取检索箭头的  i标签
            listI.each(function (index, item) {     // 循环i标签（下箭头）是否有样式为蓝色，是代表用户选取了数据，否代表没有选取
                if (item.classList.length == 1){
                    $('.rent-list > ul > li:eq(index)').addClass('active-color-top');
                }else {
                    $('.rent-list > ul > li:eq(index)').removeClass('active-color-top');
                }
            });
            $(this).siblings().children('span').removeClass('direction');
            /*点击li标签事件改变子标签span箭头的样式（后面会选中条件查询之后恢复指向）*/
            $(this).children('span').toggleClass('direction');
            let list = $('.rent-list > ul > li > span');  // 获取检索当中的span标签   后面判断指向 （根据class判断指向）
            $('.bac').hide();
            list.each(function (index, item) {   //根据span标签的样式指向判断底部罩层是否显示
                if (item.classList.length == 1) {
                    $('.bac').show();
                }
            });
            let indexP = $(this).index();
            /*根据点击li标签的位置判断相应的模块响应出现*/
            if (indexP == 0) {     /*判断区域模块的显示*/
                $('.dic').stop();
                $('.price-total').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.dic').slideToggle();
            } else if (indexP == 1) {      /*判断价格模块的显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.house-type').hide();
                $('.more').hide();
                $('.price-total').slideToggle();
            } else if (indexP == 2) {    /* 判断户型模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.more').hide();
                $('.house-type').slideToggle();
            } else if (indexP == 3) {    /* 判断更多模块显示*/
                $('.bac').stop();
                $('.dic').hide();
                $('.price-total').hide();
                $('.house-type').slideUp();
                $('.more').slideToggle();
            }
        });
        /*区域与地铁选择点击事件*/
        $('.tabs > ul > li').click(function () {
            $(this).siblings().removeClass('active-color-dic');
            $(this).addClass('active-color-dic');
            let indexP = $(this).index();
            if (indexP == 0) {      /*判断区域模块显示或隐藏*/
                $('.metro-content').hide();
                $('.dic-content').slideDown();
            } else if (indexP == 1) {   /*判断地铁模块显示或隐藏*/
                $('.dic-content').hide();
                $('.metro-content').slideDown();
            }
        });
        /* 租房价格点击选择函数*/
        $('.price-list > ul >li').click(function () {
            $(this).siblings().removeClass('chosed');
            $(this).addClass('chosed');
            $('.bac').hide();
            $('#price').children('span').removeClass('direction');
            if ($(this).html() == '不限'){
                $('#price>p').html("租金");
                $('#price').find('i').removeClass('bacchosed');
                $('#price').removeClass('active-color-top');
            }else {
                $('#price>p').html($(this).html().replace(/\s|\xA0/g,""));
                $('#price').find('i').addClass('bacchosed');
                $('#price').addClass('active-color-top');
            }
            $('.price-total').slideToggle();
        });
        /* 房型选择点击事件*/
        $('.house-list > ul > li').click(function () {
            let indexP = $(this).index();
            if (indexP == 0) {
                $(this).siblings().removeClass('active-house');
                $(this).toggleClass('active-house');
            } else {
                $('.house-list > ul > li:eq(0)').removeClass('active-house');
                $(this).toggleClass('active-house');
            }
        });
        /*排序点击弹出*/
        $('#sort').click(function () {
            $('.bac').css({'z-index': '13', 'top': '0'});
            $('.bac').show();
            $('.sort-chose').slideToggle();
        });
        /*排序点击选择*/
        $('.sort-chose>ul>li').click(function () {
            $('.bac').css({'z-index': '10', 'top': '4.5rem'});
            $('.bac').hide();
            $(this).siblings().removeClass('chosed');
            $(this).addClass('chosed');
            $('.sort-chose').slideToggle();
        });
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取城市区域之后渲染到页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    giveAreasData(dataAreas){
        console.log(dataAreas.data);
        let dataDic = dataAreas.data;
        let dicAreas = "<li >不限</li>";
        dataDic.forEach(function (item) {   // 循环渲染地铁线路
            dicAreas += `<li data-id ="${item.id}" data-di="di-${item.id}">${item.name}</li>`
        });
        $('#dicAreas').append(dicAreas);
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    获取地铁之后渲染到页面
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    giveSubwayData(dataSubway){
        let subwayLine = dataSubway.data;
        let metroLine = '';
        subwayLine.forEach(function (item) {   // 循环渲染地铁线路
            metroLine += `<li data-id ="${item.id}" data-li="li-${item.id}">${item.name}</li>`
        });
        $('#metroLine').append(metroLine);
        $('#metroLine > li').click(function () {   // 点击地铁线路更换相应的站点
            let dataLineId = $(this).attr("data-id");  // 地铁线路的id 后面循环对比需要
            let dataLineLi = $(this).attr("data-li"); // 需要传给后台pinURL的参数  地铁线路
            let dataLineName = $(this).html();    // 获取中文地铁线路名称
            $(this).siblings().removeClass('areas-subway');
            $(this).addClass('areas-subway');
            subwayLine.forEach(function (item) {
                if ( dataLineId == item.id && item.subList){
                    let metroStation ="<li>不限</li>" ;
                   item.subList.forEach(function (item) { // 循环渲染地铁站点
                       metroStation += `<li data-id ="${item.id}" data-st="st-${item.id}">${item.name}</li>`
                   });
                    $('#metroStation').empty();
                    $('#metroStation').append(metroStation);
                }
            });
            $('#metroStation > li').click(function () {   // 站点的点击
                $(this).siblings().removeClass('chosed');
                $(this).addClass('chosed');
                let dataStationId = $(this).attr("data-id");      // 站点的id
                let dataStationSt =  $(this).attr("data-st");   // 需要传给后台pinURL的参数  站点
                let dataStationName = $(this).html();  // 获取中文地铁站点名称
                if ($(this).html() == "不限") {     // 判断赋值给检索title
                    $('#dic > p').html(dataLineName)
                } else {
                    $('#dic > p').html(dataStationName)
                }
                $('.bac').hide();
                $('#dic').children('span').removeClass('direction');
                $('#dic').find('i').addClass('bacchosed');
                $('#dic').addClass('active-color-top');
                $('.dic').slideToggle();
            })
        });


    }




}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});