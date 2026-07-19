from django.contrib import admin
from django.urls import path
from Backend import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Customer APIs
    path('customers/add/', views.customer_list_or_add, name='customer_add'),
    path('customers/', views.customer_list_or_add, name='customer_list'),
    path('customers/update/<int:id>/', views.customer_detail_update_delete, name='customer_update'),
    path('customers/delete/<int:id>/', views.customer_detail_update_delete, name='customer_delete'),
    path('customers/login/', views.customer_login, name='customer_login'),
    
    # Restaurant APIs
    path('restaurants/add/', views.restaurant_list_or_add, name='restaurant_add'),
    path('restaurants/', views.restaurant_list_or_add, name='restaurant_list'),
    path('restaurants/update/<int:id>/', views.restaurant_detail_update_delete, name='restaurant_update'),
    path('restaurants/delete/<int:id>/', views.restaurant_detail_update_delete, name='restaurant_delete'),
    path('restaurants/login/', views.restaurant_login, name='restaurant_login'),
    
    # Food APIs
    path('foods/add/', views.food_list_or_add, name='food_add'),
    path('foods/', views.food_list_or_add, name='food_list'),
    path('foods/update/<int:id>/', views.food_detail_update_delete, name='food_update'),
    path('foods/delete/<int:id>/', views.food_detail_update_delete, name='food_delete'),
    
    # Cart APIs
    path('cart/add/', views.cart_list_or_add, name='cart_add'),
    path('cart/', views.cart_list_or_add, name='cart_list'),
    path('cart/update/<int:id>/', views.cart_detail_update_delete, name='cart_update'),
    path('cart/delete/<int:id>/', views.cart_detail_update_delete, name='cart_delete'),
    
    # Order APIs
    path('orders/add/', views.order_list_or_add, name='order_add'),
    path('orders/', views.order_list_or_add, name='order_list'),
    path('orders/update/<int:id>/', views.order_detail_update_delete, name='order_update'),
    path('orders/delete/<int:id>/', views.order_detail_update_delete, name='order_delete'),
]
