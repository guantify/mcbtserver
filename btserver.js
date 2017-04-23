var express = require("express");
var app = express();
var braintree = require("braintree");
var bodyParser = require("body-parser");
var firebase = require('firebase')

var config = {
  apiKey: "AIzaSyClBEgw0xcXx41wr9o7Y1RgkLeu9d98nXY",
  authDomain: "mancave-fb4d9.firebaseapp.com",
  databaseURL: "https://mancave-fb4d9.firebaseio.com",
  projectId: "mancave-fb4d9",
  storageBucket: "mancave-fb4d9.appspot.com",
  messagingSenderId: "961759768654"
  };
firebase.initializeApp(config);


app.use(bodyParser.json());

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'qqx83x2vznt8p555',
    publicKey:    '9wvrcdmnv4s2bjvn',
    privateKey:   '93231427d86390473accdbe623d9d890'
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

/*
gateway.clientToken.generate({}, function (err, response) {
  var clientToken = response.clientToken
});

gateway.clientToken.generate({
  customerId: aCustomerId
}, function (err, response) {
  var clientToken = response.clientToken
});
*/

app.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    console.log("error is " + JSON.stringify(err));
    console.log("result is " + JSON.stringify(result));
    if (err != null) {

      res.send("error is " + JSON.stringify(err));
    } else {
      if (result['errors'] != null) {
        res.send("err is " + JSON.stringify(result['errors']));
      } else {
        res.send("success");
      }
      
    }
  });
});



app.listen(3333);