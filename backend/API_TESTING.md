# API Testing Guide

## Using curl (Command Line)

### 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Profile (requires token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Trip
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Summer Vacation",
    "destination": "Paris",
    "startDate": "2026-06-01",
    "endDate": "2026-06-15",
    "description": "Exploring Paris in summer",
    "imageUrl": "https://example.com/paris.jpg",
    "totalBudget": 2000,
    "currency": "EUR"
  }'
```

### 5. Get All Trips
```bash
curl -X GET http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Single Trip Details
```bash
curl -X GET http://localhost:5000/api/trips/TRIP_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Add Budget Item to Trip
```bash
curl -X POST http://localhost:5000/api/trips/TRIP_ID_HERE/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "category": "Food",
    "amount": 250,
    "date": "2026-06-01",
    "description": "Restaurant dinner"
  }'
```

### 8. Add Itinerary Item
```bash
curl -X POST http://localhost:5000/api/trips/TRIP_ID_HERE/itinerary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Visit Eiffel Tower",
    "description": "Climb to the top",
    "date": "2026-06-02",
    "time": "10:00",
    "location": "Champ de Mars, Paris",
    "type": "activity"
  }'
```

### 9. Add Packing Item
```bash
curl -X POST http://localhost:5000/api/trips/TRIP_ID_HERE/packing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Passport",
    "category": "Documents"
  }'
```

### 10. Update Packing Item (toggle packed)
```bash
curl -X PUT http://localhost:5000/api/trips/TRIP_ID_HERE/packing/ITEM_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "packed": true
  }'
```

---

## Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new collection
3. In the collection settings, add a variable:
   - Name: `token`
   - Value: (leave empty, will be set after login)
4. Add your requests to the collection

### Postman Setup for Auth Token

After login request, go to Tests tab and add:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("token", jsonData.data.token);
}
```

Then use `{{token}}` in Authorization header for other requests.

---

## Error Responses

### 400 - Bad Request
```json
{
  "errors": [
    {
      "param": "email",
      "msg": "Invalid email"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Trip not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Failed to create trip"
}
```

---

## Quick Test Sequence

1. Register a user (save the token from response)
2. Login with the same credentials
3. Create a trip (use the token)
4. Get the trip ID from response
5. Create budget items for that trip
6. Create itinerary items for that trip
7. Create packing items for that trip
8. Get the full trip with all details

All should return status 200/201 with `"success": true`
