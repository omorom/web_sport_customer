console.log("🔥 CONFIRM TS VERSION OK 🔥");
var USER_POINTS = 0;
var usedPoints = 0;
var couponDiscount = 0;
var couponCode = null;
var equipmentTotal = 0;
var fieldTotal = 0;
var extraHourFee = 0;
var selectedBranchId = null;
var BASE_HOURS = 3;
document.addEventListener("DOMContentLoaded", function () {
    loadProfile();
    loadBookingInfo();
    renderItems();
    calcTotals();
    bindPointControls();
    bindCoupon();
    bindSubmit();
    loadBranch();
});
/* ===============================
   LOAD BRANCH
================================ */
function loadBranch() {
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
        localStorage.setItem("branchId", data.branch_id);
    });
}
/* ===============================
   LOAD USER
================================ */
function loadProfile() {
    fetch("/sports_rental_system/api/get_profile.php")
        .then(function (r) { return r.json(); })
        .then(function (d) {
        USER_POINTS = Number(d.points || 0);
        var top = document.getElementById("topPoints");
        if (top)
            top.textContent = "\u2B50 ".concat(USER_POINTS, " \u0E04\u0E30\u0E41\u0E19\u0E19");
        var user = document.getElementById("userPoints");
        if (user)
            user.textContent = USER_POINTS.toString();
    });
}
/* ===============================
   BOOKING INFO
================================ */
function loadBookingInfo() {
    var date = localStorage.getItem("rentDate");
    var time = localStorage.getItem("timeSlot");
    var hours = Number(localStorage.getItem("rentHours") || 1);
    var dateEl = document.getElementById("confirmDate");
    if (dateEl)
        dateEl.textContent = date || "-";
    var timeEl = document.getElementById("confirmTime");
    if (timeEl && time && hours) {
        var s = Number(time);
        var e = s + hours;
        timeEl.textContent = "".concat(pad(s), ":00 - ").concat(pad(e), ":00");
    }
    var hoursEl = document.getElementById("confirmHours");
    if (hoursEl)
        hoursEl.textContent = hours.toString();
}
/* ===============================
   ITEMS
================================ */
function renderItems() {
    var box = document.getElementById("confirmItems");
    if (!box)
        return;
    var cart = getCart();
    var hours = Number(localStorage.getItem("rentHours") || 1);
    box.innerHTML = "";
    cart.forEach(function (item) {
        var price = Number(item.price || 0);
        var qty = Number(item.qty || 1);
        var perHourTotal = price * qty;
        var total = perHourTotal * hours;
        var row = document.createElement("div");
        row.className = "confirm-item";
        var imgHtml = item.image && item.image !== "null"
            ? "<img src=\"".concat(item.image.trim(), "\" alt=\"\">")
            : "";
        row.innerHTML = "\n            ".concat(imgHtml, "\n\n            <div class=\"confirm-item-info\">\n                <h4>").concat(item.name, "</h4>\n                <small>").concat(isField(item.type) ? "สนาม" : "อุปกรณ์", "</small>\n            </div>\n\n            <div class=\"confirm-item-qty\">\n                x<strong>").concat(qty, "</strong>\n            </div>\n\n            <div class=\"confirm-item-price\">\n                <div class=\"per-hour\">\n                    ").concat(perHourTotal, " \u0E1A\u0E32\u0E17 / \u0E0A\u0E21.\n                </div>\n                <strong>\n                    ").concat(perHourTotal, " \u00D7 ").concat(hours, " = ").concat(total, " \u0E1A\u0E32\u0E17\n                </strong>\n            </div>\n        ");
        box.appendChild(row);
    });
}
/* ===============================
   POINT CONTROL
================================ */
function bindPointControls() {
    var _a, _b, _c;
    var input = document.getElementById("usePointInput");
    if (!input)
        return;
    var getGross = function () {
        return equipmentTotal +
            fieldTotal +
            extraHourFee;
    };
    var getMaxUsablePoints = function () {
        return Math.max(getGross() - couponDiscount, 0);
    };
    (_a = document.getElementById("plusPoint")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        if (usedPoints < USER_POINTS &&
            usedPoints < getMaxUsablePoints()) {
            usedPoints++;
            input.value = usedPoints.toString();
            updateTotals();
        }
    });
    (_b = document.getElementById("minusPoint")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        if (usedPoints > 0) {
            usedPoints--;
            input.value = usedPoints.toString();
            updateTotals();
        }
    });
    (_c = document.getElementById("useMaxPoint")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        usedPoints =
            Math.min(USER_POINTS, getMaxUsablePoints());
        input.value = usedPoints.toString();
        updateTotals();
    });
}
/* ===============================
   COUPON
================================ */
function bindCoupon() {
    var _a;
    (_a = document.getElementById("applyCoupon")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var input = document.getElementById("couponInput");
        if (!input)
            return;
        var code = input.value.trim();
        if (!code)
            return;
        var gross = equipmentTotal +
            fieldTotal +
            extraHourFee;
        fetch("/sports_rental_system/api/check_coupon.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                code: code,
                total: gross,
                cart: getCart()
            })
        })
            .then(function (r) { return r.json(); })
            .then(function (res) {
            var msg = document.getElementById("couponMsg");
            if (!res.success) {
                if (msg) {
                    msg.textContent = res.message;
                    msg.className = "msg error";
                }
                couponDiscount = 0;
                couponCode = null;
                updateTotals();
                return;
            }
            if (res.type === "percent") {
                couponDiscount =
                    Math.floor(gross *
                        Number(res.discount) / 100);
            }
            else {
                couponDiscount =
                    Number(res.discount || 0);
            }
            couponCode = code;
            if (msg) {
                msg.textContent =
                    "\u0E43\u0E0A\u0E49\u0E04\u0E39\u0E1B\u0E2D\u0E07\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E25\u0E14 ".concat(couponDiscount, " \u0E1A\u0E32\u0E17");
                msg.className = "msg success";
            }
            updateTotals();
        });
    });
}
/* ===============================
   TOTAL CALC
================================ */
function calcTotals() {
    equipmentTotal = 0;
    fieldTotal = 0;
    var cart = getCart();
    var hours = Number(localStorage.getItem("rentHours") || 1);
    cart.forEach(function (i) {
        var price = Number(i.price || 0);
        var qty = Number(i.qty || 1);
        var subtotal = price *
            qty *
            hours;
        if (isField(i.type)) {
            fieldTotal += subtotal;
        }
        else {
            equipmentTotal += subtotal;
        }
    });
    extraHourFee = calcExtraHourFee(hours);
    updateTotals();
}
function calcExtraHourFee(hours) {
    if (hours <= 3)
        return 0;
    if (hours === 4)
        return 100;
    if (hours === 5)
        return 200;
    if (hours >= 6)
        return 300;
    return 0;
}
/* ===============================
   UPDATE TOTAL UI
================================ */
function updateTotals() {
    var gross = equipmentTotal +
        fieldTotal +
        extraHourFee;
    var net = Math.max(gross -
        usedPoints -
        couponDiscount, 0);
    setText("equipmentTotal", equipmentTotal + " บาท");
    setText("fieldTotal", fieldTotal + " บาท");
    setText("extraHourFee", extraHourFee + " บาท");
    setText("pointDiscount", usedPoints.toString());
    setText("couponDiscount", couponDiscount.toString());
    setText("netTotal", net + " บาท");
    // ✅ ใช้ net ให้ตรง backend
    setText("earnPoints", Math.floor(net / 100).toString());
}
/* ===============================
   SUBMIT
================================ */
function bindSubmit() {
    var _a;
    (_a = document.getElementById("payBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var ok = confirm("เมื่อกดยืนยัน ระบบจะทำการจองรายการ และให้ดำเนินการชำระเงินทันที\n\nต้องการดำเนินการต่อหรือไม่?");
        if (!ok)
            return;
        var branchId = localStorage.getItem("branchId");
        if (!branchId) {
            alert("❌ กรุณาเลือกสาขาก่อนทำการจอง");
            window.location.href = "branches.html";
            return;
        }
        var rawDate = localStorage.getItem("rentDate");
        if (rawDate && rawDate.indexOf("/") !== -1) {
            var parts = rawDate.split("/");
            rawDate =
                parts[2] + "-" +
                    parts[1] + "-" +
                    parts[0];
        }
        var timeSlotRaw = localStorage.getItem("timeSlot");
        if (!rawDate || !timeSlotRaw) {
            alert("❌ ข้อมูลวันหรือเวลาไม่ครบ");
            return;
        }
        var payload = {
            branchId: branchId,
            rentDate: rawDate,
            timeSlot: Number(timeSlotRaw), // ✅ cast เป็น number
            rentHours: Number(localStorage.getItem("rentHours") || 1),
            usedPoints: usedPoints,
            couponDiscount: couponDiscount,
            couponCode: couponCode,
            cart: getCart()
        };
        console.log("🚀 CREATE BOOKING PAYLOAD =>", payload);
        fetch("/sports_rental_system/api/create_booking.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
            .then(function (r) { return r.json(); })
            .then(function (data) {
            if (!data.success) {
                alert("❌ ไม่สามารถสร้างการจองได้: " + data.message);
                return;
            }
            window.location.href =
                "payment.html?code=".concat(data.booking_code);
        })
            .catch(function (err) {
            console.error(err);
            alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        });
    });
}
/* ===============================
   UTILS
================================ */
function getCart() {
    var raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
}
function pad(n) {
    return n < 10 ? "0" + n : n.toString();
}
function setText(id, value) {
    var el = document.getElementById(id);
    if (el)
        el.textContent = value;
}
function isField(type) {
    return (type === "field" ||
        type === "สนาม");
}
