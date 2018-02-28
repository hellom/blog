<template>
    <div class="navlist">
        <div class="navHeader">
            <a v-on:click="close"><img class="close" src="../assets/close.png" alt="close"></a>
        </div>
        <div class="navContent">
            <div class="navItem">
                <a v-link="{ path:'/'}" v-on:click="close">
                    <div class="navBg">
                        <img src="../assets/navlist/1.png" alt="">
                        <h2>首页</h2>
                    </div>
                </a>                                
            </div>
            <div class="navItem" v-on:click="close">
                <a v-link="{ path:'/newslist'}">
                    <div class="navBg">
                        <img src="../assets/navlist/2.png" alt="">
                        <h2>新闻动态</h2>
                    </div>  
                </a>                              
            </div>
            <div class="navItem" v-on:click="close">
                <a v-link="{ name:'secmenu',params:{catalog:'03'}}">
                    <div class="navBg">
                        <img src="../assets/navlist/3.png" alt="">
                        <h2>产品</h2>
                    </div>  
                </a>                              
            </div>
            <div class="navItem" v-on:click="close">
                <a v-link="{ name:'secmenu',params:{catalog:'04'}}">
                    <div class="navBg">
                        <img src="../assets/navlist/4.png" alt="">
                        <h2>解决方案</h2>
                    </div> 
                </a>                               
            </div>
            <div class="navItem">
                <div class="navBg">
                    <img src="../assets/navlist/5.png" alt="">
                    <h2>客户名录</h2>
                </div>                
            </div>
            <div class="navItem">
                <div class="navBg">
                    <img src="../assets/navlist/6.png" alt="">
                    <h2>服务支持</h2>
                </div>                
            </div>
            <div class="navItem" v-on:click="close">
                <a v-link="{ path:'/strategy'}">
                    <div class="navBg">
                        <img src="../assets/navlist/7.png" alt="">
                        <h2>战略合作</h2>
                    </div>                    
                </a>               
            </div>
            <div class="navItem">
                <div class="navBg">
                    <img src="../assets/navlist/8.png" alt="">
                    <h2>诚聘英才</h2>
                </div>                
            </div>
            <div class="navItem">
                <div class="navBg">
                    <img src="../assets/navlist/9.png" alt="">
                    <h2>关于我们</h2>
                </div>                
            </div>
        </div>        
    </div>
</template>
<script>
    require('../style/navlist'); 
    import $ from 'jquery';
    module.exports = {
        methods:{
            close:function(){
                $('.navlist').css("display","none");
            }
        },
        ready:function(){
            $('.navlist').css("display","none");
            var navLength = $(".navBg").length;
            for(let i=0; i<navLength; i++){
                document.getElementsByClassName("navBg")[i].addEventListener("touchstart",function(){
                    $(".navBg").eq(i).addClass("navBgChosen");                   
                },false);
                document.getElementsByClassName("navBg")[i].addEventListener("touchend",function(){
                    $(".navBg").eq(i).removeClass("navBgChosen"); 
                },false);
            }
        }
    }    
</script>