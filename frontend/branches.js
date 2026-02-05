document.addEventListener("DOMContentLoaded", () => {

  const provinceBox = document.getElementById("province-filter");
  const branchList = document.getElementById("branch-list");
  const branchCount = document.getElementById("branch-count");
  const resetBtn = document.getElementById("resetFilter");
  const searchInput = document.getElementById("searchInput");

  let allProvinces = [];
  let provinceExpanded = false;

  // =============================
  // LOAD REGIONS
  // =============================
  fetch("/sports_rental_system/api/get_region.php")
    .then(res => res.json())
    .then(data => {

      const regionBox = document.getElementById("region-filter");

      regionBox.innerHTML = `
        <strong>ภูมิภาค</strong>
        <label>
          <input type="radio" name="region" value="all" checked>
          ทุกภูมิภาค
        </label>
      `;

      data.forEach(r => {
        regionBox.innerHTML += `
          <label>
            <input type="radio" name="region" value="${r.region_id}">
            ${r.region_name}
          </label>
        `;
      });

    });

  // =============================
  // LOAD PROVINCES
  // =============================
  function loadProvinces(regionId) {

    fetch(`/sports_rental_system/api/get_provinces.php?region=${regionId}`)
      .then(res => res.json())
      .then(data => {
        allProvinces = data;
        provinceExpanded = false;
        renderProvinces();
      });
  }

  function renderProvinces() {

    provinceBox.innerHTML = `
      <strong>จังหวัด</strong>
      <label>
        <input type="radio" name="province" value="all" checked>
        ทุกจังหวัด
      </label>
    `;

    const list = provinceExpanded
      ? allProvinces
      : allProvinces.slice(0, 10);

    list.forEach(p => {
      provinceBox.innerHTML += `
        <label>
          <input type="radio" name="province" value="${p.province_id}">
          ${p.name}
        </label>
      `;
    });

    if (allProvinces.length > 10 && !provinceExpanded) {

      const btn = document.createElement("button");
      btn.textContent = "แสดงเพิ่มเติม";
      btn.className = "show-more-btn";

      btn.onclick = () => {
        provinceExpanded = true;
        renderProvinces();
      };

      provinceBox.appendChild(btn);
    }
  }

  // =============================
  // LOAD BRANCHES
  // =============================
  function loadBranches() {

    const region =
      document.querySelector("input[name=region]:checked")?.value || "all";

    const province =
      document.querySelector("input[name=province]:checked")?.value || "all";

    fetch(
      `/sports_rental_system/api/get_branches.php?region=${region}&province=${province}`
    )
      .then(res => res.json())
      .then(data => {

        branchList.innerHTML = "";
        branchCount.textContent = data.length;

        data.forEach(b => {

          const card = document.createElement("div");
          card.className = "branch-card";

          card.innerHTML = `
            <div class="branch-info">
              <div class="branch-icon">📍</div>
              <div>
                <strong>${b.name}</strong><br>
                <small>${b.province_name} (${b.region_name})</small>

                <div class="badges">
                  <span class="time">
                    ${b.open_time} - ${b.close_time}
                  </span>
                </div>
              </div>
            </div>

            <div class="arrow">›</div>
          `;

          // ✅ SELECT BRANCH
          card.addEventListener("click", async () => {

            const res = await fetch(
              "/sports_rental_system/api/select_branch.php",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                  branch_id: b.branch_id
                })
              }
            );

            const result = await res.json();

            if (result.success) {
              window.location.href = "index.html";
            } else {
              alert(result.message);
            }

          });

          branchList.appendChild(card);

        });

      });
  }

  // =============================
  // EVENTS
  // =============================
  document.addEventListener("change", e => {

    if (e.target.name === "region") {
      loadProvinces(e.target.value);
      loadBranches();
    }

    if (e.target.name === "province") {
      loadProvinces(e.target.value);
      loadBranches();
    }

  });

  // SEARCH
  searchInput.addEventListener("input", e => {

    const q = e.target.value.toLowerCase();

    document.querySelectorAll(".branch-card").forEach(card => {

      card.style.display =
        card.textContent.toLowerCase().includes(q)
          ? "flex"
          : "none";

    });

  });

  // RESET
  resetBtn.addEventListener("click", () => {

    document.querySelector(
      "input[name=region][value='all']"
    ).checked = true;

    loadProvinces("all");
    loadBranches();

  });

  // =============================
  // INIT
  // =============================
  loadProvinces("all");
  loadBranches();

});
