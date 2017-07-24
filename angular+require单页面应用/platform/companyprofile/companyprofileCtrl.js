/**
 * Created by Wangsl on 2016-12-13.
 */
define(['app'],
    function (app) {
        app.registerController(
            'companyprofileCtrl', ["$scope","$rootScope","cookieService",
                function ($scope,$rootScope,cookieService) {

                    $scope.data = {};
                    $scope.data.img = "";
                    $scope.data.height = document.documentElement.clientHeight - 100;
                    $scope.data.CMLJson = [
                        {
                            'ImageURL':'img/jt.jpg'
                        },
                        {
                            'ImageURL':'img/jt2.jpg'
                        },
                        {
                            'ImageURL':'img/jt3.jpg'
                        },
                        {
                            'ImageURL':'img/jt4.jpg'
                        },
                        {
                            'ImageURL':'img/jt5.jpg'
                        }
                    ]

                    $scope.title = vpConfig.title.jt;

                    $scope.goBack = function(){
                        goBack();
                    }

                    cookieService.addCookie('title',$scope.title);
                    console.log(getCookie('title'))  //js
                    console.log(cookieService.getCookie('title')) //angular
                }])
    });
