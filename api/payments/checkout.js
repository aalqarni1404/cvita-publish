const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null;

module.exports = async (req, res) => {
  if (!stripe) {
    // Return dummy client secret if Stripe key not configured
    res.status(200).json({ clientSecret: 'dummy_secret' });
    return;
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1999,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
};
