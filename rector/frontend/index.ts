let charts = {};
let dashboardTimer = null;

document.addEventListener("DOMContentLoaded", async () => {
	await checkSession();
	await loadFilterOptions();
	initFilterEvents();
	toggleCustomDate();
	await loadDashboard();
});

/* ================= SESSION CHECK ================= */
async function checkSession() {
	try {
		const res = await fetch("/sports_rental_system/rector/api/check_session.php");
		const data = await res.json();
		if (!data.success) {
			window.location.href = "login.html";
		}
	} catch (err) {
		window.location.href = "login.html";
	}
}

/* ================= LOAD FILTER OPTIONS ================= */
async function loadFilterOptions() {
	try {
		const res = await fetch("/sports_rental_system/rector/api/get_executive_overview.php");
		const data = await res.json();

		const facSelect = document.getElementById("facultySelect");
		if (facSelect && data.faculty) {
			facSelect.innerHTML = '<option value="">ทุกคณะ</option>';
			data.faculty.forEach(f => facSelect.add(new Option(f.name, f.id)));
		}

		const yearSelect = document.getElementById("yearSelect");
		if (yearSelect) {
			yearSelect.innerHTML = '<option value="">ทุกชั้นปี</option>';
			[1, 2, 3, 4, 5, 6].forEach(y => yearSelect.add(new Option(`ปี ${y}`, y)));
		}
	} catch (err) {
		console.error("Filter options error:", err);
	}
}

/* ================= INIT FILTER EVENTS ================= */
function initFilterEvents() {
	const filterIds = [
		"rangeSelect", "bookingTypeSelect", "userTypeSelect",
		"facultySelect", "yearSelect", "startDate", "endDate"
	];

	filterIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.addEventListener("change", () => {
				if (id === "rangeSelect") toggleCustomDate();
				debounceLoad();
			});
		}
	});

	document.getElementById("resetFilter")?.addEventListener("click", () => {
		resetFilters();
		loadDashboard();
	});
}

function debounceLoad() {
	clearTimeout(dashboardTimer);
	dashboardTimer = setTimeout(() => loadDashboard(), 300);
}

function toggleCustomDate() {
	const rangeEl = document.getElementById("rangeSelect");
	const box = document.getElementById("customDateBox");
	if (rangeEl && box) {
		box.style.display = rangeEl.value === "custom" ? "flex" : "none";
	}
}

function resetFilters() {
	const ids = ["rangeSelect", "bookingTypeSelect", "userTypeSelect", "facultySelect", "yearSelect", "startDate", "endDate"];
	ids.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.value = (id === "rangeSelect") ? "all" : "";
		}
	});
	toggleCustomDate();
}

function getFilters() {
	return {
		range: document.getElementById("rangeSelect")?.value || "",
		start_date: document.getElementById("startDate")?.value || "",
		end_date: document.getElementById("endDate")?.value || "",
		booking_type: document.getElementById("bookingTypeSelect")?.value || "",
		user_type: document.getElementById("userTypeSelect")?.value || "",
		faculty_id: document.getElementById("facultySelect")?.value || "",
		year: document.getElementById("yearSelect")?.value || ""
	};
}

/* ================= LOAD DASHBOARD ================= */
async function loadDashboard() {
	try {
		const filters = getFilters();
		const query = new URLSearchParams(filters).toString();
		const res = await fetch("/sports_rental_system/rector/api/overview.php?" + query);
		const data = await res.json();

		if (!data.success) return;

		// 1. อัปเดต KPI
		const kpi = data.kpi ?? {};
		document.getElementById("kpiRevenue").innerText = kpi.revenue || "0";
		document.getElementById("kpiUsers").innerText = (kpi.users || 0).toLocaleString();
		document.getElementById("kpiBookings").innerText = (kpi.bookings || 0).toLocaleString();
		document.getElementById("kpiUtil").innerText = (kpi.util || 0) + "%";

		// 2. กราฟแนวโน้ม (Booking Trend)
		renderChart("bookingTrendChart", {
			type: "line",
			data: {
				labels: data.charts.trend.labels,
				datasets: [{
					label: "จำนวนการจอง",
					data: data.charts.trend.data,
					borderColor: "#ff7a00",
					backgroundColor: "rgba(255, 122, 0, 0.1)",
					fill: true,
					tension: 0.4
				}]
			},
			options: { responsive: true, maintainAspectRatio: false }
		});

		// 3. กราฟสัดส่วน Online vs Walk-in
		renderChart("bookingSourceChart", {
			type: "doughnut",
			data: {
				labels: ["Online", "Walk-in"],
				datasets: [{
					data: [data.charts.source.online, data.charts.source.walkin],
					backgroundColor: ["#43a43b", "#3d74c1"]
				}]
			},
			options: {
				plugins: { legend: { position: 'bottom' } },
				cutout: '70%',
				responsive: true,
				maintainAspectRatio: false
			}
		});

		// 4. วาดกราฟแท่ง Peak Time (ใช้ข้อมูลจาก heatmap มารวมกัน)
		if (data.charts && data.charts.heatmap) {
			renderPeakBarChart(data.charts.heatmap);
		}

		// 5. อัปเดตตัวเลขสรุป Peak Time
		if (data.peak_summary) {
			document.getElementById("peakMorning").innerText = data.peak_summary.morning.hour || "--:--";
			document.getElementById("peakAfternoon").innerText = data.peak_summary.afternoon.hour || "--:--";
			document.getElementById("peakEvening").innerText = data.peak_summary.evening.hour || "--:--";
		}

	} catch (err) {
		console.error("Dashboard error:", err);
	}
}

function renderChart(id, config) {
	const canvas = document.getElementById(id);
	if (!canvas) return;

	if (charts[id]) {
		charts[id].destroy();
	}

	const ctx = canvas.getContext("2d");
	charts[id] = new Chart(ctx, config);
}

/* ================= ฟังก์ชันสำหรับกราฟแท่ง Peak Time ================= */
function renderPeakBarChart(heatData) {
	const hours = Array.from({ length: 14 }, (_, i) => i + 8);

	const hourlyTotals = hours.map(h => {
		let total = 0;
		for (let d = 1; d <= 7; d++) {
			if (heatData[d] && heatData[d][h]) {
				total += parseInt(heatData[d][h]);
			}
		}
		return total;
	});

	const backgroundColors = hours.map(h => {
		if (h <= 12) return '#ec5b75'; 
		if (h <= 17) return '#bf2bff'; 
		return '#ea2323'; 
	});

	renderChart("peakHourBarChart", {
		type: 'bar',
		data: {
			labels: hours.map(h => `${h}:00`),
			datasets: [{
				label: 'จำนวนการจองรวม',
				data: hourlyTotals,
				backgroundColor: backgroundColors,
				borderRadius: 6
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false }
			},
			scales: {
				y: { beginAtZero: true, ticks: { precision: 0 } }
			}
		}
	});
}