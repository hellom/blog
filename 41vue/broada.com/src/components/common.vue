<template>
    <div class="serviceNum">
        <h3>广通信达服务号</h3>
        <div>
            <img src="../assets/serviceNum.png" alt="">
        </div>            
        <p>长按二维码保存图片</p>
        <p>扫一扫关注微信公众号</p>            
    </div>
    <div class="assist">
        <div class="assistTitle assistBorder">
            <a v-link="{ name:'secmenu',params:{catalog:'03'}}">
                <span class="title">产品</span>
                <img src="../assets/next.png" alt="next">
            </a>  
        </div>    
        <div class="assistTitle assistBorder">
            <a v-link="{ name:'secmenu',params:{catalog:'04'}}">
                <span class="title">解决方案</span>
                <img src="../assets/next.png" alt="next">
            </a>  
        </div>     
        <div class="assistTitle assistBorder">
            <a v-link="{ path:'/newslist'}">
                <span class="title">新闻动态</span>
                <img src="../assets/next.png" alt="next">
            </a>       
        </div>    
        <div class="assistTitle">
            <a v-link="{ path:'/strategy'}">
                <span class="title">战略合作</span>
                <img src="../assets/next.png" alt="next">
            </a>       
        </div>    
    </div>
    <div class="firmInfo">
        <p>北京广通信达软件股份有限公司 © 版权所有 010-59798977</p>
        <p>京ICP备05010347号</p>
        <p>浙ICP备10016194号</p>
        <p>京公海网安备110108001280号</p>
        <img id="goTop" src="../assets/topIcon.png" alt="top" v-on:click="greet">
    </div>  
</template>
<script>
    require('../style/common');
    import $ from 'jquery';
    module.exports = {
        methods:{
            greet:function(){
                $('body').animate({scrollTop:0},1000); 
            }
        },
        ready:function(){
            var width = (window.innerWidth>0)?window.innerWidth:screen.width;
             $(window).scroll(function(){  
                if($(window).scrollTop()>width){  
                    $("#goTop").fadeIn(1500);  
                }else{  
                    $("#goTop").fadeOut(1500);  
                }  
            });

            document.getElementById("goTop").addEventListener("touchstart",function(){
                $("#goTop").css({"background-color":"#5dace0"});
            },false);
            document.getElementById("goTop").addEventListener("touchend",function(){
                $("#goTop").css({"background-color":"#b1bebe"});
            },false);

        }
    } 
</script>