interface BookingItem {
    booking_id: string;
    detail_id: number;
    instance_code: string;
    venue_id?: string; // เพิ่มฟิลด์นี้เพื่อให้รองรับการจองสนาม
    item_type: 'Equipment' | 'Venue';
    display_image: string;
    display_name: string;
    pickup_time: string;
    due_return_time: string;
    net_amount: number;
    status_code: string;
    status_name: string;
    payment_status_code: string;
    payment_status_name: string;
    equipment_name: string;
    equipment_image: string;
    quantity: number;
    is_reviewed: boolean;
    review_text?: string;
    rating?: number;
}

document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
});

function loadHistory(): void {
    fetch("/sports_rental_system/customer/api/get_booking_history.php", {
        credentials: "include"
    })
    .then(r => r.json())
    .then((res: any) => {
        const loading = document.getElementById("loading")!;
        const box = document.getElementById("historyBox")!;

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
    .then(res => res.json())
    .then(data => {
        const pointEl = document.getElementById("topPoints");
        if (pointEl && data.points !== undefined) {
            pointEl.textContent = `⭐ ${data.points} คะแนน`;
        }
    });

function renderHistory(items: BookingItem[]): void {
    const list = document.getElementById("historyList")!;
    list.innerHTML = "";

    // กรองเฉพาะรายการที่เสร็จสิ้นหรือยกเลิก
    const completedItems = items.filter(b =>
        b.status_code === "COMPLETED" ||
        b.status_code === "CANCELLED"
    );

    if (completedItems.length === 0) {
        list.innerHTML = `
            <p style="text-align:center; color: gray; padding: 20px;">
                ยังไม่มีรายการที่เสร็จสิ้นหรือยกเลิก
            </p>
        `;
        return;
    }

    completedItems.forEach(b => {
        const div = document.createElement("div");
        div.className = "history-item";

        const hours = getHours(b.pickup_time, b.due_return_time);
        
        // กำหนด class และ text สำหรับสถานะการชำระเงิน (เหมือนเดิม)
        const paymentInfo = getPaymentStatusUI(b.payment_status_code);

        div.innerHTML = `
            <div class="history-left">
                <img 
                    src="${b.display_image}" 
                    alt="${b.display_name}"
                    class="history-img"
                >
                <div class="history-info">      
                    <div><strong>รหัสการจอง:</strong> ${b.booking_id}</div>
                    <div>
                        <strong>${b.item_type === 'Venue' ? 'สนาม' : 'อุปกรณ์'}:</strong> 
                        ${b.display_name} 
                        ${b.instance_code ? `(${b.instance_code})` : ""}
                    </div>
                    <div><strong>จำนวน:</strong> ${b.quantity} ${b.item_type === 'Venue' ? 'สนาม' : 'ชิ้น'} | <strong>เวลา:</strong> ${hours} ชม.</div>
                    <div><strong>ยอดชำระ:</strong> ${b.net_amount} บาท</div>
                    <div><strong>สถานะ:</strong> ${b.status_name}</div>
                    <div>
                        <strong>สถานะการชำระเงิน:</strong>
                        <span class="payment-status ${paymentInfo.class}">
                            ${paymentInfo.text}
                        </span>
                    </div>
                </div>
            </div>

            <div class="history-right">
                ${!(b.status_code === "COMPLETED" || b.status_code === "CANCELLED")
                ? `<p style="color: gray;">ยังไม่สามารถรีวิวได้</p>`
                : b.is_reviewed ?
                    `
                        <div class="review-display">
                            <div class="review-text">${b.review_text || ""}</div>
                            <p style="color: green; margin-top:5px;">✔ รีวิวแล้ว</p>
                        </div>
                    `
                    :
                    `
                    <div class="star-rating">
                        <span class="star" data-value="1">&#9733;</span>
                        <span class="star" data-value="2">&#9733;</span>
                        <span class="star" data-value="3">&#9733;</span>
                        <span class="star" data-value="4">&#9733;</span>
                        <span class="star" data-value="5">&#9733;</span>
                    </div>
                    <input type="hidden" class="rating-value" value="5">
                    <textarea placeholder="เขียนรีวิวของคุณ..." class="review-box"></textarea>
                    <button class="review-btn">ส่งรีวิว</button>
                `
            }
            </div>
        `;

        // จัดการ Event สำหรับการส่งรีวิว (เหมือนเดิมแต่ส่ง b เข้าไปใน submitReview)
        if ((b.status_code === "COMPLETED" || b.status_code === "CANCELLED") && !b.is_reviewed) {
            setupReviewEvents(div, b);
        }

        list.appendChild(div);
    });
}

// ฟังก์ชันช่วยจัดการสถานะการชำระเงิน
function getPaymentStatusUI(code: string) {
    const statusMap: { [key: string]: { text: string, class: string } } = {
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
function setupReviewEvents(div: HTMLElement, item: BookingItem) {
    const btn = div.querySelector(".review-btn") as HTMLButtonElement;
    const textarea = div.querySelector(".review-box") as HTMLTextAreaElement;
    const ratingInput = div.querySelector(".rating-value") as HTMLInputElement;
    const stars = div.querySelectorAll(".star");

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const value = (star as HTMLElement).dataset.value!;
            ratingInput.value = value;
            updateStars(stars, parseInt(value));
        });
    });

    btn.onclick = () => {
        submitReview(item, textarea, ratingInput);
    };
}

function updateStars(stars: NodeListOf<Element>, value: number) {
    stars.forEach(s => {
        const starVal = parseInt((s as HTMLElement).dataset.value!);
        s.classList.toggle("selected", starVal <= value);
    });
}

function getHours(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.ceil((e - s) / (1000 * 60 * 60));
}

function submitReview(item: BookingItem, textarea: HTMLTextAreaElement, ratingInput: HTMLInputElement) {
    const reviewText = textarea.value.trim();
    const ratingValue = Number(ratingInput.value);

    if (!reviewText) { alert("กรุณาเขียนรีวิวก่อนส่ง"); return; }
    if (!ratingValue || ratingValue <= 0) { alert("กรุณาให้คะแนนก่อนส่ง"); return; }

    const payload = {
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
    .then(async r => {
        const text = await r.text();
        try { return JSON.parse(text); } 
        catch (e) { throw new Error("เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ: " + text.substring(0, 100)); }
    })
    .then(res => {
        if (res.success) {
            alert("ขอบคุณสำหรับรีวิว!");
            loadHistory();
        } else {
            alert(res.message || "เกิดข้อผิดพลาด");
        }
    })
    .catch(err => {
        console.error("Fetch Error:", err);
        alert(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    });
}