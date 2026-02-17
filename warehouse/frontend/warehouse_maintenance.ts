interface MaintenanceItem {
  log_id: number;
  instance_code: string;
  description: string | null;
  report_date: string;
  repair_cost?: number | null;
  damage_name_th: string;
  status_id: number;
  status_name_th: string;
}

document.addEventListener("DOMContentLoaded", () => {

  const tableBody =
    document.getElementById("warehouseList") as HTMLTableSectionElement | null;

  const branchLabel =
    document.getElementById("selectedBranch") as HTMLElement | null;

  const searchInput =
    document.getElementById("searchInput") as HTMLInputElement | null;

  const statusFilter =
    document.getElementById("statusFilter") as HTMLSelectElement | null;

  const damageFilter =
    document.getElementById("damageFilter") as HTMLSelectElement | null;

  const resetBtn =
    document.getElementById("resetFilters") as HTMLButtonElement | null;

  if (!tableBody) return;

  let allData: MaintenanceItem[] = [];
  let currentLogId: string | null = null;
  let currentInstance: string | null = null;

  /* =========================
     MODAL
  ========================= */

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <h3>กรอกค่าซ่อม</h3>
      <input type="number" id="repairAmount" placeholder="จำนวนเงิน (บาท)" min="1">
      <div class="modal-actions">
        <button id="cancelModal">ยกเลิก</button>
        <button id="confirmRepair" class="btn-done">ยืนยัน</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const amountInput =
    modal.querySelector("#repairAmount") as HTMLInputElement;

  const cancelBtn =
    modal.querySelector("#cancelModal") as HTMLButtonElement;

  const confirmBtn =
    modal.querySelector("#confirmRepair") as HTMLButtonElement;

  function openModal(logId: string, instance: string): void {
    currentLogId = logId;
    currentInstance = instance;
    amountInput.value = "";
    modal.classList.add("active");
  }

  function closeModal(): void {
    modal.classList.remove("active");
    currentLogId = null;
    currentInstance = null;
  }

  cancelBtn.addEventListener("click", closeModal);

  /* =========================
     SESSION CHECK
  ========================= */

  fetch("/sports_rental_system/warehouse/api/check_session.php")
    .then(res => res.json())
    .then(data => {

      if (!data.success) {
        window.location.href = "login.html";
        return;
      }

      if (branchLabel && data.branch_name) {
        branchLabel.textContent = data.branch_name;
      }

      loadMaintenance();
    })
    .catch(() => {
      alert("ไม่สามารถตรวจสอบ session ได้");
    });

  /* =========================
     LOAD DATA
  ========================= */

  function loadMaintenance(): void {

    tableBody.innerHTML =
      `<tr><td colspan="6">กำลังโหลด...</td></tr>`;

    fetch("/sports_rental_system/warehouse/api/get_all_maintenance.php")
      .then(res => res.json())
      .then(res => {

        if (!res.success || !res.data) {
          tableBody.innerHTML =
            `<tr><td colspan="6">โหลดข้อมูลไม่สำเร็จ</td></tr>`;
          return;
        }

        allData = res.data;
        applyFilters();
      })
      .catch(() => {
        tableBody.innerHTML =
          `<tr><td colspan="6">เกิดข้อผิดพลาด</td></tr>`;
      });
  }

  /* =========================
     FILTER LOGIC
  ========================= */

  function applyFilters(): void {

    let filtered = allData.slice();

    const keyword = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const statusValue = statusFilter
      ? statusFilter.value
      : "";

    const damageValue = damageFilter
      ? damageFilter.value
      : "";

    if (keyword) {
      filtered = filtered.filter(item =>
        item.instance_code
          .toLowerCase()
          .indexOf(keyword) !== -1
      );
    }

    if (statusValue) {
      filtered = filtered.filter(item =>
        String(item.status_id) === statusValue
      );
    }

    if (damageValue) {
      filtered = filtered.filter(item =>
        item.damage_name_th === damageValue
      );
    }

    renderTable(filtered);
  }

  /* =========================
     RENDER TABLE
  ========================= */

  function renderTable(data: MaintenanceItem[]): void {

    tableBody.innerHTML = "";

    if (!data.length) {
      tableBody.innerHTML =
        `<tr><td colspan="6">ไม่พบข้อมูล</td></tr>`;
      return;
    }

    data.forEach(item => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.instance_code}</td>
        <td>${item.description ?? "-"}</td>
        <td>${item.report_date}</td>
        <td>${renderDamage(item.damage_name_th)}</td>
        <td>
          <span class="badge ${
            item.status_id === 1 ? "waiting" :
            item.status_id === 2 ? "progress" :
            item.status_id === 3 ? "done" : ""
          }">
            ${item.status_name_th ?? "-"}
          </span>
        </td>
        <td>
          ${
            item.status_id === 1
              ? `<button class="btn-start" data-id="${item.log_id}">
                  เริ่มซ่อม
                 </button>`
              : item.status_id === 2
              ? `<button class="btn-done"
                   data-id="${item.log_id}"
                   data-instance="${item.instance_code}">
                  ซ่อมเสร็จ
                 </button>`
              : "-"
          }
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  function renderDamage(damage: string): string {

  let damageClass = "";

  if (damage === "เล็กน้อย") {
    damageClass = "low";
  } else if (damage === "ปานกลาง") {
    damageClass = "medium";
  } else if (damage === "รุนแรง") {
    damageClass = "high";
  }

  return `<span class="badge ${damageClass}">
            ${damage ?? "-"}
          </span>`;
}

  /* =========================
     FILTER EVENTS
  ========================= */

  searchInput?.addEventListener("input", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);
  damageFilter?.addEventListener("change", applyFilters);

  resetBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (statusFilter) statusFilter.value = "";
    if (damageFilter) damageFilter.value = "";
    applyFilters();
  });

  /* =========================
     CLICK EVENTS
  ========================= */

  tableBody.addEventListener("click", (e) => {

    const target = e.target as HTMLElement;

    // เริ่มซ่อม
    if (target.classList.contains("btn-start")) {

      const logId = target.dataset.id;
      if (!logId) return;

      fetch("/sports_rental_system/warehouse/api/update_status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_id: logId,
          status_id: 2
        })
      })
      .then(res => res.json())
      .then(() => loadMaintenance());
    }

    // ซ่อมเสร็จ
    if (target.classList.contains("btn-done")) {

      const logId = target.dataset.id;
      const instance = target.dataset.instance;

      if (!logId || !instance) return;

      openModal(logId, instance);
    }

  });

  /* =========================
    COMPLETE REPAIR
  ========================= */

  confirmBtn.addEventListener("click", () => {

    if (!currentLogId || !currentInstance) {
      alert("ข้อมูลไม่ครบ");
      return;
    }

    const amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
      alert("กรุณากรอกค่าซ่อมให้ถูกต้อง");
      return;
    }

    fetch("/sports_rental_system/warehouse/api/complete_maintenance.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        log_id: currentLogId,
        instance_code: currentInstance,
        repair_cost: amount
      })
    })
    .then(res => res.json())
    .then(res => {

      if (!res.success) {
        alert("บันทึกค่าซ่อมไม่สำเร็จ");
        return;
      }

      closeModal();
      loadMaintenance();
    });
  });
});
