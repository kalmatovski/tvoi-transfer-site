// Admin Panel Logic

document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    if (typeof window.DataManager === 'undefined' || !window.DataManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    renderAdminRoutes();
    renderAdminCars();
    renderAdminReviews();

    // Logout Handler
    const logoutBtns = document.querySelectorAll('#logout-btn, #logout-btn-mobile');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.DataManager.logout();
            window.location.href = 'login.html';
        });
    });

    // Form Handlers
    const addRouteForm = document.getElementById('add-route-form');
    if (addRouteForm) addRouteForm.addEventListener('submit', handleAddRoute);
    
    const addCarForm = document.getElementById('add-car-form');
    if (addCarForm) addCarForm.addEventListener('submit', handleAddCar);
});

// Tab Switching
window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-blue-50', 'text-blue-600');
        if (el.dataset.tab === tabName) {
            el.classList.add('bg-blue-50', 'text-blue-600');
        }
    });
}

// Modal Management
window.openModal = function(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.getElementById(modalId).classList.add('flex');
}

window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).classList.remove('flex');
}

// Render Functions
function renderAdminRoutes() {
    const tbody = document.getElementById('routes-table-body');
    if (!tbody) return;
    const routes = window.DataManager.getRoutes();

    tbody.innerHTML = routes.map(route => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-gray-800 font-medium">${route.from}</td>
            <td class="px-6 py-4 text-gray-800 font-medium">${route.to}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="editRoute(${route.id})" class="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRoute(${route.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderAdminCars() {
    const grid = document.getElementById('cars-admin-grid');
    if (!grid) return;
    const cars = window.DataManager.getCars();

    grid.innerHTML = cars.map(car => `
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="h-40 bg-gray-200 relative">
                <img src="${car.image}" alt="${car.name}" class="w-full h-full object-cover">
                <div class="absolute top-2 right-2 flex gap-2">
                    <button onclick="editCar(${car.id})" class="bg-white/90 text-blue-500 p-2 rounded-full shadow-sm hover:bg-blue-50 transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCar(${car.id})" class="bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-50 transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-bold text-gray-800">${car.name}</h3>
                <p class="text-sm text-gray-500">${car.type} • ${car.seats} мест</p>
            </div>
        </div>
    `).join('');
}

// Action Handlers
async function handleAddRoute(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    let imageFrom = formData.get('image_from');
    const fileFrom = document.getElementById('route-file-from').files[0];
    if (fileFrom) {
        imageFrom = await getBase64(fileFrom);
    }

    let imageTo = formData.get('image_to');
    const fileTo = document.getElementById('route-file-to').files[0];
    if (fileTo) {
        imageTo = await getBase64(fileTo);
    }
    
    const route = {
        from: formData.get('from'),
        from_en: formData.get('from_en'),
        to: formData.get('to'),
        to_en: formData.get('to_en'),
        image_from: imageFrom,
        image_to: imageTo
    };

    if (id) {
        route.id = parseInt(id);
        window.DataManager.updateRoute(route);
    } else {
        window.DataManager.addRoute(route);
    }

    renderAdminRoutes();
    closeModal('route-modal');
    e.target.reset();
    toggleImageInput('from', 'url');
    toggleImageInput('to', 'url');
}

function handleAddCar(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    const car = {
        name: formData.get('name'),
        type: formData.get('type'),
        type_en: formData.get('type_en'),
        seats: formData.get('seats'),
        image: formData.get('image'),
        features: formData.get('features') ? formData.get('features').split(',').map(f => f.trim()).filter(f => f) : [],
        features_en: formData.get('features_en') ? formData.get('features_en').split(',').map(f => f.trim()).filter(f => f) : []
    };

    if (id) {
        car.id = parseInt(id);
        window.DataManager.updateCar(car);
    } else {
        window.DataManager.addCar(car);
    }

    renderAdminCars();
    closeModal('car-modal');
    e.target.reset();
}

// Modal Helpers
window.openAddRouteModal = function() {
    document.getElementById('add-route-form').reset();
    document.getElementById('route-id').value = '';
    document.getElementById('route-modal-title').textContent = 'Добавить маршрут';
    toggleImageInput('from', 'url');
    toggleImageInput('to', 'url');
    openModal('route-modal');
}

window.openAddCarModal = function() {
    document.getElementById('add-car-form').reset();
    document.getElementById('car-id').value = '';
    document.getElementById('car-features').value = '';
    document.getElementById('car-modal-title').textContent = 'Добавить автомобиль';
    openModal('car-modal');
}

window.editRoute = function(id) {
    const route = window.DataManager.getRoutes().find(r => r.id === id);
    if (route) {
        document.getElementById('route-id').value = route.id;
        document.getElementById('route-from').value = route.from;
        document.getElementById('route-from-en').value = route.from_en || '';
        document.getElementById('route-to').value = route.to;
        document.getElementById('route-to-en').value = route.to_en || '';
        document.getElementById('route-image-from').value = route.image_from || route.image || '';
        document.getElementById('route-image-to').value = route.image_to || route.image || '';
        
        document.getElementById('route-modal-title').textContent = 'Редактировать маршрут';
        toggleImageInput('from', 'url');
        toggleImageInput('to', 'url');
        openModal('route-modal');
    }
}

// Toggle Image Input
window.toggleImageInput = function(type, mode) {
    const urlInput = document.getElementById(`route-image-${type}`);
    const fileInput = document.getElementById(`route-file-${type}`);
    const btnUrl = document.getElementById(`btn-${type}-url`);
    const btnFile = document.getElementById(`btn-${type}-file`);

    if (mode === 'url') {
        urlInput.classList.remove('hidden');
        fileInput.classList.add('hidden');
        
        btnUrl.classList.remove('bg-gray-100', 'text-gray-600');
        btnUrl.classList.add('bg-blue-100', 'text-blue-700');
        
        btnFile.classList.remove('bg-blue-100', 'text-blue-700');
        btnFile.classList.add('bg-gray-100', 'text-gray-600');
    } else {
        urlInput.classList.add('hidden');
        fileInput.classList.remove('hidden');
        
        btnFile.classList.remove('bg-gray-100', 'text-gray-600');
        btnFile.classList.add('bg-blue-100', 'text-blue-700');
        
        btnUrl.classList.remove('bg-blue-100', 'text-blue-700');
        btnUrl.classList.add('bg-gray-100', 'text-gray-600');
    }
}

window.editCar = function(id) {
    const car = window.DataManager.getCars().find(c => c.id === id);
    if (car) {
        document.getElementById('car-id').value = car.id;
        document.getElementById('car-name').value = car.name;
        document.getElementById('car-type').value = car.type;
        document.getElementById('car-type-en').value = car.type_en || '';
        document.getElementById('car-seats').value = car.seats;
        document.getElementById('car-image').value = car.image;
        document.getElementById('car-features').value = car.features ? car.features.join(', ') : '';
        document.getElementById('car-features-en').value = car.features_en ? car.features_en.join(', ') : '';
        
        document.getElementById('car-modal-title').textContent = 'Редактировать автомобиль';
        openModal('car-modal');
    }
}

window.deleteRoute = function(id) {
    if (confirm('Вы уверены, что хотите удалить этот маршрут?')) {
        window.DataManager.deleteRoute(id);
        renderAdminRoutes();
    }
}

window.deleteCar = function(id) {
    if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
        window.DataManager.deleteCar(id);
        renderAdminCars();
    }
}

function renderAdminReviews() {
    const tbody = document.getElementById('reviews-table-body');
    if (!tbody) return;
    const reviews = window.DataManager.getReviews();

    // Sort by date desc
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = reviews.map(review => `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-gray-800 font-medium">
                <div class="flex items-center gap-2">
                    <img src="${review.photo || 'assets/images/default-avatar.png'}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random'" class="w-8 h-8 rounded-full object-cover">
                    ${review.name}
                </div>
            </td>
            <td class="px-6 py-4 text-gray-600 max-w-xs truncate" title="${review.text}">${review.text}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">${new Date(review.date).toLocaleDateString('ru-RU')}</td>
            <td class="px-6 py-4 text-right">
                <button onclick="deleteReview(${review.id})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

window.deleteReview = function(id) {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        window.DataManager.deleteReview(id);
        renderAdminReviews();
    }
}
