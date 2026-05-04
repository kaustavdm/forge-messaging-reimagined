# Section 4: Scene 3 – Closest Store

[← Previous: Scene 2 – Curated Sale Items](./RUNBOOK_3_SCENE_2.md) | [← Back to Runbook](./RUNBOOK.md)

---

Twill is ready to shop. Owl Store sends a Rich Card with the nearest store's location and a one-tap **"Get directions"** button — a time-saving action that opens Google Maps directly.

In this scene, we create a **Card** content template with a media image and a URL action button, using the **Twilio Content API**.

---

## 4.1 Create a Card template with media using the Twilio Content API

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 3" → "Scene 3 Content Templates" → "Create Content Template - Closest store"**
- Review the JSON payload. Notice:
  - `media` is an array of image URLs attached to the card
  - The `URL` action type opens a link in the user's browser — ideal for maps, websites, or deep links
- Send the request.
- If successful, the test script automatically sets `CONTENT_SID_SCENE_3_1` in the Postman environment.

</details>

> [!TIP]
> The `URL` action type is one of three action types available for RCS cards:
>
> | Action Type | Use case |
> | --- | --- |
> | `QUICK_REPLY` | Send a reply string back to your webhook |
> | `URL` | Open a URL in the browser |
> | `PHONE_NUMBER` | Initiate a phone call |

> [!TIP]
> The fictional store address used in this scene is the Twilio HQ at 375 Beale St, San Francisco, CA 94105.

---

## 4.2 Send Scene 3 message

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open **"Scene 3" → "Scene 3 - Send closest store"**
- Review the pre-request script — variables include the store name, address, and a Google Maps directions URL.
- Send the request.

</details>

> [!TIP]
> **Bonus:** Try adding a second card to make it a Carousel — for example, a card showing today's sale banner image alongside the store card.

> [!IMPORTANT]
> **DEMO:** Show the Rich Card received on the test device.
> **DEMO:** Tap **"Get directions"** to open Google Maps.

---

## 4.3 Review

- [ ] Created a Card content template with media using the Twilio Content API
- [ ] Added a `URL` action button for one-tap directions
- [ ] Added a `twilio/text` SMS fallback
- [ ] (Optional) Extended the card into a Carousel

---

## Summing up

✅ That's it!

By now you have built a complete VIP retail messaging flow using Twilio RCS:

- A personalised **Text** alert (Console-created template, RCS-only)
- A product **Carousel** with quick reply buttons (API-created template, with SMS fallback)
- A store location **Rich Card** with a one-tap directions button (API-created template, with SMS fallback)

Owl Store can now reach Twill with rich, contextual messages — and fall back gracefully to SMS for any device that does not yet support RCS.

This is just the beginning. RCS opens up new interaction models: confirmations, surveys, appointment reminders, order tracking, and more — all inside the native Messages app, with no app install required.

We can't wait to see what you build.

`<3`

---

[← Previous: Scene 2 – Curated Sale Items](./RUNBOOK_3_SCENE_2.md) | [← Back to Runbook](./RUNBOOK.md)
