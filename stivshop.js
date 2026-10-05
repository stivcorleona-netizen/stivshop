
"use strict";

// ================================
// STIVSHOP — MAHSULOTLAR
// ================================


const products = [
  {
    id: 1,
    name: "Classic Sneakers",
    category: "shoes",
    price: 350000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    description: "Kundalik foydalanish uchun zamonaviy oyoq kiyim."
  },
  {
    id: 2,
    name: "White Sneakers",
    category: "shoes",
    price: 320000,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700",
    description: "Oddiy va zamonaviy dizayndagi oyoq kiyim."
  },
  {
    id: 3,
    name: "Sport Sneakers",
    category: "shoes",
    price: 400000,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=700",
    description: "Sport va kundalik kiyinish uchun."
  },
  {
    id: 4,
    name: "Classic T-Shirt",
    category: "clothes",
    price: 150000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
    description: "Kundalik kiyinish uchun oddiy futbolka."
  },
  {
    id: 5,
    name: "Casual Hoodie",
    category: "clothes",
    price: 280000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700",
    description: "Qulay va zamonaviy huddi."
  },
  {
    id: 6,
    name: "Everyday Backpack",
    category: "bags",
    price: 250000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
    description: "Kundalik foydalanish uchun ryukzak."
  },
  {
    id: 7,
    name: "Classic Shoulder Bag",
    category: "bags",
    price: 220000,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
    description: "Kundalik uslubga mos sumka."
  },
  {
    id: 8,
    name: "Classic Sunglasses",
    category: "accessories",
    price: 120000,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
    description: "Kundalik uslub uchun quyosh ko‘zoynagi."
  },
  {
    id: 9,
    name: "Classic Watch",
    category: "accessories",
    price: 200000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
    description: "Minimal dizayndagi soat."
  }
];

let activeCategory = "all";
let selectedProduct = null;
let selectedSize = "";
let quantity = 1;
let cart = [];

const $ = (id) => document.getElementById(id);

const formatPrice = (price) =>
  new Intl.NumberFormat("uz-UZ").format(price) + " so'm";

// ================================
// SAVATNI SAQLASH VA YUKLASH
// ================================

try {
  const savedCart = JSON.parse(
    localStorage.getItem("stivshop-cart") || "[]"
  );

  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(item =>
      item &&
      Number.isFinite(Number(item.id)) &&
      typeof item.name === "string" &&
      Number.isFinite(Number(item.price)) &&
      Number(item.price) >= 0 &&
      Number.isInteger(Number(item.quantity)) &&
      Number(item.quantity) > 0
    ).map(item => ({
      ...item,
      id: Number(item.id),
      price: Number(item.price),
      quantity: Number(item.quantity),
      size: String(item.size || "")
    }));
  }
} catch (error) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("stivshop-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Savatni saqlab bo‘lmadi:", error);
  }
}

// ================================
// KATALOGNI CHIQARISH
// ================================

