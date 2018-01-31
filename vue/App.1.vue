<template>
  <div>
     <!-- <van-nav-bar title="领取优惠券" class="fixed-van-nav-bar"></van-nav-bar>  -->



      <div class="center bg">
          <div><img src="./bg.jpg"></div>        
          <div class="center textarea">        
            <p>先领券.再分期</p>
            <p>畅玩支付节</p>
          </div> 

   
          <div class="center formarea">
              <van-cell-group>
                  <van-field class="input" v-focus="focusState" maxlength="11" v-model="phoneNumber" placeholder="请输入您的手机号码领取免息券" />
              </van-cell-group>

              <div class="button" @click="getCoupon"><img src="./btn.png"></div>
              
          </div>
          <div class="center texttitle">
            <p @click="showcontent=true">活动规则</p>      
          </div>
          <div  class="textcontent" v-show="showcontent">
              
              <p>1、用户需要先开通首付出发，输入您的手机号码，点击立即领取。</p>
              <p>2、每位首付出发用户仅能领取一次，不能重复领取；</p>
              <p>3、优惠券领取成功后，在使用首付出发时自动使用免除相应的分期服务费。请在有效期内使用，过期则自动废除。</p>
           
            
          </div>

      </div>


      <van-popup v-model="popupShow" position="center" :overlay="true" :lock-on-scroll="true" :close-on-click-overlay="false" class="reset_popup">

        <van-panel title="输入验证码">
          <div>
            <van-cell-group>
              <van-field v-model="code" placeholder="短信验证码已发送到您手机,请输入" maxlength="6" />
              <van-button size="small" @click="sendCode">重获验证码{{timeout}}</van-button>
            </van-cell-group>            
          </div>
          <div slot="footer" style="text-align:right">
            <van-button size="small" type="default" @click="popupShow=false">取消</van-button>        
            <van-button size="small" :type="this.code?'danger':'default'" @click="getCoupon2">确认领取</van-button>
          </div>
        </van-panel>


      </van-popup>


 
  </div>
</template>

<script>
import axios from "axios";
import { Dialog, Toast } from "vant";
//import * as _global from "../../plugs/global";
import TrendFun from "../../plugs/function";

let trendFun = new TrendFun(); //公共函数库
//let __REQUEST = trendFun.__REQUEST();
//let __URILIST = _global.URILIST;

export default {
  name: "app",
  data() {
    return {
      phoneNumber: trendFun.getCookie("phoneNumber"),
      code:"",
      showcontent: false,
     // URL: "https://jr.tuniu.com/opl/promotion/getGift",
     // URL2: "https://jr.tuniu.com/opl/promotion/sendMessage",  //验证码
      URL: "http://jr.tuniu.com:8181/opl/promotion/getGift",
      URL2: "http://jr.tuniu.com:8181/opl/promotion/sendMessage",  //验证码

      focusState: false,

  
      popupShow: false,  //验证码框显示
      //倒计时
      timeout:""
    };
  },
  directives: {
    //自定义指令
    focus: {
      update: function(el, { value }) {
        // console.log(el);
        // console.log(value);
        if (value) {
          //el.focus();
          el.querySelector("input").focus();
        }
      }
    }
  },

  methods: {
    writeCookie() {
      let phoneNumber, token, appVersion;
      phoneNumber = this.$refs.phoneNumber.value;
      trendFun.setCookie("phoneNumber", phoneNumber, 10); //15911110002
    },

    checkPhone(phone) {
      if (!/^1[345789]\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },

    getCoupon() {
      let platform = trendFun.getUrlParam("platform"); //this.$route.query.
      //console.log(platform);

      let phoneNum = this.phoneNumber;
      if (phoneNum == "" || !this.checkPhone(phoneNum)) {
        Dialog.alert({
          title: "提示",
          message: "手机号码有误，请重填"
        }).then(() => {
          this.focusState = true; //得到焦点
          setTimeout(() => {
            this.focusState = false;
          }, 2000); //不然就只能一次得到焦点了
        });
        return;
      }


     this.sendCode(); //自动发送验证码
     this.popupShow=true; //显示输入验证码框

      
    },

   getCoupon2() {
      let platform = trendFun.getUrlParam("platform"); //this.$route.query.
      //console.log(platform);

      let code = this.code;
      if (code == "") {
        Dialog.alert({
          title: "提示",
          message: "请输入验证码"
        });
        return;
      }


     //this.sendCode(); //自动发送验证码
     //this.popupShow=true; //显示输入验证码框

      //return;
      let request = {
        smsCode: code, // 验证码 必填 String
        phoneNum: this.phoneNumber, //手机号，必填
        type: 1, // 类型，非必填 1 促销短信验证码  用于统计
        desc: "" // 活动描述， 非必填
      };

      const toast = Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: "拼命加载中..."
      });

      axios.post(this.URL, request).then(response => {
          toast.clear();
          if (response.data.success) {
            //console.log( this.data)
            // alert("恭喜您领取成功。");
            Dialog.alert({
              title: "提示",
              message: "恭喜您领取成功。"
            }).then(() => {
              if (platform == 1) {
                location.href = "http://jr.tuniu.com/opl/couponList"; //pc
              } else {
                location.href = "http://8.m.tuniu.com/xdm/m/index/ticket"; //Msite
              }
            });
          } else {
            Dialog.alert({
              title: "提示",
              message: response.data.msg
            });
          }
        })
        .catch(error => {
          toast.clear();
          Dialog.alert({
            title: "提示",
            message: "发生了网络错误.请稍后再试."  //error.toString().substring(0, 200)
          });
          //console.log(error);
        });
    },

    sendCode(){
           if(this.timeout!=""){
               return;
           }
            // if(!trendFun.checkPhone(this.phoneNumber)){
            //      Dialog.alert({message:"请输入正确的手机号码."});
            //      return;
            // }           
           let req={
                phone:this.phoneNumber,  // 电话号码   
                type:2 // 1：开通实名，2：添加代扣卡
            }
           axios.post(this.URL2,req).then(response => {
               if (response.data.success) {
                    Dialog.alert({message:"短信验证码已发送到你手机."});
               }else{
                   Dialog.alert(response.data.msg);
                   this.timeout="";
               }
            });

            let i=0, second=60; //倒计时多少秒
            let to=setInterval(_=>{
                if(i<second){
                    this.timeout=(second-i);
                    i++;
                }else{
                    clearInterval(to);
                    this.timeout="";
                    i=0;                   
                }	
            },1000);


    }    
  }
};
</script>

