<template>
    <div class="navlistWrap">
        <list></list>
        <div class="newslistHeader">
            <h1>新闻动态</h1>
            <a v-on:click="showList"><img class="more" src="../assets/more.png" alt="more"></a>
        </div>
        <div class="newsWrap">
            <div class="oneNews" v-for="new in news">
                <a v-link="{ name:'news', params:{ newsId:new.id } }">
                    <span class="newsType">[{{new.catalog}}]</span>                
                    <span class="newsBrief">{{new.title}}</span>              
                    <span class="newsDate">{{new.date}}</span>
                </a>                
            </div>
            <div class="newsMore">
                <a v-on:click="showMore"><span class="moreClick">查看更多</span></a>
            </div> 
        </div>        
    </div>
</template>
<script>
    require('../style/newslist');
    import $ from 'jquery';
    import Navlist from './navlist.vue';
    var more = require('../assets/more.png');
    var moreHover = require('../assets/moreHover.png');
    module.exports = {
        components: {
            'list':Navlist
        },
        data:function(){
            var _self = this;
            var defaultData = null;
            var baseURL = localStorage.getItem("baseURL");
            var isTest = localStorage.getItem("isTest");
            var url = baseURL+'/api/v1/header/getCurrentEvents?index=0&size=10';
            (isTest=="true")&&(url = '../src/data/newsList.json');
            $.ajax({         
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data){ 
                    _self.news = data;
                    _self.newsLength = data.length;
                },
                error: function(xhr, errorType, error){
                    console.log(errorType);
                }
            });
            return { news:defaultData, newsLength:0, count:10}        
        },
        methods:{
            showList:function(){
                $('.navlist').css("display","block");
                var wrapHeight = $(".navlistWrap").outerHeight(true);
                (wrapHeight<$(window).height())&&(wrapHeight = $(window).height())
                $('.navlist').css("height",wrapHeight);
            },
            showMore:function(){
                document.getElementsByClassName("moreClick")[0].addEventListener("touchstart",function(){
                    $(".moreClick").css({"background-color":"#dcdcdc","color":"#4d4e4e"});
                },false);
                document.getElementsByClassName("moreClick")[0].addEventListener("touchend",function(){
                    $(".moreClick").css({"background-color":"#fff","color":"#909090"});
                },false);

                this.count = this.count+10;
                var _self = this;
                var baseURL = localStorage.getItem("baseURL");
                var isTest = localStorage.getItem("isTest");
                var url = baseURL+'/api/v1/header/getCurrentEvents?index=0&size='+this.count;
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
            }
        },
        ready:function(){
            document.getElementsByClassName("more")[0].addEventListener("touchstart",function(){
                $(".more").attr("src",moreHover);                    
            },false);
            document.getElementsByClassName("more")[0].addEventListener("touchend",function(){
                $(".more").attr("src",more);
            },false);
        }
    }    
</script>