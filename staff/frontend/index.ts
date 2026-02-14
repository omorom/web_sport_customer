document.addEventListener("DOMContentLoaded", () => {

	console.log("index.ts loaded");

	updateCartCount();

	// ============================
	// STATE
	// ============================

	let selectedBranchId: string | null = null;
	let selectedCategories: string[] = [];
	let searchKeyword = "";

	// ============================
	// ELEMENTS
	// ============================

	const branchLabel =
		document.getElementById("selectedBranch") as HTMLElement | null;

	const timeSlot =
		document.getElementById("timeSlot") as HTMLSelectElement | null;

	const dateInput =
		document.getElementById("rentDate") as HTMLInputElement | null;

	const hourInput =
		document.getElementById("rentHours") as HTMLInputElement | null;

	const categoryBox =
		document.getElementById("categoryList") as HTMLElement | null;

	const equipmentGrid =
		document.getElementById("equipmentGrid") as HTMLElement | null;

	const searchInput =
		document.getElementById("searchInput") as HTMLInputElement | null;


	// ===== PRICE =====

	const minPriceInput =
		document.getElementById("minPriceInput") as HTMLInputElement | null;

	const maxPriceInput =
		document.getElementById("maxPriceInput") as HTMLInputElement | null;

	const priceMinRange =
		document.getElementById("priceMin") as HTMLInputElement | null;

	const priceMaxRange =
		document.getElementById("priceMax") as HTMLInputElement | null;
	// ============================
	// RESET FILTERS
	// ============================

	const resetBtn =
		document.getElementById("resetFilters") as HTMLButtonElement | null;

	// RESET BUTTON CLICK
	resetBtn?.addEventListener("click", () => {

		console.log("RESET FILTERS");

		// ===== STATE =====
		selectedCategories = [];
		searchKeyword = "";

		// ===== DATE / TIME / HOURS =====
		if (dateInput) dateInput.value = "";
		if (timeSlot) timeSlot.value = "";
		if (hourInput) hourInput.value = "";

		document
			.querySelectorAll(".duration-btn")
			.forEach(b => b.classList.remove("active"));

		// ===== CATEGORY =====
		categoryBox
			?.querySelectorAll<HTMLInputElement>(
				"input[type=checkbox]"
			)
			.forEach(cb => (cb.checked = false));

		// ===== PRICE =====
		const defaultMin =
			priceMinRange?.min || "0";

		const defaultMax =
			priceMaxRange?.max || "5000";

		if (minPriceInput) minPriceInput.value = defaultMin;
		if (maxPriceInput) maxPriceInput.value = defaultMax;

		if (priceMinRange) priceMinRange.value = defaultMin;
		if (priceMaxRange) priceMaxRange.value = defaultMax;

		// ===== SEARCH =====
		if (searchInput) searchInput.value = "";

		// ===== STORAGE =====
		localStorage.removeItem("rentDate");
		localStorage.removeItem("timeSlot");
		localStorage.removeItem("rentHours");
		localStorage.removeItem("minPrice");
		localStorage.removeItem("maxPrice");
		localStorage.removeItem("cart");  
		updateCartCount();                

		// // ถ้าอยาก clear field ใน cart ด้วย
		// clearFieldInCart();
		// ===== reload =====
		loadEquipment();

	});



	// ============================
	// RESTORE DATE / TIME / HOURS
	// ============================

	const savedDate =
		localStorage.getItem("rentDate");

	const savedTime =
		localStorage.getItem("timeSlot");

	const savedHours =
		localStorage.getItem("rentHours");

	const savedMin = localStorage.getItem("minPrice");
	const savedMax = localStorage.getItem("maxPrice");;

	if (savedDate && dateInput)
		dateInput.value = savedDate;

	if (savedHours && hourInput) {

		hourInput.value = savedHours;

		document
			.querySelectorAll(".duration-btn")
			.forEach(b => b.classList.remove("active"));

		document
			.querySelector(
				`.duration-btn[data-hour="${savedHours}"]`
			)
			?.classList.add("active");
	}


	if (savedMin && minPriceInput && priceMinRange) {
		minPriceInput.value = savedMin;
		priceMinRange.value = savedMin;
	}

	if (savedMax && maxPriceInput && priceMaxRange) {
		maxPriceInput.value = savedMax;
		priceMaxRange.value = savedMax;
	}

	// ============================
	// SAVE DATE / TIME
	// ============================

	dateInput?.addEventListener("change", () => {

		localStorage.setItem(
			"rentDate",
			dateInput.value
		);

		loadEquipment();
	});

	timeSlot?.addEventListener("change", () => {

		localStorage.setItem(
			"timeSlot",
			timeSlot.value
		);

		loadEquipment();
	});

	// ============================
	// DURATION BUTTONS
	// ============================

	document
		.querySelectorAll<HTMLButtonElement>(".duration-btn")
		.forEach(btn => {

			btn.addEventListener("click", () => {

				document
					.querySelectorAll(".duration-btn")
					.forEach(b =>
						b.classList.remove("active")
					);

				btn.classList.add("active");

				const h =
					btn.dataset.hour || "3";

				if (hourInput)
					hourInput.value = h;

				localStorage.setItem(
					"rentHours",
					h
				);

				loadEquipment();
			});

		});

	// ============================
	// PRICE SYNC
	// ============================

	function syncPrice() {

		if (
			!minPriceInput ||
			!maxPriceInput ||
			!priceMinRange ||
			!priceMaxRange
		) return;

		let min = Number(priceMinRange.value);
		let max = Number(priceMaxRange.value);

		if (min > max) min = max;

		minPriceInput.value = min.toString();
		maxPriceInput.value = max.toString();

		localStorage.setItem("minPrice", min.toString());
		localStorage.setItem("maxPrice", max.toString());

		loadEquipment();
	}

	priceMinRange?.addEventListener("input", syncPrice);
	priceMaxRange?.addEventListener("input", syncPrice);

	minPriceInput?.addEventListener("change", () => {
		if (priceMinRange)
			priceMinRange.value = minPriceInput.value;

		syncPrice();
	});

	maxPriceInput?.addEventListener("change", () => {
		if (priceMaxRange)
			priceMaxRange.value = maxPriceInput.value;

		syncPrice();
	});

	// ============================
	// STAFF PROFILE RENDER
	// ============================

	fetch("/sports_rental_system/staff/api/get_profile.php")
		.then(res => res.json())
		.then(data => {

			const pointEl =
				document.getElementById("topPoints");
		});

	// ============================
	// LOAD BRANCH
	// ============================

	fetch("/sports_rental_system/staff/api/get_selected_branch.php")
		.then(res => res.json())
		.then(res => {

			if (!res || res.success === false) {
				window.location.href =
					"branches.html";
				return;
			}

			const data =
				res.data ?? res;

			selectedBranchId =
				data.branch_id;

			if (branchLabel)
				branchLabel.textContent =
					data.name;

			if (timeSlot) {

				generateTimeSlots(
					data.open_time,
					data.close_time
				);

				if (savedTime)
					timeSlot.value = savedTime;
			}

			loadEquipment();

		});

	// ============================
	// SEARCH
	// ============================

	searchInput?.addEventListener("input", () => {

		searchKeyword =
			searchInput.value.trim();

		loadEquipment();

	});

	// ============================
	// LOAD CATEGORIES
	// ============================

	fetch("/sports_rental_system/staff/api/get_categories.php")
		.then(res => res.json())
		.then(res => {

			if (!res.success || !categoryBox)
				return;

			categoryBox.innerHTML = "";

			res.data.forEach((cat: any) => {

				const label =
					document.createElement("label");

				label.innerHTML = `
          <input type="checkbox" value="${cat.category_id}">
          <span>${cat.name}</span>
        `;

				const checkbox =
					label.querySelector("input")!;

				checkbox.addEventListener("change", () => {

					const id =
						checkbox.value;

					if (checkbox.checked) {
						selectedCategories.push(id);
					} else {
						selectedCategories =
							selectedCategories.filter(
								c => c !== id
							);
					}

					loadEquipment();
				});

				categoryBox.appendChild(label);

			});

		});

	// ============================
	// LOAD SESSION & BRANCH INFO
	// ============================
	fetch("/sports_rental_system/staff/api/check_session.php")
		.then(res => res.json())
		.then(data => {
			if (data.success) {

				selectedBranchId = data.branch_id;

				if (branchLabel) {
					branchLabel.textContent = data.branch_name;
				}

				// 3. เมื่อได้ Branch ID แล้วค่อยสั่งโหลดอุปกรณ์
				loadEquipment();
			} else {
				// ถ้าไม่ได้ล็อกอิน ให้เด้งไปหน้า login
				window.location.href = "login.html";
			}
		});

	// ============================
	// LOAD EQUIPMENT
	// ============================

	function loadEquipment() {

		if (!selectedBranchId ||
			!equipmentGrid)
			return;

		const params =
			new URLSearchParams();

		params.set(
			"branch_id",
			selectedBranchId
		);

		if (selectedCategories.length > 0)
			params.set(
				"categories",
				selectedCategories.join(",")
			);

		if (minPriceInput?.value)
			params.set("min_price", minPriceInput.value);

		if (maxPriceInput?.value)
			params.set("max_price", maxPriceInput.value);

		if (searchKeyword !== "")
			params.set("q", searchKeyword);

		equipmentGrid.innerHTML =
			`<p class="loading-text">
        กำลังโหลดอุปกรณ์...
      </p>`;

		fetch(
			"/sports_rental_system/staff/api/get_equipment.php?" +
			params.toString()
		)
			.then(res => res.json())
			.then(res => {

				equipmentGrid.innerHTML = "";

				if (!res.success ||
					res.data.length === 0) {

					equipmentGrid.innerHTML =
						"<p>ไม่พบอุปกรณ์</p>";

					updateCartCount();
					return;
				}

				const template =
					document.getElementById(
						"equipmentCardTemplate"
					) as HTMLTemplateElement;

				res.data.forEach((item: any) => {

					const card =
						template.content
							.firstElementChild!
							.cloneNode(true) as HTMLElement;

					const img =
						card.querySelector("img")!;

					const nameEl =
						card.querySelector(".name")!;

					const priceEl =
						card.querySelector(".price")!;

					const stockEl =
						card.querySelector(".stock")!;

					const qtyText =
						card.querySelector(".qty-num")!;

					const plusBtn =
						card.querySelector(".qty-plus")!;

					const minusBtn =
						card.querySelector(".qty-minus")!;

					const qty =
						getQtyInCart(
							item.equipment_id
						);

					img.src =
						item.image_url;

					nameEl.textContent =
						item.name;

					priceEl.textContent =
						`${item.price_per_unit} บาท / ชม.`;

					stockEl.textContent =
						`คงเหลือ ${item.available_stock} ชิ้น`;

					qtyText.textContent =
						qty.toString();

					if (qty > 0)
						card.classList.add(
							"selected"
						);

					// ➕ เพิ่ม
					plusBtn.addEventListener(
						"click",
						() => {

							const currentQty =
								getQtyInCart(
									item.equipment_id
								);

							if (
								currentQty >=
								item.available_stock
							) {

								alert(
									`เพิ่มได้มากสุด ${item.available_stock} ชิ้น`
								);
								return;
							}

							increaseCartItem(
								item,
								item.available_stock
							);

							updateCardQty(
								card,
								item.equipment_id
							);

						}
					);

					// ➖ ลด
					minusBtn.addEventListener(
						"click",
						() => {

							decreaseCartItem(
								item
							);

							updateCardQty(
								card,
								item.equipment_id
							);

						}
					);

					equipmentGrid.appendChild(card);

				});

				updateCartCount();

			});

	}

});




