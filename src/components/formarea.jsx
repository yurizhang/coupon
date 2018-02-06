import React from "react";
import axios from "axios"
import qs from 'qs';
import { Button,MessageBox,Message, Notification, Dialog,Form,Input } from 'element-react';
import btn_area from '../img/btn_area.png';
import btn from '../img/btn.png';
// const onClick=()=>{
//     MessageBox.prompt('请输入邮箱', '提示', {
//       inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
//       inputErrorMessage: '邮箱格式不正确'
//     }).then(({ value }) => {
//       Message({
//         type: 'success',
//         message: '你的邮箱是: ' + value
//       });
//     }).catch(() => {
//       Message({
//         type: 'info',
//         message: '取消输入'
//       });
//     });
//   }



// axios.defaults.withCredentials = true;
//axios.defaults.headers.common['Content-Type'] ="application/json;charset=UTF-8";
//axios.defaults.headers.common['Content-Type'] ="application/x-www-form-urlencoded";
//headers: {'Content-Type': 'application/x-www-form-urlencoded'}
// axios.defaults.headers.post['withCredentials'] = true;
export  class Formarea extends React.Component {
    constructor(){
      super(); 
      this.state ={
        dialogVisible: false,
        phoneNumber:"",
        code:"",
        // URL: "https://jr.tuniu.com/opl/promotion/getGift",
        // URL2: "https://jr.tuniu.com/opl/promotion/sendMessage",  //验证码

        URL: "http://10.10.32.237:8181/opl/promotion/getGift",
        URL2: "http://10.10.32.237:8181/opl/promotion/sendMessage",  //验证码   

        timeout:"",

      }
    }
    
