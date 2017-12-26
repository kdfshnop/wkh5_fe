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
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 条件选择的初始化函数
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    readyFun(){
        $('.dic').hide();
        $('.bac').hide();
        $('.price-total').hide();
        $('.house-type').hide();
        $('.more').hide();
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 条件选择的区域选择的点击效果函数
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     choseFun(){
        /* 区域选择点击事件*/
         $('.rent-list > ul > li').click(function () {
             $(this).siblings().removeClass('active-color-top');  /* 点击li标签改变其样式*/
             $(this).toggleClass('active-color-top');
             $(this).siblings().children('span').removeClass('direction');  /*点击li标签事件改变子标签span箭头的样式（后面会选中条件查询之后恢复样式）*/
             $(this).children('span').toggleClass('direction');
             let list = $('.rent-list > ul > li > span');   /*根据span标签的样式判断底部罩层是否显示*/
             $('.bac').hide();
             list.each(function (index, item) {
                 if (item.classList.length == 1){
                     $('.bac').show();
                 }
             });
             let indexP = $(this).index();  /*根据点击li标签的位置判断相应的模块响应出现*/
             if (indexP == 0){     /*判断区域模块的显示*/
                 $('.dic').stop();
                 $('.price-total').hide();
                 $('.house-type').hide();
                 $('.more').hide();
                 $('.dic').slideToggle();

             }else if (indexP == 1){      /*判断价格模块的显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.house-type').hide();
                 $('.more').hide();
                 $('.price-total').slideToggle();
             }else if (indexP == 2){    /* 判断户型模块显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.price-total').hide();
                 $('.more').hide();
                 $('.house-type').slideToggle();
             }else if (indexP == 3){    /* 判断更多模块显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.price-total').hide();
                 $('.house-type').slideUp();
                 $('.more').slideToggle();
             }
         });
         /*区域与地铁选择点击事件*/
         $('.tabs > ul > li').click(function () {
            $(this).siblings().children('span').removeClass('active-color-dic');
             $(this).children('span').addClass('active-color-dic');
             let indexP = $(this).index();
             if (indexP == 0){      /*判断区域模块显示或隐藏*/
                 $('.metro-content').slideUp();
                 $('.dic-content').slideDown();
             }else if(indexP == 1){   /*判断地铁模块显示或隐藏*/
                 $('.dic-content').slideUp();
                 $('.metro-content').slideDown();
             }
         });
         $('.house-list > ul > li').click(function () {
             let  indexP = $(this).index();
             if (indexP == 0){
                 $(this).siblings().removeClass('active-house');
                 $(this).toggleClass('active-house');
             }else {
                 $('.house-list > ul > li:eq(0)').removeClass('active-house');
                 $(this).toggleClass('active-house');
             }
         })
     }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});