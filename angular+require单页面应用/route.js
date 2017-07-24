define(['app'],function(){
    return {
        "tab":{
            "url": "/tab",
            "cache":true,
            "templateUrl": "platform/tab/tab.html",
            "controller": "tabCtrl",
            "controllerUrl": "platform/tab/tabCtrl",
            "memo": "左部菜单栏"
        },
        "tab.index":{
            "url": "/index",
            "templateUrl": "platform/index/index.html",
            "controller": "indexCtrl",
            "controllerUrl": "platform/index/indexCtrl",
            "memo": "主页"
        },
        "tab.companyprofile":{
            "url": "/companyprofile",
            "templateUrl": "platform/companyprofile/companyprofile.html",
            "controller": "companyprofileCtrl",
            "controllerUrl": "platform/companyprofile/companyprofileCtrl",
            "memo": "企业简介"
        },
        "tab.oneperiod":{
            "url": "/oneperiod",
            "templateUrl": "platform/oneperiod/oneperiod.html",
            "controller": "oneperiodCtrl",
            "controllerUrl": "platform/oneperiod/oneperiodCtrl",
            "memo": "一期"
        }

    }
})
