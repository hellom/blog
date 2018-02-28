<template>
    <div class="strategyWrap">
        <list></list>
        <div class="strategyHeader">
            <h1>战略合作</h1>
            <a v-on:click="showList"><img class="more" src="../assets/more.png" alt="more"></a>
        </div>
        <div class="contentWrap">
            {{{strategy.content}}}
        </div>
        <com></com>
    </div>
</template>

<script>
    require('../style/strategy');  
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
            var strategyId = this.$route.params.strategyId;
            var baseURL = localStorage.getItem("baseURL");
            var isTest = localStorage.getItem("isTest");
            var url = baseURL+'/api/v1/detail/getDefaultByCatalog?catalog=07';
            (isTest=="true")&&(url = '../src/data/strategy.json');
            $.ajax({         
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(data){                     
                    _self.strategy = data;
                },
                error: function(xhr, errorType, error){
                    console.log(errorType);
                }
            });
            return { strategy:defaultData}        
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