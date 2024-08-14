const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET);

module.exports = {
    payment: (req, res) => {
        stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'sgd',
            payment_method_types: ['card']
        }, (error, paymentIntent) => {
            if (error) {
                res.status(400).json({
                    success: 0,
                    error: error.message
                });
            } else {
                res.status(200).json({
                    success: 1,
                    data: paymentIntent
                });
            }
        });
    }
}