# Section 2: Scene 1 – VIP Sale Alert

[← Previous: Setup](./RUNBOOK_1_SETUP.md) | [Next: Scene 2 – Curated Sale Items →](./RUNBOOK_3_SCENE_2.md)

---

Owl Store's system has detected that Twill is a VIP customer. We want to send Twill a personalised sale alert as an RCS text message.

In this scene, we create a **Text** content template using the **Twilio Console Content Template Builder**.

> [!NOTE]
> **Why a Text template first, and why RCS-only?**
>
> In Scene 2, we will send a Carousel. The `twilio/carousel` Content Type does not render a `Body` field in RCS — it is only used for WhatsApp fallback. To include an opening greeting for RCS recipients, we send a separate Text message first, using the `rcs:` prefix on the `To` field so it is only delivered to RCS users.

---

## 2.1 Create a Text template using Content Template Builder

Go to **Twilio Console → Messaging → [Content Template Builder](https://console.twilio.com/us1/develop/sms/content-template-builder)**.

Click **"Create new"**. Select Content Type: **Text**. Click **"Create"**.

<details>
<summary>View detailed steps</summary>

- **Template Name:** `owl_store_scene_1_1_vip_alert`
- **Template Language:** `English`
- **Content Type:** `Text`

**Configure Content — Text:**

**Body:**

```text
Hey {{name}}! 🦉 You're a VIP at Owl Store.

Our biggest sale of the year just launched — {{discount}}% off your curated picks. For today only.
```

</details>

> [!TIP]
> Variables are added within double curly braces, e.g. `{{name}}`, `{{discount}}`.
> Descriptive variable names are clearer than the default numbered format (`{{1}}`, `{{2}}`).

> [!TIP]
> Now is a good time to quickly review all the [Content Types options](https://www.twilio.com/docs/content/content-types-overview) available.

> [!NOTE]
> Content Templates cannot be edited after they are created. You can delete and recreate them. Creating Content Templates through the API (as we will see in Scenes 2 and 3) makes this more repeatable.

---

## 2.2 Send Scene 1 message

<details>
<summary>View detailed steps</summary>

In Postman:

- Switch environment to: [`Forge: Messaging Reimagined`](./Forge-%20Messaging%20Reimagined.postman_environment.json)
- Update the **"current value"** of `CONTENT_SID_SCENE_1_1` with the SID of the template created in [2.1](#21-create-a-text-template-using-content-template-builder)
  - The SID is visible in the Content Template Builder after the template is created
- Send **"Scene 1" → "Scene 1 Content Templates" → "Review VIP alert content template"** to confirm the SID is correct
- Send **"Scene 1" → "Scene 1 - Send VIP sale alert"**

</details>

> [!TIP]
> Notice the `rcs:` prefix on the `To` field in the send request. This ensures the message is only delivered to RCS-capable devices and will not fall back to SMS — because this message is the RCS-specific intro before the Carousel that follows.

> [!IMPORTANT]
> **DEMO:** Show the message received on the test device.

---

## 2.3 Review

- [ ] Created a Text content template using the Content Template Builder
- [ ] Updated the Postman environment with the template SID
- [ ] Sent RCS-only Text message using Postman

---

[← Previous: Setup](./RUNBOOK_1_SETUP.md) | [Next: Scene 2 – Curated Sale Items →](./RUNBOOK_3_SCENE_2.md)
