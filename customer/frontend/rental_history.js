var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
document.addEventListener("DOMContentLoaded", function () {
    loadHistory();
});
function loadHistory() {
    fetch("/sports_rental_system/customer/api/get_booking_history.php", {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        var loading = document.getElementById("loading");
        var box = document.getElementById("historyBox");
        loading.style.display = "none";
        if (!res.success || !Array.isArray(res.items)) {
            alert("ไม่พบข้อมูลประวัติการเช่า");
            return;
        }
        box.classList.remove("hidden");
        renderHistory(res.items);
    });
}
// ส่วนดึงคะแนน Profile (คงเดิม)
fetch("/sports_rental_system/customer/api/get_profile.php")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    var pointEl = document.getElementById("topPoints");
    if (pointEl && data.points !== undefined) {
        pointEl.textContent = "\u2B50 ".concat(data.points, " \u0E04\u0E30\u0E41\u0E19\u0E19");
    }
});
function renderHistory(items) {
    var list = document.getElementById("historyList");
    list.innerHTML = "";
    // กรองเฉพาะรายการที่เสร็จสิ้นหรือยกเลิก
    var completedItems = items.filter(function (b) {
        return b.status_code === "COMPLETED" ||
            b.status_code === "CANCELLED";
    });
    if (completedItems.length === 0) {
        list.innerHTML = "\n            <p style=\"text-align:center; color: gray; padding: 20px;\">\n                \u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E34\u0E49\u0E19\u0E2B\u0E23\u0E37\u0E2D\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n            </p>\n        ";
        return;
    }
    completedItems.forEach(function (b) {
        var div = document.createElement("div");
        div.className = "history-item";
        var hours = getHours(b.pickup_time, b.due_return_time);
        // กำหนด class และ text สำหรับสถานะการชำระเงิน (เหมือนเดิม)
        var paymentInfo = getPaymentStatusUI(b.payment_status_code);
        div.innerHTML = "\n            <div class=\"history-left\">\n                <img \n                    src=\"".concat(b.display_image, "\" \n                    alt=\"").concat(b.display_name, "\"\n                    class=\"history-img\"\n                >\n                <div class=\"history-info\">      \n                    <div><strong>\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07:</strong> ").concat(b.booking_id, "</div>\n                    <div>\n                        <strong>").concat(b.item_type === 'Venue' ? 'สนาม' : 'อุปกรณ์', ":</strong> \n                        ").concat(b.display_name, " \n                        ").concat(b.instance_code ? "(".concat(b.instance_code, ")") : "", "\n                    </div>\n                    <div><strong>\u0E08\u0E33\u0E19\u0E27\u0E19:</strong> ").concat(b.quantity, " ").concat(b.item_type === 'Venue' ? 'สนาม' : 'ชิ้น', " | <strong>\u0E40\u0E27\u0E25\u0E32:</strong> ").concat(hours, " \u0E0A\u0E21.</div>\n                    <div><strong>\u0E22\u0E2D\u0E14\u0E0A\u0E33\u0E23\u0E30:</strong> ").concat(b.net_amount, " \u0E1A\u0E32\u0E17</div>\n                    <div><strong>\u0E2A\u0E16\u0E32\u0E19\u0E30:</strong> ").concat(b.status_name, "</div>\n                    <div>\n                        <strong>\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19:</strong>\n                        <span class=\"payment-status ").concat(paymentInfo.class, "\">\n                            ").concat(paymentInfo.text, "\n                        </span>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"history-right\">\n                ").concat(!(b.status_code === "COMPLETED" || b.status_code === "CANCELLED")
            ? "<p style=\"color: gray;\">\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E23\u0E35\u0E27\u0E34\u0E27\u0E44\u0E14\u0E49</p>"
            : b.is_reviewed ?
                "\n                        <div class=\"review-display\">\n                            <div class=\"review-text\">".concat(b.review_text || "", "</div>\n                            <p style=\"color: green; margin-top:5px;\">\u2714 \u0E23\u0E35\u0E27\u0E34\u0E27\u0E41\u0E25\u0E49\u0E27</p>\n                        </div>\n                    ")
                :
                    "\n                    <div class=\"star-rating\">\n                        <span class=\"star\" data-value=\"1\">&#9733;</span>\n                        <span class=\"star\" data-value=\"2\">&#9733;</span>\n                        <span class=\"star\" data-value=\"3\">&#9733;</span>\n                        <span class=\"star\" data-value=\"4\">&#9733;</span>\n                        <span class=\"star\" data-value=\"5\">&#9733;</span>\n                    </div>\n                    <input type=\"hidden\" class=\"rating-value\" value=\"5\">\n                    <textarea placeholder=\"\u0E40\u0E02\u0E35\u0E22\u0E19\u0E23\u0E35\u0E27\u0E34\u0E27\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13...\" class=\"review-box\"></textarea>\n                    <button class=\"review-btn\">\u0E2A\u0E48\u0E07\u0E23\u0E35\u0E27\u0E34\u0E27</button>\n                ", "\n            </div>\n        ");
        // จัดการ Event สำหรับการส่งรีวิว (เหมือนเดิมแต่ส่ง b เข้าไปใน submitReview)
        if ((b.status_code === "COMPLETED" || b.status_code === "CANCELLED") && !b.is_reviewed) {
            setupReviewEvents(div, b);
        }
        list.appendChild(div);
    });
}
// ฟังก์ชันช่วยจัดการสถานะการชำระเงิน
function getPaymentStatusUI(code) {
    var statusMap = {
        "UNPAID": { text: "ยังไม่ได้ชำระเงิน", class: "payment-unpaid" },
        "WAITING_VERIFY": { text: "รอตรวจสอบสลิป", class: "payment-waiting" },
        "PAID": { text: "ชำระเงินสำเร็จ", class: "payment-success" },
        "REJECTED": { text: "สลิปไม่ผ่าน", class: "payment-rejected" },
        "REFUNDED": { text: "คืนเงินแล้ว", class: "payment-refund" },
        "CANCELLED": { text: "ยกเลิก", class: "payment-cancel" },
        "EXPIRED": { text: "หมดเวลาชำระเงิน", class: "payment-expired" }
    };
    return statusMap[code] || { text: "ไม่ทราบสถานะ", class: "payment-default" };
}
// ฟังก์ชันแยกสำหรับจัดการดาวและการส่งรีวิว
function setupReviewEvents(div, item) {
    var btn = div.querySelector(".review-btn");
    var textarea = div.querySelector(".review-box");
    var ratingInput = div.querySelector(".rating-value");
    var stars = div.querySelectorAll(".star");
    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            var value = star.dataset.value;
            ratingInput.value = value;
            updateStars(stars, parseInt(value));
        });
    });
    btn.onclick = function () {
        submitReview(item, textarea, ratingInput);
    };
}
function updateStars(stars, value) {
    stars.forEach(function (s) {
        var starVal = parseInt(s.dataset.value);
        s.classList.toggle("selected", starVal <= value);
    });
}
function getHours(start, end) {
    var s = new Date(start).getTime();
    var e = new Date(end).getTime();
    return Math.ceil((e - s) / (1000 * 60 * 60));
}
function submitReview(item, textarea, ratingInput) {
    var _this = this;
    var reviewText = textarea.value.trim();
    var ratingValue = Number(ratingInput.value);
    if (!reviewText) {
        alert("กรุณาเขียนรีวิวก่อนส่ง");
        return;
    }
    if (!ratingValue || ratingValue <= 0) {
        alert("กรุณาให้คะแนนก่อนส่ง");
        return;
    }
    var payload = {
        booking_id: item.booking_id,
        detail_id: Number(item.detail_id),
        instance_code: item.instance_code || null,
        venue_id: item.venue_id || null, // ตอนนี้ TypeScript จะไม่ฟ้อง error แล้ว
        review_text: reviewText,
        rating: ratingValue
    };
    fetch("/sports_rental_system/customer/api/add_review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    })
        .then(function (r) { return __awaiter(_this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, r.text()];
                case 1:
                    text = _a.sent();
                    try {
                        return [2 /*return*/, JSON.parse(text)];
                    }
                    catch (e) {
                        throw new Error("เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ: " + text.substring(0, 100));
                    }
                    return [2 /*return*/];
            }
        });
    }); })
        .then(function (res) {
        if (res.success) {
            alert("ขอบคุณสำหรับรีวิว!");
            loadHistory();
        }
        else {
            alert(res.message || "เกิดข้อผิดพลาด");
        }
    })
        .catch(function (err) {
        console.error("Fetch Error:", err);
        alert(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    });
}
