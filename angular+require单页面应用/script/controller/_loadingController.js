define(vpCtrlList,function (app) {
    app.registerController("_loadingController", ["$scope","$state","$stateParams","cookieService",
        function ($scope,$state,$stateParams,cookieService) {
            /**
             * @Service:默认执行的方法
             */
            $scope._init = function () {
                //判断是否是同一个thirdPartyId
                cookieService.deleteCookie("bindInfo_thirdPartyId");
                cookieService.addCookie("bindInfo_thirdPartyId",$stateParams.thirdPartyId);
                cookieService.addCookie("bindInfo_mobilePhone","");
                $state.go("home");
            }();

        }]);
});
