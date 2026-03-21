declare const Chart: any;

/* ==============================
   TYPES
============================== */

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

/* ==============================
   GLOBAL
============================== */

const chartStore: Record<string, any> = {};

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", async () => {
    await initFilters();
    initEvents();
    loadDashboard();
});

/* ==============================
   FILTER EVENTS
============================== */

function initEvents() {

    const filters = [
        "rangeSelect",
        "bookingTypeSelect",
        "userTypeSelect",
        "facultySelect",
        "yearSelect",
        "categorySelect",
        "startDate",
        "endDate"
    ];

    // change event
    filters.forEach(id => {
        document.getElementById(id)
            ?.addEventListener("change", loadDashboard);
    });

    // toggle custom date
    document.getElementById("rangeSelect")
        ?.addEventListener("change", (e: any) => {
            const box = document.getElementById("customDateBox");
            if (!box) return;

            box.style.display = e.target.value === "custom"
                ? "block"
                : "none";
        });

    // reset
    document.getElementById("resetFilter")
        ?.addEventListener("click", resetFilters);
}

/* ==============================
   FILTER LOGIC
============================== */

function getVal(id: string): string {
    return (document.getElementById(id) as HTMLSelectElement)?.value ?? "";
}

function getFilters() {
    return {
        range: getVal("rangeSelect"),
        start_date: (document.getElementById("startDate") as HTMLInputElement)?.value ?? "",
        end_date: (document.getElementById("endDate") as HTMLInputElement)?.value ?? "",
        booking_type: getVal("bookingTypeSelect"),
        user_type: getVal("userTypeSelect"),
        faculty: getVal("facultySelect"),
        year: getVal("yearSelect"),
        category: getVal("categorySelect")
    };
}

function resetFilters() {

    const ids = [
        "rangeSelect",
        "bookingTypeSelect",
        "userTypeSelect",
        "facultySelect",
        "yearSelect",
        "categorySelect",
        "startDate",
        "endDate"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);

        if (el instanceof HTMLSelectElement) {
            el.value = (id === "rangeSelect") ? "all" : "";
        }

        if (el instanceof HTMLInputElement) {
            el.value = "";
        }
    });

    const box = document.getElementById("customDateBox");
    if (box) box.style.display = "none";

    loadDashboard();
}

/* ==============================
   DROPDOWNS
============================== */

async function initFilters() {
    try {
        const res = await fetch('/sports_rental_system/rector/api/get_filter.php');
        const data = await res.json();

        fillSelect("facultySelect", data.faculties);
        fillSelect("categorySelect", data.categories);

        const years = [
            { id: "1", name: "ปี 1" },
            { id: "2", name: "ปี 2" },
            { id: "3", name: "ปี 3" },
            { id: "4", name: "ปี 4" },
            { id: "5", name: "ปี 5" },
            { id: "6", name: "ปี 6" }
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

/* ==============================
   LOAD DASHBOARD
============================== */

async function loadDashboard() {

    const params = new URLSearchParams(getFilters());

    try {
        const res = await fetch(
            `/sports_rental_system/rector/api/dashboard_equipment.php?${params}`
        );

        if (!res.ok) throw new Error("Network response was not ok");

        const data: DashboardResponse = await res.json();

        updateKPI(data);

        updateTopEquipment(data);
        updateTopVenue(data);
        updateCategoryFaculty(data);

    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

/* ==============================
   KPI
============================== */

function updateKPI(data: DashboardResponse) {

    const kpi = data.kpi ?? {};

    // Equipment
    document.getElementById("kpiEquipment")!.innerText =
        (kpi.total_equipment ?? 0).toLocaleString();

    document.getElementById("kpiEquipmentUtil")!.innerText =
        (kpi.equipment_util_rate ?? 0).toFixed(2) + "%";

    // Venue
    document.getElementById("kpiVenue")!.innerText =
        (kpi.total_venue ?? 0).toLocaleString();

    document.getElementById("kpiVenueUtil")!.innerText =
        (kpi.venue_util_rate ?? 0).toFixed(2) + "%";
}

/* ==============================
   UPDATE CHARTS
============================== */

function updateTopEquipment(data: DashboardResponse) {

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
            }]
        },
        options: barOptions("ครั้ง")
    });
}

function updateTopVenue(data: DashboardResponse) {

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
            }]
        },
        options: barOptions("ครั้ง")
    });
}

function updateCategoryFaculty(data: DashboardResponse) {

    const datasets = data.category_faculty?.datasets || [];
    const labels = data.category_faculty?.labels || [];

    if (labels.length === 0) return;

    const palette = [
    '#f97316', '#3b82f6', 
    '#22c55e', '#a855f7', 
    '#ef4444', '#06b6d4', 
    '#eab308', '#ec4899', 
    '#6366f1', '#14b8a6', 
    '#f43f5e', '#8b5cf6', 
    '#f59e0b', '#64748b'  
];

    const styled = datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: palette[i % palette.length],
        borderWidth: 0,
        barPercentage: 0.6,
        categoryPercentage: 0.8
    }));

    renderChart("categoryFacultyChart", {
        type: "bar",
        data: { labels, datasets: styled },
        options: stackedOptions()
    });
}

/* ==============================
   CHART UTIL
============================== */

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

function barOptions(unit: string) {
    return {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: any) =>
                        ` ${ctx.dataset.label}: ${ctx.raw} ${unit}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    callback: (v: any) => v + " " + unit
                }
            }
        }
    };
}

function stackedOptions() {
    return {
        plugins: {
            legend: { position: "bottom" },
            tooltip: { mode: "index", intersect: false }
        },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: (v: any) => v + " ชิ้น"
                }
            }
        }
    };
}