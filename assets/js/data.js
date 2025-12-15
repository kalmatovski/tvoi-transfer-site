const DATA_VERSION = "1.8";

const STORAGE_KEYS = {
  ROUTES: "tvoitransfer_routes",
  CARS: "tvoitransfer_cars",
  REVIEWS: "tvoitransfer_reviews",
  AUTH: "tvoitransfer_auth",
  VERSION: "tvoitransfer_version",
};

const initialRoutes = [
  {
    id: 1,
    from: "Бишкек",
    from_en: "Bishkek",
    to: "Иссык-Куль",
    to_en: "Issyk-Kul",
    image: "assets/images/albert-dros-kyrgyzstan-18.jpg",
  },
  {
    id: 2,
    from: "Бишкек",
    from_en: "Bishkek",
    to: "Аэропорт Манас",
    to_en: "Manas Airport",
    image: "assets/images/gt.jpg",
  },
  {
    id: 3,
    from: "Бишкек",
    from_en: "Bishkek",
    to: "Ош",
    to_en: "Osh",
    image: "assets/images/albert-dros-kyrgyzstan-6.jpg",
  },
];

const initialCars = [
  {
    id: 1,
    name: "Седаны",
    name_en: "Sedans",
    image:
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Минивэны",
    name_en: "Minivans",
    image:
      "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?q=80&w=1080&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "VIP-Авто",
    name_en: "VIP Cars",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1080&auto=format&fit=crop",
  },
];

function initData() {
  const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

  if (currentVersion !== DATA_VERSION) {
    console.log("Updating data to version", DATA_VERSION);
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(initialRoutes));
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(initialCars));
    localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
  } else {
    if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(initialRoutes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CARS)) {
      localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(initialCars));
    }
  }
}

window.DataManager = {
  getRoutes: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.ROUTES) || "[]"),
  getCars: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CARS) || "[]"),

  addRoute: (route) => {
    const routes = window.DataManager.getRoutes();
    route.id = Date.now();
    routes.push(route);
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
    return route;
  },

  deleteRoute: (id) => {
    const routes = window.DataManager.getRoutes().filter((r) => r.id != id);
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  },

  updateRoute: (updatedRoute) => {
    const routes = window.DataManager.getRoutes().map((r) =>
      r.id == updatedRoute.id ? updatedRoute : r
    );
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  },

  addCar: (car) => {
    const cars = window.DataManager.getCars();
    car.id = Date.now();
    cars.push(car);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    return car;
  },

  deleteCar: (id) => {
    const cars = window.DataManager.getCars().filter((c) => c.id != id);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  },

  updateCar: (updatedCar) => {
    const cars = window.DataManager.getCars().map((c) =>
      c.id == updatedCar.id ? updatedCar : c
    );
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  },

  getReviews: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || "[]"),

  addReview: (review) => {
    const reviews = window.DataManager.getReviews();
    review.id = Date.now();
    review.date = new Date().toISOString();
    reviews.push(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return review;
  },

  deleteReview: (id) => {
    const reviews = window.DataManager.getReviews().filter((r) => r.id != id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  login: (password) => {
    const hash = (str) => {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        h = (h << 5) - h + char;
        h = h & h;
      }
      return h.toString();
    };

    const targetHash = "-545554595";

    if (hash(password) === targetHash) {
      localStorage.setItem(STORAGE_KEYS.AUTH, "true");
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  isAuthenticated: () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
  },
};

initData();
