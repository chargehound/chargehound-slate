# Data Requests

You can use the API to request to retrieve or remove the data in Chargehound for a particular person, identified by name or email.

## Retrieve Data

> Definition:

```sh
POST /v1/personal-data/retrieve
```

> Example request:

```sh
curl https://api.chargehound.com/v1/personal-data/retrieve \
  -u test_123: \
  -d email="susie@example.com" \
  -d name="Susie Chargeback" \
  -d notification_email="your_email@example.com"
```

> Example response:

```json
{
  "success": {
    "message": "Data retrieval request submitted."
  },
  "url": "/v1/personal-data/retrieve",
  "livemode": false
}
```

Retrieve the data in Chargehound for a particular person. 

### Parameters

| Parameter      | Type       | Required?  | Description |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| email       | string        | required   | The email of the person whose data is to be retrieved. |
| name        | string        | required   | The name of the person whose data is to be retrieved. |
| notification_email        | string        | required   | Once the data request is fulfilled, the data will be sent to this email. |

### Possible errors

| Error code           | Description                                                          |
| ---------------------|----------------------------------------------------------------------|
| 400 Bad Request      | Missing or invalid parameters. |

## Remove Data

> Definition:

```sh
POST /v1/personal-data/remove
```

> Example request:

```sh
curl https://api.chargehound.com/v1/personal-data/remove \
  -u test_123: \
  -d email="susie@example.com" \
  -d name="Susie Chargeback" \
  -d notification_email="your_email@example.com"
```

> Example response:

```json
{
  "success": {
    "message": "Data removal request submitted."
  },
  "url": "/v1/personal-data/remove",
  "livemode": false
}
```

Remove the data in Chargehound for a particular person. 

### Parameters

| Parameter      | Type       | Required?  | Description |
| -------------  | ---------  |------------|-----------------------------------------------------------------------------------------------------------------------|
| email       | string        | required   | The email of the person whose data is to be removed. |
| name        | string        | required   | The name of the person whose data is to be removed. |
| notification_email        | string        | optional   | Once the data removal is complete, a confirmation can be sent to this email. |

### Possible errors

| Error code           | Description                                                          |
| ---------------------|----------------------------------------------------------------------|
| 400 Bad Request      | Missing or invalid parameters. |

