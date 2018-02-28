<template>  
    <div class="navlistWrap">
        <list></list>
        <div class="header">
            <img class="logo" src="../assets/logo.png" alt="broada">
            <img v-on:click="showList" class="more" src="../assets/more.png" alt="more">
        </div>
        <div class="swiperWrap">
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide first"><a v-link="{name:'product', params:{prodId:'040601'}, query:{catalog:'04'}}"></a></div>
                    <div class="swiper-slide second"><a v-link="{name:'product', params:{prodId:'040604'}, query:{catalog:'04'}}"></a></div>
                    <div class="swiper-slide third"><a v-link="{ path:'/strategy'}"></a></div>
                    <div class="swiper-slide fourth"><a v-link="{ name:'news', params:{ newsId:'347'} }"></a></div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        
        <div class="mainPro">
            <div class="proHeader">
                <div class="pro1"></div>
                <span>产品动态</span>                
            </div>
            <div class="onePro proBorder">                
                <img src="../assets/mainpro/1.png" alt="">
                <p>Broadview V6.0 R4 产品全新发布</p>
                <a v-link="{ name:'news', params:{ newsId:'350'}}"></a>
            </div>
            <div class="proHeader">
                <div class="pro2"></div>
                <span>方案聚焦</span>                
            </div>
            <div class="onePro proBorder">                
                <img src="../assets/mainpro/2.png" alt="">
                <p>IT综合监控管理解决方案</p>
                <a v-link="{name:'product', params:{prodId:'040601'}, query:{catalog:'04'}}"></a>
            </div>
            <div class="proHeader">
                <div class="pro3"></div>
                <span>案例分享</span>                
            </div>
            <div class="onePro">                
                <img src="../assets/mainpro/3.png" alt="">
                <p>海关运维管理案例</p>
                <a v-link="{ name:'news', params:{ newsId:'347'}}"></a>
            </div>
        </div>
        <div class="newslist">
            <div class="newsheader">广通动态</div>
            <template  v-for="new in news">
                <div class="oneNews">
                    <a v-link="{ name:'news', params:{ newsId:new.id } }">
                        <span class="newsType">[{{new.catalog}}]</span>                    
                        <span class="newsBrief">{{new.title}}</span>              
                        <span class="newsDate">{{new.date}}</span>
                    </a>   
                </div>                
            </template>
            <div class="newsMore">
                <a v-link="{ path:'/newslist'}"><span class="moreClick">更多动态</span></a>
            </div>           
        </div>
        <com></com>
    </div>
    <div class="connection">
        <div class="phoneWrap">
            <a href="tel:10086">
                <img class="phone" src="../assets/phone.png" alt="phone">
            </a>
        </div>
        <div class="qqWrap">
            <a href="mqqwpa://im/chat?chat_type=wpa&uin=2231697973&version=1&src_type=web&web_src=oicqzone.com">
                <img class="qq" src="../assets/qq.png" alt="qq">
            </a>
        </div>
    </div>     
</template>
<script>  
    require('../style/homepage');  
    require('../lib/swiper/swiper-3.3.1.min.css');
    var more = require('../assets/more.png');
    var moreHover = require('../assets/moreHover.png'); 
    import $ from 'jquery';
    import Common from './common.vue';
    import Navlist from './navlist.vue';
    import Swiper from '../lib/swiper/swiper-3.3.1.min.js';//swiper组件

    module.exports = {
        components: {
            'com':Common,
            'list':Navlist
        },
        data: function () {
            var _self = this;
            var defaultData = [];
            var baseURL = localStorage.getItem("baseURL");
            var isTest = localStorage.getItem("isTest");
            var url = baseURL+'/api/v1/header/getCurrentEvents?index=0&size=5';
            (isTest=="true")&&(url = '../src/data/newsList.json');
            $.ajax({         
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data){ 
                    _self.news = data;                    
                },
                error: function(xhr, errorType, error){
                    console.log(errorType);
                }
            });
            return { news:defaultData}
        },
        methods:{
            showList:function(){
                $('.navlist').css("display","block");
                var wrapHeight = $(".navlistWrap").outerHeight(true);
                (wrapHeight<$(window).height())&&(wrapHeight = $(window).height())
                $('.navlist').css("height",wrapHeight);
            }
        },
        ready:function(){
            $('.navlist').css("display","none");
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
                centeredSlides: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: false,
                loop:true
            });
            var _self = this;

            function changeBgColor(clickCN, targetCN, clickBgColor, defaultBgColor, clickPic, defaultPic,clickColor, defaultColor){
                document.getElementsByClassName(clickCN)[0].addEventListener("touchstart",function(){
                    $("."+targetCN).css({"background-color":clickBgColor,"color":clickColor});
                    $("."+targetCN).attr("src",clickPic);                    
                },false);
                document.getElementsByClassName(clickCN)[0].addEventListener("touchend",function(){
                    $("."+targetCN).css({"background-color":defaultBgColor,"color":defaultColor});
                    $("."+targetCN).attr("src",defaultPic);
                },false);
            };
            changeBgColor("more", "more", "", "", moreHover, more);
            changeBgColor("phone", "phoneWrap", "#4f95c7", "#313d55"); 
            changeBgColor("qq", "qqWrap", "#4f95c7", "#313d55"); 
            changeBgColor("moreClick", "moreClick", "#dcdcdc", "#fff", "", "", "#4d4e4e", "#909090");

            // setTimeout(function(){
            //     var newsLength = $(".oneNews").length;
            //     for(var i=0; i<5; i++){
            //         document.getElementsByClassName("oneNews")[i].addEventListener("touchstart",function(){
            //             $(".oneNews").eq(i).css({"background-color":"red"});
            //         },false);
            //         document.getElementsByClassName("oneNews")[0].addEventListener("touchend",function(){
            //             $(".oneNews").eq(i).css({"background-color":"#f1f1f1"});
            //         },false);
            //     }
            // }, 1000);          
        }
    }
</script>