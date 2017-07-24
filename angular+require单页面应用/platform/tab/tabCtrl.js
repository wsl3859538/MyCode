define(['app'],
    function (app) {
        app.registerController(
            'tabCtrl', ["$scope", "$rootScope", "$ionicPopup", "$state",
                function ($scope, $rootScope, $ionicPopup, $state) {

                    console.log(222);



                    $rootScope.isActiveTab = 1;
                    $scope.goUrl = function (url,index) {
                        if(!url){
                            $rootScope.iosAlert("功能暂无!","温馨提示");
                            return
                        }
                        $state.go(url);
                        $rootScope.isActiveTab = index;
                    }

                }])
    });