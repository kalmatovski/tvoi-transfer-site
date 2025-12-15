// Проверка авторизации
document.addEventListener("DOMContentLoaded", () => {
  if (!window.DataManager || !window.DataManager.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }
  initAdmin();
});

function initAdmin() {
  console.log("Инициализация админки");
  showTab("routes");

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.DataManager.logout();
      window.location.href = "login.html";
    });
  }
}

// ===== ВКЛАДКИ =====
window.showTab = function (tab) {
  console.log("Переключение на вкладку:", tab);

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  const tabContent = document.getElementById(`${tab}-tab`);
  if (tabContent) {
    tabContent.classList.remove("hidden");
  }

  if (tab === "routes") renderAdminRoutes();
  else if (tab === "cars") renderAdminCars();
  else if (tab === "reviews") renderAdminReviews();
};

// ===== МАРШРУТЫ =====
function renderAdminRoutes() {
  console.log("Рендер маршрутов");
  const container = document.getElementById("admin-routes");
  if (!container) {
    console.error("Контейнер admin-routes не найден");
    return;
  }

  const routes = window.DataManager.getRoutes();
  console.log("Найдено маршрутов:", routes.length);

  if (routes.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Нет маршрутов</p>';
    return;
  }

  container.innerHTML = routes
    .map(
      (route) => `
        <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold">${route.from} → ${route.to}</h3>
                <div class="flex gap-2">
                    <button onclick="editRoute(${
                      route.id
                    })" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteRoute(${
                      route.id
                    })" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-500 text-sm">${route.from_en || ""} → ${
        route.to_en || ""
      }</p>
            ${
              route.image
                ? `<img src="${route.image}" alt="${route.from}" class="mt-2 w-full h-32 object-cover rounded">`
                : ""
            }
        </div>
    `
    )
    .join("");
}

window.openAddRouteModal = function () {
  console.log("Открытие модалки добавления маршрута");
  document.getElementById("route-modal-title").textContent = "Добавить маршрут";
  document.getElementById("route-form").reset();
  document.getElementById("route-id").value = "";
  clearRoutePreview();
  openModal("route-modal");
};

window.editRoute = function (id) {
  console.log("Редактирование маршрута:", id);
  const route = window.DataManager.getRoutes().find((r) => r.id === id);
  if (!route) return;

  document.getElementById("route-modal-title").textContent =
    "Редактировать маршрут";
  document.getElementById("route-id").value = route.id;
  document.getElementById("route-from").value = route.from;
  document.getElementById("route-from-en").value = route.from_en || "";
  document.getElementById("route-to").value = route.to;
  document.getElementById("route-to-en").value = route.to_en || "";

  if (route.image) {
    showRoutePreview(route.image);
  }

  openModal("route-modal");
};

window.deleteRoute = function (id) {
  if (confirm("Удалить маршрут?")) {
    window.DataManager.deleteRoute(id);
    renderAdminRoutes();
    showToast("Маршрут удален");
  }
};

window.handleRouteSubmit = async function (e) {
  e.preventDefault();

  const id = document.getElementById("route-id").value;
  const fileInput = document.getElementById("route-image");

  if (fileInput.files.length === 0 && !id) {
    showToast("Пожалуйста, загрузите фото маршрута");
    return;
  }

  showLoading();

  try {
    let imageUrl = "";

    if (fileInput.files.length > 0) {
      console.log("Загрузка изображения в Cloudinary...");
      imageUrl = await window.CloudinaryUploader.upload(fileInput.files[0]);
      console.log("Изображение загружено:", imageUrl);
    }

    const routeData = {
      from: document.getElementById("route-from").value,
      from_en: document.getElementById("route-from-en").value,
      to: document.getElementById("route-to").value,
      to_en: document.getElementById("route-to-en").value,
      image:
        imageUrl ||
        (id
          ? document.getElementById("route-image-preview").querySelector("img")
              ?.src
          : ""),
    };

    if (id) {
      window.DataManager.updateRoute(parseInt(id), routeData);
      showToast("Маршрут обновлен");
    } else {
      window.DataManager.addRoute(routeData);
      showToast("Маршрут добавлен");
    }

    closeModal("route-modal");
    renderAdminRoutes();
  } catch (error) {
    console.error("Ошибка:", error);
    showToast("Ошибка: " + error.message);
  } finally {
    hideLoading();
  }
};

// ===== АВТОМОБИЛИ =====
function renderAdminCars() {
  console.log("Рендер автомобилей");
  const container = document.getElementById("admin-cars");
  if (!container) {
    console.error("Контейнер admin-cars не найден");
    return;
  }

  const cars = window.DataManager.getCars();
  console.log("Найдено автомобилей:", cars.length);

  if (cars.length === 0) {
    container.innerHTML = '<p class="text-gray-500">Нет автомобилей</p>';
    return;
  }

  container.innerHTML = cars
    .map(
      (car) => `
        <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-bold">${car.name}</h3>
                <div class="flex gap-2">
                    <button onclick="editCar(${
                      car.id
                    })" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCar(${
                      car.id
                    })" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-500 text-sm">${car.name_en || ""}</p>
            ${
              car.image
                ? `<img src="${car.image}" alt="${car.name}" class="mt-2 w-full h-32 object-cover rounded">`
                : ""
            }
        </div>
    `
    )
    .join("");
}

window.openAddCarModal = function () {
  console.log("Открытие модалки добавления автомобиля");
  document.getElementById("car-modal-title").textContent =
    "Добавить автомобиль";
  document.getElementById("car-form").reset();
  document.getElementById("car-id").value = "";
  clearCarPreview();
  openModal("car-modal");
};

