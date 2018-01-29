/*++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1. 项目名称：悟空找房h5
2. 文件名：libs -> location.js
3. 作者：zhaohuagang@lifang.com
4. 备注：H5地理定位封装
            使用cookie来进行定位数据的缓存，主要是为了和老站对接，cookie里面暂时只存了经纬度，如果需要更多，在代码里面添加，可以有：
            coords.latitude 	十进制数的纬度
            coords.longitude 	十进制数的经度
            coords.accuracy 	位置精度
            coords.altitude 	海拔，海平面以上以米计
            coords.altitudeAccuracy 	位置的海拔精度
            coords.heading 	方向，从正北开始以度计
            coords.speed 	速度，以米/每秒计
            timestamp 	响应的日期/时间

            @businessType : 业务类型，可以是old (二手房) | new (新房) | rent (租房) | xfPrice (新房价格行情) | esfPrice (新房价格行情)，只当前模块是哪个业务
            @cityApiUrl : 通过经纬度反查城市接口地址
            @identical : 如果反查到的城市和cookie中的城市是一致的情况下的回调，如果不一致就组织新路由跳转，所以不需要回调处理
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
class Location {
    constructor({ businessType , cityApiUrl , identical }) {
        this.businessType = businessType || "old" ;
        this.cityApiUrl = cityApiUrl || "" ;
        this.cookieKeyPrefix = "location_" ;  //cookie里面位置信息缓存的前缀
        this.identical = identical || $.noop ;  //拿到位置信息后的回调函数
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        onPageShow的时候去检查用户点击了城市选择页面但是没有选择任何城市
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        window.onpageshow = () => {
            if( $.cookie("citySelectionOpen") && ! $.cookie("userSelectedCity")) {
                window.location.href = this.route( "shanghai" , 43 ) ;
                $.cookie( this.cookieKeyPrefix + "noChose" , 1 , { path : "/" } ) ; // 用户首次拒绝定位跳到城市列表页但没有选择城市返回之后 设置标识防止再次决绝定位时跳入城市选择页
            }
        };
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        对浏览器是否支持cookie做一个判断并给出提示信息
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if( ! navigator.cookieEnabled ) {
            $.tips("您的浏览器不支持cookie ! " , 3 ) ;
            this.orientate() ;
        } 
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        根据$.cookie("userSelectedCity")的值是否有来决定是否需要地理定位 ;
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        else {
            if( ! $.cookie("userSelectedCity")) this.orientate() ;
        }
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    发起定位，并根据浏览器是否支持cookie决定是否要将位置信息存储到缓存
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    orientate() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        判断浏览器是否支持H5的geolocation
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if( ! navigator.geolocation ) {
            $.tips( "您的浏览器不支持定位地理位置" , 3 ) ;            
            return ;
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        定义定位选项
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        let geoOpts = {
            enableHighAccuracy : false ,   //表示是否高精度可用，为Boolean类型，默认为false，如果开启，响应时间会变慢，同时，在手机设备上会用掉更多的流量，也就是money了。
            maximumAge : 0 , //表示应用程序的缓存时间。单位毫秒，默认是0，意味着每次请求都是立即去获取一个全新的对象内容。
            timeout : 10 * 1000  //表示等待响应的最大时间，默认是0毫秒，表示无穷时间。
        } ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        开始发起定位
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        navigator.geolocation.getCurrentPosition( (position) => {
            let latitude = position.coords.latitude ;
            let longitude = position.coords.longitude ;            
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            往cookie里面写经纬度
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $.cookie(this.cookieKeyPrefix + "latitude" , latitude , { path : "/" } ) ;
            $.cookie(this.cookieKeyPrefix + "longitude" , longitude , { path : "/" } ) ;              
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            根据经纬度反查城市信息
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            $.ajax({
                url : this.cityApiUrl ,
                type : "GET" ,
                data : { "latitude" : latitude , "longitude" : longitude } ,
                dataType : "json" ,                                 
                error : (e) => {
                    $.tips( "通过经纬度反查城市接口错误！" , 3 ) ;
                } ,
                success : (result) => {
                    let city = result.data ;                                        
                    if (result.status.toString() === "1") {
                        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        写几个cookie的值
                        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/                        
                        $.cookie( this.cookieKeyPrefix + "cityName" , city.cityName , { path : "/" } ) ;
                        $.cookie( this.cookieKeyPrefix + "cityPinyin" , city.cityPinyin , { path : "/" } ) ;
                        $.cookie( this.cookieKeyPrefix + "cityId" , city.cityId , { path : "/" } ) ;
                         /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        用拿到的cityId和cookie里面的值做对比
                        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/                  
                        if(city.cityId == $.cookie("cityId")) {                            
                            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            如果相同，在下面的identical回调里面
                            1. 页面同步的话什么也不要坐
                            2. 页面异步的话就调数据接口渲染页面
                            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/                            
                            this.identical({ "latitude" : latitude , "longitude" : longitude }) ;
                        }
                        else {                            
                            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            如果不同，就组织新的路由跳转
                            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
                            let newCityId = city[this.businessType + "Business"] ? city.cityId : 43 ;
                            let newPinyin = city[this.businessType + "Business"] ? city.cityPinyin : "shanghai" ;                            
                            window.location.href = this.route( newPinyin , newCityId ) ;
                        }
                        
                    }
                    else {
                        $.tips( data.message , 3 ) ;
                        window.location.href = this.route( "shanghai" , 43 ) ;
                    }
                }
            }) ;             
        } , ( error ) => {
            switch(error.code) {
                case error.PERMISSION_DENIED :  //用户阻止了授权
                this.fail() ;
                break ;

                case error.POSITION_UNAVAILABLE :  //定位信息无效
                this.timeout() ;
                break ;

                case error.TIMEOUT :  //定位超时
                this.timeout() ;
                break ;

                case error.UNKNOWN_ERROR :  //其他不可预知的错误
                this.timeout() ;
                break ;
            }
        } , geoOpts ) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    定位超时处理
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    timeout() {
        $.modal({
            "id" : "orientateTimeoutDialog" ,
            "title" : "" ,      
            "content" : "定位失败<br>请手动选择您的城市" ,
            "buttons" : [
                { "text" : "去选择" , "className" : "goto-select-city" , "clickCallback" : () => {
                    $.cookie( "citySelectionOpen" , 1  , { path : "/" } ) ;  //标识打开过城市选择页面
                    window.location.href = "/public/city/select?businessType=" + this.businessType ;
                } } 
            ]
        }) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    定位失败处理：直接跳城市选择页面    
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    fail() {
        if(!$.cookie( this.cookieKeyPrefix + "noChose" )) {
            $.cookie( "citySelectionOpen" , 1 , { path : "/" } ) ;  //标识打开过城市选择页面
            window.location.href = "/public/city/select?businessType=" + this.businessType ;
        }
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    根据cityPinyin和cityId来组织列表页路由
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    route( newPinyin , newCityId ) {
        if( this.businessType === "esfPrice" ) return "/esfPrice/price.html?regionId=" + newCityId + "&regionType=1" ;
        if( this.businessType === "xfPrice" ) return "/xfPrice/price.html?regionId=" + newCityId + "&regionType=1" ;
        let moduleName = "esf" ;
        if( this.businessType === "new" ) moduleName = "xflist" ;
        else if( this.businessType === "rent" ) moduleName = "rent/?channel=jrttsub" ;
        return "/" + newPinyin + "/" +moduleName ;
    }
    

}