module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.STRIPE_SECRET_KEY;
  const successUrl = process.env.STRIPE_SUCCESS_URL;
  const cancelUrl = process.env.STRIPE_CANCEL_URL;

  if (!secret || !successUrl || !cancelUrl) {
    return res.status(500).json({ error: 'Stripe not configured. Missing env vars.' });
  }

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return res.status(400).json({ error: 'Cart is empty' });

  const Stripe = require('stripe');
  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });

  const line_items = items.map((it) => ({
    quantity: Number(it.qty || 1),
    price_data: {
      currency: 'gbp',
      unit_amount: Math.round(Number(it.price || 0) * 100),
      product_data: { name: String(it.name || 'Item') }
    }
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: 'Stripe error', details: e.message });
  }
};
