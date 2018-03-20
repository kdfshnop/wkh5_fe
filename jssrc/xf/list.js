/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：xf/list(新房-列表)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
 class ListController extends Controller {
    constructor() {
        super();
        var self = this;
        this.total = 0;//总数
        this.count = 0;//当前数量
        this.pageSize = 10;//
        this.paramGenerator = new ParamGenerator();
        $('.total').slideUp(1000);
        require(['../components/filter.min', '../components/bigdata.min'], function(Filter, BigData){   
            BigData.init(self);         
            self.filter = new Filter($.extend({},Filter.XFDEFAULT,{
                el: ".filter",                
                cityId: 43,
                near: false,
                longitude: 222,
                latitude: 234,                
                controller: self,
                BigData: BigData,
                filterChanged: function(result){ 
                    // 获得最新查询条件TODO: 还要集成搜索组件                                     
                    var param = self.paramGenerator.generateParamObj(result);

                    // 跳转
                    location.href = './' +  ParamGenerator.object2QueryString(param);                    
                }                
            }));                     
        });

        this.bindEvent();
        this.pullload();
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
        data.forEach(function(item){
            str += '<a class="xf-item" href="/shanghai/rent/b5463d25fbc09ea7.html?channel=undefined">\
                <div class="img">\
                    <img src="'+item.imageUrl+'">\
                    <div class="yh">团购享 20万抵50万</div>\
                </div>\
                <div class="info">\
                    <h3>'+item.estateName+'</h3>\
                    <p class="district-town-area">\
                        <span>'+item.districtName+' '+item.townName+'</span><span>'+item.startSpace+'m-'+item.endSpace+'m</span>\
                    </p>\
                    <ul class="tags">\
                        <li class="yh">有优惠</li><li class="dt">近地铁</li><li class="">在售楼盘</li><li class="">即将开盘</li><li class="">即将开盘</li>\
                    </ul>\
                    <p class="unit-price"><span>'+item.unitPrice+'</span> <span>元/m</span></p>\
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

            $('.list').html(str);
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
            $('.list').append(str);
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

    // showNoMore(){// 显示没有更多
    //     $('.reach-bottom').show();
    // }

    hideNoMore(){
        $('.reach-bottom').hide();
    }

    insertTrendAndOldHouse(){// 插入跳转到价格行情和二手房的链接        
        var cityName = "上海";
        var $list = $('.list .xf-item:not(.house):not(.house-price)');
        if($('.list .house-price').length == 0 && $list.length>9){
            $('<a href="#" class="xf-item house-price">\
                <div class="img"></div>\
                <div class="info">\
                    <h3>'+cityName+'房价涨了还是跌了？</h3>\
                    <span class="detail">去看看</span>\
                </div>\
            </a>').insertAfter($($list[9]));
        }
        if($('.list .house').length == 0 && $list.length>19){
            $('<a href="#" class="xf-item house">\
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

        //二手房
        $(".list").pullload({
            apiUrl : self.apiUrl.xf.list ,
            queryStringObject : function(){
                self.param && delete self.param.pa;
                if(!self.param){
                    self.param = {};
                }
                return self.param;
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