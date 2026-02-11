document.addEventListener("DOMContentLoaded", () => {
    console.log("cart.ts loaded");

    renderCart();
    renderBookingSummary();
    setupMemberModal();
});

/* ===============================
   MAIN RENDER
================================ */

function renderCart() {



    const cart = getCart();

    const emptyBox = document.getElementById("emptyCart");
    const itemsBox = document.getElementById("cartItems");
    const actionsBox = document.getElementById("cartActions");

    if (!emptyBox || !itemsBox || !actionsBox) return;

    if (!cart.length) {
        emptyBox.classList.remove("hidden");
        itemsBox.classList.add("hidden");
        actionsBox.classList.add("hidden");
        updateCartCount(0);
        return;
    }

    emptyBox.classList.add("hidden");
    itemsBox.classList.remove("hidden");
    actionsBox.classList.remove("hidden");

    itemsBox.innerHTML = "<h3>รายการที่เลือก</h3>";

    for (let i = 0; i < cart.length; i++) {
        const row = buildCartRow(cart[i], i);
        itemsBox.appendChild(row);
    }

    updateCartCount(cart.length);
}

/* ===============================
   SUMMARY BAR
================================ */

function renderBookingSummary() {

    const date = localStorage.getItem("rentDate") || "-";
    const time = localStorage.getItem("timeSlot");
    const hoursStr = localStorage.getItem("rentHours");
    const hours = Number(hoursStr || 0);

    const dateEl = document.getElementById("cartDate");
    const timeEl = document.getElementById("cartTime");
    const hourEl = document.getElementById("cartHours");

    if (dateEl) dateEl.textContent = date;

    if (timeEl) {

        if (time && hours) {

            const start = parseInt(time);
            const end = start + hours;

            timeEl.textContent =
                pad(start) + ":00 - " + pad(end) + ":00";

        } else if (time) {

            timeEl.textContent = time + ":00";

        } else {
            timeEl.textContent = "-";
        }
    }

    if (hourEl) {
        hourEl.textContent =
            hours ? hours + " ชั่วโมง" : "-";
    }
}

function pad(n: number) {
    return n < 10 ? "0" + n : n.toString();
}

/* ===============================
   BUILD ROW
================================ */

