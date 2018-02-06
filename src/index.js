import React from "react";
import ReactDOM from "react-dom";

//import { Button,MessageBox,Message,Dialog } from 'element-react';
import 'element-theme-default';

import './css/reset.css'
import './css/index.css'

import {Logo,Box} from "./components/logo"
import {Formarea} from './components/formarea'


// export default class App1 extends React.Component {
//     constructor(){
//       super(); 
   
//     }

//     render() {
//       return(
//         <div>
//             <Logo/>
//             <Box/> 
//             <div  className="text1 fff">先领券 再分期</div>
//             <div  className="text2 fff">畅玩支付节</div>
//             <Formarea />            
//             <div className="text1 fff textarea textLeft">活动规则</div>
//             <div className="text3 fff textarea textLeft">
//                 <p>1、用户需要先开通首付出发，然后输入您的手机号码，点击获取验证码；</p>
//                 <p>2、输入验证码，点击领取免息券按钮，领取成功；</p>
//                 <p>3、首付出发是途牛金服打造的旅游消费新玩法，用户支付首付款即可出发看世界，余款享受分期还款服务；</p>
//                 <p>4、每位首付出发用户仅能领取一张免息券，不能重复领取；</p>
//                 <p>5、免息券领取成功后，在使用首付出发时自动使用免除相应的分期服务费。免息券需要在2018年1月15日前使用，过期则自动废除。</p>
//             </div>
//         </div>    
//       )
//     }
// }
const App=()=>{
    return(
      <div>
          <Logo/>
          <Box/> 
          <div  className="text1 fff">先领券 再分期</div>
          <div  className="text2 fff">首付出发优惠券</div>
          <Formarea />            
          <div className="text1 fff textarea textLeft">活动规则</div>
          <div className="text3 fff textarea textLeft">
              <p>1、用户需要先开通首付出发，然后输入您的手机号码，点击获取验证码；</p>
              <p>2、输入验证码，点击领取免息券按钮，领取成功；</p>
              <p>3、首付出发是途牛金服打造的旅游消费新玩法，用户支付首付款即可出发看世界，余款享受分期还款服务；</p>
              <p>4、每位首付出发用户仅能领取一张免息券，不能重复领取；</p>
              <p>5、免息券领取成功后，在使用首付出发时自动使用免除相应的分期服务费。免息券需要在2018年1月15日前使用，过期则自动废除。</p>
          </div>
      </div>    
    )
}

ReactDOM.render(<App />, document.getElementById("root"));