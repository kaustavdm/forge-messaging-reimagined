# Twilio Forge: Messaging Reimagined

This repository contains follow-along steps and resources for the **"Twilio Forge: Messaging Reimagined"** workshop at SIGNAL San Francisco 2026, focused on building with RCS (Rich Communication Services) using Twilio. It is designed to help you learn how to set up, configure, and send rich messaging experiences with Twilio's APIs.

## What you'll build

**Owl Store** is a fictional retail brand. Twill is a VIP customer. When a sale goes live, Owl Store's messaging flow kicks in:

1. **VIP sale alert** — A personalised Rich Card with quick reply buttons, created using the Twilio Console Content Template Builder.
2. **Show products** — A Carousel of curated items with "Add to bag" and "Show more photos" quick reply buttons, created using the Twilio Content API.
3. **Delivery options** — A Rich Card confirming the order and presenting store pick-up (with a Google Maps link) or doorstep delivery, created using the Twilio Content API.

All messages are sent over RCS with automatic SMS fallback for devices that don't yet support it.

## 📖 Main Resource: The Runbook

The [RUNBOOK.md](./RUNBOOK.md) is the main component of this repository. It provides a step-by-step guide to:

- Setting up your Twilio account and RCS sender
- Creating Messaging Services with RCS and SMS fallback
- Building and sending rich content templates (Card, Carousel) with SMS fallback
- Using the Twilio Content Template Builder and Content API with Postman

**Read the [Runbook](./RUNBOOK.md) for detailed instructions and workshop steps.**

> [!TIP]
> Want a more interactive version of the Runbook? Check out the [Twilio Forge: Messaging Reimagined – Interactive Lab](https://twilio-forge-blueprint.vercel.app/).

## 🚀 Quick Links

### Postman resources

- [Postman Collection](./postman/Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json)
- [Postman Environment](./postman/Forge-%20Messaging%20Reimagined.postman_environment.json)

Import these files into Postman to easily follow and test the API requests described in the Runbook.

### A quick webserver

[`server.js`](./server.js) contains a simple Express JS webserver that you can use to capture incoming message webhooks.

### Workshop assets

The [`./assets/owl_store/`](./assets/owl_store/) directory contains assets used in the workshop. These include images for the RCS sender, product photos, and legal documents.

---

☮️
