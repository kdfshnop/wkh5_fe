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
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        加载相关页面组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        require([ "../components/bigdata.min" , "../components/filter.min", "../components/conning-tower.min" ] , (BigData) => {
            BigData.init(this) ;
            new ConningTower({                
                "bigDataUtil" : BigData ,               
                "moduleType" : "esf" ,
                "cityClick" : () => {
                    alert("在二手房城市选择器中点选了城市") ;
                } ,
                "searchResultItemClick" : (data) => {
                    alert(data) ;
                }
            }) ;

            self.filter = new Filter({
                el: ".filter",
                houseType: 1,
                cityId: 43,
                near: false,
                longitude: 222,
                latitude: 234,
                distances: [{value: "5000", text: "不限（智能范围）"},{value: "500", text: "500米"},{value: "1000", text: "1000米"},{value: "2000", text: "2000米"},{value: "5000", text: "5000米"}],
                sorts: [{                    
                    text: "默认排序"
                },{
                    id: "1",
                    text: "单价从低到高"
                },{
                    id: "2",
                    text: "单价从高到低"
                },{
                    id: "3",
                    text: "总价从低到高"
                },{
                    id: "4",
                    text: "总价从高到低"
                },{
                    id: "5",
                    "text": "面积从小到大"
                },{
                    id: "6",
                    text: "面积从大到小"
                },{
                    id: "7",
                    text: "发布时间从近到远"
                }],
                houseTypes: [{
                    name: "types",//用来作为返回查询条件的key
                    title: "户型",
                    items: [{
                        id: "",
                        text: "不限",
                        exclusive: true,//互斥
                    },{
                        id: "1",
                        text: "一室",
                        exclusive: false,//互斥
                    },{
                        id: "2",
                        text: "二室",
                        exclusive: false,//互斥
                    },{
                        id: "3",
                        text: "三室",
                        exclusive: false,//互斥
                    },{
                        id: "4",
                        text: "四室",
                        exclusive: false,//互斥
                    },{
                        id: "5",
                        text: "五室及以上",
                        exclusive: false,//互斥
                    }]
                },{
                    name: "features",
                    title: "特色",
                    items: [{
                        id: "fd",
                        text: "降价"
                    },{
                        id: "n",
                        text: "新上"
                    },{
                        id: "m2",
                        text: "满二"  
                    },{
                        id: "m5",
                        text: "满五唯一"
                    },{
                        id: "f1",
                        text: "地铁房"
                    },{
                        id: "s",
                        text: "近学校"
                    },{
                        id: "f2",
                        text: "有视频"
                    },{
                        id: "ns",
                        text: "南北通透"
                    }]
                },{
                    name: "areas",
                    title: "面积",
                    items: [{
                        id: "1",
                        text: "50以下"
                    },{
                        id: "2",
                        text: "50-70"
                    },{
                        id: "3",
                        text: "70-90"
                    },{
                        id: "4",
                        text: "90-110"
                    },{
                        id: "5",
                        text: "110-130"
                    },{
                        id: "6",
                        text: "130-150"
                    },{
                        id: "7",
                        text: "150-200"
                    },{
                        id: "8",
                        text: "200-300"
                    },{
                        id: "9",
                        text: "300以上"
                    }]
                },{
                    name: "houseTypes",
                    title: "房屋类型",
                    items: [{
                        id: "1",
                        text: "公寓"
                    },{
                        id: "2",
                        text: "别墅"
                    }]
                },{
                    name: "decorations",
                    title: "装修",
                    items: [{
                        id: "1",
                        text: "毛坯"
                    },{
                        id: "2",
                        text: "简装"
                    },{
                        id: "3",
                        text: "中装"
                    },{
                        id: "4",
                        text: "精装"
                    },{
                        id: "5",
                        text: "豪装"
                    }]
                },{
                    name: "ages",
                    title: "房龄",
                    items: [{
                        id: "1",
                        text: "5年以内"
                    },{
                        id: "2",
                        text: "5-10年"
                    },{
                        id: "3",
                        text: "10-20年"
                    },{
                        id: "4",
                        text: "20年以上"
                    }]
                }],
                controller: self,
                filterChanged: function(result){ 
                    this.total = 0;
                    this.count = 0;                    
                    console.log("筛选条件变了：", result);                                      
                    var param = self.paramGenerator.generateParamObj(result);
                    self.param = param;
                    // self.hideNoData();
                    // self.hideNoMore();
                    self.fetchData(param,function(data){
                        // if(data.count!=0 && data.count<=self.pageSize){// 没有更多了
                        //     self.showNoMore();
                        // }
                        // self.createHouseList(data.data,data.count);  
                        // var qs = ParamGenerator.object2QueryString(param);                        
                        // window.history.pushState(param, "", "./" + qs);       
                    });
                }                
            });
        }) ;
    }        
    
    fetchData(param,success,error){// 获取列表数据
        this.request(this.apiUrl.esf.list.houselist, param, {
            type: "POST",
            successCallback: success,
            errorCallback: error
        });
    }
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController ;
}) ;