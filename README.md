
# Twilio Forge: Messaging Reimagined

This repository contains follow-along steps and resources for the **"Twilio Forge: Messaging Reimagined"** webinar, focused on building with RCS (Rich Communication Services) using Twilio. It is designed to help you learn how to set up, configure, and send rich messaging experiences with Twilio's APIs.

## 📖 Main Resource: The Runbook

The [RUNBOOK.md](./RUNBOOK.md) is the main component of this repository. It provides a step-by-step guide to:

- Setting up your Twilio account and RCS sender
- Creating Messaging Services with RCS and SMS fallback
- Building and sending rich content templates (Text, Carousel, Card, etc.)
- Using the Twilio Content API and Messaging API with Postman
- Following a fictional journey (TwiliTransit) to demonstrate real-world messaging flows

**Read the [Runbook](./RUNBOOK.md) for detailed instructions and workshop steps.**

## 🚀 Quick Links

### Postman resources

- [Postman Collection](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json)
- [Postman Environment](./Forge-%20Messaging%20Reimagined.postman_environment.json)

Import these files into Postman to easily follow and test the API requests described in the Runbook.

### A quick webserver

[`server.js`](./server.js) contains simple Express JS webserver that you can use to capture incoming message webhooks.

---

☮️