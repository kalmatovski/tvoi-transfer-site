const translations = {
  ru: {
    nav_home: "Главная",
    nav_routes: "Маршруты",
    nav_fleet: "Автопарк",
    nav_about: "О нас",
    contact_btn: "Связаться",
    hero_title_1: "Откройте для себя",
    hero_title_2: "Красоту Кыргызстана",
    hero_subtitle:
      "Индивидуальные туры и комфортабельный трансфер в любую точку страны.",
    hero_cta: "Выбрать маршрут",
    whatsapp_btn: "Написать в WhatsApp",
    routes_title: "Популярные направления",
    routes_subtitle: "Выберите куда вы хотите поехать",
    fleet_title: "Наш Автопарк",
    fleet_subtitle: "Только комфортабельные и исправные автомобили",
    why_us_title: "Почему выбирают",
    why_us_highlight: "нас?",
    feature_1_title: "Безопасность",
    feature_1_desc:
      "Все наши водители проходят строгий отбор, а автомобили регулярный техосмотр для вашего спокойствия.",
    feature_2_title: "Пунктуальность",
    feature_2_desc:
      "Мы ценим ваше время: подаем машину заранее и отслеживаем рейсы, чтобы встретить вас вовремя.",
    feature_3_title: "Честные цены",
    feature_3_desc:
      "Фиксированные цены без скрытых доплат. Вы знаете точную стоимость поездки еще до бронирования.",
    contact_title: "Готовы к поездке?",
    contact_desc:
      "Свяжитесь с нами любым удобным способом, и мы организуем вашу поездку на высшем уровне.",
    footer_rights: "© 2025 Все права защищены.",
    footer_privacy: "Политика конфиденциальности",
    footer_admin: "Вход для админа",
    order_btn: "Заказать",
    empty_routes: "Маршруты пока не добавлены.",
    empty_cars: "Автомобили пока не добавлены.",
    car_seats: "мест",
    default_features: ["Кондиционер", "Комфортный салон"],
    reviews_title: "Отзывы клиентов",
    reviews_subtitle: "Что говорят о нас наши пассажиры",
    leave_review_btn: "Оставить отзыв",
    review_modal_title: "Оставить отзыв",
    review_name_label: "Ваше имя",
    review_text_label: "Ваш отзыв",
    review_photo_label: "Ссылка на фото (необязательно)",
    review_submit_btn: "Отправить",
    review_success: "Спасибо за ваш отзыв!",
    empty_reviews: "Пока нет отзывов. Будьте первым!",
    label_from: "Откуда",
    label_to: "Куда",
    badge_transfer: "Трансфер",
  },
  en: {
    nav_home: "Home",
    nav_routes: "Routes",
    nav_fleet: "Fleet",
    nav_about: "About Us",
    contact_btn: "Contact Us",
    hero_title_1: "Discover the",
    hero_title_2: "Beauty of Kyrgyzstan",
    hero_subtitle:
      "Individual tours and comfortable transfers to anywhere in the country.",
    hero_cta: "Choose Route",
    whatsapp_btn: "Chat on WhatsApp",
    routes_title: "Popular Destinations",
    routes_subtitle: "Choose where you want to go",
    fleet_title: "Our Fleet",
    fleet_subtitle: "Only comfortable and well-maintained vehicles",
    why_us_title: "Why Choose",
    why_us_highlight: "Us?",
    feature_1_title: "Safety",
    feature_1_desc:
      "All our drivers undergo strict selection, and cars undergo regular technical inspection for your peace of mind.",
    feature_2_title: "Punctuality",
    feature_2_desc:
      "We value your time: we provide the car in advance and track flights to meet you on time.",
    feature_3_title: "Fair Prices",
    feature_3_desc:
      "Fixed prices with no hidden fees. You know the exact cost of the trip before booking.",
    contact_title: "Ready for a trip?",
    contact_desc:
      "Contact us in any convenient way, and we will organize your trip at the highest level.",
    footer_rights: "© 2025 All rights reserved.",
    footer_privacy: "Privacy Policy",
    footer_admin: "Admin Login",
    order_btn: "Book Now",
    empty_routes: "No routes added yet.",
    empty_cars: "No cars added yet.",
    car_seats: "seats",
    default_features: ["Air Conditioner", "Comfortable Interior"],
    reviews_title: "Client Reviews",
    reviews_subtitle: "What our passengers say about us",
    leave_review_btn: "Leave a Review",
    review_modal_title: "Leave a Review",
    review_name_label: "Your Name",
    review_text_label: "Your Review",
    review_photo_label: "Photo URL (optional)",
    review_submit_btn: "Submit",
    review_success: "Thank you for your review!",
    empty_reviews: "No reviews yet. Be the first!",
    label_from: "From",
    label_to: "To",
    badge_transfer: "Transfer",
  },
};

