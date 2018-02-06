<template>
  <div class="container center" :style="body">
     <!-- <van-nav-bar title="领取优惠券" class="fixed-van-nav-bar"></van-nav-bar>  -->



      
          <div class="logo"><img src="./logo.png"></div>  
          <div class="box"><img src="./box.png"></div>        
          <div class="center textarea">        
            <p>先领券.再分期</p>
            <p>首付出发优惠券</p>
          </div> 

   
          <div class="center formarea">
              <div class="formarea1"><img src="./formarea.png"></div>
              <div class="formarea2">
              <p>
                  <input type="text" v-model="phoneNumber"  class="input" placeholder="请输入您的手机号码" maxLength="11" />            
              </p>
              <p class="codearea">
                   <input type="text" v-model="code" class="input code"  placeholder="输入验证码" maxLength="6" />                  
                   <van-button size="small" class="codeBtn" @click="sendCode">获取验证码{{timeout}}</van-button>
              </p>
              <p class="button" @click="getCoupon2"><img src="./btn.png"></p> 
              </div>             
          </div>

          <div class="center texttitle">
            <p @click="showcontent=true"><a href="javascript:;">活动规则</a></p>      
          </div>

          <div  class="textcontent" v-show="showcontent">              
              <p>1、用户需要先开通首付出发，输入您的手机号码，点击立即领取。</p>
              <p>2、每位首付出发用户仅能领取一次，不能重复领取；</p>
              <p>3、优惠券领取成功后，在使用首付出发时自动使用免除相应的分期服务费。请在有效期内使用，过期则自动废除。</p>          
            
          </div>

      

 
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
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
      code: "",
      showcontent: false,
      // URL: "https://jr.tuniu.com/opl/promotion/getGift",
      // URL2: "https://jr.tuniu.com/opl/promotion/sendMessage",  //验证码
      URL: "http://10.10.32.237:8181/opl/promotion/getGift",
      URL2: "http://10.10.32.237:8181/opl/promotion/sendMessage", //验证码

      focusState: false,
      body: {
            backgroundImage: "url(" + require("./bg.jpg") + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%"
            // marginTop: "5px",
      },

      //popupShow: false,  //验证码框显示
      //倒计时
      timeout: ""
    };
  },
  // directives: {
  //   //自定义指令
  //   focus: {
  //     update: function(el, { value }) {
  //        console.log(el);
  //        console.log(value);
  //       if (value) {
  //         el.focus();
  //        // el.querySelector("input[type=text]").focus();
  //       }
  //     }
  //   }
  // },

  methods: {
    // writeCookie() {
    //   let phoneNumber, token, appVersion;
    //   phoneNumber = this.$refs.phoneNumber.value;
    //   trendFun.setCookie("phoneNumber", phoneNumber, 10); //15911110002
    // },

    checkPhone(phone) {
      if (!/^1[345789]\d{9}$/.test(phone)) {
        return false;
      }
      return true;
    },

    getCoupon2() {
      let phoneNum = this.phoneNumber;
      if (phoneNum == "" || !this.checkPhone(phoneNum)) {
        Dialog.alert({
          title: "提示",
          message: "您输入的手机号码有误"
        }).then(() => {
          this.focusState = true; //得到焦点
          setTimeout(() => {
            this.focusState = false;
          }, 2000); //不然就只能一次得到焦点了
        });
        return;
      }

      let code = this.code;
      if (code == "") {
        Dialog.alert({
          title: "提示",
          message: "您输入验证码有误"
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

      axios
        .post(this.URL, qs.stringify(request))
        .then(response => {
          toast.clear();
          if (response.data.success) {
            //console.log( this.data)
            // alert("恭喜您领取成功。");
            Dialog.alert({
              title: "提示",
              message: "恭喜您领取成功。"
            }).then(() => {
              location.href = "http://8.m.tuniu.com/xdm/m/index/ticket"; //Msite
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
            message: "发生了网络错误.请稍后再试." //error.toString().substring(0, 200)
          });
          //console.log(error);
        });
    },

    sendCode() {
      let phoneNum = this.phoneNumber;
      if (phoneNum == "" || !this.checkPhone(phoneNum)) {
        Dialog.alert({
          title: "提示",
          message: "您输入的手机号码有误"
        }).then(() => {
          this.focusState = true; //得到焦点
          setTimeout(() => {
            this.focusState = false;
          }, 2000); //不然就只能一次得到焦点了
        });
        return;
      }

      if (this.timeout != "") {
        Dialog.alert({
          title: "提示",
          message: "请在" + this.timeout + "秒后再试" //error.toString().substring(0, 200)
        });
        return;
      }
      // if(!trendFun.checkPhone(this.phoneNumber)){
      //      Dialog.alert({message:"请输入正确的手机号码."});
      //      return;
      // }
      let to;
      let request = {
        phoneNum: this.phoneNumber, // 电话号码
        type: 2 // 1：开通实名，2：添加代扣卡
      };
      // 不能是qs.stringify({params:request})  那样就成了formdata
      axios.post(this.URL2, qs.stringify(request)).then(response => {
        if (response.data.success) {
          Dialog.alert({ message: "短信验证码已发送到您手机." });
          //this.popupShow=true; //显示输入验证码框
          let i = 0,
            second = 60; //倒计时多少秒
          to = setInterval(_ => {
            if (i < second) {
              this.timeout = second - i;
              i++;
            } else {
              clearInterval(to);
              this.timeout = "";
              i = 0;
            }
          }, 1000);
        } else if (response.data.errorCode == 1600300) {
          clearInterval(to);
          this.timeout = "";
          //this.popupShow=false; //关闭输入验证码框
          Dialog.alert({
            title: "提示",
            confirmButtonText: "去开通",
            message: response.data.msg //error.toString().substring(0, 200)
          }).then(action => {
            // alert(action);
            location.href =
              " https://8.m.tuniu.com/xdm/m/index/nsf/agreement/0/2";
            //alert("好");
          });
        } else {
          //console.log(response)
          clearInterval(to);
          this.timeout = "";
          //this.popupShow=false; //关闭输入验证码框
          Dialog.alert({ title: "提示", message: response.data.msg });
        }
      });
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
//$vm_design: 750;
// html {
//   //font-size: ($vm_fontsize / ($vm_design / 2)) * 100vw;  //1vw=3.75px
//   // 同时，通过Media Queries 限制根元素最大最小值
//   @media screen and (max-width: 320px) {
//     font-size: 64px;
//   }
//   @media screen and (min-width: 540px) {
//     font-size: 108px;
//   }
// }
// body 也增加最大最小宽度限制，避免默认100%宽度的 block 元素跟随 body 而过大过小

body {
  color: $primary-color;
  background-color: #fc9a2d;
  // max-width: 540px;
  // min-width: 320px;
}

div.center {
  text-align: center;
}
.container {
  background-color: #fc9a2d;
  // max-width: 540px;
  // min-width: 320px;
  min-height: 667px;
  overflow-y: hidden;
}
.logo {
  text-align: left;
  padding: 20px;
}
.box {
  margin-top: -80px;
}
.textarea {
  width: 100%;
  color: #fff;
}
.textarea p:first-child {
  font-size: 16px;
}
.textarea :nth-child(2) {
  font-size: 30px;
}
.formarea1 {
  margin: 0 auto;
}
.formarea2 {
  position: relative;
  left: 0;
  top: -130px;
}
.formarea {
  height: 150px;
  width: 100%;
  margin-top: 20px;
}
.formarea .input {
  width: 224px;
  height: 28px;
  margin: 0 auto;
  border: 1px solid #e1c76d;
  border-radius: 8px;
  padding: 10px;
  font-size: 12px;
}
.formarea .code {
  width: 120px;
}
.formarea .codearea {
  margin-top: 6px;
}
.formarea .codeBtn {
  width: 96px;
  height: 28px;
  line-height: 20px;
  background-color: #4dd0e2;
  color: #fff;
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

  width: 100%;
}
.texttitle a {
  text-decoration: underline;
  color: #fff;
}
.textcontent {
  padding: 6px 10px;
  font-size: 12px;
  color: #fff;
  text-align: left;
  // max-width: 360px;
  // left: 50%;
  // margin-left: -180px;
}

</style>