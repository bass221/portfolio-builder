import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const paidSessions = new Set();

app.use(cors());
app.use(express.json());

// ----------- VERIFY PAYPAL PAYMENT -----------
app.post('/verify-paypal-payment', async (req, res) => {
  const { orderID } = req.body;

  try {
    const auth = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const authData = await auth.json();

    const verifyRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
      },
    });

    const orderData = await verifyRes.json();

    if (orderData.status === 'COMPLETED') {
      console.log('✅ PayPal Payment verified. Order ID:', orderID);
      paidSessions.add(orderID);
      return res.json({ success: true });
    }

    res.status(400).json({ success: false, message: 'Payment not completed.' });
  } catch (err) {
    console.error('❌ PayPal Verification Error:', err);
    res.status(500).json({ success: false, error: 'Verification failed.' });
  }
});

// ----------- DOWNLOAD PROTECTED FILE -----------
app.get('/download', (req, res) => {
  const { session_id } = req.query;

  if (!session_id || !paidSessions.has(session_id)) {
    return res.status(403).json({ error: 'Payment not verified' });
  }

  const filePath = path.resolve('output', 'portfolio.html');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.download(filePath, 'portfolio.html');
});

// ----------- START SERVER -----------
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
