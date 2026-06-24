## Authentication Backend README Overview

### Project Summary
This repository is a Node.js authentication backend built with:
- `Express`
- `MongoDB` via `mongoose`
- `JWT` for access tokens
- refresh token sessions
- email OTP verification using `nodemailer` and Gmail OAuth2

It supports registration, login, email verification, session refresh, logout, and logout from all devices.

### Go Through the Section 1 and section 2 to use this project.

#### SECTION 1: 
### Getting OAuth2 Credentials

1. Go to the Google API Console:
   - Navigate to the Google API Console.
   - Create a new project or select an existing one.
   - once the project is created click on Select project.
2. Enable Gmail API:
   - Go to the Library section.
   - Search for Gmail API and enable it.
3. Go to Auth consent screen below the Enabled APIs and services.
   - Click on Get Started
            - Add you App name.
            - Add support email (Add that email from which you have opened the Google API Console) . (Click next)
   - Audience Select ##External (Click next)
   - contact information (previous same email only). (Click next)
   - click Finish ----> Click Create.
4. Go to Audience section and add the Test users (use to send email on behalf of you) Click Save.
5. Create OAuth2 Credentials:
   - Click on Google Cloud logo ---> Search APIs and services 
   - Go to the Credentials section.
   - Click on Create Credentials and chosse OAuth client ID.
   - set the application type to Web Application.
   - leave the Authorized JavaScript Origins empty
   - Under Authorized redirect URIs, add http://localhost and https://developers.google.com/oauthplayground (or your application's URL).
   - Now You will get ##client ID## and ## Client Secret ## (copy that and paste in the formate given below. and ( don't close that tab till the next steps because ones the tab is closed you will not be able to get that)
     ### Required Environment Variables
Go to the .env file where you will see this format paste the credentials here:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_USER` = add that email you have used in previously.

#### SECTION 2
###Generating the Refresh Token Using OAuth 2.0 Playground
1. Access OAuth 2.0 Playground:
   Open the OAuth 2.0 Playground in your web browser.
2. Configure OAuth 2.0 Playground::
   - select the Gmail API v1 in left corner by clicking ctrl + F for searching search for Gmail API v1 and in that select https://mail.google.com/
   - In the top-right corner, click on the gear icon (settings).
   - select Use your own OAuth credentials.
   - Enter your clientID and ClientSecret obtained from the Google Cloud Console.  (That's the reason said you to not close tab)
   - Click on Authorize Api ---> (select same gmail you used previously)
   - you get Authorization code ----> (click on Exchange authorization code for tokens). 
   - the step 2 closes immediately no need to worry again click on step 2.
   - Paste the refresh Token in .env file and you are done.
   - now install the nodemailer command - npm i nodemailer.

### Key Features
- User registration with `username`, `email`, and `password`
- Passwords hashed using `SHA-256`
- Email verification using OTP
- JWT access token for API authorization
- Refresh token stored in a secure HTTP-only cookie
- Session tracking in MongoDB
- Logout single session and logout-all devices
- Get current authenticated user details

---

### Architecture
- server.js
  - bootstraps the app
  - connects to MongoDB
  - starts listening on port `3000`
- app.js
  - configures middleware
  - mounts authentication routes
- config.js
  - loads and validates environment variables
- database.js
  - connects to MongoDB
- auth.routes.js
  - defines auth-related endpoints
- auth.controller.js
  - contains registration, login, verification, token refresh, and logout logic
- models
  - user.model.js — users collection
  - session.model.js — refresh token sessions
  - otp.model.js — stored OTP hashes
- email.service.js
  - sends OTP email using Gmail OAuth2
- utils.js
  - OTP generation and HTML email template

---

### API Endpoints
Base URL: `/api/auth`

- `POST /register`
  - Request body: `username`, `email`, `password`
  - Creates a new user and sends OTP email
- `POST /login`
  - Request body: `email`, `password`
  - Requires verified email
  - Returns `accessToken`
  - Sets `refreshToken` cookie
- `GET /get-me`
  - Requires `Authorization: Bearer <accessToken>`
  - Returns current user info
- `GET /refresh-token`
  - Uses cookie `refreshToken`
  - Returns a new `accessToken`
- `GET /logout`
  - Revokes current refresh token
  - Clears the cookie
- `GET /logout-all`
  - Revokes all active sessions for the user
- `GET /verify-email`
  - Request body: `email`, `otp`
  - Verifies the user email and marks account as verified

---

### Authentication Flow
1. User registers
   - password is hashed
   - user created with `verified: false`
   - OTP stored hashed in DB
   - OTP email sent to user
2. User verifies email
   - OTP is compared using hashed values
   - user marked verified
   - OTP records deleted
3. User logs in
   - verified email and password required
   - access token valid for `15m`
   - refresh token valid for `7d`
4. Refresh token flow
   - cookie-based refresh token is validated
   - session must be active and not revoked
   - new access and refresh tokens issued
5. Logout
   - single session logout revokes current refresh token
   - logout-all revokes all user sessions

---



---

### Run Locally
```bash
npm install
npm run dev
```

Then open:
- `http://localhost:3000`

---

### Notes
- The refresh token is stored as a secure HTTP-only cookie.
- Sessions are stored in MongoDB and can be revoked individually.
- Email delivery uses Gmail OAuth2 credentials configured in environment variables.
