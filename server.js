import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const paidSessions = new Set();

// Middleware
app.use(cors());
app.use(express.json());

// Stripe webhook (must come before bodyParser.json!)
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log("✅ Payment succeeded. Session ID:", session.id);
    paidSessions.add(session.id);
  }

  res.status(200).json({ received: true });
});

// Create checkout session
app.post("/create-checkout-session", async (req, res) => {
  const { template } = req.body;

  const prices = {
    minimal: 200,   // $2.00
    creative: 1000, // $10.00
  };

  const priceInCents = prices[template] || 1500;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${template.charAt(0).toUpperCase() + template.slice(1)} Template`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://portfolio-builder-sepia.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://portfolio-builder-sepia.vercel.app/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe checkout session failed." });
  }
});

// Verify session
app.get("/verify-session", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id || !paidSessions.has(session_id)) {
    return res.status(403).json({ success: false, message: "Payment not verified" });
  }

  res.json({ success: true });
});

// Download portfolio
app.get('/download', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id || !paidSessions.has(session_id)) {
    return res.status(403).json({ error: "Payment not verified" });
  }

  const filePath = path.resolve('output', 'portfolio.html');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  res.download(filePath, 'portfolio.html');
});

// Start server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
