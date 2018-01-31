<template>
  <div>
    <van-nav-bar title="领取优惠券" class="fixed-van-nav-bar"></van-nav-bar>
    <div class="center">
      <img src="./header.png">
    </div>
    <div class="center textarea">
       <p>12.12</p>
       <p>先领券.再分期</p>
       <p>畅玩支付节</p>
    </div>
    <div class="center formarea">
        <van-cell-group>
            <van-field class="input" v-focus="focusState" maxlength="11" v-model="phoneNumber" placeholder="请输入您的手机号码领取免息券" />
        </van-cell-group>
        <van-button type="primary" class="button" @click="getCoupon">立即领取</van-button>
    </div>
    <div class="center texttitle">
      <p @click="showcontent=true">活动规则</p>      
    </div>
    <div class="textcontent" v-show="showcontent">     
      <p>1、用户需要先开通首付出发，输入您的手机号码，点击立即领取。</p>
      <p>2、每位首付出发用户仅能领取一次，不能重复领取；</p>
      <p>3、优惠券领取成功后，在使用首付出发时自动使用免除相应的分期服务费。请在有效期内使用，过期则自动废除。</p>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {Dialog,Toast} from 'vant';
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
      showcontent: false,
      URL:'https://api.github.com/gists/public',
      focusState: false
    };
  },
  directives: {  //自定义指令
      focus: {
        update: function (el,{value}) {
           // console.log(el);
           // console.log(value);
            if(value){
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
    
	  checkPhone(phone){ 		
		  if(!(/^1[345789]\d{9}$/.test(phone))){ 			 
        return false; 
      }
      return true;
    },

    getCoupon(){
      let platform=trendFun.getUrlParam("platform");  //this.$route.query.
      //console.log(platform);

      let phoneNum=this.phoneNumber;       
      if(phoneNum=="" || !this.checkPhone(phoneNum)){        
          Dialog.alert({
              title: '提示',
              message: '手机号码有误，请重填'
          }).then(() => {
            this.focusState=true;  //得到焦点
            setTimeout(()=>{this.focusState=false},2000); //不然就只能一次得到焦点了
          });             
          return;
      }
      let request={
        //smsCode:phoneCode, // 验证码 必填 String
        phoneNum:phoneNum,  //手机号，必填
        type:1,  // 类型，非必填 1 促销短信验证码  用于统计
        desc: "" // 活动描述， 非必填
      }

      const toast=Toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '拼命加载中...'
      });

      axios.post(this.URL, request).then( response=> {  
            toast.clear();
            if(response.data.success){ 
              //console.log( this.data)
             // alert("恭喜您领取成功。");
              Dialog.alert({
                title: '提示',
                message: '恭喜您领取成功。'
              }).then(()=>{
                  if(platform==1){
                    location.href="http://jr.tuniu.com/opl/couponList"; //pc     
                  }else{
                    location.href="http://8.m.tuniu.com/xdm/m/index/ticket";   //Msite        
                  }     

              });

                       
                        

            }else{
              Dialog.alert({
                title: '提示',
                message: response.data.msg
              })
               
            }                    
       }).catch((error) =>{
              toast.clear();
              Dialog.alert({
                title: '提示',
                message: error.toString().substring(0,200)
              })
            //console.log(error);
       });   

    }
  }
};
</script>

<style lang="scss">
$font-stack: '微软雅黑','Microsoft YaHei', Helvetica, sans-serif;
$primary-color: #000;
$button-color:#fff048;
body {
  font: 100% $font-stack;
  color: $primary-color;
}
img {
  max-width:100%
}
div.center{
  text-align: center;
}
.textarea{
  margin-top: -40px;
}
.textarea p:first-child{
  color: #FF8500;
  font-size: 24px;
}
.textarea :nth-child(2){
  font-size: 13px;
}
.textarea :nth-child(3){
  font-size: 28px;
}
.formarea{
  margin-top: 46px;
}
.formarea .van-cell-group{
  padding-left: 0;
}
.input{
  max-width: 320px;
  margin: 0 auto;
  border: 1px solid #ACACAC;
  border-radius: 4px;
  padding: 8px 15px 8px 12px;
}
.button{
  max-width: 320px;
  background-color: #1DBE4F ;
  font-size: 14px;
  color:$button-color;
  margin-top: 19px;
     width: 100%;
     height: 42px; 
     line-height: 42px; 
     font-weight:bold;
}

.texttitle{
  margin-top: 20px;
}
.textcontent{
  margin: 16px auto;
  font-size: 12px;
  color: #999;
  width: 100%;
  max-width: 320px;
}
</style>