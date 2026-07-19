import requests

print("=== FINAL DATA VERIFICATION ===")

r = requests.get("http://127.0.0.1:8000/customers/")
custs = r.json()
print(f"Customers: {len(custs)} records")
for c in custs:
    print(f"  [{c['customer_id']}] {c['full_name']} | {c['email']}")

r = requests.get("http://127.0.0.1:8000/restaurants/")
rests = r.json()
print(f"Restaurants: {len(rests)} records")
for rest in rests:
    print(f"  [{rest['restaurant_id']}] {rest['restaurant_name']} | {rest['cuisine']} | Rating: {rest['rating']}")

r = requests.get("http://127.0.0.1:8000/foods/")
foods = r.json()
print(f"Food Items: {len(foods)} records")
for f in foods:
    print(f"  [{f['food_id']}] {f['food_name']} | Rs.{f['price']} | {f['availability']}")

r = requests.get("http://127.0.0.1:8000/cart/")
cart = r.json()
print(f"Cart Items: {len(cart)} records")
for c in cart:
    print(f"  [{c['cart_id']}] {c['customer_name']} -> {c['food_name']} x{c['quantity']} = Rs.{c['total_price']}")

r = requests.get("http://127.0.0.1:8000/orders/")
orders = r.json()
print(f"Orders: {len(orders)} records")
for o in orders:
    print(f"  [{o['order_id']}] {o['customer_name']} -> {o['restaurant_name']} | {o['order_status']} | {o['payment_status']}")

print("=== ALL SYSTEMS OPERATIONAL ===")
