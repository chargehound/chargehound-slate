# Webhooks

Webhooks let you register a URL that Chargehound will notify when an event occurs. You might want to use webhooks to be notified when a dispute is created so that you can automatically submit a response. You can configure your webhook URLs on your [team settings page](https://www.chargehound.com/dashboard/settings/api#webhook-urls), clicking <strong>Add webhook url</strong> on that page reveals a form to add a new URL for receiving webhooks. You can select what events you would like to receive a notification for. The events are `dispute.created`, `dispute.updated`, `dispute.submitted`, `dispute.closed` and `dispute.response.generated`.

## Dispute created

Notification that Chargehound has received a new dispute from your payment processor.

> Example request:

```json
{
  "id": "wh_XXX",
  "type": "dispute.created",
  "object": "event",
  "livemode": true,
  "dispute": "dp_XXX"
}
```

The webhook object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| id | string | A unique identifier for the webhook request. |
| type | string | The event type. |
| livemode | boolean | Is this a test or live mode dispute. |
| dispute | string | The id of the dispute. |

## Dispute updated

Notification that a dispute has been updated.

> Example request:

```json
{
  "id": "wh_XXX",
  "type": "dispute.updated",
  "object": "event",
  "livemode": true,
  "dispute": "dp_XXX"
}
```

The webhook object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| id | string | A unique identifier for the webhook request. |
| type | string | The event type. |
| livemode | boolean | Is this a test or live mode dispute. |
| dispute | string | The id of the dispute. |

## Dispute submitted

Notification that a dispute has been submitted.

> Example request:

```json
{
  "id": "wh_XXX",
  "type": "dispute.submitted",
  "object": "event",
  "livemode": true,
  "dispute": "dp_XXX"
}
```

The webhook object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| id | string | A unique identifier for the webhook request. |
| type | string | The event type. |
| livemode | boolean | Is this a test or live mode dispute. |
| dispute | string | The id of the dispute. |

## Dispute closed

Notification that a dispute was closed (`won`, `lost`, `charge_refunded`, or `warning_closed`).

> Example request:

```json
{
  "id": "wh_XXX",
  "type": "dispute.closed",
  "object": "event",
  "livemode": true,
  "dispute": "dp_XXX"
}
```

The webhook object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| id | string | A unique identifier for the webhook request. |
| type | string | The event type. |
| livemode | boolean | Is this a test or live mode dispute. |
| dispute | string | The id of the dispute. |

## Dispute response ready

Notification that Chargehound has generated a response for a dispute. This event is typically used for standalone integrations, where you are responsible for uploading the response evidence document yourself.

> Example request:

```json
{
  "id": "wh_XXX",
  "type": "dispute.response.generated",
  "object": "event",
  "livemode": true,
  "dispute": "dp_XXX",
  "charge": "ch_XXX",
  "user_id": null,
  "evidence": {
    "customer_name": "Susie Chargeback"
  },
  "response_url": "https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX"
}
```

The webhook object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| id | string | A unique identifier for the webhook request. |
| type | string | The event type. |
| livemode | boolean | Is this a test or live mode dispute. |
| dispute | string | The id of the dispute. |
| charge | string| The id of the disputed charge. |
| response_url | string | The url of the generated response pdf. This url is a temporary access url. |
| evidence | dictionary | Key value pairs for the dispute response evidence object. |
| user_id | string | The account id for Connected accounts that are charged directly through Stripe (if any). (See [Stripe charging directly](#stripe-charging-directly) for details.) |
