declare const Chart: any;

let popularChart: any;
let usageChart: any;
let damageChart: any;
let damageTopChart: any;
let repairChart: any;

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", function () {

	initCharts();

	loadRegions();
	loadProvinces();
	loadBranches();

	bindFilters();

	loadAll();
});

/* ==============================
   FILTER EVENTS
============================== */

function bindFilters(): void {

	const ids = [
		"rangeSelect",
		"regionSelect",
		"provinceSelect",
		"branchSelect",
		"startDate",
		"endDate"
	];

	ids.forEach(id => {
		const el = document.getElementById(id) as any;
		if (!el) return;

		el.addEventListener("change", () => {

			if (id === "rangeSelect") toggleCustomDate();

			// 🔥 cascade dropdown
			if (id === "regionSelect") {
				loadProvinces();
				loadBranches();
			}

			if (id === "provinceSelect") {
				loadBranches();
			}

			loadAll();
		});
	});

	document.getElementById("resetFilter")
		?.addEventListener("click", resetFilter);
}

/* ==============================
   FILTER
============================== */

function getFilter() {
	return {
		range: (document.getElementById("rangeSelect") as any)?.value || "",
		start: (document.getElementById("startDate") as any)?.value || "",
		end: (document.getElementById("endDate") as any)?.value || "",
		region_id: (document.getElementById("regionSelect") as any)?.value || "",
		province_id: (document.getElementById("provinceSelect") as any)?.value || "",
		branch_id: (document.getElementById("branchSelect") as any)?.value || ""
	};
}

function toggleCustomDate(): void {
	const range = (document.getElementById("rangeSelect") as any).value;
	const box = document.getElementById("customDateBox") as HTMLElement;
	box.style.display = range === "custom" ? "block" : "none";
}

function resetFilter(): void {

	(document.getElementById("rangeSelect") as any).value = "";
	(document.getElementById("regionSelect") as any).value = "";
	(document.getElementById("provinceSelect") as any).value = "";
	(document.getElementById("branchSelect") as any).value = "";

	(document.getElementById("startDate") as any).value = "";
	(document.getElementById("endDate") as any).value = "";

	loadProvinces();
	loadBranches();

	loadAll();
}

/* ==============================
   LOAD DASHBOARD
============================== */

function loadAll(): void {

	fetch("/sports_rental_system/executive/api/equipment_dashboard.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(getFilter())
	})
		.then(res => res.json())
		.then(result => {

			updateKPI(result.kpi);

			updatePopular(result.popular);
			updateUsage(result.trend_booking);
			updateDamage(result.damage);
			updateDamageTop(result.damage_top); // 🔥 ใหม่
			updateRepair(result.repair);

		})
		.catch(err => console.error(err));
}

/* ==============================
   KPI
============================== */

function updateKPI(kpi: any): void {

	document.getElementById("kpiTotalEq")!.textContent =
		Number(kpi?.total_equipment ?? 0).toLocaleString() + " ชิ้น";

	document.getElementById("kpiUsedEq")!.textContent =
		Number(kpi?.used_equipment ?? 0).toLocaleString() + " ชิ้น";

	document.getElementById("kpiUsageRate")!.textContent =
		Number(kpi?.usage_rate ?? 0).toFixed(2) + " %";

	document.getElementById("kpiDamageRate")!.textContent =
		Number(kpi?.damage_rate ?? 0).toFixed(2) + " %";

	document.getElementById("kpiRepairCost")!.textContent =
	Number(kpi?.repair_cost ?? 0).toLocaleString() + " บาท";
}

/* ==============================
   UPDATE CHARTS
============================== */

function updatePopular(data: any): void {
	popularChart.data.labels = data?.labels || [];
	popularChart.data.datasets[0].data = data?.data || [];
	popularChart.update();
}

function updateUsage(data: any): void {
	usageChart.data.labels = data?.labels || [];
	usageChart.data.datasets[0].data = data?.data || [];
	usageChart.update();
}

function updateDamage(data: any): void {
	damageChart.data.datasets[0].data = data?.data || [0, 0];
	damageChart.update();
}

function updateDamageTop(data: any): void {
	damageTopChart.data.labels = data?.labels || [];
	damageTopChart.data.datasets[0].data = data?.data || [];
	damageTopChart.update();
}

