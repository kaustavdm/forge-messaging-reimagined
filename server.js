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

// --------------------------
// Add routes here
// --------------------------

// Incoming webhook for messages sent to Twilio phone number
// Respond with a valid TwiML
// (we use an empty TwiML here to show the payload sent by Twilio)
app.post('/webhook/incoming', (req, res) => {
  const emptytwiml = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'

  const { From, Body} = req.body
  console.log(From, Body)
  console.log(JSON.stringify(req.body, null, 2))

  // respond with empty response on the webhook
  res.type("text/xml").send(emptytwiml.toString())
})

// --------------------------
// Health check and server start
// --------------------------
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