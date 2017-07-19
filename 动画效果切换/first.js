/**
 * Created by Wangsl on 2017-07-06.
 */



$(window).on('load',function(){
    var cookie_css = getCookie('cssName')
    if(cookie_css){
        $('#css_one').remove()
        $("<link>")
            .attr({ rel: "stylesheet",
                href: cookie_css,
                id:'css_one'
            })
            .appendTo("head");
    }
    //transition
    var cssName = $('#css_one').attr('href').substring(0,$('#css_one').attr('href').length-4);
    $('.intro-first-div img').css('max-height',$('.intro-second-div').outerHeight())

    //几个div的距离屏幕的高度
    var intro_h = parseInt($('#intro').offset().top);
    var deed_h = parseInt($('#deeds').offset().top);
    var x = $(window).scrollTop()+$(window).height()
    console.log(x)
    console.log(intro_h)
    if(cssName == 'transition'){
        scrollTranistion_div($('.div-one-shadow'))
        $('.div-headed a').each(function(){
            var $a_item = $(this)
            if($a_item.attr('data-result') == 'transition'){
                $a_item.addClass('chois-a').siblings().removeClass('chois-a')
            }
        })

            x>intro_h &&  scrollTranistion_div($('#intro'))
            x>deed_h &&  scrollTranistion_div($('#deeds'))
    }else{
        var css_change = {
            'visibility': 'hidden',
            'animation-name': 'none'
        }
        $('.fadeInLeft ').css(css_change)
        $('.fadeInRight ').css(css_change)
        $('.fadeInTop ').css(css_change)
        $('.fadeInBottom ').css(css_change)
        scrollTransform_div($('.div-one-shadow'));
        $('.div-headed a').each(function(){
            var $a_item = $(this)
            if($a_item.attr('data-result') == 'transform'){
                $a_item.addClass('chois-a').siblings().removeClass('chois-a')
            }
        })
        x>intro_h &&  scrollTransform_div($('#intro'))
        x>deed_h &&  scrollTransform_div($('#deeds'))
    }


    //当窗口高度+滑动的距离等于div距离屏幕的高度时,开始加载动画效果
    $(window).scroll(function(event){
        var $that = $(this)
        var scroll = $that.scrollTop()+$(this).height()
        if(scroll>=intro_h){
            if(cssName == 'transition')scrollTranistion_div($('#intro'))
            else scrollTransform_div($('#intro'))
        }
        if(scroll>=deed_h){
            if(cssName == 'transition')scrollTranistion_div($('#deeds'))
            else scrollTransform_div($('#deeds'))
        }

    });
//
    //锚点动画效果
    $("a").click(function () {
        if(!$(this).attr("href")) return
        var $intro = $($(this).attr("href"));
        var top = $intro.offset().top
        $("body").animate({scrollTop: top+"px"}, 500);
        return false;  //不要这句会有点卡顿
    });


    //动画效果切换
    $('.div-headed a').click(function(){
        var css = $(this).attr('data-result') + '.css'
        setCookie('cssName',css);
        window.location.reload();
    })

})


//transition
var scrollTranistion_div = (item) =>{
    var $left = item.find('.move_left')
    $left.addClass('forLeft');
    $left.offsetWidth
    $left.addClass('originleft')

    var $right = item.find('.move_right')
    $right.addClass('forRight');
    $right.offsetWidth
    $right.addClass('originright')

    var $top = item.find('.move_top')
    $top.addClass('forTop')
    $top.offsetWidth
    $top.addClass('origintop')

    var $bottom = item.find('.move_bottom')
    $bottom.addClass('forBottom')
    $bottom.offsetWidth
    $bottom.addClass('originbottom')
}

//transform
var scrollTransform_div = item =>{
    var $left = item.find('.fadeInLeft');
    $left.addClass('animated').removeAttr('style');

    var $right = item.find('.fadeInRight');
    $right.addClass('animated').removeAttr('style');

    var $top = item.find('.fadeInTop');
    $top.addClass('animated').removeAttr('style');

    var $bottom = item.find('.fadeInBottom')
    $bottom.addClass('animated').removeAttr('style');
}

function setCookie(name,value)
{
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^|)"+name+"=([^;]*)(;|$)");

    console.log(document.cookie)
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//删除cookies
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
