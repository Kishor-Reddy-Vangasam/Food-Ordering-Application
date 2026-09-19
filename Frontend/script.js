// API Base URL - Configured to point to the Django Backend


const API_BASE = 'https://food-ordering-application-bkkn.onrender.com';





// ==========================================


// IMAGE HELPERS


// ==========================================





// Prefix for all local food/restaurant images


const IMG = 'images/';





// Food image map: DB image_url → local real-photo file


const FOOD_IMAGE_MAP = {


    'biryani.jpg':      IMG + 'biryani.jpg',


    'dosa.jpg':         IMG + 'dosa.jpg',


    'idli.jpg':         IMG + 'idli.jpg',


    'burger.jpg':       IMG + 'burger.jpg',


    'fries.jpg':        IMG + 'fries.jpg',


    'shake.jpg':        IMG + 'shake.jpg',


    'pizza.jpg':        IMG + 'pizza.jpg',


    'garlic_bread.jpg': IMG + 'garlic_bread.jpg',


    'lava_cake.jpg':    IMG + 'lava_cake.jpg',


    'gulab_jamun.jpg':  'gulab_jamun.svg',   // accurate SVG illustration


};





// Fallback image shown when an img src fails to load


const FALLBACK_IMG = IMG + 'biryani.jpg';





/**


 * Returns the correct image src for a food item.


 * First tries direct DB filename lookup, then keyword match on food name.


 */


function getFoodImage(imageUrl, foodName) {


    if (imageUrl && FOOD_IMAGE_MAP[imageUrl]) return FOOD_IMAGE_MAP[imageUrl];


    const key = ((imageUrl || '') + ' ' + (foodName || '')).toLowerCase();


    if (key.includes('biryani'))                        return IMG + 'biryani.jpg';


    if (key.includes('dosa'))                           return IMG + 'dosa.jpg';


    if (key.includes('idli'))                           return IMG + 'idli.jpg';


    if (key.includes('burger') || key.includes('cheese')) return IMG + 'burger.jpg';


    if (key.includes('fries') || key.includes('french')) return IMG + 'fries.jpg';


    if (key.includes('shake') || key.includes('milk'))  return IMG + 'shake.jpg';


    if (key.includes('pizza'))                          return IMG + 'pizza.jpg';


    if (key.includes('garlic') || key.includes('bread')) return IMG + 'garlic_bread.jpg';


    if (key.includes('lava') || key.includes('cake') || key.includes('chocolate')) return IMG + 'lava_cake.jpg';


    if (key.includes('gulab') || key.includes('jamun')) return 'gulab_jamun.svg';


    return FALLBACK_IMG;


}





/**


 * Returns a real restaurant interior photo based on cuisine type.


 */


function getRestaurantImage(cuisine) {


    const c = (cuisine || '').toLowerCase();


    if (c.includes('italian') || c.includes('pizza'))                        return IMG + 'restaurant_italian.jpg';


    if (c.includes('american') || c.includes('burger') || c.includes('fast')) return IMG + 'restaurant_american.jpg';


    if (c.includes('dessert') || c.includes('sweet') || c.includes('bakery')) return IMG + 'restaurant_dessert.jpg';


    return IMG + 'restaurant_indian.jpg';


}





/**


 * Attach onerror fallback to an img element so broken images never show.


 * Call this after setting img.src in JS, or add onerror inline in template strings.


 */


function imgFallback(img) {


    img.onerror = function() { this.onerror = null; this.src = FALLBACK_IMG; };


}





// Global state


let currentUser = null;


let currentRole = null; // 'customer', 'restaurant', 'admin'





// Parse current user from LocalStorage


try {


    const userStr = localStorage.getItem('food_app_user');


    const roleStr = localStorage.getItem('food_app_role');


    if (userStr && roleStr) {


        currentUser = JSON.parse(userStr);


        currentRole = roleStr;


    }


} catch (e) {


    console.error("Error parsing user session", e);


}





// Check auth requirements


function checkAuth() {


    const path = window.location.pathname.toLowerCase();


    const customerPages = ['cart.html', 'checkout.html', 'customer_dashboard.html'];


    const restaurantPages = ['restaurant_dashboard.html'];


    const adminPages = ['admin_dashboard.html'];


    


    const isCustomerPage = customerPages.some(p => path.includes(p));


    const isRestaurantPage = restaurantPages.some(p => path.includes(p));


    const isAdminPage = adminPages.some(p => path.includes(p));


    


    if ((isCustomerPage && currentRole !== 'customer') ||


        (isRestaurantPage && currentRole !== 'restaurant') ||


        (isAdminPage && currentRole !== 'admin')) {


        showToast("Please log in to access this page", "error");


        setTimeout(() => {


            window.location.href = 'login.html';


        }, 1500);


        return false;


    }


    return true;


}





// Toast notification helper


function showToast(message, type = 'info') {


    let container = document.getElementById('toast-container');


    if (!container) {


        container = document.createElement('div');


        container.id = 'toast-container';


        container.className = 'toast-container';


        document.body.appendChild(container);


    }


    


    const toast = document.createElement('div');


    toast.className = `toast toast-${type} glass`;


    toast.innerText = message;


    


    container.appendChild(toast);


    


    setTimeout(() => {


        toast.style.animation = 'slideIn 0.3s ease reverse forwards';


        setTimeout(() => toast.remove(), 300);


    }, 3000);


}





// Dynamic Navbar & Footer Rendering


function renderNavbarAndFooter() {


    const header = document.querySelector('header');


    if (header) {


        let navHtml = `


            <nav class="navbar glass">


                <a href="index.html" class="logo">


                    🍕 Food<span>Pulse</span>


                </a>


                <ul class="nav-links">


                    <li><a href="index.html">Home</a></li>


                    <li><a href="restaurants.html">Restaurants</a></li>


                    <li><a href="orders.html">Track Orders</a></li>


        `;


        


        // Add dashboard link based on role


        if (currentRole === 'customer') {


            navHtml += `


                <li><a href="customer_dashboard.html">My Dashboard</a></li>


                <li><a href="cart.html">Cart <span id="nav-cart-count" class="badge-status status-pending" style="border-radius: 50%; padding: 2px 6px;">0</span></a></li>


            `;


        } else if (currentRole === 'restaurant') {


            navHtml += `<li><a href="restaurant_dashboard.html">Manager Panel</a></li>`;


        } else if (currentRole === 'admin') {


            navHtml += `<li><a href="admin_dashboard.html">Admin Console</a></li>`;


        }


        


        navHtml += `


                </ul>


                <div class="nav-buttons">


        `;


        


        if (currentUser) {


            const displayName = currentRole === 'customer' ? currentUser.full_name : 


                                currentRole === 'restaurant' ? currentUser.restaurant_name : "Admin";


            navHtml += `


                <span style="font-weight: 600; color: var(--text-primary);">Hello, ${displayName}</span>


                <button onclick="handleLogout()" class="btn btn-secondary btn-sm">Logout</button>


            `;


        } else {


            navHtml += `


                <a href="login.html" class="btn btn-secondary btn-sm">Login</a>


                <a href="register.html" class="btn btn-primary btn-sm">Register</a>


            `;


        }


        


        navHtml += `


                </div>


            </nav>


        `;


        header.innerHTML = navHtml;


        


        // Load initial cart count for badge if user is customer


        if (currentRole === 'customer') {


            updateNavbarCartCount();


        }


    }


    


    const footer = document.querySelector('footer');


    if (footer) {


        footer.innerHTML = `<p>&copy; 2026 FoodPulse Application. Built with Django and vanilla JS. Elegant Dark Theme.</p>`;


    }


}





function handleLogout() {


    localStorage.removeItem('food_app_user');


    localStorage.removeItem('food_app_role');


    showToast("Logged out successfully", "success");


    setTimeout(() => {


        window.location.href = 'index.html';


    }, 1000);


}





