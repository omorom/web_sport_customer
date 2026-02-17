// ใช้ Chart จาก CDN (global)
declare const Chart: any;

let trendChart: any;
let topChart: any;
let paymentChart: any;
let bookingRatioChart: any;
let profitChart: any;

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", async () => {

	initCharts();

	await loadRegions();
	await loadProvinces();
	await loadBranches();

	bindFilters();

	loadAll();
});

/* ==============================
   BIND EVENTS
============================== */

function bindFilters(): void {

	const ids = [
		"rangeSelect",
		"regionSelect",
		"provinceSelect",
		"branchSelect",
		"bookingTypeSelect",
		"startDate",
		"endDate"
	];

	ids.forEach(id => {
		const el = document.getElementById(id) as
			HTMLSelectElement | HTMLInputElement | null;

		if (!el) return;

		el.addEventListener("change", () => {
			if (id === "rangeSelect") toggleCustomDate();
			loadAll();
		});
	});

	document
		.getElementById("resetFilter")
		?.addEventListener("click", resetFilter);
}

/* ==============================
   FILTER
============================== */

interface DashboardFilter {
	range: string;
	start: string;
	end: string;
	region_id: string;
	province_id: string;
	branch_id: string;
	booking_type_id: string;
}

function getFilter(): DashboardFilter {
	return {
		range: (document.getElementById("rangeSelect") as HTMLSelectElement)?.value || "",
		start: (document.getElementById("startDate") as HTMLInputElement)?.value || "",
		end: (document.getElementById("endDate") as HTMLInputElement)?.value || "",
		region_id: (document.getElementById("regionSelect") as HTMLSelectElement)?.value || "",
		province_id: (document.getElementById("provinceSelect") as HTMLSelectElement)?.value || "",
		branch_id: (document.getElementById("branchSelect") as HTMLSelectElement)?.value || "",
		booking_type_id: (document.getElementById("bookingTypeSelect") as HTMLSelectElement)?.value || ""
	};
}

function toggleCustomDate(): void {
	const range = (document.getElementById("rangeSelect") as HTMLSelectElement).value;
	const box = document.getElementById("customDateBox") as HTMLElement;
	box.style.display = range === "custom" ? "block" : "none";
}

function resetFilter(): void {

	(document.getElementById("rangeSelect") as HTMLSelectElement).value = "30days";
	(document.getElementById("regionSelect") as HTMLSelectElement).value = "";
	(document.getElementById("provinceSelect") as HTMLSelectElement).value = "";
	(document.getElementById("branchSelect") as HTMLSelectElement).value = "";
	(document.getElementById("bookingTypeSelect") as HTMLSelectElement).value = "";

	(document.getElementById("startDate") as HTMLInputElement).value = "";
	(document.getElementById("endDate") as HTMLInputElement).value = "";

	loadAll();
}

/* ==============================
   LOAD DASHBOARD
============================== */

async function loadAll(): Promise<void> {

	try {

		const res = await fetch(
			"/sports_rental_system/executive/api/dashboard_summary.php",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(getFilter())
			}
		);

		const result = await res.json();

		updateKPI(result.kpi);
		updateTrend(result.trend);
		updateProfit(result.profit_trend);
		updatePayment(result.payment_ratio);
		updateBookingRatio(result.booking_ratio);
		updateTop5(result.top5);

	} catch (err) {
		console.error("โหลด Dashboard ไม่สำเร็จ", err);
	}
}

/* ==============================
   KPI
============================== */

function updateKPI(kpi: any): void {

	document.getElementById("kpiBookings")!.textContent =
		String(kpi?.total_bookings ?? 0);

	document.getElementById("kpiUsers")!.textContent =
		String(kpi?.total_users ?? 0);

	document.getElementById("kpiRevenue")!.textContent =
		Number(kpi?.total_revenue ?? 0).toLocaleString() + " บาท";

	document.getElementById("kpiExpense")!.textContent =
		Number(kpi?.total_expense ?? 0).toLocaleString() + " บาท";
}

/* ==============================
   TREND
============================== */