window.editCar = function (id) {
  console.log("Редактирование автомобиля:", id);
  const car = window.DataManager.getCars().find((c) => c.id === id);
  if (!car) return;

  document.getElementById("car-modal-title").textContent =
    "Редактировать автомобиль";
  document.getElementById("car-id").value = car.id;
  document.getElementById("car-name").value = car.name;
  document.getElementById("car-name-en").value = car.name_en || "";

  if (car.image) {
    showCarPreview(car.image);
  }

  openModal("car-modal");
};

window.deleteCar = function (id) {
  if (confirm("Удалить автомобиль?")) {
    window.DataManager.deleteCar(id);
    renderAdminCars();
    showToast("Автомобиль удален");
  }
};

window.handleCarSubmit = async function (e) {
  e.preventDefault();

  const id = document.getElementById("car-id").value;
  const fileInput = document.getElementById("car-image");

  if (fileInput.files.length === 0 && !id) {
    showToast("Пожалуйста, загрузите фото автомобиля");
    return;
  }

  showLoading();

  try {
    let imageUrl = "";

    if (fileInput.files.length > 0) {
      console.log("Загрузка изображения в Cloudinary...");
      imageUrl = await window.CloudinaryUploader.upload(fileInput.files[0]);
      console.log("Изображение загружено:", imageUrl);
    }

    const carData = {
      name: document.getElementById("car-name").value,
      name_en: document.getElementById("car-name-en").value,
      image:
        imageUrl ||
        (id
          ? document.getElementById("car-image-preview").querySelector("img")
              ?.src
          : ""),
    };

    if (id) {
      window.DataManager.updateCar(parseInt(id), carData);
      showToast("Автомобиль обновлен");
    } else {
      window.DataManager.addCar(carData);
      showToast("Автомобиль добавлен");
    }

    closeModal("car-modal");
    renderAdminCars();
  } catch (error) {
    console.error("Ошибка:", error);
    showToast("Ошибка: " + error.message);
  } finally {
    hideLoading();
  }
};

// ===== ОТЗЫВЫ =====
function renderAdminReviews() {
  console.log("Рендер отзывов");
  const tbody = document.getElementById("reviews-table-body");
  if (!tbody) {
    console.error("Элемент reviews-table-body не найден");
    return;
  }

  const reviews = window.DataManager.getReviews();
  console.log("Найдено отзывов:", reviews.length);

  if (reviews.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Нет отзывов</td></tr>';
    return;
  }

  tbody.innerHTML = reviews
    .map(
      (review) => `
        <tr class="border-b">
            <td class="px-6 py-4">${review.name}</td>
            <td class="px-6 py-4">
                <div class="flex">
                    ${Array(5)
                      .fill(0)
                      .map(
                        (_, i) =>
                          `<i class="fas fa-star ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }"></i>`
                      )
                      .join("")}
                </div>
            </td>
            <td class="px-6 py-4">${review.text}</td>
            <td class="px-6 py-4">
                <button onclick="deleteReview(${
                  review.id
                })" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `
    )
    .join("");
}

window.deleteReview = function (id) {
  if (confirm("Удалить отзыв?")) {
    window.DataManager.deleteReview(id);
    renderAdminReviews();
    showToast("Отзыв удален");
  }
};

// ===== МОДАЛКИ =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

window.closeRouteModal = function () {
  closeModal("route-modal");
};

window.closeCarModal = function () {
  closeModal("car-modal");
};

// ===== ПРЕВЬЮ ИЗОБРАЖЕНИЙ =====
window.handleRouteImageChange = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      showRoutePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

window.handleCarImageChange = function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      showCarPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

function showRoutePreview(url) {
  const preview = document.getElementById("route-image-preview");
  if (preview) {
    preview.innerHTML = `<img src="${url}" class="w-32 h-24 object-cover rounded border">`;
  }
}

function showCarPreview(url) {
  const preview = document.getElementById("car-image-preview");
  if (preview) {
    preview.innerHTML = `<img src="${url}" class="w-32 h-24 object-cover rounded border">`;
  }
}

function clearRoutePreview() {
  const preview = document.getElementById("route-image-preview");
  if (preview) {
    preview.innerHTML = "";
  }
}

function clearCarPreview() {
  const preview = document.getElementById("car-image-preview");
  if (preview) {
    preview.innerHTML = "";
  }
}

// ===== DRAG & DROP =====
window.initRouteDropzone = function () {
  const dropzone = document.getElementById("route-dropzone");
  const fileInput = document.getElementById("route-image");

  if (!dropzone || !fileInput) return;

  dropzone.onclick = () => fileInput.click();

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      showFileName("route");
    }
  });
};

window.initCarDropzone = function () {
  const dropzone = document.getElementById("car-dropzone");
  const fileInput = document.getElementById("car-image");

  if (!dropzone || !fileInput) return;

  dropzone.onclick = () => fileInput.click();

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("border-blue-500", "bg-blue-50");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      showFileName("car");
    }
  });
};

// ===== ВСПОМОГАТЕЛЬНЫЕ =====
function showLoading() {
  console.log("Загрузка...");
}

function hideLoading() {
  console.log("Загрузка завершена");
}

function showToast(message) {
  alert(message);
}

window.showFileName = function (type) {
  const fileInput = document.getElementById(`${type}-image`);
  const fileName = document.getElementById(`${type}-file-name`);

  if (fileInput.files.length > 0) {
    fileName.textContent = `Выбран: ${fileInput.files[0].name}`;
  } else {
    fileName.textContent = "";
  }
};

console.log("admin.js загружен успешно");
