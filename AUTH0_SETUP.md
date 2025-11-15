# Auth0 Configuration Guide

This guide will help you configure Auth0 with email/password authentication and social logins (Google, Apple, Facebook) for the EduPro Learn platform.

## Prerequisites

- An Auth0 account (sign up at https://auth0.com)
- Access to Google Cloud Console (for Google OAuth)
- Access to Apple Developer Account (for Apple Sign In)
- Access to Facebook Developers (for Facebook Login)

## Step 1: Create Auth0 Application

1. Log in to your Auth0 Dashboard
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose **Regular Web Application**
5. Name it "EduPro Learn"
6. Click **Create**

## Step 2: Configure Application Settings

In your Auth0 application settings:

1. **Allowed Callback URLs**:
   ```
   http://localhost:3000/api/auth/callback
   https://yourdomain.com/api/auth/callback
   ```

2. **Allowed Logout URLs**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```

3. **Allowed Web Origins**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```

4. Save changes

## Step 3: Configure Environment Variables

Copy the following values from your Auth0 application settings to your `.env.local` file:

```env
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
AUTH0_DOMAIN='YOUR_AUTH0_DOMAIN.auth0.com'
APP_BASE_URL='http://localhost:3000'
```

## Step 4: Enable Email/Password Authentication

1. In Auth0 Dashboard, go to **Authentication** → **Database**
2. Click **Create DB Connection**
3. Name it "Username-Password-Authentication"
4. Enable the following options:
   - Requires Username
   - Disable Sign Ups (if you want to control user registration)
5. Go to **Applications** tab and enable your application
6. Save changes

## Step 5: Configure Google OAuth

### 5.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add Authorized redirect URIs:
   ```
   https://YOUR_AUTH0_DOMAIN.auth0.com/login/callback
   ```
7. Copy the **Client ID** and **Client Secret**

### 5.2 Configure in Auth0

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Click **Create Connection**
3. Select **Google**
4. Enter your Google **Client ID** and **Client Secret**
5. Configure permissions (email, profile)
6. Go to **Applications** tab and enable your application
7. Save changes

## Step 6: Configure Apple Sign In

### 6.1 Create Apple Service ID

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create an **App ID** (if you don't have one)
4. Create a **Services ID**
5. Configure Sign In with Apple:
   - Add domain: `YOUR_AUTH0_DOMAIN.auth0.com`
   - Add return URL: `https://YOUR_AUTH0_DOMAIN.auth0.com/login/callback`
6. Create a **Key** for Sign In with Apple
7. Download the key file (.p8)

### 6.2 Configure in Auth0

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Click **Create Connection**
3. Select **Apple**
4. Enter:
   - **Client ID** (Services ID)
   - **Team ID**
   - **Key ID**
   - **Private Key** (content of .p8 file)
5. Go to **Applications** tab and enable your application
6. Save changes

## Step 7: Configure Facebook Login

### 7.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** as app type
4. Fill in app details and create
5. Add **Facebook Login** product
6. In Facebook Login settings, add OAuth Redirect URIs:
   ```
   https://YOUR_AUTH0_DOMAIN.auth0.com/login/callback
   ```
7. Copy **App ID** and **App Secret** from Settings → Basic

### 7.2 Configure in Auth0

1. In Auth0 Dashboard, go to **Authentication** → **Social**
2. Click **Create Connection**
3. Select **Facebook**
4. Enter your Facebook **App ID** and **App Secret**
5. Configure permissions (email, public_profile)
6. Go to **Applications** tab and enable your application
7. Save changes

## Step 8: Configure User Roles

### 8.1 Create Roles

1. In Auth0 Dashboard, go to **User Management** → **Roles**
2. Create three roles:
   - **student** (default role for new users)
   - **instructor** (for course creators)
   - **admin** (for platform administrators)

### 8.2 Add Role to User Metadata

Create an Auth0 Action to assign default role:

1. Go to **Actions** → **Flows** → **Login**
2. Click **Custom** → **Build Custom**
3. Name it "Assign Default Role"
4. Add this code:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://edupro.com';
  
  // Check if user has a role
  if (!event.user.app_metadata || !event.user.app_metadata.role) {
    // Assign default role
    api.user.setAppMetadata('role', 'student');
  }
  
  // Add role to token
  api.idToken.setCustomClaim(`${namespace}/role`, event.user.app_metadata.role || 'student');
  api.accessToken.setCustomClaim(`${namespace}/role`, event.user.app_metadata.role || 'student');
};
```

5. Deploy the action
6. Add it to the Login flow

## Step 9: Test Authentication

1. Start your Next.js application:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click "Sign In" and test:
   - Email/Password login
   - Google login
   - Apple login
   - Facebook login

4. Verify that users are created in Auth0 Dashboard

## Step 10: Production Configuration

Before deploying to production:

1. Update all callback URLs to use your production domain
2. Enable MFA (Multi-Factor Authentication) in Auth0
3. Configure password policies
4. Set up email templates for verification and password reset
5. Enable anomaly detection
6. Configure session management
7. Set up monitoring and logging

## Troubleshooting

### Common Issues

1. **Callback URL mismatch**: Ensure all callback URLs are correctly configured in Auth0 and social providers

2. **Missing email scope**: Make sure email scope is requested in social connections

3. **Role not assigned**: Check that the Auth0 Action is deployed and added to the Login flow

4. **CORS errors**: Verify that your domain is added to Allowed Web Origins in Auth0

### Support

For more information, visit:
- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Auth0 SDK](https://github.com/auth0/nextjs-auth0)
