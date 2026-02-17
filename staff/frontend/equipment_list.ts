document.addEventListener("DOMContentLoaded", () => {

    const tableBody =
        document.getElementById("equipmentTableBody") as HTMLElement;

    const searchInput =
        document.getElementById("searchInput") as HTMLInputElement;

    const statusFilter =
        document.getElementById("statusFilter") as HTMLSelectElement;

    const categoryFilter =
        document.getElementById("categoryFilter") as HTMLSelectElement;

    const resetBtn =
        document.getElementById("resetFilters") as HTMLButtonElement;

    let selectedBranchId: string | null = null;
    let searchKeyword = "";
    let selectedStatus = "";
    let selectedCategory = "";

    // ===============================
    // โหลดสาขาที่เลือก (เหมือนหน้าเช่า)
    // ===============================
    fetch("/sports_rental_system/staff/api/get_selected_branch.php")
        .then(res => res.json())
        .then(res => {

            if (!res || res.success === false) {
                window.location.href = "branches.html";
                return;
            }

            const data = res.data ?? res;
            selectedBranchId = data.branch_id;

            loadEquipment();
        });

    // ===============================
    // โหลดหมวดหมู่
    // ===============================
    fetch("/sports_rental_system/staff/api/get_categories.php")
        .then(res => res.json())
        .then(res => {

            if (!res.success) return;

            res.data.forEach((cat: any) => {
                const opt = document.createElement("option");
                opt.value = cat.category_id;
                opt.textContent = cat.name;
                categoryFilter.appendChild(opt);
            });

        });

    // ===============================
    // FILTER EVENTS
    // ===============================

    searchInput.addEventListener("input", () => {
        searchKeyword = searchInput.value.trim();
        loadEquipment();
    });

    statusFilter.addEventListener("change", () => {
        selectedStatus = statusFilter.value;
        loadEquipment();
    });

    categoryFilter.addEventListener("change", () => {
        selectedCategory = categoryFilter.value;
        loadEquipment();
    });

    resetBtn.addEventListener("click", () => {

        searchKeyword = "";
        selectedStatus = "";
        selectedCategory = "";

        searchInput.value = "";
        statusFilter.value = "";
        categoryFilter.value = "";

        loadEquipment();
    });

    // ===============================
    // LOAD EQUIPMENT
    // ===============================
    function loadEquipment() {

        if (!selectedBranchId || !tableBody)
            return;

        const params = new URLSearchParams();

        // ⭐ สำคัญ: ส่ง branch_id ไปเหมือนหน้าเช่า
        params.set("branch_id", selectedBranchId);

        if (searchKeyword !== "")
            params.set("q", searchKeyword);

        if (selectedStatus !== "")
            params.set("status", selectedStatus);

        if (selectedCategory !== "")
            params.set("category_id", selectedCategory);

        tableBody.innerHTML =
            `<tr><td colspan="6">กำลังโหลด...</td></tr>`;

        fetch("/sports_rental_system/staff/api/get_equipment_list.php?"
            + params.toString())
            .then(res => res.json())
            .then(res => {

                tableBody.innerHTML = "";

                if (!res.success || res.data.length === 0) {
                    tableBody.innerHTML =
                        `<tr><td colspan="6">ไม่พบข้อมูล</td></tr>`;
                    return;
                }

                res.data.forEach((item: any) => {

                    const tr = document.createElement("tr");

                    tr.innerHTML = `
                        <td>${item.instance_code}</td>
                        <td>${item.name}</td>
                        <td>${item.category_name}</td>
                        <td>${item.branch_name}</td>
                        <td>${renderStatus(item.status)}</td>
                        <td>${item.price_per_unit} บาท</td>
                    `;

                    tableBody.appendChild(tr);
                });

            });
    }

    // ===============================
    // STATUS RENDER
    // ===============================
    function renderStatus(status: string) {

        switch (status) {

            case "Ready":
                return `<span class="status-badge status-ready">พร้อมใช้งาน</span>`;

            case "Rented":
                return `<span class="status-badge status-inuse">กำลังใช้งาน</span>`;

            case "Maintenance":
                return `<span class="status-badge status-maintenance">บำรุงรักษา</span>`;

            case "Lost":
                return `<span class="status-badge status-lost">สูญหาย</span>`;

            case "Expired":
                return `<span class="status-badge status-expired">หมดอายุ</span>`;

            default:
                return status;
        }
    }

});
