interface HistoryItem {
    booking_id: string;
    customer_name: string;
    finished_at: string;
    net_amount: number;
    status_type: string;
}

var allHistory: HistoryItem[] = [];

document.addEventListener("DOMContentLoaded", function () {
    loadHistory();
    bindFilters();
});

/* ================= LOAD ================= */

function loadHistory() {

    fetch("/sports_rental_system/staff/api/get_booking_history.php", {
        credentials: "include"
    })
    .then(function (r) { return r.json(); })
    .then(function (res) {

        if (!res.success) {
            renderEmpty("ไม่พบข้อมูล");
            return;
        }

        allHistory = res.data || [];
        applyFilters();
    })
    .catch(function () {
        renderEmpty("โหลดข้อมูลไม่สำเร็จ");
    });
}

/* ================= BIND FILTERS ================= */

function bindFilters() {

    var searchEl = document.getElementById("searchInput");
    var startEl  = document.getElementById("startDate");
    var endEl    = document.getElementById("endDate");
    var typeEl   = document.getElementById("typeFilter");
    var resetBtn = document.getElementById("resetFilterBtn");

    if (searchEl) {
        searchEl.addEventListener("input", applyFilters);
    }

    if (startEl) {
        startEl.addEventListener("change", applyFilters);
    }

    if (endEl) {
        endEl.addEventListener("change", applyFilters);
    }

    if (typeEl) {
        typeEl.addEventListener("change", applyFilters);
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {

            (document.getElementById("searchInput") as HTMLInputElement).value = "";
            (document.getElementById("startDate") as HTMLInputElement).value = "";
            (document.getElementById("endDate") as HTMLInputElement).value = "";
            (document.getElementById("typeFilter") as HTMLSelectElement).value = "ALL";

            applyFilters();
        });
    }
}

/* ================= APPLY FILTER ================= */

function applyFilters() {

    var search =
        ((document.getElementById("searchInput") as HTMLInputElement)?.value || "")
        .toLowerCase();

    var start =
        (document.getElementById("startDate") as HTMLInputElement)?.value || "";

    var end =
        (document.getElementById("endDate") as HTMLInputElement)?.value || "";

    var type =
        (document.getElementById("typeFilter") as HTMLSelectElement)?.value || "ALL";

    var list = allHistory.slice();

    /* ========= SEARCH ========= */
    if (search) {
        list = list.filter(function (item) {

            var bookingMatch =
                item.booking_id.toLowerCase().indexOf(search) !== -1;

            var nameMatch =
                item.customer_name.toLowerCase().indexOf(search) !== -1;

            return bookingMatch || nameMatch;
        });
    }

    /* ========= TYPE ========= */
    if (type !== "ALL") {
        list = list.filter(function (item) {
            return item.status_type === type;
        });
    }

    /* ========= DATE RANGE ========= */
    if (start) {
        list = list.filter(function (item) {
            return item.finished_at >= start;
        });
    }

    if (end) {
        list = list.filter(function (item) {
            return item.finished_at <= end;
        });
    }

    renderTable(list);
}

/* ================= RENDER TABLE ================= */

function renderTable(list: HistoryItem[]) {

    var tbody =
        document.getElementById("historyTable") as HTMLElement;

    if (!tbody) return;

    if (list.length === 0) {
        renderEmpty("ไม่มีรายการ");
        return;
    }

    var html = "";

    list.forEach(function (item) {

        var badge = "";

        if (item.status_type === "COMPLETED") {
            badge =
                '<span class="badge complete">คืนอุปกรณ์สำเร็จ</span>';
        } else if (item.status_type === "REFUNDED") {
            badge =
                '<span class="badge refunded">คืนเงินสำเร็จ</span>';
        }

        html +=
            "<tr>" +
                "<td>" + item.booking_id + "</td>" +
                "<td>" + item.customer_name + "</td>" +
                "<td>" + item.finished_at + "</td>" +
                "<td>" + item.net_amount + " บาท</td>" +
                "<td>" + badge + "</td>" +
            "</tr>";
    });

    tbody.innerHTML = html;
}

/* ================= EMPTY ================= */

function renderEmpty(text: string) {

    var tbody =
        document.getElementById("historyTable") as HTMLElement;

    if (!tbody) return;

    tbody.innerHTML =
        "<tr>" +
            "<td colspan='5' class='empty-row'>" + text + "</td>" +
        "</tr>";
}
