/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：city/list(城市列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class cityListController extends Controller {
    constructor() {
        super();
        this.tableClick();
        this.choseCity();
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        根据定位是否成功显示或隐藏定位的信息
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if($.cookie('location_cityName')){
            $('.location').html( $.cookie('location_cityName'));
        }else {
            $('.location').html( "定位失败");
        }
        if ($.cookie('location_deniedName')){
            $('.location').html( $.cookie('location_deniedName'));
        }
        if ($.cookie('locationLatitude') && $.cookie('locationLongitude')){
                this.request(this.apiUrl.common.getCityByLatLon, { "latitude" : $.cookie('locationLatitude') , "longitude" : $.cookie('locationLongitude') } ,{
                    successCallback(data){
                        let city = data.data ;
                        $('.location').html( city.cityName);
                    }
                })
        }
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        动态渲染高度 和头部的置顶
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        if (!($('.table-name').length > 0)){
        $('.dic-name').css('position','static');
        $('.city-list').css('margin-top',0);
        }else {
            $('.city-list').css('margin-top',$('.dic-name').height());
        }
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   table点击事件
   -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    tableClick() {
      $(".table-name > ul >li ").click(function () {
          $(this).siblings().removeClass('table-active');
          $(this).addClass('table-active');
          let indexP = $(this).index();
          if  (indexP == 0){
              $('.domestic-list').show();
              $('.oversea-list').hide();
          }else if (indexP == 1){
              $('.domestic-list').hide();
              $('.oversea-list').show();
          }
      });
    };
     /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    选取城市并跳转
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    choseCity() {
        let pinyin ='';
        let cityId ='';
        let self = this;
        $('.inside-city-list >ul > li').click(function () {
            pinyin =  $(this).attr('data-pinyin');
            cityId =  $(this).attr('data-cityid');
            let cityName =  $(this).html();
            self.backOrigin(pinyin,cityId,cityName)
        });
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    返回最终的来源   @businessType : 业务类型，可以是old (二手房) | new (新房) | rent (租房) | xfPrice,newTrend (新房价格行情) | esfPrice ,esfTrend(新房价格行情)，只当前模块是哪个业务
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    backOrigin(pinyin,cityId,cityName) {
        if (pinyin && cityId){
            if (url('?businessType') == "old") {
                window.location.href = '/' + pinyin + "/esf"
            } else if (url('?businessType') == "new") {
                window.location.href = '/' + pinyin + "/xflist"
            } else if (url('?businessType') == "rent") {
                window.location.href = '/' + pinyin + "/rent/?channel="+url('?channel')
            } else if(url('?businessType') == "xfPrice") {
                window.location.href = "/xfPrice/price.html?regionId="+cityId+"&regionType=1"
            }else if(url('?businessType') == "esfPrice") {
                window.location.href = "/esfPrice/price.html?regionId="+cityId+"&regionType=1"
            } else if (url('?businessType') == "esfTrend"){
                window.location.href = "/"+pinyin+"/trend/esf"
            } else if (url('?businessType') == "newTrend"){
                window.location.href = "/"+pinyin+"/trend/new"
            }
            $.cookie('selectedCityPinyin',pinyin,{path: '/',});
            $.cookie('selectedCityId',cityId,{path: '/',});
            $.cookie('selectedCityName',cityName,{path: '/',});
        }
    }
}
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    类的初始化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function () {
    new cityListController;
});