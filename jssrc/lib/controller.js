/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房数据决策
 2. 页面名称：Controller (每个页面的类都继承于这个控制器基类)
 3. 作者：yinqin@lifang.com
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
        this.environment = "dev";
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        一些关于cookie参数的配置
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.cookieDomain = (this.environment === "sim" || this.environment === "prod") ? ".wkzf.com" : ".wkzf.cn"; //cookie域名设置
        this.cookieExpires = 60; //整个应用cookie的生存周期，单位为分钟
        this.cookieKeyPrefix = "M_"; //cookie的key值前缀，用来区分哪个应用的cookie，比如M_表示M站，O_表示Offical website(官网)，JDY表示筋斗云管理系统
        this.cookieKeyConf = {

        };
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        根据环境决定static资源域名
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.staticDomain = "//dev01.fe.wkzf";
        if (this.environment === "test") this.staticDomain = "//test01.fe.wkzf";
        else if (this.environment === "sim") this.staticDomain = "//sim01.fe.wkzf";
        else if (this.environment === "prod") this.staticDomain = "//cdn01.wkzf.com";
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        工具库路径及应用的控制器路径
         -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        this.utilStaticPrefix = this.staticDomain + "/fe_public_library/wkzf/js/util";
        this.appStaticPrefix = this.staticDomain + "/wkh5_fe/js";       
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个应用Ajax请求的时候的数据类型统一为json
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiDataType = "jsonp";
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        接口的地址，把整个应用的所有接口地址写在这里，方便统一维护    
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiPrefix = '/'; //api请求接口前缀
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        后端接口的地址，把整个应用的所有接口地址写在这里，方便统一维护    
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.backendApiPrefix = 'http://10.0.18.204:9019'; //api请求接口前缀
        if (this.environment === "prod") this.backendApiPrefix = 'http://m.wkzf.com/2018/';
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        系统各个模块API地址
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.apiUrl = {
            
        };        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个基类逻辑结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.onload();
    };    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发送Ajax请求的方法：
    @apiUrl：请求的url地址
    @data：请求附带发送的参数数据
    @params：{
        @type：请求的类型，可以是：GET|POST，但是如果apiDataType参数指为jsonp的话，这里设置为POST有没有任何意义，因为jsonp只能是GET
        @apiDataType：接口数据类型，可以是：json|jsonp|script等
        @showLoadingTips：加载过程中是否显示提示信息，可以为null，默认显示，如果要关闭，请设置值为 false
        @loadingTips：加载过程中显示的提示信息内容，默认为："正在加载数据，请稍等..."
        @process：code==200的时候的回调接口方法
        @onExceptionInterface：发生错误的时候的回调接口方法
    }  
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    request(apiUrl, data, params) {
        let classSelf = this;
        let type = (params === null || params.type === null || params.type === undefined) ? "GET" : params.type;
        let contentType = (params === null || params.contentType === null || params.contentType === undefined) ? "application/x-www-form-urlencoded" : params.contentType;

        let process = (params === null || params.process === null || params.process === undefined) ? null : params.process;
        let showLoadingTips = (params === null || params.showLoadingTips === null || params.showLoadingTips === undefined) ? true : params.showLoadingTips;
        let loadingTips = (params === null || params.loadingTips === null || params.loadingTips === undefined) ? "正在加载数据，请稍等..." : params.loadingTips;
        let apiDataType = (params === null || params.apiDataType === null || params.apiDataType === undefined) ? this.apiDataType : params.apiDataType;
        let onExceptionInterface = (params === null || params.onExceptionInterface === null || params.onExceptionInterface === undefined) ? null : params.onExceptionInterface;
        let onErrorInterface = (params === null || params.onErrorInterface === null || params.onErrorInterface === undefined) ? null : params.onErrorInterface;
        if (this.showLoadingTips) this.tips(loadingTips);
        let options = {
            url: apiUrl,
            type: type,
            data: data,
            dataType: apiDataType,
            contentType: contentType,
            beforeSend: params.beforeSend,
            complete: params.complete,
            error: function(e) {
                classSelf.tips("调用数据接口失败！请测试您的数据接口！", 3);
                if (onErrorInterface) {
                    onErrorInterface(e);
                }
            },
            success: function(data) {
                $("#" + classSelf.tipsDialogId).modal("hide");
                if (data.status.toString() === "1") {
                    if (Object.prototype.toString.call(data.data) === "[object String]") {
                        //这里是字符串,为了判断架构组的页面超时问题
                        if (data.data) {
                            let resultData = JSON.parse(data.data);
                            if ("messageNo" in resultData && resultData.messageNo == "1502") {
                                parent.window.location.reload();
                            } else {
                                if (process) process(data); //没有问题，就处理数据
                            }
                        } else {
                            if (process) process(data); //没有问题，就处理数据
                        }
                    } else {
                        if (process) process(data); //一切没有问题，就处理数据
                    }
                } else {
                    if (onExceptionInterface) {
                        onExceptionInterface(data.status, data.message);
                    } else {
                        classSelf.tips(data.message, 3);
                    }
                }
            }
        };
        if (apiDataType === "jsonp")
            options.jsonpCallback = "callback" + new Date().getTime(); //这个地方必须随机，否则重复执行这个请求会报这个参数值不是个方法
        try {
            $.ajax(options);
        } catch (e) {
            classSelf.tips("错误名称：" + e.name + "\n错误描述：" + e.message, 3);
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        整个try-catch块结束
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    };
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    图片延迟加载
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    lazyload() {
        require([this.utilStaticPrefix + "/jquery.lazyload.min.js"], function() {
            $(".lazy").lazyload();
        });
    };    
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    页面加载的时候执行的公共逻辑
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    onload() {
        console.log($);
    }
}
