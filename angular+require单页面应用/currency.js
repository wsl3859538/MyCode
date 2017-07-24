
/**
 * cookie服务  1是js引用 2是angular工厂服务引用  companyprofile.js
 */
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param time 单位为天 默认为1天
     */
    define(['app'],function(app){

        app.run(function ($ionicPlatform, $rootScope, $ionicPopup) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }

            });

            $rootScope.iosAlert = function (template, title, func, okText) {
                return $ionicPopup.alert({
                    title: title || "温馨提示",
                    cssClass: 'ios-alert',
                    template: template || "请检查内容",
                    okText: okText || '确定',
                    okType: 'ios-alert-btn'
                }).then(function () {
                    if (func) func();
                });
            }
            $rootScope.iosConfirm = function (template, title, func, okText, cancleText, funFalse) {
                return $ionicPopup.confirm({
                    title: title || "温馨提示",
                    cssClass: 'ios-alert',
                    template: template || "请检查内容",
                    okText: okText || '确定',
                    okType: 'ios-alert-btn',
                    cancelText: cancleText || '取消',
                    cancelType: 'ios-confirm-btn_Cancle'
                }).then(function (res) {
                    if (res && func) func();
                    if (!res && funFalse)funFalse();
                });
            }
        })
        app.registerFactory('cookieService', function () {
            function addCookie(name, value, time) {
                var Days = "";
                if (null == time || undefined == time || time == "") {
                    Days = 1;
                } else {
                    Days = time;
                }
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString();
            }

            /**
             * 获取cookie
             * @param name
             * @returns {*}
             */
            function getCookie(name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg))
                    return decodeURI(arr[2]);
                else
                    return null;
            }

            /**
             * 删除cookie
             * @param name
             */
            function deleteCookie(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = getCookie(name);
                if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
            var goBack = function(){
                window.history.go(-1)
            }

            return {
                 addCookie,
                 getCookie,
                 deleteCookie
            }
        })

    })

function addCookie(name, value, time) {
    var Days = "";
    if (null == time || undefined == time || time == "") {
        Days = 1;
    } else {
        Days = time;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString();
}

/**
 * 获取cookie
 * @param name
 * @returns {*}
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}

/**
 * 删除cookie
 * @param name
 */
function deleteCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}