function buildCartRow(item: any, index: number) {
    console.log("ITEM:", item);

    const row = document.createElement("div");
    row.className = "cart-item";

    const img = item.image || "images/no-image.png";

    row.innerHTML = `
        <img src="${img}">

        <div class="cart-item-info">
            <h4>${item.name}</h4>
            <small>เลือกหมายเลขอุปกรณ์</small>
        </div>

        <div class="cart-item-qty">
            <select class="instance-select">
                <option value="">-- เลือก --</option>
            </select>
        </div>

        <button class="cart-item-remove">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    const select =
        row.querySelector(".instance-select") as HTMLSelectElement;

    const removeBtn =
        row.querySelector(".cart-item-remove") as HTMLButtonElement;

    if (item.type === "field") {

        // ใช้ venue_id เป็น instance เลย
        updateInstanceCode(index, item.id);

        select.innerHTML = "";

        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.id;

        select.appendChild(opt);
        select.value = item.id;

        // ไม่ต้องให้เปลี่ยน
        select.disabled = true;

    }

    // ===== EQUIPMENT =====
    else {

        loadInstancesForRow(
            item.id,
            select,
            item.instance_code
        );
    }

    select.addEventListener("change", () => {
        updateInstanceCode(index, select.value);
        renderCart(); // refresh เพื่อกันซ้ำ
    });

    removeBtn.addEventListener("click", () => {
        removeItemByIndex(index);
        renderCart();
    });

    return row;
}

/* ===============================
   LOAD INSTANCES
================================ */

function loadInstancesForRow(
    equipmentId: string,
    selectEl: HTMLSelectElement,
    selected?: string
) {

    fetch(
        "/sports_rental_system/staff/api/get_equipment_instances.php?equipment_id=" +
        equipmentId
    )
        .then(res => res.json())
        .then(data => {

            if (!data.success) return;

            selectEl.innerHTML =
                `<option value="">-- เลือก --</option>`;

            const cart = getCart();

            const usedCodes: string[] = [];

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].instance_code) {
                    usedCodes.push(cart[i].instance_code);
                }
            }

            for (let i = 0; i < data.instances.length; i++) {

                const inst = data.instances[i];

                let used = false;

                for (let j = 0; j < usedCodes.length; j++) {
                    if (
                        usedCodes[j] === inst.instance_code &&
                        inst.instance_code !== selected
                    ) {
                        used = true;
                        break;
                    }
                }

                if (used) continue;

                const opt = document.createElement("option");

                opt.value = inst.instance_code;
                opt.textContent =
                    inst.instance_code;

                if (selected === inst.instance_code) {
                    opt.selected = true;
                }

                selectEl.appendChild(opt);
            }
        });
}

/* ===============================
   MEMBER MODAL
================================ */

function setupMemberModal() {

    const confirmBtn =
        document.getElementById("confirmBtn") as HTMLButtonElement;

    const modal =
        document.getElementById("memberModal") as HTMLElement;

    const closeBtn =
        document.getElementById("closeMemberModal") as HTMLButtonElement;

    const searchBtn =
        document.getElementById("searchMemberBtn") as HTMLButtonElement;

    const confirmMemberBtn =
        document.getElementById("confirmMemberBtn") as HTMLButtonElement;

    const input =
        document.getElementById("memberInput") as HTMLInputElement;

    let foundCustomer: any = null;

    confirmBtn.addEventListener("click", () => {

        const cart = getCart();

        if (!cart.length) {
            alert("ไม่มีรายการในตะกร้า");
            return;
        }

        let missing = false;

        for (let i = 0; i < cart.length; i++) {
            if (!cart[i].instance_code) {
                missing = true;
                break;
            }
        }

        if (missing) {
            alert("กรุณาเลือกหมายเลขอุปกรณ์ให้ครบทุกชิ้น");
            return;
        }

        modal.classList.remove("hidden");
        input.value = "";
        foundCustomer = null;
        confirmMemberBtn.disabled = true;
    });

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    searchBtn.addEventListener("click", () => {

        const q = input.value.trim();

        if (!q) {
            alert("กรอกชื่อหรือรหัสสมาชิก");
            return;
        }

        fetch("/sports_rental_system/staff/api/search_customer.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q: q })
        })
            .then(res => res.json())
            .then(data => {

                if (!data.success) {
                    alert("ไม่พบสมาชิก");
                    return;
                }

                foundCustomer = data.customer;

                confirmMemberBtn.disabled = false;

                fillMemberResult(foundCustomer);
            });
    });

    confirmMemberBtn.addEventListener("click", () => {

        if (!foundCustomer) return;

        localStorage.setItem(
            "customer_id",
            foundCustomer.customer_id
        );



        modal.classList.add("hidden");

        const total = calcCartTotal(getCart());

        localStorage.setItem(
            "cartTotal",
            total.toString()
        );

        window.location.href = "confirm.html";
    });
}

/* ===============================
   MEMBER RESULT
================================ */

function fillMemberResult(data: any) {

    const resultBox =
        document.getElementById("memberResult")!;
    resultBox.classList.remove("hidden");

    // name
    document.getElementById("mName")!.textContent =
        data.name;

    // type mapping
    let typeText = "";

    if (data.customer_type === "student") {
        typeText = "นิสิตนักศึกษา";
    } else {
        typeText = "บุคคลทั่วไป";
    }

    document.getElementById("mType")!.textContent =
        typeText;

    // hide member level ❌
    const levelRow =
        document.getElementById("memberLevelRow");
    if (levelRow) levelRow.remove();

    // points
    document.getElementById("mPoints")!.textContent =
        data.current_points;

    // phone
    document.getElementById("mPhone")!.textContent =
        data.phone;

    // faculty + year (only student)
    const facultyRow =
        document.getElementById("facultyRow")!;

    const yearRow =
        document.getElementById("yearRow")!;

    if (data.customer_type === "student") {

        facultyRow.classList.remove("hidden");
        yearRow.classList.remove("hidden");

        document.getElementById("mFaculty")!.textContent =
            data.faculty_name || "-";

        document.getElementById("mYear")!.textContent =
            data.study_year || "-";

    } else {
        facultyRow.classList.add("hidden");
        yearRow.classList.add("hidden");
    }
}

function loadVenueInstances(
    venueId: string,
    selectEl: HTMLSelectElement,
    selected?: string
) {

    fetch(
        "/sports_rental_system/staff/api/get_venue_instances.php?venue_id=" +
        venueId
    )
        .then(res => res.json())
        .then(data => {

            if (!data.success) return;

            selectEl.innerHTML =
                `<option value="">-- เลือก --</option>`;

            for (let i = 0; i < data.venues.length; i++) {

                const v = data.venues[i];

                const opt = document.createElement("option");
                opt.value = v.venue_code;
                opt.textContent = v.venue_code;

                if (selected === v.venue_code) {
                    opt.selected = true;
                }

                selectEl.appendChild(opt);
            }
        });
}

/* ===============================
   HELPERS
================================ */

function getCart(): any[] {

    try {

        const raw = localStorage.getItem("cart");
        if (!raw) return [];

        const parsed = JSON.parse(raw);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch {
        return [];
    }
}

function saveCart(cart: any[]) {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}

function removeItemByIndex(index: number) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
}

function updateInstanceCode(
    index: number,
    code: string
) {

    const cart = getCart();

    cart[index].instance_code = code;

    saveCart(cart);
}

function updateCartCount(count: number) {

    const badge =
        document.getElementById("cartCount");

    if (badge) {
        badge.textContent = count.toString();
    }
}

function calcCartTotal(cart: any[]) {

    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        total += Number(cart[i].price) || 0;
    }

    return total;
}
