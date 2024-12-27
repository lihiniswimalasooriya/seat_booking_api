Student ID: COBSCComp212P-063

# Seat Booking API Specification

### Overview

The SEAT BOOKING API allows users to manage routes, buses, trips, and reservations in a transportation system. Authentication is required for most endpoints using a bearer token.

### Base URL

```
{{url}} (e.g., http://localhost:5000)
```

### Authentication

- **Type**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer {{token}}`
- **Endpoints to Obtain Token**:
  - **Register**: `/auth/register`
  - **Login**: `/auth/login`

### Endpoints

#### 1. Authentication

##### Register

- **Method**: POST
- **Endpoint**: `{{url}}auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.commuter@example.com",
    "password": "password123",
    "role": "commuter"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "User registered successfully"
    }
    ```

##### Login

- **Method**: POST
- **Endpoint**: `{{url}}auth/login`
- **Request Body**:
  ```json
  {
    "email": "john.commuter@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Login successful",
      "token": "jwt-token-string"
    }
    ```

#### 2. Routes Management

##### Add Route

- **Method**: POST
- **Endpoint**: `{{url}}routes`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "startPoint": "Matara",
    "endPoint": "Colombo",
    "distance": 115,
    "estimatedTime": "3h 30m",
    "fare": 500
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Route added successfully",
      "route": {
        "id": "676583141f582a5afbeb803c",
        "startPoint": "Matara",
        "endPoint": "Colombo",
        "distance": 115,
        "estimatedTime": "3h 30m",
        "fare": 500
      }
    }
    ```

##### Get One Route

- **Method**: GET
- **Endpoint**: `{{url}}routes/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "676583141f582a5afbeb803c",
      "startPoint": "Matara",
      "endPoint": "Colombo",
      "distance": 115,
      "estimatedTime": "3h 30m",
      "fare": 500
    }
    ```

##### Get Routes by StartPoint

- **Method**: GET
- **Endpoint**: `{{url}}routes/filter?startPoint=Matara`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    "routes": [
      {
        "id": "676583141f582a5afbeb803c",
        "startPoint": "Matara",
        "endPoint": "Colombo",
        "distance": 115,
        "estimatedTime": "3h 30m",
        "fare": 500
      }
    ]
    ```

##### Update Route

- **Method**: PUT
- **Endpoint**: `{{url}}routes/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "startPoint": "Station A",
    "endPoint": "Station C",
    "distance": 20,
    "estimatedTime": "30 minutes",
    "fare": 70
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Route updated successfully"
    }
    ```

##### Delete Route

- **Method**: DELETE
- **Endpoint**: `{{url}}routes/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Route deleted successfully"
    }
    ```

##### Get All Routes

- **Method**: GET
- **Endpoint**: `{{url}}routes`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "676583141f582a5afbeb803c",
        "startPoint": "Matara",
        "endPoint": "Colombo",
        "distance": 115,
        "estimatedTime": "3h 30m",
        "fare": 500
      }
    ]
    ```

#### 3. Bus Management

##### Add Bus

- **Method**: POST
- **Endpoint**: `{{url}}buses`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "busNumber": "B1234",
    "operator": "676835ab75e751be261bbf77",
    "route": "6768358e75e751be261bbf74",
    "capacity": 40
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Bus added successfully",
      "bus": {
        "id": "676aeb96dbccac34ef334cd8",
        "busNumber": "B1234",
        "operator": "676835ab75e751be261bbf77",
        "route": "6768358e75e751be261bbf74",
        "capacity": 40
      }
    }
    ```

##### Add Default Trip toBus

- **Method**: POST
- **Endpoint**: `{{url}}buses/defaultTrips`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "route": "6768358e75e751be261bbf74",
    "bus": "676afd86dc0bb2b74773f4de",
    "startTime": "08:00",
    "arrivalTime": "12:00"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Default trip added successfully",
      "defaultTrip": {
        "route": "676a357b7574a6c65c8c927e",
        "bus": "676afd86dc0bb2b74773f4de",
        "startTime": "12:00",
        "arrivalTime": "2:00",
        "_id": "676c3fae00032f7284b341f2"
      }
    }
    ```

##### Update Bus

- **Method**: PUT
- **Endpoint**: `{{url}}buses/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "busNumber": "B1234",
    "operator": "67681877d5bfed935a05f37a",
    "route": "6768192b4675998daaaa87a2",
    "capacity": 45
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Bus updated successfully"
    }
    ```

##### Delete Bus

- **Method**: DELETE
- **Endpoint**: `{{url}}buses/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Bus deleted successfully"
    }
    ```

##### Delete Default Trip

- **Method**: DELETE
- **Endpoint**: `{{url}}buses/defaultTrips/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Default Trip deleted successfully"
    }
    ```

##### Get All Buses

- **Method**: GET
- **Endpoint**: `{{url}}buses`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    [
      {
        "id": "676aeb96dbccac34ef334cd8",
        "busNumber": "B1234",
        "operator": "676835ab75e751be261bbf77",
        "route": "6768358e75e751be261bbf74",
        "capacity": 40
      }
    ]
    ```

##### Get One Bus

- **Method**: GET
- **Endpoint**: `{{url}}buses/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "676aeb96dbccac34ef334cd8",
      "busNumber": "B1234",
      "operator": "676835ab75e751be261bbf77",
      "route": "6768358e75e751be261bbf74",
      "capacity": 40
    }
    ```

#### 4. Reservation Management

##### Add Reservation

- **Method**: POST
- **Endpoint**: `{{url}}reservations`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "busId": "676afd86dc0bb2b74773f4de",
    "defaultTripId": "676afdb5dc0bb2b74773f4e3",
    "date": "2024-12-25T10:00:00Z",
    "seatNumber": 5
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
      "message": "Reservation added successfully",
      "reservation": {
        "id": "676af5f2f0b00fdfe76bd12a",
        "busId": "676afd86dc0bb2b74773f4de",
        "defaultTripId": "676afdb5dc0bb2b74773f4e3",
        "date": "2024-12-25T10:00:00Z",
        "seatNumber": 5
      }
    }
    ```

##### Update Reservation

- **Method**: PUT
- **Endpoint**: `{{url}}reservations/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Request Body**:
  ```json
  {
    "seatNumber": 5,
    "paymentStatus": "completed"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Reservation updated successfully"
    }
    ```

##### Get One Reservation

- **Method**: GET
- **Endpoint**: `{{url}}reservations/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "id": "676af5f2f0b00fdfe76bd12a",
      "busId": "676afd86dc0bb2b74773f4de",
      "defaultTripId": "676afdb5dc0bb2b74773f4e3",
      "date": "2024-12-25T10:00:00Z",
      "seatNumber": 5
    }
    ```

##### Delete Reservation

- **Method**: DELETE
- **Endpoint**: `{{url}}reservations/:id`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "message": "Reservation deleted successfully"
    }
    ```

##### Get Trip Details

- **Method**: GET
- **Endpoint**: `{{url}}reservations/trip?busId=<value>&defaultTripId=<value>&date=2024-12-25&routeId=<value>`
- **Headers**:
  - Authorization: Bearer `{{token}}`
- **Response**:
  - **200 OK**:
    ```json
    {
      "trip": {
        "_id": "676af5f2f0b00fdfe76bd12a",
        "busId": "676afd86dc0bb2b74773f4de",
        "defaultTripId": "676afdb5dc0bb2b74773f4e3",
        "date": "2024-12-25T10:00:00Z",
        "routeId": "676a357b7574a6c65c8c927e",
        "bookedSeats": [],
      }
    }
    ```


