/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：esf/list(二手房列表)
 3. 作者：zhaohuagang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class ListController extends Controller {
    constructor() {        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        类的初始化，继承控制器基类
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        super() ;        
        var self = this;        
        this.paramGenerator = new ParamGenerator();
        $('.total').slideUp(1000);// 隐藏查询总条数       
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        加载相关页面组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require([ "../components/bigdata.min" , "../components/filter.min", "../components/conning-tower.min" ] , (BigData, Filter) => {
            BigData.init(this) ;
            new ConningTower({                
                "bigDataUtil" : BigData ,               
                "moduleType" : "esf" ,
                "cityClick" : () => {
                    
                } ,                
                "searchResultItemClick" : (data) => {
                    // 与filter中的区域地铁互斥
                    delete self.param.di;// 区域id
                    delete self.param.to;// 板块id
                    delete self.param.li;// 地铁线id
                    delete self.param.st;// 地铁站id
                    delete self.param.id;// 小区id
                    var mapping = ["","sdi","sto","sli","sst","sid"];
                    var key = mapping[data.type];
                    if(key){
                        self.param[key] = data.value;
                        self.goto();
                    }
                }
            }) ;

            self.filter = new Filter($.extend({}, Filter.ESFDEFAULT,{
                el: ".filter",                
                cityId: 43,                
                BigData: BigData,                
                controller: self,
                near: true,
                filterChanged: function(result){     
                    console.log("条件变了:", result);
                    debugger;
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

            window.filter = self.filter;
        }) ;

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
            str += '<a href="/'+ cityPinyin + '/esf/' +  item.encryptHouseId+'.html' + (channel?'?channel='+channel:'') +'" class="esf-item" data-bigdata="'+ encodeURIComponent('{"eventName": "1068028", "eventParam": { "house_id": "'+item.houseId+'" }}')+'">\
            <dl>\
                <dt><img src="'+item.houseImgUrl + '?x-oss-process=image/resize,w_150" alt="'+item.estateName+'" class="lazy"></dt>\
                <dd class="title">'+item.houseTitle+'</dd>\
                <dd>'+item.houseChild + " " + item.areaStr +' | ' + item.district + " " + item.town +' </dd>\
                <dd class="tags">'
                + (!item.tagList?"":item.tagList.map(function(tag){
                    switch(tag){
                        case "降价":
                        return '<div class="promotion"><span>降价</span></div>';
                        case "新上":
                        return '<div class="new"><span>新上</span></div>';
                        case "满二":
                        return '<div class="over"><span>满二</span></div>';
                        case "满五唯一":
                        return '<div class="over"><span>满五唯一</span></div>';
                        default:

                        return '<div><span>'+tag+'</span></div>';
                    }
                    
                }).join('') )
                +                                  
                '</dd>\
                <dd>\
                     <span class="money">' + item.totalPrice + '万</span>\
                     <span class="price">' + item.unitPrice + ' 元/㎡</span>\
                </dd>\
            </dl>\
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
        var $list = $('#list .esf-item');
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
                    <h3>火爆高性价比新房</h3>\
                    <span class="detail">去看看</span>\
                </div>\
            </a>').insertAfter($list[19]);
        }
    }

    showError(){// 接口报错，分为两种，1. 筛选条件变更刷新 2. 上拉加载

    }

    // 上拉加载
    pullload(){
        let self = this ;
        var cityId = $.cookie("xfSelectedCityId");
        var cityPinyin = $.cookie("xfSelectedCityPinyin");
        var cityName = $.cookie("xfSelectedCityName");
        
        //二手房
        $("#list").pullload({
            apiUrl : self.apiUrl.esf.list.houselist ,
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
                
                if( !data.data || !data.data.houseList || !data.data.houseList.length){
                    data.count = 1;
                    return;    
                } 

                self.appendHouseList(data.data.houseList);                
            }
        }) ;
    }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController ;
}) ;