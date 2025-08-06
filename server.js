import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 4242;
const formStore = new Map();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
];

// ✅ Apply middleware FIRST
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Body parsing MUST come before any POST routes
app.use(express.json({ limit: '10mb' }));

// ✅ Save form data (AFTER middleware is applied)
app.post('/api/save-form-data', (req, res) => {
  const { sessionId, formData } = req.body;

  if (!sessionId || !formData) {
    return res.status(400).json({ success: false, message: 'Missing session ID or form data' });
  }

  formStore.set(sessionId, formData);
  res.json({ success: true });
});

// ✅ Create Stripe Checkout Session
app.post("/create-stripe-session", async (req, res) => {
  try {
    const { template, price, name, role } = req.body;

    if (!template || !price || !name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `${template} portfolio - ${name} (${role})`,
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      metadata: {
        template,
        name,
        role
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe session creation failed:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

// ✅ Verify Stripe Checkout Session
app.get('/api/verify-stripe-session', async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ success: false, message: 'No session ID' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const formData = formStore.get(session_id);

    if (!formData) {
      return res.status(404).json({ success: false, message: 'Form data not found' });
    }

    return res.json({ success: true, formData });
  } catch (err) {
    console.error('Stripe session fetch error:', err.message);
    return res.status(500).json({ success: false, message: 'Stripe session fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
