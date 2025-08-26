import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Twilio client setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Store user sessions and journey state
const userSessions = new Map();

// Content template SIDs - populate these as templates are created
const CONTENT_SIDS = {
  // Scene 1: Trip Planning
  tripPlanning: null,

  // Scene 2: Bus Boarding
  busReminder: null,

  // Scene 3: Ferry Transfer
  ferryTransfer: null,

  // Scene 4: Ferry Crossing
  ferryWelcome: null,

  // Scene 5: Metro Connection
  metroConnection: null,

  // Scene 6: Journey Completion
  journeyComplete: null,
};

// ====== SETUP FUNCTIONS ======
// Note: Messaging Service and Phone Number should be set up manually or via separate setup script
// These functions are provided for reference but expect SIDs to be in environment variables

async function createMessagingService() {
  // This should be run separately during setup, not in the main application
  try {
    const service = await client.messaging.v1.services.create({
      friendlyName: "TwiliTransit Service",
      usecase: "mixed", // Use 'mixed' for broader use cases including notifications and marketing
    });

    console.log("Messaging Service created:", service.sid);
    console.log("Add this to your .env file: MESSAGING_SERVICE_SID=" + service.sid);
    return service.sid;
  } catch (error) {
    console.error("Error creating messaging service:", error);
  }
}

async function addPhoneNumberToService() {
  // This should be run separately during setup
  const serviceSid = process.env.MESSAGING_SERVICE_SID;
  const phoneNumberSid = process.env.TWILIO_PHONE_NUMBER_SID; // Add this to your .env

  if (!serviceSid || !phoneNumberSid) {
    console.error("Missing MESSAGING_SERVICE_SID or TWILIO_PHONE_NUMBER_SID in environment variables");
    return;
  }

  try {
    const phoneNumber = await client.messaging.v1.services(serviceSid).phoneNumbers.create({ phoneNumberSid });

    console.log("Phone number added to service:", phoneNumber.sid);
    return phoneNumber.sid;
  } catch (error) {
    console.error("Error adding phone number:", error);
  }
}

// ====== CONTENT TEMPLATE CREATION (Based on Journey Scenes) ======

