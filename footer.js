(() => {
  const footerConfigs = {
    home: {
      body: '"the highest form of pure thought is in mathematics."',
      note: `— Plato`,
    },
  };

  const DEFAULT_VARIANT = "home";

  const createFooter = (config) => {
    const { kicker, heading, body, note } = config;
    return `
      <p>${body}</p>
      <p class="footer-note">${note}</p>
    `;
  };

  document.querySelectorAll('[data-component="site-footer"]').forEach((footer) => {
    const variant = footer.dataset.variant || DEFAULT_VARIANT;
    const config = footerConfigs[variant] || footerConfigs[DEFAULT_VARIANT];
    footer.innerHTML = createFooter(config);
  });
})();
