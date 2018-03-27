/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：xf/list(新房-列表)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 class ListController extends Controller {
    constructor() {
        super();
        var self = this;        
        this.paramGenerator = new ParamGenerator();
        $('.total').slideUp(1000);// 隐藏查询总条数   
        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;
        require(['../components/filter.min', '../components/bigdata.min', "../components/conning-tower.min"], function(Filter, BigData){   
            BigData.init(self);         
            new ConningTower({                
                "bigDataUtil" : BigData ,               
                "moduleType" : "xf" ,
                "cityClick" : (data) => {
                } ,
                "searchResultItemClick" : (data) => {                    
                    // 与filter中的区域地铁互斥
                    delete self.param.di;// 区域id
                    delete self.param.to;// 板块id
                    delete self.param.li;// 地铁线id
                    delete self.param.st;// 地铁站id
                    delete self.param.id;// 小区id
                    delete self.param.sdi;// 区域id
                    delete self.param.sto;// 板块id
                    delete self.param.sli;// 地铁线id
                    delete self.param.sst;// 地铁站id
                    delete self.param.sid;// 小区id
                    var mapping = ["","sdi","sto","sli","sst","sid"];
                    var key = mapping[data.type];
                    if(key){
                        self.param[key] = data.value;
                        self.goto();
                    }
                }
            }) ;

            self.filter = new Filter($.extend({},Filter.XFDEFAULT,{
                el: ".filter",                
                cityId: 43,
                near: false,
                longitude: 222,
                latitude: 234,                
                controller: self,
                BigData: BigData,
                filterChanged: function(result){   
                    var param = self.paramGenerator.generateParamObj(result);
                    if(param.di || param.to || param.li || param.st){
                        // do nothing
                    }else{// 判断是否有sid,sli,sst,sdi,sto
                        var mapping = ["sdi","sto","sli","sst","sid"];
                        mapping.forEach(function(item){
                            if(self.param[item]){
                                param[item] = self.param[item];
                            }
                        });                        
                    }

                    self.param = param;
                    // 跳转
                    self.goto();
                }                
            }));   
            
            self.BigData = BigData;
            BigData.bigData({
                "pageName": "1050",                       
                "type": 1
            });
        });

        // 从url中解析参数
        var pageUrl = location.href;
        pageUrl = pageUrl.replace('//','');
        var tmpArr = pageUrl.split('/');
        self.param = {};
        if(tmpArr[3]){// 有查询条件
            var obj = ParamGenerator.queryString2Object(tmpArr[3]);
            if(obj){
                self.param = obj;
            }
        }
                    
        window.filter = self.filter;

        this.bindEvent();
        this.pullload();
        this.insertTrendAndOldHouse();
    }

    // 根据查询条件进行相应的跳转
    goto(){
        location.href = './' +  ParamGenerator.object2QueryString(this.param);                    
    }

    bindEvent(){
        var self = this;
        // 清空查询条件
        $('.no-data button').click(function(){
            // 跳转            
            location.href = "./";
        });
    }    

    createHouseItems(data){
        var str = "";
        var cityPinyin = $('#visitedCityPinyin').val();
        var channel = $('#channel').val();
        data.forEach(function(item){
            str += '<a class="xf-item" href="/'+cityPinyin+'/xf/'+item.encryptSubEstateId+'.html' +(channel? '?channel='+channel : "")+'" data-bigdata="'+encodeURIComponent('{"eventName": "1050025", "eventParam": {"new_house_id":"'+item.subEstateId+'"}}')+'">\
                <div class="img">\
                    <img src="'+item.imageUrl+'">\
                    <div class="yh">团购享 20万抵50万</div>\
                </div>\
                <div class="info">\
                    <h3>'+item.estateName+'</h3>\
                    <p class="district-town-area">\
                        <span>'+item.districtName+' '+item.townName+'</span><span>'+item.startSpace+'m²-'+item.endSpace+'m²</span>\
                    </p>\
                    <ul class="tags">'
                + (item.hasActivity && '<li class="yh">有优惠</li>' || "") + (item.isSubwayEstate&&'<li class="dt">近地铁</li>'||'') + (!item.isSoonOpen&&'<li>在售楼盘</li>'||'<li>即将开盘</li>') + (item.hasVideo&&'<li>有视频</li>'||'') +
                    '</ul>\
                    <p class="unit-price"><span>'+item.unitPrice+'</span> <span>元/m²</span></p>\
                </div>\
            </a>';
        });

        return str;
    }    

    createHouseList(data,count){// 生成房源列表
        this.hideNoData();
        if(data && data.length){
            $('.no-data').hide();
            var str = this.createHouseItems(data);

            $('#list').html(str);
            $('.total .count').text(count);
            $('.total').slideDown();
            setTimeout(function(){
                $('.total').slideUp();
            }, 1500);

            this.insertTrendAndOldHouse();
        }else{// 没数据
            this.showNoData();
        }
    }

    appendHouseList(data){// 上拉滚动时加载数据
        if(data&&data.length){
            var str = this.createHouseItems(data);
            $('#list').append(str);
            this.insertTrendAndOldHouse();
        }else{// 没有更多数据了
            //this.showNoMore();
        }
    }

    showNoData(){// 显示没有数据，并显示新房楼盘推荐
        $('.no-data').show();
        $('.total + div').html('');
        $('.recommendation').show();// TODO:显示推荐楼盘
    }

    hideNoData(){
        $('.no-data').hide();
    }

    hideNoMore(){
        $('.reach-bottom').hide();
    }

    insertTrendAndOldHouse(){// 场景连篇        
        var cityName = $('#visitedCityName').val();
        var $list = $('#list .xf-item');
        if($('#list .scene.house-price').length == 0 && $list.length>9){
            $('<a href="#" class="scene house-price">\
                <div class="img"></div>\
                <div class="info">\
                    <h3>'+cityName+'房价涨了还是跌了？</h3>\
                    <span class="detail">去看看</span>\
                </div>\
            </a>').insertAfter($($list[9]));
        }
        if($('#list .scene.house').length == 0 && $list.length>19){
            $('<a href="#" class="scene house">\
                <div class="img"></div>\
                <div class="info">\
                    <h3>火爆高性价比二手房</h3>\
                    <span class="detail">去看看</span>\
                </div>\
            </a>').insertAfter($list[19]);
        }
    }

    showError(){// 接口报错，分为两种，1. 筛选条件变更刷新 2. 上拉加载

    }

    // 金箍棒loading效果，现在第一屏用同步输出 ，已经用不到了，先保留，后续删掉
    // showLoading(){
    //     $('.page-loading').show();
    // }

    // hideLoading(){
    //     $('.page-loading').hide();
    // }

    // 上拉加载
    pullload(){
        let self = this ;
        var cityId = $.cookie("xfSelectedCityId");
        var cityPinyin = $.cookie("xfSelectedCityPinyin");
        var cityName = $.cookie("xfSelectedCityName");
        
        //二手房
        $("#list").pullload({
            apiUrl : self.apiUrl.xf.list ,
            queryStringObject : function(){
                self.param && delete self.param.pa;
                if(!self.param){
                    self.param = {};
                }
                return $.extend({},self.param,{cityId: $('#visitedCityId').val()});
            },   
            requestType: "POST",
            threshold : 50 ,
            pageSize: 10,   
            pageIndexKey: "of",
            pageSizeKey: "ps",    
            callback : function(data) {
                
                if( !data.data || !data.data.newHouseDataListModelList || !data.data.newHouseDataListModelList.length){
                    data.count = 1;
                    return;    
                } 

                self.appendHouseList(data.data.newHouseDataListModelList);                
            }
        }) ;
    }
}



/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});