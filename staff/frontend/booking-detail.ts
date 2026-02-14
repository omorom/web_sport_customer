interface BookingDetail {
    booking: any;
    items: any[];
}

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

const loading = document.getElementById("loading") as HTMLElement;
const box = document.getElementById("detailBox") as HTMLElement;
const slipBox = document.getElementById("slipBox") as HTMLElement;

fetch("/sports_rental_system/staff/api/get_booking_detail.php?code=" + code, {
    credentials: "include"
})
    .then(function (r) { return r.json(); })
    .then(function (res: BookingDetail & { success: boolean }) {

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

        setText("total", b.total_amount + " บาท");
        setText("discount", b.discount_amount + " บาท");
        setText("pointsUsed", b.points_used + " บาท");
        setText("net", b.net_amount + " บาท");

        var start = new Date(b.pickup_time).getTime();
        var end = new Date(b.due_return_time).getTime();
        var hours = Math.ceil((end - start) / (1000 * 60 * 60));

        renderItems(res.items, hours);

        renderPayment(b);

    })
    .catch(function (err) {
        console.error(err);
        alert("โหลดข้อมูลไม่สำเร็จ");
    });


// ==========================
// PAYMENT DISPLAY
// ==========================

function renderPayment(b: any) {

    slipBox.classList.add("hidden");
    slipBox.innerHTML = "";

    // ถ้ามีสลิป → แสดงทันที
    if (b.slip_url && b.payment_method === "QR") {

        var slipPath = fixPath(b.slip_url);

        slipBox.innerHTML =
            '<span>สลิปการชำระเงิน (QR)</span>' +
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


// ==========================
// FIX PATH (สำคัญมาก)
// ==========================

function fixPath(path: string): string {

    if (!path) return "";

    path = path.replace(/^\s+|\s+$/g, "");
    path = path.replace(/\\/g, "/");
    path = path.replace(/SPORTS_RENTAL_SYSTEM/i, "sports_rental_system");

    if (path.indexOf("/sports_rental_system") !== 0) {

        if (path.indexOf("/") === 0) {
            path = "/sports_rental_system" + path;
        } else {
            path = "/sports_rental_system/" + path;
        }
    }

    return path;
}


// ==========================
// RENDER ITEMS
// ==========================

function renderItems(items: any[], hours: number) {

    const list = document.getElementById("itemList")!;
    list.innerHTML = "";

    items.forEach(function (i) {

        const div = document.createElement("div");
        div.className = "item";

        const totalPrice = i.price * hours;
        const imagePath = fixPath(i.image);

        div.innerHTML =
            '<img src="' + imagePath + '" class="item-img" alt="' + i.name + '">' +
            '<div class="item-info">' +
            '<strong>' + i.name + '</strong> (' + i.type + ')<br>' +
            'จำนวน: ' + i.qty + ' | ' +
            'ชั่วโมงที่เช่า: ' + hours + ' ชม. | ' +
            'ราคา: ' + i.price + ' x ' + hours + ' = <b>' + totalPrice + '</b> บาท' +
            '</div>';

        list.appendChild(div);
    });
}

function setText(id: string, txt: string) {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
}
