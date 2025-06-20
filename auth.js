document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('main-nav');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const loginForm = document.getElementById('login-form');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Cek status login dan tampilkan UI yang sesuai
    const checkLoginStatus = () => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            mainNav.innerHTML = `
                <div class="user-profile">
                    <span>Halo, ${userData.name}</span>
                    <div class="nav-cart" id="nav-cart-icon">
                        <span class="cart-icon">🛒</span>
                        <span class="cart-count" id="cart-item-count">0</span>
                    </div>
                    <button class="logout-btn">Logout</button>
                </div>
            `;
            mainNav.querySelector('.logout-btn').addEventListener('click', handleLogout);
            mainNav.querySelector('#nav-cart-icon').addEventListener('click', showCartModal);
            updateCartIcon(); // Update angka pada ikon keranjang
        } else {
            mainNav.innerHTML = '<button class="login-btn">Login</button>';
            mainNav.querySelector('.login-btn').addEventListener('click', () => {
                loginModal.style.display = 'flex';
            });
        }
    };

    const handleLogout = () => {
        // Opsi: Tanyakan apakah pengguna juga ingin mengosongkan keranjang saat logout
        // const clearCart = confirm("Apakah Anda ingin mengosongkan keranjang belanja Anda?");
        // if (clearCart) {
        //     localStorage.removeItem('cart');
        // }
        localStorage.removeItem('currentUser');
        alert('Anda telah logout.');
        window.location.reload();
    };

    // --- LOGIC MODAL LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userName = document.getElementById('user-name').value;
            const userAddress = document.getElementById('user-address').value;

            if (userName && userAddress) {
                const user = { name: userName, address: userAddress };
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Login berhasil! Selamat datang, ${userName}.`);
                loginModal.style.display = 'none';
                loginForm.reset();
                checkLoginStatus();
            }
        });
    }

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => loginModal.style.display = 'none');
    }

    if(loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.style.display = 'none';
        });
    }

    // --- LOGIC MODAL KERANJANG ---
    const showCartModal = () => {
        renderCartItems();
        cartModal.style.display = 'flex';
    };

    const renderCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.getElementById('cart-items-container');
        const totalPriceEl = document.getElementById('cart-total-price');
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Keranjang Anda masih kosong.</p>';
            totalPriceEl.textContent = 'Rp0';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        cartContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${item.quantity} x Rp${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-from-cart-btn" data-product-id="${item.id}">&times;</button>
                </div>
            `;
            cartContainer.appendChild(itemElement);
            totalPrice += item.price * item.quantity;
        });

        totalPriceEl.textContent = `Rp${totalPrice.toLocaleString('id-ID')}`;
        
        // Tambahkan event listener untuk semua tombol hapus
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                removeFromCart(productId);
            });
        });
    };

    const removeFromCart = (productId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        renderCartItems(); // Perbarui tampilan modal
        updateCartIcon(); // Perbarui angka di ikon header
    };
    
    const updateCartIcon = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountEl = document.getElementById('cart-item-count');
        if (cartCountEl) {
             // Hitung total kuantitas, bukan hanya jumlah item
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = totalQuantity;
            cartCountEl.style.display = totalQuantity > 0 ? 'block' : 'none';
        }
    };

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => cartModal.style.display = 'none');
    }
    
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.style.display = 'none';
        });
    }

    // ... (kode auth.js lainnya)
    const paymentMethodModal = document.getElementById('payment-method-modal');
    const closePaymentMethodBtn = document.getElementById('close-payment-method-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Tutup modal keranjang dan buka modal pemilihan pembayaran
            cartModal.style.display = 'none';
            paymentMethodModal.style.display = 'flex';
        });
    }

    if(closePaymentMethodBtn) {
        closePaymentMethodBtn.addEventListener('click', () => {
            paymentMethodModal.style.display = 'none';
        });
    }

    // Tambahkan event listener untuk setiap opsi pembayaran
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            const method = option.getAttribute('data-method');
            if (method === 'cod') {
                alert('Metode pembayaran COD akan segera tersedia. Silakan pilih metode lain.');
                return;
            }
            // Arahkan ke halaman pembayaran dengan metode yang dipilih
            window.location.href = `payment.html?method=${method}`;
        });
    });

// ... (sisa kode auth.js Anda)


    // Fungsi ini dibuat global agar bisa dipanggil dari product-detail.js
    window.showLoginModal = () => {
        if(loginModal) {
            loginModal.style.display = 'flex';
        }
    }
    
    // Fungsi ini juga dibuat global
    window.updateCartIcon = updateCartIcon;

   
    checkLoginStatus();
});