// Scene 1: Trip Planning - Alex decides to visit Signal City Market
async function createTripPlanningTemplate() {
  const contentData = {
    friendly_name: "scene1_trip_planning",
    language: "en",
    variables: {
      1: "Alex",
    },
    types: {
      "twilio/card": {
        title: "Hi {{1}}! 🚌 Welcome to TwiliTransit",
        body: "Let's help you get to Signal City Market. Your journey starts at Main St. Bus Stop. Would you like a reminder 5 minutes before the bus arrives?",
        actions: [
          {
            type: "reply",
            title: "Yes, remind me",
            payload: "REMIND_YES",
          },
          {
            type: "reply",
            title: "No thanks",
            payload: "REMIND_NO",
          },
        ],
      },
      "twilio/text": {
        body: "Hi {{1}}! Welcome to TwiliTransit. Let's help you get to Signal City Market. Reply YES for bus reminders or NO to skip.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 1 - Trip planning template created:", responseData.sid);
    CONTENT_SIDS.tripPlanning = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating trip planning template:", error.message);
  }
}

// Scene 2: Bus Boarding - Alex's reminder time arrives
async function createBusReminderTemplate() {
  const contentData = {
    friendly_name: "scene2_bus_reminder",
    language: "en",
    variables: {
      1: "Alex",
      2: "12",
      3: "Bay 18",
    },
    types: {
      "twilio/card": {
        title: "🚌 Bus Alert for {{1}}",
        body: "Your bus (#{{2}}) is arriving in 5 minutes at {{3}}. Let us know when you arrive!",
        actions: [
          {
            type: "reply",
            title: "Yes, I'm here",
            payload: "ARRIVED_BUS",
          },
          {
            type: "reply",
            title: "No, I changed my plans",
            payload: "CHANGED_PLANS",
          },
          {
            type: "url",
            title: "View Map & Boarding Pass",
            url: "https://maps.google.com/?q=Main+St+Bus+Stop",
          },
        ],
      },
      "twilio/text": {
        body: "{{1}}, your bus (#{{2}}) arrives in 5 minutes at {{3}}. Reply 'Yes, I'm here' when you arrive or 'No, I changed my plans' if needed.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 2 - Bus reminder template created:", responseData.sid);
    CONTENT_SIDS.busReminder = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating bus reminder template:", error.message);
  }
}

// Scene 3: Ferry Transfer - Alex is nearing the ferry terminal
async function createFerryTransferTemplate() {
  const contentData = {
    friendly_name: "scene3_ferry_transfer",
    language: "en",
    variables: {
      1: "Alex",
    },
    types: {
      "twilio/card": {
        title: "⛴️ Ferry Transfer - {{1}}",
        body: "You're almost at the ferry terminal! Transfer window: 8 minutes. Here's your QR code for express boarding.",
        media: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FERRY_BOARDING_PASS_12345",
        actions: [
          {
            type: "url",
            title: "Directions to Ferry",
            url: "https://maps.google.com/?q=Ferry+Terminal+Riverside",
          },
          {
            type: "reply",
            title: "Let us know when you've docked",
            payload: "AT_FERRY",
          },
        ],
      },
      "twilio/text": {
        body: "{{1}}, you're almost at the ferry terminal! Transfer window: 8 minutes. Reply when you've docked at Riverside Station.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 3 - Ferry transfer template created:", responseData.sid);
    CONTENT_SIDS.ferryTransfer = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating ferry transfer template:", error.message);
  }
}

// Scene 4: Ferry Crossing - Midway through the ferry ride
async function createFerryWelcomeTemplate() {
  const contentData = {
    friendly_name: "scene4_ferry_welcome",
    language: "en",
    variables: {
      1: "Alex",
    },
    types: {
      "twilio/card": {
        title: "🛥️ Welcome Aboard - {{1}}",
        body: "Welcome aboard! Enjoy the view. Here are ferry amenities and your next connection info.",
        actions: [
          {
            type: "url",
            title: "Ferry Amenities",
            url: "https://twilitransit.example.com/ferry-amenities",
          },
          {
            type: "reply",
            title: "Chat with Support",
            payload: "SUPPORT",
          },
          {
            type: "url",
            title: "Route Map",
            url: "https://maps.google.com/?q=Signal+City+Metro",
          },
        ],
      },
      "twilio/text": {
        body: "Welcome aboard, {{1}}! Enjoy the view. We'll guide you to the Signal City Metro when you dock. Reply SUPPORT if you need help.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 4 - Ferry welcome template created:", responseData.sid);
    CONTENT_SIDS.ferryWelcome = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating ferry welcome template:", error.message);
  }
}

// Scene 5: Metro Connection - Ferry arrives at Riverside Station
async function createMetroConnectionTemplate() {
  const contentData = {
    friendly_name: "scene5_metro_connection",
    language: "en",
    variables: {
      1: "Alex",
    },
    types: {
      "twilio/card": {
        title: "🚇 Metro Connection - {{1}}",
        body: "You're arriving at Riverside Station! Your train departs in 12 minutes from Platform 2.",
        actions: [
          {
            type: "reply",
            title: "Show route map & real-time info",
            payload: "METRO_INFO",
          },
          {
            type: "reply",
            title: "Book rideshare instead",
            payload: "RIDESHARE",
          },
          {
            type: "url",
            title: "Platform Map",
            url: "https://maps.google.com/?q=Riverside+Station+Platform+2",
          },
        ],
      },
      "twilio/text": {
        body: "{{1}}, you're arriving at Riverside Station! Your train departs in 12 minutes from Platform 2. Reply METRO for route info or RIDESHARE for alternatives.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 5 - Metro connection template created:", responseData.sid);
    CONTENT_SIDS.metroConnection = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating metro connection template:", error.message);
  }
}

// Scene 6: Journey Completion - Alex arrives at Signal City Market
async function createJourneyCompleteTemplate() {
  const contentData = {
    friendly_name: "scene6_journey_complete",
    language: "en",
    variables: {
      1: "Alex",
    },
    types: {
      "twilio/card": {
        title: "🎉 You've Arrived - {{1}}",
        body: "You've arrived at Signal City Market! Your TwiliTransit journey is complete. Here's your trip summary and receipts.",
        actions: [
          {
            type: "reply",
            title: "Share feedback",
            payload: "FEEDBACK",
          },
          {
            type: "reply",
            title: "Plan your next journey",
            payload: "NEXT_TRIP",
          },
          {
            type: "url",
            title: "Trip Summary & Receipts",
            url: "https://twilitransit.example.com/trip-summary",
          },
        ],
      },
      "twilio/text": {
        body: "🎉 You've arrived at Signal City Market, {{1}}! Your TwiliTransit journey is complete. Reply FEEDBACK to share your experience or NEXT to plan another journey.",
      },
    },
  };

  try {
    const response = await fetch("https://content.twilio.com/v1/Content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64")}`,
      },
      body: JSON.stringify(contentData),
    });

    const responseData = await response.json();
    console.log("Scene 6 - Journey complete template created:", responseData.sid);
    CONTENT_SIDS.journeyComplete = responseData.sid;
    return responseData.sid;
  } catch (error) {
    console.error("Error creating journey complete template:", error.message);
  }
}

// ====== MESSAGING FUNCTIONS ======

async function sendTripPlanningMessage(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.tripPlanning) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.tripPlanning,
        contentVariables: JSON.stringify({
          1: customerName,
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `Hi ${customerName}! Welcome to TwiliTransit. Let's help you get to Signal City Market. Reply YES for bus reminders or NO to skip.`
      );
    }
  } catch (error) {
    console.error("Error sending trip planning message:", error);
    await sendMessage(
      userPhone,
      `Hi ${customerName}! Welcome to TwiliTransit. Reply YES for bus reminders or NO to skip.`
    );
  }
}

async function sendBusArrivalNotification(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.busReminder) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.busReminder,
        contentVariables: JSON.stringify({
          1: customerName,
          2: "12",
          3: "Bay 18",
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `${customerName}, your bus (#12) arrives in 5 minutes at Bay 18. Reply 'Yes, I'm here' when you arrive or 'No, I changed my plans' if needed.`
      );
    }
  } catch (error) {
    console.error("Error sending bus arrival notification:", error);
    await sendMessage(
      userPhone,
      `${customerName}, your bus (#12) arrives in 5 minutes at Bay 18. Reply when you arrive.`
    );
  }
}

