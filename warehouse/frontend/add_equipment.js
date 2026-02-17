document.addEventListener("DOMContentLoaded", function () {
    var categorySelect = document.getElementById("categorySelect");
    var equipmentSelect = document.getElementById("equipmentSelect");
    var form = document.getElementById("addForm");
    if (!categorySelect || !equipmentSelect || !form)
        return;
    var API_BASE = "/sports_rental_system/warehouse/api";
    /* ===============================
       LOAD CATEGORIES
    =============================== */
    fetch("".concat(API_BASE, "/get_categories.php"), {
        credentials: "include"
    })
        .then(function (res) {
        if (!res.ok)
            throw new Error("โหลดหมวดหมู่ไม่สำเร็จ");
        return res.json();
    })
        .then(function (res) {
        if (!res.success || !res.data)
            return;
        res.data.forEach(function (cat) {
            var opt = document.createElement("option");
            opt.value = cat.category_id;
            opt.textContent = cat.name;
            categorySelect.appendChild(opt);
        });
    })
        .catch(function (err) {
        console.error("Category Error:", err);
        alert("ไม่สามารถโหลดหมวดหมู่ได้");
    });
    /* ===============================
       LOAD EQUIPMENT MASTER
    =============================== */
    categorySelect.addEventListener("change", function () {
        var categoryId = categorySelect.value;
        equipmentSelect.innerHTML =
            "<option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C --</option>";
        if (!categoryId)
            return;
        fetch("".concat(API_BASE, "/get_equipment_master_by_category.php?category_id=").concat(categoryId), {
            credentials: "include"
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error("โหลดอุปกรณ์ไม่สำเร็จ");
            return res.json();
        })
            .then(function (res) {
            if (!res.success || !res.data)
                return;
            res.data.forEach(function (item) {
                var opt = document.createElement("option");
                opt.value = item.equipment_id;
                opt.textContent =
                    "".concat(item.equipment_id, " - ").concat(item.name);
                equipmentSelect.appendChild(opt);
            });
        })
            .catch(function (err) {
            console.error("Equipment Error:", err);
            alert("ไม่สามารถโหลดรายการอุปกรณ์ได้");
        });
    });
    /* ===============================
       SUBMIT FORM
    =============================== */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var equipmentId = equipmentSelect.value;
        var instanceCode = document.getElementById("instanceCode").value.trim();
        var receivedDate = document.getElementById("receivedDate").value;
        var expiryDate = document.getElementById("expiryDate").value;
        if (!equipmentId || !instanceCode || !receivedDate || !expiryDate) {
            alert("กรุณากรอกข้อมูลให้ครบ");
            return;
        }
        var payload = {
            equipment_id: equipmentId,
            instance_code: instanceCode,
            received_date: receivedDate,
            expiry_date: expiryDate
        };
        fetch("".concat(API_BASE, "/add_equipment_instance.php"), {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error("เพิ่มข้อมูลไม่สำเร็จ");
            return res.json();
        })
            .then(function (res) {
            if (!res.success) {
                alert(res.message || "เกิดข้อผิดพลาด");
                return;
            }
            alert("เพิ่มอุปกรณ์สำเร็จ");
            window.location.href = "management.html";
        })
            .catch(function (err) {
            console.error("Insert Error:", err);
            alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
        });
    });
});