    //确定领取
    getCoupon2() {

        //this.setState({ dialogVisible: false })
        if(!this.checkPhone(this.state.phoneNumber)){
            MessageBox.msgbox({
                title: '提示',
                message: '您输入的手机号码有误',
                type:"error",
                showCancelButton: false
              }).then((action)=>{
                  //console.log(action)
                  document.getElementById("phoneNumber").focus();
              });
              return;
        }
        
        let code = this.state.code;
        if (code == "") {   
        //   MessageBox.alert('请输入验证码', '提示').then((action)=>{
        //     //console.log(action)
        //     document.getElementById("code").focus();            
        //   });
         
        
            MessageBox.msgbox({
                title: '提示',
                message: '您输入验证码有误',
                type:"error",
                showCancelButton: false
            }).then((action)=>{
                document.getElementById("code").focus(); 
                // document.getElementById("phoneNumber").focus();
            });
            return;
        }

  
        //return;
        let request = {
          smsCode: code, // 验证码 必填 String
          phoneNum: this.state.phoneNumber, //手机号，必填
          type: 1, // 类型，非必填 1 促销短信验证码  用于统计
          desc: "" // 活动描述， 非必填
        };
  
        
        axios.post(this.state.URL, qs.stringify(request)).then(response => {
           
            if (response.data.success) {
              //console.log( this.data)
              // alert("恭喜您领取成功。");
                // MessageBox.alert('恭喜您领取成功。', '提示').then(() => {
                //     //if (platform == 1) {
                //     location.href = "http://jr.tuniu.com/opl/couponList"; //pc
                //     //} else {
                //     //location.href = "http://8.m.tuniu.com/xdm/m/index/ticket"; //Msite
                //     //}
                // });
                MessageBox.msgbox({
                    title: '提示',
                    message: '恭喜您领取成功。',
                    type:"success",
                    showCancelButton: false
                  }).then((action)=>{
                      location.href = "http://jr.tuniu.com/opl/couponList";
                     // document.getElementById("phoneNumber").focus();
                  });




            }else{
                MessageBox.msgbox({
                    title: '提示',
                    message: response.data.msg,
                    type:"info",
                    showCancelButton: false
                  }).then((action)=>{                     
                     // document.getElementById("phoneNumber").focus();
                  });          
            }
          }).catch(error => {
                MessageBox.alert("发生了网络错误，请稍后再试.", '提示');
                //console.log(error);
          });
      }
    sendCode(){
        //console.log("entry this.state.timeout:"+this.state.timeout)
        if(!this.checkPhone(this.state.phoneNumber)){
            MessageBox.msgbox({
                title: '提示',
                message: '您输入的手机号码有误',
                type:"error",
                showCancelButton: false
              }).then((action)=>{
                  //console.log(action)
                  document.getElementById("phoneNumber").focus();
              });
              return;
        }      
        
        if(this.state.timeout!=""){
            //this.setState({ dialogVisible: true });
            Message({
                type: 'error',
                message: "请在"+this.state.timeout+"秒后再试"
            });
            return;
        }        
        let to;
        let request={
            "phoneNum":this.state.phoneNumber,  // 电话号码   
            "type":2 // 1：开通实名，2：添加代扣卡
        }
        //qs.stringify({ params: request })
       axios.post(this.state.URL2, qs.stringify(request)).then(response => {
            //console.log(response)
           if (response.data.success) {
                // Notification({
                //     title: '成功',
                //     message: '验证码已发送到您的手机，请查收.',
                //     type: 'success'
                // }); 
                MessageBox.msgbox({
                    title: '提示',
                    message: '验证码已发送到您的手机，请查收.',
                    type:"success",
                    showCancelButton: false
                  }).then((action)=>{
                      //console.log(action)
                     // document.getElementById("phoneNumber").focus();
                  });



               // this.setState({ dialogVisible: true });
                let i=0, second=60; //倒计时多少秒
                to=setInterval(_=>{
                    if(i<second){              
                        this.setState({timeout:(second-i)});
                        i++;
                    }else{
                        clearInterval(to);
                        this.setState({timeout:""});                
                        i=0;                   
                    }	
                },1000);
           }else if(response.data.errorCode==1600300){           
              
               this.setState({timeout:""}); 
               //console.log("this.state.timeout:"+this.state.timeout);

               //this.setState({ dialogVisible: false });  //不要显示验证码
                //  Message({
                //     type: 'error',
                //     message: response.data.msg
                // });
                MessageBox.msgbox({
                    title: '提示',
                    message: '您尚未开通首付出发，请先开通',
                    type:"error",
                    confirmButtonText: "去开通",
                    showCancelButton: false
                  }).then((action)=>{
                      //console.log(action)
                      if(action!="cancel"){
                        location.href='http://jr.tuniu.com/opl/apply/open';
                      }
                  });

           } else{
                clearInterval(to);
                this.setState({timeout:""});                 
                //this.setState({ dialogVisible: false });  //不要显示验证码
                // Message({
                //     type: 'error',
                //     message: response.data.msg
                // });

                MessageBox.msgbox({
                    title: '提示',
                    message:  response.data.msg,
                    type:"error",
                    showCancelButton: false
                  }).then((action)=>{
                      //console.log(action)
                     // document.getElementById("phoneNumber").focus();
                  });

           }
        });

    

    

    }
    checkPhone(phone) {
        if (!/^1[345789]\d{9}$/.test(phone)) {
          return false;
        }
        return true;
    }
    render(){
        return(
           
            <div className="formarea">
                    <div><img src={btn_area} /></div>
                    <div className="operate">
                        <div className="operateFirstDiv">
                            <p>
                            <input type="text" value={this.state.phoneNumber} className="phoneNumber" id="phoneNumber" placeholder="请输入您的手机号码" maxLength="11" onChange={(event)=>{ this.setState({phoneNumber: event.target.value})}} />
                            </p>
                            <p className="codeandBtn">
                            <input type="text" value={this.state.code} className="phoneNumber code" id="code" placeholder="输入验证码" maxLength="6" onChange={(event)=>{ this.setState({code: event.target.value})}} />
                            
                            <Button className="btn" onClick={ () => this.sendCode()}>获取验证码{this.state.timeout}</Button>
                            </p>
                        </div>
                        <div>
                            <img onClick={ () => this.getCoupon2() } src={btn} />
                        </div>
                    </div>
   
          </div>      
           

            
            
        )
    }
}



// export const Formarea1=(props)=>{  
//     console.log(props);    
//     return (
//         <div className="formarea">
//             <div><img src={btn_area} /></div>
//             <div className="operate">
//                 <input type="text" maxLength="11"/>
//                 <img onClick={props.onClick} src={btn} />
//             </div>
//         </div>
//      )
// }