/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房数据决策
 2. 页面名称：Controller (每个页面的类都继承于这个控制器基类)
 3. 作者：zhaohuagang@lifang.com
 4. 备注：对api的依赖：jQuery
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class Controller {
    constructor() {        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        对环境的定义：
        @dev : 开发环境，对应静态资源域名为：dev01.fe.wkzf
        @test：测试环境，对应静态资源域名为：test.fe.wkzf
        @sim：sim环境，对应静态资源域名为：sim.fe.wkzf
        @prod ：生产环境，对应静态资源域名为：cdn.wkzf.com
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.environment = this.getEnv() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        一些关于cookie参数的配置
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.cookieDomain = (this.environment === "sim" || this.environment === "prod") ? ".wkzf.com" : ".wkzf.cn" ; //cookie域名设置
        this.cookieExpires = 60 ; //整个应用cookie的生存周期，单位为分钟
        this.cookieKeyPrefix = "M_" ; //cookie的key值前缀，用来区分哪个应用的cookie，比如M_表示M站，O_表示Offical website(官网)，JDY表示筋斗云管理系统
        this.cookieKeyConf = {} ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        根据环境决定static资源域名
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.staticDomain = "//dev01.fe.wkzf";
        if (this.environment === "test") this.staticDomain = "//test01.fe.wkzf" ;
        else if (this.environment === "sim") this.staticDomain = "//sim01.fe.wkzf" ;
        else if (this.environment === "prod") this.staticDomain = "//cdn01.wkzf.com" ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        工具库路径及应用的控制器路径
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        this.utilStaticPrefix = this.staticDomain + "/fe_public_library/wkzf/js/util" ;
        this.appStaticPrefix = this.staticDomain + "/wkh5_fe/js" ;  
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个应用Ajax请求的时候的数据类型统一为json
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiDataType = "json" ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        接口的地址，把整个应用的所有接口地址写在这里，方便统一维护    
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiPrefix = "/" ; //api请求接口前缀
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        系统各个模块API地址
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiUrl = {
            "common" : {
                "bigData" : this.apiPrefix + "api/common/bigData" ,
                "dial" : this.apiPrefix + "api/common/dial" ,
                "getCityByLatLon" : this.apiPrefix + "api/common/getCityByLatLon"
            } ,            
            "store" : {
                "agent" : this.apiPrefix + "api/store/index/agent" ,
                "house" : this.apiPrefix + "api/store/index/house"
            } ,
            "community" : {
                "chart" : this.apiPrefix + "api/community/detail/chart"
            },
            "rent" : {
                "list" : {
                    "cityAreas": this.apiPrefix + "api/rent/list/areas",
                    "citySubway" : this.apiPrefix + "api/rent/list/subway",
                    "acWord" : this.apiPrefix + "api/rent/list/acWord",
                    "rentHouseList" : this.apiPrefix +"api/rent/list/rentHouseList"
                }
            }
        } ;        
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    根据当前的访问域名返回系统环境
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/    
    getEnv() {
        let env = "dev" ;
        let domain = document.domain ;
        switch (domain) {
            case "m.test.wkzf" :
                env = "test" ;
                break ;
            case "m.sim.wkzf" :
                env = "sim" ;
                break ;
            case "m.wkzf.com" :
                env = "prod" ;
                break ;
            default :
                env = "dev" ;
                break ;
        }
        return env ;
    }

    getDomain() {
        return document.domain ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送Ajax请求的方法：
    @apiUrl：请求的url地址
    @data：请求附带发送的参数数据
    @params：{
        @type：请求的类型，可以是：GET|POST，但是如果apiDataType参数指为jsonp的话，这里设置为POST有没有任何意义，因为jsonp只能是GET
        @apiDataType：接口数据类型，可以是：json|jsonp|script等
        @showLoadingTips：加载过程中是否显示提示信息，可以为null，默认隐藏，如果要打开，请设置值为 true
        @loadingTips：加载过程中显示的提示信息内容，默认为："正在加载数据，请稍等..."
        @beforeSendCallback : 发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头，XMLHttpRequest 对象是唯一的参数
        @successCallback：code==1的时候的回调接口方法
        @errorCallback：发生错误的时候的回调接口方法
        @exceptionCallback : 当code !== 1的时候的回调方法
    }  
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    request( apiUrl , data , params ) {
        let classSelf = this ;
        let type = params.type || "GET" ;
        let contentType = params.contentType || "application/x-www-form-urlencoded" ;        
        let showLoadingTips = params.showLoadingTips || false ;
        let loadingTips = params.loadingTips || "正在加载数据，请稍等..." ;
        let apiDataType = params.apiDataType || this.apiDataType ;
        let errorCallback = params.errorCallback || $.noop ;
        let beforeSendCallback = params.beforeSendCallback || $.noop ;
        let successCallback = params.successCallback || $.noop ;
        let exceptionCallback = params.exceptionCallback || $.noop ;
        let isShowErrorTips = true;
        if(typeof params.isShowErrorTips != 'undefined'){
            isShowErrorTips = params.isShowErrorTips;
        } 

        if (this.showLoadingTips) $.tips(loadingTips) ;
        let options = {
            url : apiUrl ,
            type : type ,
            data : data ,
            dataType : apiDataType ,
            contentType : contentType ,
            beforeSend : beforeSendCallback ,            
            error : function(e) {
                isShowErrorTips && $.tips("调用数据接口失败！请测试您的数据接口！", 2) ;
                errorCallback(e) ;                
            },
            success : function(data) {                
                if (data.status.toString() === "1")  successCallback(data) ;
                else {
                    $.tips(data.message , 2) ;
                    exceptionCallback(data) ;
                }
            }
        } ;        
        try {
            $.ajax(options) ;
        } 
        catch (e) {
            isShowErrorTips && $.tips("错误名称：" + e.name + "\n错误描述：" + e.message, 3) ;
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个try-catch块结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    底部经纪人助手条处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addListenerToAssistant() {        
        if($(".assistant").length == 0) return ;
        $(".assistant .wx").click(function(){
            $.modal({
                "id" : "addWechatModal" ,
                "title" : "添加微信" ,
                "closeable" : true ,
                "content" : "<fieldset><legend>方法一</legend><p>将此页面截屏至您的相册<br>使用微信扫一扫添加</p><img src=\"" + $(this).data("agentwchartqrimgurl") + "\" style=\"width : 12rem ; height : 12rem ; \"></fieldset><fieldset><legend>方法二</legend><p>复制" + $(".assistant .portrait .name").text() + "的微信号添加<br>微信号：" + $(this).data("agentwchatid") + "</p></fieldset>" ,
                "buttons" : [
                    { "text" : "复制微信号" , "className" : "copy" , "clickCallback" : function() {
                        $(this).attr("data-clipboard-text" , $(".assistant .wx").data("agentwchatid")) ;
                        let clipboard = new Clipboard("#addWechatModal .copy") ; 
                        clipboard.on("success" , function(e) {                                 
                            $.tips("经纪人微信号已复制<br>请前往微信添加" , 3 ) ;
                        }) ;
                        clipboard.on( "error" , function(e) {
                            $.tips("复制微信号失败<br>请截屏后添加微信" , 3 ) ;
                        }) ;
                    }}
                ]
            }) ;
        }) ;
        $(".assistant .phone").click( () => {   
            this.request( this.apiUrl.common.dial , { agentId : $("#agentId").val() , houseId : $("#houseId").val() , serviceType : $("#serviceType").val() } , {
                successCallback : (result)=> {                    
                    $.modal({
                        "id" : "callAgentModal" ,
                        "title" : "<img src=\"" + $(".assistant .portrait .left img").attr("src") + "\">" ,
                        "content" : "<p><span class=\"name\">" + $(".assistant .portrait .right .name").html() + "</span> <span class=\"company\">" + $(".assistant .portrait .right .company-name").html() + "</span></p><p class=\"tel\">" + result.data.dial + " 转 " + result.data.digits + "</p><p class=\"memo\">为了保护您的隐私， 已为您隐藏手机号码您可安心拨打</p>" ,
                        "buttons" : [
                            { "text" : "取消"  , "clickCallback" : () => { $.modal.close("callAgentModal") ; } } ,
                            { "text" : "拨打" , "className" : "phone" ,"href" : "tel:" + result.data.dial + "," + result.data.digits }
                        ]
                    }) ;
                }
            } ) ; 
            
        }) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    下载引导条处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addListenerToDownloadApp() {        
        if($(".download-app").length == 0) return ;
        $(".download-app .download").click(function(){
            new WakeupApp({
                androidSchemes : "wkzf://external_call" ,
                isoSchemes : "wkzf://external_call" ,
                androidDownloadLink : "//m.wkzf.com/download/transit" ,
                iosDownloadLink : "//m.wkzf.com/download/transit"
            }) ;
        }) ;
        $(".download-app .icon-remove").click(function(){
            $(".download-app").animate({
                bottom : "-60px"
            } , 100) ;
            $(".assistant").animate({
                bottom : "0px"
            } , 100 ) ;
            $(".all-dis").css({ "padding-bottom" : "60px" }) ;
        }) ;
    }
    
}