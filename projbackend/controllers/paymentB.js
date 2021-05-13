const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "kn2tjbh57vgqs5h6",
  publicKey: "wpfdr6ypb3nkdycb",
  privateKey: "493126dfd5ff6663e8557bd8fa2b2da7"
});

exports.getToken = (req, res) => {
	gateway.clientToken.generate({}, function(err, response) {
		if(err) {
			res.status(500).send(err)
		}
		else {
			res.send(response)
		}
	});
}

exports.processPayment = (req, res) => {

	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheClient = req.body.amount;

	gateway.transaction.sale({
	  amount: amountFromTheClient,
	  paymentMethodNonce: nonceFromTheClient,
	  options: {
	    submitForSettlement: true
	  }
	}, (err, result) => {
		if(err) {
			res.status(500).json(err)
		}
		else {
			res.json(result)
		}
		});
}