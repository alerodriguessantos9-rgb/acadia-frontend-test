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

    // feedback UI (padrão UX)
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
