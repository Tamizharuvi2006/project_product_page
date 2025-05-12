// Initialize product gallery
function initGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Update main image
            mainImage.src = thumbnail.dataset.fullsize;
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
    });
}

// Initialize modals
function initModals() {
    const sizeChartBtn = document.getElementById('size-chart-btn');
    const compareColorsBtn = document.getElementById('compare-colors-btn');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Size Chart Modal
    sizeChartBtn.addEventListener('click', () => openModal('size-chart-modal'));

    // Compare Colors Modal
    compareColorsBtn.addEventListener('click', () => openModal('compare-colors-modal'));

    // Close button functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.modal'));
        });
    });

    // Close on overlay click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

// Initialize product variants
function initVariants() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const sizeOptions = document.querySelectorAll('.size-option');
    const selectedColorText = document.getElementById('selected-color');
    const selectedSizeText = document.getElementById('selected-size');
    const mainImage = document.getElementById('main-image');

    // Load saved preferences from localStorage
    const savedColor = localStorage.getItem('selectedColor');
    const savedSize = localStorage.getItem('selectedSize');

    function updateVariant(elements, selectedElement, storageKey, displayElement) {
        elements.forEach(element => element.classList.remove('selected'));
        selectedElement.classList.add('selected');
        localStorage.setItem(storageKey, selectedElement.dataset[storageKey.toLowerCase()]);
        if (displayElement) {
            displayElement.textContent = selectedElement.dataset[storageKey.toLowerCase()];
        }
    }

    // Color variant handling
    colorSwatches.forEach(swatch => {
        if (savedColor && swatch.dataset.color === savedColor) {
            updateVariant(colorSwatches, swatch, 'color', selectedColorText);
            mainImage.src = swatch.dataset.image;
        }

        swatch.addEventListener('click', () => {
            updateVariant(colorSwatches, swatch, 'color', selectedColorText);
            mainImage.src = swatch.dataset.image;
        });
    });

    // Size variant handling
    sizeOptions.forEach(option => {
        if (savedSize && option.textContent === savedSize) {
            updateVariant(sizeOptions, option, 'size', selectedSizeText);
        }

        option.addEventListener('click', () => {
            updateVariant(sizeOptions, option, 'size', selectedSizeText);
        });
    });
}

// Initialize tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Update active tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('text-blue-600');
                btn.classList.remove('border-blue-600');
            });
            button.classList.add('active');
            button.classList.add('text-blue-600');
            button.classList.add('border-blue-600');

            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Initialize quantity selector
