/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：space -> index(经纪人个人店铺首页)
 3. 作者：赵华刚@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class IndexController extends Controller {
    constructor() {
        super() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        图片懒加载实例化
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/        
        $(".lazy").lazyload({ 
            "placeholder" : this.staticDomain + "/wkh5_fe/images/common/loading.jpg"
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        返回按钮事件
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
        $("header .icon-back").click(function(){
            history.go(-1) ;
        }) ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        底部经纪人助手条处理
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
        this.addListenerToAssistant() ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给第一个tabs-handle选项添加on样式
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/         
        $(".wk-tabs .tabs-handle li").first().addClass("on") ;
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        载入组件逻辑
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/  
        let that = this;
        require([ "../components/bigdata.min" , "../components/tabs.min" ] , (BigData) => {
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            pv埋点
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            BigData.init(this) ;
            BigData.bigData({
                "pageName" : "1002" ,
                "pageParam" : {
                    "source" : "" ,
                    "agent_id" : $("#agentId").val()
                } ,
                "type" : 1
            }) ;
            /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
           tabs实例化
            -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
            $(".wk-tabs").tabs({
                "fixedWhenScroll" : false ,
                "effect" : "fadeIn" ,
                "duration" : 200,
                onSwap: function (index) {
                    let requestParams = {
                       "agentId": $("#agentId").val()
                    };
                   let typeHouseList = $(`.tabs-handle >li:eq(${index})`).attr("data-typehouse");
                   that.pullload(requestParams,typeHouseList)
                }
            }) ;            
        }) ;        
        /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        给dom节点绑定事件
        -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/ 
        this.addEventListener() ;
    } ;
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    给dom节点绑定事件
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    addEventListener() {
        let classSelf = this ;
        $(".highlight .more").click(function(){
            $(this).slideUp(200) ;
            $(this).siblings(".optional").fadeIn(200 , function(){
                classSelf.ellipsis() ;
            }) ;           
        }) ;
        $(".highlight .optional .switch").click(function(){
            $(this).siblings(".long-text").removeClass("limit") ;
            $(this).hide(200) ;
        }) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    判断自我介绍和成交故事是否需要展开
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    ellipsis() {       
        $(".highlight .optional .long-text").each(function(){             
            if($(this).height() <= 60 ) return ;           
            $(this).addClass("limit") ;             
            $(this).siblings(".switch").show(200) ;
        }) ;
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
     创建dome
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    creatRent(type,item) {
        let houseTagList = ''; // 标签
        let commision =''; // 租房零佣金
        let domeType='';   // dome 的拼装
        if (type == "rent"){
            if (item.houseTag.isSubwayHouse) {
                houseTagList += '<div class="nears"><span >近地铁</span></div>'
            }  if (item.houseTag.isPriceDown) {
                houseTagList += '<div class="priced"><span >降价</span></div>'
            }  if (item.houseTag.isNewHouse) {
                houseTagList += '<div class="newup"><span>新上</span></div>'
            }   if (item.houseTag.isShortRent) {
                houseTagList += '<div class="anthert"><span >可短租</span></div>'
            }   if(item.houseTag.isHardcover == 1){
                houseTagList += '<div class="anthert"><span >精装</span></div>'
            } if(item.houseTag.isHardcover == 2){
                houseTagList += '<div  class="anthert"><span>豪装</span></div>'
            } if(item.houseTag.isSouth){
                houseTagList += '<div class="anthert"><span >朝南</span></div>'
            } if(item.houseTag.isZeroCommission){
                commision= ' <span class="commission">0 佣金</span>'
            }
               let hasVideo='';
               if(item.houseTag.hasVideo == 1){
                   hasVideo= `<span class="play"><i></i></span>`;
               }
               let distanceSubway = '';
            let styleNo = '';
            if (item.distanceSubway){
                distanceSubway = `<p class="base-info">${item.distanceSubway}</p>`
            }else {
                styleNo=`style="margin-top: 10px"`
            }
               domeType=  `<a  class="rent-item box" href=" ${item.url}">
                   <div class="left">
                       <img src="${item.firstImageUrl}?x-oss-process=image/resize,w_120" alt="${ item.estateName} " class="lazy">
                       ${hasVideo}
                       ${commision}
                   </div>
                   <div class="right">
                       <h4> ${item.houseTitle}</h4>
                       <p class="base-info">                    
                          ${item.houseTypeStr} ${item.spaceArea}㎡ | ${item.districtAndTownName}
                       </p>
                        ${distanceSubway}
                      <div class="tags" ${styleNo}>${houseTagList}</div>
                       <p class="unit-price"> <span>${item.rentPriceStr}</span> 元/月</p>
                   </div>
               </a>`;
        }else if(type == "esf"){
            item.tagList.forEach(function(tag) {
              if(tag == "降价") { houseTagList+=`<div class="promotion"><span>${ tag }</span></div>`}
                 else if(tag == "新上") { houseTagList+=`<div class="new"><span>${ tag }</span></div>`}
                 else if(tag == "满二" || tag == "满五唯一") { houseTagList+=`<div class="over"><span>${ tag }</span></div>`}
                 else { houseTagList+=`<div><span>${tag}</span></div>`}
                }) ;
            let hasVideo='';
            if(item.hasVideo == 1){
                hasVideo= `<span class="play"><i></i></span>`;
            }
            let bigdata = encodeURIComponent(JSON.stringify({ eventName:'1002017',eventParam:{house_id:item.houseId }, type: 2}));
            domeType = `<a href=" ${item.url}" class="esf-item" data-bigdata="${bigdata}">
                            <dl>
                                <dt><img src="${item.houseImgUrl}?x-oss-process=image/resize,w_120" alt="${ item.houseTitle}" class="lazy" style="display: inline;">${hasVideo}</dt>
                                <dd class="title">${item.houseTitle}</dd>
                                <dd>${item.houseChild} ${item.areaStr} | ${item.district}${item.town}</dd>
                                <dd class="tags">
                                  ${houseTagList}               
                                </dd>   
                                <dd>
                                     <span class="money">${item.totalPrice}万</span>
                                     <span class="price">${item.unitPrice} 元/㎡</span>
                                </dd>                             
                            </dl>
                        </a>`;
        }else if(type == "xf"){
             if (item.hasActivity){
                 houseTagList +=`<li class="yh">有优惠</li>`
             }else if (item.isSubwayEstate){
                 houseTagList +=`<li class="dt">近地铁</li>`
             }else if (!item.isSoonOpen){
                 houseTagList +=`<li class="">在售楼盘</li>`
             }else if (item.isSoonOpen){
                 houseTagList +=`<li class="">即将开盘</li>`
             }else if (item.hasVideo){
                 houseTagList +=`<li class="">有视频</li>`
             }
             let activitys='';
             let hasVideo='';
            if(item.hasVideo == 1){
                hasVideo= `<span class="play"><i></i></span>`;
            }
             if(item.activitys && item.activitys[0]){
                activitys= `<div class="yh">${ item.activitys[0].title}</div>`
              }
            let bigdata = encodeURIComponent(JSON.stringify({ "eventName" : 1002010 , "eventParam" : { "new_house_id" : item.subEstateId }}));
            domeType = `<a class="xf-item" href="${item.url}" data-bigdata="${bigdata}">
            <div class="img">
                <img src="${item.houseImgUrl}?x-oss-process=image/resize,w_120" data-src="${item.houseImgUrl}" class="lazy">
                ${hasVideo}
                ${activitys}     
            </div>
            <div class="info">
                <h3><%= item.estateName%></h3>
                <p class="district-town-area">
                    <span>${ item.districtName}  ${item.townName}</span><span>${item.startSpace}m²-${item.endSpace}m²</span>
                </p>
                <ul class="tags">
                    ${houseTagList}
                </ul>
                <p class="unit-price"><span>${ item.unitPrice}</span> <span>元/m</span></p>
            </div>
        </a>`;
        }
        return domeType
    }
    /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    上拉加载实例化
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    pullload(requestParams,typeHouseList) {
        let self = this ;
        let pinyin = $.cookie('pinyin') || "shanghai";
        let type =  typeHouseList == "secondHouseList" ? "esf": (typeHouseList == "rentHouseList" ? "rent": "xf");
        // 房源列表
        $(`.${type}-frame`).pullload({
            apiUrl : eval(`this.apiUrl.space.${typeHouseList}`) ,
            requestType: "get",
            queryStringObject : requestParams ,
            traditional: true,
            pageSize: 10,
            threshold : 50 ,
            countKey:"count",
            callback : function(data) {
                if( ! data.data) return ;
                data.data.houseList.forEach((listItem,index)=> {
                    let listIt = listItem;
                    if(type == "xf"){
                        listIt['url'] = `/${pinyin}/${type}/${ listItem.encryptHouseId}.html`;
                    }else {
                        listIt['url'] = `/${pinyin}/${type}/${ listItem.encryptHouseId}.html?agentId=`+ $("#agentId").val();
                    }
                    $(`.${type}-frame`).append(self.creatRent(type,listIt)) ;
                }) ;
            }
        }) ;

    } ;
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new IndexController ;
}) ;
