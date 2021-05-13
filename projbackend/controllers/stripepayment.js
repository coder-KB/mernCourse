const stripe = require("stripe")("sk_test_51I8A31DfmGF4h3QP0ZgadpdaR1yd3UihOVGcjLH2XqOpFHFoXwnqU1pS5qkR857P7CvBk2X1KPFwhXo5kL5OaoNV00Ttgz8xSu")
const uuid = require("uuid/v4")

exports.makePayment = (req, res) => {
	const {products, token} = req.body;
	console.log("PRODUCTS, ", products);

	let amount = 0;
	products.map(p => (
		amount = amount + p.price
	))

	const idempotencyKey = uuid();

	return stripe.customers.create({
		email: token.email,
		source: token.id,
	})
	.then(customer => {
		stripe.charges.create({
			amount: amount * 100,
			currency: 'usd',
			customer: customer.id,
			receipt_email: token.email,
			description: "a test account",
			shipping: {
				name: token.card.name,
				address: {
					line1: token.card.address_line1,
					line2: token.card.address_line2,
					city: token.card.address_city,
					country: token.card.address_country,
				}
			}
		}, {idempotencyKey})
		.then(result => res.status(200).json(result))
		.catch(error => console.log(error))
	})
}