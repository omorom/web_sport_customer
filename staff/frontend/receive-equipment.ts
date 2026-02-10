console.log("🔥 RECEIVE EQUIPMENT READY 🔥");

/* ===============================
PARAMS
================================ */

const params = new URLSearchParams(window.location.search);
const bookingId = params.get("code");

if (!bookingId) {
    alert("ไม่พบ booking id");
    throw new Error("missing booking id");
}

/* ===============================
DOM
================================ */

const bookingCodeEl =
    document.getElementById("bookingCode") as HTMLElement;

const itemsBox =
    document.getElementById("receiveItems") as HTMLElement;

const confirmBtn =
    document.getElementById("confirmReceiveBtn") as HTMLButtonElement;

const backBtn =
    document.getElementById("backBtn") as HTMLButtonElement;

/* ===============================
STATE
================================ */

let receiveRows: any[] = [];

/* ===============================
INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {

    bookingCodeEl.textContent = bookingId;

    backBtn?.addEventListener("click", () => {
        window.location.href = "bookings.html";
    });

    loadBookingItems();
    bindConfirm();
});

/* ===============================
LOAD BOOKING ITEMS
================================ */

function loadBookingItems() {

    fetch(
        `/sports_rental_system/staff/api/get_receive_booking_items.php?booking_id=${bookingId}`,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                alert(res.message || "โหลดรายการไม่ได้");
                return;
            }

            prepareRows(res.items || []);
            renderItems();
        })
        .catch(err => {
            console.error(err);
            alert("server error");
        });
}

/* ===============================
EXPAND QUANTITY
================================ */

function prepareRows(items: any[]) {

    receiveRows = [];

    items.forEach(item => {

        const qty = Number(item.quantity || 1);

        for (let i = 0; i < qty; i++) {

            receiveRows.push({
                detail_id: item.detail_id,
                equipment_id: item.equipment_id,
                venue_id: item.venue_id,
                equipment_name: item.equipment_name,
                venue_name: item.venue_name,
                image: item.image || item.venue_image,
                instance_code: ""
            });
        }
    });

    console.log("RECEIVE ROWS =", receiveRows);
}

/* ===============================
RENDER
================================ */

function renderItems() {

    itemsBox.innerHTML = "";

    if (!receiveRows.length) {
        itemsBox.innerHTML = `<p class="empty">ไม่มีรายการ</p>`;
        return;
    }

    receiveRows.forEach((item, index) => {

        const row = document.createElement("div");
        row.className = "receive-item";

        const img = item.image || "images/no-image.png";

        row.innerHTML = `
            <div class="item-left">
                <img src="${img}">
            </div>

            <div class="item-info">
                <h4>${item.equipment_name || item.venue_name}</h4>
                <small>เลือกหมายเลขอุปกรณ์</small>
            </div>

            <div class="item-select">
                <select data-index="${index}">
                    <option value="">-- เลือก --</option>
                </select>
            </div>
        `;

        const select =
            row.querySelector("select") as HTMLSelectElement;

        /* ===== EQUIPMENT ===== */
        if (item.equipment_id) {

            loadEquipmentInstances(
                item.equipment_id,
                select,
                item.instance_code
            );

        }

        /* ===== VENUE ===== */
        else if (item.venue_id) {

            loadVenueInstances(
                item.venue_id,
                select,
                item.instance_code,
                index
            );
        }

        select.addEventListener("change", () => {
            receiveRows[index].instance_code = select.value;
        });

        itemsBox.appendChild(row);
    });
}

/* ===============================
LOAD EQUIPMENT INSTANCES
================================ */

function loadEquipmentInstances(
    equipmentId: string,
    selectEl: HTMLSelectElement,
    selected?: string
) {

    fetch(
        `/sports_rental_system/staff/api/get_equipment_instances.php?equipment_id=${equipmentId}`,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) return;

            selectEl.innerHTML =
                `<option value="">-- เลือก --</option>`;

            res.instances.forEach((i: any) => {

                const opt = document.createElement("option");

                opt.value = i.instance_code;
                opt.textContent = i.instance_code;

                if (selected === i.instance_code) {
                    opt.selected = true;
                }

                selectEl.appendChild(opt);
            });
        });
}

/* ===============================
LOAD VENUE INSTANCES
================================ */

function loadVenueInstances(
    venueId: string,
    selectEl: HTMLSelectElement,
    selected: string,
    rowIndex: number
) {

    fetch(
        `/sports_rental_system/staff/api/get_venue_instances.php?venue_id=${venueId}`,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) return;

            selectEl.innerHTML =
                `<option value="">-- เลือก --</option>`;

            /* ===== auto ถ้ามี 1 instance ===== */
            if (res.venues.length === 1) {

                const v = res.venues[0];

                const opt = document.createElement("option");

                opt.value = v.venue_instance_id;
                opt.textContent = v.venue_code;
                opt.selected = true;

                selectEl.appendChild(opt);
                selectEl.disabled = true;

                // 🔥 set ค่าเข้า state
                receiveRows[rowIndex].instance_code =
                    v.venue_instance_id;

                return;
            }

            /* ===== หลาย instance ===== */

            res.venues.forEach((v: any) => {

                const opt = document.createElement("option");

                opt.value = v.venue_instance_id;
                opt.textContent = v.venue_code;

                if (selected === v.venue_instance_id) {
                    opt.selected = true;
                }

                selectEl.appendChild(opt);
            });
        });
}

/* ===============================
CONFIRM
================================ */

function bindConfirm() {

    confirmBtn.addEventListener("click", () => {

        let missing = false;

        receiveRows.forEach(r => {
            if (!r.instance_code) missing = true;
        });

        if (missing) {
            alert("กรุณาเลือกหมายเลขอุปกรณ์ให้ครบทุกชิ้น");
            return;
        }

        if (!confirm("ยืนยันการรับอุปกรณ์ และเริ่มการใช้งาน?")) {
            return;
        }

        submitReceive();
    });
}

/* ===============================
SUBMIT
================================ */

function submitReceive() {

    fetch(
        "/sports_rental_system/staff/api/receive_equipment.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                booking_id: bookingId,
                items: receiveRows
            })
        }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                alert(res.message || "บันทึกไม่ได้");
                return;
            }

            alert("✅ รับอุปกรณ์เรียบร้อย");

            window.location.href = "bookings.html";
        });
}
