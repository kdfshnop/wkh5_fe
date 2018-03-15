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

ParamGenerator.DEFAULT = {
    sort: function(ret, data){// 排序
        ret.so = data;
    },

    price: function(ret, data){// 价格
        data = data + "";
        if(data.indexOf('to')>-1){
            ret.cp = data; 
        } else {
            ret.pr = data;
        }
    },

    district: function(ret, data){// 区域id
        ret.di = data;
    },

    town: function(ret, data){// 板块id
        ret.to = data;
    },

    metro: function(ret, data){// 地铁线id
        ret.li = data;
    },

    station: function(ret, data){// 地铁站id
        ret.st = data;
    },

    meter: function(ret, data){// 附近米数
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
    },
    
    houseTypes: function(ret, data) {// 房屋类型 TODO还没维护
        ret.ht = data;
    }
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
};

