// Основной JavaScript для сайта GameTech

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация корзины
    initCart();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация анимаций при прокрутке
    initScrollAnimations();
    
    // Инициализация функциональности корзины
    initCartFunctionality();
    
    // Инициализация FAQ на странице контактов
    initFAQ();
});

// Инициализация корзины
function initCart() {
    let cart = JSON.parse(localStorage.getItem('gametech-cart')) || [];
    updateCartCount(cart.length);
    return cart;
}

// Обновление счетчика корзины
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Инициализация мобильного меню
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Инициализация анимаций при прокрутке
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .value-card, .team-member');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// Инициализация функциональности корзины
function initCartFunctionality() {
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Открытие/закрытие корзины
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            updateCartDisplay();
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Добавление товара в корзину
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace(/[^\d.]/g, ''));
            const productImage = productCard.querySelector('img').src;
            
            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                id: Date.now().toString()
            });
            
            // Анимация добавления в корзину
            this.textContent = 'Добавлено!';
            this.style.background = '#00cc00';
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.style.background = '';
            }, 1500);
        });
    });
    
    // Функция добавления в корзину
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('gametech-cart')) || [];
        cart.push(product);
        localStorage.setItem('gametech-cart', JSON.stringify(cart));
        updateCartCount(cart.length);
        
        // Если корзина открыта, обновляем отображение
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            updateCartDisplay();
        }
    }
    
    // Обновление отображения корзины
    function updateCartDisplay() {
        if (!cartItems || !cartTotal) return;
        
        let cart = JSON.parse(localStorage.getItem('gametech-cart')) || [];
        let total = 0;
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            cartTotal.textContent = '0';
            return;
        }
        
        cart.forEach(item => {
            total += item.price;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">×</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(0);
        
        // Добавляем обработчики для кнопок удаления
        const removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                removeFromCart(itemId);
            });
        });
    }
    
    // Удаление товара из корзины
    function removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('gametech-cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('gametech-cart', JSON.stringify(cart));
        updateCartCount(cart.length);
        updateCartDisplay();
    }
    
    // Обработка оформления заказа
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('gametech-cart')) || [];
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            alert('Заказ оформлен! Спасибо за покупку!');
            localStorage.removeItem('gametech-cart');
            updateCartCount(0);
            updateCartDisplay();
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
            }
        });
    }
}

// Инициализация FAQ на странице контактов
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
}