async function updateNavbarCartCount() {


    const badge = document.getElementById('nav-cart-count');


    if (!badge || !currentUser) return;


    try {


        const res = await fetch(`${API_BASE}/cart/?customer_name=${encodeURIComponent(currentUser.full_name)}`);


        if (res.ok) {


            const items = await res.json();


            const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);


            badge.innerText = totalQty;


        }


    } catch (e) {


        console.error("Error updating cart badge", e);


    }


}





// Global initialization router


document.addEventListener('DOMContentLoaded', () => {


    renderNavbarAndFooter();


    if (!checkAuth()) return;


    


    const path = window.location.pathname.toLowerCase();


    


    if (path.includes('index.html') || path.endsWith('/')) {


        initHomePage();


    } else if (path.includes('login.html')) {


        initLoginPage();


    } else if (path.includes('register.html')) {


        initRegisterPage();


    } else if (path.includes('restaurants.html')) {


        initRestaurantsPage();


    } else if (path.includes('menu.html')) {


        initMenuPage();


    } else if (path.includes('cart.html')) {


        initCartPage();


    } else if (path.includes('checkout.html')) {


        initCheckoutPage();


    } else if (path.includes('orders.html')) {


        initOrdersPage();


    } else if (path.includes('customer_dashboard.html')) {


        initCustomerDashboard();


    } else if (path.includes('restaurant_dashboard.html')) {


        initRestaurantDashboard();


    } else if (path.includes('admin_dashboard.html')) {


        initAdminDashboard();


    }


});





// ==========================================


// 1. HOME PAGE INITIALIZATION (index.html)


// ==========================================


async function initHomePage() {


    const restGrid = document.getElementById('featured-restaurants');


    const foodGrid = document.getElementById('popular-foods');


    const searchBtn = document.getElementById('home-search-btn');


    const searchInput = document.getElementById('home-search-input');


    


    // Set up search bar redirect


    if (searchBtn && searchInput) {


        const triggerSearch = () => {


            const q = searchInput.value.trim();


            if (q) {


                window.location.href = `restaurants.html?search=${encodeURIComponent(q)}`;


            }


        };


        searchBtn.addEventListener('click', triggerSearch);


        searchInput.addEventListener('keypress', (e) => {


            if (e.key === 'Enter') triggerSearch();


        });


    }


    


    // Render featured restaurants (top 3 based on rating)


    if (restGrid) {


        try {


            const res = await fetch(`${API_BASE}/restaurants/`);


            if (res.ok) {


                let restaurants = await res.json();


                // Sort by rating descending and slice top 3


                restaurants.sort((a, b) => b.rating - a.rating);


                const featured = restaurants.slice(0, 3);


                


                if (featured.length === 0) {


                    restGrid.innerHTML = `<div class="glass" style="padding:2rem; width:100%; text-align:center; color:var(--text-secondary);">No restaurants registered yet.</div>`;


                } else {


                    restGrid.innerHTML = featured.map(r => `


                        <div class="card-restaurant glass">


                            <div class="card-image">


                                <img src="${getRestaurantImage(r.cuisine)}" alt="${r.restaurant_name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">


                                <div class="card-badge">${r.cuisine}</div>


                            </div>


                            <div class="card-body">


                                <h3 class="card-title">${r.restaurant_name}</h3>


                                <p class="card-cuisine">📍 ${r.location} | Owner: ${r.owner_name}</p>


                                <div class="card-meta">


                                    <div class="rating">⭐ ${r.rating.toFixed(1)}</div>


                                    <a href="menu.html?restaurant=${encodeURIComponent(r.restaurant_name)}" class="btn btn-primary btn-sm">View Menu</a>


                                </div>


                            </div>


                        </div>


                    `).join('');


                }


            }


        } catch (e) {


            console.error("Error loading home restaurants", e);


            restGrid.innerHTML = `<p style="color:var(--error);">Failed to load restaurants.</p>`;


        }


    }


    


    // Render popular food items (top 4)


    if (foodGrid) {


        try {


            const res = await fetch(`${API_BASE}/foods/`);


            if (res.ok) {


                const foods = await res.json();


                const popular = foods.slice(0, 4);


                


                if (popular.length === 0) {


                    foodGrid.innerHTML = `<div class="glass" style="padding:2rem; width:100%; text-align:center; color:var(--text-secondary);">No food items available.</div>`;


                } else {


                    foodGrid.innerHTML = popular.map(f => `


                        <div class="card-food glass">


                            <div class="card-image" style="height:150px;">


                                <img src="${getFoodImage(f.image_url, f.food_name)}" alt="${f.food_name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">


                                <span class="food-badge ${f.availability === 'Available' ? '' : 'out-of-stock'}">${f.availability}</span>


                            </div>


                            <div class="card-body" style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">


                                <div>


                                    <p class="food-restaurant">${f.restaurant_name}</p>


                                    <h3 class="card-title" style="font-size:1.15rem; margin-bottom:0.25rem;">${f.food_name}</h3>


                                    <p class="card-cuisine" style="margin-bottom:0.5rem; font-size:0.8rem; background:rgba(255,255,255,0.05); width:fit-content; padding:2px 8px; border-radius:50px;">${f.category}</p>


                                </div>


                                <div class="card-meta" style="border:none; padding:0;">


                                    <span class="food-price">₹${f.price}</span>


                                    <button onclick="handleAddToCart('${f.food_name}', ${f.price})" class="btn btn-primary btn-sm" ${f.availability === 'Available' ? '' : 'disabled style="background:var(--text-muted); box-shadow:none; cursor:not-allowed;"'}>Add to Cart</button>


                                </div>


                            </div>


                        </div>


                    `).join('');


                }


            }


        } catch (e) {


            console.error("Error loading home foods", e);


            foodGrid.innerHTML = `<p style="color:var(--error);">Failed to load food items.</p>`;


        }


    }


}





// Add to Cart Action


async function handleAddToCart(foodName, price) {


    if (!currentUser || currentRole !== 'customer') {


        showToast("Please log in as a Customer to add items to your cart", "error");


        setTimeout(() => { window.location.href = 'login.html'; }, 1500);


        return;


    }


    


    try {


        const res = await fetch(`${API_BASE}/cart/add/`, {


            method: 'POST',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({


                customer_name: currentUser.full_name,


                food_name: foodName,


                quantity: 1,


                price: price


            })


        });


        


        if (res.ok) {


            const data = await res.json();


            showToast(data.message || "Item added to cart!", "success");


            updateNavbarCartCount();


        } else {


            const err = await res.json();


            showToast(err.message || "Failed to add to cart", "error");


        }


    } catch (e) {


        console.error("Error adding to cart", e);


        showToast("Network error. Try again.", "error");


    }


}





// ==========================================


// 2. LOGIN PAGE INITIALIZATION (login.html)


// ==========================================


