let menuData = [];
let cart = [];
let totalPrice = 0;

// DOM elements
const menuContainer = document.getElementById('menu-container');
const cartQty = document.getElementById('cart-qty');
const cartItems = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const emptyCart = document.getElementById('empty-cart');
const orderCart = document.getElementById('order-cart');
const carbonNeutral = document.getElementById('carbon-neutral');
const confirmBtn = document.getElementById('confirm-btn');

// Load menu from data.json
function loadMenu() {
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            menuData = data;
            renderMenu();
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
            menuContainer.innerHTML = '<p style="color: rgb(199, 73, 9); text-align: center; padding: 40px;">Error loading menu. Please check if data.json file exists and you are running this on a web server.</p>';
        });
}

function renderMenu() {
    let menuHTML = '';
    menuData.forEach((item, index) => {
        menuHTML += `
            <div class="foodCard">
                <img src="${item.image.desktop}" class="image" id="image-${index}" alt="${item.name}">
                
                <button class="cart-button" id="cart-btn-${index}" onclick="addToCart(${index})">
                    <img src="./assets/images/icon-add-to-cart.svg" alt="" class="add-to-cart-icon">
                    Add to Cart
                </button>
                
                <div class="quantity-controls" id="qty-controls-${index}">
                    <button class="qty-btn" onclick="decreaseQuantity(${index})">
                        <img src="./assets/images/icon-decrement-quantity.svg" alt="decrease" style="width: 10px; height: 10px;">
                    </button>
                    <span class="qty-display" id="qty-display-${index}">1</span>
                    <button class="qty-btn" onclick="increaseQuantity(${index})">
                        <img src="./assets/images/icon-increment-quantity.svg" alt="increase" style="width: 10px; height: 10px;">
                    </button>
                </div>
                
                <p>${item.category}</p>
                <h6>${item.name}</h6>
                <h5>$${item.price.toFixed(2)}</h5>
            </div>
        `;
    });
    menuContainer.innerHTML = menuHTML;
}

function addToCart(index) {
    const product = menuData[index];
    const existingItem = cart.find(item => item.index === index);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, index: index });
    }
    
    updateCartDisplay();
    updateProductDisplay(index);
}

function increaseQuantity(index) {
    const cartItem = cart.find(item => item.index === index);
    if (cartItem) {
        cartItem.quantity += 1;
        updateCartDisplay();
        updateProductDisplay(index);
    }
}

function decreaseQuantity(index) {
    const cartItem = cart.find(item => item.index === index);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            removeFromCart(index);
        } else {
            updateCartDisplay();
            updateProductDisplay(index);
        }
    }
}

function removeFromCart(index) {
    cart = cart.filter(item => item.index !== index);
    updateCartDisplay();
    resetProductDisplay(index);
}

function updateProductDisplay(index) {
    const cartBtn = document.getElementById(`cart-btn-${index}`);
    const qtyControls = document.getElementById(`qty-controls-${index}`);
    const qtyDisplay = document.getElementById(`qty-display-${index}`);
    const image = document.getElementById(`image-${index}`);
    
    const cartItem = cart.find(item => item.index === index);
    
    if (cartItem && cartBtn && qtyControls && qtyDisplay && image) {
        cartBtn.style.display = 'none';
        qtyControls.classList.add('active');
        qtyDisplay.textContent = cartItem.quantity;
        image.classList.add('selected');
    }
}

function resetProductDisplay(index) {
    const cartBtn = document.getElementById(`cart-btn-${index}`);
    const qtyControls = document.getElementById(`qty-controls-${index}`);
    const image = document.getElementById(`image-${index}`);
    
    if (cartBtn && qtyControls && image) {
        cartBtn.style.display = 'flex';
        qtyControls.classList.remove('active');
        image.classList.remove('selected');
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartQty.textContent = totalItems;
    totalPriceElement.textContent = totalPrice.toFixed(2);
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        orderCart.classList.remove('active');
        carbonNeutral.classList.remove('active');
        confirmBtn.classList.remove('active');
    } else {
        emptyCart.style.display = 'none';
        orderCart.classList.add('active');
        carbonNeutral.classList.add('active');
        confirmBtn.classList.add('active');
        
        // Update cart items display
        let cartHTML = '';
        cart.forEach((item) => {
            cartHTML += `
                <div class="cart-item">
                    <div class="item-details">
                        <h6>${item.name}</h6>
                        <div class="item-pricing">
                            <span class="item-quantity">${item.quantity}x</span>
                            <span class="item-price">@ $${item.price.toFixed(2)}</span>
                            <span class="item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.index})">
                        <img src="./assets/images/icon-remove-item.svg" alt="remove" style="width: 10px; height: 10px;">
                    </button>
                </div>
            `;
        });
        cartItems.innerHTML = cartHTML;
    }
}

// Confirm order handler
confirmBtn.addEventListener('click', function() {
    if (cart.length > 0) {
        alert(`Order confirmed! Total: $${totalPrice.toFixed(2)}\n\nItems:\n${cart.map(item => `${item.quantity}x ${item.name}`).join('\n')}`);
        
        // Reset cart
        cart = [];
        updateCartDisplay();
        
        // Reset all product displays
        menuData.forEach((_, index) => {
            resetProductDisplay(index);
        });
    }
});

// Initialize the app
loadMenu();