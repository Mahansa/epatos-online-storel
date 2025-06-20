document.addEventListener('DOMContentLoaded', () => {
    // Data untuk setiap metode pembayaran (bisa diganti)
    const paymentData = {
        gopay: {
            name: 'GoPay',
            logo: 'https://seeklogo.com/images/G/gopay-logo-9527C7620E-seeklogo.com.png',
            number: '081234567890', // Nomor GoPay Tujuan
            instructions: 'Buka aplikasi Gojek, pilih menu Bayar, lalu scan QR atau transfer ke nomor di atas.'
        },
        dana: {
            name: 'DANA',
            logo: 'https://seeklogo.com/images/D/dana-logo-C5152B824C-seeklogo.com.png',
            number: '089876543210', // Nomor DANA Tujuan
            instructions: 'Buka aplikasi DANA, pilih menu Kirim, lalu masukkan nomor tujuan di atas.'
        },
        ovo: {
            name: 'OVO',
            logo: 'https://seeklogo.com/images/O/ovo-logo-135B026343-seeklogo.com.png',
            number: '085511223344', // Nomor OVO Tujuan
            instructions: 'Buka aplikasi OVO, pilih menu Transfer, lalu masukkan nomor tujuan di atas.'
        },
        bca: {
            name: 'BCA Virtual Account',
            logo: 'https://seeklogo.com/images/B/bca-logo-592833912B-seeklogo.com.png',
            number: '880881234567890', // Nomor VA BCA
            instructions: 'Buka m-BCA, pilih m-Transfer, lalu BCA Virtual Account. Masukkan nomor di atas dan selesaikan pembayaran.'
        },
        bri: {
            name: 'BRI Virtual Account',
            logo: 'https://seeklogo.com/images/B/bri-logo-35A1D46294-seeklogo.com.png',
            number: '990991234567890', // Nomor VA BRI (BRIVA)
            instructions: 'Buka BRImo, pilih BRIVA, lalu masukkan nomor di atas dan selesaikan pembayaran.'
        }
    };

    const params = new URLSearchParams(window.location.search);
    const method = params.get('method');
    const details = paymentData[method];

    if (!details) {
        document.querySelector('.payment-container').innerHTML = '<h1>Metode Pembayaran Tidak Valid</h1><a href="index.html" class="back-link">&larr; Kembali ke Toko</a>';
        return;
    }

    // Mengisi detail ke halaman
    document.getElementById('payment-logo').src = details.logo;
    document.getElementById('payment-title').textContent = `Pembayaran via ${details.name}`;
    document.getElementById('payment-number').textContent = details.number;
    document.getElementById('payment-instructions').textContent = details.instructions;
    
    // Fungsi tombol Salin
    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(details.number).then(() => {
            alert('Nomor berhasil disalin!');
        });
    });

    // Fungsi Timer (30 menit)
    let timeLeft = 30 * 60;
    const timerEl = document.getElementById('countdown-timer');
    const timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerEl.textContent = `${minutes}:${seconds}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerEl.textContent = "Waktu Habis";
            document.getElementById('confirmation-form').style.display = 'none';
        }
    }, 1000);

    // Fungsi form konfirmasi
   // Fungsi form konfirmasi
document.getElementById('confirmation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const screenshotInput = document.getElementById('screenshot-upload');
    if (screenshotInput.files.length === 0) {
        alert('Mohon unggah bukti transfer Anda.');
        return;
    }

    // Ambil data dari localStorage
    const user = localStorage.getItem('currentUser');
    const cart = localStorage.getItem('cart');
    const paymentMethod = details.name; // 'details' dari bagian atas script ini

    if (!user || !cart) {
        alert("Data user atau keranjang tidak ditemukan. Silakan ulangi dari awal.");
        window.location.href = 'index.html';
        return;
    }

    // Gunakan FormData untuk mengirim file dan data teks bersamaan
    const formData = new FormData();
    formData.append('screenshot', screenshotInput.files[0]);
    formData.append('user', user); // Kirim sebagai string JSON
    formData.append('cart', cart); // Kirim sebagai string JSON
    formData.append('paymentMethod', paymentMethod);

    // Kirim data ke back-end
    try {
        const response = await fetch('http://localhost:3000/send-order', {
            method: 'POST',
            body: formData, // Tidak perlu header Content-Type, browser akan menanganinya
        });

        if (response.ok) {
            alert("Terima kasih! Pesanan Anda telah diterima dan akan segera kami proses.");
            
            // Kosongkan keranjang dan kembali ke halaman utama
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        } else {
            // Tangani error dari server
            const errorText = await response.text();
            alert(`Gagal mengirim pesanan: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Tidak dapat terhubung ke server. Pastikan server back-end sudah berjalan.');
    }
});
    });
