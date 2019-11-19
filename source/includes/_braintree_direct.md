# Braintree Direct

In typical integrations with Chargehound you supply evidence and respond to disputes using the Chargehound API; however, in some cases supporting another third party integration may not be possible or desired.

With a Braintree Direct integration you supply evidence and respond to disputes with Chargehound, but you do so using the Braintree API.

## Overview

A Braintree Direct integration follows the same general pattern as a typical Chargehound API integration.

1) When a dispute is created in Braintree, you'll handle Braintree's "Dispute Opened" webhook notification.

2) You'll collect the evidence needed by your Chargehound template(s).

3) You'll send the evidence fields to the Braintree API. You'll do this by updating the custom fields of the disputed transaction in Braintree. Chargehound will take it from there.

## Setting up webhooks

You'll need to handle Braintree's ["Dispute Opened" webhook notification](https://developers.braintreepayments.com/reference/general/webhooks/dispute). You can configure your Braintree webhooks in your Braintree dashboard.

## Setting up custom fields

You'll need to define the evidence fields used in your template as [Braintree custom fields](https://articles.braintreepayments.com/control-panel/custom-fields). These custom fields will need to be "Store and Pass Back" fields. In addition to your template evidence fields, you'll need to define a few custom fields that will be used to take actions in Chargehound.

`chargehound_template`
This field can be used to set the template used by Chargehound. Set this field to a template ID.

`chargehound_submit`
Setting this field to `"true"` will tell Chargehound to submit the dispute.

`chargehound_queue`
Setting this field to `"true"` will tell Chargehound to queue the dispute for later submission. (See [Queuing for submission](#queuing-for-submission) for details.)

`chargehound_force`
Setting this field to `"true"` will tell Chargehound to override any manual review rules. (See [Manual review](#manual-review) for details.)

## Updating custom fields

After you handle the "Dispute Opened" webhook notification, you'll gather the response evidence and update the Braintree custom fields. You'll use [Braintree's GraphQL API](https://graphql.braintreepayments.com/) to update the custom fields of the disputed transaction.

```graphql
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

```graphql
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

## Verifying and Debugging

While with a Braintree Direct integration you interact only with the Braintree API, you'll still want to check on the disputes in Chargehound to ensure that the evidence fields you are sending are correct and that the response is submitted. 

You can easily find the dispute in Chargehound using the same ID used by Braintree. By clicking "View Logs" on the dispute page you will be able to see the updates made to the dispute by the Braintree Direct integration, this can help you spot and debug any issues.
