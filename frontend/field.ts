document.addEventListener("DOMContentLoaded", () => {

  console.log("field.ts loaded");

  updateCartCount();

  // ============================
  // STATE
  // ============================

  let selectedBranchId: string | null = null;
  let selectedCategories: string[] = [];
  let searchKeyword = "";

  // ============================
  // ELEMENTS
  // ============================

  const branchLabel =
    document.getElementById("selectedBranch") as HTMLElement | null;

  const timeSlot =
    document.getElementById("timeSlot") as HTMLSelectElement | null;

  const hourInput =
    document.getElementById("rentHours") as HTMLInputElement | null;

  const dateInput =
    document.getElementById("rentDate") as HTMLInputElement | null;

  const categoryBox =
    document.getElementById("categoryList") as HTMLElement | null;

  const venueGrid =
    document.getElementById("venueGrid") as HTMLElement | null;

  const searchInput =
    document.getElementById("searchInput") as HTMLInputElement | null;

  // ============================
  // PROFILE
  // ============================

  fetch("/sports_rental_system/api/get_profile.php")
    .then(res => res.json())
    .then(data => {

      const pointEl =
        document.getElementById("topPoints") as HTMLElement | null;

      if (pointEl && data.points !== undefined) {
        pointEl.textContent = `⭐ ${data.points} คะแนน`;
      }

    });

  // ============================
  // LOAD BRANCH
  // ============================

  fetch("/sports_rental_system/api/get_selected_branch.php")
    .then(res => res.json())
    .then(res => {

      if (!res || res.success === false) {
        window.location.href = "branches.html";
        return;
      }

      const data = res.data ?? res;

      selectedBranchId = data.branch_id;

      if (branchLabel) branchLabel.textContent = data.name;

      if (timeSlot) {
        generateTimeSlots(
          data.open_time,
          data.close_time
        );
      }

      loadVenues();

    });

  // ============================
  // SEARCH
  // ============================

  searchInput?.addEventListener("input", () => {
    searchKeyword = searchInput.value.trim();
    loadVenues();
  });

  // ============================
  // LOAD CATEGORIES
  // ============================

  fetch("/sports_rental_system/api/get_categories.php")
    .then(res => res.json())
    .then(res => {

      if (!res.success || !categoryBox) return;

      categoryBox.innerHTML = "";

      res.data.forEach((cat: any) => {

        const label = document.createElement("label");

        label.innerHTML = `
          <input type="checkbox" value="${cat.category_id}">
          <span>${cat.name}</span>
        `;

        const checkbox =
          label.querySelector("input") as HTMLInputElement;

        checkbox.addEventListener("change", () => {

          const id = checkbox.value;

          if (checkbox.checked) {
            selectedCategories.push(id);
          } else {
            selectedCategories =
              selectedCategories.filter(c => c !== id);
          }

          loadVenues();

        });

        categoryBox.appendChild(label);

      });

    });

  // ============================
  // LOAD VENUES
  // ============================

  function loadVenues() {

    if (!selectedBranchId || !venueGrid) return;

    const params = new URLSearchParams();

    params.set("branch_id", selectedBranchId);

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    if (searchKeyword !== "") {
      params.set("q", searchKeyword);
    }

    venueGrid.innerHTML =
      `<p class="loading-text">กำลังโหลดสนาม...</p>`;

    fetch(
      "/sports_rental_system/api/get_venues.php?" +
      params.toString()
    )
      .then(res => res.json())
      .then(res => {

        venueGrid.innerHTML = "";

        if (!res.success || res.data.length === 0) {
          venueGrid.innerHTML = "<p>ไม่พบสนาม</p>";
          return;
        }

        res.data.forEach((item: any) => {

          const card = document.createElement("div");
          card.className = "equipment-card";

          const img =
            item.image_url && item.image_url !== ""
              ? item.image_url
              : "images/no-image.png";

          const qty =
            getFieldQty(item.venue_id);

          card.innerHTML = `
            <img src="${img}">
            <h5 class="name">${item.name}</h5>
            <p class="price">${item.price_per_hour} บาท / ชม.</p>

            <div class="card-qty-controls">
              <button class="qty-minus">−</button>
              <span class="qty-num">${qty}</span>
              <button class="qty-plus">+</button>
            </div>
          `;

          if (qty > 0) {
            card.classList.add("selected");
          }

          const plusBtn =
            card.querySelector(".qty-plus") as HTMLElement;

          const minusBtn =
            card.querySelector(".qty-minus") as HTMLElement;

          plusBtn.addEventListener("click", () => {

            const date = dateInput?.value;
            const time = timeSlot?.value;
            const hours = hourInput?.value;

            if (!date || !time || !hours) {
              alert("กรุณาเลือกวันที่ เวลา และจำนวนชั่วโมงก่อน");
              return;
            }

            increaseField(
              item,
              date,
              time,
              hours
            );

            updateFieldCard(card, item.venue_id);

          });

          minusBtn.addEventListener("click", () => {

            decreaseField(item);

            updateFieldCard(card, item.venue_id);

          });

          venueGrid.appendChild(card);

        });

      });

  }

});


