declare const Chart: any;

let bookingTrendChart: any;
let revenueTrendChart: any;
let channelChart: any;
let bookingRatioChart: any;
let branchChart: any;

/* ============================== */
document.addEventListener("DOMContentLoaded", function () {
	initCharts();
	loadRegions();
	loadProvinces();
	loadBranches();
	bindFilters();
	toggleDateInput();
	loadAll();
});

function toggleDateInput(): void {
	const range = (document.getElementById("rangeSelect") as any)?.value;
	const box = document.getElementById("customDateBox") as HTMLElement;

	if (!box) return;

	if (range === "custom") {
		box.style.display = "block";
	} else {
		box.style.display = "none";
	}
}
/* ============================== FILTER */

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

			if (id === "rangeSelect") {
				toggleCustomDate();
			}

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
	 FILTER LOGIC
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

	loadAll();
}


/* ============================== UTIL */

function safeArray(arr: any): any[] {
	return Array.isArray(arr) ? arr : [];
}

function getNiceMax(data: number[]): number {
	const max = Math.max(...data, 0);
	if (max === 0) return 5;

	const pow = Math.pow(10, Math.floor(Math.log(max) / Math.LN10));
	return Math.ceil(max / pow) * pow;
}

/* ============================== LOAD */

function loadAll(): void {

	fetch("/sports_rental_system/executive/api/user_dashboard.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(getFilter())
	})
		.then(res => res.json())
		.then(result => {

			if (result.error) {
				console.error(result.message);
				return;
			}

			const charts = result.charts || {};

			updateKPI(result.kpi);

			/* donut */
			updateBookingTrend({
				labels: ["ลูกค้าใหม่", "ลูกค้าเดิม"],
				bookings: [
					charts.new_vs_returning?.new ?? 0,
					charts.new_vs_returning?.returning ?? 0
				]
			});

			updateRevenueTrend({
				labels: charts.booking_group?.labels ?? [],
				revenue: charts.booking_group?.data ?? []
			});

			updateChannel({
				labels: safeArray(charts.revenue_by_type?.labels),
				data: safeArray(charts.revenue_by_type?.data)
			});

			updateBookingRatio({
				labels: safeArray(charts.cancel_by_type?.labels),
				data: safeArray(charts.cancel_by_type?.data)
			});

			updateBranches({
				labels: safeArray(charts.customers_by_branch?.labels),
				data: safeArray(charts.customers_by_branch?.data)
			});

		})
		.catch(err => console.error(err));
}

/* ============================== KPI */

function updateKPI(kpi: any): void {
	document.getElementById("kpiBookings")!.textContent =
		(Number(kpi?.total_customers ?? 0)).toLocaleString() + " คน";

	document.getElementById("kpiRevenue")!.textContent =
		(Number(kpi?.repeat_rate ?? 0)).toFixed(2) + " %";

	document.getElementById("kpiAvg")!.textContent =
		(Number(kpi?.avg_booking ?? 0)).toLocaleString() + " ครั้ง/คน";

	document.getElementById("kpiCancel")!.textContent =
		(Number(kpi?.arpu ?? 0)).toLocaleString() + " บาท";
}

/* ============================== CHART UPDATE */

function updateRevenueTrend(data: any): void {
	if (!revenueTrendChart) return;

	const standardLabels = [
		"(1–4 ครั้ง)",
		"(5–10 ครั้ง)",
		"(11 ครั้งขึ้นไป)"
	];

	const map: any = {};

	// map ค่าที่มีอยู่
	(data?.labels || []).forEach((label: string, i: number) => {
		map[label] = data.revenue[i];
	});

	const finalData = standardLabels.map(label => map[label] ?? 0);

	const maxY = getNiceMax(finalData);

	revenueTrendChart.options.scales.y.min = 0;
	revenueTrendChart.options.scales.y.max = maxY;

	revenueTrendChart.data.labels = standardLabels;
	revenueTrendChart.data.datasets[0].data = finalData;

	revenueTrendChart.update();
}

function updateChannel(data: any): void {
	if (!channelChart) return;

	const labelMap: any = {
		general: "บุคคลทั่วไป",
		student: "นิสิต/นักศึกษา"
	};

	const labels = (data?.labels || []).map((l: string) => labelMap[l] || l);
	const values = data?.data?.length ? data.data : [0];

	const colorMap: any = {
		"บุคคลทั่วไป": "#6366f1",   // ม่วง
		"นิสิต/นักศึกษา": "#f59e0b" // ส้ม
	};

	const colors = labels.map((l: string) => colorMap[l] || "#94a3b8");

	const maxY = getNiceMax(values);

	channelChart.options.scales.y.min = 0;
	channelChart.options.scales.y.max = maxY;

	channelChart.data.labels = labels;
	channelChart.data.datasets[0].data = values;

	channelChart.data.datasets[0].backgroundColor = colors;

	channelChart.update();
}

function updateBookingTrend(data: any): void {
	if (!bookingTrendChart) return;

	bookingTrendChart.data.labels = data?.labels ?? [];
	bookingTrendChart.data.datasets[0].data = data?.bookings ?? [];

	bookingTrendChart.update();
}

