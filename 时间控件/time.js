/**
 * Created by Administrator on 2017-07-18.
 */

$(window).on('load',function(){
    $('.div_month').text(new Date().getMonth()+1 + '月')
    var dateArray = getNowDate(new Date())
    $('.container li').each(function(index){
        $(this).text(dateArray[index])
        if(dateArray[index] == new Date().getDate())
            $(this).addClass('li_active')
        $(this).on('click',function(){
            $(this).addClass('li_active').siblings().removeClass('li_active')
        })
    })

    $('.d_right').click(function(){
        moveSlide('next')
    })
    $('.d_left').click(function(){
        moveSlide('prev')
    })
    totalWeek()
});


//获取当前时间礼拜数
var getWeekNum = function(date){
    var weeks = ['星期天','星期一','星期二','星期三','星期四','星期五','星期六'];
    var day_num = date.getDay();
    return weeks[day_num]
};

//获取当前时间所属周数据
var getNowDate = function(date){
    var date_array = [] ,
        front_date = [],
        back_date = [],
        day_num = date.getDay(), //周几
        date_num = date.getDate();  //当前日期

    for(var i=day_num;i>0;i--){
        front_date.push(date_num-i)
    }
    for(var j=0;j<7-day_num;j++){
        back_date.push(date_num+j)
    }
    date_array = $.merge(front_date,back_date);
    return date_array
};

//移动
var moveSlide = function(type){
    var $active = $('.div_Acitve')
    var $next = type == 'next' ? $active.next():$active.prev();
    if($next.find('li').length ==0)return
    var direction = type == 'next' ? 'left':'right';
    $next.find('li').removeClass('li_active')
    $active.addClass(direction);
    $next.addClass(type);
    $next[0].offsetWidth;
    $next.addClass(direction)
    $active.one('transitionend', function () {   //过渡效果完成后执行
            $next.removeClass([direction,type].join(' ')).addClass('div_Acitve');
            $active.removeClass([direction,'div_Acitve'].join(' '))
            $next.find('li').eq(0).addClass('li_active')
            totalWeek()
        })
};

//计算当前显示周的前一周和下一周
var totalWeek = function(){
    var $avtive = $('.div_Acitve');
    var array = [] ,
        front = [],
        after = [];
    $('.div_Acitve li').each(function(){
        array.push($(this).text())
    })
    for(var i=7;i>0;i--){
        var val = array[0]-i;
        if(val<=0)continue;
        front.push(val);
    }

    for(var j=1;j<=7;j++){
        var val = parseInt(array[array.length-1])+j;
        if(val>31)continue;
        after.push(val);
    }

    $avtive.next() && $avtive.next().remove()
    $avtive.prev() && $avtive.prev().remove()

    var html = `<div class="container">`;
    var html2 = `<div class="container">`;

    for(var x=0;x<front.length;x++){
        html += `   <li>${front[x]}</li>`
    }
    for(var x=0;x<after.length;x++){
        html2 += `   <li>${after[x]}</li>`
    }

    $('.div_Acitve').before(html+'</div>')
    $('.div_Acitve').after(html2+'</div>');

    $('.div_Acitve li').each(function(index){
        $(this).on('click',function(){
            $(this).addClass('li_active').siblings().removeClass('li_active')
        })
    })

    function getFront(){
        return front;
    }
    function getAfter(){
        return after;
    }
};



