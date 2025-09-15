import express from 'express';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes will be added here
app.post('/sender/rcs/webhook', (req, res) => {})

app.post('/sender/sms/webhook', (req, res) => {})

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'TwiliTransit API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`TwiliTransit server running on port ${port}`);
});