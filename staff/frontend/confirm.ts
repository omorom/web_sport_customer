console.log("🔥 STAFF CONFIRM TS READY 🔥");

/* ===============================
GLOBAL
================================ */

let USER_POINTS = 0;
let usedPoints = 0;

let couponDiscount = 0;
let couponCode: string | null = null;

let equipmentTotal = 0;
let fieldTotal = 0;
let extraHourFee = 0;

let selectedBranchId: string | null = null;

const BASE_HOURS = 3;

/* ===============================
INIT
================================ */

document.addEventListener("DOMContentLoaded", () => {

	loadBranch();
	loadBookingInfo();
	loadCustomerInfo();

	renderItems();
	calcTotals();

	bindPointControls();
	bindCoupon();
	bindSubmit();
});

/* ===============================
LOAD BRANCH
================================ */

function loadBranch() {

	fetch("/sports_rental_system/staff/api/get_selected_branch.php")
		.then(res => res.json())
		.then(res => {

			if (!res || res.success === false) {
				window.location.href = "branches.html";
				return;
			}

			const data = res.data || res;

			selectedBranchId = data.branch_id;
			localStorage.setItem("branchId", data.branch_id);
		});
}

/* ===============================
LOAD CUSTOMER
================================ */

function loadCustomerInfo(): void {

    const id = localStorage.getItem("customer_id");

    if (!id) return;

    fetch(
        "/sports_rental_system/staff/api/get_customer.php?id=" + id,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(res => {

            if (!res.success) return;

            const c = res.customer;

            setText("cId", c.customer_id);
            setText("cName", c.name);
            setText("cPhone", c.phone || "-");
            setText("cFaculty", c.faculty_name || "-");
            setText("cYear", c.study_year || "-");

            USER_POINTS = Number(c.current_points || 0);

            setText("userPoints", USER_POINTS.toString());

            console.log("STAFF POINTS =", USER_POINTS);
        });
}

/* ===============================
BOOKING INFO
================================ */

function loadBookingInfo() {

	const date = localStorage.getItem("rentDate");
	const time = localStorage.getItem("timeSlot");
	const hours = Number(localStorage.getItem("rentHours") || 1);

	setText("confirmDate", date || "-");

	if (time && hours) {

		const s = Number(time);
		const e = s + hours;

		setText(
			"confirmTime",
			pad(s) + ":00 - " + pad(e) + ":00"
		);
	}

	setText("confirmHours", hours.toString());
}

/* ===============================
ITEMS
================================ */

function renderItems() {

	const box = document.getElementById("confirmItems");
	if (!box) return;

	const cart = getCart();
	const hours = Number(localStorage.getItem("rentHours") || 1);

	box.innerHTML = "";

	cart.forEach(item => {

		const price = Number(item.price || 0);
		const qty = Number(item.qty || 1);

		const perHourTotal = price * qty;
		const total = perHourTotal * hours;

		const row = document.createElement("div");
		row.className = "confirm-item";

		const imgHtml =
			item.image && item.image !== "null"
				? `<img src="${item.image.trim()}" alt="">`
				: "";

		row.innerHTML =
			imgHtml +

			`<div class="confirm-item-info">
				<h4>${item.name}</h4>
				<small>
					${isField(item.type)
						? "รหัสสนาม: " + (item.venue_code || item.instance_code || "-")
						: "รหัสอุปกรณ์: " + (item.instance_code || "-")}
				</small>
			</div>

			<div class="confirm-item-qty">x<strong>${qty}</strong></div>

			<div class="confirm-item-price">
				<div class="per-hour">${perHourTotal} บาท / ชม.</div>
				<strong>${perHourTotal} × ${hours} = ${total} บาท</strong>
			</div>`;

		box.appendChild(row);
	});
}

/* ===============================
TOTAL CALC
================================ */

function calcTotals() {

	equipmentTotal = 0;
	fieldTotal = 0;

	const cart = getCart();
	const hours = Number(localStorage.getItem("rentHours") || 1);

	cart.forEach(i => {

		const price = Number(i.price || 0);
		const qty = Number(i.qty || 1);

		const subtotal = price * qty * hours;

		if (isField(i.type)) {
			fieldTotal += subtotal;
		} else {
			equipmentTotal += subtotal;
		}
	});

	extraHourFee = calcExtraHourFee(hours);

	updateTotals();
}

function calcExtraHourFee(hours: number) {

	if (hours <= 3) return 0;
	if (hours === 4) return 100;
	if (hours === 5) return 200;
	if (hours >= 6) return 300;

	return 0;
}

/* ===============================
UPDATE TOTAL UI
================================ */

function updateTotals() {

	const gross =
		equipmentTotal +
		fieldTotal +
		extraHourFee;

	const net =
		Math.max(
			gross -
			usedPoints -
			couponDiscount,
			0
		);

	setText("equipmentTotal", equipmentTotal + " บาท");
	setText("fieldTotal", fieldTotal + " บาท");
	setText("extraHourFee", extraHourFee + " บาท");

	setText("pointDiscount", usedPoints.toString());
	setText("couponDiscount", couponDiscount.toString());

	setText("netTotal", net + " บาท");

	setText(
		"earnPoints",
		Math.floor(net / 100).toString()
	);
}

/* ===============================
POINT CONTROLS ✅ FIXED
================================ */

function bindPointControls() {

	const input =
		document.getElementById("usePointInput") as HTMLInputElement;

	const plusBtn =
		document.getElementById("plusPoint");

	const minusBtn =
		document.getElementById("minusPoint");

	const maxBtn =
		document.getElementById("useMaxPoint");

	if (!input) return;

	function applyPoint(v: number) {

		const gross =
			equipmentTotal +
			fieldTotal +
			extraHourFee;

		if (v > USER_POINTS) v = USER_POINTS;
		if (v > gross) v = gross;
		if (v < 0) v = 0;

		usedPoints = v;
		input.value = v.toString();

		updateTotals();
	}

	input.addEventListener("change", () => {
		applyPoint(Number(input.value || 0));
	});

	plusBtn?.addEventListener("click", () => {
		applyPoint(usedPoints + 1);
	});

	minusBtn?.addEventListener("click", () => {
		applyPoint(usedPoints - 1);
	});

	maxBtn?.addEventListener("click", () => {
		applyPoint(USER_POINTS);
	});
}

/* ===============================
COUPON
================================ */

function bindCoupon() {

	const btn =
		document.getElementById("applyCoupon");

	if (!btn) return;

	btn.addEventListener("click", () => {

		const input =
			document.getElementById("couponInput") as HTMLInputElement;

		if (!input) return;

		const code = input.value.trim();
		if (!code) return;

		const gross =
			equipmentTotal +
			fieldTotal +
			extraHourFee;

		fetch("/sports_rental_system/staff/api/check_coupon.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				code,
				total: gross,
				cart: getCart(),
				customerId: localStorage.getItem("customer_id")
			})
		})
			.then(r => r.json())
			.then(res => {

				const msg =
					document.getElementById("couponMsg");

				if (!res.success) {

					if (msg) {
						msg.textContent =
							res.message || "คูปองใช้ไม่ได้";
						msg.className =
							"coupon-msg error";
					}

					couponDiscount = 0;
					couponCode = null;

					updateTotals();
					return;
				}

				if (res.type === "percent") {

					couponDiscount =
						Math.floor(
							gross *
							Number(res.discount) / 100
						);

				} else {

					couponDiscount =
						Number(res.discount || 0);
				}

				couponCode = code;

				if (msg) {
					msg.textContent =
						"ใช้คูปองสำเร็จ ลด " +
						couponDiscount +
						" บาท";
					msg.className =
						"coupon-msg success";
				}

				updateTotals();
			});
	});
}

