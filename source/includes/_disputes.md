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
| fee                  | integer    | Dispute fee.                                                                                |
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
| processor            | string     | The payment processor of the dispute. One of `mock`, `braintree` or `stripe` |

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
  -d fields[customer_ip]="0.0.0.0" 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.submit('dp_XXX', {
  template: 'unrecognized',
  fields: {
    customer_ip: '0.0.0.0'
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
    'customer_ip': '0.0.0.0'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.submit('dp_XXX',
  template: 'unrecognized',
  fields: {
    'customer_ip' => '0.0.0.0'
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
    "customer_ip": "0.0.0.0",
  },
}

dispute, err := ch.Disputes.Submit(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "due_by": "2016-03-30T23:59:59",
  "charge": "ch_XXX",
  "id": "dp_XXX",
  "state": "submitted",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "updated": "2016-03-16T20:58:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-14T19:35:17",
  "submitted_count": 0,
  "reason": "unrecognized",
  "charged_at": "2016-03-14T19:34:57",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-14T19:35:17",
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_ip": "0.0.0.0",
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 500,
  "source": "stripe",
  "products": []
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

### Possible errors:

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Creating a dispute

Disputes are not created via the REST API. Instead, once your payment processor is connected we will mirror disputes via webhooks. You will reference the dispute with the same id that is used by the payment processor.

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
      "currency": "usd",
      "cvc_check": null,
      "address_line1_check": null,
      "address_zip_check": null,
      "closed_at": null,
      "statement_descriptor": null,
      "customer_name": "Susie Chargeback",
      "fee": 1500,
      "due_by": "2016-03-31T23:59:59",
      "charge": "ch_17pPCgLU6oDzEeR14leOmeCC",
      "id": "dp_XXX",
      "state": "needs_response",
      "template": null,
      "is_charge_refundable": false,
      "updated": "2016-03-16T20:58:34",
      "customer_email": null,
      "object": "dispute",
      "customer_purchase_ip": null,
      "disputed_at": "2016-03-15T21:35:28",
      "submitted_count": 0,
      "reason": "general",
      "charged_at": "2016-03-15T20:55:46",
      "address_zip": null,
      "submitted_at": null,
      "created": "2016-03-15T21:35:28",
      "fields": {
        "exp_month": 12,
        "last4": "0259",
        "charged_at": "2016-03-15T20:55:46",
        "card_brand": "Visa",
        "exp_year": 2017,
        "customer_name": "Susie Chargeback"
      },
      "file_url": null,
      "amount": 515,
      "source": "stripe",
      "products": []
    },
    {
      "external_customer": "cus_XXX",
      "currency": "usd",
      "cvc_check": null,
      "address_line1_check": null,
      "address_zip_check": null,
      "closed_at": null,
      "statement_descriptor": null,
      "customer_name": "Susie Chargeback",
      "fee": 1500,
      "due_by": "2016-03-31T23:59:59",
      "charge": "ch_17pMauLU6oDzEeR1CKoB9Ovn",
      "id": "dp_abc",
      "state": "submitted",
      "template": "default",
      "is_charge_refundable": false,
      "updated": "2016-03-16T20:58:34",
      "customer_email": null,
      "object": "dispute",
      "customer_purchase_ip": null,
      "disputed_at": "2016-03-15T18:09:01",
      "submitted_count": 3,
      "reason": "general",
      "charged_at": "2016-03-15T18:08:36",
      "address_zip": null,
      "submitted_at": "2016-03-15T18:38:49",
      "created": "2016-03-15T18:09:01",
      "fields": {
        "exp_month": 12,
        "last4": "0259",
        "charged_at": "2016-03-15T18:08:36",
        "card_brand": "Visa",
        "exp_year": 2017,
        "customer_name": "Susie Chargeback"
      },
      "file_url": null,
      "amount": 500,
      "source": "stripe",
      "products": []
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
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Customer for test@example.com",
  "fee": 1500,
  "due_by": "2016-03-31T23:59:59",
  "charge": "ch_17pPCgLU6oDzEeR14leOmeCC",
  "id": "dp_XXX",
  "state": "needs_response",
  "template": null,
  "is_charge_refundable": false,
  "updated": "2016-03-16T20:58:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-15T21:35:28",
  "submitted_count": 0,
  "reason": "general",
  "charged_at": "2016-03-15T20:55:46",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-15T21:35:28",
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "exp_month": 12,
    "last4": "0259",
    "charged_at": "2016-03-15T20:55:46",
    "card_brand": "Visa",
    "exp_year": 2017,
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 515,
  "source": "stripe",
  "products": []
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
curl -X PUT https://api.chargehound.com/v1/disputes/dp_XXX/update \
  -u test_XXX: \
  -d template=unrecognized \
  -d fields[customer_ip]="0.0.0.0" 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.update('dp_XXX', {
  template: 'unrecognized',
  fields: {
    customer_ip: '0.0.0.0'
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
    'customer_ip': '0.0.0.0'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.update('dp_XXX',
  template: 'unrecognized',
  fields: {
    'customer_ip' => '0.0.0.0'
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
    "customer_ip": "0.0.0.0",
  },
}

dispute, err := ch.Disputes.Update(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "due_by": "2016-03-30T23:59:59",
  "charge": "ch_XXX",
  "id": "dp_XXX",
  "state": "needs_response",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "updated": "2016-03-16T21:48:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-14T19:35:17",
  "submitted_count": 0,
  "reason": "unrecognized",
  "charged_at": "2016-03-14T19:34:57",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-14T19:35:17",
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_ip": "0.0.0.0",
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 500,
  "source": "stripe",
  "products": []
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


## Submitting product data with a dispute

Product data can be sent when a dispute is submitted.

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

chargehound.Disputes.submit('dp_XXX', {
  template: 'unrecognized',
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

chargehound.Disputes.submit('dp_XXX',
  template='unrecognized',
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

Chargehound::Disputes.submit('dp_XXX',
  template: 'unrecognized',
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

dispute, err := ch.Disputes.Submit(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "due_by": "2016-03-30T23:59:59",
  "charge": "ch_XXX",
  "id": "dp_XXX",
  "state": "submitted",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "updated": "2016-03-16T20:58:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-14T19:35:17",
  "submitted_count": 0,
  "reason": "unrecognized",
  "charged_at": "2016-03-14T19:34:57",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-14T19:35:17",
  "url": "/v1/disputes/dp_XXX",
  "products": [{
      "name": "Saxophone",
      "description": "Alto saxophone, with carrying case",
      "image": "http://s3.amazonaws.com/chargehound/saxophone.png",
      "sku": "17283001272",
      "quantity": "1",
      "amount": 20000,
      "url": "http://www.example.com"
    },{
      "name": "Milk",
      "description": "Semi-skimmed Organic",
      "image": "http://s3.amazonaws.com/chargehound/milk.png",
      "sku": "26377382910",
      "quantity": "64oz",
      "amount": 400,
      "url": "http://www.example.com"
  }],
  "file_url": null,
  "amount": 21900,
  "source": "stripe"
}
```


## Updating product data 

You can update the product data on a dispute.

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
curl -X PUT https://api.chargehound.com/v1/disputes/dp_XXX/update \
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
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "due_by": "2016-03-30T23:59:59",
  "charge": "ch_XXX",
  "id": "dp_XXX",
  "state": "needs_response",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "updated": "2016-03-16T21:48:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-14T19:35:17",
  "submitted_count": 0,
  "reason": "unrecognized",
  "charged_at": "2016-03-14T19:34:57",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-14T19:35:17",
  "url": "/v1/disputes/dp_XXX",
  "products": [{
      "name": "Saxophone",
      "description": "Alto saxophone, with carrying case",
      "image": "http://s3.amazonaws.com/chargehound/saxophone.png",
      "sku": "17283001272",
      "quantity": "1",
      "amount": 20000,
      "url": "http://www.example.com"
    },{
      "name": "Milk",
      "description": "Semi-skimmed Organic",
      "image": "http://s3.amazonaws.com/chargehound/milk.png",
      "sku": "26377382910",
      "quantity": "64oz",
      "amount": 400,
      "url": "http://www.example.com"
  }],
  "file_url": null,
  "amount": 21900,
  "source": "stripe"
}
```

## Connected accounts

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
  -d account_id=acct_xxx \
  -d fields[customer_ip]="0.0.0.0" 
```

```js
var chargehound = require('chargehound')(
  'test_XXX'
);

chargehound.Disputes.submit('dp_XXX', {
  template: 'unrecognized',
  account_id: 'acct_xxx',
  fields: {
    customer_ip: '0.0.0.0'
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
  account_id='acct_xxx',
  fields={
    'customer_ip': '0.0.0.0'
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_XXX'

Chargehound::Disputes.submit('dp_XXX',
  template: 'unrecognized',
  account_id: 'acct_xxx',
  fields: {
    'customer_ip' => '0.0.0.0'
  }
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
  AccountID: "acct_xxx",
  Fields: map[string]interface{}{
    "customer_ip": "0.0.0.0",
  },
}

dispute, err := ch.Disputes.Submit(&params)
```

> Example response:

```json
{
  "external_customer": "cus_XXX",
  "livemode": false,
  "currency": "usd",
  "cvc_check": null,
  "address_line1_check": null,
  "address_zip_check": null,
  "missing_fields": {},
  "closed_at": null,
  "statement_descriptor": null,
  "customer_name": "Susie Chargeback",
  "fee": 1500,
  "due_by": "2016-03-30T23:59:59",
  "charge": "ch_XXX",
  "id": "dp_XXX",
  "state": "submitted",
  "template": "unrecognized",
  "is_charge_refundable": false,
  "updated": "2016-03-16T20:58:34",
  "customer_email": null,
  "object": "dispute",
  "customer_purchase_ip": null,
  "disputed_at": "2016-03-14T19:35:17",
  "submitted_count": 0,
  "reason": "unrecognized",
  "charged_at": "2016-03-14T19:34:57",
  "address_zip": null,
  "submitted_at": null,
  "created": "2016-03-14T19:35:17",
  "url": "/v1/disputes/dp_XXX",
  "fields": {
    "customer_ip": "0.0.0.0",
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 500,
  "source": "stripe",
  "products": []
}
```

In order to work with Stripe Managed or Connected account integrations that charge directly, you will need to attach the Stripe account id to the dispute using the `account_id` parameter. When you recieve a webhook to your Connect webhook endpoint, get the `user_id` from the event. The `user_id` is the Stripe account id that you will need to set.


### Parameters:

| Parameter      | Type       | Required?  | Description                                                                                                           |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| template       | string     | optional   | The id of the template to use.                                                                                        |
| fields         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields.                                                            |
| products       | array      | optional   | List of products the customer purchased.                                                                              |
| account_id | string     | optional   | Set the account id for Connected accounts that are charged directly through Stripe. |
