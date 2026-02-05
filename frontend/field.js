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
    // RESTORE
    // ============================
    var savedDate = localStorage.getItem("rentDate");
    var savedTime = localStorage.getItem("timeSlot");
    var savedHours = localStorage.getItem("rentHours");
    if (savedDate && dateInput)
        dateInput.value = savedDate;
    if (savedHours && hourInput)
        hourInput.value = savedHours;
    // ============================
    // DURATION BUTTONS
    // ============================
    var durationBtns = document.querySelectorAll(".duration-btn");
    var _loop_1 = function (i) {
        var btn = durationBtns[i];
        if (savedHours && btn.dataset.hour === savedHours) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", function () {
            for (var j = 0; j < durationBtns.length; j++) {
                durationBtns[j].classList.remove("active");
            }
            var hour = btn.dataset.hour;
            if (!hour || !hourInput)
                return;
            hourInput.value = hour;
            localStorage.setItem("rentHours", hour);
            btn.classList.add("active");
            regenerateTimeSlots();
            clearFieldInCart();
            loadVenues();
        });
    };
    for (var i = 0; i < durationBtns.length; i++) {
        _loop_1(i);
    }
    // ============================
    // SAVE CHANGE
    // ============================
    dateInput === null || dateInput === void 0 ? void 0 : dateInput.addEventListener("change", function () {
        localStorage.setItem("rentDate", dateInput.value);
        clearFieldInCart();
        loadVenues();
    });
    timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.addEventListener("change", function () {
        localStorage.setItem("timeSlot", timeSlot.value);
        clearFieldInCart();
        loadVenues();
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
            timeSlot.dataset.open = data.open_time;
            timeSlot.dataset.close = data.close_time;
            generateTimeSlots(data.open_time, data.close_time);
            if (savedTime)
                timeSlot.value = savedTime;
        }
        loadVenues();
    });
    // ============================
    // SEARCH
    // ============================
    var searchTimer;
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            searchKeyword = searchInput.value.trim();
            loadVenues();
        }, 400);
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
    // PROFILE
    // ============================
    fetch("/sports_rental_system/api/get_profile.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var pointEl = document.getElementById("topPoints");
        if (pointEl && data.points !== undefined) {
            pointEl.textContent =
                "\u2B50 ".concat(data.points, " \u0E04\u0E30\u0E41\u0E19\u0E19");
        }
    });
    // ============================
    // LOAD VENUES (ROBUST)
    // ============================
    function loadVenues() {
        if (!selectedBranchId || !venueGrid)
            return;
        var date = (dateInput === null || dateInput === void 0 ? void 0 : dateInput.value) || "";
        var time = (timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.value) || "";
        var hours = (hourInput === null || hourInput === void 0 ? void 0 : hourInput.value) || "3";
        venueGrid.innerHTML =
            "<p class=\"loading-text\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E2A\u0E19\u0E32\u0E21...</p>";
        var venueParams = new URLSearchParams();
        venueParams.set("branch_id", selectedBranchId);
        fetch("/sports_rental_system/api/get_venues.php?" +
            venueParams.toString())
            .then(function (r) { return r.json(); })
            .then(function (venueRes) {
            var availParams = new URLSearchParams();
            availParams.set("branch_id", selectedBranchId);
            availParams.set("date", date);
            availParams.set("time", time);
            availParams.set("hours", hours);
            fetch("/sports_rental_system/api/get_available_venues.php?" +
                availParams.toString())
                .then(function (r) { return r.json(); })
                .catch(function () { return ({}); })
                .then(function (availRes) {
                console.log("AVAILABLE API:", availRes);
                venueGrid.innerHTML = "";
                var unavailable = [];
                if (availRes) {
                    if (availRes.unavailable_ids)
                        unavailable = availRes.unavailable_ids;
                    else if (availRes.data)
                        unavailable = availRes.data;
                    else if (Array.isArray(availRes))
                        unavailable = availRes;
                }
                if (!venueRes || !venueRes.data) {
                    venueGrid.innerHTML = "<p>โหลดสนามไม่สำเร็จ</p>";
                    return;
                }
                var _loop_2 = function (i) {
                    var item = venueRes.data[i];
                    var disabled = false;
                    for (var j = 0; j < unavailable.length; j++) {
                        if (String(unavailable[j]) ===
                            String(item.venue_id)) {
                            disabled = true;
                            break;
                        }
                    }
                    var qty = getFieldQty(item.venue_id);
                    var card = document.createElement("div");
                    card.className = "equipment-card";
                    var img = item.image_url && item.image_url !== ""
                        ? item.image_url
                        : "images/no-image.png";
                    card.innerHTML = "\n                <img src=\"".concat(img, "\">\n                <h5 class=\"name\">").concat(item.name, "</h5>\n                <p class=\"price\">").concat(item.price_per_hour, " \u0E1A\u0E32\u0E17 / \u0E0A\u0E21.</p>\n\n                <div class=\"card-qty-controls\">\n                  <button class=\"qty-minus\" ").concat(disabled ? "disabled" : "", ">\u2212</button>\n                  <span class=\"qty-num\">").concat(qty, "</span>\n                  <button class=\"qty-plus\" ").concat(disabled ? "disabled" : "", ">+</button>\n                </div>\n\n                ").concat(disabled
                        ? "<div class=\"overlay-disabled\">\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07\u0E43\u0E19\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E19\u0E35\u0E49</div>"
                        : "", "\n              ");
                    if (disabled)
                        card.classList.add("disabled");
                    if (qty > 0)
                        card.classList.add("selected");
                    if (!disabled) {
                        var plusBtn = card.querySelector(".qty-plus");
                        var minusBtn = card.querySelector(".qty-minus");
                        plusBtn.addEventListener("click", function () {
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
                    }
                    venueGrid.appendChild(card);
                };
                for (var i = 0; i < venueRes.data.length; i++) {
                    _loop_2(i);
                }
            });
        });
    }
    // ============================
    // TIME SLOT
    // ============================
    function regenerateTimeSlots() {
        if (!timeSlot)
            return;
        var open = timeSlot.dataset.open;
        var close = timeSlot.dataset.close;
        if (!open || !close)
            return;
        generateTimeSlots(open, close);
    }
});
/* ===================================================
  CART HELPERS
=================================================== */
function getCart() {
    try {
        var raw = localStorage.getItem("cart");
        if (!raw)
            return [];
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (_a) {
        return [];
    }
}
function clearFieldInCart() {
    var cart = getCart()
        .filter(function (i) { return i.type !== "field"; });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
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
function increaseField(field, date, time, hours) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].type === "field" &&
            String(cart[i].id) ===
                String(field.venue_id)) {
            alert("สนามนี้เลือกได้เพียง 1 สนามเท่านั้น");
            return;
        }
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
    updateCartCount();
}
function decreaseField(field) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].type === "field" &&
            String(cart[i].id) ===
                String(field.venue_id)) {
            cart.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
function updateFieldCard(card, id) {
    var qty = getFieldQty(id);
    var qtyText = card.querySelector(".qty-num");
    qtyText.textContent = qty.toString();
    if (qty > 0)
        card.classList.add("selected");
    else
        card.classList.remove("selected");
}
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
function generateTimeSlots(openTime, closeTime) {
    var _a;
    var select = document.getElementById("timeSlot");
    if (!select)
        return;
    select.innerHTML =
        "<option value=\"\">\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E27\u0E25\u0E32</option>";
    var openHour = parseInt(openTime.split(":")[0]);
    var closeHour = parseInt(closeTime.split(":")[0]);
    var hours = Number((_a = document.getElementById("rentHours")) === null || _a === void 0 ? void 0 : _a.value) || 3;
    var lastStartHour = closeHour - hours;
    for (var h = openHour; h <= lastStartHour; h++) {
        var hour = h < 10 ? "0" + h : h.toString();
        var opt = document.createElement("option");
        opt.value = hour;
        opt.textContent = "".concat(hour, ":00 \u0E19.");
        select.appendChild(opt);
    }
}
