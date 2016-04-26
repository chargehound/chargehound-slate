# Disputes

Dispute objects represent a dispute created on a charge in Stripe. A dispute has information about the charge and customer. In order to contest a dispute, attach a Template and update the dispute with the Template's required fields.

A Dispute object is:

| Field       | Type   | Description                                                                        |
| ------------|--------|-------------------------------------------------                                   |
| id          | string     | A unique identifier for the dispute. This is the same id used by Stripe.           |
| state       | string     | State of the dispute. One of `needs_response`,`submitted`, `under_review`, `won`, `lost`, `warning_needs_response`, `warning_under_review`, `warning_closed` , `response_disabled`, `charge_refunded`.                                                  |
| reason      | string     | Reason for the dispute. One of `general`, `fraudulent`, `duplicate`, `subscription_canceled`, `product_unacceptable`, `product_not_received`, `unrecognized`, `credit_not_processed`, `incorrect_account_details`, `insufficient_funds`, `bank_cannot_process`, `debit_not_authorized`.                                               |
| charged_at | string     | ISO 8601 timestamp. |
| disputed_at | string     | ISO 8601 timestamp. |
| due_by      | string     | ISO 8601 timestamp. |
| submitted_at | string     | ISO 8601 timestamp. |
| closed_at     | string     | ISO 8601 timestamp. |
| submitted_count | integer     | Number of times the dispute evidence has been submitted. |
| file_url | string     | Location of the generated evidence document. |
| template    | string     | Id of the template attached to the dispute.                                   |
| fields      | dictionary | Evidence fields attached to the dispute.                                      |
| missing_fields | dictionary | Any fields required by the template that have not yet been provided.       |
| charge      | string     | Id of the disputed charge.                                                    |
| is_charge_refundable | boolean     | Can the charge be refunded. |
| amount      | integer    | Amount of the disputed charge. Amounts are in cents.                          |
| currency    | string     | Currency code of the disputed charge. e.g. 'USD'.                             |
| fee         | integer    | Dispute fee.                                                                  |
| external_customer | string    | Id of the Stripe customer (if any).                                      |
| customer_name | string    | Name of the Stripe customer (if any).                                        |
| customer_email | string    | Email of the Stripe customer (if any).                                        |
| customer_purchase_ip | string    | IP of purchase (if available).                                        |
| address_zip | string    | Billing address zip of the charge.                                        |
| address_line1_check | string    | State of address check (if available). One of 'pass', 'fail', 'unavailable', 'checked'.                                       |
| address_zip_check | string    | State of address zip check (if available). One of 'pass', 'fail', 'unavailable', 'checked'.                                       |
| cvc_check | string    | State of cvc check (if available). One of 'pass', 'fail', 'unavailable', 'checked'.                                       |
| statement_descriptor | string    | Statement descriptor on the charge.                                        |
| created     | string     | ISO 8601 timestamp. |
| updated     | string     | ISO 8601 timestamp. |

## Submitting a dispute

> Definition

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

> Example request:

```sh
curl -X POST https://api.chargehound.com/v1/disputes/dp_17p1SvLU6oDzEeR1fBeR07I6/submit \
  -u test_1a5e353b154642ea836ddbb6730d63cc: \
  -d template=unrecognized \
  -d fields[customer_ip]=100
```

```js
var chargehound = require('chargehound')(
  'test_1a5e353b154642ea836ddbb6730d63cc'
);

chargehound.Disputes.submit('dp_17p1SvLU6oDzEeR1fBeR07I6', {
  template: 'unrecognized',
  fields: {
    customer_ip: '100'
  }
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = "test_1a5e353b154642ea836ddbb6730d63cc"

chargehound.Disputes.submit("dp_17p1SvLU6oDzEeR1fBeR07I6",
  template="unrecognized",
  fields={
    "customer_ip": "100"
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_1a5e353b154642ea836ddbb6730d63cc'

Chargehound::Disputes.submit('dp_17p1SvLU6oDzEeR1fBeR07I6',
  template: 'unrecognized',
  fields: {
    'customer_ip' => '100'
  }
)
```

> Example response:

```json
{
  "external_customer": "cus_85B8chA2k4OSlJ",
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
  "charge": "ch_17p1SvLU6oDzEeR1VPDcd6ZR",
  "id": "dp_17p1SvLU6oDzEeR1fBeR07I6",
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
  "url": "/v1/disputes/dp_17p1SvLU6oDzEeR1fBeR07I6",
  "fields": {
    "cool": 33,
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 500
}
```

You will want to submit the dispute through Chargehound after you recieve a notification from Stripe of a new dispute. With one `POST` request you can update a dispute with the evidence fields and send the generated response to Stripe.

The dispute will be in the `submitted` state if the submit was successful. 

### Parameters:

| Parameter        | Type       | Required?  | Description                                                |
| -------------    |----------  |------------|-------------------------------------------------           |
| `template`       | string     | optional   | The id of the template to use.                             |
| `fields`         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields. |
| `customer_name`  | string     | optional   | Update the customer name. Will also update the customer name in the evidence fields. |
| `customer_email` | string     | optional   | Update the customer email. Will also update the customer email in the evidence fields. Must be a valid email address. |

### Possible errors:

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |

## Creating a dispute

