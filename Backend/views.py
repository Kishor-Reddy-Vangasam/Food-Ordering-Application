import json
from datetime import datetime
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Customer, Restaurant, Food, CartItem, Order

# Helper Serializers
def customer_to_dict(c):
    return {
        'customer_id': c.customer_id,
        'full_name': c.full_name,
        'email': c.email,
        'phone': c.phone,
        'address': c.address,
        'password': c.password
    }

def restaurant_to_dict(r):
    return {
        'restaurant_id': r.restaurant_id,
        'restaurant_name': r.restaurant_name,
        'owner_name': r.owner_name,
        'cuisine': r.cuisine,
        'location': r.location,
        'contact': r.contact,
        'rating': r.rating
    }

def food_to_dict(f):
    return {
        'food_id': f.food_id,
        'food_name': f.food_name,
        'restaurant_name': f.restaurant_name,
        'category': f.category,
        'price': f.price,
        'availability': f.availability,
        'image_url': f.image_url
    }

def cart_to_dict(c):
    return {
        'cart_id': c.cart_id,
        'customer_name': c.customer_name,
        'food_name': c.food_name,
        'quantity': c.quantity,
        'price': c.price,
        'total_price': c.total_price
    }

def order_to_dict(o):
    return {
        'order_id': o.order_id,
        'customer_name': o.customer_name,
        'restaurant_name': o.restaurant_name,
        'order_date': o.order_date.strftime('%Y-%m-%d') if hasattr(o.order_date, 'strftime') else str(o.order_date),
        'total_amount': o.total_amount,
        'payment_method': o.payment_method,
        'payment_status': o.payment_status,
        'order_status': o.order_status
    }

# ================= CUSTOMER MANAGEMENT =================

@csrf_exempt
def customer_list_or_add(request):
    if request.method == 'GET':
        customers = Customer.objects.all()
        return JsonResponse([customer_to_dict(c) for c in customers], safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Support optional customer_id in case it is manually supplied
            cust_id = data.get('customer_id')
            customer = Customer(
                full_name=data.get('full_name'),
                email=data.get('email'),
                phone=data.get('phone'),
                address=data.get('address'),
                password=data.get('password')
            )
            if cust_id:
                customer.customer_id = int(cust_id)
            customer.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Customer registered successfully',
                'customer': customer_to_dict(customer)
            }, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def customer_detail_update_delete(request, id):
    customer = get_object_or_404(Customer, customer_id=id)
    
    if request.method == 'GET':
        return JsonResponse(customer_to_dict(customer))
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            customer.full_name = data.get('full_name', customer.full_name)
            customer.email = data.get('email', customer.email)
            customer.phone = data.get('phone', customer.phone)
            customer.address = data.get('address', customer.address)
            if 'password' in data:
                customer.password = data.get('password')
            customer.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Customer updated successfully',
                'customer': customer_to_dict(customer)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        customer.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Customer deleted successfully'
        })
        
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def customer_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            try:
                customer = Customer.objects.get(email=email, password=password)
                return JsonResponse({
                    'status': 'success',
                    'message': 'Login successful',
                    'role': 'customer',
                    'user': customer_to_dict(customer)
                })
            except Customer.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Invalid email or password'}, status=401)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)


# ================= RESTAURANT MANAGEMENT =================

@csrf_exempt
def restaurant_list_or_add(request):
    if request.method == 'GET':
        restaurants = Restaurant.objects.all()
        return JsonResponse([restaurant_to_dict(r) for r in restaurants], safe=False)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            rest_id = data.get('restaurant_id')
            restaurant = Restaurant(
                restaurant_name=data.get('restaurant_name'),
                owner_name=data.get('owner_name'),
                cuisine=data.get('cuisine'),
                location=data.get('location'),
                contact=data.get('contact'),
                rating=float(data.get('rating', 4.0))
            )
            if rest_id:
                restaurant.restaurant_id = int(rest_id)
            restaurant.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Restaurant registered successfully',
                'restaurant': restaurant_to_dict(restaurant)
            }, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def restaurant_detail_update_delete(request, id):
    restaurant = get_object_or_404(Restaurant, restaurant_id=id)
    
    if request.method == 'GET':
        return JsonResponse(restaurant_to_dict(restaurant))
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            restaurant.restaurant_name = data.get('restaurant_name', restaurant.restaurant_name)
            restaurant.owner_name = data.get('owner_name', restaurant.owner_name)
            restaurant.cuisine = data.get('cuisine', restaurant.cuisine)
            restaurant.location = data.get('location', restaurant.location)
            restaurant.contact = data.get('contact', restaurant.contact)
            restaurant.rating = float(data.get('rating', restaurant.rating))
            restaurant.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Restaurant updated successfully',
                'restaurant': restaurant_to_dict(restaurant)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        restaurant.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Restaurant deleted successfully'
        })
        
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def restaurant_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            owner_name = data.get('owner_name')
            contact = data.get('contact')
            try:
                # Owners can log in matching owner_name and contact
                restaurant = Restaurant.objects.filter(owner_name=owner_name, contact=contact).first()
                if restaurant:
                    return JsonResponse({
                        'status': 'success',
                        'message': 'Restaurant login successful',
                        'role': 'restaurant',
                        'user': restaurant_to_dict(restaurant)
                    })
                else:
                    return JsonResponse({'status': 'error', 'message': 'Invalid Owner Name or Contact details'}, status=401)
            except Exception as e:
                return JsonResponse({'status': 'error', 'message': str(e)}, status=401)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)