function initLoginPage() {


    const form = document.getElementById('login-form');


    if (!form) return;


    


    form.addEventListener('submit', async (e) => {


        e.preventDefault();


        const role = document.getElementById('login-role').value;


        const email = document.getElementById('login-email').value.trim();


        const password = document.getElementById('login-password').value;


        


        // Admin Mock Login


        if (role === 'admin') {


            if (email === 'admin@foodpulse.com' && password === 'admin123') {


                localStorage.setItem('food_app_user', JSON.stringify({ full_name: 'System Admin', email: 'admin@foodpulse.com' }));


                localStorage.setItem('food_app_role', 'admin');


                showToast("Admin login successful", "success");


                setTimeout(() => { window.location.href = 'admin_dashboard.html'; }, 1000);


            } else {


                showToast("Invalid admin credentials. Use admin@foodpulse.com / admin123", "error");


            }


            return;


        }


        


        // Customer login


        if (role === 'customer') {


            try {


                const res = await fetch(`${API_BASE}/customers/login/`, {


                    method: 'POST',


                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ email, password })


                });


                


                if (res.ok) {


                    const data = await res.json();


                    localStorage.setItem('food_app_user', JSON.stringify(data.user));


                    localStorage.setItem('food_app_role', 'customer');


                    showToast("Login successful!", "success");


                    setTimeout(() => { window.location.href = 'index.html'; }, 1000);


                } else {


                    const err = await res.json();


                    showToast(err.message || "Invalid credentials", "error");


                }


            } catch (err) {


                console.error(err);


                showToast("Server connection failed", "error");


            }


        }


        


        // Restaurant owner login


        if (role === 'restaurant') {


            try {


                // To authenticate a restaurant, the owner provides owner_name (as email/username) and contact (as password)


                const res = await fetch(`${API_BASE}/restaurants/login/`, {


                    method: 'POST',


                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({ owner_name: email, contact: password })


                });


                


                if (res.ok) {


                    const data = await res.json();


                    localStorage.setItem('food_app_user', JSON.stringify(data.user));


                    localStorage.setItem('food_app_role', 'restaurant');


                    showToast("Restaurant login successful!", "success");


                    setTimeout(() => { window.location.href = 'restaurant_dashboard.html'; }, 1000);


                } else {


                    const err = await res.json();


                    showToast(err.message || "Invalid Owner Name or Contact details", "error");


                }


            } catch (err) {


                console.error(err);


                showToast("Server connection failed", "error");


            }


        }


    });


}





// ==========================================


// 3. REGISTER PAGE INITIALIZATION (register.html)


// ==========================================


function initRegisterPage() {


    const form = document.getElementById('register-form');


    if (!form) return;


    


    form.addEventListener('submit', async (e) => {


        e.preventDefault();


        const fullName = document.getElementById('reg-name').value.trim();


        const email = document.getElementById('reg-email').value.trim();


        const phone = document.getElementById('reg-phone').value.trim();


        const address = document.getElementById('reg-address').value.trim();


        const password = document.getElementById('reg-password').value;


        


        try {


            const res = await fetch(`${API_BASE}/customers/add/`, {


                method: 'POST',


                headers: { 'Content-Type': 'application/json' },


                body: JSON.stringify({


                    full_name: fullName,


                    email,


                    phone,


                    address,


                    password


                })


            });


            


            if (res.ok) {


                showToast("Registration successful! Please login.", "success");


                setTimeout(() => { window.location.href = 'login.html'; }, 1500);


            } else {


                const err = await res.json();


                showToast(err.message || "Registration failed", "error");


            }


        } catch (err) {


            console.error(err);


            showToast("Server connection failed", "error");


        }


    });


}





// ==========================================


// 4. RESTAURANTS PAGE INITIALIZATION (restaurants.html)


// ==========================================


async function initRestaurantsPage() {


    const listGrid = document.getElementById('restaurants-grid');


    const searchInput = document.getElementById('rest-search');


    const cuisineFilter = document.getElementById('filter-cuisine');


    const locationFilter = document.getElementById('filter-location');


    


    if (!listGrid) return;


    


    try {


        const res = await fetch(`${API_BASE}/restaurants/`);


        if (res.ok) {


            const restaurants = await res.json();


            


            // Populate filters with unique cuisines and locations


            const cuisines = [...new Set(restaurants.map(r => r.cuisine))];


            const locations = [...new Set(restaurants.map(r => r.location))];


            


            if (cuisineFilter) {


                cuisineFilter.innerHTML = `<option value="">All Cuisines</option>` + 


                    cuisines.map(c => `<option value="${c}">${c}</option>`).join('');


            }


            if (locationFilter) {


                locationFilter.innerHTML = `<option value="">All Locations</option>` + 


                    locations.map(l => `<option value="${l}">${l}</option>`).join('');


            }


            


            // Check if search query was passed via URL parameter


            const urlParams = new URLSearchParams(window.location.search);


            const searchParam = urlParams.get('search');


            if (searchParam && searchInput) {


                searchInput.value = searchParam;


            }


            


            const filterAndRender = () => {


                const q = searchInput ? searchInput.value.toLowerCase() : '';


                const selectedCuisine = cuisineFilter ? cuisineFilter.value : '';


                const selectedLocation = locationFilter ? locationFilter.value : '';


                


                const filtered = restaurants.filter(r => {


                    const matchSearch = r.restaurant_name.toLowerCase().includes(q) || 


                                        r.cuisine.toLowerCase().includes(q) ||


                                        r.location.toLowerCase().includes(q);


                    const matchCuisine = !selectedCuisine || r.cuisine === selectedCuisine;


                    const matchLocation = !selectedLocation || r.location === selectedLocation;


                    return matchSearch && matchCuisine && matchLocation;


                });


                


                if (filtered.length === 0) {


                    listGrid.innerHTML = `<div class="glass" style="grid-column: 1/-1; padding:3rem; text-align:center; color:var(--text-secondary);">No restaurants match your filters.</div>`;


                } else {


                    listGrid.innerHTML = filtered.map(r => `


                        <div class="card-restaurant glass">


                            <div class="card-image">


                                <img src="${getRestaurantImage(r.cuisine)}" alt="${r.restaurant_name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">


                                <div class="card-badge">${r.cuisine}</div>


                            </div>


                            <div class="card-body">


                                <h3 class="card-title">${r.restaurant_name}</h3>


                                <p class="card-cuisine">📍 ${r.location} | Owner: ${r.owner_name}</p>


                                <div class="card-meta">


                                    <div class="rating">⭐ ${r.rating.toFixed(1)}</div>


                                    <a href="menu.html?restaurant=${encodeURIComponent(r.restaurant_name)}" class="btn btn-primary btn-sm">View Menu</a>


                                </div>


                            </div>


                        </div>


                    `).join('');


                }


            };


            


            // Set event listeners for real-time filtering


            if (searchInput) searchInput.addEventListener('input', filterAndRender);


            if (cuisineFilter) cuisineFilter.addEventListener('change', filterAndRender);


            if (locationFilter) locationFilter.addEventListener('change', filterAndRender);


            


            // Initial render


            filterAndRender();


        }


    } catch (e) {


        console.error(e);


        listGrid.innerHTML = `<p style="color:var(--error);">Failed to load restaurants.</p>`;


    }


}





// ==========================================


// 5. FOOD MENU PAGE INITIALIZATION (menu.html)


// ==========================================