Disputes are not created via the REST API. Instead, once your Stripe account is connected we will mirror disputes created in Stripe via [webhooks](https://stripe.com/docs/webhooks). You will reference the dispute with the same id that is used by Stripe.

## Retrieving a list of disputes

> Definition

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

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes \
  -u test_1a5e353b154642ea836ddbb6730d63cc:
```

```js
var chargehound = require('chargehound')(
  'test_1a5e353b154642ea836ddbb6730d63cc'
);

chargehound.Disputes.list(), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = "test_1a5e353b154642ea836ddbb6730d63cc"

chargehound.Disputes.list()
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_1a5e353b154642ea836ddbb6730d63cc'

Chargehound::Disputes.list
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
      "external_customer": "cus_85B8chA2k4OSlJ",
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
      "id": "dp_17pPChLU6oDzEeR1JfWFHZuG",
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
      "amount": 515
    },
    {
      "external_customer": "cus_85B8chA2k4OSlJ",
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
      "id": "dp_17pMauLU6oDzEeR1WvsPrfMu",
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
        "cool": 55,
        "last4": "0259",
        "charged_at": "2016-03-15T18:08:36",
        "card_brand": "Visa",
        "exp_year": 2017,
        "customer_name": "Susie Chargeback"
      },
      "file_url": null,
      "amount": 500
    }
  ]
}
```

### Parameters:

| Parameter        | Type       | Required?  | Description                                                          |
| -------------    |----------  |------------|-------------------------------------------------                     |
| `limit`          | integer    | optional   | Maximum number of disputes to return. Default is 20, maximum is 100. |
| `starting_after` | string     | optional   | A dispute id. Fetch disputes created after this dispute.             |
| `ending_before`  | string     | optional   | A dispute id. Fetch disputes created before this dispute.            |

## Retrieving a dispute

> Definition

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

> Example request:

```sh
curl https://api.chargehound.com/v1/disputes/dp_17pPChLU6oDzEeR1JfWFHZuG \
  -u test_1a5e353b154642ea836ddbb6730d63cc:
```

```js
var chargehound = require('chargehound')(
  'test_1a5e353b154642ea836ddbb6730d63cc'
);

chargehound.Disputes.retrieve('dp_17pPChLU6oDzEeR1JfWFHZuG'), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = "test_1a5e353b154642ea836ddbb6730d63cc"

chargehound.Disputes.retrieve("dp_17pPChLU6oDzEeR1JfWFHZuG")
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_1a5e353b154642ea836ddbb6730d63cc'

Chargehound::Disputes.retrieve('dp_17pPChLU6oDzEeR1JfWFHZuG')
```

> Example response:

```json
{
  "external_customer": "cus_85B8chA2k4OSlJ",
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
  "id": "dp_17pPChLU6oDzEeR1JfWFHZuG",
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
  "url": "/v1/disputes/dp_17pPChLU6oDzEeR1JfWFHZuG",
  "fields": {
    "exp_month": 12,
    "last4": "0259",
    "charged_at": "2016-03-15T20:55:46",
    "card_brand": "Visa",
    "exp_year": 2017,
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 515
}
```

## Updating a dispute

> Definition

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

> Example request:

```sh
curl -X PUT https://api.chargehound.com/v1/disputes/dp_17p1SvLU6oDzEeR1fBeR07I6/update \
  -u test_1a5e353b154642ea836ddbb6730d63cc: \
  -d template=unrecognized \
  -d fields[customer_ip]=100
```

```js
var chargehound = require('chargehound')(
  'test_1a5e353b154642ea836ddbb6730d63cc'
);

chargehound.Disputes.update('dp_17p1SvLU6oDzEeR1fBeR07I6', {
  template: 'unrecognized',
  fields: {
    customer_ip: '100'
  }
}, function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = "test_1a5e353b154642ea836ddbb6730d63cc"

chargehound.Disputes.update("dp_17p1SvLU6oDzEeR1fBeR07I6",
  template="unrecognized",
  fields={
    "customer_ip": "100"
  }
)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_1a5e353b154642ea836ddbb6730d63cc'

Chargehound::Disputes.update('dp_17p1SvLU6oDzEeR1fBeR07I6',
  template: 'unrecognized',
  fields: {
    'customer_ip' => '100'
  }
)
```

> Example response:

```json
{
  "external_customer": "cus_85B8chA2k4OSlJ",
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
  "charge": "ch_17p1SvLU6oDzEeR1VPDcd6ZR",
  "id": "dp_17p1SvLU6oDzEeR1fBeR07I6",
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
  "url": "/v1/disputes/dp_17p1SvLU6oDzEeR1fBeR07I6",
  "fields": {
    "cool": 100000,
    "customer_name": "Susie Chargeback"
  },
  "file_url": null,
  "amount": 500
}
```

You can update the template and the fields on a dispute.

### Parameters:

| Parameter        | Type       | Required?  | Description                                                |
| -------------    |----------  |------------|-------------------------------------------------           |
| `template`       | string     | optional   | The id of the template to use.                             |
| `fields`         | dictionary | optional   | Key value pairs to hydrate the template's evidence fields. |
| `customer_name`  | string     | optional   | Update the customer name. Will also update the customer name in the evidence fields. |
| `customer_email` | string     | optional   | Update the customer email. Will also update the customer email in the evidence fields. Must be a valid email address. |

### Possible errors:

| Error code           | Description                                                          |
| ---------------------|-------------------------------------------------                     |
| 400 Bad Request      | Dispute has no template, or missing fields required by the template. |
