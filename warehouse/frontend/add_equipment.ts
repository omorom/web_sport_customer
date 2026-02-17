document.addEventListener("DOMContentLoaded", () => {

  const categorySelect =
    document.getElementById("categorySelect") as HTMLSelectElement;

  const equipmentSelect =
    document.getElementById("equipmentSelect") as HTMLSelectElement;

  const form =
    document.getElementById("addForm") as HTMLFormElement;

  if (!categorySelect || !equipmentSelect || !form) return;

  const API_BASE = "/sports_rental_system/warehouse/api";

  /* ===============================
     LOAD CATEGORIES
  =============================== */

  fetch(`${API_BASE}/get_categories.php`, {
    credentials: "include"
  })
    .then(res => {
      if (!res.ok) throw new Error("โหลดหมวดหมู่ไม่สำเร็จ");
      return res.json();
    })
    .then(res => {

      if (!res.success || !res.data) return;

      res.data.forEach((cat: any) => {

        const opt = document.createElement("option");
        opt.value = cat.category_id;
        opt.textContent = cat.name;

        categorySelect.appendChild(opt);
      });

    })
    .catch(err => {
      console.error("Category Error:", err);
      alert("ไม่สามารถโหลดหมวดหมู่ได้");
    });

  /* ===============================
     LOAD EQUIPMENT MASTER
  =============================== */

  categorySelect.addEventListener("change", () => {

    const categoryId = categorySelect.value;

    equipmentSelect.innerHTML =
      `<option value="">-- เลือกอุปกรณ์ --</option>`;

    if (!categoryId) return;

    fetch(`${API_BASE}/get_equipment_master_by_category.php?category_id=${categoryId}`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("โหลดอุปกรณ์ไม่สำเร็จ");
        return res.json();
      })
      .then(res => {

        if (!res.success || !res.data) return;

        res.data.forEach((item: any) => {

          const opt = document.createElement("option");
          opt.value = item.equipment_id;
          opt.textContent =
            `${item.equipment_id} - ${item.name}`;

          equipmentSelect.appendChild(opt);
        });

      })
      .catch(err => {
        console.error("Equipment Error:", err);
        alert("ไม่สามารถโหลดรายการอุปกรณ์ได้");
      });

  });

  /* ===============================
     SUBMIT FORM
  =============================== */

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const equipmentId = equipmentSelect.value;
    const instanceCode =
      (document.getElementById("instanceCode") as HTMLInputElement).value.trim();

    const receivedDate =
      (document.getElementById("receivedDate") as HTMLInputElement).value;

    const expiryDate =
      (document.getElementById("expiryDate") as HTMLInputElement).value;

    if (!equipmentId || !instanceCode || !receivedDate || !expiryDate) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const payload = {
      equipment_id: equipmentId,
      instance_code: instanceCode,
      received_date: receivedDate,
      expiry_date: expiryDate
    };

    fetch(`${API_BASE}/add_equipment_instance.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("เพิ่มข้อมูลไม่สำเร็จ");
        return res.json();
      })
      .then(res => {

        if (!res.success) {
          alert(res.message || "เกิดข้อผิดพลาด");
          return;
        }

        alert("เพิ่มอุปกรณ์สำเร็จ");
        window.location.href = "management.html";

      })
      .catch(err => {
        console.error("Insert Error:", err);
        alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      });

  });

});