async function initMenuPage() {


    const urlParams = new URLSearchParams(window.location.search);


    const restName = urlParams.get('restaurant');


    


    const restHeader = document.getElementById('menu-restaurant-info');


    const menuGrid = document.getElementById('menu-items-grid');


    const catPills = document.getElementById('menu-category-pills');


    


    if (!restName || !menuGrid) {


        if (menuGrid) menuGrid.innerHTML = `<p style="color:var(--error);">No restaurant specified.</p>`;


        return;


    }


    


    // Set Restaurant details in header


    if (restHeader) {


        try {


            const res = await fetch(`${API_BASE}/restaurants/`);


            if (res.ok) {


                const list = await res.json();


                const restaurant = list.find(r => r.restaurant_name.toLowerCase() === restName.toLowerCase());


                if (restaurant) {


                    restHeader.innerHTML = `


                        <h1 style="font-size:2.5rem; font-weight:800; margin-bottom:0.5rem;">${restaurant.restaurant_name}</h1>


                        <p style="color:var(--text-secondary); font-size:1.1rem;">📍 ${restaurant.location} | Cuisine: <strong>${restaurant.cuisine}</strong> | Contact: ${restaurant.contact}</p>


                        <div class="rating" style="margin-top:0.5rem; font-size:1.2rem;">⭐ ${restaurant.rating.toFixed(1)}</div>


                    `;


                } else {


                    restHeader.innerHTML = `<h1>${restName} Menu</h1>`;


                }


            }


        } catch (e) {


            console.error("Error loading restaurant header", e);


            restHeader.innerHTML = `<h1>${restName} Menu</h1>`;


        }


    }


    


    // Fetch Foods for this restaurant


    try {


        const res = await fetch(`${API_BASE}/foods/?restaurant_name=${encodeURIComponent(restName)}`);


        if (res.ok) {


            const foods = await res.json();


            


            // Render category pills


            const categories = ['All', ...new Set(foods.map(f => f.category))];


            if (catPills) {


                catPills.innerHTML = categories.map(cat => `


                    <button onclick="filterMenuByCategory('${cat}')" class="btn btn-secondary btn-sm category-pill-btn ${cat === 'All' ? 'btn-primary' : ''}" style="border-radius:50px;">${cat}</button>


                `).join('');


            }


            


            window.allMenuFoods = foods; // store in window for category filtering


            renderMenuFoods(foods);


        }


    } catch (e) {


        console.error(e);


        menuGrid.innerHTML = `<p style="color:var(--error);">Failed to load menu items.</p>`;


    }


}





function renderMenuFoods(foods) {


    const menuGrid = document.getElementById('menu-items-grid');


    if (!menuGrid) return;


    


    if (foods.length === 0) {


        menuGrid.innerHTML = `<div class="glass" style="grid-column: 1/-1; padding:3rem; text-align:center; color:var(--text-secondary);">No food items available in this category.</div>`;


        return;


    }


    


    menuGrid.innerHTML = foods.map(f => `


        <div class="card-food glass">


            <div class="card-image" style="height:160px;">


                <img src="${getFoodImage(f.image_url, f.food_name)}" alt="${f.food_name}" onerror="this.onerror=null;this.src=FALLBACK_IMG">


                <span class="food-badge ${f.availability === 'Available' ? '' : 'out-of-stock'}">${f.availability}</span>


            </div>


            <div class="card-body" style="flex:1; display:flex; flex-direction:column; justify-content:space-between;">


                <div>


                    <h3 class="card-title" style="font-size:1.2rem; margin-bottom:0.25rem;">${f.food_name}</h3>


                    <p class="card-cuisine" style="margin-bottom:0.5rem; font-size:0.8rem; background:rgba(255,255,255,0.05); width:fit-content; padding:2px 8px; border-radius:50px;">${f.category}</p>


                </div>


                <div class="card-meta" style="border:none; padding:0;">


                    <span class="food-price">₹${f.price}</span>


                    <button onclick="handleAddToCart('${f.food_name}', ${f.price})" class="btn btn-primary btn-sm" ${f.availability === 'Available' ? '' : 'disabled style="background:var(--text-muted); box-shadow:none; cursor:not-allowed;"'}>Add to Cart</button>


                </div>


            </div>


        </div>


    `).join('');


}





window.filterMenuByCategory = function(category) {


    const pills = document.querySelectorAll('.category-pill-btn');


    pills.forEach(p => {


        if (p.innerText.trim() === category) {


            p.classList.add('btn-primary');


            p.classList.remove('btn-secondary');


        } else {


            p.classList.remove('btn-primary');


            p.classList.add('btn-secondary');


        }


    });


    


    if (category === 'All') {


        renderMenuFoods(window.allMenuFoods);


    } else {


        const filtered = window.allMenuFoods.filter(f => f.category === category);


        renderMenuFoods(filtered);


    }


};





// ==========================================


// 6. CART PAGE INITIALIZATION (cart.html)


// ==========================================


async function initCartPage() {


    const itemsContainer = document.getElementById('cart-items-container');


    const cartTotals = document.getElementById('cart-summary-totals');


    


    if (!itemsContainer || !currentUser) return;


    


    try {


        const res = await fetch(`${API_BASE}/cart/?customer_name=${encodeURIComponent(currentUser.full_name)}`);


        if (res.ok) {


            const items = await res.json();


            


            if (items.length === 0) {


                itemsContainer.innerHTML = `<div class="glass" style="padding:3rem; text-align:center; color:var(--text-secondary);">Your shopping cart is empty! <br/><br/><a href="restaurants.html" class="btn btn-primary btn-sm">Explore Restaurants</a></div>`;


                if (cartTotals) cartTotals.style.display = 'none';


                return;


            }


            


            if (cartTotals) cartTotals.style.display = 'flex';


            


            itemsContainer.innerHTML = items.map(item => `


                <div class="cart-item glass">


                    <div class="cart-item-details">


                        <span class="cart-item-title">${item.food_name}</span>


                        <span class="cart-item-price">₹${item.price} each</span>


                    </div>


                    <div style="display:flex; align-items:center; gap:2rem;">


                        <div class="cart-qty-ctrl">


                            <button onclick="handleUpdateCartQty(${item.cart_id}, ${item.quantity - 1})" class="cart-qty-btn">&minus;</button>


                            <span style="font-weight:600;">${item.quantity}</span>


                            <button onclick="handleUpdateCartQty(${item.cart_id}, ${item.quantity + 1})" class="cart-qty-btn">&plus;</button>


                        </div>


                        <span class="food-price" style="font-size:1.2rem; min-width:80px; text-align:right;">₹${item.total_price}</span>


                        <button onclick="handleRemoveCartItem(${item.cart_id})" class="btn btn-danger btn-sm" style="padding:0.4rem 0.6rem; border-radius:var(--radius-sm);">🗑️</button>


                    </div>


                </div>


            `).join('');


            


            // Calculate totals


            const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);


            const delivery = subtotal > 300 ? 0 : 40;


            const total = subtotal + delivery;


            


            if (cartTotals) {


                cartTotals.innerHTML = `


                    <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">Order Summary</h3>


                    <div class="summary-row">


                        <span>Subtotal</span>


                        <span>₹${subtotal}</span>


                    </div>


                    <div class="summary-row">


                        <span>Delivery Fee</span>


                        <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>


                    </div>


                    <div class="summary-row summary-total">


                        <span>Total</span>


                        <span>₹${total}</span>


                    </div>


                    <a href="checkout.html" class="btn btn-primary" style="margin-top:1rem; width:100%;">Proceed to Checkout</a>


                `;


            }


        }


    } catch (e) {


        console.error(e);


        itemsContainer.innerHTML = `<p style="color:var(--error);">Failed to load cart items.</p>`;


    }


}





window.handleUpdateCartQty = async function(cartId, newQty) {


    if (newQty < 1) {


        handleRemoveCartItem(cartId);


        return;


    }


    


    try {


        const res = await fetch(`${API_BASE}/cart/update/${cartId}/`, {


            method: 'PUT',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({ quantity: newQty })


        });


        


        if (res.ok) {


            initCartPage();


            updateNavbarCartCount();


        } else {


            showToast("Failed to update quantity", "error");


        }


    } catch (e) {


        console.error(e);


        showToast("Error updating cart quantity", "error");


    }


};





window.handleRemoveCartItem = async function(cartId) {


    try {


        const res = await fetch(`${API_BASE}/cart/delete/${cartId}/`, {


            method: 'DELETE'


        });


        if (res.ok) {


            showToast("Item removed from cart", "success");


            initCartPage();


            updateNavbarCartCount();


        } else {


            showToast("Failed to remove item", "error");


        }


    } catch (e) {


        console.error(e);


        showToast("Error deleting cart item", "error");


    }


};





// ==========================================


// 7. CHECKOUT PAGE INITIALIZATION (checkout.html)


// ==========================================


