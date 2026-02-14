document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    var code = params.get("code");
    var loading = document.getElementById("loading");
    var box = document.getElementById("detailBox");
    var slipBox = document.getElementById("slipBox");
    if (!code) {
        alert("ไม่พบรหัสการจอง");
        window.location.href = "my-bookings.html";
        return;
    }
    fetch("/sports_rental_system/customer/api/get_booking_detail.php?code=" + code, {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        loading.style.display = "none";
        if (!res.success) {
            alert("ไม่พบข้อมูล");
            return;
        }
        box.classList.remove("hidden");
        var b = res.booking;
        setText("bkCode", b.booking_id);
        setText("pickup", b.pickup_time);
        setText("return", b.due_return_time);
        setText("bookingStatus", b.booking_status);
        setText("paymentStatus", b.payment_status);
        setText("total", formatMoney(b.total_amount));
        setText("discount", formatMoney(b.discount_amount));
        setText("pointsUsed", formatMoney(b.points_used_value || 0));
        setText("net", formatMoney(b.net_amount));
        var start = new Date(b.pickup_time).getTime();
        var end = new Date(b.due_return_time).getTime();
        var hours = Math.ceil((end - start) / (1000 * 60 * 60));
        if (hours < 1)
            hours = 1;
        renderItems(res.items, hours);
        renderPayment(b, slipBox);
    })
        .catch(function (err) {
        console.error("API ERROR:", err);
        alert("โหลดข้อมูลไม่สำเร็จ");
    });
    loadProfilePoints();
});
// ==============================
// PAYMENT DISPLAY
// ==============================
function renderPayment(b, slipBox) {
    slipBox.classList.add("hidden");
    slipBox.innerHTML = "";
    if (b.slip_url && b.payment_method === "QR") {
        var slipPath = fixPath(b.slip_url);
        slipBox.innerHTML =
            '<span>สลิปการชำระเงิน</span>' +
                '<div>' +
                '<a href="' + slipPath + '" target="_blank">' +
                '<img src="' + slipPath + '" style="max-width:300px; margin-top:10px;" />' +
                '</a>' +
                '</div>';
        slipBox.classList.remove("hidden");
        return;
    }
    if (b.payment_method === "CASH") {
        slipBox.innerHTML =
            '<span>การชำระเงิน</span>' +
                '<div class="payment-msg cash">' +
                'ชำระด้วยเงินสด' +
                '</div>';
        slipBox.classList.remove("hidden");
        return;
    }
    if (b.payment_method === "CREDIT_CARD") {
        slipBox.innerHTML =
            '<span>การชำระเงิน</span>' +
                '<div class="payment-msg credit">' +
                'ชำระผ่านบัตรเครดิต' +
                '</div>';
        slipBox.classList.remove("hidden");
    }
}
// ==============================
// RENDER ITEMS
// ==============================
function renderItems(items, hours) {
    var list = document.getElementById("itemList");
    list.innerHTML = "";
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var div = document.createElement("div");
        div.className = "item";
        var totalPrice = Number(item.price) * hours;
        var imagePath = fixPath(item.image);
        div.innerHTML =
            '<img src="' + imagePath + '" class="item-img" alt="' + item.name + '">' +
                '<div class="item-info">' +
                '<strong>' + item.name + '</strong> (' + item.type + ')<br>' +
                'จำนวน: ' + item.qty + ' | ' +
                'ชั่วโมงที่เช่า: ' + hours + ' ชม. | ' +
                'ราคา: ' + item.price + ' x ' + hours + ' = ' +
                '<b>' + totalPrice.toFixed(2) + '</b> บาท' +
                '</div>';
        list.appendChild(div);
    }
}
// ==============================
// FIX PATH (ES5 SAFE)
// ==============================
function fixPath(path) {
    if (!path)
        return "";
    path = path.replace(/^\s+|\s+$/g, "");
    path = path.replace(/\\/g, "/");
    path = path.replace(/SPORTS_RENTAL_SYSTEM/i, "sports_rental_system");
    if (path.indexOf("/sports_rental_system") !== 0) {
        if (path.indexOf("/") === 0) {
            path = "/sports_rental_system" + path;
        }
        else {
            path = "/sports_rental_system/" + path;
        }
    }
    return path;
}
// ==============================
// PROFILE POINTS
// ==============================
function loadProfilePoints() {
    fetch("/sports_rental_system/customer/api/get_profile.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var pointEl = document.getElementById("topPoints");
        if (pointEl && data.points !== undefined) {
            pointEl.textContent = "⭐ " + data.points + " คะแนน";
        }
    })
        .catch(function (err) {
        console.error("profile error:", err);
    });
}
// ==============================
// UTIL
// ==============================
function setText(id, txt) {
    var el = document.getElementById(id);
    if (el)
        el.textContent = txt || "-";
}
function formatMoney(n) {
    var num = Number(n) || 0;
    return num.toFixed(2) + " บาท";
}
