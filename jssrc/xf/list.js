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

                    var param = self.convertParam(result);
                    self.param = param;
                    self.hideNoData();
                    self.hideNoMore();
                    self.fetchData(param,function(data){
                        if(data.count!=0 && data.count<=self.pageSize){// 没有更多了
                            self.showNoMore();
                        }
                        self.createHouseList(data.data,data.count);  
                        var qs = self.object2QueryString(param);                        
                        window.history.pushState(param, "", "./" + qs);       
                    });
                }                
            });

            window.filter = self.filter;
        });

        window.onpopstate = function(event){
            console.log('onpopstate');
            console.log(event);
            console.log(location.href);
            var param;
            if(event.state){
                param = event.state;
            }else{
                var tempArr = location.href.split('xflist');
                var str = tempArr[1];
                if(str.startsWith('/')){
                    str = str.substring(1);
                }

                param = self.queryString2Object(str);
            }

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

    object2QueryString(obj){
        console.log(obj);
        var tmpArr = [];

        for(var key in obj){
            if(typeof(obj[key]) === 'undefined') continue;
            if(Object.prototype.toString.call(obj[key]) == "[object Array]"){// 数组
                for(var i = 0; i < obj[key].length; i++){
                    tmpArr.push(key);
                    tmpArr.push(obj[key][i]);
                }
            }else{
                tmpArr.push(key);
                tmpArr.push(obj[key]);
            }
        }

        return tmpArr.join('-');
    }

    queryString2Object(str){
        if(str){
            var tmpArr = str.split('-');
            var ret = {};

            if(tmpArr.length % 2 == 1){
                return {};// 参数有问题
            }

            for(var i = 0; i < tmpArr.length / 2; i+=2){
                if(typeof ret[tmpArr[i]] === 'undefined'){
                    ret[tmpArr[i]] = tmpArr[i+1];
                }else if(Object.prototype.call(ret[tmpArr[i]]) === '[object Array]'){
                    ret[tmpArr[i]].push(tmpArr[i+1]);
                } else {
                    ret[tmpArr[i]] = [tmpArr[i+1]];
                }
            }
        }

        return {};
    }

    convertParam(obj){
        // 把从filter中获得的查询条件转化成后端接口需要的格式
        var funcs = {
            sort: function(ret, data){
                ret.so = data;
            },

            price: function(ret, data){
                ret.cp = data; 
            },

            district: function(ret, data){
                ret.di = data;
            },

            town: function(ret, data){
                ret.to = data;
            },

            metro: function(ret, data){
                ret.li = data;
            },

            station: function(ret, data){
                ret.st = data;
            },

            meter: function(ret, data){
                ret.m = data;
            },

            features: function(ret, data){// 特色
                ret.ta = data;
            },

            propertyTypes: function(ret, data){// 物业类型
                ret.ty = data;
            },

            decorations: function(ret, data){// 装修
                ret.dt = data;
            },

            types: function(ret, data){// 户型
                ret.la = data;
            }            
        };

        var ret = {};
        for(var key in obj) {
            var func = funcs[key];
            if(func){
                func(ret, obj[key]);
            }
        }

        return ret;
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
        this.request("https://m.wkzf.com/xflist/houselist.rest",param, {
            successCallback: success,
            errorCallback: error
        });
    }

    insertTrendAndOldHouse(){// 插入跳转到价格行情和二手房的链接
        //$('.list .xf-item').length()
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
        if($('.list .price').length == 0 && $list.length>19){
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

    pullload(){
        let self = this ;
        var i = parseInt($('#count').val() || 0);
        //二手房
        $(".list").pullload({
            apiUrl : "https://m.wkzf.com/xflist/houselist.rest" ,
            queryStringObject : function(){
                return self.param;
            },   
            threshold : 50 ,
            pageSize: 10,       
            callback : function(data) {
                if( ! data.data) return ;                
                self.appendHouseList(data.data);
                window.history.replaceState(null, "", "" + (++i));
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