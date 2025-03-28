# Email Verification System - Setup Guide

This document explains how to set up and configure the email verification system for Bharat Heritage.

## Overview

The application uses Nodemailer to send verification emails when users register. The process is as follows:

1. User registers with email, username, and password
2. System creates a new user account with `isVerified: false`
3. System generates a verification token and sends an email with a verification link
4. User clicks the link in the email
5. System verifies the token and marks the account as verified
6. User can now log in

## Configuration

### Environment Variables

Add the following to your `.env` file:

```
# Email configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup

If using Gmail (default configuration):

1. Create a Google account or use an existing one
2. Enable 2-factor authentication
3. Generate an "App Password":
   - Go to your Google Account settings
   - Select "Security"
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password for "Mail" and "Other"
   - Use this password in your `EMAIL_PASSWORD` environment variable

### Other Email Providers

To use a different email provider, modify the `transporter` configuration in `utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.yourprovider.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Security Considerations

1. Verification tokens expire after 24 hours (configurable in `routes/auth.js`)
2. Tokens are randomly generated using `crypto.randomBytes(32)`
3. Users cannot log in until they verify their email
4. The system allows users to request a new verification email

## Troubleshooting

If verification emails aren't being sent:

1. Check your `.env` file configuration
2. Make sure your email provider allows sending from less secure apps (if applicable)
3. Check if your email service has rate limits
4. Check server logs for specific error messages

If using Gmail and seeing authentication errors:

- Make sure you're using an App Password, not your regular account password
- Check that 2FA is enabled on your Google account

## Testing

You can test the email verification system by:

1. Registering a new user account
2. Checking the registered email for the verification link
3. Clicking the link to verify the account
4. Attempting to log in (should work only after verification)

To manually resend a verification email for testing:

1. Try to log in with an unverified account
2. When prompted, request a new verification email
