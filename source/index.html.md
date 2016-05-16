---
title: Chargehound API Reference

language_tabs:
  - shell: cURL
  - javascript: Node
  - python: Python
  - ruby: Ruby

includes:
  - disputes

search: false
---

# Overview

Chargehound's API is organized around REST. [JSON](http://www.json.org/) is returned by all API responses, including errors, although our [API libraries](#libraries) convert responses to appropriate language-specific objects. All API URLs listed in this documentation are relative to `https://api.chargehound.com/v1/`. For example, the `/disputes/` resource is located at `https://api.chargehound.com/v1/disputes`.

All requests must be made over [HTTPS](https://en.wikipedia.org/wiki/HTTPS).

## Authentication

```sh
curl -u test_123:
```

```js
var chargehound = require('chargehound')(
  'test_123'
);
```

```python
import chargehound
chargehound.api_key = 'test_123'
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'
```

> Make sure to replace `test_123` with your API key.

Authentication to the API is performed via [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication). Your API key serves as your username. You do not need to provide a password, so the full authorization string should have the form `{{key}}:`.

If you are setting authentication in the HTTP Headers with the form `Authorization: Basic {{credentials}}` be sure to [base 64](https://en.wikipedia.org/wiki/Base64) encode the credentials so that, for example, `test_123:` becomes `dGVzdF8xMjM6`.

You have two API keys, one for test and one for live data.

## Errors

```json
{
  "url": "/v1/disputes/puppy/submit",
  "livemode": false,
  "error": {
    "status": 404,
    "message": "A dispute with id 'puppy' was not found"
  }
}
```

Chargehound uses conventional HTTP response codes to indicate success or failure of an API request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that resulted from the provided information (e.g. a required parameter was missing, a payment failed, etc.), and codes in the 5xx range indicate an error with our servers. 

### HTTP Status Code Summary

| Status | Description |
|--------|--------|
| 200 - OK | Everything worked as expected. |
| 201 - Created | The resource was successfully created. |
| 400 - Bad Request | The request data was invalid or incomplete. |
| 401 - Unauthorized | No valid API key provided. |
| 403 - Forbidden | Error with your API key or insecure connection. |
| 404 - Not Found | Resource could note be found. |
| 500 - Server Error | Something went wrong on Chargehound's end. |

### Handling errors

```js
var Chargehound = require('chargehound')('test_123')

// Use the Chargehound library to make a request
.then(function () {
  // handle success
})
.catch(function (err) {
  if (err instanceof Chargehound.error.ChargehoundBadRequestError) {
    // Invalid parameters were supplied in the request

    console.log('Status is: ' + err.status)
    console.log('Message is: ' + err.message)

  } else if (err instanceof Chargehound.error.ChargehoundAuthenticationError) {
    // Incorrect or missing API key
  } else if (err instanceof Chargehound.error.ChargehoundError) {
    // Generic Chargehound error (404, 500, etc.)
  } else {
    // Handle any other types of unexpected errors
  }
})
```

```python
from chargehound.error import (
  ChargehoundError, ChargehoundBadRequestError, 
  ChargehoundAuthenticationError
)

try:
  # Use the Chargehound library to make a request
except ChargehoundBadRequestError, e:
  # Invalid parameters were supplied in the request

  print 'Status is: %s' % e.status
  print 'Message is: %s' % e.message

  pass
except ChargehoundAuthenticationError, e:
  # Incorrect or missing API key
  pass
except ChargehoundError, e:
  # Generic Chargehound error (404, 500, etc.)
  pass
except Exception, e:
  # Handle any other types of unexpected errors
  pass
```

```ruby
require 'chargehound/error'

begin
  # Use the Chargehound library to make a request
rescue Chargehound::ChargehoundBadRequestError => e
  # Invalid parameters were supplied in the request

  puts 'Status is: #{e.status}'
  puts 'Message is: #{e.message}'

rescue Chargehound::ChargehoundAuthenticationError => e
  # Incorrect or missing API key
rescue Chargehound::ChargehoundError => e
  # Generic Chargehound error (404, 500, etc.)
rescue => e
  # Handle any other types of unexpected errors
end
```

When using our client libraries Chargehound also provides typed exceptions when errors are returned from the API.


## Testing

> 1) Create a token for a card with the dispute trigger code.

```sh
curl https://api.stripe.com/v1/tokens \
  -u {{your_stripe_test_key}}: \
  -d card[number]=4000000000000259 \
  -d card[exp_month]=12 \
  -d card[exp_year]=2017 \
  -d card[cvc]=123
```

```js
var stripe = require('stripe')(
  '{{your_stripe_test_key}}'
);

stripe.tokens.create({
  card: {
    number: '4000000000000259',
    exp_month: 12,
    exp_year: 2017,
    cvc: '123'
  }
}, function (err, token) {
  // ...
});
```

```python
import stripe
stripe.api_key = '{{your_stripe_test_key}}'

stripe.Token.create(
  card={
    "number": "4000000000000259",
    "exp_month": 12,
    "exp_year": 2017,
    "cvc": "123"
  },
)
```

```ruby
require 'stripe'
Stripe.api_key = '{{your_stripe_test_key}}'

Stripe::Token.create(
  :card => {
    :number => '4000000000000259',
    :exp_month => 4,
    :exp_year => 2017,
    :cvc => '314'
  },
)
```

> 2) Attach that token to a Stripe customer, for easy reuse later.

