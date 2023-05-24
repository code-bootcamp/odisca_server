export const verificationCode = String(
  Math.floor(Math.random() * 1000000),
).padStart(6, '0');
export const template = `
<html>
  <body>
  <tr>
    <td align="left" valign="top" height="50" colspan="3">
      <style="vertical-align:bottom;" loading="lazy">
    </td>
  </tr> 	
  <tr>
    <td width="50"></td>
    <td width="660"> 		
    <!-- 본문 --> 		
    <table width="660" border="0" cellspacing="0" cellpadding="0"> 			
      <tbody>
        <tr>
          <td>
            <span style="font-family:굴림; color:#333333; font-size:12px; line-height:1.5;"> 
                    안녕하세요, ODISCA 입니다. 
              <br> 
              회원님께서 요청하신 인증번호입니다.   
              <br> 
              <hr background-color:blue>
              <br>				
            </span>
          </td>
        </tr>
              <tr>
          <td align="center" height="150"> 					
            <table width="561" border="0" cellspacing="0" cellpadding="0"> 						
              <tbody>
                <tr>
                  <td colspan="3"> 								
                    <img src="https://certify.ybmnet.co.kr/newJoin/images/mail_box_blueR_01.gif" style="vertical-align:bottom;" loading="lazy">
                  </td>
                </tr> 						
                <tr>
                  <td width="30"> 								
                    <img src="https://certify.ybmnet.co.kr/newJoin/images/mail_box_blueR_02.gif" style="vertical-align:bottom;" loading="lazy">
                  </td>
                  <td align="center" valign="middle" width="501" style="background:#f4f8fc;"> 								
                    <span style=" font-family:굴림; color:#2985cc; font-size:18px; font-weight:bold; line-height:2.0; padding-right:20px;">인증번호 :${verificationCode} </span> 								
                    <span style="font-family:tahoma; color:#333333; font-size:24px; font-weight:bold; line-height:1.5;"> </span> 							
                  </td>
                  <td width="30"> 								
                    <img src="https://certify.ybmnet.co.kr/newJoin/images/mail_box_blueR_03.gif" style="vertical-align:bottom;" loading="lazy">
                  </td>
                </tr> 						
                  <tr>
                    <td colspan="3"> 								
                      <img src="https://certify.ybmnet.co.kr/newJoin/images/mail_box_blueR_04.gif" style="vertical-align:bottom;" loading="lazy">
                    </td>
                  </tr> 					
              </tbody>
            </table> 				
          </td>
        </tr> 			
        <tr>
          <td>&nbsp;</td>
        </tr>
  </body>
</html>
`;
