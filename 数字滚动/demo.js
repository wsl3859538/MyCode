/**
 * Created by Wangsl on 2017-07-14.
 */


$(window).on('load',function(){
    var obj = new numScroll('#container','18650807849')
    obj.animation();
});

var numScroll = function(element,num){
    this.$element = $(element);
    this.num = num;
    this.numArray = [];
    this.lable_height = null;
}

numScroll.prototype.setNum  = function(){
    this.numArray = this.num.split('')
    return this.numArray
};

numScroll.prototype.setHtml = function(){

    var html = `<div class="main_Num" data-num="{{num}}">
            <li>0</li>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
            <li>6</li>
            <li>7</li>
            <li>8</li>
            <li>9</li>
            <li>.</li>
        </div>`
    var array = this.setNum();
    var length = array.length;
    for(var i=0;i<length;i++){
        var addHtml =  html.replace('{{num}}',array[i])
        this.$element.append(addHtml)
    }
    this.lable_height = $('.main_Num li').height()
    this.lable_height && this.$element.css('height',this.lable_height)
    return this;
};

numScroll.prototype.animation = function(){
    this.setHtml();
    var height = this.lable_height
    this.$element.find('.main_Num').each(function(){
        var $that = $(this)
        var num = $that.attr('data-num');
        var move = -(num) * height;
        var css_change = {
            'transition':'top 2s ease-in-out',
            'top':move
        }
        $that.css(css_change);
    })
    console.log(this.lable_height)
};