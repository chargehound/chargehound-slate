# Braintree Direct

In typical integrations with Chargehound you supply evidence and respond to disputes using the Chargehound API; however, in some cases supporting another third party integration may not be possible or desired.

With a Braintree Direct integration you supply evidence and respond to disputes with Chargehound, but you do so using the Braintree API.

## Overview

A Braintree Direct Integration follows the same general pattern as a typical Chargehound API integration.

1) When a dispute is created in Braintree, you'll handle Braintree's "Dispute Opened" webhook notification.

2) You'll collect the evidence needed by your Chargehound template.

3) You'll send the evidence fields to the Braintree API. You'll do this by updating the Custom Fields of the disputed transaction in Braintree. Chargehound will take it from there.

## Setting up webhooks

You'll need to handle Braintree's ["Dispute Opened" webhook notification](https://developers.braintreepayments.com/reference/general/webhooks/dispute). You can configure your Braintree webhooks in your Braintree dashboard.

## Setting up Braintree Custom Fields

You'll need to define the evidence fields used in your template as [Braintree Custom Fields](https://articles.braintreepayments.com/control-panel/custom-fields). These Custom Fields will need to be "Store and Pass Back" fields. In addition to your template evidence fields, you'll need to define a few Custom Fields that will be used to take actions in Chargehound.

`chargehound_template`
This field can be used to set the template used by Chargehound. Set this field to the template ID.

`chargehound_submit`
Setting this field to "true" will tell Chargehound to submit the dispute.

`chargehound_queue`
Setting this field to "true" will tell Chargehound to queue the dispute for later submission. (See [Queuing for submission](#queuing-for-submission) for details.)

`chargehound_force`
Setting this field to "true" will tell Chargehound to override any manual review rules. (See [Manual review](#manual-review) for details.)

## Updating Braintree Custom Fields

After you handle the "Dispute Opened" webhook notification, you'll gather the response evidence and update the Braintree Custom Fields. You'll use GraphQL to update the Custom Fields of the disputed transaction in Braintree.

```
mutation UpdateTransactionCustomFields($input: UpdateTransactionCustomFieldsInput!) {
     updateTransactionCustomFields(input: $input) {
    clientMutationId,
    customFields {
        name
        value
      }
  }
}
```

```
{
  "input": {
    "transactionId": "{disputed_transaction_id}",
    "clientMutationId": "TEST EXAMPLE",
    "customFields": [
      {
        "name": "{example_field}",
        "value": "{example_value}"
      }
    ]
  }
}
```
