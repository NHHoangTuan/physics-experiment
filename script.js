const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuWr3Odo4JD3UKPeHOzueuqQSQ5NSSR4Z9W33J97Xon_QM8PPOXIewB2Wvb4sa6JLbtW0jAWF9fyvL/pub?output=csv";

fetch(SHEET_URL)
  .then((res) => res.text())
  .then((csv) => {
    const rows = csv.split("\n").slice(1);
    const container = document.getElementById("experiments");

    let hasData = false;

    rows.forEach((row) => {
      if (!row.trim()) return;

      const cols = row.split(",");

      const active = cols[0]?.trim().toUpperCase();
      const title = cols[1]?.trim();
      const iframeUrl = cols[2]?.trim();

      if (active === "TRUE" && iframeUrl) {
        hasData = true;

        container.innerHTML += `
                    <div class="experiment">
                        <h2>${title}</h2>
                        <div class="responsive-iframe">
                            <iframe src="${iframeUrl}"></iframe>
                        </div>
                    </div>
                `;
      }
    });

    if (!hasData) {
      container.innerHTML = "<p>Hiện chưa có thí nghiệm nào được bật.</p>";
    }
  })
  .catch(() => {
    document.getElementById("experiments").innerHTML =
      "<p>Không tải được dữ liệu.</p>";
  });
