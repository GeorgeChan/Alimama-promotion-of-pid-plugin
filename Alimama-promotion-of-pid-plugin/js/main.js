/*
* @Author: 15605
* @Date:   2017-12-26 15:59:10
* @Last Modified by:   15605
* @Last Modified time: 2018-03-27 13:58:04
*/
$(function () {
  var tbtoken ;
  chrome.cookies.get({url:"https://www.alimama.com/",name:"_tb_token_"},function(cookie){
    console.log(cookie.value);
    tbtoken = cookie.value;
  })
  var data = [
    {
      "gn":"商品库",
      "yw":"篮球",
      "id":"1"
    },
    {
      "gn":"商品库",
      "yw":"跑步",
      "id":"2"
    },
    {
      "gn":"商品库",
      "yw":"健身",
      "id":"3"
    },
    {
      "gn":"商品库",
      "yw":"潮流",
      "id":"4"
    },
    {
      "gn":"商品库",
      "yw":"足球",
      "id":"5"
    },
    {
      "gn":"商品库",
      "yw":"数码",
      "id":"6"
    },
    {
      "gn":"商品库",
      "yw":"理容",
      "id":"7"
    },
    {
      "gn":"商品库",
      "yw":"其他",
      "id":"8"
    },
    {
      "gn":"团购",
      "yw":"默认",
      "id":"9"
    },
    {
      "gn":"优惠",
      "yw":"优惠信息",
      "id":"10"
    },
    {
      "gn":"优惠",
      "yw":"品牌优惠券",
      "id":"11"
    },
    {
      "gn":"优惠",
      "yw":"品牌特卖",
      "id":"12"
    },
    {
      "gn":"优惠",
      "yw":"底价购",
      "id":"13"
    },
    {
      "gn":"优惠",
      "yw":"白菜品牌券",
      "id":"14"
    },
    {
      "gn":"优惠",
      "yw":"白菜搜索券",
      "id":"15"
    },
    {
      "gn":"秒杀",
      "yw":"篮球",
      "id":"16"
    },
    {
      "gn":"秒杀",
      "yw":"跑步",
      "id":"17"
    },
    {
      "gn":"秒杀",
      "yw":"潮流",
      "id":"18"
    },
    {
      "gn":"秒杀",
      "yw":"数码",
      "id":"19"
    },
    {
      "gn":"秒杀",
      "yw":"理容",
      "id":"20"
    },
    {
      "gn":"秒杀",
      "yw":"足球",
      "id":"21"
    },
    {
      "gn":"秒杀",
      "yw":"健身",
      "id":"22"
    },
    {
      "gn":"券转化",
      "yw":"默认",
      "id":"23"
    },
    {
      "gn":"识物文章",
      "yw":"默认",
      "id":"24"
    },
    {
      "gn":"其他",
      "yw":"默认",
      "id":"25"
    },
    {
      "gn":"商品库",
      "yw":"运动服饰",
      "id":"26"
    },
    {
      "gn":"团购",
      "yw":"秒杀引团购",
      "id":"27"
    }
  ]



  //所属app选择按钮
  $('.pt-boxs li a').on('click', function(event) {
    var ptText = $(this).text();
    var dataPt = $(this).attr('data-pt');
    $('#name-pt').text(ptText);
    $('#name-pt').attr('data-pt', dataPt);
  });


  //生成推广位按钮
  $('#createTgw').on('click', function() {
    $('#mainBox tbody').html('');
    $('#confirm').css('display', 'inline-block');
    $('#cancel').css('display', 'inline-block');
    $('#save').css('display', 'none');
    var qd = $('#name-qd').val(),
        pintai = $('#name-pt').text(),
        pt = $('#name-pt').attr('data-pt');

    if(qd == ''||pintai == '请选择所属平台'){
      $.toast({
        heading: 'Error',
        text   :'请输入渠道名称或所属平台！',
        showHideTransition: 'plain',
        icon   : 'error'
      });
    }else {
      for(var i=0; i<data.length; i++){
          $('#mainBox').append(`<tr class="l-table norepeat d${data[i].id}">'
                                  <td>gn:${data[i].gn}-yw:${data[i].yw}-qd:${qd}-pt:${pt}</td>
                                  <td></td>
                                </tr>`)
      }
      $('.loading').css('display', 'block');
      var timestap = Date.parse(new Date()),
          pageList = [],
          page = 1,
          trList = $('.l-table');
      var timer = setInterval(function () {
        $.getJSON('https://pub.alimama.com/common/adzone/adzoneManage.json', {tab:"2",toPage:page,perPageSize:"400",gcid:"7",t:timestap,_tb_token_:tbtoken,_input_charset:"utf-8"}, function(res) {
          if (res.data.pagelist == null) {
            clearInterval(timer);
            for(var j=0,jLen=pageList.length; j<jLen; j++){
              for (var k=0,kLen=trList.length; k<kLen; k++){
                var str1 = $.trim(pageList[j].name);
                var str2 = $.trim($(trList[k]).first().text());
                if (str1 == str2) {

                  $(trList[k]).children('td:last-child').text(pageList[j].adzonePid);
                  $(trList[k]).children('td:last-child').css('color', 'red');
                  $(trList[k]).removeClass('norepeat');
                }
                if (j==jLen-1 && k==kLen-1) {
                  console.log('结束');
                  $('.loading').css('display', 'none');
                }
              }
            }
          }
          pageList = pageList.concat(res.data.pagelist);
          page ++;
        });
      }, 2500)




    }
  });

  //确认按钮请求阿里妈妈接口
  $('#confirm').on('click', function(event) {
    var qd = $('#name-qd').val(),
        pintai = $('#name-pt').text(),
        pt = $('#name-pt').attr('data-pt');

    if(qd == ''||pintai == '请选择所属平台'){
      $.toast({
        heading: 'Error',
        text   :'请输入渠道名称或所属平台！',
        showHideTransition: 'plain',
        icon   : 'error'
      });
    }else {
      var timestap = Date.parse(new Date()),
          norepeatArr = $('.norepeat'),
          siteId;
          if (pt == 'android') {
            siteId = '13424195';
          }else if (pt == 'ios') {
            siteId = '7184946';
          }
          for(let i = 0,iLen = norepeatArr.length; i<iLen; i++ ){
            var newadzoneName = $.trim($(norepeatArr[i]).children('td:first-child').text());
            $.post('https://pub.alimama.com/common/adzone/selfAdzoneCreate.json', {tag:'29',gcid:'7',siteid:siteId,selectact:'add',newadzonename:newadzoneName,t:timestap,_tb_token_:tbtoken, pvid:'21_116.226.57.138_3043_'+timestap}, function(res) {
              $(norepeatArr[i]).children('td:last-child').text('mm_31576222_'+siteId+'_'+res.data.adzoneId);
            });
          }
          $('#confirm').css('display', 'none');
          $('#cancel').css('display', 'none');
          $('#save').css('display', 'block');
    }
  });


  //取消按钮
  $('#cancel').on('click',  function(event) {
    $('#mainBox tbody').html('');
    $('#name-qd').val('');
    $('#name-pt').html('请选择所属平台');
    $('#name-pt').attr('data-pt', '');
  });


  //保存按钮传输至识货服务端
  $('#save').on('click',  function(event) {
    var pidArr = [],
        listArr = $('.l-table');
    for(var k = 0,kLen = listArr.length; k<kLen; k++){
      for(var l=0,lLen = $(listArr[k]).children('td').length;l < lLen;l++){
        var item = {};
        item.name = $.trim($($(listArr[k]).children('td')[0]).text());
        item.pid = $.trim($($(listArr[k]).children('td')[1]).text());
      }
      pidArr.push(item);
    }

    var pids = pidArr,
        t = (Date.parse(new Date())/1000),
        token = md5(t + "123456");
    $.ajax({
      url: 'http://www.shihuo.cn/app_swoole_common/savePid?t='+t+'&token='+token,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
              pids: pids
            }),
      success: function(res){
        if (res.status == 0) {
          $.toast({
            heading: 'Success',
            text: '保存成功！',
            showHideTransition: 'slide',
            icon: 'success'
          })
        }else{
          $.toast({
            heading: 'Error',
            text   : res.msg,
            showHideTransition: 'plain',
            icon   : 'error'
          });
        }
      }
    })
  });


})