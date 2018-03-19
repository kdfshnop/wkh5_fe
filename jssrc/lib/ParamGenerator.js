/**
 * 1. 项目名称：悟空找房h5
 * 2. 页面名称：lib -> ParamGenerator
 * 3. 作者：tangxuyang@lifang.com
 * 4. 备注：主要是把从filter组件返回的数据转化成api能够理解的查询参数
 */

// 把传进来的对象转换成后台接口需要的数据，主要工作就是字段的mapping
class ParamGenerator {
    constructor(funcs) {
        this.funcs = $.extend({}, ParamGenerator.DEFAULT, funcs);
    }

    generateParamObj(obj, initObj) {
        var ret = $.extend({}, initObj);
        for(var key in obj){
            var func = this.funcs[key];
            if(func) {
                func(ret, obj[key]);
            }
        }

        return ret;
    }    
}

function setValue(obj, fieldName, val){
    var tmpArr = fieldName.split('.');
    if(tmpArr.length > 1){
        if(!obj[tmpArr[0]]){
            obj[tmpArr[0]] = {};
        }

        setValue(obj[tmpArr[0]], tmpArr.join('.'), val);
    }else{
        if(Object.prototype.toString.call(val) == '[object Array]'){
            obj[fieldName] = val;
        }else{
            obj[fieldName] = [val];
        }        
    }
}

ParamGenerator.createMappingFunc = function(type, fieldName){
    if(type == 1){// 单数
        return function(ret, data){
            ret[fieldName] = data;
        }
    }else{// 数组
        return function(ret, data){            
            setValue(ret, fieldName, data);
        }
    }
}

ParamGenerator.DEFAULT = {
    sort: ParamGenerator.createMappingFunc(1, "so"),// 排序

    price: function(ret, data){// 价格
        data = data + "";
        if(data.indexOf('to')>-1){
            ret.cp = data; 
        } else {
            ret.pr = data;
        }
    },
    district: ParamGenerator.createMappingFunc(1, "di"),// 区域id
    town: ParamGenerator.createMappingFunc(1, "to"),// 板块id
    metro: ParamGenerator.createMappingFunc(1, "li"),// 地铁线id
    station: ParamGenerator.createMappingFunc(1, "st"),// 地铁站id
    meter: ParamGenerator.createMappingFunc(1, "m"),// 附近米数
    features: ParamGenerator.createMappingFunc(1, "ta"),// 特色（标签）
    propertyTypes: ParamGenerator.createMappingFunc(1, "ty"),// 物业类型
    decorations: ParamGenerator.createMappingFunc(1, "dt"),// 装修类型
    types: ParamGenerator.createMappingFunc(1, "la"),// 户型
    houseTypes: ParamGenerator.createMappingFunc(1, "ht"),// 户型
    areas: ParamGenerator.createMappingFunc(1, "ar"),// 面积
    ages: ParamGenerator.createMappingFunc(1, "ag"), // 房龄
};

// 对象转成queryString，用-隔开
ParamGenerator.object2QueryString = function(obj){
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
};

// queryString转化成对象，把字符串用-分割
ParamGenerator.queryString2Object = function(str) {
    var ret = {};
    if(str){
        var tmpArr = str.split('-');        

        if(tmpArr.length % 2 == 1){
            return {};// 参数有问题
        }

        for(var i = 0; i < tmpArr.length; i+=2){
            if(typeof ret[tmpArr[i]] === 'undefined'){
                ret[tmpArr[i]] = tmpArr[i+1];
            }else if(Object.prototype.toString.call(ret[tmpArr[i]]) === '[object Array]'){
                ret[tmpArr[i]].push(tmpArr[i+1]);
            } else {
                ret[tmpArr[i]] = [ret[tmpArr[i]], tmpArr[i+1]];
            }
        }
    }

    return ret;
};

// 把后端理解的查询条件转换成Filter使用的初始化值
ParamGenerator.convert2FilterParam = function(obj){
    var funcs = {        
        so: ParamGenerator.createMappingFunc(1, "sort"),// 排序        
        pr: ParamGenerator.createMappingFunc(1, "price"),// 价格
        cp: ParamGenerator.createMappingFunc(1, "price"),// 价格        
        di: ParamGenerator.createMappingFunc(1, "district"),// 区域id
        to: ParamGenerator.createMappingFunc(1, "town"),// 板块id        
        li: ParamGenerator.createMappingFunc(1, "metro"),// 地铁线id
        st: ParamGenerator.createMappingFunc(1, "station"),// 地铁站id
        m: ParamGenerator.createMappingFunc(1, "meter"),
        lon: ParamGenerator.createMappingFunc(1, "longitude"),
        lat: ParamGenerator.createMappingFunc(1, "latitude"),

        la: ParamGenerator.createMappingFunc(2, "houseTypes.types"), 
        ta: ParamGenerator.createMappingFunc(2, "houseTypes.features"),        
        ty: ParamGenerator.createMappingFunc(2, "houseTypes.propertyTypes"),
        ht: ParamGenerator.createMappingFunc(2, "houseTypes.houseTypes"),        
        ht: ParamGenerator.createMappingFunc(2, "houseTypes.decorations"),
        ag: ParamGenerator.createMappingFunc(2, "houseTypes.houseAges"),
        ar: ParamGenerator.createMappingFunc(2, "houseTypes.ares"),       
    };

    var ret = {};

    for(var key in obj){
        var func = funcs[key];
        if(func){
            func(ret, obj[key]);
        }
    }

    return ret;
};
