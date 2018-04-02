
function append(str){
    let div =  document.getElementById('console');
    let original = div.innerHTML;
    div.innerHTML =original + str + '<br/>';
}


// append('first');
// append('second');
require(['js/components/webViewBridge'],function(webViewBridge){
    try{
        webViewBridge.connectWebViewJavascriptBridge(function(bridge){
            bridge.exec("common","imei",{

            }, function(res){
                append("调用成功：" + res);
            }, function(err){
                append("调用失败：" + err);
            });
        });
        // webViewBridge.exec({
        //     service: 'common',
        //     action: 'imei',
        //     data: {                
        //     },
        //     responseCallback: function(data){
        //         append("调用成功:" + data);
        //     },
        //     errorResponseCallback: function(data){
        //         append("调用失败:" + data);
        //     }
        // });
    } catch(ex) {
        append(ex);
    }
});
