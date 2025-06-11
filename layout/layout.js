document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();

  loadHTML(
    "footer-container",
    "/layout/footer/footer.html",
    "/layout/footer/footer.css"
  );

  loadHTML(
    "cookies-container",
    "/layout/cookies/cookies.html",
    "/layout/cookies/cookies.css"
  ).then(() => {
    const cookiesScript = document.createElement("script");
    cookiesScript.src = "/layout/cookies/cookies.js";
    document.body.appendChild(cookiesScript);
  });

  loadHTML(
    "back-to-top-container",
    "/layout/back-to-top/back-to-top.html",
    "/layout/back-to-top/back-to-top.css"
  ).then(() => {
    const backToTopScript = document.createElement("script");
    backToTopScript.src = "/layout/back-to-top/back-to-top.js";
    document.body.appendChild(backToTopScript);
  });

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || "home";
  const htmlPath = `/pages/${page}/${page}.html`;
  const cssPath = `/pages/${page}/${page}.css`;

  loadHTML("page-content", htmlPath, cssPath).then(() => {
    loadPageScript(page);
  });

  window.addEventListener("resize", () => {
    loadNavbar();
  });
});

function loadPageScript(page) {
  const scriptPath = `/pages/${page}/${page}.js`;

  const script = document.createElement("script");
  script.src = scriptPath;
  script.onload = () => {
    if (window.initializePage) {
      window.initializePage(page);
    }
  };

  document.body.appendChild(script);
}