# ================= FOOD MENU MANAGEMENT =================

@csrf_exempt
def food_list_or_add(request):
    if request.method == 'GET':
        restaurant_name = request.GET.get('restaurant_name')
        category = request.GET.get('category')
        foods = Food.objects.all()
        if restaurant_name:
            foods = foods.filter(restaurant_name__iexact=restaurant_name)
        if category:
            foods = foods.filter(category__iexact=category)
        return JsonResponse([food_to_dict(f) for f in foods], safe=False)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            food_id = data.get('food_id')
            food = Food(
                food_name=data.get('food_name'),
                restaurant_name=data.get('restaurant_name'),
                category=data.get('category'),
                price=float(data.get('price')),
                availability=data.get('availability', 'Available'),
                image_url=data.get('image_url', '')
            )
            if food_id:
                food.food_id = int(food_id)
            food.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Food item added successfully',
                'food': food_to_dict(food)
            }, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def food_detail_update_delete(request, id):
    food = get_object_or_404(Food, food_id=id)
    
    if request.method == 'GET':
        return JsonResponse(food_to_dict(food))
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            food.food_name = data.get('food_name', food.food_name)
            food.restaurant_name = data.get('restaurant_name', food.restaurant_name)
            food.category = data.get('category', food.category)
            food.price = float(data.get('price', food.price))
            food.availability = data.get('availability', food.availability)
            food.image_url = data.get('image_url', food.image_url)
            food.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Food item updated successfully',
                'food': food_to_dict(food)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        food.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Food item deleted successfully'
        })
        
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)


# ================= SHOPPING CART MANAGEMENT =================

@csrf_exempt
def cart_list_or_add(request):
    if request.method == 'GET':
        customer_name = request.GET.get('customer_name')
        cart_items = CartItem.objects.all()
        if customer_name:
            cart_items = cart_items.filter(customer_name__iexact=customer_name)
        return JsonResponse([cart_to_dict(c) for c in cart_items], safe=False)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            cart_id = data.get('cart_id')
            customer_name = data.get('customer_name')
            food_name = data.get('food_name')
            quantity = int(data.get('quantity', 1))
            price = float(data.get('price'))
            
            # Check if this item is already in the cart for this customer
            existing_item = CartItem.objects.filter(customer_name=customer_name, food_name=food_name).first()
            if existing_item:
                existing_item.quantity += quantity
                existing_item.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'Cart item quantity updated',
                    'cart': cart_to_dict(existing_item)
                })
            else:
                cart_item = CartItem(
                    customer_name=customer_name,
                    food_name=food_name,
                    quantity=quantity,
                    price=price
                )
                if cart_id:
                    cart_item.cart_id = int(cart_id)
                cart_item.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'Item added to cart successfully',
                    'cart': cart_to_dict(cart_item)
                }, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def cart_detail_update_delete(request, id):
    cart_item = get_object_or_404(CartItem, cart_id=id)
    
    if request.method == 'GET':
        return JsonResponse(cart_to_dict(cart_item))
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            cart_item.quantity = int(data.get('quantity', cart_item.quantity))
            cart_item.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Cart item updated successfully',
                'cart': cart_to_dict(cart_item)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        cart_item.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Cart item removed successfully'
        })
        
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)


# ================= ORDER MANAGEMENT =================

@csrf_exempt
def order_list_or_add(request):
    if request.method == 'GET':
        customer_name = request.GET.get('customer_name')
        restaurant_name = request.GET.get('restaurant_name')
        orders = Order.objects.all()
        if customer_name:
            orders = orders.filter(customer_name__iexact=customer_name)
        if restaurant_name:
            orders = orders.filter(restaurant_name__iexact=restaurant_name)
        return JsonResponse([order_to_dict(o) for o in orders], safe=False)
        
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            order_id = data.get('order_id')
            
            # Format order date
            date_str = data.get('order_date')
            if date_str:
                try:
                    order_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    order_date = datetime.now().date()
            else:
                order_date = datetime.now().date()
                
            order = Order(
                customer_name=data.get('customer_name'),
                restaurant_name=data.get('restaurant_name'),
                order_date=order_date,
                total_amount=float(data.get('total_amount')),
                payment_method=data.get('payment_method'),
                payment_status=data.get('payment_status', 'Pending'),
                order_status=data.get('order_status', 'Order Placed')
            )
            if order_id:
                order.order_id = int(order_id)
            order.save()
            
            # Proactively clear shopping cart items for this customer upon order placement
            cust_name = data.get('customer_name')
            if cust_name:
                CartItem.objects.filter(customer_name=cust_name).delete()
                
            return JsonResponse({
                'status': 'success',
                'message': 'Order placed successfully',
                'order': order_to_dict(order)
            }, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)

@csrf_exempt
def order_detail_update_delete(request, id):
    order = get_object_or_404(Order, order_id=id)
    
    if request.method == 'GET':
        return JsonResponse(order_to_dict(order))
        
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            order.customer_name = data.get('customer_name', order.customer_name)
            order.restaurant_name = data.get('restaurant_name', order.restaurant_name)
            order.total_amount = float(data.get('total_amount', order.total_amount))
            order.payment_method = data.get('payment_method', order.payment_method)
            order.payment_status = data.get('payment_status', order.payment_status)
            order.order_status = data.get('order_status', order.order_status)
            order.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Order updated successfully',
                'order': order_to_dict(order)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    elif request.method == 'DELETE':
        order.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Order deleted successfully'
        })
        
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=455)
