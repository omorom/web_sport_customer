document.addEventListener("DOMContentLoaded", function () {
    console.log("cart.ts loaded");
    renderCart();
    renderBookingSummary();
    setupMemberModal();
});
/* ===============================
   MAIN RENDER
================================ */
function renderCart() {
    var cart = getCart();
    var emptyBox = document.getElementById("emptyCart");
    var itemsBox = document.getElementById("cartItems");
    var actionsBox = document.getElementById("cartActions");
    if (!emptyBox || !itemsBox || !actionsBox)
        return;
    if (!cart.length) {
        emptyBox.classList.remove("hidden");
        itemsBox.classList.add("hidden");
        actionsBox.classList.add("hidden");
        updateCartCount(0);
        return;
    }
    emptyBox.classList.add("hidden");
    itemsBox.classList.remove("hidden");
    actionsBox.classList.remove("hidden");
    itemsBox.innerHTML = "<h3>รายการที่เลือก</h3>";
    for (var i = 0; i < cart.length; i++) {
        var row = buildCartRow(cart[i], i);
        itemsBox.appendChild(row);
    }
    updateCartCount(cart.length);
}
/* ===============================
   SUMMARY BAR
================================ */
function renderBookingSummary() {
    var date = localStorage.getItem("rentDate") || "-";
    var time = localStorage.getItem("timeSlot");
    var hoursStr = localStorage.getItem("rentHours");
    var hours = Number(hoursStr || 0);
    var dateEl = document.getElementById("cartDate");
    var timeEl = document.getElementById("cartTime");
    var hourEl = document.getElementById("cartHours");
    if (dateEl)
        dateEl.textContent = date;
    if (timeEl) {
        if (time && hours) {
            var start = parseInt(time);
            var end = start + hours;
            timeEl.textContent =
                pad(start) + ":00 - " + pad(end) + ":00";
        }
        else if (time) {
            timeEl.textContent = time + ":00";
        }
        else {
            timeEl.textContent = "-";
        }
    }
    if (hourEl) {
        hourEl.textContent =
            hours ? hours + " ชั่วโมง" : "-";
    }
}
function pad(n) {
    return n < 10 ? "0" + n : n.toString();
}
/* ===============================
   BUILD ROW
================================ */
function buildCartRow(item, index) {
    console.log("ITEM:", item);
    var row = document.createElement("div");
    row.className = "cart-item";
    var img = item.image || "images/no-image.png";
    row.innerHTML = "\n        <img src=\"".concat(img, "\">\n\n        <div class=\"cart-item-info\">\n            <h4>").concat(item.name, "</h4>\n            <small>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C</small>\n        </div>\n\n        <div class=\"cart-item-qty\">\n            <select class=\"instance-select\">\n                <option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>\n            </select>\n        </div>\n\n        <button class=\"cart-item-remove\">\n            <i class=\"fa-solid fa-trash\"></i>\n        </button>\n    ");
    var select = row.querySelector(".instance-select");
    var removeBtn = row.querySelector(".cart-item-remove");
    if (item.type === "field") {
        // ใช้ venue_id เป็น instance เลย
        updateInstanceCode(index, item.id);
        select.innerHTML = "";
        var opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.id;
        select.appendChild(opt);
        select.value = item.id;
        // ไม่ต้องให้เปลี่ยน
        select.disabled = true;
    }
    // ===== EQUIPMENT =====
    else {
        loadInstancesForRow(item.id, select, item.instance_code);
    }
    select.addEventListener("change", function () {
        updateInstanceCode(index, select.value);
        renderCart(); // refresh เพื่อกันซ้ำ
    });
    removeBtn.addEventListener("click", function () {
        removeItemByIndex(index);
        renderCart();
    });
    return row;
}
/* ===============================
   LOAD INSTANCES
================================ */
function loadInstancesForRow(equipmentId, selectEl, selected) {
    fetch("/sports_rental_system/staff/api/get_equipment_instances.php?equipment_id=" +
        equipmentId)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (!data.success)
            return;
        selectEl.innerHTML =
            "<option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>";
        var cart = getCart();
        var usedCodes = [];
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].instance_code) {
                usedCodes.push(cart[i].instance_code);
            }
        }
        for (var i = 0; i < data.instances.length; i++) {
            var inst = data.instances[i];
            var used = false;
            for (var j = 0; j < usedCodes.length; j++) {
                if (usedCodes[j] === inst.instance_code &&
                    inst.instance_code !== selected) {
                    used = true;
                    break;
                }
            }
            if (used)
                continue;
            var opt = document.createElement("option");
            opt.value = inst.instance_code;
            opt.textContent =
                inst.instance_code;
            if (selected === inst.instance_code) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        }
    });
}
/* ===============================
   MEMBER MODAL
================================ */
function setupMemberModal() {
    var confirmBtn = document.getElementById("confirmBtn");
    var modal = document.getElementById("memberModal");
    var closeBtn = document.getElementById("closeMemberModal");
    var searchBtn = document.getElementById("searchMemberBtn");
    var confirmMemberBtn = document.getElementById("confirmMemberBtn");
    var input = document.getElementById("memberInput");
    var foundCustomer = null;
    confirmBtn.addEventListener("click", function () {
        var cart = getCart();
        if (!cart.length) {
            alert("ไม่มีรายการในตะกร้า");
            return;
        }
        var missing = false;
        for (var i = 0; i < cart.length; i++) {
            if (!cart[i].instance_code) {
                missing = true;
                break;
            }
        }
        if (missing) {
            alert("กรุณาเลือกหมายเลขอุปกรณ์ให้ครบทุกชิ้น");
            return;
        }
        modal.classList.remove("hidden");
        input.value = "";
        foundCustomer = null;
        confirmMemberBtn.disabled = true;
    });
    closeBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
    });
    searchBtn.addEventListener("click", function () {
        var q = input.value.trim();
        if (!q) {
            alert("กรอกชื่อหรือรหัสสมาชิก");
            return;
        }
        fetch("/sports_rental_system/staff/api/search_customer.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: q })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            if (!data.success) {
                alert("ไม่พบสมาชิก");
                return;
            }
            foundCustomer = data.customer;
            confirmMemberBtn.disabled = false;
            fillMemberResult(foundCustomer);
        });
    });
    confirmMemberBtn.addEventListener("click", function () {
        if (!foundCustomer)
            return;
        localStorage.setItem("customer_id", foundCustomer.customer_id);
        modal.classList.add("hidden");
        var total = calcCartTotal(getCart());
        localStorage.setItem("cartTotal", total.toString());
        window.location.href = "confirm.html";
    });
}
/* ===============================
   MEMBER RESULT
================================ */
function fillMemberResult(data) {
    var resultBox = document.getElementById("memberResult");
    resultBox.classList.remove("hidden");
    // name
    document.getElementById("mName").textContent =
        data.name;
    // type mapping
    var typeText = "";
    if (data.customer_type === "student") {
        typeText = "นิสิตนักศึกษา";
    }
    else {
        typeText = "บุคคลทั่วไป";
    }
    document.getElementById("mType").textContent =
        typeText;
    // hide member level ❌
    var levelRow = document.getElementById("memberLevelRow");
    if (levelRow)
        levelRow.remove();
    // points
    document.getElementById("mPoints").textContent =
        data.current_points;
    // phone
    document.getElementById("mPhone").textContent =
        data.phone;
    // faculty + year (only student)
    var facultyRow = document.getElementById("facultyRow");
    var yearRow = document.getElementById("yearRow");
    if (data.customer_type === "student") {
        facultyRow.classList.remove("hidden");
        yearRow.classList.remove("hidden");
        document.getElementById("mFaculty").textContent =
            data.faculty_name || "-";
        document.getElementById("mYear").textContent =
            data.study_year || "-";
    }
    else {
        facultyRow.classList.add("hidden");
        yearRow.classList.add("hidden");
    }
}
function loadVenueInstances(venueId, selectEl, selected) {
    fetch("/sports_rental_system/staff/api/get_venue_instances.php?venue_id=" +
        venueId)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (!data.success)
            return;
        selectEl.innerHTML =
            "<option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>";
        for (var i = 0; i < data.venues.length; i++) {
            var v = data.venues[i];
            var opt = document.createElement("option");
            opt.value = v.venue_code;
            opt.textContent = v.venue_code;
            if (selected === v.venue_code) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        }
    });
}
/* ===============================
   HELPERS
================================ */
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
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
function removeItemByIndex(index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}
function updateInstanceCode(index, code) {
    var cart = getCart();
    cart[index].instance_code = code;
    saveCart(cart);
}
function updateCartCount(count) {
    var badge = document.getElementById("cartCount");
    if (badge) {
        badge.textContent = count.toString();
    }
}
function calcCartTotal(cart) {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += Number(cart[i].price) || 0;
    }
    return total;
}