let currentLang = localStorage.getItem("tvoitransfer_lang") || "ru";

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  renderRoutes();
  renderCars();
  renderReviews();
  initHeroSlider();
  initReviewPage();
  initSnowEffect();
});

function initLanguage() {
  const langBtn = document.getElementById("lang-toggle");
  const mobileLangBtn = document.getElementById("mobile-lang-toggle");

  updateLanguageUI();

  const toggleLang = () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    localStorage.setItem("tvoitransfer_lang", currentLang);
    updateLanguageUI();
    renderRoutes();
    renderCars();
    renderReviews();
  };

  if (langBtn) langBtn.addEventListener("click", toggleLang);
  if (mobileLangBtn) mobileLangBtn.addEventListener("click", toggleLang);
}

function initSwipeHints() {
  const checkAndShowHint = (containerId, hintId, storageKey) => {
    const container = document.getElementById(containerId);
    const hint = document.getElementById(hintId);

    if (!container || !hint) return;

    // Check if already dismissed
    if (localStorage.getItem(storageKey) === "true") return;

    // Check if content overflows (is scrollable)
    // We might need a small delay to ensure content is rendered and layout is calculated
    setTimeout(() => {
      if (container.scrollWidth > container.clientWidth) {
        hint.classList.add("active");

        // Add scroll listener to dismiss
        const onScroll = () => {
          hint.classList.remove("active");
          localStorage.setItem(storageKey, "true");
          container.removeEventListener("scroll", onScroll);
          // Remove from DOM after animation to clean up
          setTimeout(() => hint.remove(), 500);
        };

        container.addEventListener("scroll", onScroll, { passive: true });

        // Also dismiss on touch start (for immediate feedback)
        container.addEventListener("touchstart", onScroll, {
          passive: true,
          once: true,
        });
      }
    }, 1000); // Delay to allow rendering and AOS animations
  };

  checkAndShowHint(
    "routes-container",
    "routes-hint",
    "tvoitransfer_routes_hint_dismissed"
  );
  checkAndShowHint(
    "cars-container",
    "cars-hint",
    "tvoitransfer_cars_hint_dismissed"
  );
}

function updateLanguageUI() {
  const desktopLangSpan = document.getElementById("current-lang");
  const mobileLangSpan = document.getElementById("mobile-current-lang");

  if (desktopLangSpan) desktopLangSpan.textContent = currentLang.toUpperCase();
  if (mobileLangSpan) mobileLangSpan.textContent = currentLang.toUpperCase();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 5000;

  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, slideInterval);
}

function renderRoutes() {
  const container = document.getElementById("routes-container");
  if (!container) return;

  const routes = DataManager.getRoutes();
  const t = translations[currentLang];

  if (routes.length === 0) {
    container.innerHTML = `<p class="text-center col-span-full text-gray-500">${t.empty_routes}</p>`;
    return;
  }

  container.innerHTML = routes
    .map((route, index) => {
      const from =
        currentLang === "en" && route.from_en ? route.from_en : route.from;
      const to = currentLang === "en" && route.to_en ? route.to_en : route.to;

      return `
        <div class="min-w-[85vw] md:min-w-[380px] snap-center bg-white rounded-2xl shadow-xl overflow-hidden card-hover group border-2 border-transparent hover:border-primary/20 transition-all duration-300 flex flex-col" data-aos="${
          index % 2 === 0 ? "fade-right" : "fade-left"
        }" data-aos-delay="${index * 100}">
            <!-- Image Container -->
            <div class="relative h-56 overflow-hidden bg-white shrink-0">
                <img src="${
                  route.image_from || route.image
                }" alt="${from} - ${to}" class="w-full h-full object-cover transition duration-700 group-hover:scale-110">
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
                
                <!-- Badge -->
                <div class="absolute top-3 right-3 z-20">
                    <span class="bg-yellow-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-widest">${
                      t.badge_transfer
                    }</span>
                </div>
            </div>
            
            <!-- Content Container -->
            <div class="p-5 flex flex-col flex-grow">
                <!-- Route Text -->
                <div class="flex items-center justify-between mb-6 flex-grow">
                    <div class="text-left w-1/2 pr-3 border-r-2 border-gray-100">
                        <div class="flex items-center gap-1 text-xs text-orange-500 uppercase font-black tracking-widest mb-2">
                            <i class="fas fa-circle text-[8px]"></i>
                            ${t.label_from}
                        </div>
                        <h3 class="text-2xl md:text-3xl font-black text-gray-800 leading-none break-words uppercase tracking-tight">${from}</h3>
                    </div>
                    
                    <div class="text-right w-1/2 pl-3">
                        <div class="flex items-center justify-end gap-1 text-xs text-green-600 uppercase font-black tracking-widest mb-2">
                            ${t.label_to}
                            <i class="fas fa-circle text-[8px]"></i>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-black text-gray-800 leading-none break-words uppercase tracking-tight">${to}</h3>
                    </div>
                </div>

                <a href="https://wa.me/996704595969?text=Здравствуйте, хочу заказать трансфер ${from} - ${to}" target="_blank" 
                   class="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-white text-lg text-center py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 transform transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-auto">
                    <span>${t.order_btn}</span>
                    <i class="fab fa-whatsapp text-xl"></i>
                </a>
            </div>
        </div>
        `;
    })
    .join("");
}

