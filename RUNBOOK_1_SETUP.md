# Section 1: Setup

[← Back to Runbook](./RUNBOOK.md) | [Next: Scene 1 – VIP Sale Alert →](./RUNBOOK_2_SCENE_1.md)

---

## 1.1 Create RCS Sender

> [!NOTE]
> This section runs through the [RCS Onboarding guide](https://www.twilio.com/docs/rcs/onboarding). If you already have an RCS Sender, a Messaging Service, and have assigned the RCS Sender to the Messaging Service, you may skip to section [1.4](#14-your-first-rcs-message).

<details>
<summary>View detailed steps to create an RCS Sender</summary>

- Go to Twilio Console → RCS → [Senders](https://console.twilio.com/us1/develop/rcs/senders). Click **"Create New Sender"**.
- Enter Sender Display Name: `Owl Store`. Continue.
- On the next page:
  - **Sender display name:** `Owl Store`
  - **Description:** `The best fictional retail experience in town.`
  - **Logo image:** [Copy this URL](https://forge-assets-5378.twil.io/owl_store/icon.jpg) _(right click → copy link)_, or use the local file [`assets/owl_store/icon.jpg`](assets/owl_store/icon.jpg)
  - **Banner image:** [Copy this URL](https://forge-assets-5378.twil.io/owl_store/banner.jpg) _(right click → copy link)_, or use the local file [`assets/owl_store/banner.jpg`](assets/owl_store/banner.jpg)
  - **Accent color:** Click the color palette and pick a colour
  - **Contact Details:** Add your own contact information with a suitable label
  - **Privacy policy:** [Copy this URL](https://forge-assets-5378.twil.io/owl_store/privacy.md) _(right click → copy link)_, or use [`assets/owl_store/privacy.md`](assets/owl_store/privacy.md)
  - **Terms of Service:** [Copy this URL](https://forge-assets-5378.twil.io/owl_store/tos.md) _(right click → copy link)_, or use [`assets/owl_store/tos.md`](assets/owl_store/tos.md)

</details>

> [!CAUTION]
> **DO NOT submit the Sender for Carrier Approval.**

---

## 1.2 Add a test device

After the Sender is created, go to the Sender settings → **Test** → **"Add device to test this sender"**.

Add the phone number of a device with RCS enabled. You will receive an RCS message asking you to confirm that you want to be a tester. Accept it.

---

## 1.3 Assign RCS Sender to Messaging Service

Create a Messaging Service and assign RCS and SMS senders.

<details>
<summary>View detailed steps</summary>

- Go to Twilio Console → Messaging → [Services](https://console.twilio.com/us1/develop/sms/services). Click **"Create Messaging Service"**.
- **Step 1:** Create Messaging Service
  - Messaging service friendly name: `Owl Store Service`
  - Select what you want to use Messaging for: `Notify my users`
  - Next
- **Step 2:** Add Senders. Add two senders.
  - Sender Type: `Phone Number` → Continue → Select Phone Number → Add Phone Numbers
  - Sender Type: `RCS Sender` → Continue → Select the Owl Store RCS Sender → Add RCS Senders
- **Step 3:** Set up integration — _leave with default choice for now_
- **Step 4:** Add compliance info → Complete Messaging Service Setup

</details>

You now have a Messaging Service with an RCS sender and SMS fallback.

---

## 1.4 Your first RCS message

🎉 Now that you have your sender and Messaging Service, send your first RCS message directly through the Twilio API.

RCS Messages are sent using the [`Messages` resource](https://www.twilio.com/docs/messaging/api/message-resource) — the same resource used for SMS.

> [!NOTE]
> Use the requests in the **"Prequel"** folder of the [Postman collection](./postman/Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json).
> Make sure to update the Postman environment's current value fields.
> Use your test device phone number as the `To` field value.

- Trigger **"Prequel" → "Your First RCS Message"**
  - If the `To` phone number does not support RCS, it will receive an SMS instead.

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  --data-urlencode "From=$MESSAGING_SERVICE_SID" \
  --data-urlencode "To=$TO" \
  --data-urlencode "Body=Hi from the Twilio Forge session on RCS!"
```

</details>

> [!TIP]
> You can also pass a [`MediaUrl` field](https://www.twilio.com/docs/messaging/api/message-resource#path-parameters) instead of `Body`. This field accepts an array of publicly available image URLs (JPEG, JPG, GIF, PNG).

- Trigger **"Prequel" → "Your First RCS Message - without fallback"**
  - Note the `rcs:` prefix on the `To` field. This disables SMS fallback even when it is configured on the Messaging Service.

<details>
<summary>View equivalent curl command</summary>

```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$ACCOUNT_SID/Messages.json" \
  -u "$TWILIO_API_KEY_SID:$TWILIO_API_KEY_SECRET" \
  --data-urlencode "From=$MESSAGING_SERVICE_SID" \
  --data-urlencode "To=rcs:$TO" \
  --data-urlencode "Body=Hi from the Twilio Forge session on RCS! This time without SMS fallback."
```

</details>

> [!IMPORTANT]
> **DEMO:** Show the messages received on the test device.

---

## 1.5 Review

> [!TIP]
> Let's review what we have built so far.

- [ ] Created an RCS Sender
- [ ] Added a test device
- [ ] Created a Messaging Service
- [ ] Added RCS Sender to Messaging Service
- [ ] Added fallback SMS phone number to Messaging Service
- [ ] Sent an RCS message using the Messaging Service
- [ ] (Optional) Sent an RCS message without fallback

---

[← Back to Runbook](./RUNBOOK.md) | [Next: Scene 1 – VIP Sale Alert →](./RUNBOOK_2_SCENE_1.md)
