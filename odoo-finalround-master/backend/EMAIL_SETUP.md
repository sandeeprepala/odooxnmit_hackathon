# Email Setup for OTP Functionality

To enable OTP verification for password reset, you need to configure the following environment variables in your `.env` file:

## Required Environment Variables

```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Rental App <your_email@gmail.com>
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Alternative Email Providers

### Outlook/Hotmail
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```bash
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASS=your_password
```

## Testing Email Configuration

After setting up, you can test the email functionality by:
1. Starting the backend server
2. Using the "Forgot Password" feature in the frontend
3. Checking if OTP emails are received

## Security Notes

- Never commit your `.env` file to version control
- Use app-specific passwords instead of your main password
- Consider using environment-specific configurations for production
