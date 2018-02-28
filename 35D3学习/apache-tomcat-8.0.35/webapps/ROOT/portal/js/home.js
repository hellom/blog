$(function(){
	//首页js------------------
		//banner轮播效果
		var mySwiper = new Swiper ('.swiper-container', {
		    loop: true,
		    autoplay: 4000,//可选选项，自动滑动
		    pagination : '.swiper-pagination',
		    paginationClickable :true,
		    prevButton:'.swiper-button-prev',
			nextButton:'.swiper-button-next',
	  	})

	  	//动态加载说明

	  	var textList = ['“优云Mobile支持多租户，将我们为合作伙伴运营的几十款移动APP集中监控，实现了统一的用户体验分析，让我们和合作伙伴都可以直观了解APP的体验性能、异常卡顿、行为特点等，经过运维和开发的联合改进，上线的APP的平均崩溃率下降到9‰以下”','“优云的产品能及时准确的定位到APP发生崩溃的原因，帮助开发人员进行故障分析和定位，节约了很多的人工运维成本”','“优云的运维产品是目前行业内最全面的，从监控到应用体验到自动化交付，优云的产品走在了行业的前沿，能提供整套的运维解决方案，是我们一直以来的合作伙伴”'];


	  	var index = 0;
	  	var autoScroll = setInterval(changeText,2000);
	  	var imgUrl = '';
	  	function changeText(){
	  		imgUrl = 'images/say-'+(index+1)+'.png';
	  		$('.go .info').css('background-image',"url("+imgUrl+")");
	  		$('.go .info p').text(textList[index]);
	  		$('.go ul li p').eq(index).css('color','#30ace0').parent('li').siblings().children('p').css('color','#717171');
	  		$('.go ul li').eq(index).css('marginTop','-20px').siblings().css('marginTop','0');
	  		index == 2 ? index=0 : index++;
	  	}

	  	$('.go ul li').each(function(i){
	  		$(this).hover(function(){
	  			clearInterval(autoScroll);
	  			imgUrl = 'images/say-'+(i+1)+'.png';
	  			$('.go .info').css('background-image',"url("+imgUrl+")");
	  			$('.go .info p').text(textList[i]);
	  			$('.go ul li p').eq(i).css('color','#30ace0').parent('li').siblings().children('p').css('color','#717171');
	  			$('.go ul li').eq(i).css('marginTop','-20px').siblings().css('marginTop','0');
	  			index = i;
	  		},function(){
	  			index == 2 ? index = 0 : index;
	  			autoScroll = setInterval(changeText,2000);
	  		})
	  	})

	  	//滚动监听动画
	  	$(document).on('mousewheel',function(event){
	  		$('.circle').each(function(index){
	  			var windowTop = $(window).scrollTop();
	  			var scrollTopUp = $(this).offset().top+$(this).outerHeight();
	  			var scrollTopDown = $(this).offset().top-$(window).height();
	  			if(windowTop>scrollTopDown){
	  				$(this).addClass('dh');
	  			}
	  		})
	  	})

	  	// 产品列表兼容性处理

	  	var windowWidth = $(window).width();
	  	if(windowWidth <= 1440 && windowWidth > 1366){
	  		$('.circle').each(function(index){
	  			if(index>2){
	  				var offsetLeft2 = $(this).offset().left-100;
					$(this).css("left",offsetLeft2);
	  			}
	  		});
	  	}else if(windowWidth < 1366){
	  		$('.circle').each(function(index){
	  			if(index<3){
	  				var offsetLeft1 = $(this).offset().left+50;
					$(this).css("left",offsetLeft1);
	  			}else{
	  				var offsetLeft2 = $(this).offset().left-85;
					$(this).css("left",offsetLeft2);
	  			}
	  		});
	  	}

	//首页js------------------end
})