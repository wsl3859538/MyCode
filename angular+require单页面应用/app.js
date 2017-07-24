define(
    ['route'],
    function (route) {
        console.log(route)
        var routetemp=route;
        var app = angular.module('app', ['scs.couch-potato', 'ionic']);
        console.log(app)
        couchPotato.configureApp(app);
        //懒加载设置
        app.run(["$couchPotato", function ($couchPotato) {
            app.lazy = $couchPotato;

        }]);





        //处理指令模板跨域加载
        app.config( ['$sceDelegateProvider', '$stateProvider', '$urlRouterProvider', '$couchPotatoProvider', function ( $sceDelegateProvider, $stateProvider, $urlRouterProvider, $couchPotatoProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                "" + '/**']);

            //路由设置
            for (var state in route) {
                route[state].resolve = {
                    dummy: $couchPotatoProvider.resolveDependencies([ route[state].controllerUrl])
                };
                delete route[state].controllerUrl;//删除controllerUrl
                $stateProvider.state(state, route[state]);
                console.log(state)
                console.log(route[state]);
            }

//            $urlRouterProvider.otherwise('/loading/ouYVowOl7heyhhZfozw_V-dA1qhA');
            $urlRouterProvider.otherwise('/tab/index');
        }]);
        return app;
    }
);