// ============================
// CART HELPERS
// ============================

function getCart(): any[] {

	try {

		const raw =
			localStorage.getItem("cart");

		if (!raw)
			return [];

		const parsed =
			JSON.parse(raw);

		return Array.isArray(parsed)
			? parsed
			: [];

	} catch {
		return [];
	}

}

function getQtyInCart(
	id: string | number
): number {

	const cart =
		getCart();

	for (let i = 0;
		i < cart.length;
		i++) {

		if (
			String(cart[i].id) ===
			String(id)
		) {
			return cart[i].qty;
		}

	}

	return 0;
}


// ➕ เพิ่ม
function increaseCartItem(
	item: any,
	maxStock: number
) {

	const cart =
		getCart();

	let index = -1;

	for (let i = 0;
		i < cart.length;
		i++) {

		if (
			String(cart[i].id) ===
			String(item.equipment_id)
		) {

			index = i;
			break;
		}

	}

	if (index === -1) {

		cart.push({
			id: String(
				item.equipment_id
			),
			name: item.name,
			price:
				item.price_per_unit,
			qty: 1,
			image:
				item.image_url,
			stock: maxStock,

			category_id: item.category_id
		});

	} else {

		if (
			cart[index].qty >=
			maxStock
		)
			return;

		cart[index].qty++;
	}

	localStorage.setItem(
		"cart",
		JSON.stringify(cart)
	);

}


