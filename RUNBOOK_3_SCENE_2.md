# Section 3: Scene 2 – Curated Sale Items

[← Previous: Scene 1 – VIP Sale Alert](./RUNBOOK_2_SCENE_1.md) | [Next: Scene 3 – Closest Store →](./RUNBOOK_4_SCENE_3.md)

---

Twill has seen the sale alert. Now Owl Store sends a personalised Carousel of curated products — a signature hoodie and a trail shoe — each with a one-tap **"Add to bag"** quick reply.

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

- Open **"Scene 2" → "Scene 2 Content Templates" → "Create Content Template - Curated items"**
- Review the JSON payload. Notice how the `types` object defines both `twilio/carousel` (for RCS) and `twilio/text` (as the SMS fallback).
- Send the request.
- If successful, the test script automatically sets `CONTENT_SID_SCENE_2_1` in the Postman environment.

</details>

> [!TIP]
> Open the newly created template in the [Content Template Builder](https://console.twilio.com/us1/develop/sms/content-template-builder) to see how the API-created template looks in the Console.

> [!TIP]
> Notice the `twilio/text` fallback body. When a recipient's device does not support RCS, Twilio automatically delivers the `twilio/text` body as an SMS instead of the Carousel.

> [!TIP]
> Available Carousel card assets for this scene:
>
> | Product | Images |
> | --- | --- |
> | Hoodie | `carousel-hoodie-front.jpg`, `carousel-hoodie-lifestyle-1.jpg`, `carousel-hoodie-lifestyle-2.jpg`, `carousel-hoodie-sleeve.jpg`, `carousel-hoodie-womens.jpg` |
> | Shoes | `carousel-shoes-front.jpg`, `carousel-shoes-lifestyle-1.jpg`, `carousel-shoes-lifestyle-2.jpg`, `carousel-shoes-side.jpg`, `carousel-shoes-top.jpg` |
>
> All images are available at `https://forge-assets-5378.twil.io/owl_store/<filename>`.

---

## 3.2 Send Scene 2 message

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 2" → "Scene 2 - Send curated items"**
- Review the pre-request script — the `CONTENT_VARIABLES` object maps variable names to values that are interpolated into the template at send time.
- Send the request.

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
- [ ] (Optional) Explored different card image angles

---

[← Previous: Scene 1 – VIP Sale Alert](./RUNBOOK_2_SCENE_1.md) | [Next: Scene 3 – Closest Store →](./RUNBOOK_4_SCENE_3.md)
