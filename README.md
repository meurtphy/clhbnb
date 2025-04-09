# 🏠 HBNB - Holberton BnB

## 🎯 Project Overview
RESTful API for a Bed and Breakfast service built with Flask, implementing clean architecture patterns.

## 📁 Project Structure
```bash
part2/
├── app/
│   ├── api/v1/          # API endpoints
│   │   ├── users.py
│   │   ├── places.py
│   │   ├── reviews.py
│   │   └── amenities.py
│   ├── models/          # Business logic
│   │   ├── base_model.py
│   │   ├── user.py
│   │   ├── place.py
│   │   ├── review.py
│   │   └── amenity.py
│   ├── services/        # Facade pattern
│   └── persistence/     # Repository pattern
├── run.py              
└── requirements.txt    
```

## 🚀 Installation & Setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 🧩 Core Components

### 1. 🔷 Base Model
```python
class BaseModel:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
```

### 2. 📦 Core Models
- **User**
  - Attributes: first_name, last_name, email, is_admin
  - Validation: names ≤ 50 chars, unique email

- **Place**
  - Attributes: title, description, price, latitude, longitude
  - Validation: title ≤ 100 chars, price > 0
  - Relationships: belongs to User, has many Reviews, many Amenities

- **Review**
  - Attributes: text, rating (1-5), user_id, place_id
  - Relationships: belongs to User and Place

- **Amenity**
  - Attributes: name (≤ 50 chars)
  - Relationships: many-to-many with Place

### 3. 🎭 Facade Pattern
```python
class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # Example methods
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_place_with_details(self, place_id):
        place = self.place_repo.get(place_id)
        if place:
            place.owner = self.user_repo.get(place.owner_id)
            place.reviews = self.review_repo.get_by_place(place_id)
        return place
```

## 🔌 API Endpoints & Examples

### 👥 User Management
```bash
# Create User
POST /api/v1/users/
{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
}

# Response
{
    "id": "uuid",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
}
```

### 🏡 Place Management
```bash
# Create Place
POST /api/v1/places/
{
    "title": "Cozy Apartment",
    "description": "Nice stay",
    "price": 100.0,
    "latitude": 37.7749,
    "longitude": -122.4194,
    "owner_id": "user_uuid",
    "amenities": ["amenity_uuid"]
}

# Get Place Details
GET /api/v1/places/<place_id>
Response includes: owner details, amenities, reviews
```

### ⭐ Review Management
```bash
# Create Review
POST /api/v1/reviews/
{
    "text": "Great place!",
    "rating": 5,
    "user_id": "user_uuid",
    "place_id": "place_uuid"
}

# Get Place Reviews
GET /api/v1/places/<place_id>/reviews
```

### 🛋️ Amenity Management
```bash
# Create Amenity
POST /api/v1/amenities/
{
    "name": "Wi-Fi"
}

# Get All Amenities
GET /api/v1/amenities/
```

## 📊 Status Codes & Responses
- 201: Resource Created
- 200: Success
- 404: Not Found
- 400: Bad Request

### 📝 Common Response Format
```json
{
    "id": "uuid",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    ...resource specific fields...
}
```

## 🏃‍♂️ Running the Application
```bash
python run.py  # Server starts at http://localhost:5000
```

---
## 🌟 **Summary**: This project implements a comprehensive REST API for a BnB platform using Flask, featuring clean architecture with Facade and Repository patterns, managing users, places, reviews, and amenities through a well-structured endpoint system.
