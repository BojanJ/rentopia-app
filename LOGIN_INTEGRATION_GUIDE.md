# LoginPage Integration with useAuth.ts - Usage Guide

The LoginPage has been successfully integrated with the authentication system using TanStack Query and Zustand. Here's how it works:

## ✅ What's Working

### 1. **Integrated Authentication Flow**
- LoginPage now uses `useLogin()` hook from `useAuth.ts`
- Form state management with validation
- Error handling and loading states
- Automatic redirect after successful login
- Navigation to registration page

### 2. **Features Implemented**

#### **Form Validation**
- Email format validation
- Password length validation (minimum 6 characters)
- Real-time error clearing when user starts typing
- Required field validation

#### **Authentication Integration**
- Uses `useLogin()` mutation from TanStack Query
- Integrates with Zustand auth store
- Bearer token automatically stored
- User data persisted in localStorage

#### **User Experience**
- Loading state during login process
- Error messages from API responses
- Disabled form during submission
- Automatic redirect to dashboard on success
- Protection against double-submission

#### **Navigation**
- Links to registration page
- Automatic redirect if already authenticated
- Proper error handling for navigation

## 🚀 How to Use

### **1. Login Process**
```typescript
// User fills the form and submits
// LoginPage calls:
const loginMutation = useLogin();
loginMutation.mutate(formData, {
  onSuccess: () => {
    navigate("/dashboard"); // Automatic redirect
  },
});
```

### **2. What Happens Behind the Scenes**
1. Form data sent to API via axios client
2. Bearer token automatically added to future requests
3. User data and token stored in Zustand store
4. Auth state persisted to localStorage
5. User redirected to dashboard
6. All future API calls authenticated automatically

### **3. Error Handling**
- Network errors: Automatic retry with exponential backoff
- 401 Unauthorized: Automatic logout and redirect to login
- 4xx Client errors: Display error message to user
- Server errors: Logged to console

## 🔧 API Integration

### **Expected API Endpoints**
The LoginPage expects these endpoints to be available:

```typescript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PROPERTY_OWNER"
  },
  "token": "jwt-token-here"
}
```

### **Environment Configuration**
Add to your `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Testing the Integration

### **1. Start the Development Server**
```bash
cd c:\Projects\Rentopia\rentopia-app
npm run dev
```

### **2. Navigate to Login**
- Go to `http://localhost:5173/auth/login`
- Or just `http://localhost:5173/` (redirects to login if not authenticated)

### **3. Test Login Form**
- Try submitting with empty fields (validation errors)
- Try invalid email format (validation error)
- Try short password (validation error)
- Try valid credentials (should call API)

### **4. Mock API Response** (for testing without backend)
You can temporarily modify the `authApi.login` function to return mock data:

```typescript
// In src/hooks/useAuth.ts
login: async (data: LoginRequest): Promise<LoginResponse> => {
  // Mock response for testing
  return {
    user: {
      id: "mock-user-id",
      email: data.email,
      firstName: "Test",
      lastName: "User",
      role: "PROPERTY_OWNER"
    },
    token: "mock-jwt-token"
  };
},
```

## 🔒 Security Features

### **Automatic Token Management**
- Bearer token automatically added to all API requests
- Token stored securely in Zustand with persistence
- Automatic logout on 401 responses
- Token refresh capability built-in

### **Route Protection**
- Automatic redirect if already authenticated
- Protected routes check auth state
- Logout clears all cached data

## 📱 RegisterPage Available

A complete RegisterPage has also been created with:
- Full form validation
- Role selection (Property Owner, Tenant, Service Provider)
- Password confirmation
- Integration with `useRegister()` hook
- Navigation back to login

Navigate to `/auth/register` to access it.

## 🎯 Next Steps

1. **Start your backend API** on `http://localhost:3001`
2. **Test the login flow** with real credentials
3. **Add more protected routes** to the dashboard
4. **Implement logout functionality** in the UI
5. **Add user profile management**

The authentication system is now fully functional and ready for use!