async function sendFerryTransferNotification(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.ferryTransfer) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.ferryTransfer,
        contentVariables: JSON.stringify({
          1: customerName,
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `${customerName}, you're almost at the ferry terminal! Transfer window: 8 minutes. Reply FERRY when you arrive.`
      );
    }
  } catch (error) {
    console.error("Error sending ferry transfer notification:", error);
    await sendMessage(userPhone, `${customerName}, you're almost at the ferry terminal! Reply FERRY when you arrive.`);
  }
}

async function sendMetroConnectionNotification(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.metroConnection) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.metroConnection,
        contentVariables: JSON.stringify({
          1: customerName,
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `${customerName}, you're arriving at Riverside Station! Your train departs in 12 minutes from Platform 2. Reply METRO for info.`
      );
    }
  } catch (error) {
    console.error("Error sending metro connection notification:", error);
    await sendMessage(
      userPhone,
      `${customerName}, you're arriving at Riverside Station! Train departs in 12 minutes from Platform 2.`
    );
  }
}

async function sendJourneyCompletion(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.journeyComplete) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.journeyComplete,
        contentVariables: JSON.stringify({
          1: customerName,
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `🎉 You've arrived at Signal City Market, ${customerName}! Your TwiliTransit journey is complete. Reply FEEDBACK to share your experience.`
      );
    }
  } catch (error) {
    console.error("Error sending journey completion:", error);
    await sendMessage(userPhone, `🎉 You've arrived at Signal City Market, ${customerName}! Journey complete.`);
  }

  // Reset session
  const session = userSessions.get(userPhone);
  if (session) {
    session.step = "completed";
    session.completedAt = new Date();
  }
}

