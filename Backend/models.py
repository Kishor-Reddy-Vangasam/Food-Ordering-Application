from django.db import models

class Customer(models.Model):
    customer_id = models.IntegerField(primary_key=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    password = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.customer_id:
            max_id = Customer.objects.aggregate(models.Max('customer_id'))['customer_id__max']
            self.customer_id = max(max_id or 100, 100) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name

class Restaurant(models.Model):
    restaurant_id = models.IntegerField(primary_key=True)
    restaurant_name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    cuisine = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    contact = models.CharField(max_length=20)
    rating = models.FloatField()

    def save(self, *args, **kwargs):
        if not self.restaurant_id:
            max_id = Restaurant.objects.aggregate(models.Max('restaurant_id'))['restaurant_id__max']
            self.restaurant_id = max(max_id or 200, 200) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.restaurant_name

class Food(models.Model):
    food_id = models.IntegerField(primary_key=True)
    food_name = models.CharField(max_length=255)
    restaurant_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    price = models.FloatField()
    availability = models.CharField(max_length=50, default="Available") # "Available", "Out of Stock"
    image_url = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if not self.food_id:
            max_id = Food.objects.aggregate(models.Max('food_id'))['food_id__max']
            self.food_id = max(max_id or 300, 300) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.food_name

class CartItem(models.Model):
    cart_id = models.IntegerField(primary_key=True)
    customer_name = models.CharField(max_length=255)
    food_name = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    price = models.FloatField()
    total_price = models.FloatField()

    def save(self, *args, **kwargs):
        self.total_price = self.price * self.quantity
        if not self.cart_id:
            max_id = CartItem.objects.aggregate(models.Max('cart_id'))['cart_id__max']
            self.cart_id = max(max_id or 400, 400) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer_name} - {self.food_name}"

class Order(models.Model):
    order_id = models.IntegerField(primary_key=True)
    customer_name = models.CharField(max_length=255)
    restaurant_name = models.CharField(max_length=255)
    order_date = models.DateField(auto_now_add=True)
    total_amount = models.FloatField()
    payment_method = models.CharField(max_length=50) # "UPI", "Credit Card", "Debit Card", "Cash on Delivery"
    payment_status = models.CharField(max_length=50, default="Pending") # "Pending", "Paid", "Failed"
    order_status = models.CharField(max_length=50, default="Order Placed") # "Order Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"

    def save(self, *args, **kwargs):
        if not self.order_id:
            max_id = Order.objects.aggregate(models.Max('order_id'))['order_id__max']
            self.order_id = max(max_id or 500, 500) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_id} by {self.customer_name}"
