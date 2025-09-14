# Twilio Forge: Messaging Redefined - Workshop Runbook

In this approx. 60-minute hands-on lab, you'll build TwiliTransit - a fictional multi-modal transportation assistant that guides passengers through their journeys' stages using [Twilio RCS Business Messaging](https://www.twilio.com/docs/rcs). We will discuss how other messaging channels like SMS, WhatsApp, or even Email can be mixed in to deliver an omnichannel experience for your customers.

## Pre-requisites

> [!TIP]  
> Please complete these steps prior to joining the workshop

1. A Twilio account with an SMS-capable phone number ([Sign up here](https://console.twilio.com/)).
2. Go through the [RCS onboarding guide](https://www.twilio.com/docs/rcs/onboarding) and set up an RCS sender.
3. A smartphone with RCS capabilities for testing.
4. Basic understanding of Twilio Messaging APIs and Messaging Services.
5. The REST API client of your choice. This workshop uses Postman.
    - If using Postman, download the [Postman collection](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json) and the [Postman environment](./Forge-%20Messaging%20Reimagined.postman_environment.json) files and import them in Postman.
5. Node.js (current stable / LTS) installed on your machine.
6. Your code editor of choice.
7. The [ngrok](https://ngrok.com/) tunneling service (or other tunneling service).

---

## Workshop overview

### What you'll learn

- Set up and configure RCS messaging with Twilio
- Create rich content templates using the Content Template Builder and the Content API
- Send RCS messages using the Twilio REST API
- Send RCS message from an Express.js backend
- Dynamic fallback for RCS

### The journey we'll build

**Story:** In the fictional city of Owl Harbour, Alex decides to visit Signal City Market from TwiliTown. The city's integrated multi-modal mass transit system, TwiliTransit, plans and guides Alex through the journey as Alex goes from a Bus to a Ferry to a Metro, with rich, contextual messaging at each step.

<details>
<summary><strong>Scene details</strong></summary>

1. **Trip planning:** Alex texts "Plan my trip to Signal City Market" to the TwiliTransit number, and receives a journey plan. The journey begins with a walk to the TwiliTown Main St. Bus stop to board a bus to the Ferry. Alex also receives with an option for a reminder before the bus arrives.
2. **Bus boarding:** Alex's bus boarding reminder time arrives. Alex receives a reminder text asking to confirm if Alex has reached the bus stop. Then, Alex receives the details of the bay where the bus will arrive.
3. **Ferry transfer:** As Alex's bus journey is about to end, and Alex nears the Ferry terminal, Alex receives a boarding pass QR code for the Ferry, and directions from the bus to the Ferry docks.
4. **Metro transfer** - As the Ferry journey is about to end, Alex receives a message with Metro arrival/depature timing, platform and route map, along with an option to book rideshare once the metro ride ends.
5. **Journey completion:** As the Metro ride ends, Alex receives a trip summary with receipts.

</details>

### Useful links

* [RCS Rich Messaging Documentation](https://www.twilio.com/docs/messaging/channels/rcs)
* [RCS Onboarding Guide](https://www.twilio.com/docs/rcs/onboarding)
* [Messaging Services Documentation](https://www.twilio.com/docs/messaging/services)
* [RCS availability](https://www.twilio.com/docs/rcs/regional)
* [Twilio API Message Resource](https://www.twilio.com/docs/messaging/api/message-resource)
* [Postman Collection for this workshop](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json)
* [Assets to use (for demo purposes only)](https://forge-assets-5378.twil.io/index.html)

---

## Build

Let's start with the Build session for the workshop.

### 1. Set up RCS Sender and Messaging Service

> [!NOTE]
> This section runs through the [RCS Onboarding guide](https://www.twilio.com/docs/rcs/onboarding). If you already have an RCS Sender, a Messaging Service, and have assigned the RCS Sender to the Messaging Service, you may skip to the next section.

#### 1.1. Create RCS Sender

<details>
<summary>View detailed steps to create an RCS Sender</summary>

- Go to Twilio Console -> RCS -> [Senders](https://console.twilio.com/us1/develop/rcs/senders). Click "Create New Sender".
- Enter Sender Display Name: "TwiliTransit". Continue.
- On the next page:
    - Sender display name: `TwiliTransit`
    - Description: `The best fictional, personalised mass-transit service in town.`
    - Logo image: [Copy this URL](https://forge-assets-5378.twil.io/twilitransit/logo-224x224.png) (_Right click and copy link_), or download and host [`assets/logo-224x224.png`](assets/logo-224x224.png)
    - Banner image: [Copy this URL](https://forge-assets-5378.twil.io/twilitransit/banner-1440x448.jpg) (_Right click and copy link_), or download and host [`assets/banner-1440x448.jpg`](assets/banner-1440x448.jpg)
    - Accent color: Click color palette and add a color
    - Contact Details: Add your own contact information. Add suitable label. 
    - Privacy policy: [Copy this URL](https://forge-assets-5378.twil.io/twilitransit/privacy.md)(_Right click and copy link_), or download and host [`assets/privacy.md`](assets/privacy.md)
    - Terms of Service: [Copy this URL](https://forge-assets-5378.twil.io/twilitransit/tos.md) (_Right click and copy link_), or download and host [`assets/tos.md`](assets/tos.md)

</details>

<details>
<summary>See RCS Sender preview till this point</summary>
You should see a preview that looks like this:

![RCS Sender Preview](assets/rcs-sender-preview.png)

</details>

> [!CAUTION]
> **DO NOT submit the Sender for Carrier Approval.**

#### 1.2. Add device to test the RCS sender

After the Sender is added, go to the Sender settings -> Test -> "Add device to test this sender". If you have a phone with RCS enabled, add the number here.

You will receive an RCS message asking you to confirm that you want to be a tester. Accept that and we are good to go.

#### 1.3. Assign RCS Sender to Messaging Service

Create a Messaging service and assign RCS and SMS senders.

<details>
<summary>View detailed steps</summary>

- Go to Twilio Console -> Messaging -> [Services](https://console.twilio.com/us1/develop/sms/services). Click "Create Messaging Service"
- Step 1: Create Messaging Service
    - Messaging service friendly name: `TwiliTransit Service`
    - Select what you want to use Messaging for: `Notify my users`
    - Next
- Step 2: Add Senders. Add two senders. One for SMS and another for RCS.
    - Sender Type: `Phone Number` -> Continue. Select Phone Number -> Add Phone Numbers.
    - Sender Type: `RCS Sender` -> Continue. Select the TwiliTransit RCS Sender. Add RCS Senders.
- Step 3: Set up integration
    - _Leave with default choice for now_
- Step 4: Add compliance info
    - Complete Messaging Service Setup

</details>

You should now have a Messaging service that supports a RCS sender with SMS fallback, ready to go!

#### 1.4. Your first RCS message

🎉 Now that you have your first sender and messaging service in place, let's use it to send an RCS message directly through the Twilio API.

RCS Messages are sent using the [`Messages` resource](https://www.twilio.com/docs/messaging/api/message-resource) of the Twilio REST API, the same resource you use for SMS.

> [!NOTE]
> Use the requests in the "Prequel" folder of the [Postman collection](./Twilio%20Forge-%20Messaging%20Reimagined.postman_collection.json).
> Make sure to update the Postman environment's current value fields.
> Use your test device phone number as the `To` field value.

- Trigger a request using the `Messages` resource of the Twilio REST API. 
    - In the Postman collection, trigger "Prequel" -> "Your First RCS Message"
    - If the phone number in `To` field does not support RCS, it will get a SMS.

> [!TIP]
> You can also pass a [`MediaUrl` field](https://www.twilio.com/docs/messaging/api/message-resource#path-parameters) instead of `Body`.
> This field can take an array of a publicly available URI of a jpeg, jpg, gif or png.

- Trigger another request to demonstrate disabling fallback to SMS even when fallback is enabled in the Messaging Service.
    - In the Postman collection, trigger "Prequel" -> "Your First RCS Message - without fallback"
    - Note the use of `rcs:` prefix in the `To` field.

> [!IMPORTANT]
> **DEMO:** Show the messages received on the given phone number.  
> Optionally, delete the messages to clean up the Sender.

If all went well, you would have received a RCS message on your test device.

#### 1.5 Review

> [!TIP]
> Let's review what we have built in this section.

What we have so far:

- [ ] Completed Twilio account setup
- [ ] Created an RCS Sender
- [ ] Added a test device
- [ ] Created a Messaging Service
- [ ] Added RCS Sender to Messaging Service
- [ ] Added fallback SMS phone number to Messaging Service
- [ ] Sent an RCS message using the Messaging Service
- [ ] (Optional) Sent an RCS message without fallback using the Messaging Service 

---


### 2. Scene 1: Trip planning

Our TwiliTransit journey follows 5 distinct scenes from Alex's trip. Let's create content templates for the first scene.

**Go to Twilio Console -> Messaging -> [Content Template Builder](https://console.twilio.com/us1/develop/sms/content-template-builder).**

In this scene, we want to send a welcome greeting as a [Text](https://www.twilio.com/docs/content/twilio-text), followed by the trip plan as a [Carousel](https://www.twilio.com/docs/content/carousel).

> [!NOTE]
> **Carousel (`twilio/carousel`) templates in RCS do not support the `Body` field.** Yet, the `Body` field is required because WhatsApp supports it.  
> 
> WhatsApp can send the `Body` field as a text before sending the cards of the Carousel.  
> RCS omits the `Body` field. So, for RCS, we have to first send the `Body` as a separate Text message.  
> We can leverage disabling fallback in this use case, and send the extra message only for RCS recipients.

#### 2.1. Create a Text template using Content Template Builder

In the Content Template Builder, click "Create your first content template" (or, "Create new" if you have existing templates). Create a "Text" template.

We will later send this template _without_ a fallback, so that it is only sent to RCS users. (See Note right above for the reason)

<details>
<summary>View detailed steps</summary>

- Template Name: `twilitransit_scene_1_1_initial_greeting`
- Template Language: `English`
- Content Type: `Text`
- Click "Create".

**Configure Content - Text:** In the "Text" tab:

**Body:**

```text
Hi {{name}}! Welcome to TwiliTransit! 🚎

Let's get you to {{dest}}.
```

</details>

> [!TIP]
> Variables are added within 2 curly braces. e.g. `{{1}}`.
> By default, the Content Template Builder uses numbers as variable names. e.g., `{{1}}`, `{{2}}` and so on.  
> While this quicker, it is a good idea to name your variables more descriptively. e.g., `{{name}}`, `{{dest}}`.  

> [!TIP]
> Now is a good time to quickly review all the [Content Types options](https://www.twilio.com/docs/content/content-types-overview) available. 

> [!NOTE]
> Content Templates cannot be edited after they are created.  
> You can always delete and recreate templates. Creating Content Templates through the API makes it more repeatable.  
> We will see that in action soon!

#### 2.2. Create a Carousel template using Content Template Builder

Next, create another Content Template that contains the Carousel. We will keep it simple for the workshop.

<details>
<summary>View detailed steps</summary>

- Template Name: `twilitransit_scene_1_2_trip_planning`
- Template Language: `English`
- Content Type: `Carousel`
- Click "Create"

**Configure Content - Carousel:** In the "Carousel" tab:

**Body:**

```text
Hi {{1}}! Welcome to TwiliTransit! 🚎

Let's get you to {{2}}.
```

**Card 1:**

- Media URL: `https://forge-assets-5378.twil.io/twilitransit/{{start_image}}`
- Card Title: `Board a bus`
- Card Body: `Your trip starts from {{start_loc}}.`
- Button:
    - Type of Action: `Quick Reply`
    - Button text: `Remind me`
    - ID: `btn_1_2_reminder_bus`

**Card 2:**

- Media URL: `https://forge-assets-5378.twil.io/twilitransit/{{end_image}}`
- Card Title: `Trip end`
- Card Body: `Your trip ends at {{6}}.`
- Button:
    - Type of Action: `Quick Reply`
    - Button text: `Email journey plan`
    - ID: `btn_1_2_email_journey`

**Dynamic Fallback:** Click Edit dynamic fallback. Select "Text". Continue.

**Text Fallback:** Switch to "Text" tab.

Body:

```text
Hi {{1}}! Welcome to TwiliTransit! 🚎

Let's get you to {{2}}.

Your trip starts from {{4}} and ends at {{6}}.

Reply with REMIND to get a reminder 5 mins before your bus arrives.

Reply with EMAIL to get the journey plan emailed to you instead.
```

</details>

#### 2.3. Send Scene 1 messages using Twilio Messaging API


<details>
<summary>View detailed steps</summary>

In Postman:

- Switch environment to: [`Forge: Messaging Reimagined`](./Forge-%20Messaging%20Reimagined.postman_environment.json)
- Update the "current value" of the following keys based on the content template SIDs
    - `CONTENT_SID_SCENE_1_1`: Add content template SID for the text template created in section [2.1](#21-create-a-text-template-using-content-template-builder) above
    - `CONTENT_SID_SCENE_1_2`: Add content template SID for the carousel template created in section [2.2](#22-create-a-carousel-template-using-content-template-builder) above
- Send the following requests from the collection:
    - "Scene 1" -> "Scene 1 - Send initial message"
    - "Scene 1" -> "Scene 1 - Send trip plan reply"

</details>

> [!TIP]
> Explore the requests in Postman. Notice the request Content-Type and Pre-request Scripts.  
> Note how the initial reply's `To` field is prefixed with `rcs:`.

> [!TIP]
> See the "Scene 1" -> "Scene 1 Content Templates" for requests to create the two content templates from this scene using the Twilio Content API.

> [!IMPORTANT]
> **DEMO:** Show the messages sent in this scene.  
> **DEMO:** Select "Remind me"
> **DEMO:** Optional, highlight how the fallback works.

#### 2.4. Review

> [!TIP]
> Let's review what we have built in this section.

What we have so far:

- [ ] Created a Text content template using the Content Template Builder
- [ ] Created a Carousel content template using the Content Template Builder
- [ ] Added Text fallback to the Carousel template
- [ ] (Optional) Looked at available Content Types
- [ ] Sent RCS message with Text template using Postman
- [ ] Sent RCS message with Carousel template using Postman

---

### 3. Scene 2: Bus boarding

Alex is already on their way to the Bus Stop. Alex's reminder time arrives.

Let's create one more template, this time using the Twilio Content API. This will be a Card without media and with action buttons.

#### 3.1. Create a Card template using Twilio Content API

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open "Scene 2" -> "Scene 2 Content Templates" -> "Create Content Template - Reminder"
- Look at the JSON payload, and see how the `types` object is described.
- Send request.
- If request is successful, the value of the environment variable `CONTENT_SID_SCENE_2_1` will be updated with the new content template's SID.

</details>

> [!TIP]
> Go to the Content Template Builder and observe the new template.

#### 3.2. Send Scene 2 message using Twilio Messaging API

Now, with the content template created, send the message.

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open "Scene 2" -> "Scene 2 - Send Reminder"
- Update the variables in the request's Pre-request Script as needed
- Send request.

</details>

> [!TIP]
> Bonus: Try creating the template again without adding `subtitle`, and send another message. Notice how the action buttons change to chips.

> [!IMPORTANT]
> **DEMO:** Show the messages sent in this scene.  
> **DEMO:** Select "Yes, I'm here"

#### 3.3. Review

> [!TIP]
> Let's review what we have built in this section.

What we have so far:

- [ ] Created a Card content template without media using the Twilio Content API
    - [ ] Add quick_reply action buttons
    - [ ] Added Text fallback to the content template

---

### 4. Scene 3: Ferry transfer

As Alex's bus journey is about to end, and Alex nears the Ferry terminal, Alex receives a boarding pass QR code for the Ferry, and directions from the bus to the Ferry docks.

Let's create one more template using the Twilio Content API. This will be a Card with a media and a URL action button.

#### 4.1. Create a Card template with media using Twilio Content API

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open "Scene 3" -> "Scene 3 Content Templates" -> "Create Content Template - Ferry transfer"
- Look at the JSON payload, and see how the `types` object is described.
- Send request.
- If request is successful, the value of the environment variable `CONTENT_SID_SCENE_3_1` will be updated with the new content template's SID.

</details>

#### 4.2. Send Scene 3 message using Twilio Messaging API

Now, with the content template created, send the message.

<details>
<summary>View detailed steps</summary>

In the Postman collection:

- Open "Scene 3" -> "Scene 3 - Send Ferry instructions"
- Update the variables in the request's Pre-request Script as needed
- Send request.

</details>

> [!TIP]
> Bonus: Try creating the template again multiple `media` urls and send another message.

> [!IMPORTANT]
> **DEMO:** Show the messages sent in this scene.  
> **DEMO:** Select "Directions to Ferry" button

#### 4.3. Review

> [!TIP]
> Let's review what we have built in this section.

What we have so far:

- [ ] Created a Card content template with media using the Twilio Content API
- [ ] Add `URL` action button

---