// Simple text message fallback
async function sendMessage(userPhone, messageBody) {
  try {
    await client.messages.create({
      from: process.env.MESSAGING_SERVICE_SID,
      to: userPhone,
      body: messageBody,
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function sendFallbackMessage(userPhone) {
  await sendMessage(
    userPhone,
    "Sorry, I didn't understand that. Text 'PLAN MY TRIP' to get started, " +
      "'REROUTE' to change plans, or 'SUPPORT' for help."
  );
}

async function sendWelcomeMessage(userPhone) {
  await sendMessage(
    userPhone,
    "Welcome to TwiliTransit! 🚌 Text 'PLAN MY TRIP to Signal City Market' to get started with your journey."
  );
}

async function sendReminderConfirmation(userPhone, customerName) {
  await sendMessage(
    userPhone,
    `Perfect, ${customerName}! We'll send you a notification 5 minutes before your bus arrives. Have a great trip! 🚌`
  );
}

async function sendNoReminderMessage(userPhone, customerName) {
  await sendMessage(
    userPhone,
    `No problem, ${customerName}! Your bus (#12) departs from Main St. Bus Stop at Bay 18. ` +
      `Text ARRIVED when you board, or REROUTE if plans change. Safe travels! 🚌`
  );
}

async function sendFerryWelcomeMessage(userPhone, customerName) {
  try {
    if (CONTENT_SIDS.ferryWelcome) {
      await client.messages.create({
        from: process.env.MESSAGING_SERVICE_SID,
        to: userPhone,
        contentSid: CONTENT_SIDS.ferryWelcome,
        contentVariables: JSON.stringify({
          1: customerName,
        }),
      });
    } else {
      await sendMessage(
        userPhone,
        `Welcome aboard the ferry, ${customerName}! 🛥️ Enjoy the scenic view. ` +
          `In about 12 minutes, we'll guide you to the Signal City Metro for the final leg of your journey.`
      );
    }
  } catch (error) {
    console.error("Error sending ferry welcome message:", error);
    await sendMessage(
      userPhone,
      `Welcome aboard the ferry, ${customerName}! 🛥️ Enjoy the view. ` +
        `In about 12 minutes, we'll guide you to the Signal City Metro for the final leg of your journey.`
    );
  }
}

// ====== MESSAGE HANDLING LOGIC ======

async function handleUserMessage(userPhone, messageBody, session) {
  const message = messageBody.toUpperCase().trim();

  switch (session.step) {
    case "initial":
      if (message.includes("PLAN") && message.includes("TRIP")) {
        await sendTripPlanningMessage(userPhone, session.name);
        session.step = "awaiting_reminder_choice";
      } else {
        await sendWelcomeMessage(userPhone);
      }
      break;

    case "awaiting_reminder_choice":
      if (message === "REMIND_YES" || message === "YES") {
        session.reminderActive = true;
        session.step = "reminder_set";
        await sendReminderConfirmation(userPhone, session.name);
        // Schedule bus notification (5 seconds for demo, 5 minutes in production)
        setTimeout(() => sendBusArrivalNotification(userPhone, session.name), 5000);
      } else if (message === "REMIND_NO" || message === "NO") {
        session.step = "no_reminder";
        await sendNoReminderMessage(userPhone, session.name);
      }
      break;

    case "reminder_set":
    case "no_reminder":
      await handleJourneyUpdates(userPhone, message, session);
      break;

    case "on_bus":
      await handleJourneyUpdates(userPhone, message, session);
      break;

    case "on_ferry":
      await handleJourneyUpdates(userPhone, message, session);
      break;

    case "at_metro":
      await handleJourneyUpdates(userPhone, message, session);
      break;

    case "completed":
      await handlePostJourneyMessage(userPhone, message, session);
      break;

    default:
      await handleGeneralMessage(userPhone, message, session);
  }
}

async function handleJourneyUpdates(userPhone, message, session) {
  switch (message) {
    case "ARRIVED_BUS":
    case "ARRIVED":
      await sendMessage(
        userPhone,
        `Great! Enjoy the bus ride, ${session.name}. We'll notify you about the ferry transfer soon. 🚌`
      );
      // Schedule ferry notification (10 seconds for demo)
      setTimeout(() => sendFerryTransferNotification(userPhone, session.name), 10000);
      session.step = "on_bus";
      break;

    case "AT_FERRY":
    case "FERRY":
      await sendFerryWelcomeMessage(userPhone, session.name);
      session.step = "on_ferry";
      // Schedule metro notification (15 seconds for demo)
      setTimeout(() => sendMetroConnectionNotification(userPhone, session.name), 15000);
      break;

    case "METRO_INFO":
    case "METRO":
      await sendMessage(
        userPhone,
        `🚇 ${session.name}, Platform 2 is just ahead! Follow signs for Signal City Line. ` +
          `Your train arrives in 8 minutes. Final stop: Signal City Market.`
      );
      session.step = "at_metro";
      // Schedule journey completion (10 seconds for demo)
      setTimeout(() => sendJourneyCompletion(userPhone, session.name), 10000);
      break;

    case "RIDESHARE":
      await sendMessage(
        userPhone,
        `🚗 ${session.name}, I can help you book a rideshare! Estimated time to Signal City Market: 15 minutes, ` +
          `cost: $12-18. Reply BOOK to continue or METRO to stick with the train.`
      );
      break;

    case "BOOK":
      await sendMessage(
        userPhone,
        `🚗 Great choice! Your rideshare is booked. Driver: Maria (Blue Honda Civic, License: ABC123) ` +
          `will arrive in 3 minutes at the main station exit. Trip to Signal City Market: ~15 minutes.`
      );
      session.step = "rideshare_booked";
      setTimeout(() => sendJourneyCompletion(userPhone, session.name), 10000);
      break;

    case "REROUTE":
      await handleReroute(userPhone, session);
      break;

    case "CHANGED_PLANS":
      await handleReroute(userPhone, session);
      break;

    default:
      await sendMessage(userPhone, "Thanks for the update! We'll keep you posted on your journey. 🚀");
  }
}

async function handleReroute(userPhone, session) {
  await sendMessage(
    userPhone,
    `No problem! 🔄 TwiliTransit is here to help. ` +
      `Reply with your new destination or text SUPPORT to chat with our team.`
  );
  session.step = "rerouting";
}

async function handlePostJourneyMessage(userPhone, message, session) {
  switch (message) {
    case "FEEDBACK":
      await sendMessage(
        userPhone,
        `Thank you for your feedback, ${session.name}! 📝 ` +
          `Rate your TwiliTransit experience (1-5): Reply with a number, or visit our feedback portal.`
      );
      break;

    case "NEXT_TRIP":
    case "NEXT":
      await sendMessage(
        userPhone,
        `Ready for another adventure, ${session.name}? 🚀 ` + `Text 'PLAN MY TRIP to [destination]' to get started!`
      );
      session.step = "initial";
      break;

    default:
      if (message.match(/^[1-5]$/)) {
        await sendMessage(
          userPhone,
          `Thanks for rating us ${message}/5, ${session.name}! ⭐ ` + `Your feedback helps us improve. Safe travels!`
        );
      } else {
        await sendMessage(
          userPhone,
          `Thanks for riding TwiliTransit, ${session.name}! ` + `Reply NEXT for another trip or SUPPORT for help.`
        );
      }
  }
}

async function handleGeneralMessage(userPhone, message, session) {
  if (message === "SUPPORT") {
    await sendMessage(
      userPhone,
      `🎧 TwiliTransit Support is here to help! ` +
        `For immediate assistance, call (555) 123-TRANSIT or continue texting for help.`
    );
  } else {
    await sendFallbackMessage(userPhone);
  }
}

// ====== ROUTES ======

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "TwiliTransit API is running",
    timestamp: new Date().toISOString(),
    contentSids: CONTENT_SIDS,
  });
});

