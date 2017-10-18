/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：components -> bigdata(埋点)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
define(function(){
    //获取设备Id
    function getDeviceId(cb){
        //原生优先，然后取localStorage

        
        cb("2343434");
    }

    let ls = {};
    let getLocalStorage = function(){
        return window.localStorage || ls;
    };

    //从localStorage中读取未成功的大数据埋点
    let getBigData = function(){
        if(getLocalStorage().bigData){
            return JSON.parse(getLocalStorage().bigData);
        }else{
            return [];
        }
    };

    //设置未成功的大数据埋点到localStorage
    let setBigData = function(data){
        getLocalStorage().bigData = JSON.stringify(data);
    };

    let getTotal = function(){
        if(getLocalStorage().bigDataTotal){
            return parseInt(getLocalStorage().bigDataTotal);
        }else{
            return 1;
        }
    }

    let setTotal = function(total){
        getLocalStorage().bigDataTotal = total;
    }

    //插入一条埋点数据到localStorage
    let insertBigData = function(item){
        let items = getBigData()||[];
        items.push(item);
        setBigData(items);
    }

    //发送埋点请求
    let send = function(item){
        if(window.controller){
            let total = getTotal();	
            let controller = window.controller;	
            
            controller.request(controller.apiUrl.bigData,item,{
                successCallback: function(){

                }
            });            
        }
        
    };

    //从localStorage中读取一个bigData发送出去
    let traverse = function(){
        let items = getBigData();
        if(items && items.length > 0){
            let item = items.splice(0,1)[0];
            setBigData(items);
            send(item);
        }
    };

    function bigData(data){               
        getDeviceId(function(deviceId){
            data.cookieId = deviceId;
            let total = getTotal();
            data.pNum = total;
            setTotal(total+1);
            send(data);
        });        
    };

    //body上注册click事件，监听click事件
    window.document.body.addEventListener("click",function(event){
        //判断是否埋点元素
        let $target = $(event.target);
        let data = $target.data('bigdata');
        if(data){								
            data = JSON.parse(decodeURIComponent(data));
            data.type = 2;//事件埋点的类型是2,1是pv				
            bigData(data);
        }else{
            let $parents = $target.parents('[data-bigdata]');
            
            if($parents.length>0){					
                data = $parents.data('bigdata');
                data = JSON.parse(decodeURIComponent(data));
                data.type = 2;
                bigData(data);
            }
        }
    },true);

    return {
        bigData: bigData
    };
});
