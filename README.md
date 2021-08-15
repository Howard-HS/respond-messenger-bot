## Facebook Messenger Bot

#### Tech Stack
- Node.js (recommended v12 and above)
- Express
- Typescript
- NestJS
#### Email Service
- Mailgun
- Nodemailer

### Project Installation
```bash
$ yarn install
```

### Development
```bash
# Populate data for products
$ yarn seed

# Copy required environment variables into .env file
$ cp env.example .env

# Start the local development server
$ yarn start:dev 

# ngrok is required for the webhook to work properly as FB messenger webhook is only served via HTTPS traffic
$ ngrok http <LOCAL_DEVELOPMENT_PORT> 
```

### Production
```bash
# Compiles dependencies and build for production
$ yarn build

# Populate data for products
$ yarn seed

# Start the production server
$ yarn start 
```

### Environment variables
A sample of required envs are located env.example file

```bash
# Facebook page access token
PAGE_ACCESS_TOKEN= 

# A token supplied by user to verify incoming webhook connection from Facebook
VERIFY_TOKEN= 

# Facebook App Secret Key, used to verify incoming webhook payload
APP_SECRET=

# Credentials required from Mailgun via Nodemailer SMTP Transport layer
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=465
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_SENDER=
EMAIL_SENDER_DOMAIN=

# Update this field to receive email notification when user intends to buy a product
EMAIL_NOTIFICATION_RECEIVER_EMAIL=
```
