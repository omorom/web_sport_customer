document.addEventListener("DOMContentLoaded", () => {

	const grid = document.getElementById("equipmentGrid");
	const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;

	const totalCount = document.getElementById("totalCount");
	const readyCount = document.getElementById("readyCount");
	const rentedCount = document.getElementById("rentedCount");
	const repairCount = document.getElementById("repairCount");
	const lostCount = document.getElementById("lostCount");

	const branchLabel = document.getElementById("selectedBranch");

	if (!grid) return;

	let allData: any[] = [];

	// ==========================
	// ตรวจสอบ Session ก่อน
	// ==========================
	fetch("/sports_rental_system/warehouse/api/check_session.php")
		.then(res => res.json())
		.then(data => {

			if (!data.success) {
				window.location.href = "login.html";
				return;
			}

			if (branchLabel) {
				branchLabel.textContent = data.branch_name;
			}

			loadInventory(); // โหลดหลังผ่าน session เท่านั้น
		});

	// ==========================
	// โหลดข้อมูล
	// ==========================
	function loadInventory() {

		grid.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;

		fetch("/sports_rental_system/warehouse/api/get_equipment.php")
			.then(res => res.json())
			.then(res => {

				if (!res.success) {
					grid.innerHTML = `<p>ไม่สามารถโหลดข้อมูลได้</p>`;
					return;
				}

				allData = res.data;
				updateSummary(allData);
				renderData(allData);
			})
			.catch(() => {
				grid.innerHTML = `<p>เกิดข้อผิดพลาด</p>`;
			});
	}

	// ==========================
	// ค้นหา
	// ==========================
	searchInput?.addEventListener("input", () => {
		const keyword = searchInput.value.trim();
		renderData(filterData(keyword));
	});

	function filterData(keyword: string) {
		if (!keyword) return allData;

		return allData.filter(item =>
			item.instance_code.toLowerCase().includes(keyword.toLowerCase()) ||
			item.equipment_name.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	// ==========================
	// แสดง Card
	// ==========================
	function renderData(data: any[]) {

		grid.innerHTML = "";

		if (data.length === 0) {
			grid.innerHTML = "<p>ไม่พบข้อมูล</p>";
			return;
		}

		const grouped = groupByCategory(data);
		const today = new Date();
		const thirtyDaysFromNow = new Date();
		thirtyDaysFromNow.setDate(today.getDate() + 30);

		Object.keys(grouped).forEach(category => {

			const items = grouped[category];

			const ready = items.filter(i => i.status === "Ready").length;
			const rented = items.filter(i => i.status === "Rented").length;
			const repair = items.filter(i => i.status === "Damaged").length;
			const lost = items.filter(i => i.status === "Lost").length;

			const expiringSoonItems = items.filter(i => {
				if (!i.expiry_date) return false;
				const expDate = new Date(i.expiry_date);
				return expDate > today && expDate <= thirtyDaysFromNow;
			}).length;

			const equipmentCounts: Record<string, number> = {};
			items.forEach(item => {
				const name = item.equipment_name;
				equipmentCounts[name] = (equipmentCounts[name] || 0) + 1;
			});

			const categoryCard = document.createElement("div");
			categoryCard.className = "category-card";

			categoryCard.innerHTML = `
            <div class="category-header">
                <h3>${category}</h3>
                <span class="category-total">${items.length} ชิ้น</span>
            </div>

            <div class="status-summary-grid">
                <div class="status-item ready">
                    <span class="status-label">พร้อมใช้งาน</span>
                    <span class="status-value">${ready}</span>
                </div>
                <div class="status-item rented">
                    <span class="status-label">ถูกเช่า</span>
                    <span class="status-value">${rented}</span>
                </div>
                <div class="status-item repair">
                    <span class="status-label">ชำรุด</span>
                    <span class="status-value">${repair}</span>
                </div>
                <div class="status-item lost">
                    <span class="status-label">สูญหาย</span>
                    <span class="status-value">${lost}</span>
                </div>
            </div>

			<div class="info-section">
                <p class="section-title">ข้อมูลเพิ่มเติม:</p>
                <div class="info-alert-container">
                    ${repair > 0
					? `<div class="info-alert"><i class="alert-icon">!</i> อุปกรณ์ใช้งานหนัก: ${repair} ชิ้น</div>`
					: ''}
                    ${expiringSoonItems > 0
					? `<div class="info-alert warning"><i class="alert-icon">!</i> ใกล้หมดอายุการใช้งาน: ${expiringSoonItems} ชิ้น</div>`
					: ''}
                    ${repair === 0 && expiringSoonItems === 0
					? '<div class="info-empty">ไม่มีรายการที่ต้องเฝ้าระวัง</div>'
					: ''}
                </div>
            </div>

			<div class="list-section">
                <p class="section-title">รายการอุปกรณ์:</p>
                <div class="equipment-list-minimal">
                    ${Object.entries(equipmentCounts).map(([name, count]) => `
                        <div class="equipment-row-minimal">
                            <span class="dot"></span>
                            <span class="name">${name} <span class="count">(${count})</span></span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
			grid.appendChild(categoryCard);
		});
	}


	// ==========================
	// อัปเดต Summary
	// ==========================
	function updateSummary(data: any[]) {

		const total = data.length;
		const ready = data.filter(i => i.status === "Ready").length;
		const rented = data.filter(i => i.status === "Rented").length;
		const repair = data.filter(i => i.status === "Maintenance").length;
		const lost = data.filter(i => i.status === "Lost").length;

		if (totalCount) totalCount.parentElement!.innerHTML = `
        <div><h4>ทั้งหมด</h4><p>${total} ชิ้น</p></div>
        <div class="summary-icon orange">📦</div>`;
    
    if (readyCount) readyCount.parentElement!.innerHTML = `
        <div><h4>พร้อมใช้งาน</h4><p class="text-green">${ready} ชิ้น</p></div>
        <div class="summary-icon green">✅</div>`;

    if (rentedCount) rentedCount.parentElement!.innerHTML = `
        <div><h4>ถูกเช่า</h4><p class="text-blue">${rented} ชิ้น</p></div>
        <div class="summary-icon blue">👤</div>`;

    if (repairCount) repairCount.parentElement!.innerHTML = `
        <div><h4>ชำรุด</h4><p class="text-orange">${repair} ชิ้น</p></div>
        <div class="summary-icon yellow">⚠️</div>`;

    if (lostCount) lostCount.parentElement!.innerHTML = `
        <div><h4>สูญหาย</h4><p class="text-red">${lost} ชิ้น</p></div>
        <div class="summary-icon red">❌</div>`;
}

	function groupByCategory(data: any[]) {

		const grouped: Record<string, any[]> = {};

		data.forEach(item => {
			const category = item.category_name || "ไม่ระบุหมวด";

			if (!grouped[category]) {
				grouped[category] = [];
			}

			grouped[category].push(item);
		});

		return grouped;
	}


});