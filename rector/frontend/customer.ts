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
		console.error("Session check failed");
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
		if (yearSelect && data.year) {
			yearSelect.innerHTML = '<option value="">ทุกชั้นปี</option>';
			data.year.forEach(y => yearSelect.add(new Option(`ปี ${y}`, y)));
		}

		const genSelect = document.getElementById("genderSelect");
		if (genSelect && data.gender) {
			genSelect.innerHTML = '<option value="">ทุกเพศ</option>';
			data.gender.forEach(g => genSelect.add(new Option(g.name, g.id)));
		}
	} catch (err) {
		console.error("Filter options error:", err);
	}
}

/* ================= INIT FILTER EVENTS ================= */
function initFilterEvents() {
	const filterIds = [
		"rangeSelect", "bookingTypeSelect", "userTypeSelect",
		"facultySelect", "yearSelect", "genderSelect", "startDate", "endDate"
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
	const ids = ["rangeSelect", "bookingTypeSelect", "userTypeSelect", "facultySelect", "yearSelect", "genderSelect", "startDate", "endDate"];
	ids.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			if (id === "rangeSelect") el.value = "all";
			else el.value = "";
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
		year: document.getElementById("yearSelect")?.value || "",
		gender_id: document.getElementById("genderSelect")?.value || ""
	};
}

/* ================= LOAD DASHBOARD ================= */
async function loadDashboard() {
	try {
		const filters = getFilters();
		const query = new URLSearchParams(filters).toString();

		const res = await fetch("/sports_rental_system/rector/api/get_executive_overview.php?" + query);

		const contentType = res.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			const text = await res.text();
			console.error("Server returned non-JSON:", text);
			return;
		}

		const data = await res.json();
		if (!data.success) return;

		// อัปเดต KPI
		const kpi = data.kpi ?? {};
		updateKpiUI("kpiUsers", kpi.total_users, "");
		updateKpiUI("kpiPenetration", kpi.student_pct, "%");
		updateKpiUI("kpiGeneral", kpi.general_pct, "%");
		updateKpiUI("kpiExternal", kpi.external_pct, "%");

		const chartsData = data.charts;

		// 1. แนวโน้มการจอง
		renderChart("trendUsersChart", {
			type: "line",
			data: {
				labels: chartsData.trend?.labels ?? [],
				datasets: [{
					label: "จำนวนผู้เข้าใช้งาน (คน)",
					data: chartsData.trend?.data ?? [],
					borderColor: "#339af0",
					backgroundColor: "rgba(51, 154, 240, 0.1)",
					fill: true,
					tension: 0.3
				}]
			}
		});

		// 2. อันดับคณะ
		renderChart("topFacultyChart", {
			type: "bar",
			data: {
				labels: chartsData.top_faculty?.labels ?? [],
				datasets: [{
					label: "จำนวนนิสิต (คน)",
					data: chartsData.top_faculty?.data ?? [],
					backgroundColor: "#51cf66"
				}]
			},
			options: {
				indexAxis: "y",
				plugins: { legend: { display: false } }
			}
		});

		// 3. สัดส่วนเพศ
		renderChart("genderChart", {
			type: "doughnut",
			data: {
				labels: chartsData.gender?.labels ?? [],
				datasets: [{
					data: chartsData.gender?.data ?? [],
					backgroundColor: ["#4dabf7", "#ff69b4", "#adb5bd"]
				}]
			},
			options: { plugins: { legend: { position: 'bottom' } } }
		});

		// 4. สถิติตามชั้นปี
		renderChart("yearChart", {
			type: "bar",
			data: {
				labels: chartsData.year?.labels ?? [],
				datasets: [{
					label: "จำนวนนิสิต (คน)",
					data: chartsData.year?.data ?? [],
					backgroundColor: "#ff922b"
				}]
			}
		});

	} catch (err) {
		console.error("Dashboard error:", err);
	}
}

/* ================= HELPERS ================= */
function updateKpiUI(id, value, unit) {
    const el = document.getElementById(id);
    if (el) {
        const num = Number(value ?? 0); 
        const isPercent = ["kpiPenetration", "kpiGeneral", "kpiExternal"].includes(id);
        
        el.innerText = isPercent
            ? num.toFixed(1) + unit
            : num.toLocaleString() + unit;
    }
}

function renderChart(id, config) {
	const canvas = document.getElementById(id);
	if (!canvas) return;

	if (charts[id]) charts[id].destroy();
	Chart.defaults.font.family = "'Noto Sans Thai', sans-serif";
	const ctx = canvas.getContext("2d");
	if (ctx) charts[id] = new Chart(ctx, config);
}