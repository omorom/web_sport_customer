interface RefundItem {
    booking_id: string;
    cancelled_at: string;
    refund_amount: number;
    refund_at: string | null;
    slip_path: string | null;
}

document.addEventListener("DOMContentLoaded", function () {

    loadRefundHistory();

    const closeBtn = document.getElementById("closeModal")!;
    closeBtn.addEventListener("click", closeModal);

    const modal = document.getElementById("slipModal")!;
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});

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

function loadRefundHistory() {

    fetch("/sports_rental_system/customer/api/get_customer_refund_history.php", {
        credentials: "include"
    })
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                renderEmpty("ไม่พบข้อมูล");
                return;
            }

            renderTable(res.data);
        })
        .catch(() => {
            renderEmpty("โหลดข้อมูลไม่สำเร็จ");
        });
}

function renderTable(list: RefundItem[]) {

    const tbody = document.getElementById("refundTable") as HTMLElement;

    if (!list || list.length === 0) {
        renderEmpty("ไม่มีประวัติการยกเลิก");
        return;
    }

    let html = "";

    list.forEach(item => {

        let statusBadge = item.refund_at
            ? `<span class="badge-refunded">คืนเงินแล้ว</span>`
            : `<span class="badge-waiting">รอดำเนินการ</span>`;

        let slipBtn = "-";

        if (item.slip_path) {
            slipBtn = `
                <button class="view-slip-btn"
                    data-slip="${item.slip_path}">
                    ดูสลิป
                </button>
            `;
        }

        html += `
            <tr>
                <td>${item.booking_id}</td>
                <td>${item.cancelled_at}</td>
                <td>${item.refund_amount} บาท</td>
                <td>${item.refund_at ? item.refund_at : "-"}</td>
                <td>${statusBadge}</td>
                <td>${slipBtn}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    bindSlipButtons();
}

function bindSlipButtons() {

    document.querySelectorAll(".view-slip-btn")
        .forEach(btn => {

            btn.addEventListener("click", function () {

                const path = (btn as HTMLElement).dataset.slip;
                if (!path) return;

                openModal(path);
            });
        });
}

function openModal(imagePath: string) {

    const modal = document.getElementById("slipModal")!;
    const img = document.getElementById("modalImage") as HTMLImageElement;

    img.src = imagePath;
    modal.classList.remove("hidden");
}

function closeModal() {

    const modal = document.getElementById("slipModal")!;
    modal.classList.add("hidden");
}

function renderEmpty(text: string) {

    const tbody = document.getElementById("refundTable") as HTMLElement;

    tbody.innerHTML = `
        <tr>
            <td colspan="6">${text}</td>
        </tr>
    `;
}
