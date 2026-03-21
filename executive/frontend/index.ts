declare const Chart: any;

let bookingTrendChart: any;
let revenueTrendChart: any;
let channelChart: any;
let bookingRatioChart: any;
let branchChart: any;
let overviewChart: any;

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

/* ==============================
	 LOAD DASHBOARD
============================== */

function loadAll(): void {

	fetch("/sports_rental_system/executive/api/dashboard_summary.php", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(getFilter())
	})
		.then(res => res.json())
		.then(result => {

			updateKPI(result.kpi);

			updateOverview(result.trend_finance);

			updateBookingTrend(result.trend_booking);

			updateRevenueTrend(result.trend_revenue);

			updateChannel(result.channel);

			updateBookingRatio(result.booking_ratio);

			updateBranches(result.branches);


		})
		.catch(err => console.error("โหลด Dashboard ไม่สำเร็จ", err));
}

/* ==============================
	 KPI
============================== */

function updateKPI(kpi: any): void {

	document.getElementById("kpiBookings")!.textContent =
		Number(kpi?.total_bookings ?? 0).toLocaleString() + " รายการ";

	document.getElementById("kpiRevenue")!.textContent =
		Number(kpi?.total_revenue ?? 0).toLocaleString() + " บาท";

	document.getElementById("kpiAvg")!.textContent =
		Number(kpi?.revenue_per_booking ?? 0)
			.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " บาท/ครั้ง";

	document.getElementById("kpiCancel")!.textContent =
		Number(kpi?.cancellation_rate ?? 0).toFixed(2) + " %";

	document.getElementById("kpiExpense")!.textContent =
		Number(kpi?.total_expense ?? 0).toLocaleString() + " บาท";

	document.getElementById("kpiProfit")!.textContent =
		Number(kpi?.net_profit ?? 0).toLocaleString() + " บาท";

}

/* ==============================
	 UPDATE CHARTS
============================== */

function updateBookingTrend(data: any): void {
	bookingTrendChart.data.labels = data?.labels || [];
	bookingTrendChart.data.datasets[0].data = data?.data || [];
	bookingTrendChart.update();
}

function updateRevenueTrend(data: any): void {
	revenueTrendChart.data.labels = data?.labels || [];
	revenueTrendChart.data.datasets[0].data = data?.data || [];
	revenueTrendChart.update();
}

function updateChannel(data: any): void {
	channelChart.data.labels = data?.labels || [];
	channelChart.data.datasets[0].data = data?.data || [];
	channelChart.update();
}

function updateOverview(data: any): void {
	overviewChart.data.labels = data?.labels || [];

	overviewChart.data.datasets[0].data = data?.revenue || [];
	overviewChart.data.datasets[1].data = data?.expense || [];
	overviewChart.data.datasets[2].data = data?.profit || [];

	overviewChart.update();
}

function updateBookingRatio(data: any): void {

	const labels = data?.labels || [];
	const values = data?.data || [];

	const colors = labels.map((label: string) => {
		if (label === "สำเร็จ") return "#22c55e";
		if (label === "ยกเลิก") return "#ef4444";
		return "#9ca3af";
	});

	bookingRatioChart.data.labels = labels;
	bookingRatioChart.data.datasets[0].data = values;
	bookingRatioChart.data.datasets[0].backgroundColor = colors;

	bookingRatioChart.update();
}

function updateBranches(data: any): void {
	branchChart.data.labels = data?.labels || [];
	branchChart.data.datasets[0].data = data?.data || [];
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

			const data = res.data || [];

			const select = document.getElementById("branchSelect") as HTMLSelectElement;
			select.innerHTML = `<option value="">ทั้งหมด</option>`;

			data.forEach((b: any) => {
				select.innerHTML += `<option value="${b.branch_id}">${b.name}</option>`;
			});
		});
}

