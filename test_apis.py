import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("Starting API CRUD Verification Tests...")
    
    # ------------------ 1. CUSTOMERS ------------------
    print("\n--- Testing Customers Module ---")
    
    # GET list
    r = requests.get(f"{BASE_URL}/customers/")
    assert r.status_code == 200, f"Failed GET customers: {r.status_code}"
    initial_count = len(r.json())
    print(f"GET /customers/ successful. Initial count: {initial_count}")
    
    # POST add
    new_customer = {
        "customer_id": 105,
        "full_name": "Test User",
        "email": "testuser@gmail.com",
        "phone": "1234567890",
        "address": "Test Road, City",
        "password": "testpassword"
    }
    r = requests.post(f"{BASE_URL}/customers/add/", json=new_customer)
    assert r.status_code == 201, f"Failed POST customer: {r.status_code}"
    print("POST /customers/add/ successful.")
    
    # PUT update
    updated_customer = {
        "full_name": "Updated Test User",
        "email": "testuser@gmail.com",
        "phone": "9999999999",
        "address": "Updated Address, City"
    }
    r = requests.put(f"{BASE_URL}/customers/update/105/", json=updated_customer)
    assert r.status_code == 200, f"Failed PUT customer: {r.status_code}"
    assert r.json()["customer"]["full_name"] == "Updated Test User", "Name was not updated"
    print("PUT /customers/update/105/ successful.")
    
    # DELETE delete
    r = requests.delete(f"{BASE_URL}/customers/delete/105/")
    assert r.status_code == 200, f"Failed DELETE customer: {r.status_code}"
    print("DELETE /customers/delete/105/ successful.")
    
    # Verify deletion
    r = requests.get(f"{BASE_URL}/customers/")
    assert len(r.json()) == initial_count, "Customer was not deleted"
    print("Customer CRUD Verified.")
    
    # ------------------ 2. RESTAURANTS ------------------
    print("\n--- Testing Restaurants Module ---")
    
    r = requests.get(f"{BASE_URL}/restaurants/")
    assert r.status_code == 200, f"Failed GET restaurants: {r.status_code}"
    rest_count = len(r.json())
    print(f"GET /restaurants/ successful. Count: {rest_count}")
    
    new_rest = {
        "restaurant_id": 205,
        "restaurant_name": "Test Diner",
        "owner_name": "Diner Owner",
        "cuisine": "Fast Food",
        "location": "Test City",
        "contact": "1122334455",
        "rating": 4.2
    }
    r = requests.post(f"{BASE_URL}/restaurants/add/", json=new_rest)
    assert r.status_code == 201, f"Failed POST restaurant: {r.status_code}"
    print("POST /restaurants/add/ successful.")
    
    updated_rest = {
        "restaurant_name": "Updated Test Diner",
        "rating": 4.5
    }
    r = requests.put(f"{BASE_URL}/restaurants/update/205/", json=updated_rest)
    assert r.status_code == 200, f"Failed PUT restaurant: {r.status_code}"
    assert r.json()["restaurant"]["restaurant_name"] == "Updated Test Diner", "Restaurant name was not updated"
    print("PUT /restaurants/update/205/ successful.")
    
    r = requests.delete(f"{BASE_URL}/restaurants/delete/205/")
    assert r.status_code == 200, f"Failed DELETE restaurant: {r.status_code}"
    print("DELETE /restaurants/delete/205/ successful.")
    print("Restaurant CRUD Verified.")
    
    # ------------------ 3. FOODS ------------------
    print("\n--- Testing Food Menu Module ---")
    
    r = requests.get(f"{BASE_URL}/foods/")
    assert r.status_code == 200, f"Failed GET foods: {r.status_code}"
    food_count = len(r.json())
    print(f"GET /foods/ successful. Count: {food_count}")
    
    new_food = {
        "food_id": 315,
        "food_name": "Test Salad",
        "restaurant_name": "Spicy Kitchen",
        "category": "Sides",
        "price": 120.0,
        "availability": "Available",
        "image_url": "salad.jpg"
    }
    r = requests.post(f"{BASE_URL}/foods/add/", json=new_food)
    assert r.status_code == 201, f"Failed POST food: {r.status_code}"
    print("POST /foods/add/ successful.")
    
    updated_food = {
        "food_name": "Updated Test Salad",
        "price": 130.0
    }
    r = requests.put(f"{BASE_URL}/foods/update/315/", json=updated_food)
    assert r.status_code == 200, f"Failed PUT food: {r.status_code}"
    assert r.json()["food"]["food_name"] == "Updated Test Salad", "Food name was not updated"
    print("PUT /foods/update/315/ successful.")
    
    r = requests.delete(f"{BASE_URL}/foods/delete/315/")
    assert r.status_code == 200, f"Failed DELETE food: {r.status_code}"
    print("DELETE /foods/delete/315/ successful.")
    print("Food CRUD Verified.")
    
    # ------------------ 4. SHOPPING CART ------------------
    print("\n--- Testing Shopping Cart Module ---")
    
    r = requests.get(f"{BASE_URL}/cart/")
    assert r.status_code == 200, f"Failed GET cart: {r.status_code}"
    cart_count = len(r.json())
    print(f"GET /cart/ successful. Count: {cart_count}")
    
    new_cart_item = {
        "cart_id": 415,
        "customer_name": "Rahul Sharma",
        "food_name": "Classic Cheeseburger",
        "quantity": 1,
        "price": 180.0
    }
    r = requests.post(f"{BASE_URL}/cart/add/", json=new_cart_item)
    assert r.status_code == 201 or r.status_code == 200, f"Failed POST cart item: {r.status_code}"
    print("POST /cart/add/ successful.")
    
    # Find cart_id (in case of updates/auto-increments)
    cart_items = requests.get(f"{BASE_URL}/cart/?customer_name=Rahul Sharma").json()
    test_cart_item = next((item for item in cart_items if item["food_name"] == "Classic Cheeseburger"), None)
    assert test_cart_item is not None, "Cart item not found"
    cid = test_cart_item["cart_id"]
    
    r = requests.put(f"{BASE_URL}/cart/update/{cid}/", json={"quantity": 3})
    assert r.status_code == 200, f"Failed PUT cart item: {r.status_code}"
    assert r.json()["cart"]["quantity"] == 3, "Cart quantity was not updated"
    print(f"PUT /cart/update/{cid}/ successful.")
    
    r = requests.delete(f"{BASE_URL}/cart/delete/{cid}/")
    assert r.status_code == 200, f"Failed DELETE cart item: {r.status_code}"
    print(f"DELETE /cart/delete/{cid}/ successful.")
    print("Shopping Cart CRUD Verified.")
    
    # ------------------ 5. ORDERS ------------------
    print("\n--- Testing Orders Module ---")
    
    r = requests.get(f"{BASE_URL}/orders/")
    assert r.status_code == 200, f"Failed GET orders: {r.status_code}"
    order_count = len(r.json())
    print(f"GET /orders/ successful. Count: {order_count}")
    
    new_order = {
        "order_id": 515,
        "customer_name": "Rahul Sharma",
        "restaurant_name": "Spicy Kitchen",
        "total_amount": 450.0,
        "payment_method": "UPI",
        "payment_status": "Paid",
        "order_status": "Order Placed"
    }
    r = requests.post(f"{BASE_URL}/orders/add/", json=new_order)
    assert r.status_code == 201, f"Failed POST order: {r.status_code}"
    print("POST /orders/add/ successful.")
    
    r = requests.put(f"{BASE_URL}/orders/update/515/", json={"order_status": "Preparing"})
    assert r.status_code == 200, f"Failed PUT order: {r.status_code}"
    assert r.json()["order"]["order_status"] == "Preparing", "Order status was not updated"
    print("PUT /orders/update/515/ successful.")
    
    r = requests.delete(f"{BASE_URL}/orders/delete/515/")
    assert r.status_code == 200, f"Failed DELETE order: {r.status_code}"
    print("DELETE /orders/delete/515/ successful.")
    print("Orders CRUD Verified.")
    
    print("\n=========================================")
    print("All 20 CRUD APIs tested and verified successfully!")
    print("=========================================")

if __name__ == "__main__":
    try:
        run_tests()
    except AssertionError as e:
        print(f"Test Assert Failed: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected Error: {e}", file=sys.stderr)
        sys.exit(1)
