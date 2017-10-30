# Versioning

The Chargehound API uses versioning to roll out backwards-incompatible changes over time.

## About Versioning

The API version will control the API and webhook behaviors, such as parameters accepted in requests, and response properties. Your account is automatically set to the latest version when you make your first request to the API.

A new version of the API is released when backwards-incompatible changes are made to the API. To avoid breaking your code, we will never force you to upgrade until you’re ready.

We will be releasing backwards-compatible changes without introducing new versions. Your code will be able to handle these changes no matter what version it's on.

Examples of backwards-incompatible changes:

- Removing response attributes from an existing resource
- Removing request parameters from an existing resource

Examples of backwards-compatible changes:

- Adding new API endpoints
- Adding new optional response attributes to an existing resource
- Adding new optional request attributes

## Upgrade your API Version

We recommend staying up-to-date with the current API version to take advantage of latest improvements to the Chargehound API.

To see your current version and upgrade to the latest, visit the API tab on the Chargehound dashboard [here](/dashboard/settings/api).

All requests will use your organization API settings, unless you override the API version. Versioning of the Chargehound API will be released as dates, displayed as: `YYYY-MM-DD`

To set the API version on a specific request, send a `Chargehound-Version` header.

## Changelog

### Version 2017-10-30

In this API version, we’ve cleaned up some attribute names in order to make them more consistent and intuitive.

- [Dispute response webhook](#dispute-response-ready): The `dispute_id` attribute was removed in favor of `dispute`. The `external_charge` attribute was removed in favor of `charge`. The `user_id` attribute was removed in favor of `account_id`.

- [Dispute response endpoint](#retrieving-a-dispute-response): The `dispute_id` attribute was removed in favor of `dispute`. The `external_charge` attribute was removed in favor of `charge`. The `user_id` attribute was removed in favor of `account_id`.

- [Dispute create endpoint](#creating-a-dispute): The `external_identifier` attribute was removed in favor of `id`. The `external_charge` attribute was removed in favor of `charge`. The `external_customer` attribute was removed in favor of `customer`. The `user_id` parameter was removed in favor of `account_id`.

- [Dispute submit endpoint](#submitting-a-dispute) and [dispute update endpoint](#updating-a-dispute): The `customer_name` parameter was removed, set the `customer_name` in the fields object instead. The `customer_email` parameter was removed, set the `customer_email` in the fields object instead. The `user_id` parameter was removed in favor of `account_id`.

## Documentation

Documentation is available for all previous releases:

* [Latest](../current/)
* [2016-03-05](../2016-03-05/)
