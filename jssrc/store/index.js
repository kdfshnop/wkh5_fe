/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：store -> index(门店扫码)
 3. 作者：douyadong@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class IndexController extends Controller{
    constructor(){
        super() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;  
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给第一个tabs-handle选项添加on样式
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/         
        $(".wk-tabs .tabs-handle li").eq(0).addClass("on") ;
        let self = this;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        定位加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.getLocation((locationPo)=>{
           this.getHoustList({"latitude":locationPo.latitude,"longitude":locationPo.longitude});
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
             上拉加载实例化
             -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            this.pullload(locationPo.latitude,locationPo.longitude) ;
        });

        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        载入组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
        require([ "../components/bigdata.min"  ,"../components/tabs.min"] , (BigData)=>{
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            pv埋点
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            BigData.init(this) ;
            BigData.bigData({
                "pageName" : "1222" ,
                "pageParam" : {                    
                    "store_id" : $("#storeId").val()
                } ,
                "type" : 1
            }) ;
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            tabs实例化,onSwap的时候要将切换到的tab的拖动加载容器requestable设置为true，其他tab拖动加载容器设置为false
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $(".wk-tabs").tabs({
                "fixedWhenScroll" : false ,
                "effect" : "fadeIn" ,
                "duration" : 200 ,
                 "onSwap" : (index)=> {
                    $(".tabs-frame .list-container").attr( "data-requestable" , "false" ) ;
                    $(".tabs-frame").eq(index).find(".list-container").attr( "data-requestable" , "true" ) ;
                    $("html,body").animate({
                        scrollTop : "0px"
                    } , 100) ;
                }
            }) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给dom节点绑定事件
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addEventListener() ;
        $('#goEsf').click(function () {
            $.cookie('selectedCityPinyin',$("#cityPinYin").val(),{path: '/',});
            $.cookie('selectedCityId',$("#cityId").val(),{path: '/',});
            $.cookie('selectedCityName',$("#cityName").val(),{path: '/',});
            if ($(this).attr('data-href')){
                window.location.href= $(this).attr('data-href')
            }
        })
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    给dom节点绑定事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addEventListener() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        点返回按钮要返回M站首页
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $('.icon-back').on('click',function(){
            window.location.href = "/" ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面滚动的时候banner条的变动
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(window).on("scroll" , ()=> {
            let $header = $("header") ;
            let $storeName = $("header .banner .store-name") ;
            if ($(window).scrollTop() >= 20 ) {                
                if( ! $header.hasClass("fixed")) $header.addClass("fixed") ;
                $('.market').addClass('market-small');
                $(".tabs-frame").addClass("header-margin") ;           
                $storeName.hide() ;
            }
            else if ($(window).scrollTop() < 20) {
                if( $header.hasClass("fixed") ) $header.removeClass("fixed") ;
                $('.market').removeClass('market-small');
                $(".tabs-frame").removeClass("header-margin") ; 
                $storeName.show() ;
            }
        }) ; 
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        添加微信按钮事件绑定
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".tabs-frame.agent-items .wechat").click(function(){
            $.modal({
                "id" : "addWechatModal" ,
                "title" : "扫码加微信" ,
                "content" : "<img src=\"" + $(this).data("agentwchartqrimgurl") + "\" style=\"width : 12rem ; height : 12rem ; \"><p>微信号：" + $(this).data("agentwchatid") + "</p>" ,
                "buttons" : [
                    { "text" : "确定"  , "clickCallback" : function(){ $.modal.close("addWechatModal") ; } }               
                ]
            }) ;            
        }) ;       
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制单条房源dom节点的方法，请参照ejs模板内容
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    createEsf(esf) {
        let aNode = $(document.createElement("A")).attr( "href" , esf.url ).attr( "data-bigdata" , esf.bigDataParams).addClass("esf-item") ;
        let dlNode = $(document.createElement("DL")) ;
        dlNode.append( "<dt><img src=\"" + esf.houseImgUrl + "?x-oss-process=image/resize,w_150\" alt=\"" + esf.estateName + "\" class=\"lazy\"></dt>" ) ;
        dlNode.append( "<dd class=\"title\">" + esf.houseTitle + "</dd>" ) ;
        dlNode.append( "<dd>" + esf.houseChild +" " + esf.areaStr + " | " +  esf.district + " " + esf.town + "</dd>" ) ;              
        let tagNode = $(document.createElement("DD")).addClass("tags") ;
        esf.tagList && esf.tagList.forEach((tag) => {
            if(tag == "降价") {
                tagNode.append( `<div class="promotion"><span>${ tag }</span></div>`) ;
            }else if (tag == "新上"){
                tagNode.append( `<div class="new"><span>${ tag }</span></div>`) ;
            }else if(tag == "满二" || tag == "满五唯一"){
                tagNode.append( `<div class="over"><span>${ tag }</span></div>`) ;
            }else  {
                tagNode.append( `<div><span>${ tag }</span></div>`) ;
            }
        }) ;        
        dlNode.append(tagNode) ;
        dlNode.append( "<dd><span class=\"money\">" + esf.totalPrice+ "万</span> <span class=\"price\">" + esf.unitPrice + " 元/㎡</span></dd>" ) ;  
        aNode.append(dlNode) ;
        return aNode ;
    } ;    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    上拉加载实例化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullload(latitude,longitude) {
        let self = this ;
        //二手房
        $(".tabs-frame.esf-items .list-container").pullload({
            apiUrl : this.apiUrl.store.house ,
            queryStringObject : { "storeId" : $("#storeId").val() , lon :longitude, lat :latitude} ,
            threshold : 50 ,       
            callback : function(data) {
                if( ! data.data) return ;          
                $.each(data.data , (index , esf)=> {
                    esf.url = "/"+$("#cityPinYin").val()+"/esf/" + esf.encryptHouseId + ".html?storeId="+$("#storeId").val() ;
                    $(".tabs-frame.esf-items .list-container").append(self.createEsf(esf)) ;
                }) ;
            }
        }) ;
       
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   请求房源数据
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    getHoustList(position){
        let self = this;
        this.request(this.apiUrl.store.house,{ "storeId" : $("#storeId").val() , "pageIndex" : 0 , 'pageSize' : 20 ,lon:position.longitude,lat:position.latitude},{
            successCallback(result){
                if (result.data && result.data.length >0){
                    result.data.forEach((item,index)=>{
                        item.bigDataParams = encodeURIComponent(JSON.stringify( { "eventName" : 1222001 , "eventParam" : { "store_id" : $("#storeId").val() , "house_id" : item.houseId } } )) ;
                        item.url = "/" + $("#cityPinYin").val() + "/esf/" + item.encryptHouseId + ".html?storeId="+$("#storeId").val() ;
                        $(".tabs-frame.esf-items .list-container").append(self.createEsf(item)) ;
                    })
                }else {
                    $('.nodata-store').show()
                }
            }
        });
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   定位服务
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    getLocation(callBack){
        if( ! navigator.geolocation ) {
            $.tips( "您的浏览器不支持定位地理位置" , 3 ) ;
            callBack({"latitude":null,"longitude":null});
            return ;
        }
        let self = this;
        let geoOpts = {
            enableHighAccuracy : false ,
            maximumAge : 0 ,
            timeout : 10 * 1000
        } ;
        navigator.geolocation.getCurrentPosition( (position) => {
            let  locationPo = {};
            locationPo.latitude = position.coords.latitude;
            locationPo.longitude = position.coords.longitude;
            console.log('进入定位');
            console.log(locationPo);
            callBack(locationPo)
        }, ( error ) => {
            callBack({"latitude":null,"longitude":null});
            switch(error.code) {
                case error.PERMISSION_DENIED :  // 用户阻止了授权
                    console.log("用户阻止了授权");
                    break ;
                case error.POSITION_UNAVAILABLE :  //定位信息无效
                    console.log("定位信息无效");
                    break ;

                case error.TIMEOUT :  //定位超时
                    console.log("定位超时");
                    break ;

                case error.UNKNOWN_ERROR :  //其他不可预知的错误
                    console.log("其他不可预知的错误");
                    break ;
            }
        } , geoOpts );
    }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController ;
}) ;