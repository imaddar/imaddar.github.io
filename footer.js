(() => {
  const currentYear = new Date().getFullYear();

  const footerConfigs = {
    home: {
      kicker: "Field note",
      heading: "A sample quote goes here",
      body: '"I will swap this with my favorite quote later."',
      note: `— Imad Dar, ${currentYear}`,
    },
  };

  const DEFAULT_VARIANT = "home";

  const createFooter = (config) => {
    const { kicker, heading, body, note } = config;
    return `
      <p class="footer-kicker">${kicker}</p>
      <h2 class="footer-heading">${heading}</h2>
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
