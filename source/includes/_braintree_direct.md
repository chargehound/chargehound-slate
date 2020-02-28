# Braintree Direct

In typical integrations with Chargehound you supply evidence and respond to disputes using the Chargehound API; however, in some cases supporting another third party integration may not be possible or desired.

With a Braintree Direct integration you supply evidence and respond to disputes with Chargehound, but you do so using the Braintree API.

There are 3 simple steps to a Braintree Direct integration:

1) When a dispute is created in Braintree, you'll handle Braintree's "Dispute Opened" webhook notification.

2) You'll collect the evidence needed by your Chargehound template(s).

3) You'll send the evidence fields to the Braintree API. You'll do this by updating the custom fields of the disputed transaction in Braintree. Chargehound will take it from there.

## Setting up webhooks

You'll need to handle Braintree's ["Dispute Opened" webhook notification](https://developers.braintreepayments.com/reference/general/webhooks/dispute). You can configure your Braintree webhooks in your Braintree dashboard. If you haven't defined any webhooks yet, follow the instructions for how to create a webhook [here](https://developers.braintreepayments.com/guides/webhooks/create).

## Setting up custom fields

You'll need to define the evidence fields used in your template(s) as [Braintree custom fields](https://articles.braintreepayments.com/control-panel/custom-fields). Follow the instructions for how to create custom fields [here](https://articles.braintreepayments.com/control-panel/custom-fields#creating-a-custom-field). The custom fields will need to be "Store and Pass Back" fields.

In addition to your template evidence fields, you'll need to define a few custom fields that will be used to take actions in Chargehound.

`chargehound_template`
This field can be used to set the template used by Chargehound. Set this field to a template ID.

`chargehound_submit`
Setting this field to `"true"` will tell Chargehound to submit the dispute.

`chargehound_queue`
Setting this field to `"true"` will tell Chargehound to queue the dispute for later submission. (See [Queuing for submission](#queuing-for-submission) for details.)

`chargehound_force`
Setting this field to `"true"` will tell Chargehound to override any manual review rules. (See [Manual review](#manual-review) for details.)

`chargehound_version`
This field can be used to override the Chargehound API version. (See [Versioning](#versioning) for details.)

## Updating custom fields

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
    "transactionId": "ch_123",
    "clientMutationId": "TEST EXAMPLE",
    "customFields": [
      {
        "name": "chargehound_template",
        "value": "unrecognized"
      },
      {
        "name": "chargehound_submit",
        "value": "true"
      },
      {
        "name": "customer_name",
        "value": "Susie Chargeback"
      }
    ]
  }
}
```

After you handle the "Dispute Opened" webhook notification, you'll gather the response evidence and update the Braintree custom fields. You'll use [Braintree's GraphQL API](https://graphql.braintreepayments.com/) to update the custom fields of the disputed transaction. If you encounter an error like "Custom field is invalid" you may need to create the custom field, follow the instructions for setting up custom fields [here](#setting-up-custom-fields).

Braintree custom fields only support strings, but Chargehound will convert amounts or numbers from strings when needed. See the guidelines for formatting fields [here](#formatting-fields).

## Verifying and debugging

While with a Braintree Direct integration you only interact with the Braintree API, you'll still want to check on the disputes in Chargehound to ensure that the evidence fields you are sending are correct and that the response is submitted. 

You can easily find the dispute in Chargehound using the same ID used by Braintree. By clicking "View Logs" on the dispute page you will be able to see the updates made to the dispute by the Braintree Direct integration, this can help you spot and debug any issues.
