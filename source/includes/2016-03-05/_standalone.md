# Standalone Integration

In typical connected integrations Chargehound has third party access to your payment processor. This allows Chargehound to automatically sync your disputes as they are created, update your disputes with relevant information, and upload the response to your payment processor after you submit a dispute. A connected integration is the least effort for you, however, in some cases a connected integration may not be possible or desired.

A standalone integration gives you the responsibilty and control over creating disputes in Chargehound and uploading the generated response to your payment processor when it is ready. You will create a dispute via API and when the response is ready you will receive a `dispute.response.generated` [webhook notification](#webhooks) from Chargehound. You can then fetch the response information, including the PDF document generated from your template, and upload the response to your payment processor.

## Creating a dispute via API

In a standalone integration, you will need to create a dispute in Chargehound when you receive a notification from your payment processor.

> Definition:

```sh
POST /v1/disputes
```

```javascript
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
  -u test_123: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" \
  -d id=dp_123 \
  -d charge=ch_123 \
  -d customer=cus_123 \
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

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.create({
  template: 'unrecognized',
  fields: {
    customer_name: 'Susie Chargeback'
  },
  id: 'dp_123',
  charge: 'ch_123',
  customer: 'cus_123',
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
chargehound.api_key = 'test_123'

chargehound.Disputes.create(
  template = 'unrecognized',
  fields = {
    customer_name: 'Susie Chargeback'
  },
  id = 'dp_123',
  charge = 'ch_123',
  customer = 'cus_123',
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
Chargehound.api_key = 'test_123'

Chargehound::Disputes.create(
  template: 'unrecognized',
  fields: {
    customer_name => 'Susie Chargeback'
  },
  id: 'dp_123',
  charge: 'ch_123',
  customer: 'cus_123',
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

ch := chargehound.New("test_123", nil)

params := chargehound.CreateDisputeParams{
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
  ID: "dp_123",
  Charge: "ch_123",
  Customer: "cus_123",
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

```javascripton
{
  "customer": "cus_123",
  "livemode": false,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "id": "dp_123",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-12-01T22:20:53",
  "state": "needs_response",
  "statement_descriptor": null,
  "source": "api",
  "charge": "ch_123",
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
  "url": "/v1/disputes/dp_123",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "amount": 500,
  "products": [],
  "processor": "stripe"
}
```

### Parameters

| Parameter | Type | Required? | Description |
|---------------------|---------|-----------|-----------|
| id | string | required | The id of the dispute in your payment processor. |
| charge | string | required | The id of the disputed charge in your payment processor. |
| customer | string | optional | The id of the charged customer in your payment processor. |
| reason | string | required | The bank provided reason for the dispute. One of `general`, `fraudulent`, `duplicate`, `subscription_canceled`, `product_unacceptable`, `product_not_received`, `unrecognized`, `credit_not_processed`, `incorrect_account_details`, `insufficient_funds`, `bank_cannot_process`, `debit_not_authorized`, `goods_services_returned_or_refused`, `goods_services_cancelled`, `transaction_amount_differs`, `retrieved`. |
| charged_at | string | required | ISO 8601 timestamp - when the charge was made. |
| disputed_at | string | required | ISO 8601 timestamp - when the charge was disputed. |
| due_by | string | required | ISO 8601 timestamp - when dispute evidence needs to be disputed by. |
| currency | string | required | The currency code of the disputed charge. e.g. 'USD'. |
| amount | integer | required | The amount of the disputed charge. Amounts are in cents (or other minor currency unit.) |
| processor | string | optional | The payment processor for the charge. One of `braintree`, `vantiv`, `adyen`, `worldpay` or `stripe`. |
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
| products | array | optional | List of products the customer purchased. (See [Product data](#product-data) for details.) |
| account_id | string | optional | Set the account id for Connected accounts that are charged directly through Stripe. (See [Stripe charging directly](#stripe-charging-directly) for details.) |
| kind | string | optional | Type of dispute (if available). One of `chargeback`, `retrieval`, `pre_arbitration`. |
| submit | boolean | optional | Submit dispute evidence immediately after creation. |
| queue | boolean | optional | Queue the dispute for submission on its due date. (See [Queuing for submission](#queuing-for-submission) for details.) |
| force | boolean | optional | Skip the manual review filters or submit a dispute in manual review. (See [Manual review](#manual-review) for details.) |
| user_id | string | optional | The account id for Connected accounts that are charged directly through Stripe (if any). (Deprecated, use "account_id" instead). |
| external_charge | string | optional | The id of the disputed charge in your payment processor. (Deprecated, use "charge" instead). |
| external_customer | string | optional | The id of the charged customer in your payment processor. (Deprecated, use "customer" instead). |


### Possible errors

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute is missing data, or is missing fields required by the template. |


## Retrieving a dispute response

Once the [response is generated](#dispute-response-ready), you can fetch the response data from the Chargehound API.

> Definition:

```sh
GET /v1/disputes/{{dispute_id}}/response
```

```javascript
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
curl https://api.chargehound.com/v1/disputes/dp_123/response \
  -u test_123:
```

```js
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.response('dp_123', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.response('dp_123')
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.response('dp_123')
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.RetrieveDisputeParams{
  ID: "dp_123",
}

response, err := ch.Disputes.Response(&params)
```

> Example response:

```json
{
  "object": "response",
  "livemode": true,
  "dispute": "dp_123",
  "external_charge": "ch_123",
  "account_id": null,
  "evidence": {
    "customer_name": "Susie Chargeback"
  },
  "response_url": "https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX"
}
```

The response object is:

| Field | Type | Description |
|---------------------|---------|-----------|
| dispute | string | The id of the dispute. |
| dispute_id | string | The id of the dispute. (Deprecated, use "dispute" instead). |
| charge | string| The id of the disputed charge. |
| external_charge | string| The id of the disputed charge. (Deprecated, use "charge" instead). |
| response_url | string | The URL of the generated response PDF. This URL is a temporary access URL. |
| evidence | dictionary | Key value pairs for the dispute response evidence object. |
| account_id | string | The account id for Connected accounts that are charged directly through Stripe (if any). (See [Stripe charging directly](#stripe-charging-directly) for details.) |
| user_id | string | The account id for Connected accounts that are charged directly through Stripe (if any). (Deprecated, use "account_id" instead). |
