<template>
    <div class="navlistWrap">
        <list></list>
        <div class="secMenuHeader">
            <h1>{{pName}}</h1>
            <!-- <a v-link="{ path:'/'}"><img class="more" src="../assets/more.png" alt="more"></a> -->
            <a v-on:click="showList"><img class="more" src="../assets/more.png" alt="more"></a>
        </div>
        <div class="menuWrap">
            <div class="secMenu" v-for="secMenus in secMenusList">
                <div class="menuTitle">
                    {{secMenus.secMenuName}}
                    <span class="minus" v-on:click="toggle($index)"></span>        
                </div>
                <div class="itemWrap">
                    <template v-for="secMenu in secMenus.secMenus">
                        <a v-link="{ name:'product', params:{ prodId:secMenu.catalogCode}, query: {catalog: $route.params.catalog}}">
                            <div class="menuItem">{{secMenu.catalogName}}</div>
                        </a>                    
                    </template>
                </div>
            </div>       
        </div>
    </div>
</template>
<script>   
    require('../style/secmenu');
    import $ from 'jquery';
    import Navlist from './navlist.vue';
    var more = require('../assets/more.png');
    var moreHover = require('../assets/moreHover.png');
    module.exports = {
        components: {
            'list':Navlist
        },
        route:{
            data:function(){
                var _self = this;
                var defaultData = null;
                var catalog = this.$route.params.catalog;//确认是产品还是解决方案
                var baseURL = localStorage.getItem("baseURL");
                var isTest = localStorage.getItem("isTest");
                var url = baseURL+'/api/v1/secLevelMenu/getChildMenu?catalog='+catalog;
                (isTest=="true")&&(url = '../src/data/prodList.json');
                $.ajax({         
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){ 
                        _self.pName = data.pName;
                        _self.secMenusList = data.secMenu;
                    },
                    error: function(xhr, errorType, error){
                        console.log(errorType);
                    }
                });
                return { pName:defaultData, secMenusList:defaultData, catalog:catalog}   
            }
        },       
        methods:{
            toggle:function(index){
                var ele = $(".menuTitle").eq(index).children("span");
                if(ele.hasClass("plus")){
                    ele.removeClass("plus");
                    ele.addClass("minus");
                    $(".itemWrap").eq(index).css({"display":"block"});
                }else{
                    ele.removeClass("minus");
                    ele.addClass("plus");
                    $(".itemWrap").eq(index).css({"display":"none"});
                }
            },
            showList:function(){
                $('.navlist').css("display","block");
                var wrapHeight = $(".navlistWrap").outerHeight(true);
                (wrapHeight<$(window).height())&&(wrapHeight = $(window).height())
                $('.navlist').css("height",wrapHeight);
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