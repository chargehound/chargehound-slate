# Versioning

The Chargehound API uses versioning to roll out backwards-incompatible changes over time.

## About Versioning

The API version will control the API and webhook behaviors, such as parameters accepted in requests, and response properties. Your account is automatically set to the latest version when you sign up for Chargehound.

A new version of the API is released when backwards-incompatible changes are made to the API. To avoid breaking your code, we will never force you to upgrade until you’re ready.

We will be releasing backwards-compatible changes without introducing new versions. Your code will be able to handle these changes no matter what version it's on.

Examples of backwards-compatible changes:

- Adding new API endpoints
- Adding new optional response attributes to an existing resource
- Adding new optional request attributes

## Upgrade your API Version

We recommend staying up-to-date with the current API version to take advantage of latest improvements to the Chargehound API.

To see your current version and upgrade to the latest, visit the API tab on the Chargehound dashboard.

All requests will use your account API settings, unless you override the API version. Versioning of the Chargehound API will be released as dates, displayed as: `YYYY-MM-DD`

To set the API version on a specific request, send a `Chargehound-Version` header.

## Changelog

Backwards-incompatible changes will be documented in the changelog as part of every version release. Documentation will provide in-depth explanations of the changes.

### Version 2017-03-29

Deprecated `external_identifier` in favor of ID.

## Documentation

Documentation is available for all previous releases:

* [Latest](../current/)
* [2016-03-05](../2016-03-05/)
