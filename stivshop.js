"use strict";

// =====================================================
// STIVSHOP — PRODUCTS
// =====================================================

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


// =====================================================
// HELPERS
// =====================================================

function $(id) {
  return document.getElementById(id);
}

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}


// =====================================================
// CART
// =====================================================

let cart = [];

let activeCategory = "all";


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts() {
  const grid = $("product-grid");

  if (!grid) return;

  const sort = $("sort-products")?.value || "default";

  let filtered = products.filter(product => {
    return (
      activeCategory === "all" ||
      product.category === activeCategory
    );
  });

  if (sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (sort === "name") {
    filtered.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const count = $("catalog-result-count");

  if (count) {
    count.textContent = `${filtered.length} ta mahsulot`;
  }

  const empty = $("empty-category");

  if (empty) {
    empty.hidden = filtered.length !== 0;
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


// =====================================================
// CATEGORY FILTER
// =====================================================

$("category-list")?.addEventListener("click", event => {

  const button = event.target.closest("[data-category]");

  if (!button) return;

  activeCategory = button.dataset.category;

  document
    .querySelectorAll("#category-list [data-category]")
    .forEach(item => {

      item.classList.toggle(
        "active",
        item === button
      );

    });

  renderProducts();
});


// =====================================================
// SHOW ALL PRODUCTS
// =====================================================

$("show-all-products")?.addEventListener("click", () => {

  activeCategory = "all";

  document
    .querySelectorAll("#category-list [data-category]")
    .forEach(item => {

      item.classList.toggle(
        "active",
        item.dataset.category === "all"
      );

    });

  renderProducts();
});


// =====================================================
// SORT PRODUCTS
// =====================================================

$("sort-products")?.addEventListener(
  "change",
  renderProducts
);


// =====================================================
// PRODUCT MODAL
// =====================================================

function openProduct(productId) {

  const product = products.find(
    item => item.id === Number(productId)
  );

  if (!product) return;

  const modal = $("product-modal");

  if (!modal) return;

  const categoryNames = {
    shoes: "Oyoq kiyimlar",
    clothes: "Kiyimlar",
    bags: "Sumkalar",
    accessories: "Aksessuarlar"
  };

  const image = $("modal-product-image");
  const category = $("modal-product-category");
  const name = $("modal-product-name");
  const price = $("modal-product-price");
  const description = $("modal-product-description");
  const addButton = $("modal-add-cart");

  if (image) {
    image.src = product.image;
    image.alt = product.name;
  }

  if (category) {
    category.textContent =
      categoryNames[product.category] || "Mahsulot";
  }

  if (name) {
    name.textContent = product.name;
  }

  if (price) {
    price.textContent = formatPrice(product.price);
  }

  if (description) {
    description.textContent = product.description;
  }

  if (addButton) {
    addButton.dataset.productId = product.id;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

function closeProduct() {

  const modal = $("product-modal");

  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}


// =====================================================
// OPEN PRODUCT
// =====================================================

document.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-open-product]"
  );

  if (!button) return;

  openProduct(button.dataset.openProduct);
});


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

$("product-modal-close")?.addEventListener(
  "click",
  closeProduct
);


$("product-modal")?.addEventListener(
  "click",
  event => {

    const modal = $("product-modal");

    if (
      modal &&
      event.target === modal
    ) {
      closeProduct();
    }

  }
);


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(productId) {

  const product = products.find(
    item => item.id === Number(productId)
  );

  if (!product) return;

  const existing = cart.find(
    item => item.id === product.id
  );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      size: ""
    });

  }

  renderCart();

  alert(
    `${product.name} savatga qo'shildi!`
  );
}


// =====================================================
// ADD TO CART BUTTONS
// =====================================================

document.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-add-cart]"
  );

  if (!button) return;

  addToCart(button.dataset.addCart);
});


// =====================================================
// MODAL ADD TO CART
// =====================================================

