import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from Backend.models import Customer, Restaurant, Food, CartItem, Order
from datetime import datetime

def seed():
    print("Seeding database...")
    
    # 1. Clear existing data
    Customer.objects.all().delete()
    Restaurant.objects.all().delete()
    Food.objects.all().delete()
    CartItem.objects.all().delete()
    Order.objects.all().delete()
    
    # 2. Add Customers
    c1 = Customer.objects.create(
        customer_id=101,
        full_name="Rahul Sharma",
        email="rahul@gmail.com",
        phone="9876543210",
        address="Hyderabad",
        password="rahul123"
    )
    c2 = Customer.objects.create(
        customer_id=102,
        full_name="Priya Patel",
        email="priya@gmail.com",
        phone="9876543211",
        address="Mumbai",
        password="priya123"
    )
    print("Customers seeded.")

    # 3. Add Restaurants
    r1 = Restaurant.objects.create(
        restaurant_id=201,
        restaurant_name="Spicy Kitchen",
        owner_name="Anil Kumar",
        cuisine="South Indian",
        location="Hyderabad",
        contact="9876501234",
        rating=4.7
    )
    r2 = Restaurant.objects.create(
        restaurant_id=202,
        restaurant_name="Burger Palace",
        owner_name="John Doe",
        cuisine="American",
        location="Mumbai",
        contact="9876505678",
        rating=4.5
    )
    r3 = Restaurant.objects.create(
        restaurant_id=203,
        restaurant_name="Pizza Heaven",
        owner_name="Mario Rossi",
        cuisine="Italian",
        location="Delhi",
        contact="9876509999",
        rating=4.8
    )
    r4 = Restaurant.objects.create(
        restaurant_id=204,
        restaurant_name="Sweet Delights",
        owner_name="Sita Devi",
        cuisine="Desserts",
        location="Bangalore",
        contact="9876507777",
        rating=4.6
    )
    print("Restaurants seeded.")

    # 4. Add Food Items
    # Spicy Kitchen
    Food.objects.create(
        food_id=301,
        food_name="Chicken Biryani",
        restaurant_name="Spicy Kitchen",
        category="Main Course",
        price=299.0,
        availability="Available",
        image_url="biryani.jpg"
    )
    Food.objects.create(
        food_id=302,
        food_name="Masala Dosa",
        restaurant_name="Spicy Kitchen",
        category="Breakfast",
        price=120.0,
        availability="Available",
        image_url="dosa.jpg"
    )
    Food.objects.create(
        food_id=303,
        food_name="Idli Sambar",
        restaurant_name="Spicy Kitchen",
        category="Breakfast",
        price=80.0,
        availability="Available",
        image_url="idli.jpg"
    )
    
    # Burger Palace
    Food.objects.create(
        food_id=304,
        food_name="Classic Cheeseburger",
        restaurant_name="Burger Palace",
        category="Fast Food",
        price=180.0,
        availability="Available",
        image_url="burger.jpg"
    )
    Food.objects.create(
        food_id=305,
        food_name="French Fries",
        restaurant_name="Burger Palace",
        category="Sides",
        price=90.0,
        availability="Available",
        image_url="fries.jpg"
    )
    Food.objects.create(
        food_id=306,
        food_name="Vanilla Milkshake",
        restaurant_name="Burger Palace",
        category="Beverages",
        price=110.0,
        availability="Out of Stock",
        image_url="shake.jpg"
    )
    
    # Pizza Heaven
    Food.objects.create(
        food_id=307,
        food_name="Margherita Pizza",
        restaurant_name="Pizza Heaven",
        category="Main Course",
        price=350.0,
        availability="Available",
        image_url="pizza.jpg"
    )
    Food.objects.create(
        food_id=308,
        food_name="Garlic Bread",
        restaurant_name="Pizza Heaven",
        category="Sides",
        price=140.0,
        availability="Available",
        image_url="garlic_bread.jpg"
    )
    
    # Sweet Delights
    Food.objects.create(
        food_id=309,
        food_name="Chocolate Lava Cake",
        restaurant_name="Sweet Delights",
        category="Dessert",
        price=150.0,
        availability="Available",
        image_url="lava_cake.jpg"
    )
    Food.objects.create(
        food_id=310,
        food_name="Gulab Jamun",
        restaurant_name="Sweet Delights",
        category="Dessert",
        price=60.0,
        availability="Available",
        image_url="gulab_jamun.jpg"
    )
    print("Food items seeded.")

    # 5. Add Cart Items
    CartItem.objects.create(
        cart_id=401,
        customer_name="Rahul Sharma",
        food_name="Chicken Biryani",
        quantity=2,
        price=299.0,
        total_price=598.0
    )
    print("Cart seeded.")

    # 6. Add Orders
    Order.objects.create(
        order_id=501,
        customer_name="Rahul Sharma",
        restaurant_name="Spicy Kitchen",
        order_date=datetime.strptime("2026-07-15", "%Y-%m-%d").date(),
        total_amount=598.0,
        payment_method="UPI",
        payment_status="Paid",
        order_status="Preparing"
    )
    Order.objects.create(
        order_id=502,
        customer_name="Rahul Sharma",
        restaurant_name="Spicy Kitchen",
        order_date=datetime.strptime("2026-07-10", "%Y-%m-%d").date(),
        total_amount=120.0,
        payment_method="UPI",
        payment_status="Paid",
        order_status="Delivered"
    )
    Order.objects.create(
        order_id=503,
        customer_name="Priya Patel",
        restaurant_name="Pizza Heaven",
        order_date=datetime.strptime("2026-07-16", "%Y-%m-%d").date(),
        total_amount=490.0,
        payment_method="Credit Card",
        payment_status="Paid",
        order_status="Order Placed"
    )
    print("Orders seeded.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
