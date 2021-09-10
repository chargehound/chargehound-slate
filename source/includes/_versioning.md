# Versioning

The Chargehound API uses versioning to roll out backwards-incompatible changes over time.

## About Versioning

The API version will control the API and webhook behaviors, such as parameters accepted in requests, and response properties. Your account was automatically set to the latest version when you signed up.

A new version of the API is released when backwards-incompatible changes are made to the API. To avoid breaking your code, we will never force you to upgrade until you’re ready.

We will be releasing backwards-compatible changes without introducing new versions. Your code will be able to handle these changes no matter what version it's on.

Examples of backwards-incompatible changes:

- Removing response attributes from an existing resource
- Removing request parameters from an existing resource

Examples of backwards-compatible changes:

- Adding new API endpoints
- Adding new optional response attributes to an existing resource
- Adding new optional request attributes

## Upgrading API Version

We recommend staying up-to-date with the current API version to take advantage of latest improvements to the Chargehound API.

To see your current version and upgrade to the latest, visit the API Version section of the API tab on the Chargehound dashboard [here](/dashboard/settings/api).

All requests to the API will use your organization API settings, unless you override the API version. Versioning of the Chargehound API will be released as dates, displayed as: `YYYY-MM-DD`

The API version used by your webhooks can be configured individually for each webhook URL you have configured in the Webhook URLs section of the API tab on the Chargehound dashboard [here](/dashboard/settings/api).

## Testing API Version

To set the API version on a specific request, send a `Chargehound-Version` header. The API version will be set to the version that you specify for that individual request.

```sh
curl -X POST https://api.chargehound.com/v1/disputes \
  -u test_123: \
  -H "Chargehound-Version: YYYY-MM-DD"
```

```javascript
var chargehound = require('chargehound')('test_123', {
  version: 'YYYY-MM-DD'
});
```

```python
import chargehound
chargehound.api_key = 'test_123'
chargehound.version = 'YYYY-MM-DD'
```

```ruby
require 'chargehound'
Chargehound.api_key = 'test_123'
Chargehound.version = 'YYYY-MM-DD'
```

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123",
  &chargehound.ClientParams{APIVersion: "YYYY-MM-DD"})
```

```java
import com.chargehound.Chargehound;
Chargehound chargehound = new Chargehound("test_123");
chargehound.setApiVersion("YYYY-MM-DD");
```

## Changelog

### Version 2021-09-15

In this API version, we changed the behavior of the webhook `dispute.closed` event.

In older versions, a `dispute.closed` notification would only be sent if Chargehound submitted the dispute. Starting with this version, the `dispute.closed` notification will be sent for all closed, whether Chargehound submitted evidence or not.

### Version 2020-02-28

In this API version, we changed the behavior of the accept filters and the `accepted` state.

In older versions, workflow rules for accepting disputes were only applied to new disputes, and disputes 
 in the `accepted` state could be submitted normally by API requests. Accepted disputes were 
 intended to help with dashboard organization and did not affect API integrations.

Starting with this version, workflow rules for accepting disputes are also applied when disputes are
 updated or submitted via API, and disputes in the `accepted` state cannot be submitted by API requests
 without the `force` parameter. Accepted disputes are intended to complement manual review filters.

### Version 2017-10-30

In this API version, we’ve cleaned up some attribute names in order to make them more consistent and intuitive.

- [Dispute response webhook](#dispute-response-ready): The `dispute_id` attribute was removed in favor of `dispute`. The `external_charge` attribute was removed in favor of `charge`. The `user_id` attribute was removed in favor of `account_id`.

- [Dispute response endpoint](#retrieving-a-dispute-response): The `dispute_id` attribute was removed in favor of `dispute`. The `external_charge` attribute was removed in favor of `charge`. The `user_id` attribute was removed in favor of `account_id`.

- [Dispute create endpoint](#creating-a-dispute): The `external_identifier` attribute was removed in favor of `id`. The `external_charge` attribute was removed in favor of `charge`. The `external_customer` attribute was removed in favor of `customer`. The `user_id` parameter was removed in favor of `account_id`.

- [Dispute submit endpoint](#submitting-a-dispute) and [dispute update endpoint](#updating-a-dispute): The `customer_name` parameter was removed, set the `customer_name` in the fields object instead. The `customer_email` parameter was removed, set the `customer_email` in the fields object instead. The `user_id` parameter was removed in favor of `account_id`.

## Documentation

Documentation is available for all releases:

* [2021-09-15 (Latest)](../2021-09-15/)
* [2020-02-28](../2020-02-28/)
* [2017-10-30](../2017-10-30/)
* [2016-03-05](../2016-03-05/)
