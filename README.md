# 🍔 FoodPulse — Food Ordering Application

A full-stack Food Ordering Application built with **Django REST API** backend and **HTML/CSS/JavaScript** frontend, featuring live order tracking, shopping cart management, multi-role authentication, and a premium glassmorphic dark UI.

---

## 📁 Project Folder Structure

```
FoodOrderingApplication/
│
├── Backend/
│   ├── __init__.py
│   ├── apps.py
│   ├── asgi.py
│   ├── db.py             ← Database model interface/helpers
│   ├── models.py         ← Django ORM Models (5 tables)
│   ├── settings.py       ← Django configuration (SQLite, CORS, Apps)
│   ├── urls.py           ← All 22 API URL routes
│   ├── views.py          ← 20 CRUD APIs + 2 login helpers (FBVs)
│   ├── wsgi.py
│   └── migrations/
│       └── 0001_initial.py
│
├── Frontend/
│   ├── index.html            ← Home Page (Search, Featured)
│   ├── login.html            ← Login Page (Customer/Restaurant/Admin)
│   ├── register.html         ← Customer Registration
│   ├── restaurants.html      ← Restaurant Listing & Filters
│   ├── menu.html             ← Food Menu per Restaurant
│   ├── cart.html             ← Shopping Cart
│   ├── checkout.html         ← Checkout & Payment
│   ├── orders.html           ← Order Tracking (Timeline)
│   ├── customer_dashboard.html
│   ├── restaurant_dashboard.html
│   ├── admin_dashboard.html
│   ├── style.css             ← Global Styles (Dark Theme, Glassmorphism)
│   ├── script.js             ← All JS logic + Fetch API calls
│   └── *.jpg                 ← AI-generated food images (biryani, pizza, burger…)
│
├── manage.py             ← Django entry point
├── populate_db.py        ← Database seed script (sample test data)
├── test_apis.py          ← Automated API test script (20 CRUD tests)
└── db.sqlite3            ← SQLite Database
```

---

## 🚀 Technology Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML5, CSS3 (Vanilla), JavaScript (ES6), Fetch API |
| Backend    | Django 6.0 (Function-Based Views) |
| Database   | SQLite3 (via Django ORM)          |
| CORS       | django-cors-headers               |

---

## 🔧 Setup & Installation

### Prerequisites
- Python 3.12+
- pip

### 1. Install Dependencies
```powershell
python -m pip install django django-cors-headers requests
```

### 2. Apply Database Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 3. Seed Sample Data
```powershell
python populate_db.py
```

### 4. Run the Backend Server
```powershell
python manage.py runserver 127.0.0.1:8000
```

### 5. Run the Frontend Server
Open a second terminal:
```powershell
cd Frontend
python -m http.server 3000
```

### 6. Open in Browser
## 🚀 Live Demo

**Frontend:** https://food-ordering-application-frontend-p2e1.onrender.com

**Backend API:** https://food-ordering-application-bkkn.onrender.com*

---

## 🔐 Login Credentials

| Role                | Email / Username     | Password / Contact |
|---------------------|----------------------|--------------------|
| Admin               | admin@foodpulse.com  | admin123           |
| Customer (Rahul)    | rahul@gmail.com      | rahul123           |
| Customer (Priya)    | priya@gmail.com      | priya123           |
| Restaurant Manager  | Anil Kumar           | 9876501234         |

---

## 🗃️ Database Schema

### Customer (customer_id starts at 101)
| Field       | Type   |
|-------------|--------|
| customer_id | Number |
| full_name   | String |
| email       | String |
| phone       | String |
| address     | String |
| password    | String |

### Restaurant (restaurant_id starts at 201)
| Field           | Type   |
|-----------------|--------|
| restaurant_id   | Number |
| restaurant_name | String |
| owner_name      | String |
| cuisine         | String |
| location        | String |
| contact         | String |
| rating          | Number |

### Food (food_id starts at 301)
| Field           | Type   |
|-----------------|--------|
| food_id         | Number |
| food_name       | String |
| restaurant_name | String |
| category        | String |
| price           | Number |
| availability    | String |
| image_url       | String |

### CartItem (cart_id starts at 401)
| Field         | Type   |
|---------------|--------|
| cart_id       | Number |
| customer_name | String |
| food_name     | String |
| quantity      | Number |
| price         | Number |
| total_price   | Number |

### Order (order_id starts at 501)
| Field           | Type   |
|-----------------|--------|
| order_id        | Number |
| customer_name   | String |
| restaurant_name | String |
| order_date      | Date   |
| total_amount    | Number |
| payment_method  | String |
| payment_status  | String |
| order_status    | String |

---

## 📡 REST API Endpoints (20 Total)

### Customer Management
| Method | Endpoint                        |
|--------|---------------------------------|
| POST   | /customers/add/                 |
| GET    | /customers/                     |
| PUT    | /customers/update/\<id\>/        |
| DELETE | /customers/delete/\<id\>/        |

### Restaurant Management
| Method | Endpoint                         |
|--------|----------------------------------|
| POST   | /restaurants/add/                |
| GET    | /restaurants/                    |
| PUT    | /restaurants/update/\<id\>/       |
| DELETE | /restaurants/delete/\<id\>/       |

### Food Menu Management
| Method | Endpoint                   |
|--------|----------------------------|
| POST   | /foods/add/                |
| GET    | /foods/                    |
| PUT    | /foods/update/\<id\>/       |
| DELETE | /foods/delete/\<id\>/       |

### Shopping Cart Management
| Method | Endpoint                   |
|--------|----------------------------|
| POST   | /cart/add/                 |
| GET    | /cart/                     |
| PUT    | /cart/update/\<id\>/        |
| DELETE | /cart/delete/\<id\>/        |

### Order Management
| Method | Endpoint                    |
|--------|-----------------------------|
| POST   | /orders/add/                |
| GET    | /orders/                    |
| PUT    | /orders/update/\<id\>/       |
| DELETE | /orders/delete/\<id\>/       |

---

## ✅ Bonus Features Implemented

| Feature                      | Implementation |
|------------------------------|----------------|
| Restaurant Search & Filters  | By name, cuisine type, location (real-time) |
| Food Search by Category      | Category pill filters on menu page |
| Live Cart Total Calculation  | Updates instantly on qty changes |
| Order Tracking Timeline      | Visual 4-step order timeline (Order Placed → Preparing → Out for Delivery → Delivered) |
| Responsive Mobile Design     | Flexbox/Grid breakpoints at 600px, 900px |

---

## 🧪 Running Automated API Tests

```powershell
python test_apis.py
```

All 20 CRUD operations (4 per module × 5 modules) are tested automatically against the running server.

---

## 📦 Sample Test Data

All sample records from the problem statement are pre-loaded via `populate_db.py`:

- Customer: Rahul Sharma (ID: 101), Priya Patel (ID: 102)
- Restaurants: Spicy Kitchen (ID: 201), Burger Palace (202), Pizza Heaven (203), Sweet Delights (204)
- Food Items: Chicken Biryani, Masala Dosa, Margherita Pizza, Classic Cheeseburger, Chocolate Lava Cake, and more (IDs: 301-310)
- Cart: Rahul's Chicken Biryani × 2 (ID: 401)
- Orders: 3 orders with various statuses (IDs: 501-503)
