# Section 2: Scene 1 – VIP Sale Alert

[← Previous: Setup](./RUNBOOK_1_SETUP.md) | [Next: Scene 2 – Show Products →](./RUNBOOK_3_SCENE_2.md)

---

Owl Store's system has detected that Twill is a VIP customer. We want to send Twill a personalised sale alert as an RCS Rich Card.

In this scene, we create a **Card** content template using the **Twilio Console Content Template Builder**.

> [!NOTE]
> **Why a Card template first?**
>
> A `twilio/card` lets us send a banner image with a personalised message and quick reply buttons in a single message. It also supports a `twilio/text` SMS fallback — so we get rich RCS delivery with graceful degradation in one template.

---

## 2.1 Create a Card template using Content Template Builder

Go to **Twilio Console → Messaging → [Content Template Builder](https://console.twilio.com/us1/develop/sms/content-template-builder)**.

Click **"Create new"**. Select Content Type: **Card**. Click **"Create"**.

<details>
<summary>View detailed steps</summary>

- **Template Name:** `owl_scene_1_sale`
- **Template Language:** `English`
- **Content Type:** `Card`

**Configure Content — Card:**

**Title:** `Early access to Owl Sale`

**Body:**

```text
Hi {{name}}, we have curated items for you from our annual sale starting tomorrow.

Get {{discount}}% discount for early orders as our VIP customer! Order now!
```

**Media:** `https://forge-assets-5378.twil.io/owl_store/rich-card-sales.jpg`

**Actions:**

| #   | Type        | Title            | ID                  |
| --- | ----------- | ---------------- | ------------------- |
| 1   | Quick Reply | Show products    | `btn-show-products` |
| 2   | Quick Reply | Send coupon code | `btn-send-coupon`   |

**SMS Fallback (twilio/text):**

```text
Hi {{name}}, we have curated items for you from our annual sale starting tomorrow.

Get {{discount}}% discount for early orders as our VIP customer! Order now!

---

Reply 1 to see products
Reply 2 for get your discount code
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

- Switch environment to: [`Forge: Messaging Reimagined`](./postman/Forge-%20Messaging%20Reimagined.postman_environment.json)
- Update the **"current value"** of `CONTENT_SID_SCENE_1` with the SID of the template created in [2.1](#21-create-a-card-template-using-content-template-builder)
  - The SID is visible in the Content Template Builder after the template is created
- Send **"Scene 1" → "Scene 1 Content Templates" → "Review VIP alert content template"** to confirm the SID is correct
- Send **"Scene 1" → "Scene 1 - Send VIP sale alert"**

</details>

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  --data-urlencode "From=$MESSAGING_SERVICE_SID" \
  --data-urlencode "To=$TO" \
  --data-urlencode "ContentSid=$CONTENT_SID_SCENE_1" \
  --data-urlencode 'ContentVariables={"name":"Twill","discount":"30"}'
```

</details>

> [!TIP]
> The Card template includes a `twilio/text` SMS fallback. If the recipient's device does not support RCS, Twilio automatically delivers the fallback text as an SMS — no separate send is needed.

> [!IMPORTANT]
> **DEMO:** Show the message received on the test device.

---

## 2.3 Review

- [ ] Created a Card content template using the Content Template Builder
- [ ] Updated the Postman environment with the template SID
- [ ] Sent Card message with quick reply buttons using Postman

---

[← Previous: Setup](./RUNBOOK_1_SETUP.md) | [Next: Scene 2 – Show Products →](./RUNBOOK_3_SCENE_2.md)
