

//引入js
//例如config中的vpConfig的全局变量,app中的路由
//currency的goBack和cookie方法
require(['app','config','currency'], function (app) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [app['name'], function () {
            angular.element(document).find('html').addClass('ng-app');
        }]);
    });
});


