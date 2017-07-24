define(vpCtrlList, function (app) {
    app.registerController("_homeController", ["$scope", "dataService", "$rootScope", "utilService", "$ionicScrollDelegate", "$stateParams", "$ionicPopup", "cookieService", "$filter", "$interval", "weixinService", "$state", "$ionicModal", "$timeout", "yibutongService",
        function ($scope, dataService, $rootScope, utilService, $ionicScrollDelegate, $stateParams, $ionicPopup, cookieService, $filter, $interval, weixinService, $state, $ionicModal, $timeout, yibutongService) {
            /**
             * @Service:定义变量
             */

            $scope._initObject = function () {
                $scope._menuShowObject = {
                    home: {
                        show: false
                    },
                    detail: {
                        show: false
                    }
                };
                $scope._micSearch = {
                    show: false,
                    time: "",
                    msg: "点击开始说话",
                    img: ["./images/mic_curr.png", "./images/mic_xs.png", "./images/mic_sm.png", "./images/mic_md.png", "./images/mic_lg.png"],
                    imgIndex: 0
                };
                $scope._sortObject = {
                    etdSort: true,
                    feeSort: false,
                    shipSort: false
                }
                $scope._bindModel = {
                    _thirdPartyId: cookieService.getCookie("bindInfo_thirdPartyId"),
                    _mobilePhone: cookieService.getCookie("bindInfo_mobilePhone")
                }
                $scope._bindModalObject = {
                    _mobilePhone:"",
                    time:60,
                    msg:"",
                    code:"",
                    codeGuId:"",
                    state:true,
                    popup:{}
                };

                $scope.logInfoShow = {
                    _hgTime:false,
                    _zcTime:false,
                    _qdTime:false
                };

                $scope._inputHead = {
                    show : true
                }

            }();

            /**
             * @service:定义数据服务变量
             *
             */
            $scope._initDataObject = function () {
                $scope.actionModel = new dataService.DataModel();
                $scope.actionModel.modelParam.formid = "10000";
                $scope.actionModel.modelParam.tableid = "weChat-bindInfo";
                $scope.actionModel.metaData = {datasets: [
                    {tableid: "weChat-HomeHd"},
                    {tableid: "weChat-HomeItem"},
                    {tableid: "weChat-bindInfo"},
                    {tableid: "weChat-docDetail"},
                    {tableid: "weChat-ship"},
                    {tableid: "weChat-Driver"},
                    {tableid: "weChat-invoice"},
                    {tableid: "weChat-feeItem"},
                    {tableid: "weChat-SearchDocData"},
                    {tableid: "weChat-evaluate"},
                    {tableid: "weChat-docContainer"},
                    {tableid: "weChat-BlNo"},
                    {tableid: "weChat-seeFee"},
                    {tableid:"weChat-sendBl"}
                ]};
                $scope.actionModel.modelParam.dataparam = {

                }
                $scope.actionModel.initDataSets();
                $scope.homeDatas = $scope.actionModel.getTable("weChat-HomeHd")['data'];//TODO:首页所有供应商
                $scope.homeItemDatas = $scope.actionModel.getTable("weChat-HomeItem");//TODO:供应商对应的订单
                $scope.bindInfo = $scope.actionModel.getTable("weChat-bindInfo");//TODO:当前微信绑定信息
                $scope.docDetailData = $scope.actionModel.getTable("weChat-docDetail");//TODO:单据详情
                $scope.shipDatas = $scope.actionModel.getTable("weChat-ship");//TODO:单据所对应的船公司集合
                $scope.driverDatas = $scope.actionModel.getTable("weChat-Driver");//TODO:单据所对应的司机信息
                $scope.invoiceDatas = $scope.actionModel.getTable("weChat-invoice");//TODO:单据所对应的申请单信息
                $scope.feeDatas = $scope.actionModel.getTable("weChat-feeItem");//TODO:单据所对应的费用信息
                $scope.searchDocDatas = $scope.actionModel.getTable("weChat-SearchDocData")['data'];//TODO:搜索单据集合
                $scope.evaluateInfo = $scope.actionModel.getTable("weChat-evaluate");//TODO:单据评分信息
                $scope.containerDatas = $scope.actionModel.getTable("weChat-docContainer");//TODO:单据箱子信息
                $scope.blDatas = $scope.actionModel.getTable("weChat-BlNo");//TODO:单据提单信息
                $scope.seeFeeDatas = $scope.actionModel.getTable("weChat-seeFee");//TODO:单据已确认费用信息
                $scope.sendBlDatas = $scope.actionModel.getTable("weChat-sendBl");//TODO:单据寄提单信息
            }();

            /**
             * @Service:home的逻辑方法
             *
             */
            $scope._initHomeService = function () {

                $scope.showPopup = function () {
                    $scope._bindModal.show();
                };

                $scope._textPhone = function(){
                    var reg = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                    return  !reg.test($scope._bindModalObject._mobilePhone);
                }

                $scope._sendCode = function(){
                    $scope._bindModalObject.msg = "";
                  var returnOb = utilService.sendPhoneCode($scope._bindModalObject._mobilePhone);
                    if(returnOb.code == 1){
                        $scope._bindModalObject.codeGuId = returnOb.data.captchasGuid;
                        $scope._bindModalObject.state = false;
                        $scope._bindModalObject.time = 60;
                        var sendTimer = $interval(function () {
                            $scope._bindModalObject.time--;
                            if( $scope._bindModalObject.time <= 0){
                                $scope._bindModalObject.time = "更换手机";
                                $interval.cancel(sendTimer);
                            }
                        }, 1000);
                    }else{
                        $scope._bindModalObject.msg = "发送短信出错了..请重试."
                    }
                }

                $scope._bind = function(){
                    $scope._bindModalObject.msg = "";
                    var returnOb = utilService.checkPhoneCode( $scope._bindModalObject.codeGuId, $scope._bindModalObject.code,$scope._bindModalObject._mobilePhone);
                    if(returnOb.code == 1){
                        $scope.bindInfo.data[0].mobilephone = $scope._bindModalObject._mobilePhone;
                        $scope.actionModel.applyChange("weChat-bindInfo").then(
                            function (data) {
                                if (data.code != "1") {
                                    $ionicPopup.alert({
                                        title: '温馨提示',
                                        template: "sorry...绑定出错了.."
                                    });
                                    return;
                                } else {
                                    $scope._bindModal.hide();
                                    $scope._bindModel._mobilePhone = $scope._bindModalObject._mobilePhone;
                                    cookieService.addCookie("bindInfo_mobilePhone", $scope._bindModel._mobilePhone);
                                    $ionicPopup.alert({
                                        title: '温馨提示',
                                        template: "感谢.您的手机已成功绑定..欢迎使用本系统."
                                    });
                                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                                    _actionModel.tableid = "weChat-HomeHd,weChat-ship";
                                    _actionModel.dataparam = {mobilephone: $scope._bindModel._mobilePhone};
                                    utilService._getData($scope.actionModel, _actionModel, $scope._initHomeData, "sorry..获取单据信息出错了..");
                                }
                            },
                            function () {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: "sorry...绑定出错了.."
                                });
                            }
                        );
                    }else{
                        $scope._bindModalObject.msg = "验证码错误.";
                    }
                }


                $scope._getYbt = function () {
                    $scope._menuShowObject.detail.show = false;
                    $scope._orderDetailModal.hide();
                    $state.go('ybtHtml');
                };

                $scope.doRefresh = function () {
                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                    _actionModel.tableid = "weChat-HomeHd,weChat-ship";
                    _actionModel.dataparam = {mobilephone: $scope._bindModel._mobilePhone};
                    utilService._getData($scope.actionModel, _actionModel, $scope._initHomeData, "sorry..获取单据信息出错了..");
                };

                $scope._homeScrollToTop = function () {
                    $ionicScrollDelegate.$getByHandle('_homeScroll').scrollTop();
                };

                $scope._scrollTo = function (id) {
                    var scroll = document.getElementById(id).offsetTop - $ionicScrollDelegate.getScrollPosition().top;
                    $ionicScrollDelegate.resize();
                    $ionicScrollDelegate.scrollBy(0, scroll, true);
                };

                $scope._initHomeData = function () {
                    for (var i = 0, item; item = $scope.homeDatas[i++];) {
                        item.docShow = false;
                        item.docList = [];
                    }
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        item.isSelect = false;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                }

                $scope._toggleSort_ETD = function () {
                    $scope._sortObject.etdSort = !$scope._sortObject.etdSort;
                    $scope._setSort_ETD();
                }

                $scope._setSort_ETD = function (obj) {
                    if (!angular.isUndefined(obj)) {
                        obj.docList = angular.copy($scope.homeItemDatas.data);
                    }
                    for (var i = 0, item; item = $scope.homeDatas[i++];) {
                        item.shaiCount = 0;
                        if($scope._sortObject.etdSort){
                            item.docList.sort(function(a,b){
                                return Date.parse(b.etddate)-Date.parse(a.etddate);
                            })
                        }else{
                            item.docList.sort(function(a,b){
                                return Date.parse(a.etddate)-Date.parse(b.etddate);
                            })
                        }
                        for (var j = 0, docItem; docItem = item.docList[j++];) {
                            if ($scope._sortObject.feeSort) {
                                docItem.show = (docItem.feecount > 0 && $scope._setSort_Ship(docItem));
                            } else {
                                docItem.show = $scope._setSort_Ship(docItem);
                            }
                            if(docItem.show){
                                item.shaiCount++;
                            }
                        }
                    }

                }

                $scope._setSort_Ship = function (obj) {
                    if (!$scope._shipIsCheck()) {
                        return  true;
                    }
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        if (item.isSelect && obj.shipcompanyname == item.shipcompanyname) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope._showRecordDiv = function (state) {
                    $scope._initRecord(state);
                }

                $scope._toggleRecord = function () {
                    if ($scope._micSearch.msg == "点击开始说话") {
                        $scope._startRecord();
                    } else {
                        $scope._stopRecord(false);
                    }
                }

                $scope._startRecord = function () {
                    weixinService.startRecord();
                    $scope._micSearch.timer = $interval(function () {
                        if ($scope._micSearch.time.length == 6) {
                            $scope._micSearch.time = "";
                        }
                        if (($scope._micSearch.imgIndex + 1) == $scope._micSearch.img.length) {
                            $scope._micSearch.imgIndex = 0;
                        }
                        $scope._micSearch.time += ".";
                        $scope._micSearch.imgIndex++;
                    }, 300);
                    $scope._micSearch.msg = "点击结束说话.立即开始查询.";
                }

                $scope._stopRecord = function (state) {
                    $interval.cancel($scope._micSearch.timer);
                    $scope._initRecord(state);
                    weixinService.stopRecord().then(function (data) {
                        weixinService.translateVoice(data.localId).then(function (value) {
                            $scope._goSearchDoc(value.split("。")[0])
                        });
                    });
                }

                $scope._initRecord = function (state) {
                    $scope._micSearch = {
                        show: state,
                        time: "",
                        msg: "点击开始说话",
                        img: ["./images/mic_curr.png", "./images/mic_xs.png", "./images/mic_sm.png", "./images/mic_md.png", "./images/mic_lg.png"],
                        imgIndex: 0
                    };
                }


                $scope._initCheckBindInfo = function () {
                    if ($scope.bindInfo.data.length > 0 && !utilService.isEmpty($scope.bindInfo.data[0].mobilephone)) {
                        $scope._bindModel._mobilePhone = $scope.bindInfo.data[0].mobilephone;
                        cookieService.addCookie("bindInfo_mobilePhone", $scope._bindModel._mobilePhone);
                        var _actionModel = angular.copy($scope.actionModel.modelParam);
                        _actionModel.tableid = "weChat-HomeHd,weChat-ship";
                        _actionModel.dataparam = {mobilephone: $scope._bindModel._mobilePhone};
                        utilService._getData($scope.actionModel, _actionModel, $scope._initHomeData, "sorry..获取单据信息出错了..");
                    } else {
                        $timeout(function(){
                            $scope.showPopup();
                        },250);
                    }
                }

                $scope._setMenuShow = function (ob) {
                    ob.show = !ob.show;
                }

                $scope._toggleCompanyDocShow = function (item) {
                    if (!item.docShow) {
                        var _actionModel = angular.copy($scope.actionModel.modelParam);
                        _actionModel.tableid = "weChat-HomeItem";
                        _actionModel.dataparam = {mobilephone: $scope._bindModel._mobilePhone, companyguid: item.companyguid};
                        utilService._getData($scope.actionModel, _actionModel, $scope._setSort_ETD, "sorry..获取单据信息出错了..", item);
                    } else {
                        item.docList = [];
                    }
                    item.docShow = !item.docShow;
                }

                $scope._sumDocCount = function () {
                    var sum = 0;
                    for (var i = 0, item; item = $scope.homeDatas[i++];) {
                        sum += item.count;
                    }
                    return sum;
                }

                $scope._shipIsCheck = function () {
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        if (item.isSelect) {
                            return true;
                        }
                    }
                    return false;
                }

                $scope._goDetail = function (item, divId) {
                    $scope._time = {
                        loadingShow : true,
                        depend_actual_time: '正在获取.',
                        depend_plan_time: '正在获取.'
                    }
                    $scope._scrollToTop();
                    $scope._goDetailData(item.doccode, divId);
                    var lc = {
                        vessel_uncode: "",
                        voyage: "",
                        direction: "E",
                        bl_no: item.blcode,
                        status: ["00"]
                    }
                    yibutongService.callService("QueryLogisticsStatus", lc).then(
                        function (data) {
                            var result = angular.fromJson(data.interfaceResult)
                            lc = {
                                arrival_port: "CNNGB",
                                vessel_ename: result.vessel_ename,
                                vessel_uncode: "",
                                voyage_in: "",
                                voyage_out: result.voyage,
                                depend_plan_time_start: "",
                                depend_plan_time_end: ""
                            }
                            yibutongService.callService("QueryVoyageInfo", lc).then(
                                function (info) {
                                    result = angular.fromJson(info.interfaceResult);
                                    if(result.length > 0 ){
                                        $scope._time.depend_actual_time = $scope._setTime(result[0].depend_actual_time);
                                        $scope._time.depend_plan_time = $scope._setTime(result[0].depend_plan_time);
                                    }else{
                                        $scope._time.depend_actual_time ="无信息";
                                        $scope._time.depend_plan_time = "无信息";
                                    }
                                    $scope._time.loadingShow = false;
                                },
                                function () {

                                }
                            );
                        },
                        function () {

                        }
                    );
                    $scope.logInfoShow = {
                        _hgTime:false,
                        _zcTime:false,
                        _qdTime:false
                    };
                    $scope._searchDocModal.hide();
                    $scope._orderDetailModal.show();
                }

                $scope._goSearchDoc = function (doc) {
                    $scope._searchDocModal.show();
                    if (!utilService.isEmpty(doc)) {
                        $scope._searchDocData(doc);
                    }
                    $timeout(function () {
                        document.getElementById("_searchDocValue").focus();
                    }, 300);

                }

                $scope._goScreen = function (item) {
                    $scope._screenModal.show();
                }

                $scope._closeModal = function (modal) {
                    modal.hide();
                }

                $scope._htmlIsEmpty = function (data) {
                    return utilService.isEmpty(data);
                };

                $scope._setTime = function (str) {
                    var reg = /(.{4})(.*)/;
                    str = str.replace(reg, "$1-$2");
                    reg = /(.{7})(.*)/;
                    str = str.replace(reg, "$1-$2");
                    reg = /(.{10})(.*)/;
                    str = str.replace(reg, "$1 $2");
                    reg = /(.{13})(.*)/;
                    str = str.replace(reg, "$1:$2");
                    reg = /(.{16})(.*)/;
                    str = str.replace(reg, "$1:$2");
                    return str;
                }
            }();

            /**
             * @Service:定义搜索弹窗逻辑方法
             */
            $scope._initSearchService = function () {
                $scope._searchDocData = function (code) {
                    $scope._searchCode = code;
                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                    _actionModel.tableid = "weChat-SearchDocData";
                    _actionModel.dataparam = {code: code,mobilephone: $scope._bindModel._mobilePhone};
                    utilService._getData($scope.actionModel, _actionModel, $scope._searchDocDataCallBack, "sorry..获取单据信息出错了..");
                }
            }();

            /**
             * @Service:定义详情弹窗逻辑方法
             */
            $scope._initDetailService = function () {
                $scope._menuEvent = function () {
                    for (var i = 0, item; item = vpConfig.modalList[i++];) {
                        if (item.modal["_isShown"]) {
                            item.modal.hide();
                        }
                    }
                }

                $scope._goDetailData = function (docCode, divId) {
                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                    _actionModel.tableid = "weChat-docDetail,weChat-Driver,weChat-invoice,weChat-feeItem,weChat-evaluate,weChat-docContainer,weChat-BlNo,weChat-seeFee,weChat-sendBl";
                    _actionModel.dataparam = {docCode: docCode};
                    utilService._getData($scope.actionModel, _actionModel, $scope._initDetailData, "sorry..获取单据信息出错了..", divId);
                }

                $scope._initDetailData = function (divId) {
                    if ($scope.docDetailData.data.length <= 0) {
                        $ionicPopup.alert({
                            title: '温馨提示',
                            template: "未找到该单据对应的信息."
                        })
                        return;
                    }
                    if ($scope.evaluateInfo.data.length <= 0) {
                        $scope.evaluateInfo.add($scope.setAddEvaluateObject($scope.docDetailData.data[0]));
                    }
                    if(utilService.isEmpty($scope.docDetailData.data[0].notesdate)){
                        $scope.docDetailData.data[0].notesdate =  "无信息";
                    }

                    for(var i= 0,item;item= $scope.blDatas.data[i++];){
                        if(utilService.isEmpty(item.timeofissue)){
                            item.timeofissue = "无信息";
                        }
                    }
                    $scope.docDetailData.data[0].title = utilService.isEmpty($scope.docDetailData.data[0].businesscode) ? $scope.docDetailData.data[0].blcode : $scope.docDetailData.data[0].businesscode;
                    $scope.docDetailData.data[0].containerinfojson = angular.fromJson($scope.docDetailData.data[0].containerinfojson);
                    $scope.docDetailData.data[0].container = $scope.docDetailData.data[0].containerinfojson[0].basedigit + "*" + $scope.docDetailData.data[0].containerinfojson[0].containercode;
                    if ($scope.docDetailData.data[0].containerinfojson.length > 1) {
                        for (var i = 1, item; item = $scope.docDetailData.data[0].containerinfojson[i++];) {
                            $scope.docDetailData.data[0].container += ";" + item.basedigit + "*" + item.containercode
                        }
                    }
                    for (var i = 0, item; item = $scope.invoiceDatas.data[i++];) {
                        item.show = true;
                        item.fees = [];
                        item.totalMoneyRmb = 0;
                        item.totalMoneyUsd = 0;
                        var container;
                        for (var j = 0, feeItem; feeItem = $scope.feeDatas.data[j++];) {
                            if (item.doccode == feeItem.invoiceapplycode) {
                                container = angular.fromJson(feeItem.containerjson)
                                if (container.length > 0) {
                                    for (var k = 0, containerItem; containerItem = container[k++];) {
                                        if (containerItem.digit > 0) {
                                            item.fees.push({
                                                feeType: feeItem.feetype,
                                                container: $scope._setCurrencySymbol(feeItem.currency) + containerItem.price + ", " + containerItem.digit + "*" + containerItem.container,
                                                sum: $scope._setCurrencySymbol(feeItem.currency) + (parseFloat(containerItem.price) * parseInt(containerItem.digit))
                                            });
                                        }
                                    }
                                } else {
                                    item.fees.push({
                                        feeType: feeItem.feetype,
                                        container: $scope._setCurrencySymbol(feeItem.currency) + feeItem.price + ", " + feeItem.digit,
                                        sum: $scope._setCurrencySymbol(feeItem.currency) + feeItem.totalmoney
                                    });
                                }
                                if (feeItem.currency == 'RMB') {
                                    item.totalMoneyRmb += parseFloat(feeItem.totalmoney);
                                } else {
                                    item.totalMoneyUsd += parseFloat(feeItem.totalmoney);
                                }
                            }
                        }
                    }
                    $scope.setSeeFeeData();
                    if (!utilService.isEmpty(divId)) {
                        $timeout(function () {
                            $scope._scrollTo(divId);
                        }, 260);
                    }
                    $scope.getLogisticsInfo( $scope.containerDatas.data);
                };

                $scope.getLogisticsInfo = function(containers){
                    for(var i= 0,item;item=$scope.containerDatas.data[i++];){
                        if(utilService.isEmpty(item.containerid)){
                            item.customsreleaseTime = "无信息";
                            item.realshipmentDate = "无信息";
                        }else{
                            var ob = item;
                            yibutongService.capture(item.containerid).then(
                                function (data) {
                                    console.log(data);
                                    yibutongService.requestUrl(data).then(
                                        function (info) {
                                            ob.customsreleaseTime =  utilService.isEmpty(info.customsreleaseTime)?"无信息":info.customsreleaseTime;
                                            ob.realshipmentDate = (utilService.isEmpty(info.realshipmentDate)||info.realshipmentDate.length != 19)?"无信息":info.realshipmentDate;
                                            console.log(info);
                                        },
                                        function () {

                                        }
                                    );
                                },
                                function () {

                                }
                            );
                        }
                    }
                }

                $scope.setSeeFeeData = function(){
                    $scope.seeFeeObject = {fees:[],totalMoneyRmb:0,totalMoneyUsd:0};
                    for (var j = 0, feeItem; feeItem = $scope.seeFeeDatas.data[j++];) {
                        container = angular.fromJson(feeItem.containerjson)
                        if (container.length > 0) {
                            for (var k = 0, containerItem; containerItem = container[k++];) {
                                if (containerItem.digit > 0) {
                                    $scope.seeFeeObject.fees.push({
                                        feeType: feeItem.feetype,
                                        container: $scope._setCurrencySymbol(feeItem.currency) + containerItem.price + ", " + containerItem.digit + "*" + containerItem.container,
                                        sum: $scope._setCurrencySymbol(feeItem.currency) + (parseFloat(containerItem.price) * parseInt(containerItem.digit))
                                    });
                                }
                            }
                        } else {
                            $scope.seeFeeObject.fees.push({
                                feeType: feeItem.feetype,
                                container: $scope._setCurrencySymbol(feeItem.currency) + feeItem.price + ", " + feeItem.digit,
                                sum: $scope._setCurrencySymbol(feeItem.currency) + feeItem.totalmoney
                            });
                        }
                        if (feeItem.currency == 'RMB') {
                            $scope.seeFeeObject.totalMoneyRmb += parseFloat(feeItem.totalmoney);
                        } else {
                            $scope.seeFeeObject.totalMoneyUsd += parseFloat(feeItem.totalmoney);
                        }
                    }
                }

                $scope._setCurrencySymbol = function (currency) {
                    if (currency == 'RMB') {
                        return "￥";
                    }
                    if (currency == 'USD') {
                        return "$";
                    }
                };

                $scope.setAddEvaluateObject = function (item) {
                    return {
                        workdoccode: item.doccode,
                        memo:'',
                        entguid: item.companyguid,
                        bookinguserguid: item.bookingguid,
                        bookingscore: 0,
                        docsuserguid: item.docsguid,
                        docsscore: 0,
                        serviceuserguid: item.serviceguid,
                        servicescore: 0,
                        salesuserguid: item.salesguid,
                        salesscore: 0
                    }
                }


                $scope._saveEvaluate = function () {
                    $scope.actionModel.applyChange("weChat-evaluate").then(
                        function (data) {
                            if (data.code != "1") {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: "sorry...提交出错了.."
                                });
                                return;
                            } else {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: "感谢您的评分..我们将继续努力."
                                });
                            }
                        },
                        function () {
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: "sorry...提交出错了.."
                            });
                        }
                    );
                };

                $scope._saveBack = function (obj) {
                    obj.customerfeedback = obj.backText;
                    $scope.actionModel.applyChange("weChat-invoice").then(
                        function (data) {
                            if (data.code != "1") {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: "sorry...提交出错了.."
                                });
                                return;
                            } else {
                                $ionicPopup.alert({
                                    title: '温馨提示',
                                    template: "感谢.您的反馈信息已成功提交.."
                                });
                            }
                        },
                        function () {
                            $ionicPopup.alert({
                                title: '温馨提示',
                                template: "sorry...提交出错了.."
                            });
                        }
                    );
                };

                $scope._save = function (obj) {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '费用确认',
                        template: '是否已核对上述费用?无异议请继续点击确认.',
                        cancelText: '点错了',
                        okText: '确认'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            obj.docstatus = 110;
                            obj.customerfeedback = obj.backText;
                            for (var i = 0, item; item = $scope.feeDatas.data[i++];) {
                                if (obj.doccode == item.invoiceapplycode) {
                                    item.docstatus = 110;
                                }
                            }
                            $scope.actionModel.applyChange("weChat-invoice,weChat-feeItem").then(
                                function (data) {
                                    if (data.code != "1") {
                                        $ionicPopup.alert({
                                            title: '温馨提示',
                                            template: "sorry...确认费用出错了.."
                                        });
                                        return;
                                    } else {
                                        obj.show = false;
                                        $ionicPopup.alert({
                                            title: '温馨提示',
                                            template: "感谢您.此笔费用已确认成功.."
                                        });
                                        for (var i = 0, item; item = $scope.feeDatas.data[i++];) {
                                            if (obj.doccode == item.invoiceapplycode) {
                                                item.docstatus = 110;
                                                $scope.seeFeeDatas.data.push(item);
                                            }
                                        }
                                        $scope.setSeeFeeData();
                                        for(var i= 0,item;item=$scope.homeDatas[i++];){
                                            for(var j= 0,info;info=item.docList[j++];){
                                                if(info.doccode == obj.workdoccode){
                                                    info.feecount--;
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                },
                                function () {
                                    $ionicPopup.alert({
                                        title: '温馨提示',
                                        template: "sorry...确认费用出错了.."
                                    });
                                }
                            );
                        }
                    });

                };

                $scope._inputHeadShow = function(state){
                    $scope._inputHead.show = state;
                }

                $scope._goExpressHtml = function(ob){
                    if(!utilService.isEmpty(ob.courierdoccode) && !utilService.isEmpty(ob.expresscompany) ){
                        $scope._expressModal.show();
                        $scope.express = {
                            blCode:ob.blcode,
                            src:encodeURI("http://m.kuaidi100.com/index_all.html?type="+ob.expresscompany+"&postid="+ob.courierdoccode)
                        }
                        document.getElementById("_express").innerHTML = "<iframe src='"+$scope.express.src +"' width='100%' height='100%' scrolling='auto' style='position: absolute; top: -16px;'></iframe>";
                    }
                }

                $scope._scrollToTop = function () {
                    $ionicScrollDelegate.$getByHandle('_topScroll').scrollTop();
                };

                $scope._scrollTo = function (id) {
                    var scroll = document.getElementById(id).offsetTop - $ionicScrollDelegate.$getByHandle('_topScroll').getScrollPosition().top;
                    $ionicScrollDelegate.resize();
                    $ionicScrollDelegate.scrollBy(0, scroll, true);
                };

            }();

            /**
             * @Service:定义筛选弹窗逻辑方法
             */
            $scope._initScreenService = function () {
                $scope._setCheckShip = function (item) {
                    item.isHtmlSelect = !item.isHtmlSelect;
                }

                $scope._setShipCheckAll = function (item) {
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        item.isHtmlSelect = !$scope.shipIsCheckAll;
                    }
                }

                $scope._screenShip = function (item) {
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        item.isSelect = item.isHtmlSelect;
                    }
                    $scope._setSort_ETD();
                    $scope._screenModal.hide();
                }

                $scope._escScreenShip = function (item) {
                    for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                        item.isHtmlSelect = item.isSelect;
                    }
                }

                /**
                 * @Service:监听船公司筛选条件
                 */
                $scope.$watch("shipDatas.data",
                    function () {
                        for (var i = 0, item; item = $scope.shipDatas.data[i++];) {
                            if (!item.isHtmlSelect) {
                                $scope.shipIsCheckAll = false;
                                return;
                            }
                        }
                        $scope.shipIsCheckAll = true;
                    },
                    true
                );
            }();

            /**
             * @Service:定义摸态窗口
             */
            $scope._initModal = function () {
                $ionicModal.fromTemplateUrl('templates/_formalTemplates/_bindPhone.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope._bindModal = modal;
                    setModalHierarchy({id:"bind","modal": $scope._bindModal, "hierarchy": 0});
                });

                $ionicModal.fromTemplateUrl('templates/_formalTemplates/_orderDetail.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function (modal) {
                    $scope._orderDetailModal = modal;
                    setModalHierarchy({"modal": $scope._orderDetailModal, "hierarchy": 2});
                });

                $ionicModal.fromTemplateUrl('templates/_formalTemplates/_searchDoc.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function (modal) {
                    $scope._searchDocModal = modal;
                    setModalHierarchy({"modal": $scope._searchDocModal, "hierarchy": 1});
                });

                $ionicModal.fromTemplateUrl('templates/_formalTemplates/_screen.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope._screenModal = modal;
                    setModalHierarchy({"modal": $scope._screenModal, "hierarchy": 3, "callBack": $scope._escScreenShip});
                });

                $ionicModal.fromTemplateUrl('templates/_formalTemplates/express.html', {
                    scope: $scope,
                    animation: 'slide-in-left'
                }).then(function (modal) {
                    $scope._expressModal = modal;
                    setModalHierarchy({"modal": $scope._expressModal, "hierarchy": 4});
                });

            }();


            /**
             * @Service:默认执行的方法
             */
            $scope._init = function () {
                _showHome();
                if (utilService.isEmpty($scope._bindModel._mobilePhone)) {
                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                    _actionModel.tableid = "weChat-bindInfo";
                    _actionModel.dataparam = {thirdpartyid: $scope._bindModel._thirdPartyId};
                    utilService._getData($scope.actionModel, _actionModel, $scope._initCheckBindInfo, "sorry..获取单据信息出错了..");
                } else {
                    var _actionModel = angular.copy($scope.actionModel.modelParam);
                    _actionModel.tableid = "weChat-HomeHd,weChat-ship";
                    _actionModel.dataparam = {mobilephone: $scope._bindModel._mobilePhone};
                    utilService._getData($scope.actionModel, _actionModel, $scope._initHomeData, "sorry..获取单据信息出错了..");
                }
            }();


        }]);
});