function renderReviews() {
  const container = document.getElementById("reviews-container");
  if (!container) return;

  const reviews = DataManager.getReviews();
  const t = translations[currentLang];

  const titleEl = document.querySelector('[data-i18n="reviews_title"]');
  const subtitleEl = document.querySelector('[data-i18n="reviews_subtitle"]');
  const btnEl = document.querySelector('[data-i18n="leave_review_btn"]');

  if (titleEl) titleEl.textContent = t.reviews_title;
  if (subtitleEl) subtitleEl.textContent = t.reviews_subtitle;
  if (btnEl) btnEl.textContent = t.leave_review_btn;

  if (reviews.length === 0) {
    container.innerHTML = `<p class="text-center col-span-full text-gray-500 italic">${t.empty_reviews}</p>`;
    return;
  }

  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

  container.innerHTML = reviews
    .map((review, index) => {
      const date = new Date(review.date).toLocaleDateString(
        currentLang === "ru" ? "ru-RU" : "en-US"
      );
      const defaultAvatar = "assets/images/default-avatar.png";
      const avatar =
        review.photo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          review.name
        )}&background=random`;

      return `
        <div class="min-w-[85vw] md:min-w-[350px] snap-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20" data-aos="fade-up" data-aos-delay="${
          index * 100
        }">
            <div class="flex items-center gap-4 mb-4">
                <img src="${avatar}" alt="${
        review.name
      }" class="w-12 h-12 rounded-full object-cover shadow-sm">
                <div>
                    <h4 class="font-bold text-gray-900">${review.name}</h4>
                    <span class="text-xs text-gray-500">${date}</span>
                </div>
            </div>
            <p class="text-gray-600 italic">"${review.text}"</p>
        </div>
    `;
    })
    .join("");
}

function initReviewPage() {
  const form = document.getElementById("review-page-form");

  if (!form) return;

  const updateFormText = () => {
    const t = translations[currentLang];
    const titleEl = document.querySelector('[data-i18n="review_modal_title"]');
    const nameLabel = document.querySelector('[data-i18n="review_name_label"]');
    const textLabel = document.querySelector('[data-i18n="review_text_label"]');
    const photoLabel = document.querySelector(
      '[data-i18n="review_photo_label"]'
    );
    const submitBtn = document.querySelector('[data-i18n="review_submit_btn"]');
    const subtitleEl = document.querySelector('[data-i18n="reviews_subtitle"]');

    if (titleEl) titleEl.textContent = t.review_modal_title;
    if (nameLabel) nameLabel.textContent = t.review_name_label;
    if (textLabel) textLabel.textContent = t.review_text_label;
    if (photoLabel) photoLabel.textContent = t.review_photo_label;
    if (submitBtn) submitBtn.textContent = t.review_submit_btn;
    if (subtitleEl) subtitleEl.textContent = t.reviews_subtitle;
  };

  // Initial update
  updateFormText();

  // Listen for language changes to update form text dynamically if user switches lang on this page
  // Note: initLanguage handles the button click, but we need to ensure updateFormText is called.
  // Since initLanguage calls updateLanguageUI, we can hook into that or just rely on the fact that
  // the user probably won't switch language on this specific page often, or we can add a listener.
  // For simplicity, let's just update it once on load. The main language switcher reloads the page content usually?
  // Ah, initLanguage re-renders routes and cars. We should probably add updateFormText to the language switcher callback if we want dynamic updates.
  // But for now, let's just stick to the form submission logic.

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("review-name").value;
    const text = document.getElementById("review-text").value;
    const photoInput = document.getElementById("review-photo");

    const submitReview = (photoBase64) => {
      if (name && text) {
        DataManager.addReview({
          name,
          text,
          photo: photoBase64 || "",
        });

        alert(translations[currentLang].review_success);
        window.location.href = "index.html";
      }
    };

    if (photoInput.files && photoInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        submitReview(e.target.result);
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      submitReview(null);
    }
  });
}

function renderCars() {
  const container = document.getElementById("cars-container");
  if (!container) return;

  const cars = DataManager.getCars();
  const t = translations[currentLang];

  if (cars.length === 0) {
    container.innerHTML = `<p class="text-center col-span-full text-gray-500">${t.empty_cars}</p>`;
    return;
  }

  container.innerHTML = cars
    .map((car, index) => {
      const carName =
        currentLang === "en" && car.name_en ? car.name_en : car.name;

      // Захардкоженные характеристики для каждого типа
      let specs;

      if (car.name === "Седаны" || car.name_en === "Sedans") {
        specs = {
          type: currentLang === "en" ? "Comfort Class" : "Комфорт-класс",
          seats: 4,
          features:
            currentLang === "en"
              ? [
                  "Air Conditioner",
                  "Comfortable Interior",
                  "Trunk",
                  "USB Charging",
                ]
              : [
                  "Кондиционер",
                  "Комфортабельный салон",
                  "Багажник",
                  "Зарядка USB",
                ],
        };
      } else if (car.name === "Минивэны" || car.name_en === "Minivans") {
        specs = {
          type: currentLang === "en" ? "Multi-seat" : "Многоместные",
          seats: 18,
          features:
            currentLang === "en"
              ? [
                  "Air Conditioner",
                  "Up to 8 passengers",
                  "Spacious Interior",
                  "Large Trunk",
                ]
              : [
                  "Кондиционер",
                  "До 8 пассажиров",
                  "Просторный салон",
                  "Большой багажник",
                ],
        };
      } else if (car.name === "VIP-Авто" || car.name_en === "VIP Cars") {
        specs = {
          type: currentLang === "en" ? "Premium Class" : "Премиум-класс",
          seats: 4,
          features:
            currentLang === "en"
              ? [
                  "Leather Interior",
                  "Premium Comfort",
                  "Climate Control",
                  "Panoramic Roof",
                ]
              : [
                  "Кожаный салон",
                  "Премиум комфорт",
                  "Климат-контроль",
                  "Панорамная крыша",
                ],
        };
      } else {
        // Дефолтные значения если тип не определен
        specs = {
          type: currentLang === "en" ? "Standard" : "Стандарт",
          seats: 4,
          features:
            currentLang === "en"
              ? ["Air Conditioner", "Comfortable Interior"]
              : ["Кондиционер", "Комфортный салон"],
        };
      }

      return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden card-hover" data-aos="${
          index % 2 === 0 ? "fade-right" : "fade-left"
        }" data-aos-delay="${index * 100}">
            <div class="h-56 overflow-hidden bg-gray-200">
                <img src="${
                  car.image
                }" alt="${carName}" class="w-full h-full object-cover">
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">${carName}</h3>
                        <p class="text-sm text-gray-500">${specs.type}</p>
                    </div>
                    <div class="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
                        <i class="fas fa-user"></i> ${specs.seats} ${
        t.car_seats
      }
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-100">
                    ${specs.features
                      .map(
                        (feature) => `
                        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <i class="fas fa-check text-green-500"></i> ${feature}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
    })
    .join("");
}

function initSnowEffect() {
  const snowContainer = document.createElement("div");
  snowContainer.id = "snow-container";
  snowContainer.style.position = "fixed";
  snowContainer.style.top = "0";
  snowContainer.style.left = "0";
  snowContainer.style.width = "100%";
  snowContainer.style.height = "100%";
  snowContainer.style.pointerEvents = "none";
  snowContainer.style.zIndex = "9999";
  document.body.appendChild(snowContainer);

  const createSnowflake = () => {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "&#10052;"; // Snowflake character

    // Random properties
    const startLeft = Math.random() * 100;
    const duration = Math.random() * 5 + 5; // 5-10s
    const size = Math.random() * 30 + 20; // 20-50px
    const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8

    snowflake.style.left = startLeft + "vw";
    snowflake.style.animationDuration = duration + "s";
    snowflake.style.fontSize = size + "px";
    snowflake.style.opacity = opacity;

    snowContainer.appendChild(snowflake);

    // Remove after animation
    setTimeout(() => {
      snowflake.remove();
    }, duration * 1000);
  };

  // Create snowflakes periodically
  setInterval(createSnowflake, 200);
}
