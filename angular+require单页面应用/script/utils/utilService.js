/**
 * @service:工具js
 * Created by wangjb
 */
define(['app'], function (app) {
    app.registerFactory('utilService', ["$q", "$ionicLoading","$ionicPopup",
        function ($q, $ionicLoading,$ionicPopup) {
            function isEmpty(obj) {
                if (null == obj || angular.isUndefined(obj) || "" == obj) {
                    return true;
                } else {
                    return false;
                }
            }

            function _loadingShow() {
                $ionicLoading.show({
                    template: ' <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
                    showBackdrop:false
                });
            }

            function _loadingHide() {
                $ionicLoading.hide();
            }
            /**
             * @Service:取数失败回调处理
             * @Param:
             *          error:调用方传入的回调参数
             *          data:服务端返回的错误对象
             */
            function _getDataError(error, data) {
                if ("function" == typeof error)
                    error(data);
                if ("string" == typeof error)
                    $ionicPopup.alert({
                        title: '温馨提示',
                        template: error
                    })
                if ("undefined" == typeof error)
                    $ionicPopup.alert({
                        title: '温馨提示',
                        template: vpConfig.getDataErrorMsg
                    })
            };

            function sendPhoneCode(mobilephone, validSecond) {
                var returnData = {};
                vpAjax.post({
                    type: "post",
                    async: false,
                    url: vpConfig.dataServiceUrl + "/sso/sendCheckCodeBySms.action",
                    data: {
                        message: angular.toJson({
                            messageContent: {
                                companyId: vpConfig.smsData.smsCompanyid,
                                validSecond: angular.isUndefined(validSecond) ? 120 : validSecond,
                                mobilephone: mobilephone,
                                smsContentId: vpConfig.smsData.smsContentId
                            }
                        })
                    },
                    success: function (data, textStatus) {
                        data = angular.fromJson(data);
                        returnData = data.returnResult
                    },
                    error: function (data, textStatus) {
                        returnData = {code: 0, message: "连接服务器出错.请重试"};
                    }
                });
                return returnData;
            };

            function checkPhoneCode(captchasGuid, captchas, phone) {
                var messageContent = {
                    captchasGuid: captchasGuid,
                    captchas: captchas,
                    captchasFun: phone
                };
                var params = {
                    messageContent: messageContent
                };

                var returnData = {};;
                vpAjax.post({
                    type: "post",
                    async: false,
                    url: vpConfig.dataServiceUrl + "/sso/checkCode.action",
                    data: {
                        message: angular.toJson(params)
                    },
                    success: function (data, textStatus) {
                        data = angular.fromJson(data);
                        returnData = data.returnResult;
                    },
                    error: function (data, textStatus) {
                        returnData = {code: 0, message: "连接服务器出错.请重试"};
                    }
                });
                return returnData;
            };

            return {
                isEmpty: isEmpty,
                isEmptyKeys: function (obj, keys) {
                    for (var i = 0, item; item = keys[i++];) {
                        if (null == obj[item] || angular.isUndefined(obj[item]) || "" == obj[item]) {
                            return true;
                        }
                    }
                    return false;
                },
                _getData: function (dataModel, param, success,error,successParam) {
                    _loadingShow();
                    dataModel.getData(param).then(function (data) {
                        _loadingHide();
                        angular.isUndefined(success) ? console.log(data) : success(successParam);
                    }, function (data) {
                        _loadingHide();
                        console.log(data);
                        _getDataError(error, data);
                    });
                },
                _loadingShow: _loadingShow,
                _loadingHide: _loadingHide,
                sendPhoneCode:sendPhoneCode,
                checkPhoneCode:checkPhoneCode
            }
        }
    ]);
});