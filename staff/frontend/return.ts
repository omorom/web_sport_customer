console.log("🔥 STAFF RETURN LIST READY 🔥");

const listBox = document.getElementById("returnList") as HTMLElement;
const tabs = document.querySelectorAll(".status-tab");

let currentStatus = "IN_USE";

/* ================= INIT ================= */

tabs.forEach(tab => {
    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        currentStatus =
            tab.getAttribute("data-status") || "IN_USE";

        loadReturns();
    });
});

loadReturns();
updateTabCountFromAPI();


/* ================= LOAD BOOKINGS ================= */

function loadReturns() {

    listBox.innerHTML =
        `<p class="loading">กำลังโหลด...</p>`;

    fetch(
        `/sports_rental_system/staff/api/get_returns.php?status=${currentStatus}`,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                listBox.innerHTML =
                    `<p class="empty">โหลดไม่สำเร็จ</p>`;
                return;
            }

            renderList(res.data || []);
            updateTabCountFromAPI();
        });
}


/* ================= UPDATE TAB COUNT ================= */

function updateTabCountFromAPI() {

    fetch(
        "/sports_rental_system/staff/api/get_returns.php?status=ALL",
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) return;

            let inUse = 0;
            let overdue = 0;

            const now = new Date();

            (res.data || []).forEach(function (r: any) {

                const dueDate = new Date(r.due_return_time);

                if (now.getTime() > dueDate.getTime()) {
                    overdue++;
                } else {
                    inUse++;
                }
            });

            const inUseTab =
                document.querySelector('[data-status="IN_USE"]');

            const overdueTab =
                document.querySelector('[data-status="OVERDUE"]');

            if (inUseTab)
                inUseTab.textContent =
                    "กำลังใช้งาน (" + inUse + ")";

            if (overdueTab)
                overdueTab.textContent =
                    "เกินกำหนด (" + overdue + ")";
        });
}


/* ================= RENDER LIST ================= */

function renderList(rows: any[]) {

    if (!rows.length) {
        listBox.innerHTML =
            `<p class="empty">ไม่มีรายการ</p>`;
        return;
    }

    listBox.innerHTML = "";

    const now = new Date();

    rows.forEach(r => {

        const dueDate = new Date(r.due_return_time);
        const isOverdue = now.getTime() > dueDate.getTime();

        const statusClass = isOverdue
            ? "status overdue"
            : "status active";

        const statusText = isOverdue
            ? "เกินกำหนด"
            : "กำลังใช้งาน";

        const card = document.createElement("div");
        card.className = "booking-card";

        card.innerHTML = `
            <div class="booking-info">
                <span class="${statusClass}">
                    ${statusText}
                </span>

                <h4>รหัสการจอง: ${r.booking_id}</h4>
                <p>ลูกค้า: ${r.customer_name}</p>
                <p>ครบกำหนด: ${r.due_return_time}</p>

            </div>

            <div class="booking-actions">
                <button class="btn-return"
                        data-code="${r.booking_id}">
                    รับคืน
                </button>
            </div>
        `;

        card.querySelector(".btn-return")
            ?.addEventListener("click", () => {

                const confirmReturn = confirm(
                    `ยืนยันการรับคืนรหัส ${r.booking_id} ?`
                );

                if (!confirmReturn) return;

                window.location.href =
                    `return-detail.html?code=${r.booking_id}`;
            });

        listBox.appendChild(card);
    });
}
