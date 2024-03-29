# Integration Guide

This section walks through some of the technical details of completing a Chargehound integration.

## Getting started

Before you can use the Chargehound API, you will need your API keys. Your API keys can be found on the [settings page](https://www.chargehound.com/dashboard/settings/api#api-keys) in the "View API keys" section.

In order to submit a dispute you will also need to specify the template to use. Templates are referenced by an ID. You can see a list of your organization's templates and their IDs on the [templates page](https://www.chargehound.com/dashboard/templates).

## Linking data

```javascript
// Use the charge ID to look up payment data.
var charge = dispute.charge
// Order ID may help find payment data.
var order = dispute.fields['order_id']
```

```python
# Use the charge ID to look up payment data.
charge = dispute.charge
# Order ID may help find payment data.
order = dispute.fields['order_id']
```

```ruby
# Use the charge ID to look up payment data.
charge = dispute.charge
# Order ID may help find payment data.
order = dispute.fields['order_id']
```

```go
// Use the charge ID to look up payment data.
charge := dispute.charge
// Order ID may help find payment data.
order := dispute.fields["order_id"]
```

```java
// Use the charge ID to look up payment data.
String charge = dispute.charge;
// Order ID may help find payment data.
String order = dispute.fields.get("order");
```

The first step in responding to a dispute with Chargehound is linking the dispute to key data in your system. The exact details of this vary by payment processor and company. Here are the most common IDs you will use to link data: 

- **charge**: The `charge` property of a Chargehound dispute is the payment ID used by the payment processor. You can use this ID to look up payment data in your system.

- **customer**: The `customer` property of a Chargehound dispute is the customer ID used by the payment processor (if available). You can use this ID to look up customer data in your system.

- **order_id**: `order_id` may be available in the `fields` hash of a Chargehound dispute. The meaning of the `order_id` varies, in general it's an order, receipt, or payment ID. If available, you can use the `order_id` to look up payment data in your system.

## Collecting evidence

You will need to collect specific evidence in order to submit a dispute. The `fields` hash on a dispute represents this evidence. The exact fields depend on your template. To understand the data you will need to collect, go to the [templates page](https://www.chargehound.com/dashboard/templates) and click "View details" to see customized documentation for a template. 

On the template page, click the "Fields" tab to see the overall list of fields for the template. Required fields are needed to submit a response with the template. Optional fields represent additional information that is good to have, but not necessary. You should set a value for as many of the optional fields as possible, but they are not required to submit a response.

Click on the template's "Integration" tab to see an example of how to update the fields and submit the dispute using Chargehound's API. Chargehound will fill some of the evidence fields automatically, but it is unlikely that we can get all the evidence we need without your help. The "Collecting Evidence" tool helps you check what fields you will need to collect.

## Formatting fields

You will encounter a few different types of fields. To view the types of your fields, use the "Fields" tab of the template page described [above](#collecting-evidence). Currently Chargehound templates can have `text`, `date`, `number`, `amount` `url`, and `email` fields, and each type is validated differently. Here's a breakdown of what Chargehound expects for each type:

| Field  | Type   | Validation |
|--------|--------|------------|
| text | string | Multi-line strings are ok, but be sensitive to your template layout. |
| date | string or integer | Submitted responses will be reviewed by humans so try to format dates to be human readable and friendly, although no specific format is enforced. You can also provide a Unix timestamp, which will be formatted by Chargehound. |
| number | integer | A number should be an integer, not a float. |
| amount | integer | An amount should be an integer that represents the cents (or other minor currency unit) value. E.g. $1 is 100. |
| url | string | A URL should be a fully qualified URL including the scheme (`http://` or `https://`). |
| email | string | An email should be a valid email address. |

Once you have all your evidence properly formatted, use the [submit endpoint](#submitting-a-dispute) to submit a dispute. The submit endpoint adds the template and evidence fields to a dispute just like the [update endpoint](#updating-a-dispute), and it also submits the evidence to be reviewed. If you get a `400` response code or `ChargehoundBadRequestError` after a submit or update it is probably because one of the 
evidence fields is not properly formatted. When you get a `201` response code the dispute was successfully submitted and you are done.

## Metadata and custom fields

Chargehound tries to automatically collect standard information from your payment processor when a dispute is created. You can also define a list of custom fields and metadata fields that you would like to automatically collect on the processors tab of your team settings page [here](https://www.chargehound.com/dashboard/settings#metadata-settings). These fields will be automatically copied to the evidence fields of your disputes when they are created in Chargehound.

For example, if you add an "order_id" to your Stripe Charges with metadata fields, you could easily access that ID in the fields of the disputes created in Chargehound.  You could use the ID to find more relevant evidence data in your system, and/or use the ID in your templates.

### Stripe metadata

If you connected a Stripe account, Chargehound can automatically collect data from your `Charge`, `Customer`, or `Subscription` metadata fields.

### Braintree custom fields

If you connected a Braintree account, Chargehound can automaticaly collect data from your `Transaction` or `Customer` custom fields. Your Braintree custom fields should be "Store-and-pass-back" fields, and the field name given to Chargehound should be the API name.

## Workflow rules and automation

Chargehound has a number of workflow automation rules that can act on a dispute using its data. You can view those [here](https://www.chargehound.com/dashboard/settings/workflow). Instead of coding all of the logic to decide what to do with a dispute, it often makes more sense to send as much data as possible for a dispute, and then a dashboard user can manage the rules to automate the workflow. For example, instead of setting a template on each of your submit API calls, you can use the [Template Select](https://www.chargehound.com/dashboard/settings/workflow#template-select) workflow rules in the dashboard. By using the rules, you can avoid writing and maintaining code when you need to make changes to your workflow or add a new template.

## Queue settings

When you submit a dispute, you can set the `queue` flag to true so that the dispute is not submitted immediately. This gives your team time to review the evidence while being assured that every dispute will be addressed. You can configure when queued disputes will be submitted on the workflow tab of your team settings page [here](https://www.chargehound.com/dashboard/settings/workflow#queue-settings). Queued disputes will always be submitted before the due date.

## Handling webhooks

In order to automatically submit responses whenever you get a dispute, you will need to set up a webhook handler and handle the `dispute.created` [webhook notification](#webhooks).

### Testing webhooks

You can create a test mode [webhook](#webhooks) in the Chargehound dashboard on the webhooks & API tab of your team settings page [here](https://www.chargehound.com/dashboard/settings/api#webhook-urls). The webhook will only send notifications for disputes created in the Chargehound test mode. For testing locally, we recommend using a tool like [ultrahook](http://www.ultrahook.com/) to forward the webhooks to a development machine. Once you have tested, remember to configure a live mode webhook.

## Using a job queue

You do not need to immediately POST your evidence to the [submit endpoint](#submitting-a-dispute) when you receive a dispute created event. This is a good time to use a [job queue](https://en.wikipedia.org/wiki/Job_queue) if you have one. Simply pass the dispute id and (if you need it) the charge id to the job. The task worker can then query your database for the needed evidence and POST the submit to Chargehound when it's ready.

## Testing with generated disputes

It's possible to create disputes with randomly generated data in test mode. You can update and submit these disputes as normal, and you will be able to view the generated response. This is a good way to become familiar with Chargehound's API and dashboard.

You can create a dispute from the Chargehound dashboard when in test mode by clicking the "Create a Test Dispute" button: [Chargehound test dashboard](https://www.chargehound.com/test/dashboard/disputes) or simply visiting the [create dispute page](https://www.chargehound.com/test/dashboard/mock/disputes).

## Testing with Stripe

> 1) Create a token for a card with the dispute trigger code.

```sh
curl https://api.stripe.com/v1/tokens \
  -u {{your_stripe_test_key}}: \
  -d card[number]=4000000000000259 \
  -d card[exp_month]=12 \
  -d card[exp_year]=2020 \
  -d card[cvc]=123
```

```javascript
var stripe = require('stripe')(
  '{{your_stripe_test_key}}'
);

stripe.tokens.create({
  card: {
    number: '4000000000000259',
    exp_month: 12,
    exp_year: 2020,
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
    "exp_year": 2020,
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
    :exp_year => 2020,
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
        Year:   "2020",
        CVC:    "123",
    },
})
```

```java
Stripe.apiKey = "{{your_stripe_test_key}}";

Map<String, Object> tokenParams = new HashMap<String, Object>();
Map<String, Object> cardParams = new HashMap<String, Object>();
cardParams.put("number", "4000000000000259");
cardParams.put("exp_month", 12);
cardParams.put("exp_year", 2020);
cardParams.put("cvc", "123");
tokenParams.put("card", cardParams);

Token.create(tokenParams);
```

> 2) Attach that token to a Stripe customer, for easy reuse later.

```sh
curl https://api.stripe.com/v1/customers \
  -u {{your_stripe_test_key}}: \
  -d description="Always disputes charges" \
  -d source={{token_from_step_1}}
```

```javascript
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

```java
Stripe.apiKey = "{{your_stripe_test_key}}";

Map<String, Object> customerParams = new HashMap<String, Object>();
customerParams.put("description", "Always disputes charges");
customerParams.put("source", "{{token_from_step_1}}");

Customer.create(customerParams);
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

```javascript
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

```java
Stripe.apiKey = "{{your_stripe_test_key}}";

Map<String, Object> chargeParams = new HashMap<String, Object>();
chargeParams.put("amount", 400);
chargeParams.put("currency", "usd");
chargeParams.put("description", "Triggering a dispute");
chargeParams.put("source", "{{customer_from_step_2}}");

Charge.create(chargeParams);
```

> 4) Once the dispute is created in Stripe, you will see it mirrored in Chargehound.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_3}} \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.retrieve('{{dispute_from_step_3}}', function (err, res) {
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
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.RetrieveDisputeParams{
  ID: "{{dispute_from_step_3}}",
}

dispute, err := ch.Disputes.Retrieve(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.retrieve("{{dispute_from_step_3}}");
```

> 5) Using your test API key, you can then update and submit the dispute.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_3}}/submit \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.submit('{{dispute_from_step_3}}', function (err, res) {
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
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.UpdateDisputeParams{
  ID: "{{dispute_from_step_3}}",
}

_, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.submit("{{dispute_from_step_3}}");
```

Because Chargehound creates live mode disputes with [webhooks](https://stripe.com/docs/webhooks) from Stripe, testing end to end requires creating a dispute in Stripe. You can do this by creating a charge with a [test card that simulates a dispute](https://stripe.com/docs/testing#how-do-i-test-disputes). If you have a test environment, you can create a charge there to simulate a dispute end to end in your system. You can also create a charge with a [simple curl request](https://stripe.com/docs/api#create_charge), or via the [Stripe dashboard](https://support.stripe.com/questions/how-do-i-create-a-charge-via-the-dashboard).

## Testing with Braintree

> 1) Create a transaction that will trigger a dispute. You can view the resulting dispute in the [Braintree dashboard](https://sandbox.braintreegateway.com) on the disputes page.

```javascript
gateway.transaction.sale({
  amount: "10.00",
  creditCard: {
    'number': '4023898493988028',
    'expiration_date': '05/2020',
    'cvv': '222'
  },
  options: {
    submitForSettlement: true
  }
}, function (err, result) {
  if (result.success) {
    // See result.transaction for details
  } else {
    // Handle errors
  }
})
```

```python
braintree.Transaction.sale({
  'amount': '10.00',
  'credit_card': {
      'number': '4023898493988028',
      'expiration_date': '05/2020',
      'cvv': '222'
  },
  'options': {
    'submit_for_settlement': True
  }
})
```

```ruby
gateway.transaction.sale(
  :amount => '10.00',
  :credit_card => {
    :number => '4023898493988028',
    :expiration_date => '05/2020',
    :cvv => '222'
  },
  :options => {
    :submit_for_settlement => true
  }
)
```

```java
TransactionRequest request = new TransactionRequest()
  .amount(new BigDecimal("10.00"))
  .creditCard()
    .number("4023898493988028")
    .expirationDate("05/2020")
    .cvv("222")
  .options()
    .submitForSettlement(true)
    .done();

Result<Transaction> result = gateway.transaction().sale(request);
```

> 2) Once the dispute is created in Braintree, you will see it mirrored in Chargehound.

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.retrieve('{{dispute_from_step_1}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.retrieve('{{dispute_from_step_1}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.retrieve('{{dispute_from_step_1}}')
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.retrieve("{{dispute_from_step_1}}");
```

> 3) Using your test API key, you can then update and submit the dispute.

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.submit('{{dispute_from_step_1}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.submit('{{dispute_from_step_1}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.submit('{{dispute_from_step_1}}')
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.submit("{{dispute_from_step_1}}");
```

If you have a Braintree sandbox, you can test your integration using Chargehound's test mode and Braintree's sandbox environment. First, you'll need to connect your Braintree sandbox to Chargehound, just as you did for your production Braintree environment. You can connect a Braintree sandbox account from the settings page [here](https://www.chargehound.com/dashboard/settings/processors).

Because Chargehound creates live mode disputes with [webhooks](https://developers.braintreepayments.com/guides/webhooks/overview) from Braintree, testing end to end requires creating a dispute in Braintree. You can do this by creating a transaction with a [test card number that triggers a dispute](https://developers.braintreepayments.com/reference/general/testing#creating-a-disputed-test-transaction). If you have a test environment, you can create a transaction there to simulate a dispute end to end in your system. You can also create a transaction using [one of the Braintree SDKs](https://developers.braintreepayments.com/reference/request/transaction/sale), or via the [Braintree dashboard](https://articles.braintreepayments.com/control-panel/transactions/create).

## Testing with PayPal

> 1) Use the [Orders API](https://developer.paypal.com/docs/api/orders/v2/) to charge a test buyer account from the sandbox PayPal account that you connected to Chargehound.

```sh
curl https://api.sandbox.paypal.com/v2/checkout/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {{your_paypal_access_key}}" \
-d '{
  "payer": {
    "email_address": "{{your_buyer_account_email_address}}"
  },
  "intent": "CAPTURE",
  "purchase_units": [
    {
      "amount": {
        "currency_code": "USD",
        "value": "100.00"
      }
    }
  ]
}'
```

> 2) As the Paypal buyer account, approve the payment using the link returned in the response from step 1. It is the "approve" link and should look like `https://www.sandbox.paypal.com/checkoutnow?token={{token}}`.

> 3) Using your Paypal facilitator API key, capture the payment.

```sh
curl-X POST https://api.sandbox.paypal.com/v2/checkout/orders/{{order_id_from_step_1}}/capture \
-H "Content-Type: application/json" \
-H "Authorization: Bearer {{your_paypal_access_key}}"
```

> 4) As the Paypal buyer account, find the transaction in your [activity](https://www.sandbox.paypal.com/myaccount/transactions). Click "Report a problem". Click "I want to report unauthorized activity". Fill out any details, it's not important what they are. You can skip the change password step. You can view the resulting dispute in the [resolution center](https://www.sandbox.paypal.com/disputes/).

> 5) You can fetch the dispute in Chargehound using the Paypal ID. Remember, it takes on average 3-5 hours for the dispute to appear in Chargehound.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_4}} \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.retrieve('{{dispute_from_step_4}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.retrieve('{{dispute_from_step_4}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.retrieve('{{dispute_from_step_4}}')
```


```go
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.RetrieveDisputeParams{
  ID: "{{dispute_from_step_4}}",
}

dispute, err := ch.Disputes.Retrieve(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.retrieve("{{dispute_from_step_4}}");
```

> 6) Using your test API key, you can then update and submit the dispute.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_4}}/submit \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.submit('{{dispute_from_step_4}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.submit('{{dispute_from_step_4}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.submit('{{dispute_from_step_4}}')
```

```go
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.UpdateDisputeParams{
  ID: "{{dispute_from_step_4}}",
}

_, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.submit("{{dispute_from_step_4}}");
```

If you have a Paypal sandbox, you can test your integration using Chargehound's test mode and Paypal's sandbox environment. First, you'll need to connect your Paypal sandbox to Chargehound, just as you did for your production Paypal environment. You can connect a Paypal sandbox account from the settings page [here](https://www.chargehound.com/dashboard/settings/processors).

Testing end to end requires creating a dispute in Paypal. You can do this by creating a transaction from a sandbox PayPal [buyer account](https://developer.paypal.com/tools/sandbox/accounts/#create-a-personal-sandbox-account) and disputing the transaction. Be sure to follow the steps given here exactly. It is important that you choose the correct reason for filing a dispute. You want to create a Chargeback in Paypal. Some dispute reasons will create Paypal Inquiries rather than Chargebacks. 

Be prepared to wait after creating the dispute in Paypal. Unfortunately, Chargehound cannot sync Paypal disputes in real time. Transaction data is not immediately available to us in the Paypal API we use. After a dispute is created in Paypal, you will have to wait between 3-5 hours before it is available in Chargehound. When testing with Paypal's sandbox, it can take even longer.

## Testing with Checkout

> 1) Create a payment with a [dispute trigger](https://docs.checkout.com/testing/disputes-testing).

> 2) Once the dispute is created in Checkout, you will see it mirrored in Chargehound.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_1}} \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.retrieve('{{dispute_from_step_1}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.retrieve('{{dispute_from_step_1}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.retrieve('{{dispute_from_step_1}}')
```

```go
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.RetrieveDisputeParams{
  ID: "{{dispute_from_step_1}}",
}

dispute, err := ch.Disputes.Retrieve(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.retrieve("{{dispute_from_step_1}}");
```

> 3) Using your test API key, you can then update and submit the dispute.

```sh
curl https://api.chargehound.com/v1/disputes/{{dispute_from_step_1}}/submit \
  -u {{your_chargehound_test_key}}:
```

```javascript
var chargehound = require('chargehound')('{{your_chargehound_test_key}}');

chargehound.Disputes.submit('{{dispute_from_step_1}}', function (err, res) {
  // ...
});
```

```python
import chargehound
chargehound.api_key = '{{your_chargehound_test_key}}'

chargehound.Disputes.submit('{{dispute_from_step_1}}')
```

```ruby
require 'chargehound'
Chargehound.api_key = '{{your_chargehound_test_key}}'

Chargehound::Disputes.submit('{{dispute_from_step_1}}')
```

```go
ch := chargehound.New("{{your_chargehound_test_key}}", nil)

params := chargehound.UpdateDisputeParams{
  ID: "{{dispute_from_step_1}}",
}

_, err := ch.Disputes.Submit(&params)
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("{{your_chargehound_test_key}}");

chargehound.disputes.submit("{{dispute_from_step_1}}");
```

Because Chargehound creates live mode disputes with [webhooks](https://docs.checkout.com/reporting-and-insights/webhooks) from Checkout, testing end to end requires creating a dispute in Checkout. You can do this by creating a charge with a [test card that simulates a dispute](https://docs.checkout.com/testing/disputes-testing). If you have a test environment, you can create a charge there to simulate a dispute end to end in your system. You can also create a charge with the Checkout API or from the Checkout dashboard.

## Responding to your backlog

Before integrating with Chargehound you might have accrued a dispute backlog, but you can easily respond to all of those disputes by writing a simple script and running it as the final integration step.

```sh
curl https://api.chargehound.com/v1/disputes?state=warning_needs_response&state=needs_response \
  -u test_123
```

```javascript
var chargehound = require('chargehound')(
  'test_123'
);

async function respondToBacklog (startingAfterId=null) {
  var params = {
    state: ['warning_needs_response', 'needs_response']
  };

  // Use the dispute ID to page.
  if (startingAfterId) {
    params['starting_after'] = startingAfterId;
  }

  var res = await chargehound.Disputes.list(params);

  await Promise.all(res.data.map(async function (dispute) {
    // Submit the dispute.
  });

  if (res.has_more) {
    // Recurse to address all of the open disputes.
    var startingAfterId = res.data[res.data.length - 1].id;
    await respondToBacklog(startingAfterId);
  }
}
```

```python
import chargehound
chargehound.api_key = 'test_123'

def respond_to_backlog(starting_after_id=None):
  params = {
    'state': ['warning_needs_response', 'needs_response']
  }

  # Use the dispute ID to page.
  if starting_after_id:
    params['starting_after'] = starting_after_id

  res = chargehound.Disputes.list(**params)

  for dispute in res['data']:
    # Submit the dispute.

  if res['has_more']:
    # Recurse to address all of the open disputes.
    starting_after_id = res['data'][-1]['id']
    respond_to_backlog(starting_after_id)
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'

def respond_to_backlog(starting_after_id)
  params = {
    state: %w[needs_response warning_needs_response]
  }

  # Use the dispute ID to page.
  if starting_after_id
    params['starting_after'] = starting_after_id
  end

  res = Chargehound::Disputes.list(params)
  res['data'].each { |dispute|
    # Submit the dispute.
  }

  if res['has_more']
    # Recurse to address all of the open disputes.
    starting_after_id = res['data'][-1]['id']
    respond_to_backlog(starting_after_id)
  end
end
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123", nil)

func respondToBacklog (startingAfterId string) {
  params := chargehound.ListDisputesParams{
    State: []string{"warning_needs_response", "needs_response"},
    StartingAfter: startingAfterId
  }

  response, err := ch.Disputes.List(&params)

  for _, dispute := range response.Data {
    // Submit the dispute.
  }

  if response.HasMore == true {
    // Recurse to address all of the open disputes.
    nextStartingAfterId := response.Data[len(response.Data)-1].ID
    respondToBacklog(nextStartingAfterId)
  }
}
```

```java
import com.chargehound.Chargehound;
import com.chargehound.models.DisputesList;
import com.chargehound.models.Dispute;

Chargehound chargehound = new Chargehound("test_123");

public void respondToBacklog(String startingAfterId) {
  DisputesList.Params.Builder paramsBuilder = new DisputesList.Params.Builder()
    .state("warning_needs_response", "needs_response");

  // Use the dispute ID to page.
  if (startingAfterId != null) {
    paramsBuilder = paramsBuilder.startingAfter(startingAfterId);
  }

  DisputesList.Params params = paramsBuilder.finish();

  DisputesList result = chargehound.Disputes.list(params);

  for (int i = 0; i < result.data.length; i++) {
    Dispute dispute = result.data[i]
    // Submit the dispute.
  }

  if (result.hasMore) {
    // Recurse to address all of the open disputes.
    String nextStartingAfterId = result.data[result.data.length - 1].id;
    respondToBacklog(nextStartingAfterId)
  }
}
```
