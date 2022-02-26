# Users Service

## API

This service exposes endpoints to authenticate and manage a user account in client applications.

### `POST /users/auth/email`

User authentication based on email address. Create the user if it does not exist and send an email containing a secret code to complete the authentication process.

Request:

```json
{
  "email": "String"
}
```

Response:

```json
{
  "userId": "String",
  "email": "String",
  "session": "String"
}
```

### `PUT /users/auth/email`

Complete user authentication via secret code.

Request:

```json
{
  "userId": "String",
  "session": "String",
  "secretCode": "String"
}
```

Response:

```json
{
  "accessToken": "String",
  "tokenType": "String",
  "expiresIn": "String",
  "idToken": "String",
  "refreshToken": "String"
}
```

### `PUT /users/auth/refresh`

Use the refresh token to retrieve new ID and access tokens.

Request:

```json
{
  "refreshToken": "String"
}
```

Response:

```json
{
  "accessToken": "String",
  "tokenType": "String",
  "expiresIn": "String",
  "idToken": "String",
  "refreshToken": "String"
}
```

### `GET /users`

Get authenticated user.

Headers:

```json
"Authorization: Bearer {accessToken}"
```

Response:

```json
{
  "userId": "String",
  "email": "String",
  "created": "Timestamp",
  "updated": "Timestamp",
  "enabled": "String",
  "status": "String"
}
```

### `DELETE /users`

Delete authenticated user. Any user-related resources like documents or storage files should be deleted separately.

Headers:

```json
"Authorization: Bearer {accessToken}"
```

### `GET /users/data`

Get authenticated user data as a key-value object.

Headers:

```json
"Authorization: Bearer {accessToken}"
```

Response:

```json
{
  "{key}": "{value}"
}
```

### `PATCH /users/data`

Update authenticated user data as a key-value object. The object you pass is stored as is, and replaces any previous value.

Headers:

```json
"Authorization: Bearer {accessToken}"
```

Request:

```json
{
  "{key}": "{value}"
}
```
