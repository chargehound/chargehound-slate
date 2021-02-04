# Overview

Chargehound's API is organized around REST. [JSON](http://www.json.org/) is returned by all API responses, including errors, although our [API libraries](#libraries) convert responses to appropriate language-specific objects. All API URLs listed in this documentation are relative to `https://api.chargehound.com/v1/`. For example, the `/disputes/` resource is located at `https://api.chargehound.com/v1/disputes`.

All requests must be made over [HTTPS](https://en.wikipedia.org/wiki/HTTPS).

## Authentication

```sh
curl -u test_123:
```

```javascript
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

```go
import (
  "github.com/chargehound/chargehound-go"
)

ch := chargehound.New("test_123") 
```

```java
import com.chargehound.Chargehound;

Chargehound chargehound = new Chargehound("test_123");
```

> Make sure to replace `test_123` with your API key.

You have two API keys, one for test and one for live data.

Authentication to the API is performed via [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication). Your API key serves as your username. You do not need to provide a password, so the full authorization string should have the form `{{key}}:`.

If you are setting authentication in the HTTP Headers with the form `Authorization: Basic {{credentials}}` be sure to [base 64](https://en.wikipedia.org/wiki/Base64) encode the credentials so that, for example, `test_123:` becomes `dGVzdF9YWFg6`.

## Errors

```json
{
  "url": "/v1/disputes/puppy/submit",
  "livemode": false,
  "error": {
    "status": 404,
    "message": "A dispute with id 'puppy' was not found",
    "type": "not_found"
  }
}
```

Chargehound uses conventional HTTP response codes to indicate success or failure of an API request. In general, codes in the 2xx range indicate success, codes in the 4xx range indicate an error that resulted from the provided information (e.g. a required parameter was missing, a payment failed, etc.), and codes in the 5xx range indicate an error with our servers. 

### HTTP status code summary

| Status | Description |
|--------|--------|
| 200 - OK | Everything worked as expected. |
| 201 - Created | The resource was successfully created. |
| 202 - Accepted | The request was successfully processed but not completed. |
| 400 - Bad Request | The request data was invalid or incomplete. |
| 401 - Unauthorized | Invalid API key provided. |
| 403 - Forbidden | Insecure connection. |
| 404 - Not Found | Resource could note be found. |
| 500 - Server Error | Something went wrong on Chargehound's end. |

### Error details

An API error has a few standard fields in the "error" JSON object. These fields are "status", "message", and "type". 

"status" is the HTTP status code of the error.

"message" is a human readable description of the error. This is the place to look when debugging.

"type" is a structured error type string. This can help you programmatically handle some errors.

### Error types

| Type | Description |
|--------|--------|
| authentication | Invalid API key provided.  |
| dispute_closed | Dispute won/lost and cannot be updated. |
| dispute_not_found | No dispute found for the given ID. |
| dispute_overdue | Dispute overdue and cannot be submitted. |
| dispute_submitted | Dispute already submitted and cannot be submitted again. |
| dispute_uneditable | Dispute cannot be updated. |
| invalid_correspondence | Invalid correspondence data. |
| invalid_fields | Invalid fields data. |
| invalid_past_payments | Invalid past payments data. |
| invalid_products | Invalid products data. |
| invalid_request | The request data was invalid or incomplete. |
| missing_fields | Missing fields required by template. |
| missing_template | Template not set for dispute. |
| template_not_found | No template found for the given ID. |

## Handling errors

```javascript
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
rescue Chargehound::ChargehoundTimeoutError => e
  # The request timed out (default timeout is 60 seconds)
rescue Chargehound::ChargehoundError => e
  # Generic Chargehound error (404, 500, etc.)
rescue => e
  # Handle any other types of unexpected errors
end
```

```go
import (
  "fmt"
  "github.com/chargehound/chargehound-go"
)

// Use the Chargehound library to make a request

chErr := err.(chargehound.Error)

switch chErr.Type() {
case BadRequestError:
  // Invalid parameters were supplied in the request

  fmt.Println(chErr.Error())

case chargehound.UnauthorizedError:
  // Missing API key
case chargehound.ForbiddenError:
  // Incorrect API key
case chargehound.NotFoundError:
  // Not found
case chargehound.InternalServerError:
  // Internal server error
case chargehound.GenericError:
  // Generic Chargehound error 
default:
  // Handle any other types of unexpected errors
}
```

```java
import com.chargehound.errors.ChargehoundException;

try {
  // Use the Chargehound library to make a request
} catch (ChargehoundException.HttpException.Unauthorized exception) {
  // Missing API key
} catch (ChargehoundException.HttpException.Forbidden exception) {
  // Incorrect API key
} catch (ChargehoundException.HttpException.NotFound exception) {
  // Not found
} catch (ChargehoundException.HttpException.BadRequest exception) {
  // Bad request
} catch (ChargehoundException.HttpException.InternalServerError exception) {
  // Internal server error
} catch (ChargehoundException exception) {
  // Generic Chargehound error
} catch (Exception exception) {
  // Handle any other types of unexpected errors
}
```

When using our client libraries Chargehound also provides typed exceptions when errors are returned from the API.

## Response metadata

Our API responses contain a few standard metadata fields in the JSON. These fields are "object", "livemode", and "url". 

"object" identifies the type of object returned by the API. Currently the object can be a ["dispute"](#the-dispute-object), "list", or ["webhook"](#webhooks). A list contains a list of other objects in the "data" field.

"livemode" shows whether the API returned test or live data. The mode is determined by which API key was used to [authenticate](#authentication).

"url" shows the path of the request that was made.

## Libraries

Chargehound offers wrapper libraries in the following languages:

- [Node.js](https://github.com/chargehound/chargehound-node)
- [Python](https://github.com/chargehound/chargehound-python)
- [Ruby](https://github.com/chargehound/chargehound-ruby)
- [Go](https://github.com/chargehound/chargehound-go)
- [Java](https://github.com/chargehound/chargehound-java)

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
