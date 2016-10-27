# Disputes

Dispute objects represent a dispute created on a charge. They can also be referred to as chargebacks. In order to contest a dispute, attach a Template and update the dispute with the Template's required fields.

A Dispute object is:

| Field                | Type       | Description                                                                                 |
| ---------------------|------------|---------------------------------------------------------------------------------------------|
| id                   | string     | A unique identifier for the dispute. This id is set by the payment processor of the dispute. |
| state                | string     | State of the dispute. One of `needs_response`,`submitted`, `under_review`, `won`, `lost`, `warning_needs_response`, `warning_under_review`, `warning_closed` , `response_disabled`, `charge_refunded`.                                                  |
| reason               | string     | Reason for the dispute. One of `fraudulent`, `unrecognized`, `general`, `duplicate`, `subscription_canceled`, `product_unacceptable`, `product_not_received`, `credit_not_processed`, `incorrect_account_details`, `insufficient_funds`, `bank_cannot_process`, `debit_not_authorized`, `goods_services_returned_or_refused`, `goods_services_cancelled` | 
| charged_at           | string     | ISO 8601 timestamp - when the charge was made.                                              |
| disputed_at          | string     | ISO 8601 timestamp - when the charge was disputed.                                          |
| due_by               | string     | ISO 8601 timestamp - when dispute evidence needs to be disputed by.                         |
| submitted_at         | string     | ISO 8601 timestamp - when dispute evidence was submitted.                                   |
| closed_at            | string     | ISO 8601 timestamp - when the dispute was resolved.                                         |
| submitted_count      | integer    | Number of times the dispute evidence has been submitted.                                    |
| file_url             | string     | Location of the generated evidence document.                                                |
| template             | string     | Id of the template attached to the dispute.                                                 |
| fields               | dictionary | Evidence fields attached to the dispute.                                                    |
| missing_fields       | dictionary | Any fields required by the template that have not yet been provided.                        |
| products             | array      | (Optional) A list of products in the disputed order. (See [Product data](#product-data) for details.) |
| charge               | string     | Id of the disputed charge.                                                                  |
| is_charge_refundable | boolean    | Can the charge be refunded.                                                                 |
| amount               | integer    | Amount of the disputed charge. Amounts are in cents (or other minor currency unit.)         |
| currency             | string     | Currency code of the disputed charge. e.g. 'USD'.                                           |
| fee                  | integer    | Dispute fee.                                                                                |
| reversal_amount      | integer    | The amount deducted due to the chargeback. Amounts are in cents (or other minor currency unit.)         |
| reversal_currency    | string     | Currency code of the deduction amount. e.g. 'USD'.                                           |
| external_customer    | string     | Id of the customer (if any). This id is set by the payment processor of the dispute. |
| customer_name        | string     | Name of the customer (if any).                                                       |
| customer_email       | string     | Email of the customer (if any).                                                      |
| customer_purchase_ip | string     | IP of purchase (if available).                                                              |
| address_zip          | string     | Billing address zip of the charge.                                                          |
| address_line1_check  | string     | State of address check (if available). One of `pass`, `fail`, `unavailable`, `checked`.     |
| address_zip_check    | string     | State of address zip check (if available). One of `pass`, `fail`, `unavailable`, `checked`. |
| cvc_check            | string     | State of cvc check (if available). One of `pass`, `fail`, `unavailable`, `checked`.         |
| statement_descriptor | string     | The descriptor that appears on the customer's credit card statement for this change.        |
| account_id           | string     | The account id for Connected accounts that are charged directly through Stripe (if any).
| created              | string     | ISO 8601 timestamp.                                                                         |
| updated              | string     | ISO 8601 timestamp.                                                                         |
| source               | string     | The source of the dispute. One of `mock`, `braintree`, `api` or `stripe` |
| processor            | string     | The payment processor of the dispute. One of `braintree` or `stripe` |

## Submitting a dispute

> Definition:

```sh
POST /v1/disputes/{{dispute_id}}/submit
```

```js
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

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_XXX/submit \
  -u test_XXX: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.submit('dp_XXX', {
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
chargehound.api_key = 'test_XXX'

chargehound.Disputes.submit('dp_XXX',
  template='unrecognized',
  fields={
    'customer_name': 'Susie Chargeback'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.submit('dp_XXX',
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

ch := chargehound.New("test_XXX") 

params := chargehound.UpdateDisputeParams{
  ID:       "dp_XXX",
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
}

dispute, err := ch.Disputes.Submit(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "updated": "2016-10-18T20:38:51",
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "submitted",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_XXX",
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
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "amount": 500,
  "processor": "stripe"
}
```

You will want to submit the dispute through Chargehound after you receive a notification from the source payment processor of a new dispute. With one `POST` request you can update a dispute with the evidence fields and send the generated response to the source payment processor.

The dispute will be in the `submitted` state if the submit was successful. 

### Parameters:

| Parameter      | Type       | Required?  | Description                                                                                                           |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| template       | string     | optional   | The id of the template to use.                                                                                        |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields.                                                            |
| products       | array      | optional   | List of products the customer purchased.                                                                              |
| account_id | string     | optional   | Set the account id for Connected accounts that are charged directly through Stripe. |
| charge | string     | optional   | You will need to send the transaction id if the payment processor is Braintree. |

### Possible errors:

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Creating a dispute

Disputes are not created via the REST API. Instead, once your payment processor is connected we will mirror disputes via webhooks. You will reference the dispute with the same id that is used by the payment processor.

## Create a dispute

> Definition:

```sh
POST /v1/disputes
```

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes?submit=true \
  -u test_XXX: \
  -d template=unrecognized \
  -d fields[customer_ip]="0.0.0.0" \
  -d external_identifier=dp_XXX \
  -d external_charge=ch_XXX \
  -d external_customer=cus_XXX \
  -d processor=stripe \
  -d reason=fraudulent \
  -d charged_at="2016-03-14T19:34:57" \
  -d disputed_at="2016-03-15T21:35:28" \
  -d due_by="2016-03-30T23:59:59" \ 
  -d currency=USD \
  -d amount=10000 \
  -d reversal_currency=USD \
  -d fee=15000 \
  -d reversal_amount=10000
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

When Chargehound has generated a response we will send the result to your server URL.

```sh
POST /my/chargehound/webhook
```

> Example request:

```sh
curl -X POST https://my.host.com/my/chargehound/webhook \
  -d livemode=true \
  -d type="dispute.response.generated"
  -d dispute_id=dp_XXX \
  -d external_charge=ch_XXX \
  -d account_id=acct_XXX \
  -d evidence[customer_ip]="0.0.0.0" \
  -d response_url=https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX
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

## Retrieving a Dispute Response

Fetching the Chargehound response.

```sh
GET /v1/disputes/{{dispute_id}}/response
```

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes/dp_XXX/response \
  -u test_XXX:
```

```
> Example response

```json
{
  "response_url": "https://chargehound.s3.amazonaws.com/XXX.pdf?Signature=XXX&Expires=XXX&AWSAccessKeyId=XXX",
  "evidence": {
    "customer_ip": "0.0.0.0"
  },

## Retrieving a list of disputes

> Definition:

```sh
GET /v1/disputes
```

```js
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

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes \
  -u test_XXX:
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.list(), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.list()
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.list
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

disputeList, err := ch.Disputes.List(nil)
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
      "external_customer": "cus_XXX",
      "updated": null,
      "currency": "usd",
      "missing_fields": {},
      "address_zip_check": "pass",
      "closed_at": null,
      "id": "dp_XXX",
      "customer_name": "Susie Chargeback",
      "fee": 1500,
      "reversal_amount": 500,
      "due_by": "2016-11-18T20:38:51",
      "state": "needs_response",
      "statement_descriptor": "COMPANY",
      "source": "stripe",
      "charge": "ch_XXX",
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
      "url": "/v1/disputes/dp_XXX",
      "fields": {},
      "charged_at": "2016-09-18T20:38:51",
      "products": [],
      "amount": 500,
      "processor": "stripe"
    }
  ]
}
```

This endpoint will list all the disputes that we have synced from your payment processor. By default the disputes will be ordered by created with the most recent dispute first. `has_more` will be true if more results are available.

### Parameters:

| Parameter      | Type       | Required?  | Description                                                          |
| -------------  | ---------- | ---------- | -------------------------------------------------------------------- |
| limit          | integer    | optional   | Maximum number of disputes to return. Default is 20, maximum is 100. |
| starting_after | string     | optional   | A dispute id. Fetch disputes created after this dispute.             |
| ending_before  | string     | optional   | A dispute id. Fetch disputes created before this dispute.            |

## Retrieving a dispute

> Definition:

```sh
GET /v1/disputes/{{dispute_id}}
```

```js
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

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes/dp_XXX \
  -u test_XXX:
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.retrieve('dp_XXX'), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.retrieve('dp_XXX')
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.retrieve('dp_XXX')
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

params := chargehound.RetrieveDisputeParams{
  ID: "dp_XXX",
}

dispute, err := ch.Disputes.Retrieve(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "updated": null,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_XXX",
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
  "url": "/v1/disputes/dp_XXX",
  "fields": {},
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "amount": 500,
  "processor": "stripe"
}
```

You can retrieve a single dispute by its id.

## Updating a dispute

> Definition:

```sh
PUT /v1/disputes/{{dispute_id}}
```

```js
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

> Example request:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_XXX \
  -u test_XXX: \
  -d template=unrecognized \
  -d fields[customer_name]="Susie Chargeback" 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.update('dp_XXX', {
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
chargehound.api_key = 'test_XXX'

chargehound.Disputes.update('dp_XXX',
  template='unrecognized',
  fields={
    'customer_name': 'Susie Chargeback'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.update('dp_XXX',
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

ch := chargehound.New("test_XXX") 

params := chargehound.UpdateDisputeParams{
  ID:       "dp_XXX",
  Template: "unrecognized",
  Fields: map[string]interface{}{
    "customer_name": "Susie Chargeback",
  },
}

dispute, err := ch.Disputes.Update(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "updated": "2016-10-18T20:38:51",
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_XXX",
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
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_name": "Susie Chargeback"
  },
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "amount": 500,
  "processor": "stripe"
}
```

You can update the template and the fields on a dispute.

### Parameters:

| Parameter      | Type       | Required?  | Description                                                                                                           |
| -------------  | ---------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| template       | string     | optional   | The id of the template to use.                                                                                        |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields.                                                            |
| products       | array      | optional   | (Optional) List of products the customer purchased. (See [Product data](#product-data) for details.)                  |
| account_id | string     | optional   | Set the account id for Connected accounts that are charged directly through Stripe. |
| charge | string     | optional   | You will need to send the transaction id if the payment processor is Braintree. |

### Possible errors:

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Product data

If a customer purchased multiple products in a disputed order, those products can be individually attached to a dispute. Each product has the following properties:

### Product data fields

| Field        | Type              | Description                                                                                 |
| -------------|-------------------|---------------------------------------------------------------------------------------------|
| name         | string            | The name of the product ordered.                                                            |
| quantity     | string or integer | The number or quantity of this product (e.g. 10 or "64oz").                                 |
| amount       | integer           | The price paid for this item, in cents (or other minor currency unit).                      |
| description  | string            | (Optional) A product description - for example, the size or color.                          |
| image        | url               | (Optional) A URL showing the product image.                                                 |
| sku          | string            | (Optional) The stock-keeping unit.                                                          |
| url          | url               | (Optional) The URL of the purchased item, if it is listed online.                           |


## Updating product data 

> Definition:

```sh
PUT /v1/disputes/{{dispute_id}}
```

```js
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

> Example request:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_XXX \
  -u test_XXX: \
  -d products="[{
                   \"name\" : \"Saxophone\",
                   \"description\" : \"Alto saxophone, with carrying case\",
                   \"image\" : \"http://s3.amazonaws.com/chargehound/saxophone.png\",
                   \"sku\" : \"17283001272\",
                   \"quantity\" : 1,
                   \"amount\" : 20000,
                   \"url\" : \"http://www.example.com\"
                },{
                   \"name\" : \"Milk\",
                   \"description\" : \"Semi-skimmed Organic\",
                   \"image\" : \"http://s3.amazonaws.com/chargehound/milk.png\",
                   \"sku\" : \"26377382910\",
                   \"quantity\" : \"64oz\",
                   \"amount\" : 400,
                   \"url\" : \"http://www.example.com\"
                }]"
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.update('dp_XXX', {
  products: [{
    'name': 'Saxophone',
    'description': 'Alto saxophone, with carrying case',
    'image': 'http://s3.amazonaws.com/chargehound/saxophone.png',
    'sku': '17283001272',
    'quantity': 1,
    'amount': 20000,
    'url': 'http://www.example.com'
  },{
    'name': 'Milk',
    'description': 'Semi-skimmed Organic',
    'image': 'http://s3.amazonaws.com/chargehound/milk.png',
    'sku': '26377382910',
    'quantity': '64oz',
    'amount': 400,
    'url': 'http://www.example.com'
  }]
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.update('dp_XXX',
  products=[{
     'name': 'Saxophone',
     'description': 'Alto saxophone, with carrying case',
     'image': 'http://s3.amazonaws.com/chargehound/saxophone.png',
     'sku': '17283001272',
     'quantity': 1,
     'amount': 20000,
     'url': 'http://www.example.com'
  }, {
     'name': 'Milk',
     'description': 'Semi-skimmed Organic',
     'image': 'http://s3.amazonaws.com/chargehound/milk.png',
     'sku': '26377382910',
     'quantity': '64oz',
     'amount': 400,
     'url': 'http://www.example.com'
  }]
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.update('dp_XXX',
  products: [{
     'name' => 'Saxophone',
     'description' => 'Alto saxophone, with carrying case',
     'image' => 'http =>//s3.amazonaws.com/chargehound/saxophone.png',
     'sku' => '17283001272',
     'quantity' => 1,
     'amount' => 20000,
     'url' => 'http =>//www.example.com'
  },{
     'name' => 'Milk',
     'description' => 'Semi-skimmed Organic',
     'image' => 'http =>//s3.amazonaws.com/chargehound/milk.png',
     'sku' => '26377382910',
     'quantity' => '64oz',
     'amount' => 400,
     'url' => 'http =>//www.example.com'
  }]
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

params := chargehound.UpdateDisputeParams{
  ID:       "dp_2284d5ac6eba4e4e8e9a80df0f9c2287",
  Template: "unrecognized",
  Products: []chargehound.Product{
    {
      Name:        "Saxophone",
      Description: "Alto saxophone, with carrying case",
      Image:       "http://s3.amazonaws.com/chargehound/saxophone.png",
      Sku:         "17283001272",
      Quantity:    1,
      Amount:      20000,
      Url:         "http://www.example.com",
    },
    {
      Name:        "Milk",
      Description: "Semi-skimmed Organic",
      Image:       "http://s3.amazonaws.com/chargehound/milk.png",
      Sku:         "26377382910",
      Quantity:    "64oz",
      Amount:      400,
      Url:         "http://www.example.com",
    },
  },
}

dispute, err := ch.Disputes.Update(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "updated": null,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_XXX",
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
  "url": "/v1/disputes/dp_XXX",
  "fields": {},
  "charged_at": "2016-09-18T20:38:51",
  "products": [
    {
      "sku": "17283001272",
      "name": "Saxophone",
      "url": "http://www.example.com",
      "image": "http://s3.amazonaws.com/chargehound/saxophone.png",
      "amount": 20000,
      "quantity": "1",
      "description": "Alto saxophone, with carrying case"
    },
    {
      "sku": "26377382910",
      "name": "Milk",
      "url": "http://www.example.com",
      "image": "http://s3.amazonaws.com/chargehound/milk.png",
      "amount": 400,
      "quantity": "64oz",
      "description": "Semi-skimmed Organic"
    }
  ],
  "amount": 500,
  "processor": "stripe"
}
```

### Parameters:

| Parameter      | Type       | Required?  | Description                                                                                                           |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| template       | string     | optional   | The id of the template to use.                                                                                        |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields.                                                            |
| products       | array      | optional   | List of products the customer purchased.                                                                              |
| account_id | string     | optional   | Set the account id for Connected accounts that are charged directly through Stripe. |
| charge | string     | optional   | You will need to send the transaction id if the payment processor is Braintree. |

## Connected accounts

In order to work with Stripe Managed or Connected account integrations that charge directly, you will need to attach the Stripe account id to the dispute using the `account_id` parameter. When you recieve a webhook to your Connect webhook endpoint, get the `user_id` from the event. The `user_id` is the Stripe account id that you will need to set.

### Updating Connected accounts

> Definition:

```sh
POST /v1/disputes/{{dispute_id}}/submit
```

```js
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

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_XXX/submit \
  -u test_XXX: \
  -d template=unrecognized \
  -d account_id=acct_XXX 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.submit('dp_XXX', {
  template: 'unrecognized',
  account_id: 'acct_XXX'
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = 'test_XXX'

chargehound.Disputes.submit('dp_XXX',
  template='unrecognized',
  account_id='acct_XXX'
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.submit('dp_XXX',
  template: 'unrecognized',
  account_id: 'acct_XXX'
)
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_XXX") 

params := chargehound.UpdateDisputeParams{
  ID:        "dp_XXX",
  Template:  "unrecognized",
  AccountID: "acct_XXX",
}

dispute, err := ch.Disputes.Submit(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "updated": null,
  "currency": "usd",
  "missing_fields": {},
  "address_zip_check": "pass",
  "closed_at": null,
  "id": "dp_XXX",
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "reversal_amount": 500,
  "due_by": "2016-11-18T20:38:51",
  "state": "needs_response",
  "statement_descriptor": "COMPANY",
  "source": "stripe",
  "charge": "ch_XXX",
  "template": null,
  "is_charge_refundable": false,
  "cvc_check": "unavailable",
  "customer_email": "susie@example.com",
  "account_id": "acct_XXX",
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
  "url": "/v1/disputes/dp_XXX",
  "fields": {},
  "charged_at": "2016-09-18T20:38:51",
  "products": [],
  "amount": 500,
  "processor": "stripe"
}
```

### Parameters:

| Parameter      | Type       | Required?  | Description                                                                                                           |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| template       | string     | optional   | The id of the template to use.                                                                                        |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields.                                                            |
| products       | array      | optional   | List of products the customer purchased.                                                                              |
| account_id | string     | optional   | Set the account id for Connected accounts that are charged directly through Stripe. |
| charge | string     | optional   | You will need to send the transaction id if the payment processor is Braintree. |
