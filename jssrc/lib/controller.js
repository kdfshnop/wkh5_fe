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
        根据环境决定后台资源域名
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.backendDomain = "/";
        if (this.environment === "test") this.staticDomain = "/" ;
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
            "bigData" : this.apiPrefix + "buriedPoint/sendData.rest"
        } ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个基类逻辑结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.onload() ;
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
        return document.domain;
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
    页面加载的时候执行的公共逻辑
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    onload() {
        
    }    
}
