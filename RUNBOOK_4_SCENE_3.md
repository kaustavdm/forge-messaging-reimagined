# Section 4: Scene 3 – Delivery Options

[← Previous: Scene 2 – Show Products](./RUNBOOK_3_SCENE_2.md) | [← Back to Runbook](./RUNBOOK.md)

---

Twill's order is confirmed! Owl Store sends a Rich Card with delivery options — pick up from the nearest store (with a one-tap Google Maps link) or opt for doorstep delivery.

In this scene, we create a **Card** content template with a URL action button and a Quick Reply button, using the **Twilio Content API**.

---

## 4.1 Create a Card template with delivery options using the Twilio Content API

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 3" → "Scene 3 Content Templates" → "Create Content Template - Delivery options"**
- Review the JSON payload. Notice:
  - The `URL` action type opens a link in the user's browser — ideal for maps, websites, or deep links
  - The `QUICK_REPLY` action type sends a reply back to your webhook
- Send the request.
- If successful, the test script automatically sets `CONTENT_SID_SCENE_3` in the Postman environment.

</details>

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST https://content.twilio.com/v1/Content \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "friendly_name": "owl_scene_3_delivery",
    "language": "en",
    "variables": {
      "name": "Twill",
      "store_name": "Owl Store SIGNAL",
      "store_address": "101 Spear St 5th floor, San Francisco, CA 94105",
      "url": "https://maps.app.goo.gl/QUf1dE2XiDrZCdg67"
    },
    "types": {
      "twilio/card": {
        "title": "🎉 Order confirmed! Choose delivery.",
        "body": "Pickup from our nearest store, or opt for doorstep delivery",
        "media": ["https://forge-assets-5378.twil.io/owl_store/owl-ops-complete.png"],
        "actions": [
          { "type": "URL", "id": "btn_3_directions", "title": "Store pick-up", "url": "{{url}}" },
          { "type": "QUICK_REPLY", "id": "btn_3_deliver", "title": "Doorstep delivery" }
        ]
      },
      "twilio/text": {
        "body": "Pickup from our nearest store, or opt for doorstep delivery.\n\nNearest store: {{url}}\n\n---\n\nReply '1' for pickup at store.\n\nReply '2' for doorstep delivery."
      }
    }
  }'
```

</details>

> [!TIP]
> The `URL` action type is one of three action types available for RCS cards:
>
> | Action Type    | Use case                                 |
> | -------------- | ---------------------------------------- |
> | `QUICK_REPLY`  | Send a reply string back to your webhook |
> | `URL`          | Open a URL in the browser                |
> | `PHONE_NUMBER` | Initiate a phone call                    |

> [!TIP]
> The fictional store address used in this scene is 101 Spear St 5th floor, San Francisco, CA 94105.

---

## 4.2 Send Scene 3 message

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 3" → "Scene 3 - Choose delivery"**
- Review the pre-request script — variables include the customer name, store name, store address, and a Google Maps directions URL.
- Send the request.

</details>

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  --data-urlencode "From=$MESSAGING_SERVICE_SID" \
  --data-urlencode "To=$TO" \
  --data-urlencode "ContentSid=$CONTENT_SID_SCENE_3" \
  --data-urlencode 'ContentVariables={"name":"Twill","store_name":"Owl Store SIGNAL","store_address":"101 Spear St 5th floor, San Francisco, CA 94105","url":"https://maps.app.goo.gl/tWMVXbAoktdRHDEy7"}'
```

</details>

> [!TIP]
> **Bonus:** Try adding a second card to make it a Carousel — for example, a card showing today's sale banner image alongside the delivery card.

> [!IMPORTANT]
> **DEMO:** Show the Rich Card received on the test device.
> **DEMO:** Tap **"Store pick-up"** to open Google Maps.

---

## 4.3 Review

- [ ] Created a Card content template with delivery options using the Twilio Content API
- [ ] Added a `URL` action button for store pick-up directions
- [ ] Added a `QUICK_REPLY` action button for doorstep delivery
- [ ] Added a `twilio/text` SMS fallback

---

## Summing up

✅ That's it!

By now you have built a complete VIP retail messaging flow using Twilio RCS:

- A personalised **Card** alert with quick reply buttons (Console-created template, with SMS fallback)
- A product **Carousel** with quick reply buttons (API-created template, with SMS fallback)
- A delivery options **Card** with store pick-up and doorstep delivery buttons (API-created template, with SMS fallback)

Owl Store can now reach Twill with rich, contextual messages — and fall back gracefully to SMS for any device that does not yet support RCS.

This is just the beginning. RCS opens up new interaction models: confirmations, surveys, appointment reminders, order tracking, and more — all inside the native Messages app, with no app install required.

We can't wait to see what you build.

`<3`

---

[← Previous: Scene 2 – Show Products](./RUNBOOK_3_SCENE_2.md) | [← Back to Runbook](./RUNBOOK.md)
