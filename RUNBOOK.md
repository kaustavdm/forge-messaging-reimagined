# Twilio Forge: Messaging Reimagined – Workshop Runbook

- **Workshop:** Twilio Forge: Messaging Reimagined
- **Focus:** Rich messaging for retail with Twilio RCS Business Messaging
- **Tech Stack:** Twilio RCS, Content Template Builder, Content API, Messaging API, Postman
- **Duration:** ~60 min
- **Outcome:** A complete VIP customer messaging flow — sale alert, curated products, and store directions — delivered over RCS with SMS fallback

---

## Prerequisites

> [!TIP]
> Please complete these steps before joining the workshop.

- A Twilio account with an SMS-capable phone number ([Sign up here](https://console.twilio.com/))
- Go through the [RCS onboarding guide](https://www.twilio.com/docs/rcs/onboarding) and set up an RCS sender
- A smartphone with RCS capabilities for testing
- Basic understanding of Twilio Messaging APIs and Messaging Services
- The REST API client of your choice — this workshop uses Postman
  - Download the [Postman collection](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json) and [Postman environment](./Forge-%20Messaging%20Reimagined.postman_environment.json) and import them into Postman

---

## Workshop Overview

### What you'll learn

- Set up and configure RCS messaging with Twilio
- Create rich content templates using the Content Template Builder and the Content API
- Send RCS messages using the Twilio REST API
- Dynamic fallback for RCS
- Watch for incoming messages from an Express.js backend

### The story we'll build

**Owl Store** is a fictional retail brand. Twill is a VIP customer. When a sale goes live, Owl Store's messaging flow kicks in automatically:

<details>
<summary><strong>Scene details</strong></summary>

1. **VIP detection** — Owl Store's system detects Twill is a VIP customer and triggers a personalised sale alert via RCS.
2. **Curated sale items** — Twill receives a Carousel of hand-picked products — a signature hoodie and trail shoe — each with a one-tap "Add to bag" reply button.
3. **Closest store** — Twill receives a Rich Card with the nearest Owl Store location and a one-tap "Get directions" button linking to Google Maps.

</details>

### Useful links

- [RCS Rich Messaging Documentation](https://www.twilio.com/docs/messaging/channels/rcs)
- [RCS Onboarding Guide](https://www.twilio.com/docs/rcs/onboarding)
- [Messaging Services Documentation](https://www.twilio.com/docs/messaging/services)
- [Content Types Overview](https://www.twilio.com/docs/content/content-types-overview)
- [Twilio API Message Resource](https://www.twilio.com/docs/messaging/api/message-resource)
- [Postman Collection for this workshop](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json)
- [Assets for this workshop (demo purposes only)](https://forge-assets-5378.twil.io/index.html)
- [Interactive Lab (alternative follow-along)](https://twilio-forge-blueprint.vercel.app/)

---

## Workshop Sections

| #   | Section                                                         | Duration |
| --- | --------------------------------------------------------------- | -------- |
| 1   | [Setup: RCS Sender and Messaging Service](./RUNBOOK_1_SETUP.md) | ~15 min  |
| 2   | [Scene 1: VIP sale alert](./RUNBOOK_2_SCENE_1.md)               | ~10 min  |
| 3   | [Scene 2: Curated sale items](./RUNBOOK_3_SCENE_2.md)           | ~15 min  |
| 4   | [Scene 3: Closest store](./RUNBOOK_4_SCENE_3.md)                | ~15 min  |

---

☮️
