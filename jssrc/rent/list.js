/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/list(租房-列表)
 3. 作者：liyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/*import apiData from '../mock/rentList.js';*/
class ListController extends Controller {
    constructor() {
        super();
        this.readyFun();
        this.choseFun();
       /* let apiData = require('../mock/rentList.js');*/
        let apiData = {
            "message": "成功",
            "status": 1,
            "data": {
                "rentList": [
                    {
                        "houseId": 66139,
                        "subEstateName": "乔爱别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "5室3厅3卫",
                        "spaceArea": 220.5,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "--/--层",
                        "orientationStr": "南",
                        "publishHouseTime": 1428700671000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/f207818fb19a483eb1ae8ba3dff599b5.AL",
                        "rentPrice": 11000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66140,
                        "subEstateName": "中宁别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "8室3厅3卫",
                        "spaceArea": 246.31,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "精装",
                        "houseFloor": "1/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1428700480000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/8d272853a1c54febbffbf283028c0987.AL",
                        "rentPrice": 25000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66146,
                        "subEstateName": "长堤花园别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "5室3厅4卫",
                        "spaceArea": 515.62,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "豪装",
                        "houseFloor": "3/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1431927299000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/463e1112f2dc44af9c06a19906788a7c.AL",
                        "rentPrice": 45000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66147,
                        "subEstateName": "南郊别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅3卫",
                        "spaceArea": 190,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "--/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428699019000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 0,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66148,
                        "subEstateName": "南郊别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "4室2厅3卫",
                        "spaceArea": 195,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "--/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428699019000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 5000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66149,
                        "subEstateName": "长堤花园别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "5室4厅5卫",
                        "spaceArea": 515,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "豪装",
                        "houseFloor": "--/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1428699018000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 40000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66151,
                        "subEstateName": "西郊华庭",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅2卫",
                        "spaceArea": 170,
                        "houseChildTypeStr": "别墅-其他",
                        "renovationStr": "",
                        "houseFloor": "2/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428699558000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/5f99731543b7409f9a019190240d918e.AL",
                        "rentPrice": 20000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66152,
                        "subEstateName": "西郊华庭",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "4室2厅3卫",
                        "spaceArea": 167,
                        "houseChildTypeStr": "别墅-其他",
                        "renovationStr": "",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428698842000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/1c65b3ab218742e397420da33ee2688b.AL",
                        "rentPrice": 20000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66153,
                        "subEstateName": "图门小区图门路10弄",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "6室3厅5卫",
                        "spaceArea": 450,
                        "houseChildTypeStr": "别墅-独栋别墅",
                        "renovationStr": "豪装",
                        "houseFloor": "--/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1431927299000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/06c75c16283647f2b3eb88d67fea05cc.AL",
                        "rentPrice": 40000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66154,
                        "subEstateName": "城市经典别墅",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "7室4厅5卫",
                        "spaceArea": 398.8,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1431244022000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 30000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66155,
                        "subEstateName": "西郊华庭",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅3卫",
                        "spaceArea": 170,
                        "houseChildTypeStr": "别墅-其他",
                        "renovationStr": "",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1431925322000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 18000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66158,
                        "subEstateName": "富宏花园",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅4卫",
                        "spaceArea": 200,
                        "houseChildTypeStr": "别墅-独栋别墅",
                        "renovationStr": "豪装",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428699379000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 17000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66159,
                        "subEstateName": "富宏花园",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅4卫",
                        "spaceArea": 200,
                        "houseChildTypeStr": "别墅-独栋别墅",
                        "renovationStr": "豪装",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428699379000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 18000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66161,
                        "subEstateName": "田林七村",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "6室5厅5卫",
                        "spaceArea": 288.86,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "--/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1431327422000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 11000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66162,
                        "subEstateName": "景博花园",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅2卫",
                        "spaceArea": 136,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "4/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428701570000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 7800,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66167,
                        "subEstateName": "捷克小区（公寓）",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "4室2厅2卫",
                        "spaceArea": 152.69,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "精装",
                        "houseFloor": "3/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428702290000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 5000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66169,
                        "subEstateName": "振新佳苑",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "6室3厅5卫",
                        "spaceArea": 300,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "精装",
                        "houseFloor": "1/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1428702290000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 20000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66175,
                        "subEstateName": "文翔明苑",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅1卫",
                        "spaceArea": 130,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "1/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428701750000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 3000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66179,
                        "subEstateName": "紫京苑",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "3室2厅2卫",
                        "spaceArea": 144,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "精装",
                        "houseFloor": "2/--层",
                        "orientationStr": "南北",
                        "publishHouseTime": 1428701931000,
                        "updateHouseTime": 1434088182000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 11000,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    },
                    {
                        "houseId": 66181,
                        "subEstateName": "金地格林布鲁斯郡",
                        "unitNameStr": null,
                        "buildingName": null,
                        "room": null,
                        "houseTypeStr": "4室2厅2卫",
                        "spaceArea": 208,
                        "houseChildTypeStr": "别墅-洋房",
                        "renovationStr": "",
                        "houseFloor": "--/--层",
                        "orientationStr": "--",
                        "publishHouseTime": 1428701031000,
                        "updateHouseTime": 1434187611000,
                        "firstImageUrl": "https://imgwater-test.oss.aliyuncs.com/57955e6392a543caa5e969eb3499bdc8.AL",
                        "rentPrice": 0,
                        "houseTag": null,
                        "lookCount": 0,
                        "browseCount": 0,
                        "shareCount": 0
                    }
                ],
                "totalHouseCount": 10,
                "findHouseCount": 10
            }
        };
        this.dataRender(apiData)
    }

    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 条件选择的初始化函数
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    readyFun(){
        $('.dic').hide();
        $('.bac').hide();
        $('.price-total').hide();
        $('.house-type').hide();
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 条件选择的区域选择的点击效果函数
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
     choseFun(){
        /* 区域选择点击事件*/
         $('.rent-list > ul > li').click(function () {
             $(this).siblings().removeClass('active-color-top');  /* 点击li标签改变其样式*/
             $(this).toggleClass('active-color-top');
             $(this).siblings().children('span').removeClass('direction');  /*点击li标签事件改变子标签span箭头的样式（后面会选中条件查询之后恢复样式）*/
             $(this).children('span').toggleClass('direction');
             let list = $('.rent-list > ul > li > span');   /*根据span标签的样式判断底部罩层是否显示*/
             $('.bac').hide();
             list.each(function (index, item) {
                 if (item.classList.length == 1){
                     $('.bac').show();
                 }
             });
             let indexP = $(this).index();  /*根据点击li标签的位置判断相应的模块响应出现*/
             if (indexP == 0){     /*判断区域模块的显示*/
                 $('.dic').stop();
                 $('.price-total').hide();
                 $('.house-type').hide();
                 $('.dic').slideToggle();

             }else if (indexP == 1){      /*判断价格模块的显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.house-type').hide();
                 $('.price-total').slideToggle();
             }else if (indexP == 2){    /* 判断户型模块显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.price-total').hide();
                 $('.house-type').slideToggle();
             }else if (indexP == 3){    /* 判断更多模块显示*/
                 $('.bac').stop();
                 $('.dic').hide();
                 $('.price-total').hide();
                 $('.house-type').slideUp();
             }
         });
         /*区域与地铁选择点击事件*/
         $('.tabs > ul > li').click(function () {
            $(this).siblings().children('span').removeClass('active-color-dic');
             $(this).children('span').addClass('active-color-dic');
             let indexP = $(this).index();
             if (indexP == 0){      /*判断区域模块显示或隐藏*/
                 $('.metro-content').slideUp();
                 $('.dic-content').slideDown();
             }else if(indexP == 1){   /*判断地铁模块显示或隐藏*/
                 $('.dic-content').slideUp();
                 $('.metro-content').slideDown();
             }
         });
         $('.house-list > ul > li').click(function () {
             let  indexP = $(this).index();
             if (indexP == 0){
                 $(this).siblings().removeClass('active-house');
                 $(this).toggleClass('active-house');
             }else {
                 $('.house-list > ul > li:eq(0)').removeClass('active-house');
                 $(this).toggleClass('active-house');
             }
         })
     }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
得到数据渲染函数
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    dataRender(apiData){
        let allDome ='';
        apiData.data.rentList.forEach(function (item) {
            let dome = `
<div class="single-house">
    <div class="house-detail">
        <div class="pic">
            <img src=${item.firstImageUrl} alt="">
        </div>
        <div class="desc">
            <h3>${item.subEstateName} </h3>
            <p class="posit">${item.spaceArea}㎡  |  ${item.orientationStr}  |  ${item.renovationStr || '--'} | ${item.houseTypeStr}</p>
            <ul>
                <li>奖励</li>
                <li>奖励</li>
                <li>奖励</li>
                <li>奖励</li>
            </ul>
            <p class="price">${item.rentPrice} 元/月</p>
        </div>
    </div>
    <div class="share-detail">
        <p class="share-time">发布 ${item.publishHouseTime}</p>
        <p class="share">
            <span>浏览 ${item.browseCount}</span>
            <span>收藏 ${item.lookCount}</span>
            <span>分享 ${item.shareCount}</span>
        </p>
    </div>
</div>`;
            allDome = allDome + dome;
        });
  $('.rent-items').append(allDome)
    }
}


/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new ListController;
});