


window.addEventListener('DOMContentLoaded', () => {

   
    const products = [
      {
        id: 1,
        name: 'Headphone Gaming Keren dengan RGB LED dan Suara Jernih',
        price: 299000,
        originalPrice: 450000,
        rating: 4.8,
        sold: '1rb',
        location: 'Jakarta Barat',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        description: 'Rasakan pengalaman audio imersif dengan headphone gaming ini. Dilengkapi dengan driver 50mm, mikrofon peredam bising, dan lampu RGB yang dapat disesuaikan. Sangat nyaman untuk sesi bermain game yang lama.'
      },
      {
        id: 2,
        name: 'Smartwatch Fitness Tracker Tahan Air IP68',
        price: 450000,
        originalPrice: 700000,
        rating: 4.9,
        sold: '2rb',
        location: 'Surabaya',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop',
        description: 'Pantau kesehatan dan kebugaran Anda 24/7. Smartwatch ini melacak detak jantung, langkah, kalori terbakar, dan kualitas tidur. Tahan air hingga kedalaman 50 meter dan baterai tahan hingga 14 hari.'
      },
      {
        id: 3,
        name: 'Samsung Galaxy A19',
        price: 1800000,
        originalPrice: 2250000,
        rating: 4.8,
        sold: '550',
        location: 'Tanggerang',
        imageUrl: 'https://www.mobilebazar.com.bd/assets/img/Samsung-Galaxy-A19.webp',
        description: 'Handphone Samsung Galaxy A19 merupakan handphone terbaik di kelasnya memiliki fitur utama yaitu penyimpanan 128 GB dan ram 4GB'
      },
      {
        id: 4,
        name: 'Samsung Galaxy A54',
        price: 4900000,
        originalPrice: 5200000,
        rating: 4.6,
        sold: '250',
        location: 'Tanggerang',
        imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTSYZZuGuZ8dcxXgFRH-LyfNo4jIH5Puv_Zd-VUsjMyAgh1ehrOSbnjanacJ1QEQCjmQDcBK8mnFMIhnr0jyQtCWUnhJWDVb-oBAOZtXqLQuhtcf4_w4H41',
        description: 'Spesifikasi - Processor : Exynos 1380 - Size : 6.4- Technology : FHD+ SA HID 120Hz 1000nits- Resolution : Infinity-O- Rear Camera Resolution : 50MP + 12MP + 5MP- Main Camera Auto Focus : Yes- Rear Camera - OIS : Yes Rear Camera - Zoom : Digital Zoom up to 10x- Front Camera Resolution : 32.0 MP- Front Camera Auto Focus : No- Video Resolution : UHD 4K (3840 x 2160)@30fps- RAM : 8GB- ROM : 128GB- SIM Tray : SIM 1 + Hybrid (SIM or MicroSD)- Network Type : 5G- USB Interface : USB Type-C- USB Version : USB 2.0- Earjack : No- Bluetooth Version : Bluetooth v5.3- NFC : Yes- Audio : Stereo- Battery Capacity : 5,000mAh, 25W Fast Charging'
      },
      {
         id: 5,
        name: 'Fortuner',
        price: 524000000,
        originalPrice: 530000000,
        rating: 4.0,
        sold: '0',
        location: 'Jakarta',
        imageUrl: 'https://imgs.search.brave.com/0MwNEc1Yd6MicvEOhG52b0rPzpdpwrw5bM-c34sCerc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdk/LmFlcGxjZG4uY29t/LzM3MHgyMDgvY3cv/ZWMvNDEyNzAvVG95/b3RhLUZvcnR1bmVy/LUV4dGVyaW9yLTE2/Mzg5OC5qcGc_d209/MSZxPTgw',
        description: 'Mobil fortuner second berkualitas tinggi no minus dan siap pakai,  STNK lengkap dan pajak masih jalan'
      }
      // ... isi produk lain di sini bre
    ];

    const gridContainer = document.getElementById('product-grid');
    if (!gridContainer) return; // 


    gridContainer.innerHTML = '';

    products.forEach(product => {
        // BUAT LINK UNTUK SETIAP KARTU
        const cardLink = document.createElement('a');
        cardLink.href = `product.html?id=${product.id}`; 
        cardLink.className = 'product-card-link';

        const discountPercentage = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        cardLink.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    ${discountPercentage > 0 ? `<div class="discount-badge">${discountPercentage}%</div>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-details">
                        <p class="product-price">Rp${product.price.toLocaleString('id-ID')}</p>
                        ${product.originalPrice ? `<span class="original-price">Rp${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
                        <div class="product-meta">
                            <span class="product-rating">
                                <span class="star">★</span> ${product.rating}
                            </span>
                            <span style="margin: 0 8px;">|</span>
                            <span>Terjual ${product.sold}+</span>
                        </div>
                        <p class="product-location">${product.location}</p>
                    </div>
                </div>
            </div>
        `;
        
        gridContainer.appendChild(cardLink);
    });
});
