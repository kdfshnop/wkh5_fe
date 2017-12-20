/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：store -> index(门店扫码)
 3. 作者：douyadong@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class IndexController extends Controller{
    constructor(){
        super() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给第一个tabs-handle选项添加on样式
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/         
        $(".wk-tabs .tabs-handle li").first().addClass("on") ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        载入组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
        require([ "../components/bigdata.min"  ,"../components/tabs.min"] , (BigData)=>{
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            tabs实例化
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $(".wk-tabs").tabs({
                "fixedWhenScroll" : false ,
                "effect" : "fadeIn" ,
                "duration" : 200
            }) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给dom节点绑定事件
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addEventListener() ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    给dom节点绑定事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addEventListener() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        页面滚动的时候banner条的变动
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(window).on("scroll" , ()=> {
            let $header = $("header") ;
            let $storeName = $("header .banner .store-name") ;
            if ($(window).scrollTop() >= 20 ) {                
                if( ! $header.hasClass("fixed")) $header.addClass("fixed") ;
                $(".tabs-frame").addClass("header-margin") ;           
                $storeName.hide() ;
            }
            else if ($(window).scrollTop() < 20) {
                if( $header.hasClass("fixed") ) $header.removeClass("fixed") ;
                $(".tabs-frame").removeClass("header-margin") ; 
                $storeName.show() ;
            }
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
        dlNode.append( "<dd><span class=\"layout\">" + esf.houseChild +" " + esf.areaStr + "</span><span class=\"money\">" + esf.totalPrice + " 万</span></dd>" ) ;
        dlNode.append( "<dd><span class=\"location\">" +  esf.district + " " + esf.town + "</span><span class=\"price\">" + esf.unitPrice  +" 元/㎡</span></dd>" ) ;
        let tagNode = $(document.createElement("DD")) ;
        if(esf.isTopHouse >1) tagNode.append( "<span class=\"selected\">精选</span>" ) ;
        else if(esf.isStorePush === 1) tagNode.append( "<span>店长推荐</span>" ) ;
        else if(esf.commAgent > 0) tagNode.append( "<span>急售</span>" ) ;
        if(esf.fullYears >= 5 && esf.onlyOne == 1)  tagNode.append( "<span>满五唯一</span>" ) ;
        if(esf.fullYears >= 2) tagNode.append( "<span>满二</span>" ) ;
        if(esf.isSubwayHouse === 1)  tagNode.append( "<span>地铁</span>" ) ;
        if(esf.isSchoolHouse === 1) tagNode.append( "<span>近学校</span>" ) ;
        if(esf.isNewOnStore === 1) tagNode.append( "<span>新上</span>" ) ;
        if(esf.orientation === 9) tagNode.append( "<span>南北通透</span>" ) ;
        dlNode.append(tagNode) ;
        aNode.append(dlNode) ;
        return aNode ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    绘制单条经纪人dom节点的方法，请参照ejs模板内容
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    createAgent(agent) {
        let dlNode = $(document.createElement("DL")).addClass("agent") ;
        let telNode = $(document.createElement("DD")).addClass("tel").append("<span><i class=\"iconfont icon-tel\"></i></span><span class=\"memo\">电话咨询</span>") ;
        let wechatNode = $(document.createElement("DD")).addClass("wechat").append("<span><i class=\"iconfont icon-wechat\"></i></span><span class=\"memo\">添加微信</span>") ;
        let dtNode = $(document.createElement("DT")).append("<a href=\"#\"><img src=\"" + agent.agentHeadImgUrl + "?x-oss-process=image/resize,w_120\" class=\"lazy\"><div class=\"summary\"><p class=\"name\">" + agent.agentName + "</p><p class=\"seniority\">加入悟空：" + agent.serviceYears + "</p></div></a>") ;
        dlNode.append(telNode).append(wechatNode).append(dtNode) ;
        return dlNode ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    上拉加载实例化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullload() {
        //二手房
        $(".tabs-frame.esf-items").pullload({
            apiUrl : this.apiUrl.store.house ,                
            callback : function(data) {                    
                $.each(data.data , function(){
                       
                }) ;
             }
        }) ;
        //经纪人
        $(".tabs-frame.agent-items").pullload({
            apiUrl : this.apiUrl.store.agent ,                
            callback : function(data) {                    
                $.each(data.data , function(){
                       
                }) ;
             }
        }) ;
    } ;
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController ;
}) ;