// Main webhook handler
app.post("/webhook", async (req, res) => {
  const { From, Body, MessageSid } = req.body;
  const userPhone = From;

  console.log(`Received message from ${userPhone}: ${Body}`);

  // Get or create user session
  let session = userSessions.get(userPhone) || {
    step: "initial",
    name: "Alex", // In production, you'd fetch this from your user database
    reminderActive: false,
    createdAt: new Date(),
  };

  try {
    await handleUserMessage(userPhone, Body, session);
    userSessions.set(userPhone, session);
  } catch (error) {
    console.error("Error handling message:", error);
    await sendFallbackMessage(userPhone);
  }

  res.status(200).send("OK");
});

// Analytics endpoint
app.get("/analytics", (req, res) => {
  const stats = {
    totalUsers: userSessions.size,
    journeySteps: {},
    contentTemplates: CONTENT_SIDS,
    timestamp: new Date().toISOString(),
  };

  for (const [phone, session] of userSessions) {
    const step = session.step;
    stats.journeySteps[step] = (stats.journeySteps[step] || 0) + 1;
  }

  res.json(stats);
});

// Setup endpoint to create all content templates
app.post("/setup-templates", async (req, res) => {
  try {
    console.log("Creating content templates...");

    await createTripPlanningTemplate();
    await createBusReminderTemplate();
    await createFerryTransferTemplate();
    await createFerryWelcomeTemplate();
    await createMetroConnectionTemplate();
    await createJourneyCompleteTemplate();

    res.json({
      message: "Content templates created successfully",
      contentSids: CONTENT_SIDS,
    });
  } catch (error) {
    console.error("Error setting up templates:", error);
    res.status(500).json({ error: "Failed to create templates" });
  }
});

// Clear user sessions (for testing)
app.post("/clear-sessions", (req, res) => {
  userSessions.clear();
  res.json({ message: "User sessions cleared" });
});

// ====== SERVER STARTUP ======

app.listen(port, async () => {
  console.log(`TwiliTransit server running on port ${port}`);
  console.log(`Webhook URL: ${process.env.WEBHOOK_URL}/webhook`);
  console.log("");
  console.log("To set up content templates, POST to /setup-templates");
  console.log("To view analytics, GET /analytics");
  console.log("To clear test sessions, POST /clear-sessions");

  // Validate environment variables
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("⚠️  Warning: Twilio credentials not found in environment variables");
  }

  if (!process.env.MESSAGING_SERVICE_SID) {
    console.warn(
      "⚠️  Warning: MESSAGING_SERVICE_SID not found - create a messaging service and add the SID to your .env file"
    );
  }

  if (!process.env.TWILIO_PHONE_NUMBER_SID) {
    console.warn("⚠️  Warning: TWILIO_PHONE_NUMBER_SID not found - add your phone number SID to your .env file");
  }
});