function renderProducts() {
  const grid = $("product-grid");
  if (!grid) return;

  const sort = $("sort-products")?.value || "default";

  let filtered = products.filter(product =>
    activeCategory === "all" ||
    product.category === activeCategory
  );

  if (sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const count = $("catalog-result-count");
  if (count) {
    count.textContent = `${filtered.length} ta mahsulot`;
  }

  const empty = $("empty-category");
  if (empty) {
    empty.hidden = filtered.length > 0;
  }

  const categoryNames = {
    shoes: "Oyoq kiyimlar",
    clothes: "Kiyimlar",
    bags: "Sumkalar",
    accessories: "Aksessuarlar"
  };

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
      </div>

      <div class="product-info">
        <p class="product-category">
          ${categoryNames[product.category] || "Mahsulot"}
        </p>

        <h3>${product.name}</h3>

        <p class="product-price">
          ${formatPrice(product.price)}
        </p>

        <button
          class="primary-button"
          type="button"
          data-open-product="${product.id}"
        >
          Batafsil
        </button>
      </div>
    </article>
  `).join("");
}

// ================================
// KATEGORIYALAR
// ================================

$("category-list")?.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll("#category-list [data-category]")
    .forEach(item => {
      item.classList.toggle("active", item === button);
    });

  renderProducts();
});

$("show-all-products")?.addEventListener("click", () => {
  activeCategory = "all";

  document.querySelectorAll("#category-list [data-category]")
    .forEach(item => {
      item.classList.toggle(
        "active",
        item.dataset.category === "all"
      );
    });

  renderProducts();
});

$("sort-products")?.addEventListener("change", renderProducts);

// ================================
// MAHSULOT OYNASI
// ================================

function openProduct(id) {
  selectedProduct = products.find(
    product => product.id === Number(id)
  );

  if (!selectedProduct) return;

  selectedSize = "";
  quantity = 1;

  if ($("modal-image")) {
    $("modal-image").src = selectedProduct.image;
    $("modal-image").alt = selectedProduct.name;
  }

  if ($("modal-name")) {
    $("modal-name").textContent = selectedProduct.name;
  }

  if ($("modal-price")) {
    $("modal-price").textContent =
      formatPrice(selectedProduct.price);
  }

  if ($("modal-description")) {
    $("modal-description").textContent =
      selectedProduct.description;
  }

  if ($("modal-category")) {
    $("modal-category").textContent = "Oyoq kiyimlar";
  }

  if ($("modal-quantity")) {
    $("modal-quantity").textContent = quantity;
  }

  if ($("modal-error")) {
    $("modal-error").textContent = "";
  }

  document.querySelectorAll("#size-options [data-size]")
    .forEach(button => {
      button.classList.remove("active");
    });

  const modal = $("product-modal");

  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeProduct() {
  const modal = $("product-modal");

  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
}

$("product-grid")?.addEventListener("click", event => {
  const button = event.target.closest("[data-open-product]");
  if (button) openProduct(button.dataset.openProduct);
});

$("close-product")?.addEventListener("click", closeProduct);

$("product-modal")?.addEventListener("click", event => {
  if (event.target === $("product-modal")) {
    closeProduct();
  }
});

// ================================
// RAZMER TANLASH
// ================================

$("size-options")?.addEventListener("click", event => {
  const button = event.target.closest("[data-size]");
  if (!button) return;

  selectedSize = button.dataset.size;

  document.querySelectorAll("#size-options [data-size]")
    .forEach(item => {
      item.classList.toggle("active", item === button);
    });

  if ($("modal-error")) {
    $("modal-error").textContent = "";
  }
});

// ================================
// MIQDORNI BOSHQARISH
// ================================

$("modal-minus")?.addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);

  if ($("modal-quantity")) {
    $("modal-quantity").textContent = quantity;
  }
});

$("modal-plus")?.addEventListener("click", () => {
  quantity = Math.min(20, quantity + 1);

  if ($("modal-quantity")) {
    $("modal-quantity").textContent = quantity;
  }
});

// ================================
// SAVATGA QO‘SHISH
// ================================

$("modal-add-cart")?.addEventListener("click", () => {
  if (!selectedProduct) return;

  if (!selectedSize) {
    if ($("modal-error")) {
      $("modal-error").textContent =
        "Iltimos, razmer tanlang.";
    }
    return;
  }

  const existing = cart.find(item =>
    item.id === selectedProduct.id &&
    item.size === selectedSize
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      size: selectedSize,
      quantity: quantity
    });
  }

  saveCart();
  renderCart();
  closeProduct();

  const panel = $("cart-panel");

  if (panel) {
    panel.classList.add("open");
  }
});

// ================================
// SAVATNI KO‘RSATISH
// ================================

function renderCart() {
  const itemsContainer = $("cart-items");
  const countElement = $("cart-count");
  const totalElement = $("cart-total");

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  if (countElement) {
    countElement.textContent = totalQuantity;
  }

  if (totalElement) {
    totalElement.textContent = `Jami: ${formatPrice(totalPrice)}`;
  }

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML =
      "<p>Savatingiz hozircha bo‘sh.</p>";
    return;
  }

  itemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">

      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Razmer: ${item.size}</p>
        <p>${item.quantity} × ${formatPrice(item.price)}</p>

        <button
          type="button"
          data-remove-item="${index}"
        >
          O‘chirish
        </button>
      </div>
    </div>
  `).join("");
}

$("cart-items")?.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-item]");
  if (!button) return;

  const index = Number(button.dataset.removeItem);

  if (!Number.isInteger(index) || index < 0 || index >= cart.length) {
    return;
  }

  cart.splice(index, 1);
  saveCart();
  renderCart();
});

// SAVATNI OCHISH VA YOPISH

$("open-cart")?.addEventListener("click", () => {
  $("cart-panel")?.classList.add("open");
});

$("close-cart")?.addEventListener("click", () => {
  $("cart-panel")?.classList.remove("open");
});

// ================================
// BUYURTMA FORMASI
// ================================

$("order-button")?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Bro, avval savatga mahsulot qo‘shing.");
    return;
  }

  $("order-form")?.classList.add("open");
});

$("cancel-order")?.addEventListener("click", () => {
  $("order-form")?.classList.remove("open");
});


$("confirm-order")?.addEventListener("click", async event => {
  event.preventDefault();

  const name = $("customer-name")?.value.trim();
  const phone = $("customer-phone")?.value.trim();
  const address = $("customer-address")?.value.trim();

  if (!name || !phone || !address) {
    alert("Iltimos, barcha maydonlarni to‘ldiring.");
    return;
  }

  if (cart.length === 0) {
    alert("Savatingiz bo‘sh.");
    return;
  }

  const button = $("confirm-order");
  if (button.disabled) return;

  button.disabled = true;

  try {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const response = await fetch(
      "https://holy-hall-af55tivshop-orders.stivcorleona.workers.dev/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          items: cart.map(item => ({
            name: item.name,
            size: item.size || "",
            quantity: item.quantity,
            price: item.price
          })),
          total
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Buyurtma yuborilmadi.");
    }

    alert("Buyurtmangiz Telegram’ga yuborildi! 🎉");

    $("order-form")?.classList.remove("open");
    $("cart-panel")?.classList.remove("open");

    cart.length = 0;
    renderCart();

    $("customer-name").value = "";
    $("customer-phone").value = "";
    $("customer-address").value = "";

    const success = $("success-message");
    if (success) {
      success.classList.add("open");
      success.setAttribute("aria-hidden", "false");
    }
    // ================================
// BUYURTMA TASDIQLASH OYNASINI YOPISH
// ================================

$("success-close")?.addEventListener("click", () => {
  const success = $("success-message");

  if (success) {
    success.classList.remove("open");
    success.setAttribute("aria-hidden", "true");
  }
});
  } catch (error) {
    console.error("Buyurtma xatosi:", error);
    alert("Buyurtma yuborilmadi. Server sozlamalarini tekshirish kerak.");
  } finally {
    button.disabled = false;
  }
});
