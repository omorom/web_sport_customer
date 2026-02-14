document.addEventListener("DOMContentLoaded", function () {
    var _a;
    console.log("index.ts loaded");
    updateCartCount();
    // ============================
    // STATE
    // ============================
    var selectedBranchId = null;
    var selectedCategories = [];
    var searchKeyword = "";
    // ============================
    // ELEMENTS
    // ============================
    var branchLabel = document.getElementById("selectedBranch");
    var timeSlot = document.getElementById("timeSlot");
    var dateInput = document.getElementById("rentDate");
    var hourInput = document.getElementById("rentHours");
    var categoryBox = document.getElementById("categoryList");
    var equipmentGrid = document.getElementById("equipmentGrid");
    var searchInput = document.getElementById("searchInput");
    // ===== PRICE =====
    var minPriceInput = document.getElementById("minPriceInput");
    var maxPriceInput = document.getElementById("maxPriceInput");
    var priceMinRange = document.getElementById("priceMin");
    var priceMaxRange = document.getElementById("priceMax");
    // ============================
    // RESET FILTERS
    // ============================
    var resetBtn = document.getElementById("resetFilters");
    // RESET BUTTON CLICK
    resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener("click", function () {
        console.log("RESET FILTERS");
        // ===== STATE =====
        selectedCategories = [];
        searchKeyword = "";
        // ===== DATE / TIME / HOURS =====
        if (dateInput)
            dateInput.value = "";
        if (timeSlot)
            timeSlot.value = "";
        if (hourInput)
            hourInput.value = "";
        document
            .querySelectorAll(".duration-btn")
            .forEach(function (b) { return b.classList.remove("active"); });
        // ===== CATEGORY =====
        categoryBox === null || categoryBox === void 0 ? void 0 : categoryBox.querySelectorAll("input[type=checkbox]").forEach(function (cb) { return (cb.checked = false); });
        // ===== PRICE =====
        var defaultMin = (priceMinRange === null || priceMinRange === void 0 ? void 0 : priceMinRange.min) || "0";
        var defaultMax = (priceMaxRange === null || priceMaxRange === void 0 ? void 0 : priceMaxRange.max) || "5000";
        if (minPriceInput)
            minPriceInput.value = defaultMin;
        if (maxPriceInput)
            maxPriceInput.value = defaultMax;
        if (priceMinRange)
            priceMinRange.value = defaultMin;
        if (priceMaxRange)
            priceMaxRange.value = defaultMax;
        // ===== SEARCH =====
        if (searchInput)
            searchInput.value = "";
        // ===== STORAGE =====
        localStorage.removeItem("rentDate");
        localStorage.removeItem("timeSlot");
        localStorage.removeItem("rentHours");
        localStorage.removeItem("minPrice");
        localStorage.removeItem("maxPrice");
        localStorage.removeItem("cart");
        updateCartCount();
        // // ถ้าอยาก clear field ใน cart ด้วย
        // clearFieldInCart();
        // ===== reload =====
        loadEquipment();
    });
    // ============================
    // RESTORE DATE / TIME / HOURS
    // ============================
    var savedDate = localStorage.getItem("rentDate");
    var savedTime = localStorage.getItem("timeSlot");
    var savedHours = localStorage.getItem("rentHours");
    var savedMin = localStorage.getItem("minPrice");
    var savedMax = localStorage.getItem("maxPrice");
    ;
    if (savedDate && dateInput)
        dateInput.value = savedDate;
    if (savedHours && hourInput) {
        hourInput.value = savedHours;
        document
            .querySelectorAll(".duration-btn")
            .forEach(function (b) { return b.classList.remove("active"); });
        (_a = document
            .querySelector(".duration-btn[data-hour=\"".concat(savedHours, "\"]"))) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    }
    if (savedMin && minPriceInput && priceMinRange) {
        minPriceInput.value = savedMin;
        priceMinRange.value = savedMin;
    }
    if (savedMax && maxPriceInput && priceMaxRange) {
        maxPriceInput.value = savedMax;
        priceMaxRange.value = savedMax;
    }
    // ============================
    // SAVE DATE / TIME
    // ============================
    dateInput === null || dateInput === void 0 ? void 0 : dateInput.addEventListener("change", function () {
        localStorage.setItem("rentDate", dateInput.value);
        loadEquipment();
    });
    timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.addEventListener("change", function () {
        localStorage.setItem("timeSlot", timeSlot.value);
        loadEquipment();
    });
    // ============================
    // DURATION BUTTONS
    // ============================
    document
        .querySelectorAll(".duration-btn")
        .forEach(function (btn) {
        btn.addEventListener("click", function () {
            document
                .querySelectorAll(".duration-btn")
                .forEach(function (b) {
                return b.classList.remove("active");
            });
            btn.classList.add("active");
            var h = btn.dataset.hour || "3";
            if (hourInput)
                hourInput.value = h;
            localStorage.setItem("rentHours", h);
            loadEquipment();
        });
    });
    // ============================
    // PRICE SYNC
    // ============================
    function syncPrice() {
        if (!minPriceInput ||
            !maxPriceInput ||
            !priceMinRange ||
            !priceMaxRange)
            return;
        var min = Number(priceMinRange.value);
        var max = Number(priceMaxRange.value);
        if (min > max)
            min = max;
        minPriceInput.value = min.toString();
        maxPriceInput.value = max.toString();
        localStorage.setItem("minPrice", min.toString());
        localStorage.setItem("maxPrice", max.toString());
        loadEquipment();
    }
    priceMinRange === null || priceMinRange === void 0 ? void 0 : priceMinRange.addEventListener("input", syncPrice);
    priceMaxRange === null || priceMaxRange === void 0 ? void 0 : priceMaxRange.addEventListener("input", syncPrice);
    minPriceInput === null || minPriceInput === void 0 ? void 0 : minPriceInput.addEventListener("change", function () {
        if (priceMinRange)
            priceMinRange.value = minPriceInput.value;
        syncPrice();
    });
    maxPriceInput === null || maxPriceInput === void 0 ? void 0 : maxPriceInput.addEventListener("change", function () {
        if (priceMaxRange)
            priceMaxRange.value = maxPriceInput.value;
        syncPrice();
    });
    // ============================
    // STAFF PROFILE RENDER
    // ============================
    fetch("/sports_rental_system/staff/api/get_profile.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var pointEl = document.getElementById("topPoints");
    });
    // ============================
    // LOAD BRANCH
    // ============================
    fetch("/sports_rental_system/staff/api/get_selected_branch.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var _a;
        if (!res || res.success === false) {
            window.location.href =
                "branches.html";
            return;
        }
        var data = (_a = res.data) !== null && _a !== void 0 ? _a : res;
        selectedBranchId =
            data.branch_id;
        if (branchLabel)
            branchLabel.textContent =
                data.name;
        if (timeSlot) {
            generateTimeSlots(data.open_time, data.close_time);
            if (savedTime)
                timeSlot.value = savedTime;
        }
        loadEquipment();
    });
    // ============================
    // SEARCH
    // ============================
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", function () {
        searchKeyword =
            searchInput.value.trim();
        loadEquipment();
    });
    // ============================
    // LOAD CATEGORIES
    // ============================
    fetch("/sports_rental_system/staff/api/get_categories.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (!res.success || !categoryBox)
            return;
        categoryBox.innerHTML = "";
        res.data.forEach(function (cat) {
            var label = document.createElement("label");
            label.innerHTML = "\n          <input type=\"checkbox\" value=\"".concat(cat.category_id, "\">\n          <span>").concat(cat.name, "</span>\n        ");
            var checkbox = label.querySelector("input");
            checkbox.addEventListener("change", function () {
                var id = checkbox.value;
                if (checkbox.checked) {
                    selectedCategories.push(id);
                }
                else {
                    selectedCategories =
                        selectedCategories.filter(function (c) { return c !== id; });
                }
                loadEquipment();
            });
            categoryBox.appendChild(label);
        });
    });
    // ============================
    // LOAD SESSION & BRANCH INFO
    // ============================
    fetch("/sports_rental_system/staff/api/check_session.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (data.success) {
            selectedBranchId = data.branch_id;
            if (branchLabel) {
                branchLabel.textContent = data.branch_name;
            }
            // 3. เมื่อได้ Branch ID แล้วค่อยสั่งโหลดอุปกรณ์
            loadEquipment();
        }
        else {
            // ถ้าไม่ได้ล็อกอิน ให้เด้งไปหน้า login
            window.location.href = "login.html";
        }
    });
    // ============================
    // LOAD EQUIPMENT
    // ============================
    function loadEquipment() {
        if (!selectedBranchId ||
            !equipmentGrid)
            return;
        var params = new URLSearchParams();
        params.set("branch_id", selectedBranchId);
        if (selectedCategories.length > 0)
            params.set("categories", selectedCategories.join(","));
        if (minPriceInput === null || minPriceInput === void 0 ? void 0 : minPriceInput.value)
            params.set("min_price", minPriceInput.value);
        if (maxPriceInput === null || maxPriceInput === void 0 ? void 0 : maxPriceInput.value)
            params.set("max_price", maxPriceInput.value);
        if (searchKeyword !== "")
            params.set("q", searchKeyword);
        equipmentGrid.innerHTML =
            "<p class=\"loading-text\">\n        \u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C...\n      </p>";
        fetch("/sports_rental_system/staff/api/get_equipment.php?" +
            params.toString())
            .then(function (res) { return res.json(); })
            .then(function (res) {
            equipmentGrid.innerHTML = "";
            if (!res.success ||
                res.data.length === 0) {
                equipmentGrid.innerHTML =
                    "<p>ไม่พบอุปกรณ์</p>";
                updateCartCount();
                return;
            }
            var template = document.getElementById("equipmentCardTemplate");
            res.data.forEach(function (item) {
                var card = template.content
                    .firstElementChild
                    .cloneNode(true);
                var img = card.querySelector("img");
                var nameEl = card.querySelector(".name");
                var priceEl = card.querySelector(".price");
                var stockEl = card.querySelector(".stock");
                var qtyText = card.querySelector(".qty-num");
                var plusBtn = card.querySelector(".qty-plus");
                var minusBtn = card.querySelector(".qty-minus");
                var qty = getQtyInCart(item.equipment_id);
                img.src =
                    item.image_url;
                nameEl.textContent =
                    item.name;
                priceEl.textContent =
                    "".concat(item.price_per_unit, " \u0E1A\u0E32\u0E17 / \u0E0A\u0E21.");
                stockEl.textContent =
                    "\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D ".concat(item.available_stock, " \u0E0A\u0E34\u0E49\u0E19");
                qtyText.textContent =
                    qty.toString();
                if (qty > 0)
                    card.classList.add("selected");
                // ➕ เพิ่ม
                plusBtn.addEventListener("click", function () {
                    var currentQty = getQtyInCart(item.equipment_id);
                    if (currentQty >=
                        item.available_stock) {
                        alert("\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E44\u0E14\u0E49\u0E21\u0E32\u0E01\u0E2A\u0E38\u0E14 ".concat(item.available_stock, " \u0E0A\u0E34\u0E49\u0E19"));
                        return;
                    }
                    increaseCartItem(item, item.available_stock);
                    updateCardQty(card, item.equipment_id);
                });
                // ➖ ลด
                minusBtn.addEventListener("click", function () {
                    decreaseCartItem(item);
                    updateCardQty(card, item.equipment_id);
                });
                equipmentGrid.appendChild(card);
            });
            updateCartCount();
        });
    }
});
// ============================
// CART HELPERS
// ============================
function getCart() {
    try {
        var raw = localStorage.getItem("cart");
        if (!raw)
            return [];
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed)
            ? parsed
            : [];
    }
    catch (_a) {
        return [];
    }
}
function getQtyInCart(id) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) ===
            String(id)) {
            return cart[i].qty;
        }
    }
    return 0;
}
// ➕ เพิ่ม
function increaseCartItem(item, maxStock) {
    var cart = getCart();
    var index = -1;
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) ===
            String(item.equipment_id)) {
            index = i;
            break;
        }
    }
    if (index === -1) {
        cart.push({
            id: String(item.equipment_id),
            name: item.name,
            price: item.price_per_unit,
            qty: 1,
            image: item.image_url,
            stock: maxStock,
            category_id: item.category_id
        });
    }
    else {
        if (cart[index].qty >=
            maxStock)
            return;
        cart[index].qty++;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ➖ ลด
function decreaseCartItem(item) {
    var cart = getCart();
    var index = -1;
    for (var i = 0; i < cart.length; i++) {
        if (String(cart[i].id) ===
            String(item.equipment_id)) {
            index = i;
            break;
        }
    }
    if (index === -1)
        return;
    cart[index].qty--;
    if (cart[index].qty <= 0)
        cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ============================
// UPDATE CARD
// ============================
function updateCardQty(card, equipmentId) {
    var qty = getQtyInCart(equipmentId);
    var qtyText = card.querySelector(".qty-num");
    qtyText.textContent =
        qty.toString();
    if (qty > 0)
        card.classList.add("selected");
    else
        card.classList.remove("selected");
    updateCartCount();
}
// ============================
// UPDATE CART COUNT
// ============================
function updateCartCount() {
    var badge = document.getElementById("cartCount");
    if (!badge)
        return;
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total +=
            Number(cart[i].qty) || 0;
    }
    badge.textContent =
        total.toString();
}
// ===============================
// GENERATE TIME SLOTS
// ===============================
function generateTimeSlots(openTime, closeTime) {
    var select = document.getElementById("timeSlot");
    if (!select)
        return;
    select.innerHTML =
        "<option value=\"\">\n      \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E27\u0E25\u0E32\n    </option>";
    var openHour = parseInt(openTime.split(":")[0]);
    var closeHour = parseInt(closeTime.split(":")[0]);
    var lastStartHour = closeHour - 3;
    for (var h = openHour; h <= lastStartHour; h++) {
        var hour = h < 10
            ? "0" + h
            : h.toString();
        var opt = document.createElement("option");
        opt.value = hour;
        opt.textContent =
            "".concat(hour, ":00 \u0E19.");
        select.appendChild(opt);
    }
}