```sh
curl https://api.stripe.com/v1/customers \
  -u {{your_stripe_test_key}}: \
  -d description="Always disputes charges" \
  -d source={{token_from_step_1}}
```

```js
var stripe = require('stripe')(
  '{{your_stripe_test_key}}'
);

stripe.customers.create({
  description: 'Always disputes charges',
  source: '{{token_from_step_1}}'
}, function (err, customer) {
  // ...
});
```

```python
import stripe
stripe.api_key = '{{your_stripe_test_key}}'

stripe.Customer.create(
  description="Always disputes charges",
  source="{{token_from_step_1}}"
)
```

```ruby
require 'stripe'
Stripe.api_key = '{{your_stripe_test_key}}'

Stripe::Customer.create(
  :description => 'Always disputes charges',
  :source => '{{token_from_step_1}}'
)
```

> 3) Create a charge that will trigger a dispute. You can view the resulting dispute in the [Stripe dashboard](https://dashboard.stripe.com/test/disputes/overview).

```sh
curl https://api.stripe.com/v1/charges \
  -u {{your_stripe_test_key}}: \
  -d amount=701 \
  -d currency=usd \
  -d customer={{customer_from_step_2}} \
  -d description="Triggering a dispute"
```

```js
var stripe = require('stripe')(
  '{{your_stripe_test_key}}'
);

stripe.charges.create({
  amount: 400,
  currency: 'usd',
  source: '{{customer_from_step_2}}', // obtained with Stripe.js
  description: 'Charge for test@example.com'
}, function (err, charge) {
  // ...
});
```

```python
import stripe
stripe.api_key = '{{your_stripe_test_key}}'

stripe.Charge.create(
  amount=400,
  currency="usd",
  customer="{{customer_from_step_2}}",
  description="Triggering a dispute"
)
```

```ruby
require 'stripe'
Stripe.api_key = '{{your_stripe_test_key}}'

Stripe::Charge.create(
  :amount => 701,
  :currency => 'usd',
  :customer => '{{customer_from_step_2}}',
  :description => 'Triggering a dispute'
)
```

> 4) Once the dispute is created in Stripe, you will see it mirrored in Chargehound.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_3}} \
  -u {{your_chargehound_test_key}}:
```

```js
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.retrieve('{{dispute_from_step_3}}'), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.retrieve('{{dispute_from_step_3}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.retrieve('{{dispute_from_step_3}}')
```

> 5) Using your test API key, you can then update and submit the dispute.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_3}}/submit \
  -u {{your_chargehound_test_key}}:
```

```js
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.submit('{{dispute_from_step_3}}'), function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.submit('{{dispute_from_step_3}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.submit('{{dispute_from_step_3}}')
```

Because Chargehound creates disputes with [webhooks](https://stripe.com/docs/webhooks) from Stripe, testing a dispute requires creating a dispute in Stripe. You can do this by creating a charge with a [test card that simulates a dispute](https://stripe.com/docs/testing#how-do-i-test-disputes). You can create a charge with a [simple curl request](https://stripe.com/docs/api#create_charge), or via the [Stripe dashboard](https://support.stripe.com/questions/how-do-i-create-a-charge-via-the-dashboard).

## Libraries

Chargehound offers wrapper libraries in the following languages:

- [Node.js](https://github.com/chargehound/chargehound-node)
- [Python](https://github.com/chargehound/chargehound-python)
- [Ruby](https://github.com/chargehound/chargehound-ruby)

## HTTP

> When sending a body along with `Content-Type: application/json`, the Chargehound API expects [JSON](http://www.json.org/).

```
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -H "Content-Type: application/json" \
  -d "{\"fields\": { \"product_url\":  \"http://www.example.com/products/cool\" } }"
```

> When sending a body along with `Content-Type: application/x-www-form-urlencoded`, the Chargehound API expects [form data](https://en.wikipedia.org/wiki/Percent-encoding#The_application.2Fx-www-form-urlencoded_type). This Content Type is set automatically by curl. Dictionaries can be expressed with square brackets.

```
curl -X PUT https://api.chargehound.com/v1/disputes/dp_123 \
  -u test_123: \
  -d fields[product_url]=http://www.example.com/products/cool
```

If you are making HTTP requests directly, be sure to set the `Content-Type` header in PUT/POST requests to specify the format of the body. The Chargehound API supports JSON and URL encoding. 