/* ===============================
SUBMIT
================================ */

function bindSubmit() {

	const btn =
		document.getElementById("payBtn") as HTMLButtonElement;

	if (!btn) return;

	btn.addEventListener("click", () => {

		const ok = confirm(
			"ยืนยันการสร้างรายการจอง และไปหน้าชำระเงินหรือไม่?"
		);

		if (!ok) return;

		const branchId =
			localStorage.getItem("branchId");

		const customerId =
			localStorage.getItem("customer_id");

		if (!branchId || !customerId) {

			alert("❌ ข้อมูลไม่ครบ");
			return;
		}

		let rawDate =
			localStorage.getItem("rentDate");

		if (rawDate && rawDate.indexOf("/") !== -1) {

			const p = rawDate.split("/");

			rawDate =
				p[2] + "-" +
				p[1] + "-" +
				p[0];
		}

		const timeSlotRaw =
			localStorage.getItem("timeSlot");

		if (!rawDate || !timeSlotRaw) {
			alert("❌ วันหรือเวลาไม่ครบ");
			return;
		}

		const payload = {
			branchId,
			customerId,
			rentDate: rawDate,
			timeSlot: Number(timeSlotRaw),
			rentHours: Number(
				localStorage.getItem("rentHours") || 1
			),
			usedPoints,
			couponDiscount,
			couponCode,
			cart: getCart()
		};

		console.log("🚀 STAFF CREATE BOOKING =>", payload);

		fetch(
			"/sports_rental_system/staff/api/create_booking.php",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(payload)
			}
		)
			.then(r => r.json())
			.then(data => {

				if (!data.success) {

					alert(
						"❌ สร้างการจองไม่ได้: " +
						data.message
					);
					return;
				}

				window.location.href =
					data.redirect;

			})
			.catch(err => {

				console.error(err);

				alert("❌ เซิร์ฟเวอร์ผิดพลาด");
			});
	});
}


/* ===============================
UTILS
================================ */

function getCart() {

	const raw = localStorage.getItem("cart");

	return raw ? JSON.parse(raw) : [];
}

function pad(n: number) {

	return n < 10 ? "0" + n : n.toString();
}

function setText(id: string, value: string) {

	const el = document.getElementById(id);
	if (el) el.textContent = value;
}

function isField(type: string) {

	return (
		type === "field" ||
		type === "สนาม"
	);
}
