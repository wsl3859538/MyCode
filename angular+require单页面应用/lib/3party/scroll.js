(function($){
	$.fn.myScroll = function(options){
	//默认配置
	var defaults = {
		speed:40,  //滚动速度,值越大速度越慢
		rowHeight:24 //每行的高度
	};

		//获取默认值
	var opts = $.extend({}, defaults, options),intId = []; //存放定时器
	
	function marquee(obj, step){


		obj.find("ul").css("margin-top", 10); //只是单纯添加样式margin-top样式,后面会复位,value如果为0则不需要复位
		//重点,把最前面的li拿出来,然后添加到最后面,类似于置底效果,将最前面的li放在最后
		obj.find("ul").find("li").slice(0, 1).appendTo(obj.find("ul"));
		obj.find("ul").css("margin-top", 0); //复位ul

		}

		//遍历
		this.each(function(i){
			//获取li的高度,达到高度后删除然后放在末端
			var sh = opts["rowHeight"],speed = opts["speed"],_this = $(this);
			//无限循环定时器
			intId[i] = setInterval(function(){
				//如果ul的高度小于div的高度,则重新加载定时器
				if(_this.find("ul").height()<=_this.height()){
					clearInterval(intId[i]);
				}else{
					marquee(_this, sh);
				}
			}, speed);

			_this.hover(function(){
				clearInterval(intId[i]);
			},function(){
				intId[i] = setInterval(function(){
					if(_this.find("ul").height()<=_this.height()){
						clearInterval(intId[i]);
					}else{
						marquee(_this, sh);
					}
				}, speed);
			});
		
		});

	}

})(jQuery);