function updateRepair(data: any): void {
	repairChart.data.labels = data?.labels || [];
	repairChart.data.datasets[0].data = data?.data || [];
	repairChart.update();
}


/* ==============================
   DROPDOWN
============================== */

function loadRegions(): void {
	fetch("/sports_rental_system/executive/api/get_regions.php")
		.then(res => res.json())
		.then(res => {

			const select = document.getElementById("regionSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			(res.data || []).forEach((r: any) => {
				select.innerHTML += `<option value="${r.region_id}">${r.region_name}</option>`;
			});
		});
}

function loadProvinces(): void {

	const regionId = (document.getElementById("regionSelect") as any)?.value || "";

	fetch("/sports_rental_system/executive/api/get_provinces.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ region_id: regionId })
	})
		.then(res => res.json())
		.then(res => {

			const select = document.getElementById("provinceSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			(res.data || []).forEach((p: any) => {
				select.innerHTML += `<option value="${p.province_id}">${p.name}</option>`;
			});
		});
}

function loadBranches(): void {

	const regionId = (document.getElementById("regionSelect") as any)?.value || "";
	const provinceId = (document.getElementById("provinceSelect") as any)?.value || "";

	fetch("/sports_rental_system/executive/api/get_branches.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			region_id: regionId,
			province_id: provinceId
		})
	})
		.then(res => res.json())
		.then(res => {

			const select = document.getElementById("branchSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			(res.data || []).forEach((b: any) => {
				select.innerHTML += `<option value="${b.branch_id}">${b.name}</option>`;
			});
		});
}

/* ==============================
   INIT CHART
============================== */
function initCharts(): void {

	const baseOptions = (unit: string = "") => ({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: "bottom" },
			tooltip: {
				callbacks: {
					label: function (context: any) {
						let value = context.raw || 0;
						return value.toLocaleString() + (unit ? " " + unit : "");
					}
				}
			}
		},
		scales: {
			y: {
				min: 0,
				ticks: {
					stepSize: 1,
					precision: 0,
					callback: (v: any) => (v % 1 === 0 ? v + (unit ? " " + unit : "") : "")
				}
			}
		}
	});

	// 🔵 จำนวนครั้งใช้งาน
	popularChart = new Chart(document.getElementById("popularChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "จำนวนครั้งที่ใช้งาน",
				data: [],
				backgroundColor: "#3b82f6"
			}]
		},
		options: baseOptions("ครั้ง")
	});

	// 🟢 การใช้งาน (line)
	usageChart = new Chart(document.getElementById("usageChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [{
				label: "การใช้งาน",
				data: [],
				borderColor: "#22c55e",
				fill: false
			}]
		},
		options: baseOptions("ครั้ง")
	});

	// 🟡 สถานะอุปกรณ์ (doughnut)
	damageChart = new Chart(document.getElementById("damageChart"), {
		type: "doughnut",
		data: {
			labels: ["ปกติ", "เสียหาย"],
			datasets: [{
				data: [0, 0],
				backgroundColor: ["#22c55e", "#ef4444"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { position: "bottom" },
				tooltip: {
					callbacks: {
						label: function (context: any) {
							const data = context.dataset.data;
							const total = data.reduce((a: number, b: number) => a + b, 0);

							const value = context.raw || 0;
							const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;

							return `${context.label}: ${percent}% (${value.toLocaleString()} ครั้ง)`;
						}
					}
				}
			}
		}
	});

	// 🔴 เสียหายสูงสุด
	damageTopChart = new Chart(document.getElementById("damageTopChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "จำนวนครั้งที่เสียหาย",
				data: [],
				backgroundColor: "#ef4444"
			}]
		},
		options: baseOptions("ครั้ง")
	});


// 🟠 ซ่อม (ค่าใช้จ่าย)
repairChart = new Chart(document.getElementById("repairChart"), {
	type: "bar",
	data: {
		labels: [],
		datasets: [{
			label: "ค่าใช้จ่ายในการซ่อม",
			data: [],
			backgroundColor: "#f97316"
		}]
	},
	options: baseOptions("บาท") // 👈 เปลี่ยนหน่วย
});
}