$("modal-add-cart")?.addEventListener(
  "click",
  () => {

    const button = $("modal-add-cart");

    if (!button) return;

    const productId =
      button.dataset.productId;

    if (!productId) return;

    addToCart(productId);

    closeProduct();
  }
);


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

  const cartItems = $("cart-items");
  const cartCount = $("cart-count");
  const cartTotal = $("cart-total");

  const totalQuantity = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (cartCount) {
    cartCount.textContent =
      totalQuantity;
  }

  if (cartTotal) {
    cartTotal.textContent =
      formatPrice(totalPrice);
  }

  if (!cartItems) return;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <p class="empty-cart">
        Savat hozircha bo'sh.
      </p>
    `;

    return;
  }

  cartItems.innerHTML = cart.map(item => `

    <div class="cart-item">

      <img
        src="${item.image}"
        alt="${item.name}"
      >

      <div class="cart-item-info">

        <h4>${item.name}</h4>

        <p>
          ${formatPrice(item.price)}
        </p>

        <div class="cart-item-controls">

          <button
            type="button"
            data-cart-minus="${item.id}"
          >
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button
            type="button"
            data-cart-plus="${item.id}"
          >
            +
          </button>

          <button
            type="button"
            data-cart-remove="${item.id}"
          >
            O'chirish
          </button>

        </div>

      </div>

    </div>

  `).join("");
}


// =====================================================
// CART + BUTTON
// =====================================================

document.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-cart-plus]"
  );

  if (!button) return;

  const id = Number(
    button.dataset.cartPlus
  );

  const item = cart.find(
    product => product.id === id
  );

  if (!item) return;

  item.quantity += 1;

  renderCart();
});


// =====================================================
// CART MINUS BUTTON
// =====================================================

document.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-cart-minus]"
  );

  if (!button) return;

  const id = Number(
    button.dataset.cartMinus
  );

  const item = cart.find(
    product => product.id === id
  );

  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) {

    cart = cart.filter(
      product => product.id !== id
    );

  }

  renderCart();
});


// =====================================================
// REMOVE FROM CART
// =====================================================

document.addEventListener("click", event => {

  const button = event.target.closest(
    "[data-cart-remove]"
  );

  if (!button) return;

  const id = Number(
    button.dataset.cartRemove
  );

  cart = cart.filter(
    item => item.id !== id
  );

  renderCart();
});


// =====================================================
// OPEN CART
// =====================================================

$("cart-button")?.addEventListener(
  "click",
  () => {

    const cartPanel = $("cart-panel");

    if (!cartPanel) return;

    cartPanel.classList.add("open");
    cartPanel.setAttribute(
      "aria-hidden",
      "false"
    );
  }
);


// =====================================================
// CLOSE CART
// =====================================================

$("close-cart")?.addEventListener(
  "click",
  () => {

    const cartPanel = $("cart-panel");

    if (!cartPanel) return;

    cartPanel.classList.remove("open");
    cartPanel.setAttribute(
      "aria-hidden",
      "true"
    );
  }
);


// =====================================================
// OPEN ORDER FORM
// =====================================================

$("order-button")?.addEventListener(
  "click",
  () => {

    if (cart.length === 0) {

      alert(
        "Avval savatga mahsulot qo'shing."
      );

      return;
    }

    const orderForm = $("order-form");

    if (!orderForm) return;

    orderForm.classList.add("open");
    orderForm.setAttribute(
      "aria-hidden",
      "false"
    );
  }
);


// =====================================================
// CLOSE ORDER FORM
// =====================================================

$("order-close")?.addEventListener(
  "click",
  () => {

    const orderForm = $("order-form");

    if (!orderForm) return;

    orderForm.classList.remove("open");
    orderForm.setAttribute(
      "aria-hidden",
      "true"
    );
  }
);


// =====================================================
// SEND ORDER TO TELEGRAM
// =====================================================

$("confirm-order")?.addEventListener(
  "click",
  async event => {

    event.preventDefault();

    const name =
      $("customer-name")?.value.trim();

    const phone =
      $("customer-phone")?.value.trim();

    const address =
      $("customer-address")?.value.trim();

    // ---------------------------------------------
    // CHECK FORM
    // ---------------------------------------------

    if (!name || !phone || !address) {

      alert(
        "Iltimos, barcha maydonlarni to'ldiring."
      );

      return;
    }

    // ---------------------------------------------
    // CHECK CART
    // ---------------------------------------------

    if (cart.length === 0) {

      alert(
        "Savatingiz bo'sh."
      );

      return;
    }

    const button =
      $("confirm-order");

    if (!button) return;

    if (button.disabled) return;

    button.disabled = true;

    button.textContent =
      "Yuborilmoqda...";

    try {

      // -----------------------------------------
      // TOTAL
      // -----------------------------------------

      const total = cart.reduce(
        (sum, item) =>
          sum +
          item.price *
          item.quantity,
        0
      );

      // -----------------------------------------
      // SEND TO CLOUDFLARE WORKER
      // -----------------------------------------

      const response = await fetch(
        "https://holy-hall-af55tivshop-orders.stivcorleona.workers.dev/",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            name: name,

            phone: phone,

            address: address,

            items: cart.map(item => ({
              name: item.name,
              size: item.size || "",
              quantity: item.quantity,
              price: item.price
            })),

            total: total

          })
        }
      );

      // -----------------------------------------
      // RESPONSE
      // -----------------------------------------

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.error ||
          "Buyurtma yuborilmadi."
        );
      }

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      $("order-form")?.classList.remove(
        "open"
      );

      $("order-form")?.setAttribute(
        "aria-hidden",
        "true"
      );

      $("cart-panel")?.classList.remove(
        "open"
      );

      $("cart-panel")?.setAttribute(
        "aria-hidden",
        "true"
      );

      // Empty cart
      cart = [];

      renderCart();

      // Clear form
      if ($("customer-name")) {
        $("customer-name").value = "";
      }

      if ($("customer-phone")) {
        $("customer-phone").value = "";
      }

      if ($("customer-address")) {
        $("customer-address").value = "";
      }

      // -----------------------------------------
      // SHOW SUCCESS MESSAGE
      // -----------------------------------------

      const success =
        $("success-message");

      if (success) {

        success.classList.add("open");
        success.classList.add("active");

        success.setAttribute(
          "aria-hidden",
          "false"
        );

        success.style.display =
          "flex";
      }

    } catch (error) {

      console.error(
        "Buyurtma xatosi:",
        error
      );

      alert(
        "Buyurtma yuborilmadi. Server sozlamalarini tekshirish kerak."
      );

    } finally {

      button.disabled = false;

      button.textContent =
        "Buyurtma berish";
    }
  }
);


// =====================================================
// SUCCESS MODAL — CLOSE
// =====================================================

document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        "#success-close"
      )
    ) {
      return;
    }

    const success =
      $("success-message");

    if (!success) return;

    success.classList.remove(
      "open",
      "active"
    );

    success.setAttribute(
      "aria-hidden",
      "true"
    );

    success.style.display =
      "none";
  }
);


// =====================================================
// SUCCESS MODAL — CLICK OUTSIDE
// =====================================================

$("success-message")?.addEventListener(
  "click",
  event => {

    const success =
      $("success-message");

    if (!success) return;

    if (
      event.target === success
    ) {

      success.classList.remove(
        "open",
        "active"
      );

      success.setAttribute(
        "aria-hidden",
        "true"
      );

      success.style.display =
        "none";
    }
  }
);


// =====================================================
// ESC KEY — CLOSE MODALS
// =====================================================

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }

    closeProduct();

    const success =
      $("success-message");

    if (success) {

      success.classList.remove(
        "open",
        "active"
      );

      success.setAttribute(
        "aria-hidden",
        "true"
      );

      success.style.display =
        "none";
    }

  }
);


// =====================================================
// INITIALIZE STIVSHOP
// =====================================================

function initializeStivshop() {

  renderProducts();

  renderCart();

}


// =====================================================
// START
// =====================================================

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeStivshop
  );

} else {

  initializeStivshop();

}
