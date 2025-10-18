# Environment Variables Setup

## Overview

The application now uses environment variables for configuration, making it easy to change settings without modifying code.

## Client Environment Variables

### Location

`client/.env`

### Available Variables

#### VITE_API_BASE_URL

- **Description**: The base URL for the backend API
- **Default**: `http://localhost:3000/api`
- **Format**: Full URL including protocol, host, port, and base path
- **Examples**:
  - Development: `http://localhost:3000/api`
  - Production: `https://api.yourdomain.com/api`
  - Custom port: `http://localhost:8080/api`

### Setup Instructions

1. **For Development:**

   ```bash
   cd client
   cp .env.example .env
   ```

   The default values in `.env` work for local development.

2. **For Production:**
   Create a `.env` file with your production API URL:

   ```env
   VITE_API_BASE_URL=https://api.yourdomain.com/api
   ```

3. **Restart the dev server** after changing `.env`:
   ```bash
   npm run dev
   ```

### Important Notes

#### Vite Environment Variables

- All environment variables must be prefixed with `VITE_` to be exposed to the client
- Variables are embedded at **build time**
- Changes require restarting the dev server

#### Security

- ✅ `.env` is added to `.gitignore` (not committed to Git)
- ✅ `.env.example` is committed as a template
- ⚠️ Never commit sensitive data to `.env`
- ⚠️ Environment variables are exposed in the client bundle (visible to users)

### File Structure

```
client/
├── .env                 # Your local configuration (ignored by Git)
├── .env.example         # Template for other developers (committed)
├── .gitignore          # Includes .env
└── src/
    └── utils/
        └── api.ts      # Uses import.meta.env.VITE_API_BASE_URL
```

### Code Implementation

The API base URL is now configured in `client/src/utils/api.ts`:

```typescript
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
```

This provides:

- ✅ Environment-based configuration
- ✅ Fallback to localhost if env var not set
- ✅ Type-safe access via TypeScript
- ✅ Easy to change for different environments

### Changing the API URL

To use a different API URL, simply edit `client/.env`:

```env
# For local development on different port
VITE_API_BASE_URL=http://localhost:8080/api

# For staging environment
VITE_API_BASE_URL=https://staging-api.yourdomain.com/api

# For production environment
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Then restart the dev server:

```bash
npm run dev
```

### Deployment

When deploying to platforms like Vercel, Netlify, or custom servers:

1. Set the environment variable in your deployment platform's settings
2. Use the variable name: `VITE_API_BASE_URL`
3. Set the value to your production API URL
4. Redeploy the application

### Troubleshooting

**Problem**: Changes to `.env` not reflected

- **Solution**: Restart the dev server (npm run dev)

**Problem**: API calls failing after changing URL

- **Solution**: Check the URL format (include /api at the end)
- **Solution**: Verify the backend is accessible at that URL

**Problem**: Environment variable showing as undefined

- **Solution**: Ensure it's prefixed with `VITE_`
- **Solution**: Restart the dev server

### Best Practices

1. ✅ Always use `.env.example` as a template
2. ✅ Document all environment variables
3. ✅ Use fallback values for critical variables
4. ✅ Keep sensitive data out of client environment variables
5. ✅ Test with different environment configurations

### Additional Configuration

You can add more environment variables as needed:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_ANALYTICS=true

# External Services
VITE_UPLOAD_SERVICE_URL=https://upload.example.com
```

Then use them in your code:

```typescript
const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
const uploadUrl = import.meta.env.VITE_UPLOAD_SERVICE_URL;
```

## Server Environment Variables

The server already uses environment variables in `server/.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)

Refer to `server/.env.example` for the complete list.
