/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1. 项目名称：悟空找房h5
 2. 页面名称：rent/detail(租房-详情)
 3. 作者：tangxuyang@lifang.com
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
class DetailController extends Controller {
    constructor() {
        super(); 
        
        /*
            使用requirejs引入组件
        */
        require(['../components/test.min'],function(test){
            console.log(test);
        });
    };   
}

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
类的初始化
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function() {
    new DetailController(Controller);
});
