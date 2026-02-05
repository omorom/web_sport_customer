document.addEventListener("DOMContentLoaded", function () {
    console.log("field.ts loaded");
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
    var hourInput = document.getElementById("rentHours");
    var dateInput = document.getElementById("rentDate");
    var categoryBox = document.getElementById("categoryList");
    var venueGrid = document.getElementById("venueGrid");
    var searchInput = document.getElementById("searchInput");
    // ============================
    // PROFILE
    // ============================
    fetch("/sports_rental_system/api/get_profile.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var pointEl = document.getElementById("topPoints");
        if (pointEl && data.points !== undefined) {
            pointEl.textContent = "\u2B50 ".concat(data.points, " \u0E04\u0E30\u0E41\u0E19\u0E19");
        }
    });
    // ============================
    // LOAD BRANCH
    // ============================
    fetch("/sports_rental_system/api/get_selected_branch.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var _a;
        if (!res || res.success === false) {
            window.location.href = "branches.html";
            return;
        }
        var data = (_a = res.data) !== null && _a !== void 0 ? _a : res;
        selectedBranchId = data.branch_id;
        if (branchLabel)
            branchLabel.textContent = data.name;
        if (timeSlot) {
            generateTimeSlots(data.open_time, data.close_time);
        }
        loadVenues();
    });
    // ============================
    // SEARCH
    // ============================
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", function () {
        searchKeyword = searchInput.value.trim();
        loadVenues();
    });
    // ============================
    // LOAD CATEGORIES
    // ============================
    fetch("/sports_rental_system/api/get_categories.php")
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
                loadVenues();
            });
            categoryBox.appendChild(label);
        });
    });
    // ============================
    // LOAD VENUES
    // ============================
    function loadVenues() {
        if (!selectedBranchId || !venueGrid)
            return;
        var params = new URLSearchParams();
        params.set("branch_id", selectedBranchId);
        if (selectedCategories.length > 0) {
            params.set("categories", selectedCategories.join(","));
        }
        if (searchKeyword !== "") {
            params.set("q", searchKeyword);
        }
        venueGrid.innerHTML =
            "<p class=\"loading-text\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E2A\u0E19\u0E32\u0E21...</p>";
        fetch("/sports_rental_system/api/get_venues.php?" +
            params.toString())
            .then(function (res) { return res.json(); })
            .then(function (res) {
            venueGrid.innerHTML = "";
            if (!res.success || res.data.length === 0) {
                venueGrid.innerHTML = "<p>ไม่พบสนาม</p>";
                return;
            }
            res.data.forEach(function (item) {
                var card = document.createElement("div");
                card.className = "equipment-card";
                var img = item.image_url && item.image_url !== ""
                    ? item.image_url
                    : "images/no-image.png";
                var qty = getFieldQty(item.venue_id);
                card.innerHTML = "\n            <img src=\"".concat(img, "\">\n            <h5 class=\"name\">").concat(item.name, "</h5>\n            <p class=\"price\">").concat(item.price_per_hour, " \u0E1A\u0E32\u0E17 / \u0E0A\u0E21.</p>\n\n            <div class=\"card-qty-controls\">\n              <button class=\"qty-minus\">\u2212</button>\n              <span class=\"qty-num\">").concat(qty, "</span>\n              <button class=\"qty-plus\">+</button>\n            </div>\n          ");
                if (qty > 0) {
                    card.classList.add("selected");
                }
                var plusBtn = card.querySelector(".qty-plus");
                var minusBtn = card.querySelector(".qty-minus");
                plusBtn.addEventListener("click", function () {
                    var date = dateInput === null || dateInput === void 0 ? void 0 : dateInput.value;
                    var time = timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.value;
                    var hours = hourInput === null || hourInput === void 0 ? void 0 : hourInput.value;
                    if (!date || !time || !hours) {
                        alert("กรุณาเลือกวันที่ เวลา และจำนวนชั่วโมงก่อน");
                        return;
                    }
                    increaseField(item, date, time, hours);
                    updateFieldCard(card, item.venue_id);
                });
                minusBtn.addEventListener("click", function () {
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
// ============================
// FIELD QTY
// ============================
function getFieldQty(id) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].type === "field" &&
            String(cart[i].id) === String(id)) {
            return cart[i].qty;
        }
    }
    return 0;
}
// ============================
// ADD FIELD (MAX 1)
// ============================
function increaseField(field, date, time, hours) {
    var cart = getCart();
    var index = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].type === "field" &&
            String(cart[i].id) ===
                String(field.venue_id)) {
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
        date: date,
        time: time,
        hours: hours
    });
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ============================
// REMOVE FIELD
// ============================
function decreaseField(field) {
    var cart = getCart();
    var index = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].type === "field" &&
            String(cart[i].id) ===
                String(field.venue_id)) {
            index = i;
            break;
        }
    }
    if (index === -1)
        return;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ============================
// UPDATE FIELD CARD
// ============================
function updateFieldCard(card, id) {
    var qty = getFieldQty(id);
    var qtyText = card.querySelector(".qty-num");
    qtyText.textContent =
        qty.toString();
    if (qty > 0) {
        card.classList.add("selected");
    }
    else {
        card.classList.remove("selected");
    }
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
        total += Number(cart[i].qty) || 0;
    }
    badge.textContent = total.toString();
}
// ============================
// GENERATE TIME SLOTS
// ============================
function generateTimeSlots(openTime, closeTime) {
    var select = document.getElementById("timeSlot");
    if (!select)
        return;
    select.innerHTML =
        "<option value=\"\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E27\u0E25\u0E32</option>";
    var openHour = parseInt(openTime.split(":")[0]);
    var closeHour = parseInt(closeTime.split(":")[0]);
    var lastStartHour = closeHour - 3;
    for (var h = openHour; h <= lastStartHour; h++) {
        var hour = h < 10 ? "0" + h : h.toString();
        var opt = document.createElement("option");
        opt.value = hour;
        opt.textContent = "".concat(hour, ":00 \u0E19.");
        select.appendChild(opt);
    }
}
