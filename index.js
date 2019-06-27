$(function () {
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var openid = GetQueryString("openid");
    $.ajax({
        url:'php/oauth2.php',
        type:'GET',
        dataType:'text',
        data:{'openid':openid,'state':'project2'},
        success:function (data) {
            var datas = JSON.parse(data)
            var cont = datas.play_num;
            $("#change").attr("cont",cont);
            $("#change").html(cont);
        },
        error:function (data) {
            // var datas = JSON.parse(data)
            console.log(data);
        }
    })
    function ssss() {
        var sss = $("#change").attr("cont");
        // console.log(sss);
    }
    setTimeout(ssss,2000);
    
    var $blin = $(".light p"),//所有彩灯
        $prize = $(".play li").not("#btn"),//含谢谢参与的所有奖品
        $change = $("#change"),//显示剩余机会
        $btn = $("#btn"),//开始抽奖按钮
        length = $prize.length,//奖品总数
        bool = true,//判断是否可点击,true为可点击
        mark = 0,//标记当前位置，区间为0-7
        timer;//定时器

    init();
    //默认动画效果
    function init() {
        timer = setInterval(function () {
            //不能调用animate函数，不然标记会有问题
            $blin.toggleClass("blin");//彩灯动画
            //九宫格动画
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");

            //位置标记的改变
            mark++;
            mark %= 8;
        }, 1000);
    }

    //点击抽奖
    $btn.click(function () {

        var sss = $("#change").text();
        var data = {count: sss};
        if (bool) {//若未按下
            bool = false;
            if (data.count > 0) {//若还有次数
                data.count--;
                $change.html(data.count);
                clickFn(data.count);
            } else {
                alert("您剩余抽奖次数为0，不能抽奖~");
            }
        }
    });

    //点击旋转
    function clickFn(sss) {
        clearInterval(timer);//点击抽奖时清除定时器
        var random = [1, 2, 3, 4, 5, 6, 7, 8];//抽奖概率
        var arrys = [
            {id:1,title:"答谢礼"},
            {id:2,title:"豪华礼"},
            {id:3,title:"奢享礼"},
            {id:4,title:"豪华礼"},
            {id:5,title:"答谢礼"},
            {id:6,title:"奢享礼"},
            {id:7,title:"答谢礼"},
            {id:8,title:"豪华礼"},
        ]
        //data为随机出来的结果，根据概率后的结果
        random = random[Math.floor(Math.random() * random.length)];//1-8的随机数
        
        console.log(mark);
        mark += random;
        mark %= 8;
        //控制概率，永远抽不中谢谢参与
        //正式上线为2
        if (mark === 2) {//抽中第一个谢谢参与则向前一位
            random++;
            mark++;
            console.log(2);
        }
        //正式上线为5
        if (mark === 5) {
            random--;
            mark--;
            console.log(6);
        }
        if (mark === 6) {
            random++;
            mark++;
            console.log(6);
        }
        //默认先转4圈
        random += 32;//圈数 * 奖品总数
        //调用旋转动画
        for (var i = 1; i <= random; i++) {
            setTimeout(animate(), 2 * i * i);//第二个值越大，慢速旋转时间越长
        }
        //停止旋转动画
        setTimeout(function () {
            console.log("中了" + arrys[mark].title);
            $(".win span").html(arrys[mark].title)
            setTimeout(function () {
                bool = true;
                win();
            }, 1000);
            $.ajax({
                url:'php/oauth2.php',
                type:'GET',
                dataType:'text',
                data:{'openid':openid,'state':'project3','play_num':sss,'mark':arrys[mark].title},
                success:function (data) {
                    // var datas = JSON.parse(data)
                    // var cont = datas.play_num;
                    // $("#change").attr("cont",cont);
                    // $("#change").html(cont);
                },
                error:function (data) {
                    // var datas = JSON.parse(data)
                    // console.log(data);
                }
            })
        }, 2 * random * random);
    }
    $("#myWin").click(function(){
        $.ajax({
            url:'php/oauth2.php',
            type:'GET',
            dataType:'text',
            data:{'openid':openid,'state':'project4'},
            success:function (data) {
                $("#jbox").show();
                var data = JSON.parse(data)

                $("#jbox img").attr('src', data.headimg);
                $("#jbox p").html(data.nickname);
                var jbox = ""; 
                for(var i = 0;i < data.jiangpin.length;i++){
                    console.log(data.jiangpin[i].data_tm  );
                    var time = new Date(data.jiangpin[i].data_tm* 1000);
                    var year = time.getFullYear();
                    var month = time.getMonth()+1;
                    var date = time.getDate();
                    var hours = time.getHours();
                    var minutes = time.getMinutes();
	                var seconds = time.getSeconds();
                    var sonn =  year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds;
                    jbox = "<p>"+data.jiangpin[i].jiangping+"<span>"+sonn+"</span></p>"
                    $("#jbox ul").append(jbox);
                }
            },
            error:function (data) {
                // var datas = JSON.parse(data)
                // console.log(data);
            }
        })
        function getzf(num){  
            if(parseInt(num) < 10){  
                num = '0'+num;  
            }  
            return num;  
       }
    })
    $("#jbox h3").click(function(){
        $("#jbox ul").empty();
        $("#jbox").hide();
    })
    //动画效果
    function animate() {
        return function () {
            $blin.toggleClass("blin");//彩灯动画
            //九宫格动画
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");
        }
    }

    //中奖信息提示
    $("#close,.win,.btn").click(function () {
        clearInterval(timer);//关闭弹出时清除定时器
        init();
    });

    //奖品展示
    var show = new Swiper(".swiper-container", {
        direction: "horizontal",//水平方向滑动。 vertical为垂直方向滑动
        loop: false,//是否循环
        slidesPerView: "auto"//自动根据slides的宽度来设定数量
    });


});





