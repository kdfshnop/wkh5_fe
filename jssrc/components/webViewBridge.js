/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：App内嵌h5
 2. 页面名称：common->webViewJavascriptBridge.js(js与native 交互的js)
 3. 作者：yuxiaochen@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
define(function() {

    /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     定义native 交互交互对象
     --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    var webViewJavascriptBridge = {
        init: function(params) {
            connectWebViewJavascriptBridge(function(bridge) {
                try {
                    //定义默认的native message hanlder

                    //由于ios没有注册初始message handler 所以此处无法init 
                    // bridge.init(function(message, responseCallback, errorResponseCallback) {
                    //     console.log("native data: " + message);
                    // });

                    //定义 js handlers
                    if (params.handlers) {
                        if (isArray(params.handlers)) {
                            for (var i = 0; i < params.handlers.length; i++) {
                                var tmpHandler = params.handlers[i];
                                bridge.registerHandler(tmpHandler.name, function(data, responseCallback, errorResponseCallback) {
                                    if (tmpHandler.responseCallback) {
                                        tmpHandler.responseCallback(data);
                                    }

                                    if (tmpHandler.errorResponseCallback) {
                                        tmpHandler.errorResponseCallback(data);
                                    }
                                });
                            }
                        } else {
                            bridge.registerHandler(params.handlers.name, function(data, responseCallback, errorResponseCallback) {
                                if (params.handlers.responseCallback) {
                                    params.handlers.responseCallback(data);
                                }

                                if (params.handlers.errorResponseCallback) {
                                    params.handlers.errorResponseCallback(data);
                                }
                            });
                        }
                    }
                } catch (exception) {
                    alert(exception.message);
                }
            });

        },
        exec: function(params) {
            try {

                //判断必传参数定义是否合法          
                if (!params.service || !params.action) {
                    throw new Error("service or action invalid.");

                }

                //定义参数
                var service = params.service;
                var action = params.action;
                var requestData = params.data == undefined ? {} : params.data;
                var responseCallback = params.responseCallback;
                var errorResponseCallback = params.errorResponseCallback;

                //调用native 方法
                WebViewJavascriptBridge.exec(service, action, requestData, responseCallback, errorResponseCallback);


            } catch (exception) {

                if (typeof console != 'undefined') {

                    console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", exception.message, exception);
                     throw exception;

                }

            }

        },
        connectWebViewJavascriptBridge: connectWebViewJavascriptBridge
    };

    /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     判断是否是一个数组，使用下面的方法也是完全可行的
     --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
        //return (typeof o == 'object' && o.constructor == Array) ;
    }

    /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     创建connectWebViewJavascriptBridge 方法
     --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady',
                function() {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
    }

    return webViewJavascriptBridge;
})
