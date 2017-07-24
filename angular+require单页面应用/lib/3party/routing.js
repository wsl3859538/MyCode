'use strict'
angular.module('Routing', ['ui.router'])
    .provider('router', function ($stateProvider,$couchPotatoProvider) {

        this.$get = function ($state) {
            return {
                loadRoutes: function (url,async) {
                    var loadWay = "同步";
                    vpAjax.get({
                        url:url,
                        async: async,//true同步 或 false异步
                        success:function(collection){
                            for (var routeName in collection) {
                                var controllerUrl = collection[routeName].controllerUrl;
                                //异步
                                if (vpConfig.async) {
                                    //如果controllerUrl为字符串
                                    if(angular.isString(controllerUrl)){
                                        collection[routeName].resolve = {
                                            dummy: $couchPotatoProvider.resolveDependencies([controllerUrl])
                                        };
                                    }
                                    //如果controllerUrl为数组(多视图时为数组)
                                    else if(angular.isArray(controllerUrl)){
                                        collection[routeName].resolve = {
                                            dummy: $couchPotatoProvider.resolveDependencies(controllerUrl)
                                        };
                                    }
                                }

                                delete collection[routeName].controllerUrl;//删除controllerUrl
                                $stateProvider.state(routeName, collection[routeName]);
                            }

                            if(vpConfig.async){
                                loadWay = "异步";
                                vpCtrlList = ['app'];
                            }else{
                                loadWay = "同步";
                            }
                            vpConsole.log(url + "路由加载成功!" + "   js加载方式为:" + loadWay);
                        },
                        error:function(data){
                            if(vpConfig.async){
                                loadWay = "异步";
                                vpConsole.log(url + "路由加载是失败!" + "   js加载方式为:" + loadWay);
                            }else {
                                loadWay = "同步";
                                vpConsole.log(url + "路由加载是失败!" + "   js加载方式为:" + loadWay);
                            }
                        }
                    });

                }
            }
        };

        this.loadRoutes = function (url,async) {
            var loadWay = "同步";
            vpAjax.get({
                url:url,
                async: async,//true同步 或 false异步
                success:function(collection){
                    for (var routeName in collection) {
                        var controllerUrl = collection[routeName].controllerUrl;
                            //异步
                            if (vpConfig.async) {
                                //如果controllerUrl为字符串
                                if(angular.isString(controllerUrl)){
                                    collection[routeName].resolve = {
                                        dummy: $couchPotatoProvider.resolveDependencies([controllerUrl])
                                    };
                                }
                                //如果controllerUrl为数组(多视图时为数组)
                                else if(angular.isArray(controllerUrl)){
                                    collection[routeName].resolve = {
                                        dummy: $couchPotatoProvider.resolveDependencies(controllerUrl)
                                    };
                                }
                            }

                            delete collection[routeName].controllerUrl;//删除controllerUrl
                            $stateProvider.state(routeName, collection[routeName]);
                    }


                    if(vpConfig.async){
                        loadWay = "异步";
                        vpCtrlList = ['app'];
                    }else{
                        loadWay = "同步";
                    }
                    vpConsole.log(url + "路由加载成功!" + "   js加载方式为:" + loadWay);
                },
                error:function(data){
                    if(vpConfig.async){
                        loadWay = "异步";
                        vpConsole.log(url + "路由加载是失败!" + "   js加载方式为:" + loadWay);
                    }else {
                        loadWay = "同步";
                        vpConsole.log(url + "路由加载是失败!" + "   js加载方式为:" + loadWay);
                    }
                }
            });

        }


    })

