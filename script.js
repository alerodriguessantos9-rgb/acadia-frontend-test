const cartCountEl = document.getElementById("cartCount");
const cart = new Map(); // id -> qty

function getCardData(card) {
  return {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
  };
}

function updateCartCount() {
  let total = 0;
  for (const qty of cart.values()) total += qty;
  cartCountEl.textContent = String(total);
}

document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart");
  const detailsBtn = e.target.closest(".toggle-details");

  // Add to cart
  if (addBtn) {
    const card = addBtn.closest(".product-card");
    const { id } = getCardData(card);

    cart.set(id, (cart.get(id) ?? 0) + 1);
    updateCartCount();

    // feedback UI
    const original = addBtn.textContent;
    addBtn.textContent = "Added ✓";
    addBtn.disabled = true;

    setTimeout(() => {
      addBtn.textContent = original;
      addBtn.disabled = false;
    }, 3500);
  }

  // Toggle details
  if (detailsBtn) {
    const card = detailsBtn.closest(".product-card");
    const details = card.querySelector(".details");

    const isHidden = details.hasAttribute("hidden");
    if (isHidden) {
      details.removeAttribute("hidden");
      detailsBtn.setAttribute("aria-expanded", "true");
      detailsBtn.textContent = "Hide";
    } else {
      details.setAttribute("hidden", "");
      detailsBtn.setAttribute("aria-expanded", "false");
      detailsBtn.textContent = "Details";
    }
  }
});

// PART 2 — Add to Cart toggle + card highlight

// Seleciona todos os botões Add to Cart
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Seleciona o elemento do contador do carrinho (se existir)
const cartEl = document.querySelector(".cart");

let cartCount = 0;

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Acha o card inteiro a partir do botão clicado
    const card = button.closest(".product-card");

    // Se não encontrar card, sai (proteção)
    if (!card) return;

    // Verifica se já está adicionado
    const isAdded = card.classList.contains("added");

    if (isAdded) {
      // Remove estado
      card.classList.remove("added");
      button.textContent = "Add to Cart";
      cartCount = Math.max(0, cartCount - 1);
    } else {
      // Adiciona estado
      card.classList.add("added");
      button.textContent = "Added";
      cartCount += 1;
    }

    // Atualiza contador no header
    if (cartEl) cartEl.textContent = `Cart: ${cartCount}`;
  });
});


// PART 2 — Search filter (case-insensitive, no reload)
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      card.style.display = name.includes(term) ? "" : "none";
    });
  });
}

const sampleProduct = {
  id: `p${Date.now()}`,
  name: "Sample Keyboard",
  description: "Mechanical switches, compact design, and RGB lighting.",
  price: 149.99,
  badge: "Sample",
  image: "images/keyboard.png",
  features: ["Hot-swappable", "USB-C", "Compact 60%"]
};


function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.id = product.id;
  card.dataset.name = product.name;
  card.dataset.price = String(product.price);

  card.innerHTML = `
    <div class="media">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </div>

    <div class="content">
      <h2 class="product-title">${product.name}</h2>
      <p class="product-desc">${product.description}</p>

      <div class="meta">
        <span class="price">$${product.price.toFixed(2)}</span>
        <span class="badge">${product.badge}</span>
      </div>

      <div class="actions">
        <button class="btn btn-primary add-to-cart" type="button">Add to Cart</button>
        <button class="btn btn-ghost details-btn" type="button" aria-expanded="false">Details</button>
      </div>

      <div class="details" hidden>
        <ul>
          ${product.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  return card;
}


function bindCardEvents(card) {
  const addBtn = card.querySelector(".add-to-cart");
  const detailsBtn = card.querySelector(".details-btn");

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const isAdded = card.classList.contains("added");

      if (isAdded) {
        card.classList.remove("added");
        addBtn.textContent = "Add to Cart";
        window.__cartCount = Math.max(0, (window.__cartCount || 0) - 1);
      } else {
        card.classList.add("added");
        addBtn.textContent = "Added ✓";
        window.__cartCount = (window.__cartCount || 0) + 1;
      }

      const cartEl = document.querySelector(".cart");
      if (cartEl) cartEl.textContent = `Cart: ${window.__cartCount || 0}`;
    });
  }

  if (detailsBtn) {
    detailsBtn.addEventListener("click", () => {
      const details = card.querySelector(".details");
      if (!details) return;

      const isHidden = details.hasAttribute("hidden");
      if (isHidden) {
        details.removeAttribute("hidden");
        detailsBtn.setAttribute("aria-expanded", "true");
        detailsBtn.textContent = "Hide";
      } else {
        details.setAttribute("hidden", "");
        detailsBtn.setAttribute("aria-expanded", "false");
        detailsBtn.textContent = "Details";
      }
    });
  }
}

const grid = document.querySelector(".product-grid");
const addSampleBtn = document.getElementById("addSampleProduct");

if (grid && addSampleBtn) {
  addSampleBtn.addEventListener("click", () => {
    const newCard = createProductCard(sampleProduct);
    bindCardEvents(newCard);
    grid.prepend(newCard);
  });
}
