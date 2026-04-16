const products = [
  {
    id: "ultras-1",
    name: "Ultras L'Emkachkhines 02 Pack 1",
    price: 8,
    badge: "Pack 1",
    image: "images/sticker-1.jpeg",
    alt: "Stickers ultras l'emkachkhines 02 collage design 1",
    description: "stickers ultras l'emkachkhines 02",
  },
  {
    id: "ultras-2",
    name: "Ultras L'Emkachkhines 02 Pack 2",
    price: 8,
    badge: "Pack 2",
    image: "images/sticker-2.jpeg",
    alt: "Stickers ultras l'emkachkhines 02 collage design 2",
    description: "stickers ultras l'emkachkhines 02",
  },
  {
    id: "ultras-3",
    name: "Ultras L'Emkachkhines 02 Pack 3",
    price: 8,
    badge: "Pack 3",
    image: "images/sticker-3.jpeg",
    alt: "Stickers ultras l'emkachkhines 02 collage design 3",
    description: "stickers ultras l'emkachkhines 02",
  },
];

const productGrid = document.getElementById("product-grid");
const cardTemplate = document.getElementById("product-card-template");
const toast = document.getElementById("toast");
const productCount = document.getElementById("product-count");
const year = document.getElementById("year");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const checkoutForm = document.getElementById("checkout-form");
const formResult = document.getElementById("form-result");
const mobileDockLinks = Array.from(document.querySelectorAll(".mobile-dock a"));
const adSlots = Array.from(document.querySelectorAll(".adsbygoogle"));
const ownerEmail = "youssefathimni07@gmail.com";
const adsClientPlaceholder = "ca-pub-XXXXXXXXXXXXXXXX";

let toastTimer;
const cart = [];

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function renderCart() {
  if (!cart.length) {
    cartList.innerHTML =
      '<p class="cart-empty">No stickers added yet. Tap "Add to Cart" on any pack to build the order.</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "cart-item";
    card.innerHTML = `
      <div>
        <p class="cart-item-title">${item.name}</p>
        <p class="cart-item-meta">Pack ${index + 1} in your order</p>
      </div>
      <span class="cart-item-price">${formatPrice(item.price)}</span>
    `;
    fragment.appendChild(card);
  });

  cartList.replaceChildren(fragment);
  cartTotal.textContent = formatPrice(getCartTotal());
}

function addToCart(product) {
  cart.push(product);
  renderCart();
  showToast(`${product.name} added to your order`);
}

function handleImageError(event) {
  const image = event.currentTarget;
  image.alt = "Sticker image unavailable";
  image.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
        <rect width="600" height="600" rx="72" fill="#0d1728" />
        <rect x="54" y="54" width="492" height="492" rx="52" fill="#13233a" stroke="#29486f" />
        <text x="300" y="275" text-anchor="middle" fill="#9ec3ff" font-size="36" font-family="Arial, sans-serif">
          Image not found
        </text>
        <text x="300" y="330" text-anchor="middle" fill="#7f9abb" font-size="24" font-family="Arial, sans-serif">
          Update the image path in script.js
        </text>
      </svg>
    `);
}

function renderProducts() {
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const badge = card.querySelector(".product-badge");
    const image = card.querySelector(".product-image");
    const title = card.querySelector(".product-title");
    const description = card.querySelector(".product-description");
    const price = card.querySelector(".product-price");
    const button = card.querySelector(".product-button");

    badge.textContent = product.badge;
    image.src = product.image;
    image.alt = product.alt;
    image.addEventListener("error", handleImageError, { once: true });
    title.textContent = product.name;
    description.textContent = product.description;
    price.textContent = formatPrice(product.price);

    button.addEventListener("click", () => {
      button.textContent = "Added";
      button.classList.add("is-added");
      addToCart(product);

      window.setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("is-added");
      }, 1500);
    });

    fragment.appendChild(card);
  });

  productGrid.replaceChildren(fragment);
  productCount.textContent = String(products.length);
}

function initializeAds() {
  if (!adSlots.length) {
    return;
  }

  const hasLiveAds = adSlots.every((slot) => slot.dataset.adClient && slot.dataset.adClient !== adsClientPlaceholder);

  if (!hasLiveAds) {
    document.body.classList.add("ads-placeholder");
    return;
  }

  window.adsbygoogle = window.adsbygoogle || [];

  adSlots.forEach(() => {
    window.adsbygoogle.push({});
  });
}

function initializeMobileDock() {
  if (!mobileDockLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const sections = mobileDockLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (id) => {
    mobileDockLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.2, 0.4, 0.7],
    }
  );

  sections.forEach((section) => observer.observe(section));
  setActiveLink("home");
}

renderProducts();
renderCart();
year.textContent = String(new Date().getFullYear());
initializeAds();
initializeMobileDock();

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!cart.length) {
    formResult.textContent = "Add at least one sticker before confirming the order.";
    showToast("Please add a sticker before checkout");
    return;
  }

  const formData = new FormData(checkoutForm);
  const name = formData.get("customerName");
  const phone = formData.get("customerPhone");
  const email = formData.get("customerEmail");
  const location = formData.get("customerLocation");
  const notes = formData.get("customerNotes");
  const items = cart.map((item, index) => `${index + 1}. ${item.name} - ${formatPrice(item.price)}`);
  const total = formatPrice(getCartTotal());
  const subject = `Athimni Stickers Order - ${name}`;
  const body = [
    "New sticker order",
    "",
    `Full Name: ${name}`,
    `Phone Number: ${phone}`,
    `Gmail: ${email}`,
    `Location: ${location}`,
    `Payment Method: Cash on delivery / الدفع عند الاستلام`,
    "",
    "Selected Packs:",
    ...items,
    "",
    `Total: ${total}`,
    "",
    `Discussion / Notes: ${notes || "No notes"}`,
  ].join("\n");

  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(ownerEmail)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const mailtoUrl =
    `mailto:${encodeURIComponent(ownerEmail)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank", "noopener");

  formResult.textContent =
    "Your order has been prepared for Gmail. If Gmail does not open, use the direct email link below.";

  const fallbackLink = document.createElement("a");
  fallbackLink.href = mailtoUrl;
  fallbackLink.textContent = "Open direct email link";
  fallbackLink.className = "fallback-email-link";
  fallbackLink.target = "_blank";
  fallbackLink.rel = "noopener";

  formResult.replaceChildren(document.createTextNode(
    "Your order has been prepared for Gmail. If Gmail does not open, use this link: "
  ), fallbackLink);

  showToast("Order prepared for Gmail");
});

