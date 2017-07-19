/**
 * Created by Wangsl on 2017-07-11.
 */

$(window).on('load',function(){
    var $moveItem = $('.shoppingcar-goods');

    var moveStart , moveIng , moveEnd;

    $moveItem.each(function(){
        this.addEventListener('touchstart',function(e){
            moveStart = e.changedTouches[0].pageX;
        })
        this.addEventListener('touchmove',function(e){
            moveIng = moveStart - e.changedTouches[0].pageX;
            $(this).next().children().css('visibility','visible')
            var str = `translate3d(-${moveIng}px, 0px, 0px)`;
            $(this).css('transform',str);

        })
        this.addEventListener('touchend',function(e){
            moveEnd = e.changedTouches[0].pageX;
            var res = moveStart - moveEnd;
            if(res<32){
                var str = `translate3d(0px, 0px, 0px)`;
                $(this).css('transform',str);
            }else{
                var str = `translate3d(-64px, 0px, 0px)`;
                $(this).css('transform',str);
            }
        })
    })


})
