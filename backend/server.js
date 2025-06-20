// Import paket yang dibutuhkan
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config(); // Untuk memuat variabel dari file .env

// ==========================================================
// == KODE DEBUGGING UNTUK MELIHAT NILAINYA (BISA DIHAPUS SAAT PRODUKSI) ==
console.log('Mencoba membaca kredensial dari .env file...');
console.log('EMAIL_USER yang terbaca:', process.env.EMAIL_USER);
console.log('EMAIL_PASS yang terbaca:', process.env.EMAIL_PASS ? '*** DITERIMA (tidak ditampilkan demi keamanan) ***' : '!!! KOSONG/UNDEFINED !!!');
// ==========================================================

// Inisialisasi aplikasi Express
const app = express();
const port = process.env.PORT || 3000; // Menggunakan port dari .env atau default 3000

// Middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain (front-end Anda)
app.use(express.json()); // Mem-parsing body permintaan JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body dari form

// Konfigurasi Multer untuk menangani upload file di memori
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Konfigurasi Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Anda bisa ganti dengan service lain (misal: 'outlook', 'sendgrid', dll.)
    auth: {
        user: process.env.EMAIL_USER, // Ambil dari file .env
        pass: process.env.EMAIL_PASS, // Ambil dari file .env
    },
});

// Membuat Endpoint/Route untuk menerima pesanan
// Menggunakan 'upload.single('screenshot')' untuk menangani satu file yang dinamai 'screenshot'
app.post('/send-order', upload.single('screenshot'), (req, res) => {
    // Pastikan 'screenshot' cocok dengan nama field 'name' dari input file di FormData front-end

    // Data dari form di-parsing dari req.body
    // Penting: Pastikan data 'user' dan 'cart' dikirim sebagai stringified JSON dari front-end
    const user = JSON.parse(req.body.user);
    const cart = JSON.parse(req.body.cart);
    const paymentMethod = req.body.paymentMethod;

    // File yang di-upload ada di req.file
    const screenshot = req.file;

    // Validasi dasar: Pastikan semua data yang diperlukan ada
    if (!user || !cart || !paymentMethod || !screenshot) {
        return res.status(400).send('Data pesanan tidak lengkap. Pastikan semua field terisi dan screenshot diunggah.');
    }

    // Hitung total harga untuk email
    let totalPrice = 0;
    let itemsHtml = '';
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">Rp${(item.price * item.quantity).toLocaleString('id-ID')}</td>
            </tr>`;
    });

    // Konten Email (menggunakan HTML untuk format yang lebih baik)
    const mailOptions = {
        from: process.env.EMAIL_USER, // Email pengirim (biasanya sama dengan EMAIL_USER)
        to: process.env.EMAIL_USER, // Kirim ke email Anda sendiri sebagai penjual
        subject: `[PESANAN BARU] - Dari ${user.name}`,
        html: `
            <h1>Pesanan Baru Diterima!</h1>
            <p>Anda telah menerima pesanan baru. Berikut rinciannya:</p>
            
            <h3>Detail Pelanggan</h3>
            <ul>
                <li><strong>Nama:</strong> ${user.name}</li>
                <li><strong>Alamat Pengiriman:</strong> ${user.address}</li>
                <li><strong>Email:</strong> ${user.email || 'Tidak tersedia'}</li>
                <li><strong>Telepon:</strong> ${user.phone || 'Tidak tersedia'}</li>
            </ul>

            <h3>Detail Pesanan</h3>
            <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>Produk</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr style="background-color: #e6e6e6;">
                        <th colspan="2" style="text-align: right;">Total Harga:</th>
                        <th style="text-align: right;">Rp${totalPrice.toLocaleString('id-ID')}</th>
                    </tr>
                </tfoot>
            </table>

            <h3>Detail Pembayaran</h3>
            <ul>
                <li><strong>Metode Pembayaran:</strong> ${paymentMethod}</li>
            </ul>
            <p>Bukti pembayaran terlampir.</p>
            <br>
            <p>Terima kasih!</p>
        `,
        attachments: [
            {
                filename: screenshot.originalname,
                content: screenshot.buffer, // Buffer file dari Multer
                contentType: screenshot.mimetype // Tambahkan tipe konten file
            },
        ],
    };

    // Kirim email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Gagal mengirim email:', error); // Gunakan console.error untuk error
            res.status(500).send('Terjadi kesalahan saat mengirim email. Silakan coba lagi nanti.');
        } else {
            console.log('Email terkirim:', info.response);
            res.status(200).send('Pesanan berhasil dikirim! Silakan tunggu konfirmasi.');
        }
    });
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server back-end berjalan di http://localhost:${port}`);
    console.log('Siap menerima pesanan...');
});