async function initCheckoutPage() {


    const summaryContainer = document.getElementById('checkout-summary-container');


    const form = document.getElementById('checkout-form');


    


    if (!summaryContainer || !currentUser) return;


    


    // Auto-fill delivery address from profile


    const addrField = document.getElementById('chk-address');


    if (addrField) addrField.value = currentUser.address || '';


    


    let subtotal = 0;


    let restaurantName = "Spicy Kitchen"; // Fallback default


    


    try {


        // Fetch cart items to display in checkout summary


        const res = await fetch(`${API_BASE}/cart/?customer_name=${encodeURIComponent(currentUser.full_name)}`);


        if (res.ok) {


            const items = await res.json();


            


            if (items.length === 0) {


                showToast("Cart is empty", "error");


                window.location.href = 'cart.html';


                return;


            }


            


            // To place the order, we need to know which restaurant the food items are from.


            // We can fetch food details to find the restaurant, or just get it from seeder associations.


            // Let's check: if we have food items in the cart, we look up their restaurant by fetching all foods.


            try {


                const foodRes = await fetch(`${API_BASE}/foods/`);


                if (foodRes.ok) {


                    const allFoods = await foodRes.json();


                    const firstCartFood = allFoods.find(f => f.food_name.toLowerCase() === items[0].food_name.toLowerCase());


                    if (firstCartFood) {


                        restaurantName = firstCartFood.restaurant_name;


                    }


                }


            } catch (e) {


                console.error("Error fetching restaurant name for order", e);


            }


            


            subtotal = items.reduce((sum, item) => sum + item.total_price, 0);


            const delivery = subtotal > 300 ? 0 : 40;


            const total = subtotal + delivery;


            


            summaryContainer.innerHTML = `


                <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">Order Summary</h3>


                <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">


                    ${items.map(item => `


                        <div style="display:flex; justify-content:space-between; font-size:0.95rem;">


                            <span style="color:var(--text-secondary);">${item.food_name} x ${item.quantity}</span>


                            <span>₹${item.total_price}</span>


                        </div>


                    `).join('')}


                </div>


                <div class="summary-row" style="font-size:0.95rem;">


                    <span>Subtotal</span>


                    <span>₹${subtotal}</span>


                </div>


                <div class="summary-row" style="font-size:0.95rem;">


                    <span>Delivery Fee</span>


                    <span>${delivery === 0 ? 'FREE' : '₹' + delivery}</span>


                </div>


                <div class="summary-row summary-total" style="font-size:1.2rem; margin-top:0.75rem;">


                    <span>Total Amount</span>


                    <span>₹${total}</span>


                </div>


            `;


            


            if (form) {


                form.addEventListener('submit', async (e) => {


                    e.preventDefault();


                    


                    const paymentMethod = document.getElementById('chk-payment').value;


                    const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid';


                    


                    try {


                        const orderRes = await fetch(`${API_BASE}/orders/add/`, {


                            method: 'POST',


                            headers: { 'Content-Type': 'application/json' },


                            body: JSON.stringify({


                                customer_name: currentUser.full_name,


                                restaurant_name: restaurantName,


                                total_amount: total,


                                payment_method: paymentMethod,


                                payment_status: paymentStatus,


                                order_status: 'Order Placed'


                            })


                        });


                        


                        if (orderRes.ok) {


                            showToast("Order placed successfully!", "success");


                            updateNavbarCartCount();


                            setTimeout(() => {


                                window.location.href = 'orders.html';


                            }, 1500);


                        } else {


                            showToast("Failed to place order. Try again.", "error");


                        }


                    } catch (e) {


                        console.error(e);


                        showToast("Error processing order", "error");


                    }


                });


            }


        }


    } catch (e) {


        console.error(e);


        summaryContainer.innerHTML = `<p style="color:var(--error);">Failed to load order summary.</p>`;


    }


}





// ==========================================


// 8. ORDERS PAGE INITIALIZATION (orders.html)


// ==========================================


async function initOrdersPage() {


    const currentContainer = document.getElementById('current-orders-container');


    const previousContainer = document.getElementById('previous-orders-container');


    


    if (!currentContainer || !currentUser) return;


    


    try {


        let url = `${API_BASE}/orders/`;


        if (currentRole === 'customer') {


            url += `?customer_name=${encodeURIComponent(currentUser.full_name)}`;


        } else if (currentRole === 'restaurant') {


            url += `?restaurant_name=${encodeURIComponent(currentUser.restaurant_name)}`;


        }


        


        const res = await fetch(url);


        if (res.ok) {


            const orders = await res.json();


            


            // Sort by order ID descending to show newest first


            orders.sort((a, b) => b.order_id - a.order_id);


            


            const currentOrders = orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled');


            const pastOrders = orders.filter(o => o.order_status === 'Delivered' || o.order_status === 'Cancelled');


            


            // Render Current Orders


            if (currentOrders.length === 0) {


                currentContainer.innerHTML = `<div class="glass" style="padding:2rem; text-align:center; color:var(--text-secondary);">No active orders at the moment.</div>`;


            } else {


                currentContainer.innerHTML = currentOrders.map(o => {


                    // Timeline steps active configuration


                    const steps = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];


                    const currentIdx = steps.indexOf(o.order_status);


                    


                    return `


                        <div class="glass" style="padding:2rem; border-radius:var(--radius-lg); margin-bottom:2rem;">


                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:1rem; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">


                                <div>


                                    <h3 style="font-size:1.2rem; font-weight:700;">Order #${o.order_id}</h3>


                                    <p style="color:var(--text-secondary); font-size:0.85rem;">Date: ${o.order_date} | Restaurant: <strong>${o.restaurant_name}</strong> | Customer: <strong>${o.customer_name}</strong></p>


                                </div>


                                <div style="display:flex; gap:0.5rem; align-items:center;">


                                    <span class="badge-status ${o.payment_status === 'Paid' ? 'status-paid' : 'status-pending'}">Payment: ${o.payment_status} (${o.payment_method})</span>


                                    <span class="badge-status ${o.order_status === 'Order Placed' ? 'status-placed' : o.order_status === 'Preparing' ? 'status-preparing' : 'status-delivery'}">${o.order_status}</span>


                                </div>


                            </div>


                            


                            <!-- Timeline -->


                            <div class="timeline" style="margin-top:1rem;">


                                <div class="timeline-item ${currentIdx >= 0 ? (currentIdx > 0 ? 'completed' : 'active') : ''}">


                                    <div class="timeline-icon">🌝</div>


                                    <div class="timeline-content glass">


                                        <h4 class="timeline-title">Order Placed</h4>


                                        <p class="timeline-desc">Your order has been received by ${o.restaurant_name}</p>


                                    </div>


                                </div>


                                <div class="timeline-item ${currentIdx >= 1 ? (currentIdx > 1 ? 'completed' : 'active') : ''}">


                                    <div class="timeline-icon">🍳</div>


                                    <div class="timeline-content glass">


                                        <h4 class="timeline-title">Preparing Food</h4>


                                        <p class="timeline-desc">The chef is preparing your delicious meal</p>


                                    </div>


                                </div>


                                <div class="timeline-item ${currentIdx >= 2 ? (currentIdx > 2 ? 'completed' : 'active') : ''}">


                                    <div class="timeline-icon">🚴</div>


                                    <div class="timeline-content glass">


                                        <h4 class="timeline-title">Out for Delivery</h4>


                                        <p class="timeline-desc">Delivery partner is on their way to your address</p>


                                    </div>


                                </div>


                                <div class="timeline-item ${currentIdx >= 3 ? 'completed' : ''}">


                                    <div class="timeline-icon">🎁</div>


                                    <div class="timeline-content glass">


                                        <h4 class="timeline-title">Delivered</h4>


                                        <p class="timeline-desc">Enjoy your meal!</p>


                                    </div>


                                </div>


                            </div>


                            


                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; font-size:1.1rem; font-weight:700; border-top:1px solid var(--border-color); padding-top:1rem;">


                                <span>Total Paid</span>


                                <span class="food-price">₹${o.total_amount}</span>


                            </div>


                        </div>


                    `;


                }).join('');


            }


            


            // Render Previous Orders


            if (previousContainer) {


                if (pastOrders.length === 0) {


                    previousContainer.innerHTML = `<div class="glass" style="padding:2rem; text-align:center; color:var(--text-secondary);">No previous orders.</div>`;


                } else {


                    previousContainer.innerHTML = `


                        <div class="table-container glass">


                            <table>


                                <thead>


                                    <tr>


                                        <th>Order ID</th>


                                        <th>Date</th>


                                        <th>Restaurant</th>


                                        <th>Amount</th>


                                        <th>Payment</th>


                                        <th>Status</th>


                                    </tr>


                                </thead>


                                <tbody>


                                    ${pastOrders.map(o => `


                                        <tr>


                                            <td>#${o.order_id}</td>


                                            <td>${o.order_date}</td>


                                            <td><strong>${o.restaurant_name}</strong></td>


                                            <td style="font-weight:700;">₹${o.total_amount}</td>


                                            <td><span class="badge-status ${o.payment_status === 'Paid' ? 'status-paid' : 'status-failed'}">${o.payment_status}</span></td>


                                            <td><span class="badge-status ${o.order_status === 'Delivered' ? 'status-delivered' : 'status-cancelled'}">${o.order_status}</span></td>


                                        </tr>


                                    `).join('')}


                                </tbody>


                            </table>


                        </div>


                    `;


                }


            }


        }


    } catch (e) {


        console.error(e);


        currentContainer.innerHTML = `<p style="color:var(--error);">Failed to load orders.</p>`;


    }


}





