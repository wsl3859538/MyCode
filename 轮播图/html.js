/**
 * Created by Wangsl on 2017-06-21.
 */

$(window).on('load',function(){


    $('#prev').click(function(){
        slide('prev')
    })
    $('#next').click(function(){
        slide('next')
    })
    $('#buttons span').click(function(){
        clickGoto(this)
    })
    moveStart()

    $('#container').on('mouseenter',function(){
        movePause();
    })
    .on('mouseleave',function(){
        moveStart()
    })

})

var slide = (type,next) =>{
    var $active =  $('#container').find('.active');
    var $next =next ||  getNextItem($active,type);
    var direction = type == 'next' ? 'left':'right';
    $next.addClass(type);
    $next[0].offsetWidth; //很重要,强制回流
    $next.addClass(direction);
    $active.addClass(direction).one('transitionend',function(){
        $(this).removeClass(['active',direction].join(' '))
        $next.removeClass([type,direction].join(' ')).addClass('active')
    });
    $('.bA').find('.focus_span').removeClass('focus_span');
    var $Indicator = $($('.bA').children()[getActiveIndex($next)]);
    $Indicator.addClass('focus_span')
};

//获取当前图片的下标
var getActiveIndex = item =>{
    var $items = item.parent().children('.cause');
    return $items.index( item || this.active)
};

//获取当前活动图片的下一张
var getNextItem = (active,type) =>{
    var newIndex = getActiveIndex(active);
    var x = type == 'next'? 1:-1;
    var index = (newIndex+x) % $('#container').children('.cause').length;
    return $('#container').children('.cause').eq(index);
};

//点击小圆点跳转图片
var clickGoto = (item) =>{
    var $active = $('#container').find('.active')
    var $that = $(item);
    var index = getActiveIndex($active);
    var  dot_index = $that.attr('data-index');
    if(index == dot_index) return false;
    var direction = dot_index > index ? 'next':'prev';
    slide(direction,$active.parent().children().eq(dot_index))
};

//滑动and暂停
var timerIndex;
var moveStart = () =>{
    timerIndex = setInterval(function(){
        slide('next')
    },1000)
    console.log(timerIndex)
}

var movePause =() =>{
    clearInterval(timerIndex)
}

