interface BookingItem {
    booking_id: string;
    detail_id: number;
    instance_code: string;
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

fetch("/sports_rental_system/customer/api/get_profile.php")
    .then(res => res.json())
    .then(data => {

        const pointEl =
            document.getElementById("topPoints");

        if (pointEl && data.points !== undefined) {
            pointEl.textContent =
                `⭐ ${data.points} คะแนน`;
        }

    });

function renderHistory(items: BookingItem[]): void {

    const list = document.getElementById("historyList")!;
    list.innerHTML = "";

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
        let paymentText = "";
        let paymentClass = "";

        switch (b.payment_status_code) {

            case "UNPAID":
                paymentText = "ยังไม่ได้ชำระเงิน";
                paymentClass = "payment-unpaid";
                break;

            case "WAITING_VERIFY":
                paymentText = "รอตรวจสอบสลิป";
                paymentClass = "payment-waiting";
                break;

            case "PAID":
                paymentText = "ชำระเงินสำเร็จ";
                paymentClass = "payment-success";
                break;

            case "REJECTED":
                paymentText = "สลิปไม่ผ่าน";
                paymentClass = "payment-rejected";
                break;

            case "REFUNDED":
                paymentText = "คืนเงินแล้ว";
                paymentClass = "payment-refund";
                break;

            case "CANCELLED":
                paymentText = "ยกเลิก";
                paymentClass = "payment-cancel";
                break;

            case "EXPIRED":
                paymentText = "หมดเวลาชำระเงิน";
                paymentClass = "payment-expired";
                break;

            default:
                paymentText = "ไม่ทราบสถานะ";
                paymentClass = "payment-default";
        }

        div.innerHTML = `
            <div class="history-left">
                <img 
                    src="${b.equipment_image}" 
                    alt="${b.equipment_name}"
                    class="history-img"
                >
                <div class="history-info">      
                    <div><strong>รหัสการจอง:</strong> ${b.booking_id}</div>
                    <div><strong>อุปกรณ์:</strong> ${b.equipment_name}
                    ${b.instance_code ? `(${b.instance_code})` : ""}</div>
                    <div><strong>จำนวน:</strong> ${b.quantity} ชิ้น | <strong>เวลา:</strong> ${hours} ชม.</div>
                    <div><strong>ยอดชำระ:</strong> ${b.net_amount} บาท</div>
                    <div><strong>สถานะ:</strong> ${b.status_name}</div>
                    <div>
                        <strong>สถานะการชำระเงิน:</strong>
                        <span class="payment-status ${paymentClass}">
                            ${paymentText}
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
                            <div class="review-text">
                                ${b.review_text || ""}
                            </div>
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

        if (
            (b.status_code === "COMPLETED" || b.status_code === "CANCELLED")
            && !b.is_reviewed
        ) {
            const btn = div.querySelector(".review-btn") as HTMLButtonElement;
            const textarea = div.querySelector(".review-box") as HTMLTextAreaElement;
            const ratingInput = div.querySelector(".rating-value") as HTMLInputElement;
            const stars = div.querySelectorAll(".star");

            updateStars(5);

            stars.forEach(star => {

                star.addEventListener("mouseover", () => {
                    const value = (star as HTMLElement).dataset.value!;
                    highlightStars(value);
                });

                star.addEventListener("mouseout", () => {
                    highlightStars(ratingInput.value);
                });

                star.addEventListener("click", () => {
                    const value = (star as HTMLElement).dataset.value!;
                    ratingInput.value = value;
                    updateStars(parseInt(value));
                });

            });

            function highlightStars(value: string | number) {
                stars.forEach(s => {
                    s.classList.toggle(
                        "hover",
                        parseInt((s as HTMLElement).dataset.value!) <= Number(value)
                    );
                });
            }

            function updateStars(value: number) {
                stars.forEach(s => {
                    s.classList.toggle(
                        "selected",
                        parseInt((s as HTMLElement).dataset.value!) <= value
                    );
                });
            }

            btn.onclick = () => {
                submitReview(b, textarea, ratingInput);
            };
        }

        list.appendChild(div);
    });
}

function getHours(start: string, end: string): number {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.ceil((e - s) / (1000 * 60 * 60));
}


function submitReview(item: BookingItem, textarea: HTMLTextAreaElement, ratingInput: HTMLInputElement) {
    const reviewText = textarea.value.trim();
    const rating = ratingInput.value;
    const ratingValue = Number(ratingInput.value);

    if (!reviewText) {
        alert("กรุณาเขียนรีวิวก่อนส่ง");
        return;
    }

    if (!ratingValue || ratingValue <= 0) {
        alert("กรุณาให้คะแนนก่อนส่ง");
        return;
    }

    const payload = {
        booking_id: item.booking_id,
        detail_id: Number(item.detail_id),
        instance_code: item.instance_code,
        review_text: reviewText,
        rating: ratingValue
    };

    console.log("Payload:", payload);
    fetch("/sports_rental_system/customer/api/add_review.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    })
        .then(async r => {
            const text = await r.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("PHP Error Detected:", text);
                throw new Error("เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ: " + text.substring(0, 100));
            }
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