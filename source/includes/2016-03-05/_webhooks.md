# Webhooks

Webhooks let you register a URL that Chargehound will notify when an event occurs. You might want to use webhooks to be notified when a dispute is created so that you can automatically submit a response. You can configure your webhook URLs on your [team settings page](https://www.chargehound.com/dashboard/settings/api#webhook-urls), clicking *Add webhook URL* on that page reveals a form to add a new URL for receiving webhooks. You can select what events you would like to receive a notification for. The events are `dispute.created`, `dispute.updated`, `dispute.submitted`, `dispute.closed` and `dispute.response.generated`.

## Responding to a webhook

To acknowledge successful receipt of a webhook, your endpoint should return a `2xx` HTTP status code. Any other information returned in the request headers or request body is ignored. All response codes outside this range, including `3xx` codes, will be treated as a failure. If a webhook is not successfully received for any reason, Charhound will continue trying to send the webhook once every half hour for up to 3 days.

## Dispute created

Notification that Chargehound has received a new dispute from your payment processor.

> Example request:

```json
{
  "id": "wh_123",
  "type": "dispute.created",
  "object": "webhook",
  "livemode": true,
  "dispute": "dp_123"
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
  "id": "wh_123",
  "type": "dispute.updated",
  "object": "webhook",
  "livemode": true,
  "dispute": "dp_123"
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
  "id": "wh_123",
  "type": "dispute.submitted",
  "object": "webhook",
  "livemode": true,
  "dispute": "dp_123"
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
  "id": "wh_123",
  "type": "dispute.closed",
  "object": "webhook",
  "livemode": true,
  "dispute": "dp_123"
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
  "id": "wh_123",
  "type": "dispute.response.generated",
  "object": "webhook",
  "livemode": true,
  "dispute": "dp_123",
  "charge": "ch_123",
  "account_id": null,
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
| dispute_id | string | The id of the dispute. (Deprecated, use "dispute" instead). |
| charge | string| The id of the disputed charge. |
| external_charge | string| The id of the disputed charge. (Deprecated, use "charge" instead). |
| response_url | string | The URL of the generated response PDF. This URL is a temporary access URL. |
| evidence | dictionary | Key value pairs for the dispute response evidence object. |
| account_id | string | The account id for Connected accounts that are charged directly through Stripe (if any). (See [Stripe charging directly](#stripe-charging-directly) for details.) |
| user_id | string | The account id for Connected accounts that are charged directly through Stripe (if any). (Deprecated, use "account_id" instead). |
