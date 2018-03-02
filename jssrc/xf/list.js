/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/


 class ListController extends Controller {
    constructor() {
        super();
        var self = this;
        $('.total').slideUp();
        require(['../components/filter.min'], function(Filter){
            self.filter = new Filter({
                el: ".filter",
                houseType: 1,
                cityId: 43,
                controller: self,
                filterChanged: function(result){
                    console.log("筛选条件变了：", result);
                    var param = {
                        subWayLineId: result.metroKey,
                        districtAndTown: result.districtPinyin,
                        pinyin: "shanghai"                        
                    };
                    console.log("参数：",param);
                    self.request("https://m.wkzf.com/xflist/houselist.rest",param, {
                        successCallback: function(data){
                            self.createHouseList(data.data);                            
                        }
                    });
                }                
            });
        });

        this.bindEvent();
    }

    bindEvent(){
        var self = this;
        $('.no-data button').click(function(){
            self.filter.clear();
        });
    }

    createHouseList(data){// 生成房源列表
        if(data && data.length){
            $('.no-data').hide();
            var str = "";
            data.forEach(function(item){
                str += '<a class="xf-item">\
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
                        <li class="yh">有优惠</li><li class="dt">进地铁</li><li class="">在售楼盘</li><li class="">即将开盘</li><li class="">即将开盘</li>\
                    </ul>\
                    <p class="unit-price"><span>'+item.unitPrice+'</span> <span>元/m</span></p>\
                </div>\
            </a>';
            });

            $('.total + div').html(str);
            $('.total').slideDown();
            setTimeout(function(){
                $('.total').slideUp();
            }, 1500);
        }else{// 没数据
            this.showNoData();
        }
    }

    showNoData(){// 显示没有数据，并显示新房楼盘推荐
        $('.no-data').show();
        $('.total + div').html('');
        $('.recommendation').html('');
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});