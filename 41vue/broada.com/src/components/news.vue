<template>
    <div class="newsDetailWrap">
        <list></list>
        <div class="newsHeader">
            <h1>广通新闻</h1>
            <a v-on:click="showList"><img class="more" src="../assets/more.png" alt="more"></a>
        </div>
        <div class="newsTitle">
            <h2>{{news.title}}</h2>
            <h3>{{news.date}}</h3>
        </div>
        <div class="contentWrap">
            {{{news.content}}}
        </div>
        <com></com>
    </div>
</template>
<script>
    require('../style/news');  
    import $ from 'jquery';
    import Common from './common.vue';
    import Navlist from './navlist.vue';
    var more = require('../assets/more.png');
    var moreHover = require('../assets/moreHover.png');
    module.exports = {
        components: {
            'com':Common,
            'list':Navlist
        },
        data:function(){
            var _self = this;
            var defaultData = null;
            var newsId = this.$route.params.newsId;
            var baseURL = localStorage.getItem("baseURL");
            var isTest = localStorage.getItem("isTest");
            var url = baseURL+'/api/v1/detail/getNewById?id='+newsId;
            (isTest=="true")&&(url = '../src/data/news.json');
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
                $('.navlist').css("height",$(".navlistWrap").outerHeight(true));
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