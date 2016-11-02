# Standalone Integration Guide

This section walks through some of the technical details of completing a stan Chargehound integration.

## Creating a dispute

> Definition:

```sh
POST /v1/disputes
```

```js
chargehound.Disputes.create();
```

```python
chargehound.Disputes.create()
```

```ruby
Chargehound::Disputes.create
```

```go
ch.Disputes.Create(*chargehound.CreateDisputeParams)
```

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes?submit=true \
  -u test_XXX: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" \
  -d external_identifier=dp_XXX \
  -d external_charge=ch_XXX \
  -d external_customer=cus_XXX \
  -d processor=stripe \
  -d reason=unrecognized \
  -d charged_at="2016-10-01T22:20:53" \
  -d disputed_at="2016-10-01T22:20:53" \
  -d due_by="2016-12-01T22:20:53" \ 
  -d currency=usd \
  -d amount=500 \
  -d reversal_currency=usd \
  -d fee=1500 \
  -d reversal_amount=500
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.create({
  template: 'unrecognized',
  fields: {
    customer_name: 'Susie Chargeback'
  },
  external_identifier: 'dp_XXX',
  external_charge: 'ch_XXX',
  external_customer: 'cus_XXX',
  processor: 'stripe',
  reason: 'unrecognized',
  charged_at: '2016-10-01T22:20:53',
  disputed_at: '2016-10-01T22:20:53',
  due_by: '2016-12-01T22:20:53',
  currency: 'usd',
  amount: 500,
  reversal_currency: 'usd',
  fee: 1500,
  reversal_amount: 500
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.create(
  template = 'unrecognized',
  fields = {
    customer_name: 'Susie Chargeback'
  },
  external_identifier = 'dp_XXX',
  external_charge = 'ch_XXX',
  external_customer = 'cus_XXX',
  processor = 'stripe',
  reason = 'unrecognized',
  charged_at = '2016-10-01T22 =20 =53',
  disputed_at = '2016-10-01T22 =20 =53',
  due_by = '2016-12-01T22 =20 =53',
  currency = 'usd',
  amount = 500,
  reversal_currency = 'usd',
  fee = 1500,
  reversal_amount = 500
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.create(
  template: 'unrecognized',
  fields: {
    customer_name => 'Susie Chargeback'
  },
  external_identifier: 'dp_XXX',
  external_charge: 'ch_XXX',
  external_customer: 'cus_XXX',
  processor: 'stripe',
  reason: 'unrecognized',
  charged_at: '2016-10-01T22:20:53',
  disputed_at: '2016-10-01T22:20:53',
  due_by: '2016-12-01T22:20:53',
  currency: 'usd',
  amount: 500,
  reversal_currency: 'usd',
  fee: 1500,
  reversal_amount: 500
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

params := chargehound.CreateDisputeParams{
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
  ExternalIdentifier: "dp_XXX",
  ExternalCharge: "ch_XXX",
  ExternalCustomer: "cus_XXX",
  Processor: "stripe",
  Reason: "unrecognized",
  ChargedAt: "2016-10-01T22:20:53",
  DisputedAt: "2016-10-01T22:20:53",
  DueBy: "2016-12-01T22:20:53",
  Currency: "usd",
  Amount: 500,
  ReversalCurrency: "usd",
  Fee: 1500,
  ReversalAmount: 500,
}

dispute, err := ch.Disputes.Create(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-12-01T22:20:53",
  "state": "needs_response",
  "statement_descriptor": null,
  "source": "api",
  "charge": "ch_XXX",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": null,
  "account_id": null,
  "address_line1_check": "pass",
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-10-01T22:20:53",
  "submitted_count": 0,
  "reason": "unrecognized",
  "reversal_total": 2000,
  "charged_at": "2016-10-01T22:20:53",
  "reversal_currency": "usd",
  "address_zip": null,
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "amount": 500,
  "products": [],
  "processor": "stripe"
}
```

| Parameter | Type | Required? | Description |
|---------------------|---------|-----------|-----------|
| external_identifier | string | required | The id of the dispute in your payment processor. For Stripe looks like `dp_XXX`. |
| external_charge | string | required | The id of the disputed charge in your payment processor. For Stripe looks like `ch_XXX`. |
| external_customer | string | optional | The id of the charged customer in your payment processor. For Stripe looks like `cus_XXX`. |
| reason | string | required | The bank provided reason for the dispute. One of `general`, `fraudulent`, `duplicate`, `subscription_canceled`, `product_unacceptable`, `product_not_received`, `unrecognized`, `credit_not_processed`, `incorrect_account_details`, `insufficient_funds`, `bank_cannot_process`, `debit_not_authorized`. |
| charged_at | string | required | ISO 8601 timestamp - when the charge was made. |
| disputed_at | string | required | ISO 8601 timestamp - when the charge was disputed. |
| due_by | string | required | ISO 8601 timestamp - when dispute evidence needs to be disputed by. |
| currency | string | required | The currency code of the disputed charge. e.g. 'USD'. |
| amount | integer | required | The amount of the disputed charge. Amounts are in cents (or other minor currency unit.) |
| processor | string | optional | The payment processor for the charge. Currently the only possible value is `stripe`. |
| state | string | optional | The state of the dispute. One of `needs_response`, `warning_needs_response`. |
| reversal_currency | string | optional | The currency code of the dispute balance withdrawal. e.g. 'USD'. |
| fee | integer | optional | The amount of the dispute fee. Amounts are in cents (or other minor currency unit.) |
| reversal_amount | integer | optional | The amount of the dispute balance withdrawal (without fee). Amounts are in cents (or other minor currency unit.) |
| reversal_total | integer | optional | The total amount of the dispute balance withdrawal (with fee). Amounts are in cents (or other minor currency unit.) |
| is_charge_refundable | boolean | optional | Is the disputed charge refundable. |
| submitted_count | integer | optional | How many times has dispute evidence been submitted. |
| address_line1_check | string | optional | State of address check (if available). One of `pass`, `fail`, `unavailable`, `checked`. |
| address_zip_check | string | optional | State of address zip check (if available). One of `pass`, `fail`, `unavailable`, `checked`. |
| cvc_check | string | optional | State of cvc check (if available). One of `pass`, `fail`, `unavailable`, `checked`. |
| template | string     | optional | The id of the template to use. |
| fields | dictionary | optional | Key value pairs to hydrate the template's evidence fields. |
| products | array | optional | List of products the customer purchased. |
| account_id | string | optional | Set the account id for Connected accounts that are charged directly through Stripe. |
| submit | boolean | optional | Submit dispute evidence immediately after creation. |

## Dispute response ready

When Chargehound has generated a response we will send the result to your server URL. The webhook server URL is configured here ...

```sh
POST /my/chargehound/webhook
```

> Example request:

```json
{
  "type": "dispute.response.generated",
  "livemode": true,
  "dispute_id": "dp_XXX",
  "external_charge": "ch_XXX",
  "account_id": null,
  "evidence": {
    "customer_name": "Susie Chargeback"
  },
  "response_url": "https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX"
}
```

| Parameter | Type | Required? | Description |
|---------------------|---------|-----------|-----------|
| type | string | required | The event type.
| livemode | boolean | required | Is this a test or live mode dispute. |
| dispute_id | string | required | The id of the dispute. |
| external_charge | string | required| The id of the disputed charge. |
| response_url | string | required | The url of the generated response pdf. This url is a temporary access url. |
| evidence | dictionary | optional | Key value pairs for the dispute response evidence object. |
| account_id | string | optional | The Stripe Connected account. |

## Retrieving a dispute response

Fetching the Chargehound response.

> Definition:

```sh
GET /v1/disputes/{{dispute_id}}/response
```

```js
chargehound.Disputes.response();
```

```python
chargehound.Disputes.response()
```

```ruby
Chargehound::Disputes.response
```

```go
ch.Disputes.Response(*chargehound.RetrieveDisputeParams)
```

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes/dp_XXX/response \
  -u test_XXX:
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.response('dp_XXX'), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.response('dp_XXX')
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.response('dp_XXX')
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

params := chargehound.RetrieveDisputeParams{
  ID: "dp_XXX",
}

dispute, err := ch.Disputes.Response(&params)
```

> Example response:

```json
{
  "object": "response",
  "livemode": true,
  "dispute_id": "dp_XXX",
  "external_charge": "ch_XXX",
  "account_id": null,
  "evidence": {
    "customer_name": "Susie Chargeback"
  },
  "response_url": "https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX"
}
```
