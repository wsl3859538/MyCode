/**
 * Created by 董纹陶
 * Time: 2015/5/26
 * Company:宁波维涛
 * Module:vpAjax
 */
function vpAjax() {
    /**
     * 将对象转化成请求参数
     * @param obj
     * @returns {string}
     */
    this.obj2params = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    /**
     * post请求
     * @param paramObj
     * async true表示同步 false表示异步 默认为异步  (选填)
     * url 请求的url(必填)
     * data 请求的参数(必填)
     * success 成功时回调的方法(必填)
     * error 失败时回调的方法(必填)
     */
    this.post = function (paramObj) {
        var async, url, data, success, error;
        async = paramObj.hasOwnProperty('async') ? paramObj.async : true;//默认为异步
        url = paramObj.url;
        data = paramObj.data;
        success = paramObj.success;
        error = paramObj.error;

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHttp");
        xhr.open("post", url, async);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
        xhr.onreadystatechange = function () {
            //如果后台处理成功
            if (xhr.readyState == 4 && xhr.status == 200) {
                //获取图片的字节码
                success(JSON.parse(xhr.responseText));
            }
            else if (400 < xhr.status && xhr.status <= 500) {
                error(xhr.responseText);
            }
        };
        xhr.send(this.obj2params(data));
    };

    /**
     * get请求
     * @param paramObj
     * async true表示同步 false表示异步 默认为异步  (选填)
     * url 请求的url(必填)
     * data 请求的参数(必填)
     * success 成功时回调的方法(必填)
     * error 失败时回调的方法(必填)
     */
    this.get = function (paramObj) {
        var async, url, data, success, error;
        async = paramObj.hasOwnProperty('async') ? paramObj.async : true;//默认为异步
        url = paramObj.url;
        data = paramObj.data;
        success = paramObj.success;
        error = paramObj.error;

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHttp");
        url += "?" + this.obj2params(data);
        xhr.open("get", url, async);
        xhr.onreadystatechange = function () {
            //如果后台处理成功
            if (xhr.readyState == 4 && xhr.status == 200) {
                //获取图片的字节码
                success(JSON.parse(xhr.responseText));
            }
            else if (400 < xhr.status && xhr.status <= 500) {
                error(xhr.responseText);
            }
        };
        xhr.send(null);
    };
}

var vpAjax = new vpAjax();
