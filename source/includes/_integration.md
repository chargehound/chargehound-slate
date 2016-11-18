# Integration Guide

This section walks through some of the technical details of completing a Chargehound integration.

## Getting started

Before you can use the Chargehound API, you will need your API keys. Your API keys can be found on the [team settings page](https://www.chargehound.com/team) in the "View API keys" section.

In order to submit a dispute you will also need to specify the template to use. Templates are referenced by an ID. You can see a list of your organization's templates and their IDs on the [templates page](https://www.chargehound.com/templates).

## Collecting evidence

Depending on the template that you want to use, you will need to collect specific evidence in order to submit a dispute. The `fields` hash on a dispute represents this evidence. Chargehound will fill some of the evidence fields automatically, but it is unlikely that we can get all the evidence we need without your help. Using the API you can identify the missing fields that represent the evidence you will need to collect yourself.

When your organization first connected to your payment processor, Chargehound likely imported your current queue of disputes needing response. In order to figure out what evidence you need to collect we will need to look at one of these real disputes, but don't worry, we aren't going to submit the dispute yet. List your disputes using the [list endpoint](#retrieving-a-list-of-disputes), and choose one.

Once you have chosen a dispute, choose the template that you want to use and copy its ID. Next, attach the template to the dispute using the [update endpoint](#updating-a-dispute). In the response body look for the `missing_fields` hash. The `missing_fields` hash shows which fields are still needed in order to submit the dispute with the chosen template. Now you can figure out how to collected the needed evidence.

If you don't have a real dispute for reference, go to the [templates page](https://www.chargehound.com/templates) and view the customized documentation for a template.

## Formatting fields

When submitting evidence you will encounter a few different types of fields in the `missing_fields` hash. Currently Chargehound templates can have `text`, `date`, `number`, `amount` `url`, and `email` fields, and each type is validated differently. Here's a breakdown of what Chargehound expects for each type:

| Field  | Type   | Validation |
|--------|--------|------------|
| text | string | Multi-line strings are ok, but be sensitive to your template layout. |
| date | string | Submitted responses will be reviewed by humans so try to format dates to be human readable and friendly, although no specific format is enforced. This is not the place for Unix timestamps. |
| number | integer | A number should be an integer, not a float. |
| amount | integer | An amount should be an integer that represents the cents (or other minor currency unit) value. E.g. $1 is 100. |
| url | string | A url hould be a fully qualified url including the scheme (`http:// ` or `https://`). |
| email | string | An email should be a valid email address. |

Once you have all your evidence properly formatted, use the [submit endpoint](#submitting-a-dispute) to submit a dispute. The submit endpoint adds the template and evidence fields to a dispute just like the [update endpoint](#updating-a-dispute), and it also submits the evidence to be reviewed. If you get a `400` response code or `ChargehoundBadRequestError` after a submit or update it is probably because one of the evidence fields is not properly formatted. When you get a `201` response code the dispute was successfully submitted and you are done.

## Setting up webhooks

In order to automatically submit responses whenever you get a dispute, you will need to set up a webhook handler and handle your payment processor's dispute created webhook.

### Setting up Stripe webhooks

It's best to refer to Stripe's [own documentation regarding webhooks](https://stripe.com/docs/webhooks), but here's a quick checklist of what you need to do:

- Configure your Stripe [webhook settings](https://dashboard.stripe.com/account/webhooks) to send webhooks to your server.
- Stripe can send you all events, or a set of events of your choosing. Ensure that you are subscribed to the `charge.dispute.created` event.
- For security, ensure that you are confirming the event data with Stripe before acting upon it. When you receive an event from Stripe, parse the event id and use Stripe's [retrieve event](https://stripe.com/docs/api#retrieve_event) endpoint to fetch the event. Then, act on the fetched data. This ensures that the event was authentic.

### Setting up Braintree webhooks

It's best to refer to Braintree's [own documentation regarding webhooks](https://developers.braintreepayments.com/guides/webhooks/overview), but here's a quick checklist of what you need to do:

- Go to your Braintree webhook settings in the settings menu.
- Create a webhook and select the Dispute Opened event.

## Using a job queue

You do not need to immediately POST your evidence to the [submit endpoint](#submitting-a-dispute) when you receive a dispute created event. This is a good time to use a [job queue](https://en.wikipedia.org/wiki/Job_queue) if you have one. Simply pass the dispute id and (if you need it) the charge id to the job. The task worker can then query your database for the needed evidence and POST the submit to Chargehound when it's ready.

## Testing

### Generating disputes

It's possible to create disputes with randomly generated data in test mode. You can update and submit these disputes as normal, and you will be able to view the generated response. This is a good way to become familiar with Chargehound's API and dashboard.

You can create a dispute from the Chargehound dashboard when in test mode by clicking the "Create a Test Dispute" button: [Chargehound test dashboard](https://www.chargehound.com/test/dashboard/disputes).

### End to end with Stripe

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

```go
stripe.Key = "{{your_stripe_test_key}}"

t, err := token.New(&stripe.TokenParams{
  Card: &stripe.CardParams{
        Number: "4000000000000259",
        Month:  "12",
        Year:   "2017",
        CVC:    "123",
    },
})
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

```go
stripe.Key = "{{your_stripe_test_key}}"

customerParams := &stripe.CustomerParams{
  Desc: "Always disputes charges",
}
customerParams.SetSource("{{token_from_step_1}}")
c, err := customer.New(customerParams)
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

```go
stripe.Key = "{{your_stripe_test_key}}"

chargeParams := &stripe.ChargeParams{
  Amount: 400,
  Currency: "usd",
  Desc: "Triggering a dispute",
}
chargeParams.SetSource("{{customer_from_step_2}}")
ch, err := charge.New(chargeParams)
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

```go
ch := chargehound.New("{{your_chargehound_test_key}}") 

params := chargehound.RetrieveDisputeParams{
  ID: "{{dispute_from_step_3}}",
}

dispute, err := ch.Disputes.Retrieve(&params)
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

```go
ch := chargehound.New("{{your_chargehound_test_key}}") 

params := chargehound.UpdateDisputeParams{
  ID: "{{dispute_from_step_3}}",
}

_, err := ch.Disputes.Submit(&params)
```

Because Chargehound creates live mode disputes with [webhooks](https://stripe.com/docs/webhooks) from Stripe, testing end to end requires creating a dispute in Stripe. You can do this by creating a charge with a [test card that simulates a dispute](https://stripe.com/docs/testing#how-do-i-test-disputes). You can create a charge with a [simple curl request](https://stripe.com/docs/api#create_charge), or via the [Stripe dashboard](https://support.stripe.com/questions/how-do-i-create-a-charge-via-the-dashboard).

### End to end with Braintree

Braintree does not support disputes in the Braintree Sandbox at this time.
