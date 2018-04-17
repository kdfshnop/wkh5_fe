/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：xf/ads(新房-广告)
 3. 作者：zhaohuagang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 class XfAds  {
    constructor() {        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        定义常量
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.consts = {
            "$adsContainer" : $(".xf-ads") ,
            "$xfItemsContainer" : $(".container") ,
            "$conningTower" : $(".conning-tower") ,
            "duration" : 100
        } ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        实例化swiper
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require(["../components/swiper-3.4.2.jquery.min"] , () => {            
            let pictAds = new Swiper( ".pict-ads" , {
                autoplay : 4000 ,
                pagination : ".swiper-pagination" ,
                paginationClickable : true
            }) ;
            let textAds = new Swiper( ".text-ads .items" , {
                autoplay : 3000 ,
                direction : "vertical"
            }) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        添加事件监听
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
        this.addListener() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面加载的时候就触发一下window的scroll来根据滚动条来判断广告是否显示
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(window).trigger("scroll") ;
    }  
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    添加事件监听
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addListener() {
        $(window).on("scroll" , () => {
            let st = $(window).scrollTop() ;
            if( st <= 50 && ! this.consts.$adsContainer.is(":visible")) {
                this.consts.$adsContainer.slideDown(this.consts.duration) ;
                this.consts.$conningTower.css({ "padding-bottom" : "10px" }) ;
                this.consts.$xfItemsContainer.animate( { paddingTop : "313px" } , this.consts.duration ) ;
            }
            else if(st > 50 && this.consts.$adsContainer.is(":visible")) {
                this.consts.$adsContainer.slideUp(this.consts.duration) ;
                this.consts.$conningTower.css({ "padding-bottom" : 0 }) ;
                this.consts.$xfItemsContainer.animate( { paddingTop : ( 97 + st ) +"px" } , this.consts.duration ) ;
            }
        }) ;
    }
    
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
   new XfAds ;
}) ;