// ➖ ลด
function decreaseCartItem(
	item: any
) {

	const cart =
		getCart();

	let index = -1;

	for (let i = 0;
		i < cart.length;
		i++) {

		if (
			String(cart[i].id) ===
			String(item.equipment_id)
		) {

			index = i;
			break;
		}

	}

	if (index === -1)
		return;

	cart[index].qty--;

	if (cart[index].qty <= 0)
		cart.splice(index, 1);

	localStorage.setItem(
		"cart",
		JSON.stringify(cart)
	);

}


// ============================
// UPDATE CARD
// ============================

function updateCardQty(
	card: HTMLElement,
	equipmentId:
		string | number
) {

	const qty =
		getQtyInCart(
			equipmentId
		);

	const qtyText =
		card.querySelector(
			".qty-num"
		)!;

	qtyText.textContent =
		qty.toString();

	if (qty > 0)
		card.classList.add(
			"selected"
		);
	else
		card.classList.remove(
			"selected"
		);

	updateCartCount();
}


// ============================
// UPDATE CART COUNT
// ============================

function updateCartCount() {

	const badge =
		document.getElementById(
			"cartCount"
		);

	if (!badge)
		return;

	const cart =
		getCart();

	let total = 0;

	for (let i = 0;
		i < cart.length;
		i++) {

		total +=
			Number(cart[i].qty) || 0;
	}

	badge.textContent =
		total.toString();

}


// ===============================
// GENERATE TIME SLOTS
// ===============================

function generateTimeSlots(
	openTime: string,
	closeTime: string
) {

	const select =
		document.getElementById(
			"timeSlot"
		) as HTMLSelectElement | null;

	if (!select)
		return;

	select.innerHTML =
		`<option value="">
      เลือกเวลา
    </option>`;

	const openHour =
		parseInt(
			openTime.split(":")[0]
		);

	const closeHour =
		parseInt(
			closeTime.split(":")[0]
		);

	const lastStartHour =
		closeHour - 3;

	for (
		let h = openHour;
		h <= lastStartHour;
		h++
	) {

		const hour =
			h < 10
				? "0" + h
				: h.toString();

		const opt =
			document.createElement(
				"option"
			);

		opt.value = hour;

		opt.textContent =
			`${hour}:00 น.`;

		select.appendChild(opt);

	}

}