// ==========================================


// 9. CUSTOMER DASHBOARD INITIALIZATION (customer_dashboard.html)


// ==========================================


async function initCustomerDashboard() {


    const profileNode = document.getElementById('cust-profile-info');


    const statsContainer = document.getElementById('cust-stats-container');


    const recentOrdersTable = document.getElementById('cust-recent-orders');


    


    if (!currentUser) return;


    


    // 1. Render profile details


    if (profileNode) {


        profileNode.innerHTML = `


            <div class="profile-avatar">${currentUser.full_name.charAt(0)}</div>


            <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">${currentUser.full_name}</h2>


            <p style="color:var(--primary); font-weight:600; font-size:0.9rem; margin-bottom:1.5rem;">🍖 Customer (ID: ${currentUser.customer_id})</p>


            <div style="text-align:left; width:100%; display:flex; flex-direction:column; gap:0.8rem; font-size:0.95rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:1.5rem;">


                <p>🔑 <strong>Email:</strong> ${currentUser.email}</p>


                <p>📧 <strong>Phone:</strong> ${currentUser.phone}</p>


                <p>🏠 <strong>Address:</strong> ${currentUser.address}</p>


            </div>


            <button onclick="handleDeleteProfile(${currentUser.customer_id})" class="btn btn-danger btn-sm" style="margin-top:1.5rem; width:100%;">Delete Account</button>


        `;


    }


    


    // 2. Fetch and render stats and order list


    try {


        const res = await fetch(`${API_BASE}/orders/?customer_name=${encodeURIComponent(currentUser.full_name)}`);


        if (res.ok) {


            const orders = await res.json();


            orders.sort((a, b) => b.order_id - a.order_id);


            


            const total = orders.length;


            const active = orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length;


            const completed = orders.filter(o => o.order_status === 'Delivered').length;


            


            if (statsContainer) {


                statsContainer.innerHTML = `


                    <div class="stat-card glass">


                        <span class="stat-val">${total}</span>


                        <span class="stat-lbl">Total Orders</span>


                    </div>


                    <div class="stat-card glass">


                        <span class="stat-val" style="color:var(--warning);">${active}</span>


                        <span class="stat-lbl">Active Orders</span>


                    </div>


                    <div class="stat-card glass">


                        <span class="stat-val" style="color:var(--success);">${completed}</span>


                        <span class="stat-lbl">Delivered</span>


                    </div>


                `;


            }


            


            if (recentOrdersTable) {


                if (orders.length === 0) {


                    recentOrdersTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary);">No orders placed yet.</td></tr>`;


                } else {


                    recentOrdersTable.innerHTML = orders.slice(0, 5).map(o => `


                        <tr>


                            <td>#${o.order_id}</td>


                            <td><strong>${o.restaurant_name}</strong></td>


                            <td>₹${o.total_amount}</td>


                            <td><span class="badge-status ${o.payment_status === 'Paid' ? 'status-paid' : 'status-pending'}">${o.payment_status}</span></td>


                            <td><span class="badge-status ${o.order_status === 'Delivered' ? 'status-delivered' : o.order_status === 'Cancelled' ? 'status-cancelled' : 'status-placed'}">${o.order_status}</span></td>


                        </tr>


                    `).join('');


                }


            }


        }


    } catch (e) {


        console.error(e);


    }


}