// ============================
// CART HELPERS
// ============================

function getCart(): any[] {

  try {

    const raw = localStorage.getItem("cart");
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch {

    return [];

  }

}


// ============================
// FIELD QTY
// ============================

function getFieldQty(id: string | number): number {

  const cart = getCart();

  for (let i = 0; i < cart.length; i++) {
    if (
      cart[i].type === "field" &&
      String(cart[i].id) === String(id)
    ) {
      return cart[i].qty;
    }
  }

  return 0;

}


// ============================
// ADD FIELD (MAX 1)
// ============================

function increaseField(
  field: any,
  date: string,
  time: string,
  hours: string
) {

  const cart = getCart();

  let index = -1;

  for (let i = 0; i < cart.length; i++) {
    if (
      cart[i].type === "field" &&
      String(cart[i].id) ===
      String(field.venue_id)
    ) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    alert("สนามนี้เลือกได้เพียง 1 สนามเท่านั้น");
    return;
  }

  cart.push({
    id: String(field.venue_id),
    type: "field",
    name: field.name,
    price: field.price_per_hour,
    qty: 1,
    image: field.image_url,
    date,
    time,
    hours
  });

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


// ============================
// REMOVE FIELD
// ============================

function decreaseField(field: any) {

  const cart = getCart();

  let index = -1;

  for (let i = 0; i < cart.length; i++) {
    if (
      cart[i].type === "field" &&
      String(cart[i].id) ===
      String(field.venue_id)
    ) {
      index = i;
      break;
    }
  }

  if (index === -1) return;

  cart.splice(index, 1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

}


// ============================
// UPDATE FIELD CARD
// ============================

function updateFieldCard(
  card: HTMLElement,
  id: string | number
) {

  const qty = getFieldQty(id);

  const qtyText =
    card.querySelector(".qty-num") as HTMLElement;

  qtyText.textContent =
    qty.toString();

  if (qty > 0) {
    card.classList.add("selected");
  } else {
    card.classList.remove("selected");
  }

  updateCartCount();

}


// ============================
// UPDATE CART COUNT
// ============================

function updateCartCount() {

  const badge =
    document.getElementById("cartCount") as HTMLElement | null;

  if (!badge) return;

  const cart = getCart();

  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    total += Number(cart[i].qty) || 0;
  }

  badge.textContent = total.toString();

}


// ============================
// GENERATE TIME SLOTS
// ============================

function generateTimeSlots(
  openTime: string,
  closeTime: string
) {

  const select =
    document.getElementById("timeSlot") as HTMLSelectElement | null;

  if (!select) return;

  select.innerHTML =
    `<option value="">เลือกเวลา</option>`;

  const openHour =
    parseInt(openTime.split(":")[0]);

  const closeHour =
    parseInt(closeTime.split(":")[0]);

  const lastStartHour =
    closeHour - 3;

  for (let h = openHour; h <= lastStartHour; h++) {

    const hour =
      h < 10 ? "0" + h : h.toString();

    const opt =
      document.createElement("option");

    opt.value = hour;
    opt.textContent = `${hour}:00 น.`;

    select.appendChild(opt);

  }

}
