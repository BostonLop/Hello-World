(function () {
  function header(isHome) {
    const workLink = isHome ? "#work" : "/#work";
    const aboutLink = isHome ? "#about" : "/#about";
    const contactLink = isHome ? "#contact" : "/#contact";

    return `
      <div class="container nav-wrap">
        <a class="brand" href="/">Sean Heffernan</a>
        <nav class="main-nav" aria-label="Primary">
          <a href="${workLink}">Work</a>
          <a href="${aboutLink}">About</a>
          <a href="/journal/">Journal</a>
          <a href="${contactLink}">Contact</a>
        </nav>
      </div>
    `;
  }

  function footer() {
    return `
      <div class="container footer-wrap">
        <p>© ${new Date().getFullYear()} Sean Heffernan. All rights reserved.</p>
      </div>
    `;
  }

  window.renderSiteShell = function renderSiteShell(options) {
    const isHome = Boolean(options && options.isHome);
    const headerRoot = document.getElementById("site-header");
    const footerRoot = document.getElementById("site-footer");

    if (headerRoot) {
      headerRoot.className = "site-header";
      headerRoot.innerHTML = header(isHome);
    }
    if (footerRoot) {
      footerRoot.className = "site-footer";
      footerRoot.innerHTML = footer();
    }
  };
})();
