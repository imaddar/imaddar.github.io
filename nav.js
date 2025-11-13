(() => {
  const STORAGE_KEY = "imad-theme";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === "light" || value === "dark") {
        return value;
      }
      return null;
    } catch (_) {
      return null;
    }
  };

  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // Ignore storage failures (private mode, etc.)
    }
  };

  const applyTheme = (theme) => {
    document.body.classList.toggle("theme-dark", theme === "dark");
    document.body.classList.toggle("theme-light", theme !== "dark");
  };

  let manualTheme = getStoredTheme();
  let currentTheme =
    manualTheme || (mediaQuery.matches ? "dark" : "light");
  const toggleButtons = new Set();

  const updateToggleUI = (theme) => {
    toggleButtons.forEach((button) => {
      const isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
      const labelNode = button.querySelector(".theme-toggle__label");
      if (labelNode) {
        labelNode.textContent = isDark
          ? "Switch to light mode"
          : "Switch to dark mode";
      }
    });
  };

  const handleSystemChange = (event) => {
    if (manualTheme !== null) return;
    currentTheme = event.matches ? "dark" : "light";
    applyTheme(currentTheme);
    updateToggleUI(currentTheme);
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemChange);
  }

  applyTheme(currentTheme);

  const handleToggleClick = () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    manualTheme = currentTheme;
    setStoredTheme(currentTheme);
    applyTheme(currentTheme);
    updateToggleUI(currentTheme);
  };

  const placeholders = document.querySelectorAll(
    '[data-component="site-header"]',
  );
  if (!placeholders.length) return;

  const links = [
    { href: "index.html", label: "Home" },
    { href: "experience.html", label: "Experience" },
    { href: "projects.html", label: "Projects" },
    { href: "blogs.html", label: "Blogs" },
  ];

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/imad-dar/",
      label: "LinkedIn",
    },
    {
      href: "https://github.com/imaddar",
      label: "GitHub",
    },
  ];

  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const createHeader = (subtitle) => {
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
      <button
        type="button"
        class="theme-toggle"
        aria-pressed="false"
        aria-label="Toggle color theme"
      >
        <img
          src="light-dark.svg"
          alt=""
          aria-hidden="true"
          class="theme-toggle-icon"
        />
        <span class="theme-toggle__label sr-only"></span>
      </button>
      <h1 class="site-title">Imad Dar</h1>
      <p class="site-subtitle">${subtitle || "CU Boulder"}</p>
      <div class="site-nav-row">
        <nav>
          ${links
            .map((link) => {
              const isActive =
                link.allowHash && currentPath === "index.html"
                  ? false
                  : link.href.replace("#contact", "") === currentPath;
              return `<a href="${link.href}"${
                isActive ? ' class="active"' : ""
              }>${link.label}</a>`;
            })
            .join("")}
        </nav>
        <div class="nav-social">
          ${socialLinks
            .map(
              (link) => `
                <a href="${link.href}" target="_blank" rel="noreferrer">
                  ${link.label}
                </a>
              `.trim(),
            )
            .join("")}
        </div>
      </div>
    `;
    return header;
  };

  placeholders.forEach((node) => {
    const subtitle = node.dataset.subtitle;
    const header = createHeader(subtitle);
    node.replaceWith(header);
    const button = header.querySelector(".theme-toggle");
    if (button && !toggleButtons.has(button)) {
      toggleButtons.add(button);
      button.addEventListener("click", handleToggleClick);
      updateToggleUI(currentTheme);
    }
  });
})();
