// ================= TYPES =================

type DashboardResponse = {
	kpi: {
		total_equipment: number;
		equipment_util_rate: number;
		total_venue: number;
		venue_util_rate: number;
	};
	top_equipment: {
		labels: string[];
		data: number[];
	};
	top_venue: {
		labels: string[];
		data: number[];
	};
	category_faculty: {
		labels: string[];
		datasets: any[];
	};
};

// ================= CHART STORE =================

const chartStore: Record<string, any> = {};

// ================= HELPERS =================

function getVal(id: string): string {
	return (document.getElementById(id) as HTMLSelectElement)?.value ?? "";
}

function renderChart(id: string, config: any) {
	const canvas = document.getElementById(id) as HTMLCanvasElement;
	if (!canvas) return;

	if (chartStore[id]) {
		chartStore[id].destroy();
	}

	config.options = {
		...config.options,
		animation: { duration: 400 },
		responsive: true,
		maintainAspectRatio: false
	};

	chartStore[id] = new Chart(canvas, config);
}
// ================= FETCH =================

async function loadDashboard() {
	const params = new URLSearchParams({
		range: getVal("rangeSelect"),
		start_date: (document.getElementById("startDate") as HTMLInputElement)?.value ?? "",
		end_date: (document.getElementById("endDate") as HTMLInputElement)?.value ?? "",
		booking_type: getVal("bookingTypeSelect"),
		user_type: getVal("userTypeSelect"),
		faculty: getVal("facultySelect"),
		year: getVal("yearSelect"),
		category: getVal("categorySelect")
	});

	try {
		const res = await fetch(`/sports_rental_system/rector/api/dashboard_equipment.php?${params.toString()}`);
		if (!res.ok) throw new Error("Network response was not ok");
		const data: DashboardResponse = await res.json();

		renderKPI(data);
		renderTopEquipment(data);
		renderTopVenue(data);
		renderCategoryFaculty(data);
	} catch (error) {
		console.error("Error loading dashboard:", error);
	}
}

// ================= KPI =================

function renderKPI(data: DashboardResponse) {
	const kpi = data.kpi ?? {};

	// อุปกรณ์
	const kpiEq = document.getElementById("kpiEquipment");
	if (kpiEq) kpiEq.innerText = (kpi.total_equipment ?? 0).toLocaleString();

	const kpiEqUtil = document.getElementById("kpiEquipmentUtil");
	if (kpiEqUtil) kpiEqUtil.innerText = (kpi.equipment_util_rate ?? 0).toFixed(2) + "%";

	// สนาม
	const kpiVn = document.getElementById("kpiVenue");
	if (kpiVn) kpiVn.innerText = (kpi.total_venue ?? 0).toLocaleString();

	const kpiVnUtil = document.getElementById("kpiVenueUtil");
	if (kpiVnUtil) kpiVnUtil.innerText = (kpi.venue_util_rate ?? 0).toFixed(2) + "%";
}

// ================= TOP EQUIPMENT =================

function renderTopEquipment(data: DashboardResponse) {
	renderChart("topEquipmentChart", {
		type: "bar",
		data: {
			labels: data.top_equipment?.labels ?? [],
			datasets: [{
				label: "จำนวนครั้งที่เช่า",
				data: data.top_equipment?.data ?? [],
				backgroundColor: "#3b82f6",
				borderWidth: 2,
				borderRadius: 8,
			}],
		},
		options: {
			plugins: { 
				legend: { display: false } 
			},
			scales: {
                y: {
                    beginAtZero: true 
                }
            }
		},
	});
}

// ================= TOP VENUE =================

function renderTopVenue(data: DashboardResponse) {
	renderChart("topVenueChart", {
		type: "bar",
		data: {
			labels: data.top_venue?.labels ?? [],
			datasets: [{
				label: "จำนวนครั้งที่เช่า",
				data: data.top_venue?.data ?? [],
				backgroundColor: "#22c55e",
				borderWidth: 2,
				borderRadius: 8,
			}],
		},
		options: {
			plugins: { 
				legend: { display: false } 
			},
			scales: {
                y: {
                    beginAtZero: true
                }
            }
		},
	});
}

