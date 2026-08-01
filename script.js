// JavaScript - المنطق البرمجي التفاعلي والديناميكي لموقع مطعم COOL

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. جلب وعرض العروض والمنيو تلقائياً من الفايربيس
    loadOffersFromFirebase();
    loadMenuFromFirebase();

    // 2. فتح وإغلاق القائمة العلوية في الهواتف الذكية (Mobile Navigation Menu)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // إغلاق القائمة تلقائياً عند الضغط على أي رابط خارجي
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. تفعيل التصفية الديناميكية لمنيو الطعام (Dynamic Menu Filtering)
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            filterMenuItems(filterValue);
        });
    });

    // 4. تغيير الكلاس النشط للروابط بناءً على التمرير (Active Link on Scroll)
    const sections = document.querySelectorAll('section, footer');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});

// دالة جلب وعرض العروض الحية من Firebase
function loadOffersFromFirebase() {
    const offersContainer = document.getElementById('offers-container');
    if (!offersContainer) return;

    database.ref('offers').on('value', snapshot => {
        offersContainer.innerHTML = ''; // تفريغ العروض التجريبية القديمة تلقائياً
        
        if (!snapshot.exists()) {
            offersContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">لا توجد عروض مفعّلة حالياً 🔥</p>';
            return;
        }

        snapshot.forEach(childSnapshot => {
            const offer = childSnapshot.val();
            const offerHTML = `
                <div class="offer-card" data-period="عرض خاص">
                    <div class="offer-badge hot">مباشر</div>
                    <div class="item-img" style="width:100%; height:200px; margin-bottom:15px; border-radius:8px; overflow:hidden;">
                        <img src="${offer.image}" alt="${offer.title}" style="width:100%; height:100%; object-fit:cover;">
                    </div>
                    <h3>${offer.title}</h3>
                    <p class="offer-desc">${offer.desc}</p>
                    <a href="tel:0551483230" class="btn btn-primary btn-block">اطلب العرض الآن</a>
                </div>
            `;
            offersContainer.insertAdjacentHTML('beforeend', offerHTML);
        });
    });
}

// دالة جلب وعرض عناصر المنيو من Firebase
function loadMenuFromFirebase() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    database.ref('menu').on('value', snapshot => {
        menuContainer.innerHTML = ''; // تفريغ الوجبات التجريبية القديمة تلقائياً
        
        if (!snapshot.exists()) {
            menuContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">جاري تحديث المنيو...</p>';
            return;
        }

        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            const itemHTML = `
                <div class="menu-item" data-category="${item.category}">
                    <div class="item-img"><img src="${item.image}" alt="${item.title}"></div>
                    <div class="item-info">
                        <div class="item-title-price"><h3>${item.title}</h3></div>
                        <p class="item-desc">${item.desc}</p>
                        <span class="item-price">${item.price}</span>
                    </div>
                </div>
            `;
            menuContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // إعادة تطبيق الفلترة الحالية إذا كان كاين زر محدد
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            filterMenuItems(activeTab.getAttribute('data-filter'));
        }
    });
}

// دالة مساعدة لفلترة العناصر ديناميكياً
function filterMenuItems(filterValue) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'flex';
            item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

// إضافة تأثيرات تحريك حية للـ CSS عبر الـ JS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(styleSheet);