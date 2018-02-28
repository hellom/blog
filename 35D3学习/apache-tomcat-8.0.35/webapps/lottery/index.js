$(function(){
    //获取人员列表
    function getUserList(){
        var sendUrl = './get_lottery_user.txt';
        $.ajax({
            url: sendUrl + '?' + Date.now(),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data){
                if(data.errCode !="400"){
                    drawNode(data.data);
                    saveNodes(data.data);
                }else{
                    alert(data.message);
                }
            }
        })
    }

    //动态绘制dom树
    function drawNode(data){
        var oneList = data.oneList , twoList = data.twoList , threeList = data.threeList , nodeList_one = [] , nodeList_two = [] , nodeList_three = [];
        oneList.forEach(function(node){
            nodeList_one.push($("<div class='slot'>"+node+"</div>"));
        })
        twoList.forEach(function(node){
            nodeList_two.push($("<div class='slot'>"+node+"</div>"));
        })
        threeList.forEach(function(node){
            nodeList_three.push($("<div class='slot'>"+node+"</div>"));
        })
        $('#casino1 .wrap').append($("<div class='slot_start'></div>")).append(nodeList_one);
        $('#casino2 .wrap').append($("<div class='slot_start'></div>")).append(nodeList_two);
        $('#casino3 .wrap').append($("<div class='slot_start'></div>")).append(nodeList_three);
    }

    //清空dom树
    function resetDom(){
        $('#casino1 .wrap').children().remove().end().removeClass('scroll scroll_slow');
        $('#casino2 .wrap').children().remove().end().removeClass('scroll scroll_slow');
        $('#casino3 .wrap').children().remove().end().removeClass('scroll scroll_slow');
        nodeList_four_one = [];
        nodeList_four_two = [];
        nodeList_four_three = [];
    }

    //保存4个节点
    var nodeList_four_one = [] , nodeList_four_two = [] ,nodeList_four_three = [] ;
    function saveNodes(data){
        var oneList = data.oneList , twoList = data.twoList , threeList = data.threeList;
        var m = 4;
        while(m < 5 && m > 0){
            var n = Math.floor(Math.random()*20);
            nodeList_four_one.push($("<div class='slot'>"+oneList[n]+"</div>"));
            nodeList_four_two.push($("<div class='slot'>"+twoList[n]+"</div>"));
            nodeList_four_three.push($("<div class='slot'>"+threeList[n]+"</div>"));
            m--;
        }
    }
    //抽奖
    var machine4 = {
        node:$('#casino1 .wrap'),
        shuffle:function(){
            this.node.addClass('scroll');
        },
        stop:function(){
            this.node.children().remove();
            this.node.append(nodeList_four_one);
            this.node.append($("<div class='slot'>张</div>"))
            this.node.addClass('scroll_slow');
        }
    }
    var machine5 = {
        node:$('#casino2 .wrap'),
        shuffle:function(){
            this.node.addClass('scroll');
        },
        stop:function(){
            this.node.children().remove();
            this.node.append(nodeList_four_two);
            this.node.append($("<div class='slot'>尚</div>"))
            this.node.addClass('scroll_slow');
        }
    }
    var machine6 = {
        node:$('#casino3 .wrap'),
        shuffle:function(){
            this.node.addClass('scroll');
        },
        stop:function(){
            this.node.children().remove();
            this.node.append(nodeList_four_three);
            this.node.append($("<div class='slot'>金</div>"))
            this.node.addClass('scroll_slow');
        }
    }
    var started = 0;
    $("#slotMachineButtonShuffle").click(function(){
        started = 3;
        resetDom();
        getUserList();
        machine4.shuffle();
        machine5.shuffle();
        machine6.shuffle();
    });
    $("#slotMachineButtonStop").click(function(){
        switch(started){
            case 3:
                machine4.stop();
                break;
            case 2:
                machine5.stop();
                machine6.stop();
                break;
        }
        started--;
    });
})
