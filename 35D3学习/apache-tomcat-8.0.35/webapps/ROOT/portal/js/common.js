$(document).ready(function () {

		//登录跳转

		(function jumpTenant(){
			$('.login').on('click',function(){
				var url = '/tenant/#/login?return_insite='+window.location.href;
				window.location.href = url;
			})
		})()

		//导航条样式

	  	$('.nav ul li').each(function(index){
	  		$(this).on({'mouseover':function(){
	  				$(this).children('.sub-nav').css('height','174px');
	  				$(this).addClass('back');
	  			},'mouseleave':function(){
	  				$(this).children('.sub-nav').css('height','0px');
	  				$(this).removeClass('back');
	  			}
	  		})
	  	}) 
	  	

	  	$('.sub-nav li').each(function(index){
	  		$(this).on('mouseover',function(){
	  			$(this).children('a').css('color','#fff');
	  		});
	  		$(this).on('mouseleave',function(){
	  			$(this).children('a').css('color','#00a0e3');
	  		});
	  	})

	  	//当前页面状态标识
	  	var href = window.location.href;
	  	var num = 0;
	  	(function currentUrl(value){
	  		if(value.indexOf('home')!=-1){
	  			num = 0;
	  			return;
	  		}
	  		if(value.indexOf('product')!=-1){
	  			num = 1;
	  			return;
	  		}
	  		if(value.indexOf('customerCase')!=-1){
	  			num = 2;
	  			return;
	  		}
	  		if(value.indexOf('support')!=-1){
	  			num = 3;
	  			return;
	  		}
	  		if(value.indexOf('bbs')!=-1){
	  			num = 4;
	  			return;
	  		}
	  		if(value.indexOf('about')!=-1){
	  			num = 5;
	  			return;
	  		}
	  	})(href)
	  	$('.subnav').eq(num).css('border-bottom','2px solid #fff');

	  	$(document).on('mousewheel',function(event){
	  		if($(document).scrollTop()>500){
	  			$('.toobar-box').addClass('mousewheel');
	  			$('.subnav').eq(num).css('background-color','#193c62');
	  		}else{
	  			$('.toobar-box').removeClass('mousewheel');
	  			$('.subnav').eq(num).css('background-color','transparent');
	  		}
	  	})

	  	//用户信息
	  	var userId = $.cookie('userId');
	  	var userName = '';
	  	var url = '/tenant/api/v1/user/details/view';
	  	if(userId){
	  		 $.ajax({
                url: url,
                data: {userId:userId},
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    userName = data.data.realname;
                    $('.login').hide();
	  				$('.register').hide();
	  				$('.username').html(userName);
	  				$('.username-wrap').show();

	  				$('.freeRegister').attr('href','javascript:;');
	  				$('.freeRegister').click(function(){
	  					alert('您已登录~');
	  				})
                }.bind(this)
            });
	  	}


	  	//退出按钮
	  	$('.username-wrap').hover(function(event){
	  		event.stopPropagation()
	  		$(".username-wrap").css('background-color','#193c62');
	  		$('.logout').show(100);
	  	},function(){
	  		event.stopPropagation()
	  		$(".username-wrap").css('background-color','transparent');
	  		$('.logout').hide();
	  	})
	  	$('.logout-btn').click(function(){
	  		var token = $.cookie('token');
	  		$.ajax({
	            url: '/tenant/api/v1/user/logout',
	            data: {'token':token},
	            type: 'get',
	            dataType: 'json',
	            success: function (data) {
	            	let ucsynlogoutURL = data.data.ucsynlogoutURL;
	                if(ucsynlogoutURL){
	                    $.ajax({
	                        type: "get",
	                        url:ucsynlogoutURL,
	                        dataType:"jsonp",
	                        jsonp:"callback",
	                        async:'false',
	                        success:function(data){
	                        }
	                    });
	                }
	            	$('.logout').hide();
	  				location.reload();
	            }.bind(this)
	        });   
	  		
	  	})

	  	window.onbeforeunload=function (){ 
			if(event.clientX<=0 && event.clientY<0) {  
				window.event.returnValue = function(){clearInterval(intervalId);}; //这里可以放置你想做的操作代码  
			}else{ 
				$(document).scrollTop(0);
			} 
		}

		//导航跳转链接
		function jumpPage(){
			$('.nav .subnav').each(function(index){
				$(this).click(function(){
					var flag = window.location.href.indexOf('products');
					switch(index){
						case 0:
						flag == -1 ? window.location.href = './index.html' : window.location.href = '../index.html';
						break;
						case 1:
						flag == -1 ? window.location.href = './product.html' : window.location.href = '../product.html';
						break;
						case 2:
						flag == -1 ? window.location.href = './customerCase.html' : window.location.href = '../customerCase.html';
						break;
						case 3:
						window.location.href = '/workorder/hall';
						break;
						case 4:
						window.location.href = 'http://bbs.uyun.cn/forum.php';
						break;
						case 5:
						flag == -1 ? window.location.href = './about.html' : window.location.href = '../about.html';
						break;
					}
				});
				
			}); 
		}
		jumpPage(); 
})