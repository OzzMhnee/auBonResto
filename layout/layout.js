document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();

  loadHTML(
    "footer-container",
    "/layout/footer/footer.html",
    "/layout/footer/footer.css"
  );

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "home";
  const htmlPath = `/pages/${page}/${page}.html`;
  const cssPath = `/pages/${page}/${page}.css`;

  loadHTML("page-content", htmlPath, cssPath).then(() => {
    if (page === "details") {
      const script = document.createElement("script");
      script.src = "/pages/details/details.js";
      document.body.appendChild(script);
    }
  });

  window.addEventListener("resize", () => {
    loadNavbar();
  });
});