<style lang="scss">
$font-stack: "微软雅黑", "Microsoft YaHei", Helvetica, sans-serif;
$primary-color: #000;
$button-color: #fff048;

// rem 单位换算：定为 75px 只是方便运算，750px-75px、640-64px、1080px-108px，如此类推
$vm_fontsize: 75; // iPhone 6尺寸的根元素大小基准值
@function rem($px) {
  @return ($px / $vm_fontsize) * 1rem;
}
// 根元素大小使用 vw 单位
$vm_design: 750;
html {
  //font-size: ($vm_fontsize / ($vm_design / 2)) * 100vw;  //1vw=3.75px
  // 同时，通过Media Queries 限制根元素最大最小值
  @media screen and (max-width: 320px) {
    font-size: 64px;
  }
  @media screen and (min-width: 540px) {
    font-size: 108px;
  }
}
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小

body {
  color: $primary-color;
  max-width: 540px;
  min-width: 320px;
}
div.bg img {
  max-width: 540px;
  min-width: 320px;

}
div.bg {
  // background: url("bg.jpg") no-repeat;
  width: 100%;

  position: absolute;
  left: 0;
  top: 0;
}
div.bg img {
  width: 100%; /*fixed @3x*/
}
div.center {
  text-align: center;
}
.textarea {
  position: absolute;
  top: 38%;
  width: 100%;
  color: #fff;
}
.textarea p:first-child {
  font-size: 16px;
}
.textarea :nth-child(2) {
  font-size: 30px;
}

.formarea {
  position: absolute;
  left: 0;
  width: 100%;
  top: 52%;
}
.formarea .van-cell-group {
  padding-left: 0;
  width: 224px;
  margin: 0 auto;
  background-color: transparent;
}
.input {
  max-width: 224px;
  margin: 0 auto;
  border: 1px solid #e1c76d;
  border-radius: 46px;
  padding: 8px 15px 8px 12px;
  font-size: 12px;
}
.button {
  max-width: 250px;
  font-size: 12px;
  color: $button-color;
  margin: 0 auto;
  width: 100%;
  //  height: 20px;
  //  line-height: 20px;
  font-weight: bold;
}
div.button img {
  width: 250px;
  min-width: 100%;
}

.texttitle {

  font-size: 16px;
  color: #fff;
  position: absolute;
  top: 72%;
  width: 100%;
}
.textcontent {
  padding: 6px 10px;
  font-size: 12px;
  color: #fff;
  position: absolute;
  top: 74%;
    max-width: 360px;
    text-align: left;
    left: 50%;
    margin-left: -180px;
}
.reset_popup{width: 300px;}
</style>