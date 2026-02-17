interface EquipmentItem {
  instance_code: string;
  name: string;
  category_name: string;
  branch_name: string;
  status: string;
  price_per_unit: number;
  expiry_date: string;
}

document.addEventListener("DOMContentLoaded", () => {

  const tableBody =
    document.getElementById("equipmentTableBody") as HTMLTableSectionElement;

  const branchLabel =
    document.getElementById("selectedBranch") as HTMLElement | null;

  const searchInput =
    document.getElementById("searchInput") as HTMLInputElement;

  const statusFilter =
    document.getElementById("statusFilter") as HTMLSelectElement;

  const categoryFilter =
    document.getElementById("categoryFilter") as HTMLSelectElement;

  const expiryFilter =
    document.getElementById("expiryFilter") as HTMLSelectElement;

  const minPriceInput =
    document.getElementById("minPrice") as HTMLInputElement;

  const maxPriceInput =
    document.getElementById("maxPrice") as HTMLInputElement;

  const sortFilter =
    document.getElementById("sortFilter") as HTMLSelectElement;

  const resetBtn =
    document.getElementById("resetFilters") as HTMLButtonElement;

  const totalCount =
    document.getElementById("totalCount") as HTMLElement;

  if (!tableBody) return;

  /* =========================
     SESSION CHECK
  ========================= */

  fetch("/sports_rental_system/warehouse/api/check_session.php", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {

      if (!data.success) {
        window.location.href = "login.html";
        return;
      }

      if (branchLabel && data.branch_name) {
        branchLabel.textContent = data.branch_name;
      }

      loadCategories();
      loadEquipment();
    });

  /* =========================
     LOAD CATEGORIES
  ========================= */

  function loadCategories(): void {

    fetch("/sports_rental_system/warehouse/api/get_categories.php", {
      credentials: "include"
    })
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
  }

  /* =========================
     LOAD EQUIPMENT
  ========================= */

  function loadEquipment(): void {

    const params = new URLSearchParams();

    if (searchInput.value.trim())
      params.set("q", searchInput.value.trim());

    if (statusFilter.value)
      params.set("status", statusFilter.value);

    if (categoryFilter.value)
      params.set("category_id", categoryFilter.value);

    if (expiryFilter.value)
      params.set("expiry", expiryFilter.value);

    if (minPriceInput.value)
      params.set("min_price", minPriceInput.value);

    if (maxPriceInput.value)
      params.set("max_price", maxPriceInput.value);

    if (sortFilter.value)
      params.set("sort", sortFilter.value);

    tableBody.innerHTML =
      `<tr><td colspan="8">กำลังโหลด...</td></tr>`;

    fetch(
      "/sports_rental_system/warehouse/api/get_equipment_list.php?"
      + params.toString(),
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(res => {

        tableBody.innerHTML = "";

        if (!res.success || !res.data || !res.data.length) {
          tableBody.innerHTML =
            `<tr><td colspan="8">ไม่พบข้อมูล</td></tr>`;
          totalCount.textContent = "0";
          return;
        }

        totalCount.textContent = res.data.length;

        res.data.forEach((item: EquipmentItem) => {

          const state = getExpiryState(item.expiry_date);

          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${item.instance_code}</td>
            <td>${item.name}</td>
            <td>${item.category_name}</td>
            <td>${renderStatus(item.status)}</td>
            <td>${item.price_per_unit} บาท</td>
            <td class="${state}">
              ${formatDate(item.expiry_date)}
            </td>
            <td>
              ${renderActionButton(item, state)}
            </td>
          `;

          tableBody.appendChild(row);
        });
      });
  }

  /* =========================
     EXPIRY STATE
  ========================= */

  function getExpiryState(dateStr: string): string {

    const today = new Date();
    const expiry = new Date(dateStr);

    today.setHours(0,0,0,0);
    expiry.setHours(0,0,0,0);

    const diffDays =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return "expired";
    if (diffDays <= 30) return "warning";

    return "";
  }

  function renderActionButton(item: EquipmentItem, state: string): string {

    if (state === "expired" && item.status === "Ready") {
      return `
        <button class="btn-expired"
          data-code="${item.instance_code}">
          ยืนยันหมดอายุ
        </button>
      `;
    }

    return "-";
  }

  tableBody.addEventListener("click", (e) => {

    const target = e.target as HTMLElement;

    if (target.classList.contains("btn-expired")) {

      const code = target.dataset.code;
      if (!code) return;

      if (!confirm("ยืนยันการหมดอายุของอุปกรณ์?")) return;

      fetch("/sports_rental_system/warehouse/api/mark_expired.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_code: code })
      })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          alert("ไม่สามารถอัปเดตได้");
          return;
        }
        loadEquipment();
      });
    }
  });

  /* =========================
     STATUS RENDER
  ========================= */

  function renderStatus(status: string): string {

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

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("th-TH");
  }

  /* =========================
     FILTER EVENTS
  ========================= */

  searchInput.addEventListener("input", loadEquipment);
  statusFilter.addEventListener("change", loadEquipment);
  categoryFilter.addEventListener("change", loadEquipment);
  expiryFilter.addEventListener("change", loadEquipment);
  minPriceInput.addEventListener("input", loadEquipment);
  maxPriceInput.addEventListener("input", loadEquipment);
  sortFilter.addEventListener("change", loadEquipment);

  resetBtn.addEventListener("click", () => {

    searchInput.value = "";
    statusFilter.value = "";
    categoryFilter.value = "";
    expiryFilter.value = "";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortFilter.value = "";

    loadEquipment();
  });

});