window.handleDeleteProfile = async function(id) {


    if (!confirm("Are you sure you want to permanently delete your account? All history will be removed.")) return;


    try {


        const res = await fetch(`${API_BASE}/customers/delete/${id}/`, {


            method: 'DELETE'


        });


        if (res.ok) {


            localStorage.removeItem('food_app_user');


            localStorage.removeItem('food_app_role');


            showToast("Profile deleted successfully", "success");


            setTimeout(() => { window.location.href = 'index.html'; }, 1500);


        } else {


            showToast("Failed to delete profile", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





// ==========================================


// 10. RESTAURANT DASHBOARD INITIALIZATION (restaurant_dashboard.html)


// ==========================================


async function initRestaurantDashboard() {


    const detailsNode = document.getElementById('rest-details-info');


    const statsContainer = document.getElementById('rest-stats-container');


    const foodsTable = document.getElementById('rest-foods-table');


    const ordersTable = document.getElementById('rest-orders-table');


    


    const addFoodForm = document.getElementById('rest-add-food-form');


    


    if (!currentUser) return;


    


    // 1. Render Restaurant profile info


    if (detailsNode) {


        detailsNode.innerHTML = `


            <div class="profile-avatar" style="background:linear-gradient(135deg, #10b981, #3b82f6)">🍽️</div>


            <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:0.25rem;">${currentUser.restaurant_name}</h2>


            <p style="color:var(--success); font-weight:600; font-size:0.9rem; margin-bottom:1.5rem;">🍖 Manager (Owner: ${currentUser.owner_name})</p>


            <div style="text-align:left; width:100%; display:flex; flex-direction:column; gap:0.8rem; font-size:0.95rem; color:var(--text-secondary); border-top:1px solid var(--border-color); padding-top:1.5rem;">


                <p>📍 <strong>Location:</strong> ${currentUser.location}</p>


                <p>📞 <strong>Cuisine:</strong> ${currentUser.cuisine}</p>


                <p>📧 <strong>Contact:</strong> ${currentUser.contact}</p>


                <p>⭐ <strong>Rating:</strong> ⭐ ${currentUser.rating.toFixed(1)}</p>


            </div>


        `;


    }


    


    // Bind food addition form


    if (addFoodForm) {


        addFoodForm.addEventListener('submit', async (e) => {


            e.preventDefault();


            const foodName = document.getElementById('food-name').value.trim();


            const category = document.getElementById('food-category').value.trim();


            const price = parseFloat(document.getElementById('food-price').value);


            const availability = document.getElementById('food-avail').value;


            const img = document.getElementById('food-img').value.trim() || 'biryani.jpg';


            


            try {


                const res = await fetch(`${API_BASE}/foods/add/`, {


                    method: 'POST',


                    headers: { 'Content-Type': 'application/json' },


                    body: JSON.stringify({


                        food_name: foodName,


                        restaurant_name: currentUser.restaurant_name,


                        category: category,


                        price: price,


                        availability: availability,


                        image_url: img


                    })


                });


                


                if (res.ok) {


                    showToast("Food item added successfully!", "success");


                    addFoodForm.reset();


                    initRestaurantDashboard(); // refresh stats & list


                } else {


                    showToast("Failed to add food item", "error");


                }


            } catch (err) {


                console.error(err);


            }


        });


    }


    


    // 2. Fetch foods and orders to calculate stats and populate tables


    try {


        // Foods


        const foodRes = await fetch(`${API_BASE}/foods/?restaurant_name=${encodeURIComponent(currentUser.restaurant_name)}`);


        let foods = [];


        if (foodRes.ok) {


            foods = await foodRes.json();


            if (foodsTable) {


                if (foods.length === 0) {


                    foodsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-secondary);">No food items added.</td></tr>`;


                } else {


                    foodsTable.innerHTML = foods.map(f => `


                        <tr>


                            <td>#${f.food_id}</td>


                            <td><strong>${f.food_name}</strong></td>


                            <td>${f.category}</td>


                            <td>₹${f.price}</td>


                            <td>


                                <select onchange="handleUpdateFoodStatus(${f.food_id}, this.value)" class="select-filter" style="padding:0.35rem 0.75rem; min-width:110px; font-size:0.85rem;">


                                    <option value="Available" ${f.availability === 'Available' ? 'selected' : ''}>Available</option>


                                    <option value="Out of Stock" ${f.availability === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>


                                </select>


                            </td>


                            <td>


                                <button onclick="handleDeleteFood(${f.food_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                            </td>


                        </tr>


                    `).join('');


                }


            }


        }


        


        // Orders


        const orderRes = await fetch(`${API_BASE}/orders/?restaurant_name=${encodeURIComponent(currentUser.restaurant_name)}`);


        let orders = [];


        if (orderRes.ok) {


            orders = await orderRes.json();


            orders.sort((a, b) => b.order_id - a.order_id);


            


            if (ordersTable) {


                if (orders.length === 0) {


                    ordersTable.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary);">No orders received yet.</td></tr>`;


                } else {


                    ordersTable.innerHTML = orders.map(o => `


                        <tr>


                            <td>#${o.order_id}</td>


                            <td>${o.customer_name}</td>


                            <td>₹${o.total_amount}</td>


                            <td>


                                <select onchange="handleUpdatePaymentStatus(${o.order_id}, this.value)" class="select-filter" style="padding:0.35rem 0.75rem; min-width:110px; font-size:0.85rem;">


                                    <option value="Pending" ${o.payment_status === 'Pending' ? 'selected' : ''}>Pending</option>


                                    <option value="Paid" ${o.payment_status === 'Paid' ? 'selected' : ''}>Paid</option>


                                    <option value="Failed" ${o.payment_status === 'Failed' ? 'selected' : ''}>Failed</option>


                                </select>


                            </td>


                            <td>


                                <select onchange="handleUpdateOrderStatus(${o.order_id}, this.value)" class="select-filter" style="padding:0.35rem 0.75rem; min-width:140px; font-size:0.85rem;">


                                    <option value="Order Placed" ${o.order_status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>


                                    <option value="Preparing" ${o.order_status === 'Preparing' ? 'selected' : ''}>Preparing</option>


                                    <option value="Out for Delivery" ${o.order_status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>


                                    <option value="Delivered" ${o.order_status === 'Delivered' ? 'selected' : ''}>Delivered</option>


                                    <option value="Cancelled" ${o.order_status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>


                                </select>


                            </td>


                        </tr>


                    `).join('');


                }


            }


        }


        


        // Calculate Stats


        const totalFoods = foods.length;


        const pendingOrders = orders.filter(o => o.order_status !== 'Delivered' && o.order_status !== 'Cancelled').length;


        const completedOrders = orders.filter(o => o.order_status === 'Delivered').length;


        


        if (statsContainer) {


            statsContainer.innerHTML = `


                <div class="stat-card glass">


                    <span class="stat-val">${totalFoods}</span>


                    <span class="stat-lbl">Total Foods</span>


                </div>


                <div class="stat-card glass">


                    <span class="stat-val" style="color:var(--warning);">${pendingOrders}</span>


                    <span class="stat-lbl">Pending Orders</span>


                </div>


                <div class="stat-card glass">


                    <span class="stat-val" style="color:var(--success);">${completedOrders}</span>


                    <span class="stat-lbl">Completed Orders</span>


                </div>


            `;


        }


    } catch (e) {


        console.error(e);


    }


}





window.handleUpdateFoodStatus = async function(id, value) {


    try {


        const res = await fetch(`${API_BASE}/foods/update/${id}/`, {


            method: 'PUT',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({ availability: value })


        });


        if (res.ok) {


            showToast("Availability status updated", "success");


            initRestaurantDashboard();


        } else {


            showToast("Failed to update status", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





window.handleDeleteFood = async function(id) {


    if (!confirm("Are you sure you want to delete this food item?")) return;


    try {


        const res = await fetch(`${API_BASE}/foods/delete/${id}/`, {


            method: 'DELETE'


        });


        if (res.ok) {


            showToast("Food item deleted successfully", "success");


            initRestaurantDashboard();


        } else {


            showToast("Failed to delete food item", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





window.handleUpdatePaymentStatus = async function(id, value) {


    try {


        const res = await fetch(`${API_BASE}/orders/update/${id}/`, {


            method: 'PUT',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({ payment_status: value })


        });


        if (res.ok) {


            showToast("Payment status updated", "success");


            initRestaurantDashboard();


        } else {


            showToast("Failed to update payment status", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





window.handleUpdateOrderStatus = async function(id, value) {


    try {


        const res = await fetch(`${API_BASE}/orders/update/${id}/`, {


            method: 'PUT',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({ order_status: value })


        });


        if (res.ok) {


            showToast(`Order status updated to: ${value}`, "success");


            initRestaurantDashboard();


        } else {


            showToast("Failed to update order status", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





// ==========================================


// 11. ADMIN DASHBOARD INITIALIZATION (admin_dashboard.html)


// ==========================================


async function initAdminDashboard() {


    // Admin Dashboard loads tabs dynamically for full CRUD on Customers, Restaurants, Foods, Cart Items, and Orders.


    const tabs = document.querySelectorAll('.admin-tab-btn');


    tabs.forEach(tab => {


        tab.addEventListener('click', () => {


            tabs.forEach(t => t.classList.remove('btn-primary'));


            tab.classList.add('btn-primary');


            loadAdminTab(tab.dataset.tab);


        });


    });


    


    // Initial Load: Customers


    loadAdminTab('customers');


}





async function loadAdminTab(tabName) {


    const container = document.getElementById('admin-tab-content');


    if (!container) return;


    


    container.innerHTML = `<div style="text-align:center; padding:3rem;"><span class="badge-status status-placed" style="font-size:1.1rem; padding:0.5rem 1.5rem;">Loading ${tabName} data...</span></div>`;


    


    try {


        if (tabName === 'customers') {


            const res = await fetch(`${API_BASE}/customers/`);


            if (res.ok) {


                const list = await res.json();


                container.innerHTML = `


                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">


                        <h2>Manage Customers (${list.length})</h2>


                    </div>


                    <div class="table-container glass">


                        <table>


                            <thead>


                                <tr>


                                    <th>ID</th>


                                    <th>Full Name</th>


                                    <th>Email</th>


                                    <th>Phone</th>


                                    <th>Address</th>


                                    <th>Password</th>


                                    <th>Actions</th>


                                </tr>


                            </thead>


                            <tbody>


                                ${list.map(c => `


                                    <tr>


                                        <td>${c.customer_id}</td>


                                        <td><strong>${c.full_name}</strong></td>


                                        <td>${c.email}</td>


                                        <td>${c.phone}</td>


                                        <td>${c.address}</td>


                                        <td><code>${c.password}</code></td>


                                        <td>


                                            <button onclick="adminDeleteEntity('customers', ${c.customer_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                                        </td>


                                    </tr>


                                `).join('')}


                            </tbody>


                        </table>


                    </div>


                `;


            }


        } else if (tabName === 'restaurants') {


            const res = await fetch(`${API_BASE}/restaurants/`);


            if (res.ok) {


                const list = await res.json();


                container.innerHTML = `


                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">


                        <h2>Manage Restaurants (${list.length})</h2>


                        <button onclick="adminShowAddRestaurantModal()" class="btn btn-primary btn-sm">+ Add Restaurant</button>


                    </div>


                    <div class="table-container glass">


                        <table>


                            <thead>


                                <tr>


                                    <th>ID</th>


                                    <th>Name</th>


                                    <th>Owner</th>


                                    <th>Cuisine</th>


                                    <th>Location</th>


                                    <th>Contact</th>


                                    <th>Rating</th>


                                    <th>Actions</th>


                                </tr>


                            </thead>


                            <tbody>


                                ${list.map(r => `


                                    <tr>


                                        <td>${r.restaurant_id}</td>


                                        <td><strong>${r.restaurant_name}</strong></td>


                                        <td>${r.owner_name}</td>


                                        <td>${r.cuisine}</td>


                                        <td>${r.location}</td>


                                        <td>${r.contact}</td>


                                        <td>⭐ ${r.rating}</td>


                                        <td>


                                            <button onclick="adminDeleteEntity('restaurants', ${r.restaurant_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                                        </td>


                                    </tr>


                                `).join('')}


                            </tbody>


                        </table>


                    </div>


                `;


            }


        } else if (tabName === 'foods') {


            const res = await fetch(`${API_BASE}/foods/`);


            if (res.ok) {


                const list = await res.json();


                container.innerHTML = `


                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">


                        <h2>Manage Food Items (${list.length})</h2>


                    </div>


                    <div class="table-container glass">


                        <table>


                            <thead>


                                <tr>


                                    <th>ID</th>


                                    <th>Food Name</th>


                                    <th>Restaurant</th>


                                    <th>Category</th>


                                    <th>Price</th>


                                    <th>Status</th>


                                    <th>Actions</th>


                                </tr>


                            </thead>


                            <tbody>


                                ${list.map(f => `


                                    <tr>


                                        <td>${f.food_id}</td>


                                        <td><strong>${f.food_name}</strong></td>


                                        <td>${f.restaurant_name}</td>


                                        <td>${f.category}</td>


                                        <td>₹${f.price}</td>


                                        <td><span class="badge-status ${f.availability === 'Available' ? 'status-paid' : 'status-failed'}">${f.availability}</span></td>


                                        <td>


                                            <button onclick="adminDeleteEntity('foods', ${f.food_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                                        </td>


                                    </tr>


                                `).join('')}


                            </tbody>


                        </table>


                    </div>


                `;


            }


        } else if (tabName === 'cart') {


            const res = await fetch(`${API_BASE}/cart/`);


            if (res.ok) {


                const list = await res.json();


                container.innerHTML = `


                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">


                        <h2>Shopping Cart Contents (${list.length})</h2>


                    </div>


                    <div class="table-container glass">


                        <table>


                            <thead>


                                <tr>


                                    <th>ID</th>


                                    <th>Customer Name</th>


                                    <th>Food Name</th>


                                    <th>Quantity</th>


                                    <th>Price</th>


                                    <th>Total Price</th>


                                    <th>Actions</th>


                                </tr>


                            </thead>


                            <tbody>


                                ${list.map(c => `


                                    <tr>


                                        <td>${c.cart_id}</td>


                                        <td><strong>${c.customer_name}</strong></td>


                                        <td>${c.food_name}</td>


                                        <td>${c.quantity}</td>


                                        <td>₹${c.price}</td>


                                        <td>₹${c.total_price}</td>


                                        <td>


                                            <button onclick="adminDeleteEntity('cart', ${c.cart_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                                        </td>


                                    </tr>


                                `).join('')}


                            </tbody>


                        </table>


                    </div>


                `;


            }


        } else if (tabName === 'orders') {


            const res = await fetch(`${API_BASE}/orders/`);


            if (res.ok) {


                const list = await res.json();


                container.innerHTML = `


                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">


                        <h2>Manage All Orders (${list.length})</h2>


                    </div>


                    <div class="table-container glass">


                        <table>


                            <thead>


                                <tr>


                                    <th>Order ID</th>


                                    <th>Customer</th>


                                    <th>Restaurant</th>


                                    <th>Date</th>


                                    <th>Amount</th>


                                    <th>Payment</th>


                                    <th>Status</th>


                                    <th>Actions</th>


                                </tr>


                            </thead>


                            <tbody>


                                ${list.map(o => `


                                    <tr>


                                        <td>#${o.order_id}</td>


                                        <td><strong>${o.customer_name}</strong></td>


                                        <td>${o.restaurant_name}</td>


                                        <td>${o.order_date}</td>


                                        <td>₹${o.total_amount}</td>


                                        <td><span class="badge-status ${o.payment_status === 'Paid' ? 'status-paid' : 'status-pending'}">${o.payment_status}</span></td>


                                        <td><span class="badge-status ${o.order_status === 'Delivered' ? 'status-delivered' : o.order_status === 'Cancelled' ? 'status-cancelled' : 'status-placed'}">${o.order_status}</span></td>


                                        <td>


                                            <button onclick="adminDeleteEntity('orders', ${o.order_id})" class="btn btn-danger btn-sm" style="padding:0.25rem 0.5rem;">Delete</button>


                                        </td>


                                    </tr>


                                `).join('')}


                            </tbody>


                        </table>


                    </div>


                `;


            }


        }


    } catch (e) {


        console.error(e);


        container.innerHTML = `<p style="color:var(--error); text-align:center;">Failed to load tab data.</p>`;


    }


}





window.adminDeleteEntity = async function(moduleName, id) {


    if (!confirm(`Are you sure you want to delete this item from ${moduleName}?`)) return;


    try {


        const res = await fetch(`${API_BASE}/${moduleName}/delete/${id}/`, {


            method: 'DELETE'


        });


        if (res.ok) {


            showToast("Item deleted successfully", "success");


            loadAdminTab(moduleName);


        } else {


            showToast("Failed to delete item", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





window.adminShowAddRestaurantModal = async function() {


    const name = prompt("Enter Restaurant Name:");


    if (!name) return;


    const owner = prompt("Enter Owner Name:");


    const cuisine = prompt("Enter Cuisine Type (e.g. South Indian, American, Italian):");


    const location = prompt("Enter Location (e.g. Hyderabad, Mumbai):");


    const contact = prompt("Enter Contact Number:");


    const rating = parseFloat(prompt("Enter Rating (e.g. 4.5):") || "4.0");


    


    try {


        const res = await fetch(`${API_BASE}/restaurants/add/`, {


            method: 'POST',


            headers: { 'Content-Type': 'application/json' },


            body: JSON.stringify({


                restaurant_name: name,


                owner_name: owner,


                cuisine,


                location,


                contact,


                rating


            })


        });


        if (res.ok) {


            showToast("Restaurant registered successfully!", "success");


            loadAdminTab('restaurants');


        } else {


            showToast("Failed to register restaurant", "error");


        }


    } catch (e) {


        console.error(e);


    }


};





