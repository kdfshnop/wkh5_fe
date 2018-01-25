/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：space -> index(经纪人个人店铺首页)
 3. 作者：赵华刚@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class IndexController extends Controller {
    constructor() {
        super() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;          
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        底部经纪人助手条处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addListenerToAssistant() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给第一个tabs-handle选项添加on样式
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/         
        $(".wk-tabs .tabs-handle li").first().addClass("on") ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        载入组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/  
        require([ "../components/bigdata.min" , "../components/tabs.min" ] , (BigData) => { 
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            pv埋点
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            BigData.init(this) ;
            BigData.bigData({
                "pageName" : "1002" ,
                "pageParam" : {
                    "source" : "" ,
                    "agent_id" : $("#agentId").val()
                } ,
                "type" : 1
            }) ;
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
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    给dom节点绑定事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addEventListener() {
        let classSelf = this ;
        $(".highlight .more").click(function(){
            $(this).slideUp(200) ;
            $(this).siblings(".optional").fadeIn(200 , function(){
                classSelf.ellipsis() ;
            }) ;           
        }) ;
        $(".highlight .optional .switch").click(function(){
            $(this).siblings(".long-text").removeClass("limit") ;
            $(this).hide(200) ;
        }) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    判断自我介绍和成交故事是否需要展开
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    ellipsis() {       
        $(".highlight .optional .long-text").each(function(){             
            if($(this).height() <= 60 ) return ;           
            $(this).addClass("limit") ;             
            $(this).siblings(".switch").show(200) ;
        }) ;
    }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController ;
}) ;
