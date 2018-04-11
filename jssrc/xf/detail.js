/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：xf/detail(新房-详情)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 class DetailController extends Controller {
    constructor() {
        super() ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;  
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        downloadApp条事件绑定
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addListenerToDownloadApp() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给页面元素绑定事件
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addEventListener() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        组件逻辑的引入
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/    
        let self = this ;
        require([ '../components/album.min','../components/bigdata.min', '../components/preview-image.min'],function(album, BigData, PreviewImage){        
            BigData.init(self) ;
            BigData.bigData({
                pageName: '1227',
                pageParam: {
                    new_house_id: $('#houseId').val()
                },
                channel:self.GetRequest()['channel'] || "",
                type: 1
            }) ;
            //评论中图片添加预览功能
            PreviewImage('.rent-comments');
        }); 
        
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    截取？后面的参数
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    GetRequest() {
        let url = location.search;
        let theRequest = {};
        if (url.indexOf("?") !== -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
            }
        }
        // console.log(theRequest);
        return theRequest;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    给页面元素绑定事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addEventListener() {
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        下载条的关闭按钮事件赋予
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".download-app .icon-remove").click(function(){
            $(".content-wrapper").css({ "padding-bottom" : 0 }) ;
            $(".consult-phone").animate({ "bottom" : 0 } , 100 ) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        点击优惠活动部分弹出活动弹层及弹层关闭按钮
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".content-wrapper .base-info .activity").click(()=> {
            $(".activity-pop").slideDown(100) ;
            $(document.body).css({ "overflow" : "hidden" }) ;
        }) ;
        $(".activity-pop .close span").click(() => {
            $(".activity-pop").slideUp(100) ;
            $(document.body).css({ "overflow" : "auto" }) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        点击电话咨询按钮，让页面跳转
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".consult-phone").click(function(){            
            window.location.href = $(this).attr("data-href") ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        打开app按钮点击处理
        schemes参数规则请参照：http://confluence.wkzf/pages/viewpage.action?pageId=80329073
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        $(".download-app .download").click(()=> {
            nativeSchema.loadSchema({               
                //schema : "external_call/parameter?t=0&bt=1&houseId=" + $("#houseId").val()  ,  // 通过NN打开某个链接
                schema : "external_call" ,  // 通过NN打开某个链接
                protocal : "wkzf" , //schema头协议，实际情况填写
                loadWaiting : "1500" , //发起唤醒请求后，会等待loadWaiting时间，超时则跳转到failUrl，默认3000ms                
                failUrl:"https://m.wkzf.com/download/transit?from=rentDetail" ,  //唤起失败时的跳转链接，默认跳转到下载页
                // apk信息,请根据实际情况填写
                apkInfo : {
                    PKG : "com.wukong.ua" ,
                    CATEGORY : "android.intent.category.DEFAULT" ,
                    ACTION : "android.intent.action.VIEW"
                }
            }) ;
        }) ;
        
    }
    
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
   new DetailController ;
}) ;
