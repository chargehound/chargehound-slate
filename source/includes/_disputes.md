
# Disputes

## The dispute object

Dispute objects represent a dispute created on a charge. They can also be referred to as chargebacks. In order to contest a dispute, attach a template and update the dispute with the template's required fields.

A dispute object is:

| Field                | Type       | Description                                                                                             |
| ---------------------|------------|---------------------------------------------------------------------------------------------------------|
| id                   | string     | A unique identifier for the dispute. This id is set by the payment processor of the dispute.            |
| state                | string     | State of the dispute. One of `needs_response`,`compiling_evidence`,`submitted`, `under_review`, `won`, `lost`, `warning_needs_response`, `warning_under_review`, `warning_closed` , `response_disabled`, `charge_refunded`, `requires_review`, `accepted`, `queued`. |
| reason               | string     | Reason for the dispute. One of `general`, `fraudulent`, `duplicate`, `subscription_canceled`, `product_unacceptable`, `product_not_received`, `unrecognized`, `credit_not_processed`, `incorrect_account_details`, `insufficient_funds`, `bank_cannot_process`, `debit_not_authorized`, `goods_services_returned_or_refused`, `goods_services_cancelled`, `transaction_amount_differs`, `retrieved`, `customer_initiated` | 
| charged_at           | string     | ISO 8601 timestamp - when the charge was made.                                                          |
| disputed_at          | string     | ISO 8601 timestamp - when the charge was disputed.                                                      |
| due_by               | string     | ISO 8601 timestamp - when dispute evidence needs to be disputed by.                                     |
| submitted_at         | string     | ISO 8601 timestamp - when dispute evidence was submitted.                                               |
| closed_at            | string     | ISO 8601 timestamp - when the dispute was resolved.                                                     |
| submitted_count      | integer    | Number of times the dispute evidence has been submitted.                                                |
| template             | string     | Id of the template attached to the dispute.                                                             |
| fields               | dictionary | Evidence fields attached to the dispute.                                                                |
| missing_fields       | dictionary | Any fields required by the template that have not yet been provided.                                    |
| products             | array      | A list of products in the disputed order. (See [Product data](#product-data) for details.)              |
| correspondence       | array      | A list of communications with the customer. (See [Customer correspondence](#customer-correspondence) for details.)              |
| charge               | string     | Id of the disputed charge. This id is set by the payment processor of the dispute.                      |
| is_charge_refundable | boolean    | Can the charge be refunded.                                                                             |
| amount               | integer    | Amount of the disputed charge. Amounts are in cents (or other minor currency unit.)                     |
| currency             | string     | Currency code of the disputed charge. e.g. 'USD'.                                                       |
| fee                  | integer    | The amount deducted due to the payment processor's chargeback fee. Amounts are in cents (or other minor currency unit.) |
| reversal_amount      | integer    | The amount deducted due to the chargeback. Amounts are in cents (or other minor currency unit.)         |
| reversal_currency    | string     | Currency code of the deduction amount. e.g. 'USD'.                                                      |
| customer             | string     | Id of the customer (if any). This id is set by the payment processor of the dispute.                    |
| customer_name        | string     | Name of the customer (if any).                                                                          |
| customer_email       | string     | Email of the customer (if any).                                                                         |
| customer_purchase_ip | string     | IP of purchase (if available).                                                                          |
| address_zip          | string     | Billing address zip of the charge.                                                                      |
| address_line1_check  | string     | State of address check (if available). One of `pass`, `fail`, `unavailable`, `unchecked`.                 |
| address_zip_check    | string     | State of address zip check (if available). One of `pass`, `fail`, `unavailable`, `unchecked`.             |
| cvc_check            | string     | State of cvc check (if available). One of `pass`, `fail`, `unavailable`, `unchecked`.                     |
| statement_descriptor | string     | The descriptor that appears on the customer's credit card statement for this change.                    |
| account_id           | string     | The account id for accounts that are charged directly through Stripe (if any). (See [Stripe charging directly](#stripe-charging-directly) for details.) |
| created              | string     | ISO 8601 timestamp - when the dispute was created in Chargehound.                                       |
| updated              | string     | ISO 8601 timestamp - when the dispute was last updated in Chargehound.                                  |
| source               | string     | The source of the dispute. One of `mock`, `api`, `braintree`, `vantiv`, `adyen`, `worldpay`, `paypal`, `amex`, `checkout`, or `stripe` |
| processor            | string     | The payment processor of the dispute. One of `braintree`, `vantiv`, `adyen`, `worldpay`, `paypal`, `amex`, `checkout`, or `stripe`     |
| kind                 | string     | The kind of the dispute. One of `chargeback`, `pre_arbitration` or `retrieval`                          |
| account              | string     | The Id of the connected account for this dispute.                                                       |
| reference_url        | string     | Custom URL with dispute information, such as the dispute or charge in your company dashboard.           |

## Submitting a dispute

> Definition:

```sh
POST /v1/disputes/{{dispute_id}}/submit
```

```javascript
chargehound.Disputes.submit();
```

```python
chargehound.Disputes.submit()
```

```ruby
Chargehound::Disputes.submit
```

```go
ch.Disputes.Submit(*chargehound.UpdateDisputeParams)
```

```java
chargehound.disputes.submit();
```

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_123/submit \
  -u test_123: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" 
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.submit('dp_123', {
  template: 'unrecognized',
  fields: {
    customer_name: 'Susie Chargeback'
  }
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.submit('dp_123',
  template='unrecognized',
  fields={
    'customer_name': 'Susie Chargeback'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.submit('dp_123',
  template: 'unrecognized',
  fields: {
    'customer_name' => 'Susie Chargeback'
  }
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  ID:       "dp_123",
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
}

dispute, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

Map<String, Object> fields = new HashMap<String, Object>();
fields.put("customer_name", "Susie Chargeback");

chargehound.disputes.submit("dp_123",
  new Dispute.UpdateParams.Builder()
    .template("unrecognized")
    .fields(fields)
    .finish()
);
```

> Example response:

```json
{
  "customer": "cus_123",
  "livemode": false,
  "updated": "2016-10-18T20:38:51",
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_123",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "submitted",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_123",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": "susie@example.com",
  "account_id": null,
  "address_line1_check": "pass",
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-09-18T20:38:51",
  "submitted_count": 0,
  "reason": "unrecognized",
  "reversal_total": 2000,
  "reversal_currency": "usd",
  "address_zip": null,
  "submitted_at": "2016-10-18T20:38:51",
  "created": "2016-09-18T20:38:51",
  "url": "/v1/disputes/dp_123",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "past_payments": [],
  "correspondence": [],
  "reference_url": null,
  "amount": 500,
  "processor": "stripe",
  "account": "default"
}
```

You will want to submit the dispute through Chargehound after you receive the `dispute.created` [webhook notification](#webhooks). With one `POST` request you can update a dispute with the evidence fields and send the generated response to the source payment processor.

The dispute will be in the `submitted` state if the submit was successful. 

### Parameters

| Parameter      | Type       | Required?  | Description |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| template       | string     | optional   | The id of the template to use. |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields. |
| products       | array      | optional   | List of products the customer purchased. (See [Product data](#product-data) for details.) |
| correspondence | array      | optional   | A list of communications with the customer. (See [Customer correspondence](#customer-correspondence) for details.)              |
| past_payments  | array      | optional   | History of the customer's valid, non-disputed transactions using the same card. (See [Past payments](#past-payments) for details.) |
| reference_url  | string     | optional   | Custom URL with dispute information, such as the dispute or charge in your company dashboard. |
| queue          | boolean    | optional   | Queue the dispute for submission. (See [Queuing for submission](#queuing-for-submission) for details.) |
| force          | boolean    | optional   | Submit a dispute in manual review (see [Manual review](#manual-review) for details) or submit an accepted dispute (see [Accepting a dispute](#accepting-a-dispute) for details.) |
| account        | string     | optional   | Id of the connected account for this dispute (if multiple accounts are connected). View your connected accounts in the Chargehound dashboard settings page [here](/dashboard/settings/processors). |

### Possible errors

| Error code           | Description                                                          |
| ---------------------|----------------------------------------------------------------------|
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Creating a dispute

Disputes are usually not created via the REST API. Instead, once your payment processor is connected we will mirror disputes via webhooks. You will reference the dispute with the same id that is used by the payment processor. If you are working on a standalone integration, please refer to [this section](#creating-a-dispute-via-api).

## Retrieving a list of disputes

> Definition:

```sh
GET /v1/disputes
```

```javascript
chargehound.Disputes.list();
```

```python
chargehound.Disputes.list()
```

```ruby
Chargehound::Disputes.list
```

```go
ch.Disputes.List(*chargehound.ListDisputesParams)
```

```java
chargehound.disputes.list();
```

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes?state=warning_needs_response&state=needs_response \
  -u test_123:
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.list({state: ['warning_needs_response', 'needs_response']}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.list(state=['warning_needs_response', 'needs_response'])
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.list(state: %w[warning_needs_response needs_response])
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

disputeList, err := ch.Disputes.List(&chargehound.ListDisputesParams{
    State: []string{
      "warning_needs_response",
      "needs_response",
    },
  })
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.DisputesList;

Chargehound chargehound = new Chargehound("test_123");

DisputesList.Params params = new DisputesList.Params.Builder()
    .state("warning_needs_response", "needs_response")
    .finish();

DisputesList result = chargehound.disputes.list(params);
```

> Example response:

```json
{
  "has_more": false,
  "url": "/v1/disputes",
  "livemode": false,
  "object": "list",
  "data": [
    {
      "customer": "cus_123",
      "updated": null,
      "currency": "usd",
      "missing_fields": {},
      "address_zip_check": "pass",
      "closed_at": null,
      "id": "dp_123",
      "customer_name": "Susie Chargeback",
      "fee": 1500,
      "reversal_amount": 500,
      "due_by": "2016-11-18T20:38:51",
      "state": "needs_response",
      "statement_descriptor": "COMPANY",
      "source": "stripe",
      "charge": "ch_123",
      "template": null,
      "is_charge_refundable": false,
      "cvc_check": "unavailable",
      "customer_email": "susie@example.com",
      "account_id": null,
      "address_line1_check": "pass",
      "object": "dispute",
      "customer_purchase_ip": null,
      "disputed_at": "2016-09-18T20:38:51",
      "submitted_count": 0,
      "reason": "unrecognized",
      "reversal_total": 2000,
      "reversal_currency": "usd",
      "address_zip": null,
      "submitted_at": null,
      "created": "2016-09-18T20:38:51",
      "url": "/v1/disputes/dp_123",
      "fields": {},
      "charged_at": "2016-09-18T20:38:51",
      "products": [],
      "past_payments": [],
      "correspondence": [],
      "reference_url": null,
      "amount": 500,
      "processor": "stripe",
      "account": "default"
    }
  ]
}
```

This endpoint will list all the disputes that we have synced from your payment processor(s). By default the disputes will be ordered by created with the most recent dispute first. `has_more` will be true if more results are available.

### Parameters

| Parameter      | Type       | Required?  | Description                                                                              |
| -------------  | ---------- | ---------- | ---------------------------------------------------------------------------------------- |
| limit          | integer    | optional   | Maximum number of disputes to return. Default is 20, maximum is 100.                     |
| starting_after | string     | optional   | A dispute id. Fetch the next page of disputes (disputes created before this dispute).    |
| ending_before  | string     | optional   | A dispute id. Fetch the previous page of disputes (disputes created after this dispute). |
| state          | string     | optional   | Dispute state. Filter the disputes by state. Multiple `state` parameters can be provided to expand the filter to multiple states. |
| account        | string     | optional   | Account id. Will only fetch disputes under that connected account. View your connected accounts in the Chargehound dashboard settings page [here](/dashboard/settings/processors). |

## Retrieving a dispute

> Definition:

```sh
GET /v1/disputes/{{dispute_id}}
```

```javascript
chargehound.Disputes.retrieve();
```

```python
chargehound.Disputes.retrieve()
```

```ruby
Chargehound::Disputes.retrieve
```

```go
ch.Disputes.Retrieve(*chargehound.RetrieveDisputeParams)
```

```java
chargehound.disputes.retrieve();
```

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123:
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.retrieve('dp_123', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.retrieve('dp_123')
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.retrieve('dp_123')
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.RetrieveDisputeParams{
  ID: "dp_123",
}

dispute, err := ch.Disputes.Retrieve(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("test_123");

chargehound.disputes.retrieve("dp_123");
```

> Example response:

```json
{
  "customer": "cus_123",
  "livemode": false,
  "updated": null,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_123",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_123",
  "template": null,
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": "susie@example.com",
  "account_id": null,
  "address_line1_check": "pass",
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-09-18T20:38:51",
  "submitted_count": 0,
  "reason": "unrecognized",
  "reversal_total": 2000,
  "reversal_currency": "usd",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-09-18T20:38:51",
  "url": "/v1/disputes/dp_123",
  "fields": {},
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "past_payments": [],
  "correspondence": [],
  "reference_url": null,
  "amount": 500,
  "processor": "stripe",
  "account": "default"
}
```

You can retrieve a single dispute by its id.

## Updating a dispute

> Definition:

```sh
PUT /v1/disputes/{{dispute_id}}
```

```javascript
chargehound.Disputes.update();
```

```python
chargehound.Disputes.update()
```

```ruby
Chargehound::Disputes.update
```

```go
ch.Disputes.Update(*chargehound.UpdateDisputeParams)
```

```java
chargehound.disputes.update();
```

> Example request:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" 
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.update('dp_123', {
  template: 'unrecognized',
  fields: {
    customer_name: 'Susie Chargeback'
  }
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.update('dp_123',
  template='unrecognized',
  fields={
    'customer_name': 'Susie Chargeback'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.update('dp_123',
  template: 'unrecognized',
  fields: {
    'customer_name' => 'Susie Chargeback'
  }
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  ID:       "dp_123",
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
}

dispute, err := ch.Disputes.Update(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

Map<String, Object> fields = new HashMap<String, Object>();
fields.put("customer_name", "Susie Chargeback");

chargehound.disputes.update("dp_123",
  new Dispute.UpdateParams.Builder()
    .template("unrecognized")
    .fields(fields)
    .finish()
);
```

> Example response:

```json
{
  "customer": "cus_123",
  "livemode": false,
  "updated": "2016-10-18T20:38:51",
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_123",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_123",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": "susie@example.com",
  "account_id": null,
  "address_line1_check": "pass",
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-09-18T20:38:51",
  "submitted_count": 0,
  "reason": "unrecognized",
  "reversal_total": 2000,
  "reversal_currency": "usd",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-09-18T20:38:51",
  "url": "/v1/disputes/dp_123",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "past_payments": [],
  "correspondence": [],
  "reference_url": null,
  "amount": 500,
  "processor": "stripe",
  "account": "default"
}
```

You can update the template and the fields on a dispute.

### Parameters

| Parameter      | Type       | Required?  | Description |
| -------------  | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| template       | string     | optional   | The id of the template to use. |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields. |
| products       | array      | optional   | List of products the customer purchased. (See [Product data](#product-data) for details.) |
| correspondence | array      | optional   | A list of communications with the customer. (See [Customer correspondence](#customer-correspondence) for details.)              |
| past_payments  | array      | optional   | History of the customer's valid, non-disputed transactions using the same card. (See [Past payments](#past-payments) for details.) |
| reference_url  | string     | optional   | Custom URL with dispute information, such as the dispute or charge in your company dashboard. |
| submit         | boolean    | optional   | Submit dispute evidence immediately after update. If the submit fails, updated fields will still be saved. |
| queue          | boolean    | optional   | Queue the dispute for submission. (See [Queuing for submission](#queuing-for-submission) for details.) |
| force          | boolean    | optional   | Submit a dispute in manual review (see [Manual review](#manual-review) for details) or submit an accepted dispute (see [Accepting a dispute](#accepting-a-dispute) for details.) |

### Possible errors

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Queuing for submission

Queuing a dispute for submission allows you to stage evidence that will be automatically submitted at a later time. Typically a payment processor only allows a dispute response to be submitted once, making it impossible to edit the response. Queuing a dispute for submission allows you to make changes to the dispute's response while being confident that the dispute will be submitted on time. 

You can queue a dispute by setting the `queue` parameter to `true` when making a request to [submit](#submitting-a-dispute) or [create](#creating-a-dispute-via-api) a dispute. The dispute will be in the `queued` state if the request was successful.

## Accepting a dispute

> Definition:

```sh
POST /v1/disputes/{{dispute_id}}/accept
```

```javascript
chargehound.Disputes.accept();
```

```python
chargehound.Disputes.accept()
```

```ruby
Chargehound::Disputes.accept
```

```go
ch.Disputes.Accept(*chargehound.AcceptDisputeParams)
```

```java
chargehound.disputes.accept();
```

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_123/accept \
  -u test_123:
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.accept('dp_123', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.accept('dp_123')
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.accept('dp_123')
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.AcceptDisputeParams{
  ID:       "dp_123"
}

dispute, err := ch.Disputes.Accept(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("test_123");

chargehound.disputes.accept("dp_123");
```

> Example response:

```json
{
  "customer": "cus_123",
  "livemode": false,
  "updated": "2016-10-18T20:38:51",
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_123",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "accepted",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_123",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": "susie@example.com",
  "account_id": null,
  "address_line1_check": "pass",
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-09-18T20:38:51",
  "submitted_count": 0,
  "reason": "unrecognized",
  "reversal_total": 2000,
  "reversal_currency": "usd",
  "address_zip": null,
  "submitted_at": "2016-10-18T20:38:51",
  "created": "2016-09-18T20:38:51",
  "url": "/v1/disputes/dp_123",
  "fields": {},
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "past_payments": [],
  "correspondence": [],
  "reference_url": null,
  "amount": 500,
  "processor": "stripe",
  "account": "default"
}
```

If you do not wish to respond to a dispute you can accept the dispute. Accepting a dispute will remove the dispute from your queue of disputes that need response.

The dispute will be in the `accepted` state if the request was successful. 

In order submit a dispute that has been accepted via the API, you will need to pass an extra `force` parameter or the dispute will stay in the accepted state.

You can tell a dispute has been accepted if when you submit it you receive a 202 status and the state does not change to submitted.

## Product data

If a customer purchased multiple products in a disputed order, those products can be individually attached to a dispute when [updating](#updating-a-dispute) or [submitting](#submitting-a-dispute) the dispute. Each product has the following properties:

> Example usage:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -d products="[{
                   \"name\" : \"Saxophone\",
                   \"description\" : \"Alto saxophone, with carrying case\",
                   \"image\" : \"https://www.paypalobjects.com/chargehound/saxophone.png\",
                   \"sku\" : \"17283001272\",
                   \"quantity\" : 1,
                   \"amount\" : 20000,
                   \"url\" : \"http://www.example.com\",
                   \"shipping_carrier\": \"fedex\",
                   \"shipping_tracking_number\": \"657672264372\" 
                },{
                   \"name\" : \"Milk\",
                   \"description\" : \"Semi-skimmed Organic\",
                   \"image\" : \"https://www.paypalobjects.com/chargehound/milk.png\",
                   \"sku\" : \"26377382910\",
                   \"quantity\" : \"64oz\",
                   \"amount\" : 400,
                   \"url\" : \"http://www.example.com\",
                   \"shipping_carrier\": \"fedex\",
                   \"shipping_tracking_number\": \"657672264372\" 
                }]"
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.update('dp_123', {
  products: [{
    'name': 'Saxophone',
    'description': 'Alto saxophone, with carrying case',
    'image': 'https://www.paypalobjects.com/chargehound/saxophone.png',
    'sku': '17283001272',
    'quantity': 1,
    'amount': 20000,
    'url': 'http://www.example.com',
    'shipping_carrier': 'fedex',
    'shipping_tracking_number': '657672264372' 
  },{
    'name': 'Milk',
    'description': 'Semi-skimmed Organic',
    'image': 'https://www.paypalobjects.com/chargehound/milk.png',
    'sku': '26377382910',
    'quantity': '64oz',
    'amount': 400,
    'url': 'http://www.example.com',
    'shipping_carrier': 'fedex',
    'shipping_tracking_number': '657672264372' 
  }]
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.update('dp_123',
  products=[{
     'name': 'Saxophone',
     'description': 'Alto saxophone, with carrying case',
     'image': 'https://www.paypalobjects.com/chargehound/saxophone.png',
     'sku': '17283001272',
     'quantity': 1,
     'amount': 20000,
     'url': 'http://www.example.com',
     'shipping_carrier': 'fedex',
     'shipping_tracking_number': '657672264372' 
  }, {
     'name': 'Milk',
     'description': 'Semi-skimmed Organic',
     'image': 'https://www.paypalobjects.com/chargehound/milk.png',
     'sku': '26377382910',
     'quantity': '64oz',
     'amount': 400,
     'url': 'http://www.example.com',
     'shipping_carrier': 'fedex',
     'shipping_tracking_number': '657672264372' 
  }]
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.update('dp_123',
  products: [{
     'name' => 'Saxophone',
     'description' => 'Alto saxophone, with carrying case',
     'image' => 'https://www.paypalobjects.com/chargehound/saxophone.png',
     'sku' => '17283001272',
     'quantity' => 1,
     'amount' => 20000,
     'url' => 'https://www.example.com'
  },{
     'name' => 'Milk',
     'description' => 'Semi-skimmed Organic',
     'image' => 'https://www.paypalobjects.com/chargehound/milk.png',
     'sku' => '26377382910',
     'quantity' => '64oz',
     'amount' => 400,
     'url' => 'https://www.example.com'
  }]
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  ID:       "dp_123",
  Products: []chargehound.Product{
    {
      Name:                   "Saxophone",
      Description:            "Alto saxophone, with carrying case",
      Image:                  "https://www.paypalobjects.com/chargehound/saxophone.png",
      Sku:                    "17283001272",
      Quantity:               1,
      Amount:                 20000,
      Url:                    "http://www.example.com",
      ShippingCarrier:        "fedex",
      ShippingTrackingNumber: "657672264372",
    },
    {
      Name:                   "Milk",
      Description:            "Semi-skimmed Organic",
      Image:                  "https://www.paypalobjects.com/chargehound/milk.png",
      Sku:                    "26377382910",
      Quantity:               "64oz",
      Amount:                 400,
      Url:                    "http://www.example.com",
      ShippingCarrier:        "fedex",
      ShippingTrackingNumber: "657672264372",
    },
  },
}

dispute, err := ch.Disputes.Update(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;
import com.chargehound.models.Product;

Chargehound chargehound = new Chargehound("test_123");

Product saxophoneProduct = new Product.Builder()
  .name("Saxophone")
  .description("Alto saxophone, with carrying case")
  .image("https://www.paypalobjects.com/chargehound/saxophone.png")
  .sku("17283001272")
  .quantity(1)
  .amount(20000)
  .url("http://www.example.com")
  .shippingCarrier("fedex")
  .shippingTrackingNumber("657672264372")
  .finish();

Product milkProduct = new Product.Builder()
  .name("Milk")
  .description("Semi-skimmed Organic")
  .image("https://www.paypalobjects.com/chargehound/milk.png")
  .sku("26377382910")
  .quantity("64oz")
  .amount(400)
  .url("http://www.example.com")
  .shippingCarrier("fedex")
  .shippingTrackingNumber("657672264372")
  .finish();

List<Product> products = new ArrayList<Product>();
products.add(saxophoneProduct);
products.add(milkProduct);

chargehound.disputes.update("dp_123",
  new Dispute.UpdateParams.Builder()
  .products(products)
  .finish()
);
```

### Product data fields

| Field        | Type              |  Required?  | Description   |
| -------------|-------------------|-------------|--------------------------------------------------------------------------------|
| name         | string            | required  |The name of the product ordered. |
| quantity     | string or integer | required  |The number or quantity of this product (e.g. 10 or "64oz"). |
| amount       | integer           | required  |The price paid for this item, in cents (or other minor currency unit).                      |
| description  | string            | optional  |A product description - for example, the size or color. |
| image        | url               | optional  |A URL showing the product image. |
| sku          | string            | optional  |The stock-keeping unit. |
| url          | url               | optional  |The URL of the purchased item, if it is listed online. |
| shipping_carrier | string        | optional  |Shipping carrier for the shipment for the product. |
| shipping_tracking_number | string | optional |Shipping tracking number for the shipment for the product. |

## Customer correspondence

If you have a record of email communication with the customer, you can attach that record to a dispute when [updating](#updating-a-dispute) or [submitting](#submitting-a-dispute) the dispute. Each correspondence item has the following properties:

> Example usage:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -d correspondence="[{ \
       \"to\": \"customer@example.com\", \
       \"from\": \"noreply@example.com\", \
       \"sent\": \"2019-03-31 09:00:22PM UTC\", \
       \"subject\": \"Your Order\", \
       \"body\": \"Your order was received.\", \
       \"caption\": \"Order confirmation email.\" \
     }, { \
       \"to\": \"customer@example.com\", \
       \"from\": \"noreply@example.com\", \
       \"sent\": \"2019-04-03 08:59:36PM UTC\", \
       \"subject\": \"Your Order\", \
       \"body\": \"Your order was delivered.\", \
       \"caption\": \"Delivery confirmation email.\" \
     }]"
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.update('dp_123', {
  correspondence: [{
    'to': 'customer@example.com',
    'from': 'noreply@example.com',
    'sent': '2019-03-31 09:00:22PM UTC',
    'subject': 'Your Order',
    'body': 'Your order was received.',
    'caption': 'Order confirmation email.'
  }, {
    'to': 'customer@example.com',
    'from': 'noreply@example.com',
    'sent': '2019-04-01 09:00:22PM UTC',
    'subject': 'Your Order',
    'body': 'Your order was delivered.',
    'caption': 'Delivery confirmation email.'
  }]
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.update('dp_123',
  correspondence=[{
    'to': 'customer@example.com',
    'from': 'noreply@example.com',
    'sent': '2019-03-31 09:01:01PM UTC',
    'subject': 'Your Order',
    'body': 'Your order was received.',
    'caption': 'Order confirmation email.'
  }, {
    'to': 'customer@example.com',
    'from': 'noreply@example.com',
    'sent': '2019-04-01 09:01:01PM UTC',
    'subject': 'Your Order',
    'body': 'Your order was delivered.',
    'caption': 'Delivery confirmation email.'
  }]
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.update('dp_123',
  correspondence: [{
    'to' => 'customer@example.com',
    'from' => 'noreply@example.com',
    'sent' => '2019-03-31 09:01:26PM UTC',
    'subject' => 'Your Order',
    'body' => 'Your order was received.',
    'caption' => 'Order confirmation email.'
  }, {
    'to' => 'customer@example.com',
    'from' => 'noreply@example.com',
    'sent' => '2019-04-01 09:01:26PM UTC',
    'subject' => 'Your Order',
    'body' => 'Your order was delivered.',
    'caption' => 'Delivery confirmation email.'
  }]
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  ID: "dp_123",
  Correspondence: []chargehound.CorrespondenceItem{
    {
      To: "customer@example.com",
      From: "noreply@example.com",
      Sent: "2019-03-31 09:04:05PM UTC",
      Subject: "Your Order",
      Body: "Your order was received.",
      Caption: "Order confirmation email."
    },
    {
      To: "customer@example.com",
      From: "noreply@example.com",
      Sent: "2019-04-01 09:04:05PM UTC",
      Subject: "Your Order",
      Body: "Your order was delivered.",
      Caption: "Delivery confirmation email."
    },
  },
}

dispute, err := ch.Disputes.Update(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;
import com.chargehound.models.Email;

Chargehound chargehound = new Chargehound("test_123");

Email confirmationEmail = new Email.Builder()
  .to("customer@example.com")
  .from("noreply@example.com")
  .sent("2019-03-31 09:04:55PM UTC")
  .subject("Your Order")
  .body("Your order was received.")
  .caption("Order confirmation email.")
  .finish();

Email deliveryEmail = new Email.Builder()
  .to("customer@example.com")
  .from("noreply@example.com")
  .sent("2019-04-01 09:04:55PM UTC")
  .subject("Your Order")
  .body("Your order was delivered.")
  .caption("Delivery confirmation email.")
  .finish();

List<Email> correspondence = new ArrayList<Email>();
correspondence.add(confirmationEmail);
correspondence.add(deliveryEmail);

chargehound.disputes.update("dp_123",
  new Dispute.UpdateParams.Builder()
  .correspondence(correspondence)
  .finish()
);
```

### Correspondence item fields

| Field        | Type              |  Required?  | Description   |
| -------------|-------------------|-------------|--------------------------------------------------------------------------------|
| to           | string            | required  |The address where the email was sent. E.g. the customer's email address.|
| from         | string            | required  |The address of the email sender. E.g. your company's support email address. |
| sent         | string            | optional  |When the email was sent.|
| subject      | string            | required  |The email subject line.|
| body         | string            | required  |The email body, as plain text.|
| caption      | string            | optional  |A description of the email.|


## Past payments

Showing a history of valid transactions with a customer can serve as evidence that their disputed transaction was also a valid transaction. If you are unable to include past payment details, Chargehound may be able to automatically fetch past payments from your payment processor.</b> 

The past payments provided to our API should be successful, non-disputed transactions that used the same credit card as the disputed transaction. The past payment list should not include more than 10 payments. You can update the past payment history when [updating](#updating-a-dispute) or [submitting](#submitting-a-dispute) the dispute. Each payment has the following properties:

> Example usage:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -d past_payments="[{ \
       \"id\": \"ch_1\", \
       \"amount\": 20000, \
       \"currency\": \"usd\", \
       \"charged_at\": \"2019-09-10 10:18:41PM UTC\", \
       \"device_id\": \"ABCD\", \
       \"item_description\": \"10 saxophones\", \
       \"user_id\": \"chargehound@example.com\", \
       \"ip_address\": \"127.0.0.1\", \
       \"shipping_address\": \"2211 N First Street San Jose, CA 95413\" \
     }, { \
       \"id\": \"ch_2\", \
       \"amount\": 50000, \
       \"currency\": \"usd\", \
       \"charged_at\": \"2019-09-03 10:18:41PM UTC\", \
       \"device_id\": \"ABCD\", \
       \"item_description\": \"1 gallon of semi-skimmed milk\", \
       \"user_id\": \"chargehound@example.com\", \
       \"ip_address\": \"127.0.0.1\", \
       \"shipping_address\": \"2211 N First Street San Jose, CA 95413\" \
     }]"
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.update('dp_123', {
  past_payments: [{
    'id': 'ch_1',
    'amount': 20000,
    'currency': 'usd',
    'charged_at': '2019-09-10 11:09:41PM UTC',
    'device_id': 'ABCD',
    'item_description': '10 saxophones',
    'user_id': 'chargehound@example.com',
    'ip_address': '127.0.0.1',
    'shipping_address': '2211 N First Street San Jose, CA 95413'
  }, {
    'id': 'ch_2',
    'amount': 50000,
    'currency': 'usd',
    'charged_at': '2019-09-03 11:09:41PM UTC',
    'device_id': 'ABCD',
    'item_description': '1 gallon of semi-skimmed milk',
    'user_id': 'chargehound@example.com',
    'ip_address': '127.0.0.1',
    'shipping_address': '2211 N First Street San Jose, CA 95413'
  }]
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.update('dp_123',
  past_payments = [{
    'id': 'ch_1',
    'amount': 20000,
    'currency': 'usd',
    'charged_at': '2019-09-10 11:10:06PM UTC',
    'device_id': 'ABCD',
    'item_description': '10 saxophones',
    'user_id': 'chargehound@example.com',
    'ip_address': '127.0.0.1',
    'shipping_address': '2211 N First Street San Jose, CA 95413'
  }, {
    'id': 'ch_2',
    'amount': 50000,
    'currency': 'usd',
    'charged_at': '2019-09-03 11:10:06PM UTC',
    'device_id': 'ABCD',
    'item_description': '1 gallon of semi-skimmed milk',
    'user_id': 'chargehound@example.com',
    'ip_address': '127.0.0.1',
    'shipping_address': '2211 N First Street San Jose, CA 95413'
  }]
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.update('dp_123',
  past_payments: [{
    'id' => 'ch_1',
    'amount' => 20000,
    'currency' => 'usd',
    'charged_at' => '2019-09-10 11:10:14PM UTC',
    'device_id' => 'ABCD',
    'item_description' => '10 saxophones',
    'user_id' => 'chargehound@example.com',
    'ip_address' => '127.0.0.1',
    'shipping_address' => '2211 N First Street San Jose, CA 95413'
  }, {
    'id' => 'ch_2',
    'amount' => 50000,
    'currency' => 'usd',
    'charged_at' => '2019-09-03 11:10:14PM UTC',
    'device_id' => 'ABCD',
    'item_description' => '1 gallon of semi-skimmed milk',
    'user_id' => 'chargehound@example.com',
    'ip_address' => '127.0.0.1',
    'shipping_address' => '2211 N First Street San Jose, CA 95413'
  }]
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  ID:       "dp_123",
  PastPayments: []chargehound.PastPayment{
    {
      ID: "ch_1",
      Amount: 20000,
      Currency: "usd",
      ChargedAt: "2019-09-10 11:10:22PM UTC",
      DeviceId: "ABCD",
      ItemDescription: "10 saxophones",
      UserId: "chargehound@example.com",
      IPAddress: "127.0.0.1",
      ShippingAddress: "2211 N First Street San Jose, CA 95413",  
    },
    {
      ID: "ch_2",
      Amount: 50000,
      Currency: "usd",
      ChargedAt: "2019-09-03 11:10:22PM UTC",
      DeviceId: "ABCD",
      ItemDescription: "1 gallon of semi-skimmed milk",
      UserId: "chargehound@example.com",
      IPAddress: "127.0.0.1",
      ShippingAddress: "2211 N First Street San Jose, CA 95413",
    },
  },
}

dispute, err := ch.Disputes.Update(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;
import com.chargehound.models.PastPayment;

Chargehound chargehound = new Chargehound("test_123");

PastPayment firstPayment = new PastPayment.Builder()
  .id("ch_1")
  .amount(20000)
  .currency("usd")
  .chargedAt("2019-09-10 11:10:47PM UTC")
  .deviceId("ABCD")
  .itemDescription("10 saxophones")
  .userId("chargehound@example.com")
  .ipAddress("127.0.0.1")
  .shippingAddress("2211 N First Street San Jose, CA 95413")
  .finish();

PastPayment secondPayment = new PastPayment.Builder()
  .id("ch_2")
  .amount(50000)
  .currency("usd")
  .chargedAt("2019-09-03 11:10:47PM UTC")
  .deviceId("ABCD")
  .itemDescription("1 gallon of semi-skimmed milk")
  .userId("chargehound@example.com")
  .ipAddress("127.0.0.1")
  .shippingAddress("2211 N First Street San Jose, CA 95413")
  .finish();


List<PastPayment> pastPayments = new ArrayList<PastPayment>();
pastPayments.add(firstPayment);
pastPayments.add(secondPayment);

chargehound.disputes.update("dp_123",
  new Dispute.UpdateParams.Builder()
  .pastPayments(pastPayments)
  .finish()
);
```

### Past payment fields

| Field            | Type   | Required? | Description                                                             |
|------------------|--------|--|-------------------------------------------------------------------------|
| id               | string | required | The ID of the transaction in your payment processor.                    |
| amount           | integer | required | The amount of the transaction, in cents (or other minor currency unit.) |
| currency         | string | required | A 3 character ISO currency code.                                        |
| charged_at       | string or integer | required | The date of the transaction, as a formatted string or Unix timestamp.   |
| device_id        | string | optional | The unique device ID of the buyer                                       |
| item_description | string | optional | The description or name of the item purchased                           |
| user_id          | string | optional | The user login or email address of the buyer                            |
| ip_address       | string | optional | The IP Address of the buyer device                                      |
| shipping_address | string | optional | The shipping address of the transaction                                 |
## Manual review

> Example usage:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_123/submit \
  -u test_123: \
  -d force=true
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.submit('dp_123', {
  force: true
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.submit('dp_123',
  force=True
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.submit('dp_123',
  force: true
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  Force: true
}

dispute, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

chargehound.disputes.submit("dp_123",
  new Dispute.UpdateParams.Builder()
    .force(true)
    .finish()
);
```

You might want to have the chance to look over some disputes before you submit your response to the bank, so we allow you create rules to mark certain disputes for manual review.

In order submit a dispute that has been marked for review via the API, you will need to pass an extra `force` parameter or the dispute will stay in the manual review queue.

You can tell a dispute has been marked for manual review if when you submit it you receive a 202 status and the state does not change to submitted.

## Braintree read only

> Example usage:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_123/submit \
  -u test_123: \
  -d charge=ch_123
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.submit('dp_123', {
  charge: 'ch_123'
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.submit('dp_123',
  charge='ch_123'
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.submit('dp_123',
  charge: 'ch_123'
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  Charge: "ch_123"
}

dispute, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

chargehound.disputes.submit("dp_123",
  new Dispute.UpdateParams.Builder()
    .charge("ch_123")
    .finish()
);
```

If Chargehound does not have access to the Braintree disputes API, you'll need to create a Braintree user with disputes access and add their credentials to your Chargehound account. Login to Braintree and create a Braintree user [here](https://articles.braintreepayments.com/control-panel/basics/users-roles) with role permissions that include viewing and editing disputes. Add the credentials for that user on your settings page [here](/dashboard/settings/processors).

You will also need to attach the Braintree transaction id using the `charge` parameter when updating or submitting disputes using the Chargehound API.

You can always reconnect your Braintree account from the settings page [here](/dashboard/settings/processors) to grant Chargehound access to the disputes API, this will make your integration easier.

## Stripe charging directly

> Example usage:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_123/submit \
  -u test_123: \
  -d account_id=acct_123
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

chargehound.Disputes.submit('dp_123', {
  account_id: 'acct_123'
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_123'

chargehound.Disputes.submit('dp_123',
  account_id='acct_123'
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

Chargehound::Disputes.submit('dp_123',
  account_id: 'acct_123'
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

params := chargehound.UpdateDisputeParams{
  AccountID: "acct_123"
}

dispute, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

chargehound.disputes.submit("dp_123",
  new Dispute.UpdateParams.Builder()
    .accountId("acct_123")
    .finish()
);
```

In order to work with Stripe Managed or Connected account integrations that [charge directly](https://stripe.com/docs/connect/direct-charges), you will need to attach the Stripe account id to the dispute using the `account_id` parameter. When you receive a webhook to your Connect webhook endpoint, get the `account` from the event. The `account_id` is the Stripe account id that you will need to set.