function initQuantity() {
    const decreaseBtn = document.querySelector('.quantity-decrease');
    const increaseBtn = document.querySelector('.quantity-increase');
    const quantityDisplay = document.querySelector('.quantity-display');

    let quantity = 1;

    decreaseBtn?.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });

    increaseBtn?.addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });
}
// Initialize cart overlay
function initCart() {
    const cartButton = document.querySelector('.fa-shopping-cart').closest('button');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartButton = document.getElementById('close-cart');
    const addToCartBtn = document.querySelector('button:has(.fa-shopping-cart)');
    const cartCount = cartButton.querySelector('span');
    let cartItems = [];

    function updateCartCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateCartDisplay() {
        const cartItemsContainer = cartOverlay.querySelector('.space-y-4');
        const subtotalElement = cartOverlay.querySelector('.flex.justify-between.text-sm:first-child span:last-child');
        const totalElement = cartOverlay.querySelector('.flex.justify-between.text-lg span:last-child');

        // Clear existing items
        cartItemsContainer.innerHTML = '';

        // Add each item to the cart display
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 pb-4 border-b';
            itemElement.innerHTML = `
                <img src="${item.image}" 
                     alt="${item.name}" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-sm text-gray-500">Size: ${item.size} | Color: ${item.color}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="font-bold">₹${item.price}</span>
                        <div class="flex items-center gap-2">
                            <button class="text-gray-500 hover:text-gray-700 quantity-decrease"><i class="fas fa-minus"></i></button>
                            <span>${item.quantity}</span>
                            <button class="text-gray-500 hover:text-gray-700 quantity-increase"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;

            // Add quantity control event listeners
            const decreaseBtn = itemElement.querySelector('.quantity-decrease');
            const increaseBtn = itemElement.querySelector('.quantity-increase');
            const quantityDisplay = itemElement.querySelector('.flex.items-center.gap-2 span');

            decreaseBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantityDisplay.textContent = item.quantity;
                    updateCartCount();
                    updateCartTotals();
                }
            });

            increaseBtn.addEventListener('click', () => {
                item.quantity++;
                quantityDisplay.textContent = item.quantity;
                updateCartCount();
                updateCartTotals();
            });

            cartItemsContainer.appendChild(itemElement);
        });

        updateCartTotals();
    }

    function updateCartTotals() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalElement = cartOverlay.querySelector('.flex.justify-between.text-sm:first-child span:last-child');
        const totalElement = cartOverlay.querySelector('.flex.justify-between.text-lg span:last-child');

        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`; // Add shipping cost if applicable
    }

    function addToCart(item) {
        const existingItem = cartItems.find(i => 
            i.name === item.name && 
            i.size === item.size && 
            i.color === item.color
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cartItems.push(item);
        }

        updateCartCount();
        updateCartDisplay();
    }

    addToCartBtn?.addEventListener('click', () => {
        const selectedSize = document.getElementById('selected-size').textContent;
        const selectedColor = document.getElementById('selected-color').textContent;
        const quantity = parseInt(document.querySelector('.quantity-display').textContent);
        const price = 2599.99; // This should be dynamic in a real application
        const currentImage = document.getElementById('main-image').src;

        addToCart({
            name: 'Premium Nike Sneakers',
            size: selectedSize,
            color: selectedColor,
            quantity: quantity,
            price: price,
            image: currentImage
        });
    });

    cartButton?.addEventListener('click', () => {
        cartOverlay.classList.remove('hidden');
        cartOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    closeCartButton?.addEventListener('click', () => {
        cartOverlay.classList.remove('flex');
        cartOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    cartOverlay?.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('flex');
            cartOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize user overlay
function initUserOverlay() {
    const userBtn = document.getElementById('user-btn');
    const userOverlay = document.getElementById('user-overlay');
    const closeUser = document.getElementById('close-user');

    userBtn.addEventListener('click', () => {
        userOverlay.classList.remove('hidden');
        userOverlay.classList.add('flex');
        document.body.style.overflow = 'hidden';
    });

    closeUser.addEventListener('click', () => {
        userOverlay.classList.remove('flex');
        userOverlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    userOverlay.addEventListener('click', (e) => {
        if (e.target === userOverlay) {
            userOverlay.classList.remove('flex');
            userOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');
    const menuContent = mobileMenu.querySelector('div');

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        requestAnimationFrame(() => {
            menuContent.classList.remove('translate-x-full');
        });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuContent.classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenu.classList.remove('flex');
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    mobileMenuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });
}

// Initialize search overlay
function initSearchOverlay() {
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search');
    const searchModal = searchOverlay.querySelector('.absolute');

    function openSearch() {
        searchOverlay.classList.remove('hidden');
        searchOverlay.classList.add('flex');
        // Trigger animation after a small delay
        requestAnimationFrame(() => {
            searchModal.classList.remove('scale-95', 'opacity-0');
            searchModal.classList.add('scale-100', 'opacity-100');
        });
        document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
        searchModal.classList.add('scale-95', 'opacity-0');
        searchModal.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            searchOverlay.classList.remove('flex');
            searchOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    searchBtn.addEventListener('click', openSearch);
    closeSearchBtn.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
}

// Call initialization functions
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initModals();
    initVariants();
    initTabs();
    initQuantity();
    initCart();
    initUserOverlay();
    initMobileMenu();
    initSearchOverlay();
});