function initCharts(): void {


	const baseOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "bottom"
			},
			tooltip: {
				callbacks: {
					label: function (context: any) {
						let label = context.dataset.label || "";
						let value = context.raw ?? 0;

						// 👉 ใส่หน่วยตาม label
						if (label.includes("รายได้")) {
							return `${label}: ${value.toLocaleString()} บาท`;
						}
						return `${label}: ${value.toLocaleString()} ครั้ง`;
					}
				}
			}
		}
	};

	overviewChart = new Chart(document.getElementById("overviewChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{
					label: "รายได้",
					data: [],
					borderColor: "#22c55e",
					backgroundColor: "rgba(34,197,94,0.1)",
					tension: 0.4
				},
				{
					label: "ค่าใช้จ่าย",
					data: [],
					borderColor: "#ef4444",
					backgroundColor: "rgba(239,68,68,0.1)",
					tension: 0.4
				},
				{
					label: "กำไรสุทธิ",
					data: [],
					borderColor: "#8b5cf6",
					backgroundColor: "rgba(139,92,246,0.1)",
					tension: 0.4
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: "index",
				intersect: false
			},
			scales: {
				y: {
					ticks: {
						callback: (v: any) => {
							const num = Number(v ?? 0);
							return num.toLocaleString() + " บาท";
						}
					}
				}
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context: any) {
							const value = Number(context.raw ?? 0);
							return `${context.dataset.label}: ${value.toLocaleString()} บาท`;
						}
					}
				}
			}
		}
	});

	// 📊 BOOKING TREND
	bookingTrendChart = new Chart(document.getElementById("bookingTrendChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [{
				label: "จำนวนการจอง",
				data: [],
				borderColor: "#ff7a00",
				backgroundColor: "rgba(255,122,0,0.15)",
				fill: true,
				tension: 0.4
			}]
		},
		options: {
			...baseOptions,
			scales: {
				y: {
					ticks: {
						callback: (v: any) => v + " ครั้ง"
					}
				}
			}
		}
	});

	// 📈 REVENUE TREND
	revenueTrendChart = new Chart(document.getElementById("revenueTrendChart"), {
		type: "line",
		data: {
			labels: [],
			datasets: [{
				label: "รายได้",
				data: [],
				borderColor: "#3b82f6",
				backgroundColor: "rgba(59,130,246,0.15)",
				fill: true,
				tension: 0.4
			}]
		},
		options: {
			...baseOptions,
			scales: {
				y: {
					ticks: {
						callback: (v: any) => v.toLocaleString() + " บาท"
					}
				}
			}
		}
	});

	// 📊 CHANNEL
	channelChart = new Chart(document.getElementById("channelChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "รายได้",
				data: [],
				backgroundColor: ["#3b82f6", "#22c55e"]
			}]
		},
		options: {
			...baseOptions,
			scales: {
				y: {
					ticks: {
						callback: (v: any) => v.toLocaleString() + " บาท"
					}
				}
			}
		}
	});

	// 🥧 STATUS
	bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
		type: "doughnut",
		data: {
			labels: [],
			datasets: [{
				data: [],
				backgroundColor: []
			}]
		},
		options: {
			...baseOptions,
			cutout: "65%",
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context: any) {
							let label = context.label || "";
							let val = context.raw || 0;
							return `${label}: ${val.toLocaleString()} ครั้ง`;
						}
					}
				}
			}
		}
	});


	// 🏢 ALL BRANCHES (รายได้สุทธิ)
	branchChart = new Chart(document.getElementById("topChart"), {
		type: "bar",
		data: {
			labels: [],
			datasets: [{
				label: "รายได้สุทธิ", // ✅ เปลี่ยน label
				data: [],
				backgroundColor: "#ff7a00"
			}]
		},
		options: {
			...baseOptions,
			indexAxis: "y",
			scales: {
				x: {
					ticks: {
						callback: (v: any) => v.toLocaleString() + " บาท" // ✅ format เงิน
					}
				}
			},
			plugins: {
				tooltip: {
					callbacks: {
						label: function (context: any) {
							let val = context.raw || 0;
							return `รายได้: ${val.toLocaleString()} บาท`; // ✅ tooltip เป็นเงิน
						}
					}
				}
			}
		}
	});
}