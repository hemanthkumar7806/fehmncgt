# Harmony EHR Authentication Setup

This document explains how to set up and use the Harmony EHR authentication system in your Next.js application.

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Harmony EHR API Configuration
HARMONY_CLIENT_ID=HNWEB
HARMONY_CLIENT_KEY=6bbc8e7f-d03b-4617-a2e1-27594fc1e19c
HARMONY_BASE_URL=https://uatextapi.harmonyehr.com

# Security Configuration (Optional)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
NODE_ENV=development
```

### 2. Basic Usage

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { token, isLoading, error, getToken } = useAuth()

  const handleGetToken = async () => {
    const accessToken = await getToken()
    console.log('Access token:', accessToken)
  }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {token && <p>Token: {token.substring(0, 20)}...</p>}
      <button onClick={handleGetToken}>Get Token</button>
    </div>
  )
}
```

## 📁 File Structure

```
src/
├── app/api/auth/access-token/
│   └── route.ts              # API route for getting access tokens
├── lib/
│   └── auth.ts               # Auth service and utilities
├── config/
│   └── auth.ts               # Authentication configuration
├── hooks/
│   └── useAuth.ts            # React hooks for auth
└── components/
    └── AuthExample.tsx       # Example component
```

## 🔧 API Reference

### AuthService

The main service class for managing authentication.

```typescript
import { authService } from '@/lib/auth'

// Get access token (with caching)
const token = await authService.getAccessToken()

// Force refresh token
const freshToken = await authService.getAccessToken(true)

// Clear cached token
authService.clearToken()

// Check if token is valid
const isValid = authService.hasValidToken()

// Get token info
const info = authService.getTokenInfo()
```

### useAuth Hook

React hook for managing authentication state.

```typescript
const {
  token,           // Current access token
  isLoading,       // Loading state
  error,           // Error message
  getToken,        // Function to get/refresh token
  clearToken,      // Function to clear token
  hasValidToken,   // Boolean indicating if token is valid
  tokenInfo        // Token metadata
} = useAuth()
```

### useAuthenticatedRequest Hook

Hook for making authenticated requests to Harmony EHR.

```typescript
const { makeRequest, clearToken } = useAuthenticatedRequest()

// Make authenticated request
const response = await makeRequest('https://api.harmonyehr.com/endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'example' })
})
```

## 🔒 Security Features

### Rate Limiting
- 10 requests per minute per IP address
- Automatic blocking of excessive requests
- Configurable limits in `src/config/auth.ts`

### CORS Protection
- Configurable allowed origins
- Production vs development settings
- Secure header management

### Token Management
- Automatic token caching
- 5-minute refresh buffer before expiry
- Automatic token refresh on 401 errors

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Development vs production error details

## 🛠️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HARMONY_CLIENT_ID` | Yes | - | Harmony EHR client ID |
| `HARMONY_CLIENT_KEY` | Yes | - | Harmony EHR client key |
| `HARMONY_BASE_URL` | No | `https://uatextapi.harmonyehr.com` | Base URL for Harmony API |
| `ALLOWED_ORIGINS` | No | `*` | Comma-separated list of allowed origins |
| `NODE_ENV` | No | `development` | Environment mode |

### Custom Configuration

Edit `src/config/auth.ts` to customize:

```typescript
export const authConfig = {
  harmony: {
    clientId: 'your-client-id',
    clientKey: 'your-client-key',
    baseUrl: 'https://your-api-url.com',
  },
  security: {
    allowedOrigins: ['https://yourdomain.com'],
    rateLimit: {
      windowMs: 60000,    // 1 minute
      maxRequests: 10,    // 10 requests per minute
    },
  },
  token: {
    refreshBuffer: 300,   // 5 minutes before expiry
  },
}
```

## 📝 Usage Examples

### 1. Simple Token Retrieval

```tsx
import { useAuth } from '@/hooks/useAuth'

function LoginButton() {
  const { token, isLoading, getToken } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (token) return <div>Logged in!</div>

  return <button onClick={getToken}>Login</button>
}
```

### 2. Making API Calls

```tsx
import { useAuthenticatedRequest } from '@/hooks/useAuth'

function DataComponent() {
  const { makeRequest } = useAuthenticatedRequest()
  const [data, setData] = useState(null)

  const fetchData = async () => {
    try {
      const response = await makeRequest('/api/harmony/patients')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

### 3. Error Handling

```tsx
import { useAuth } from '@/hooks/useAuth'

function ErrorHandling() {
  const { error, getToken, clearToken } = useAuth()

  const handleRetry = async () => {
    clearToken() // Clear any cached errors
    await getToken(true) // Force refresh
  }

  return (
    <div>
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
    </div>
  )
}
```

## 🧪 Testing

### Test the Authentication

1. Add the `AuthExample` component to any page:

```tsx
import AuthExample from '@/components/AuthExample'

export default function TestPage() {
  return <AuthExample />
}
```

2. Visit the page and test the authentication flow

### Manual Testing

```bash
# Test the API endpoint directly
curl -X POST http://localhost:3000/api/auth/access-token \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🚨 Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check that environment variables are set correctly
   - Verify the `.env.local` file exists and has the right values

2. **"Rate limit exceeded"**
   - Wait a minute before making more requests
   - Check if multiple instances are making requests

3. **"Failed to obtain access token"**
   - Verify Harmony EHR credentials are correct
   - Check network connectivity
   - Ensure the Harmony API is accessible

4. **CORS errors**
   - Check `ALLOWED_ORIGINS` configuration
   - Ensure the requesting domain is in the allowed list

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages in the API responses.

## 🔄 Production Deployment

### Environment Setup

1. Set production environment variables
2. Configure `ALLOWED_ORIGINS` with your production domains
3. Consider using Redis for rate limiting in production
4. Set up proper logging and monitoring

### Security Checklist

- [ ] Environment variables are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is appropriate for your use case
- [ ] Error messages don't expose sensitive information
- [ ] Logging is configured for production

## 📚 Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [OAuth 2.0 Client Credentials Flow](https://tools.ietf.org/html/rfc6749#section-4.4)
- [Harmony EHR API Documentation](https://harmonyehr.com/api-docs)