function updateBookingRatio(data: any): void {
	if (!bookingRatioChart) return;

	let values = data?.data ?? [];
	if (!values.length) values = [1];

	const labelMap: any = {
		general: "บุคคลทั่วไป",
		student: "นิสิต/นักศึกษา"
	};

	const labels = (data?.labels || []).map((l: string) => labelMap[l] || l);

	bookingRatioChart.data.labels = labels;
	bookingRatioChart.data.datasets[0].data = values;

	bookingRatioChart.update();
}


function updateBranches(data: any): void {
	if (!branchChart) return;

	const labels = data?.labels?.length ? data.labels : ["ไม่มีข้อมูล"];
	const values = data?.data?.length ? data.data : [0];

	const maxY = getNiceMax(values);

	branchChart.options.scales.y.min = 0;
	branchChart.options.scales.y.max = maxY;

	branchChart.data.labels = labels;
	branchChart.data.datasets[0].data = values;

	branchChart.update();
}

/* ==============================
	 DROPDOWNS
============================== */

function loadRegions(): void {
	fetch("/sports_rental_system/executive/api/get_regions.php")
		.then(res => res.json())
		.then(res => {

			const data = res.data || [];

			const select = document.getElementById("regionSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			data.forEach((r: any) => {
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

			const data = res.data || [];

			const select = document.getElementById("provinceSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			data.forEach((p: any) => {
				select.innerHTML += `<option value="${p.province_id}">${p.name}</option>`;
			});
		});
}


function loadBranches(): Promise<void> {

	const regionId = (document.getElementById("regionSelect") as any)?.value || "";
	const provinceId = (document.getElementById("provinceSelect") as any)?.value || "";

	return fetch("/sports_rental_system/executive/api/get_branches.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			region_id: regionId,
			province_id: provinceId
		})
	})
	.then(res => res.json())
	.then(res => {

		const data = res.data || [];

		const select = document.getElementById("branchSelect") as HTMLSelectElement;
		select.innerHTML = `<option value="">ทั้งหมด</option>`;

		data.forEach((b: any) => {
			select.innerHTML += `<option value="${b.branch_id}">${b.name}</option>`;
		});
	});
}

/* ============================== INIT CHART */
function initCharts(): void {

	const baseOptions = (unit: string = "") => ({
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: "bottom" },
			tooltip: {
				backgroundColor: "#111827",
				titleColor: "#ffffff",
				bodyColor: "#e5e7eb",
				padding: 10,
				displayColors: false,

				callbacks: {
					title: function (context: any) {
						return context[0].label || "";
					},
					label: function (context: any) {
						const label = context.dataset.label || "";
						const value = context.raw || 0;
						return `${label}: ${value.toLocaleString()}${unit ? " " + unit : ""}`;
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
					callback: (v: any) =>
						v % 1 === 0 ? v.toLocaleString() + (unit ? " " + unit : "") : ""
				}
			}
		}
	});

	// 🟢 แนวโน้มลูกค้า
	bookingTrendChart = new Chart(document.getElementById("bookingTrendChart"), {
		type: "doughnut",
		data: {
			labels: ["ลูกค้าใหม่", "ลูกค้าเดิม"],
			datasets: [{
				data: [],
				backgroundColor: ["#00ff5e", "#0062ff"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { position: "bottom" },
				tooltip: {
					backgroundColor: "#111827",
					titleColor: "#fff",
					bodyColor: "#e5e7eb",
					padding: 10,
					displayColors: false,
					callbacks: {
						label: function (context: any) {
							const data = context.dataset.data;
							const total = data.reduce((a: number, b: number) => a + b, 0);

							const value = context.raw || 0;
							const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

							return `${context.label}
→ ${value.toLocaleString()} คน (${percent}%)`;
						}
					}
				}
			}
		}
	});

	// 🔵 จำนวนลูกค้าแบ่งตามระดับ
	revenueTrendChart = new Chart(document.getElementById("revenueTrendChart"), {
		type: "bar",
		data: {
			labels: ["ใช้งานน้อย", "ปานกลาง", "สูง"],
			datasets: [{
				label: "จำนวนการใช้งาน",
				data: [],
				backgroundColor: ["#b0cdff", "#4588fb", "#005bf9"]
			}]
		},
		options: baseOptions("คน")
	});

	// 🟣 รายได้ตามช่องทาง
	channelChart = new Chart(document.getElementById("channelChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "รายได้",
				data: [],
				backgroundColor: ["#6366f1", "#f59e0b"]
			}]
		},
		options: baseOptions("บาท")
	});

	// 🟡 สัดส่วนประเภทลูกค้า
	bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
		type: "doughnut",
		data: {
			labels: ["บุคคลทั่วไป", "นิสิต/นักศึกษา"],
			datasets: [{
				data: [],
				backgroundColor: ["#6366f1", "#f59e0b"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { position: "bottom" },
				tooltip: {
					backgroundColor: "#111827",
					titleColor: "#fff",
					bodyColor: "#e5e7eb",
					padding: 10,
					displayColors: false,
					callbacks: {
						label: function (context: any) {
							const data = context.dataset.data;
							const total = data.reduce((a: number, b: number) => a + b, 0);

							const value = context.raw || 0;
							const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

							return `${context.label}
→ ${value.toLocaleString()} คน (${percent}%)`;
						}
					}
				}
			}
		}
	});

	// 🔷 ลูกค้าตามสาขา
	branchChart = new Chart(document.getElementById("topChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "จำนวนลูกค้า",
				data: [],
				backgroundColor: "#3b82f6"
			}]
		},
		options: baseOptions("คน")
	});
}