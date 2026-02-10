// Gestion du panier
let cart = [];

// Charger le panier depuis le LocalStorage
function loadCart() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartDisplay();
}

// Sauvegarder le panier dans LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Ajouter un produit au panier
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification(`${name} ajouté au panier!`);
}

// Supprimer un produit du panier
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartDisplay();
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Le panier est vide</p>';
        cartTotal.textContent = '0,00 €';
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        html += `
            <div class="cart-item">
                <div class="item-info">
                    <p class="item-name">${item.name}</p>
                    <p class="item-price">${item.price.toFixed(2).replace('.', ',')} € × ${item.quantity}</p>
                </div>
                <div class="item-actions">
                    <span class="item-subtotal">${subtotal.toFixed(2).replace('.', ',')} €</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    cartTotal.textContent = total.toFixed(2).replace('.', ',') + ' €';
    checkoutBtn.disabled = false;
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Gérer le panier déroulant
document.addEventListener('DOMContentLoaded', () => {
    const cartToggle = document.getElementById('cartToggle');
    const cartContainer = document.querySelector('.cart-container');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Toggle du panier
    cartToggle.addEventListener('click', () => {
        cartContainer.classList.toggle('closed');
    });
    
    // Commande
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Commande passée avec succès!\nTotal: ${total.toFixed(2).replace('.', ',')} €\n\nVous recevrez un email de confirmation.`);
            cart = [];
            saveCart();
            updateCartDisplay();
        }
    });
    
    // Charger le panier au démarrage
    loadCart();
});
