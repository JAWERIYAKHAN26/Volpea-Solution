// =========================
// SHOP PRODUCT DISPLAY
// =========================
const productsContainer = document.getElementById('products');
const shopContent = document.getElementById('shopContent');
const adminPanel = document.getElementById('adminPanel');
const cartCount = document.getElementById('cartCount');

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Initialize cart count on page load
updateCartCount();

// =========================
// CART SIDEBAR
// =========================
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsList = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Show sidebar on cart icon click
document.querySelector('.fa-shopping-cart').addEventListener('click', () => {
  displayCartSidebar();
  cartSidebar.classList.add('active');
});

// Close sidebar
function closeCart() {
  cartSidebar.classList.remove('active');
}

// Display cart items in sidebar
function displayCartSidebar() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItemsList.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="cart-item-row">
        <span>${item.name}</span>
        <div class="cart-controls">
          <button class="add-to-cart" onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="add-to-cart" onclick="updateQuantity(${index}, 1)">+</button>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="add-to-cart" onclick="removeFromCart(${index})">❌</button>
        </div>
      </div>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = total.toFixed(2);
}

// Update quantity
function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartSidebar();
  updateCartCount();
}

// Remove item
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartSidebar();
  updateCartCount();
}

// =========================
// CUSTOM ALERT MODAL
// =========================
function showAlert(title, message) {
  document.getElementById("alertTitle").innerText = title || "Alert";
  document.getElementById("alertMessage").innerText = message;
  document.getElementById("alertModal").style.display = "flex";
}

function closeAlertModal() {
  document.getElementById("alertModal").style.display = "none";
}

// =========================
// CHECKOUT BUTTON
// =========================
checkoutBtn.addEventListener('click', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    showAlert("Cart Empty", "Your cart is empty!");
    return;
  }

  showAlert("Success", "✅ Checkout successful! Thank you for your purchase.");
  localStorage.removeItem('cart');
  displayCartSidebar();
  updateCartCount();
});

// =========================
// PRODUCTS DISPLAY
// =========================
let products = JSON.parse(localStorage.getItem('products')) || [];
let editIndex = -1;

if (!products || products.length === 0) {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      products = data;
      localStorage.setItem('products', JSON.stringify(products));
      displayProducts();
    });
} else {
  displayProducts();
}

function displayProducts() {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    // Stars
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) starsHTML += '<i class="far fa-star"></i>';

    // Thumbnails
    const thumbsHTML = product.thumbnails
      ? product.thumbnails.map(t => `<img src="${t}" class="thumb" alt="">`).join('')
      : '';

    card.innerHTML = `
      <img class="main-img" src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="rating">${starsHTML}<span>${product.rating}/5 (${product.reviews})</span></div>
        <div class="product-price">$${product.price}</div>
        <div class="thumbnails">${thumbsHTML}</div>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;

    productsContainer.appendChild(card);

    // Thumbnail click to change main image
    card.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', () => card.querySelector('.main-img').src = thumb.src);
    });

    // Add to cart
    card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
  });
}

// Add product to cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let existing = cart.find(item => item.name === product.name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showAlert("Added to Cart", `${product.name} added to cart!`);
}

// =========================
// ADMIN PANEL CRUD
// =========================
const table = document.getElementById('productTable');

function displayAdminProducts() {
  if (!table) return;
  table.innerHTML = '';

  products.forEach((product, index) => {
    table.innerHTML += `
      <tr>
        <td><img src="${product.image}"></td>
        <td>${product.name}</td>
        <td>$${product.price}</td>
        <td>${product.rating}/5</td>
        <td>
          <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function addOrUpdateProduct() {
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;
  const rating = parseFloat(document.getElementById('rating').value);
  const reviews = parseInt(document.getElementById('reviews').value);
  const thumbnails = document.getElementById('thumbnails').value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  if (!name || !price || !image || !rating || !reviews) {
    showAlert("Missing Info", "Please fill all fields");
    return;
  }

  const newProduct = { name, price, image, rating, reviews, thumbnails };

  if (editIndex === -1) {
    products.push(newProduct);
  } else {
    products[editIndex] = newProduct;
    editIndex = -1;
    document.getElementById('formTitle').textContent = 'Add Product';
  }

  localStorage.setItem('products', JSON.stringify(products));
  clearForm();
  displayProducts();
  displayAdminProducts();
}

function editProduct(index) {
  const product = products[index];
  document.getElementById('name').value = product.name;
  document.getElementById('price').value = product.price;
  document.getElementById('image').value = product.image;
  document.getElementById('rating').value = product.rating;
  document.getElementById('reviews').value = product.reviews;
  document.getElementById('thumbnails').value = product.thumbnails ? product.thumbnails.join(', ') : '';

  editIndex = index;
  document.getElementById('formTitle').textContent = 'Edit Product';
}

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  displayProducts();
  displayAdminProducts();
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('image').value = '';
  document.getElementById('rating').value = '';
  document.getElementById('reviews').value = '';
  document.getElementById('thumbnails').value = '';
}

// =========================
// MODAL & ADMIN LOGIN
// =========================
const profileIcon = document.getElementById('profileIcon');
const modal = document.getElementById('adminModal');
const errorModal = document.getElementById('errorModal');

profileIcon.addEventListener('click', () => modal.style.display = 'flex');

function closeModal() {
  modal.style.display = 'none';
  document.getElementById('adminPassword').value = '';
}

function checkPassword() {
  const pass = document.getElementById('adminPassword').value;
  if (pass === '1234') {
    modal.style.display = 'none';
    shopContent.style.display = 'none';
    adminPanel.style.display = 'block';
    displayAdminProducts();
  } else {
    closeModal();
    errorModal.style.display = 'flex';
  }
}

function retryLogin() {
  errorModal.style.display = 'none';
  modal.style.display = 'flex';
}

function closeErrorModal() {
  errorModal.style.display = 'none';
}

// =========================
// SPA NAVIGATION (No Refresh)
// =========================
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    const text = e.target.textContent.trim();

    if (text === "Home") {
      adminPanel.style.display = "none";
      shopContent.style.display = "block";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    else if (text === "Categories") {
      adminPanel.style.display = "none";
      shopContent.style.display = "block";
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    } 
    else {
      showAlert("Info", `${text} page not implemented yet!`);
    }
  });
});
