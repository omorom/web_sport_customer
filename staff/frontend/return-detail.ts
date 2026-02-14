console.log("🔥 RETURN DETAIL READY 🔥");

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

/* ================= ELEMENTS ================= */

const loading = document.getElementById("loading") as HTMLElement;
const detailBox = document.getElementById("detailBox") as HTMLElement;
const bookingCodeEl = document.getElementById("bookingCode") as HTMLElement;
const itemList = document.getElementById("itemList") as HTMLElement;
const penaltySummary = document.getElementById("penaltySummary") as HTMLElement;
const lateInfo = document.getElementById("lateInfo") as HTMLElement;
const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;

let items: any[] = [];
let conditions: any[] = [];
let lateFee = 0;

if (!code) {
    alert("ไม่พบรหัสการจอง");
    window.location.href = "return.html";
}

/* ================= INIT ================= */

bookingCodeEl.textContent = code!;
loadDetails();

/* ================= LOAD DETAILS ================= */

function loadDetails() {

    fetch(`/sports_rental_system/staff/api/get_returns_details.php?booking_id=${code}`, {
        credentials: "include"
    })
        .then(r => r.json())
        .then(res => {

            loading.style.display = "none";

            if (!res.success) {
                alert(res.message || "โหลดข้อมูลไม่สำเร็จ");
                return;
            }

            items = res.items || [];
            conditions = res.conditions || [];
            lateFee = parseFloat(res.late_fee) || 0;

            renderItems();
            calculatePenalty();

            detailBox.classList.remove("hidden");
        })
        .catch(err => {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        });
}

/* ================= RENDER ITEMS ================= */

function renderItems() {

    itemList.innerHTML = "";

    items.forEach((item, index) => {

        let options = "";

        conditions.forEach(c => {
            options += `
                <option value="${c.condition_id}" 
                        data-percent="${c.fine_percent}">
                    ${c.name_th} (${c.fine_percent}%)
                </option>
            `;
        });

        const row = document.createElement("div");
        row.className = "return-row";

        row.innerHTML = `
            <div class="item-left">
                <img src="${item.image || ''}" 
                     class="item-img"
                     onerror="this.src='https://via.placeholder.com/120x120?text=No+Image'">
                <div class="item-info">
                    <strong>${item.name}</strong><br>
                    รหัส: ${item.instance_code || "-"}<br>
                    ราคา: ${item.price_at_booking} บาท
                </div>
            </div>

            <div class="right-zone">

                <div class="top-controls">
                    <select data-index="${index}">
                        ${options}
                    </select>

                    <i class="fa-solid fa-pen-to-square note-icon"
                    data-note-toggle="${index}"></i>
                </div>

                <textarea
                    class="note-input hidden"
                    data-note-index="${index}"
                    placeholder="เพิ่มหมายเหตุ..."
                ></textarea>
                <div class="damage-amount" id="damage-${index}"></div>
            </div>

                <div class="damage-amount" id="damage-${index}"></div>

            </div>
        `;

        itemList.appendChild(row);
    });

    /* bind change event */
    const selects = itemList.querySelectorAll("select");
    selects.forEach(sel => {
        sel.addEventListener("change", calculatePenalty);
    });

    /* bind note toggle */
    bindNoteToggle();
}

/* ================= NOTE TOGGLE ================= */

function bindNoteToggle() {

    const icons = itemList.querySelectorAll(".note-icon");

    icons.forEach(icon => {

        icon.addEventListener("click", function () {

            const index =
                (this as HTMLElement).dataset.noteToggle;

            const textarea =
                itemList.querySelector(
                    `[data-note-index="${index}"]`
                ) as HTMLTextAreaElement;

            if (!textarea) return;

            textarea.classList.toggle("hidden");

            if (!textarea.classList.contains("hidden")) {
                textarea.focus();
            }
        });
    });
}

/* ================= CALCULATE ================= */

function calculatePenalty(): number {

    let damageFee = 0;

    const selects = itemList.querySelectorAll("select");

    selects.forEach((sel: any, index) => {

        const percent =
            parseFloat(sel.options[sel.selectedIndex].dataset.percent) || 0;

        const price =
            parseFloat(items[index].price_at_booking) || 0;

        const itemDamage = (price * percent) / 100;

        damageFee += itemDamage;

        const damageEl = document.getElementById(`damage-${index}`);

        if (damageEl) {
            damageEl.innerHTML =
                itemDamage > 0
                    ? `เสียหาย ${itemDamage.toFixed(2)} บาท`
                    : "";
        }
    });

    const total = damageFee + lateFee;

    lateInfo.innerHTML =
        lateFee > 0
            ? `<p style="color:#dc2626;font-weight:600">
                ค่าคืนช้า: ${lateFee.toFixed(2)} บาท
               </p>`
            : "";

    penaltySummary.innerHTML = `
        <p>ค่าเสียหายรวม: ${damageFee.toFixed(2)} บาท</p>
        <hr>
        <strong>รวมทั้งหมด: ${total.toFixed(2)} บาท</strong>
    `;

    return total;
}

/* ================= CONFIRM ================= */

confirmBtn.addEventListener("click", () => {

    const totalPenalty = calculatePenalty();

    const selects = itemList.querySelectorAll("select");
    const notes = itemList.querySelectorAll(".note-input");

    const returnData: any[] = [];

    selects.forEach((sel: any, index) => {

        const noteValue =
            (notes[index] as HTMLTextAreaElement)?.value || null;

        returnData.push({
            detail_id: items[index].detail_id,
            condition_id: parseInt(sel.value),
            note: noteValue
        });
    });

    confirmBtn.disabled = true;
    confirmBtn.textContent = "กำลังบันทึก...";

    fetch("/sports_rental_system/staff/api/confirm_return.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            booking_code: code,
            items: returnData
        })
    })
        .then(r => r.json())
        .then(res => {

            confirmBtn.disabled = false;
            confirmBtn.textContent = "บันทึกการคืน";

            if (!res.success) {
                alert(res.message || "เกิดข้อผิดพลาด");
                return;
            }

            if (res.auto_completed) {
                alert("คืนสำเร็จ ไม่มีค่าปรับ");
                window.location.href = "return.html";
                return;
            }

            if (res.total_penalty > 0) {
                window.location.href =
                    `return-payment.html?code=${code}&penalty=${res.total_penalty}`;
            }
        })
        .catch(err => {

            console.error(err);

            confirmBtn.disabled = false;
            confirmBtn.textContent = "บันทึกการคืน";

            alert("เกิดข้อผิดพลาด");
        });
});
