# Admin Login and Setup Guide

This guide explains how to set up and use the admin functionality in your e-commerce application.

## Overview

The admin system includes:
- Role-based authentication
- Admin-specific login endpoint
- User promotion functionality
- Admin-only routes for product management

## Setting Up Your First Admin User

You have three options to create your first admin user:

### Option 1: Admin Registration with Key (Recommended)

1. Set up an environment variable in your `.env` file:
   ```
   ADMIN_REGISTRATION_KEY=your-secret-admin-key
   ```

2. Register a new user with admin role:
   ```bash
   POST /api/v1/users/register
   Content-Type: multipart/form-data

   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "admin123",
     "address": "Admin Address",
     "phone": "1234567890",
     "role": "admin",
     "adminKey": "your-secret-admin-key"
   }
   ```

3. Include an avatar image in the form data

### Option 2: Promote Existing User to Admin

1. First, create a regular user through normal registration
2. Manually update the user's role in the database:
   ```javascript
   // In MongoDB shell or MongoDB Compass
   db.users.updateOne(
     { email: "user@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Option 3: Use Admin Promotion Endpoint (After First Admin is Created)

Once you have at least one admin, you can promote other users:

```bash
PATCH /api/v1/users/admin/promote/:userId
Authorization: Bearer <admin-token>
```

## Admin Login

### Using Admin-Specific Login Endpoint

```bash
POST /api/v1/users/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

This endpoint will only work for users with admin role.

### Using Regular Login Endpoint

Admins can also use the regular login endpoint:
```bash
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

The response will include the user's role in the token.

## Admin Routes

### User Management (Admin Only)

- `GET /api/v1/users/admin/users` - Get all users with pagination
- `GET /api/v1/users/admin/users/:userId` - Get specific user details
- `PATCH /api/v1/users/admin/promote/:userId` - Promote user to admin

### Product Management (Admin Only)

- `POST /api/v1/products/create` - Create new product
- `PATCH /api/v1/products/:id` - Update product details
- `DELETE /api/v1/products/:id` - Delete product
- `POST /api/v1/products/:id/images` - Add product images
- `DELETE /api/v1/products/:id/images/:imageIndex` - Remove product image
- `PATCH /api/v1/products/:id/stock` - Update product stock
- `GET /api/v1/products/admin/low-stock` - Get low stock products

## Token Structure

Admin access tokens include the role:
```json
{
  "_id": "user_id",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Security Considerations

1. **Keep the admin registration key secret** - Only share it with trusted individuals
2. **Use strong passwords** for admin accounts
3. **Regularly rotate admin credentials**
4. **Monitor admin activity** through logs
5. **Limit the number of admin users** to only those who need it

## Testing the Admin Setup

1. Register an admin user using Option 1
2. Login using the admin endpoint
3. Use the returned token to access admin-only routes
4. Verify that regular users cannot access admin routes

## Troubleshooting

### "Admin access required" Error
- Ensure the user has role: "admin" in the database
- Check that the token includes the role field
- Verify the admin middleware is properly applied to the route

### "Access denied. Admin role required" Error
- This occurs when trying to use the admin login endpoint with a non-admin user
- Ensure the user's role is set to "admin" in the database

### Token Issues
- Clear cookies and re-login if you've recently updated the user's role
- Tokens contain the role at the time of creation, so existing tokens won't reflect role changes