const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuWr3Odo4JD3UKPeHOzueuqQSQ5NSSR4Z9W33J97Xon_QM8PPOXIewB2Wvb4sa6JLbtW0jAWF9fyvL/pub?output=csv";

fetch(SHEET_URL)
  .then((res) => res.text())
  .then((csv) => {
    const rows = csv.split("\n").slice(1);
    const container = document.getElementById("experiment-list");

    let hasData = false;
    let currentViewer = null; // iframe đang mở
    let count = 0;

    rows.forEach((row) => {
      if (!row.trim()) return;

      const cols = row.split(",");
      const active = cols[0]?.trim().toUpperCase();
      const title = cols[1]?.trim();
      const iframeUrl = cols[2]?.trim();

      if (active === "TRUE" && iframeUrl) {
        hasData = true;
        count++;

        const item = document.createElement("div");
        item.className = "experiment";

        item.innerHTML = `
          <h2>${count}. ${title}</h2>
          <button class="open-btn">Mở thí nghiệm</button>
        `;

        const button = item.querySelector("button");

        button.addEventListener("click", () => {
          // Nếu đang mở cùng bài → đóng lại
          if (currentViewer && currentViewer.dataset.url === iframeUrl) {
            currentViewer.remove();
            currentViewer = null;

            button.textContent = "Mở thí nghiệm";
            button.classList.remove("active");
            return;
          }

          // Xoá iframe cũ nếu có
          if (currentViewer) {
            document.querySelectorAll(".open-btn").forEach((btn) => {
              btn.textContent = "Mở thí nghiệm";
              btn.classList.remove("active");
            });

            currentViewer.remove();
          }

          const viewer = document.createElement("div");
          viewer.className = "viewer";
          viewer.dataset.url = iframeUrl;

          viewer.innerHTML = `
            <div class="responsive-iframe">
              <iframe src="${iframeUrl}" loading="lazy"></iframe>
            </div>
          `;

          item.appendChild(viewer);
          currentViewer = viewer;

          button.textContent = "Đóng thí nghiệm";
          button.classList.add("active");

          // Scroll nhẹ xuống cho đẹp
          viewer.scrollIntoView({ behavior: "smooth" });
        });

        container.appendChild(item);
      }
    });

    if (!hasData) {
      container.innerHTML = "<p>Hiện chưa có thí nghiệm nào được bật.</p>";
    }
  })
  .catch(() => {
    document.getElementById("experiment-list").innerHTML =
      "<p>Không tải được dữ liệu.</p>";
  });
