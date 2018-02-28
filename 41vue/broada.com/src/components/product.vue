<template>   
    <div class="productWrap">
        <list></list>
        <div class="productHeader">
            <h1>{{FirstTitle}}</h1>
            <!-- <a v-link="{ path:'/'}"><img class="more" src="../assets/more.png" alt="more"></a> -->
            <a v-on:click="showList"><img class="more" src="../assets/more.png" alt="more"></a>
        </div>
        <div class="methodTitle">{{MethodTitle}}</div>
        <div class="contentWrap">
            {{{prod.content}}}
        </div>
        <div>{{pName}}</div>
        <div v-if="isShow" class="rProdWrap">
            <div class="rProdTitle">相关产品</div>
            <template v-for="rProd in rProds">
                <a v-on:click="goProd(rProd.catalogCode)">
                    <div class="rProd">{{rProd.catalogName}}</div>
                </a>                                
            </template>
        </div>
        <com></com>        
    </div>
</template>
<script>  
    require('../style/product');
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
    
        },
        methods:{
            showList:function(){
                $('.navlist').css("display","block");
                var wrapHeight = $(".navlistWrap").outerHeight(true);
                (wrapHeight<$(window).height())&&(wrapHeight = $(window).height())
                $('.navlist').css("height",wrapHeight);
            },
            goProd:function(prodId){
                this.$router.go({name:'product', params:{ prodId:prodId}});
            }
        },
        computed: {
            MethodTitle: function () {
                if(this.prod.title) {
                    return this.prod.title.replace("解决方案","");
                }
            },
            FirstTitle:function(){
                if(this.prod.name){
                    return this.prod.name;
                }else{
                    return "解决方案";
                }
            }
        },
        route:{
            data:function(){
                var _self = this;
                var defaultData = null;
                var prodId = this.$route.params.prodId;
                var catalog = this.$route.query.catalog;
                var baseURL = localStorage.getItem("baseURL");
                var isTest = localStorage.getItem("isTest");
                var apiUrl = '/api/v1/detail/getProductByCatalog?catalog=';
                var isShow = false;
                var rProdUrl = "";
                var prodUrl = "";
                if(catalog == "04"){
                    apiUrl = '/api/v1/detail/getDefaultByCatalog?catalog=';
                    // $(".contentWrap").addClass("methodsContent");                
                }else{
                    isShow = true;   
                    (isTest=="true")?(rProdUrl = '../src/data/relativePro.json'):(rProdUrl = baseURL+'/api/v1/detail/getRelevantProduct?catalog='+prodId);
                    $.ajax({         
                        url: rProdUrl,
                        type: 'GET',
                        dataType: 'json',
                        success: function(data){ 
                            _self.rProds = data;
                        },
                        error: function(xhr, errorType, error){
                            console.log(errorType);
                        }
                    });
                }
                (isTest=="true")?(prodUrl = '../src/data/prod.json'):(prodUrl = baseURL+apiUrl+prodId);
                $.ajax({         
                    url: prodUrl,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){ 
                        _self.prod = data;
                    },
                    error: function(xhr, errorType, error){
                        console.log(errorType);
                    }
                });
                return { prod:defaultData, rProds:defaultData, isShow:isShow}      
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