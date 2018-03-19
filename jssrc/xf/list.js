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
        $('.total').slideUp();
        require(['../components/filter.min'], function(Filter){            
            self.filter = new Filter({
                el: ".filter",
                houseType: 1,
                cityId: 43,
                near: false,
                longitude: 222,
                latitude: 234,
                distances: [{value: "5000", text: "不限（智能范围）"},{value: "500", text: "500米"},{value: "1000", text: "1000米"},{value: "2000", text: "2000米"},{value: "5000", text: "5000米"}],
                controller: self,
                filterChanged: function(result){ 
                    this.total = 0;
                    this.count = 0;                    
                    console.log("筛选条件变了：", result);                                      
                    var param = self.paramGenerator.generateParamObj(result);
                    //param.pa = 1;
                    self.param = param;
                    self.hideNoData();
                    self.hideNoMore();                    
                    self.fetchData(param,function(data){
                        data = data.data;
                        $('.list').empty();
                        if(data.total!=0 && data.total<=self.pageSize){// 没有更多了
                            self.showNoMore();
                        }else if(data.newHouseDataListModelList.length == 0){
                            self.showNoData();
                        }else{
                            self.createHouseList(data.newHouseDataListModelList,data.total); 
                            console.log("有数据,enable...");
                            $('.list').trigger('enable');
                        }
                         
                        var qs = ParamGenerator.object2QueryString(param);     
                        window.history.pushState(param, "", "./" + qs);
                    });
                }                
            });

            window.filter = self.filter;
        });

        window.onpopstate = function(event){
            var param;
            if(event.state){ //如果有event.state，优先用
                param = event.state;
            }else{// 否则读取url中的最有一部分
                var tempArr = location.href.split('xflist');
                var str = tempArr[1];
                if(str.startsWith('/')){
                    str = str.substring(1);
                }

                param = ParamGenerator.queryString2Object(str);
            }

            self.filter.setValue(ParamGenerator.convert2FilterParam(param));

            self.fetchData(param,function(data){
                if(data.count!=0 && data.count<=self.pageSize){// 没有更多了
                    self.showNoMore();
                }
                self.createHouseList(data.data,data.count);       
            });            
        };

        this.bindEvent();
        this.pullload();
    }

    bindEvent(){
        var self = this;
        $('.no-data button').click(function(){
            self.filter.clear();
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
            this.showNoMore();
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

    showNoMore(){// 显示没有更多
        $('.reach-bottom').show();
    }

    hideNoMore(){
        $('.reach-bottom').hide();
    }

    loadMore(){// 加载更多数据
        
    }

    fetchData(param,success,error){// 获取列表数据
        var self = this;
        this.showLoading();
        $('.list').trigger('disable');
        this.request(this.apiUrl.xf.list, param, {
            type: "POST",
            successCallback: success,
            errorCallback: error,
            completeCallback: function(){
                self.hideLoading();
            }
        });
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

    showLoading(){
        $('.page-loading').show();
    }

    hideLoading(){
        $('.page-loading').hide();
    }

    pullload(){
        let self = this ;

        //二手房
        $(".list").pullload({
            apiUrl : self.apiUrl.xf.list ,
            queryStringObject : function(){
                delete self.param.pa;
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
                window.history.replaceState(self.param, "", "./" + ParamGenerator.object2QueryString(self.param));// 修改当前url    `
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