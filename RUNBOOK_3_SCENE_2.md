# Section 3: Scene 2 – Show products

[← Previous: Scene 1 – VIP Sale Alert](./RUNBOOK_2_SCENE_1.md) | [Next: Scene 3 – Delivery Options →](./RUNBOOK_4_SCENE_3.md)

---

Twill tapped **"Show products"**. Owl Store responds with a Carousel of products — two cards showing the product from different angles, each with an **"Add to bag"** quick reply.

In this scene, we create a **Carousel** content template using the **Twilio Content API**.

> [!NOTE]
> **Why the Content API instead of the Console?**
>
> The Content Template Builder is excellent for one-off templates. For repeatable, programmable workflows, the Content API lets you create templates in code, automate template management, and version them alongside your application. We will use the API for Scenes 2 and 3.

---

## 3.1 Create a Carousel template using the Twilio Content API

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 2" → "Scene 2 Content Templates" → "Create Content Template - Show products"**
- Review the JSON payload. Notice how the `types` object defines both `twilio/carousel` (for RCS) and `twilio/text` (as the SMS fallback).
- Send the request.
- If successful, the test script automatically sets `CONTENT_SID_SCENE_2` in the Postman environment.

</details>

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST https://content.twilio.com/v1/Content \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "friendly_name": "owl_scene_2_products",
    "language": "en",
    "variables": {},
    "types": {
        "twilio/carousel": {
            "body": "Which ones do you like?",
            "cards": [
                {
                    "title": "Owl-Red Printed Hoodie",
                    "body": "A comfy hoodie in our signature colour!",
                    "media": "https://forge-assets-5378.twil.io/owl_store/rich-card-hoodie-lifestyle-1.jpg",
                    "actions": [
                        {
                            "type": "QUICK_REPLY",
                            "title": "Add to bag",
                            "id": "btn-add-hoodie"
                        },
                        {
                            "type": "QUICK_REPLY",
                            "title": "Show more photos",
                            "id": "btn-show-more-hoodie"
                        }
                    ]
                },
                {
                    "title": "Shoes to flaunt",
                    "body": "Owl-Red and Owl branded shoes to show-off on-stage!",
                    "media": "https://forge-assets-5378.twil.io/owl_store/carousel-shoes-front.jpg",
                    "actions": [
                        {
                            "type": "QUICK_REPLY",
                            "title": "Add to bag",
                            "id": "btn-add-shoes"
                        },
                        {
                            "type": "QUICK_REPLY",
                            "title": "Show more photos",
                            "id": "btn-show-more-shoes"
                        }
                    ]
                }
            ]
        },
        "twilio/text": {
            "body": "Reply 1 for Owl-Red Comfy Hoodies\n\nReply 2 for Owl-Red branded Shoes"
        }
    }
  }'
```

</details>

> [!TIP]
> Open the newly created template in the [Content Template Builder](https://console.twilio.com/us1/develop/sms/content-template-builder) to see how the API-created template looks in the Console.

> [!TIP]
> Notice the `twilio/text` fallback body. When a recipient's device does not support RCS, Twilio automatically delivers the `twilio/text` body as an SMS instead of the Carousel.

> [!NOTE]
> Carousels sent over RCS don't support the top-level `body` text — it is dropped at delivery. The card-level `body` fields are shown inside each card.

---

## 3.2 Send Scene 2 message

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 2" → "Scene 2 - Send products"**
- This template has no variables, so no `ContentVariables` are needed.
- Send the request.

</details>

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  --data-urlencode "From=$MESSAGING_SERVICE_SID" \
  --data-urlencode "To=$TO" \
  --data-urlencode "ContentSid=$CONTENT_SID_SCENE_2"
```

</details>

> [!TIP]
> **Bonus:** Try replacing one of the card images with a different angle from the asset list above and create a new template to see how it looks.

> [!IMPORTANT]
> **DEMO:** Show the Carousel received on the test device.
> **DEMO:** Tap **"Add to bag"** on one of the cards.
> **DEMO:** Show how the SMS fallback looks when using a number without RCS.

---

## 3.3 Review

- [ ] Created a Carousel content template using the Twilio Content API
- [ ] Added `QUICK_REPLY` action buttons to Carousel cards
- [ ] Added a `twilio/text` SMS fallback to the Carousel template

---

[← Previous: Scene 1 – VIP Sale Alert](./RUNBOOK_2_SCENE_1.md) | [Next: Scene 3 – Delivery Options →](./RUNBOOK_4_SCENE_3.md)