function updateTrend(trend: any): void {

	trendChart.data.labels = trend?.labels || [];
	trendChart.data.datasets[0].data = trend?.bookings || [];
	trendChart.data.datasets[1].data = trend?.revenue || [];
	trendChart.update();
}

/* ==============================
   PROFIT
============================== */

function updateProfit(data: any): void {

	profitChart.data.labels = data?.labels || [];
	profitChart.data.datasets[0].data = data?.revenue || [];
	profitChart.data.datasets[1].data = data?.expense || [];
	profitChart.update();
}

/* ==============================
   PAYMENT PIE
============================== */

function updatePayment(data: any): void {

	paymentChart.data.labels = data?.labels || [];
	paymentChart.data.datasets[0].data = data?.data || [];
	paymentChart.update();
}

/* ==============================
   BOOKING RATIO PIE
============================== */

function updateBookingRatio(data: any): void {

	bookingRatioChart.data.labels = data?.labels || [];
	bookingRatioChart.data.datasets[0].data = data?.data || [];
	bookingRatioChart.update();
}

/* ==============================
   TOP 5
============================== */

function updateTop5(top: any): void {

	topChart.data.labels = top?.labels || [];
	topChart.data.datasets[0].data = top?.counts || [];
	topChart.update();
}

/* ==============================
   DROPDOWNS (FIXED)
============================== */

async function loadRegions(): Promise<void> {

	const res = await fetch("/sports_rental_system/executive/api/get_regions.php");
	const json = await res.json();

	const data = Array.isArray(json) ? json : json.data;

	const select = document.getElementById("regionSelect") as HTMLSelectElement;
	select.innerHTML = `<option value="">ทั้งหมด</option>`;

	if (!data) return;

	data.forEach((r: any) => {
		select.innerHTML += `<option value="${r.region_id}">${r.region_name}</option>`;
	});
}

async function loadProvinces(): Promise<void> {

	const res = await fetch("/sports_rental_system/executive/api/get_provinces.php");
	const json = await res.json();

	const data = Array.isArray(json) ? json : json.data;

	const select = document.getElementById("provinceSelect") as HTMLSelectElement;
	select.innerHTML = `<option value="">ทั้งหมด</option>`;

	if (!data) return;

	data.forEach((p: any) => {
		select.innerHTML += `<option value="${p.province_id}">${p.name}</option>`;
	});
}

async function loadBranches(): Promise<void> {

	const res = await fetch("/sports_rental_system/executive/api/get_branches.php");
	const json = await res.json();

	const data = Array.isArray(json) ? json : json.data;

	const select = document.getElementById("branchSelect") as HTMLSelectElement;
	select.innerHTML = `<option value="">ทั้งหมด</option>`;

	if (!data) return;

	data.forEach((b: any) => {
		select.innerHTML += `<option value="${b.branch_id}">${b.name}</option>`;
	});
}


/* ==============================
   INIT CHARTS
============================== */

function initCharts(): void {

	trendChart = new Chart(document.getElementById("trendChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{ label: "จำนวนการจอง", data: [], borderColor: "#ff7a00" },
				{ label: "รายได้", data: [], borderColor: "#3b82f6" }
			]
		}
	});

	topChart = new Chart(document.getElementById("topChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [
				{ label: "จำนวนครั้งที่ถูกจอง", data: [], backgroundColor: "#ff7a00" }
			]
		}
	});

paymentChart = new Chart(document.getElementById("paymentChart"), {
	type: "pie",
	data: {
		labels: [],
		datasets: [{
			data: [],
			backgroundColor: [
				"#3b82f6",
				"#22c55e",
				"#f59e0b",
				"#ef4444",
				"#8b5cf6"
			]
		}]
	}
});

bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
	type: "pie",
	data: {
		labels: [],
		datasets: [{
			data: [],
			backgroundColor: [
				"#ff7a00",
				"#3b82f6"
			]
		}]
	}
});

	profitChart = new Chart(document.getElementById("profitChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{ label: "รายได้", data: [], borderColor: "#22c55e" },
				{ label: "ค่าใช้จ่าย", data: [], borderColor: "#ef4444" }
			]
		}
	});
}
