module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.PAYSTACK_SECRET_KEY;
  const callback = process.env.PAYSTACK_CALLBACK_URL;

  if (!key || !callback) {
    return res.status(500).json({ error: 'Paystack not configured. Missing env vars.' });
  }

  const body = req.body || {};
  const total = Number(body.total || 0);
  if (!total || total <= 0) return res.status(400).json({ error: 'Invalid total' });

  // NOTE: Paystack requires email; best practice is to collect it at checkout.
  const email = (body.email && String(body.email)) || 'customer@example.com';
  const amount = Math.round(total * 100);

  try {
    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, callback_url: callback })
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(data);

    return res.status(200).json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference
    });
  } catch (e) {
    return res.status(500).json({ error: 'Paystack error', details: e.message });
  }
};