// ================= CATEGORY × FACULTY =================

function renderCategoryFaculty(data: DashboardResponse) {
	const datasets = data.category_faculty?.datasets || [];
	const labels = data.category_faculty?.labels || [];

	if (labels.length === 0) return;

	const vibrantPalette = [
        '#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ef4444',
        '#06b6d4', '#eab308', '#ec4899', '#14b8a6', '#6366f1',
        '#84cc16', '#f43f5e', '#0ea5e9', '#8b5cf6'
    ];

	const styledDatasets = datasets.map((ds, index) => ({
        ...ds,
        backgroundColor: vibrantPalette[index % vibrantPalette.length],
        borderColor: vibrantPalette[index % vibrantPalette.length],
        borderWidth: 1,
        barPercentage: 0.5,     
        categoryPercentage: 0.8,
        borderRadius: 2,
    }));

	renderChart("categoryFacultyChart", {
		type: "bar",
		data: {
			labels: labels,
			datasets: styledDatasets,
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "bottom",
					labels: { usePointStyle: true, font: { size: 10 } }
				},
				tooltip: { mode: 'index', intersect: false }
			},
			scales: {
				x: {
					stacked: false,
					grid: { display: false },
					ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
				},
				y: {
					beginAtZero: true,
					grid: { color: 'rgba(0,0,0,0.05)' },
					ticks: { precision: 0 }
				},
			},
		},
	});
}


// ================= EVENTS =================

function initEvents() {
	const filters = [
		"rangeSelect", "bookingTypeSelect", "userTypeSelect",
		"facultySelect", "yearSelect", "categorySelect",
		"startDate", "endDate"
	];

	filters.forEach(id => {
		document.getElementById(id)?.addEventListener("change", loadDashboard);
	});

	// แสดง/ซ่อนวันที่แบบกำหนดเอง
	document.getElementById("rangeSelect")?.addEventListener("change", (e) => {
		const customDateBox = document.getElementById("customDateBox");
		if (customDateBox) {
			customDateBox.style.display = (e.target as HTMLSelectElement).value === "custom" ? "flex" : "none";
		}
	});

	// ปุ่ม Reset
	document.getElementById("resetFilter")?.addEventListener("click", () => {
		filters.forEach(id => {
			const el = document.getElementById(id);
			if (!el) return;
			if (el instanceof HTMLSelectElement) {
				el.value = (id === "rangeSelect") ? "all" : "";
			} else if (el instanceof HTMLInputElement) {
				el.value = "";
			}
		});

		const customDateBox = document.getElementById("customDateBox");
		if (customDateBox) customDateBox.style.display = "none";

		loadDashboard();
	});
}

// ================= FILTERS DATA =================

async function initFilters() {
	try {
		const res = await fetch('/sports_rental_system/rector/api/get_filter.php');
		const data = await res.json();

		fillSelect("facultySelect", data.faculties);
		fillSelect("categorySelect", data.categories);

		const years = [
			{ id: "1", name: "ปีที่ 1" },
			{ id: "2", name: "ปีที่ 2" },
			{ id: "3", name: "ปีที่ 3" },
			{ id: "4", name: "ปีที่ 4" },
			{ id: "5", name: "ปีที่ 5" },
			{ id: "6", name: "ปีที่ 6" }
		];
		fillSelect("yearSelect", years);

	} catch (error) {
		console.error("Error initializing filters:", error);
	}
}

function fillSelect(id: string, items: { id: string | number, name: string }[]) {
	const select = document.getElementById(id) as HTMLSelectElement;
	if (!select) return;
	select.innerHTML = '<option value="">ทั้งหมด</option>';
	items.forEach(item => {
		const opt = document.createElement("option");
		opt.value = item.id.toString();
		opt.textContent = item.name;
		select.appendChild(opt);
	});
}

// ================= INIT =================

document.addEventListener("DOMContentLoaded", async () => {
	await initFilters();
	initEvents();
	loadDashboard();
});