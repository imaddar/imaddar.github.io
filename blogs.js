(function () {
  const BLOG_POSTS = {
    "weekly-mini": [
      // {
      //   title: "Blog Title",
      //   summary: "Sentence long summary.",
      //   date: "YYYY-MM-DD",
      //   tag: "Tag",
      //   href: "blog link"
      // }
    ],
    full: [
      // {
      //   title: "Blog Title",
      //   summary: "Sentence long summary.",
      //   date: "YYYY-MM-DD",
      //   tag: "Tag",
      //   href: "blog link"
      // }
    ]
  };

  const DEFAULT_FILTER = "weekly-mini";
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const panel = document.getElementById("blog-panel");
  const description = document.getElementById("blog-browser-description");
  const tabsContainer = document.querySelector(".blog-tabs");
  const indicator = document.querySelector(".blog-tab-indicator");
  const list = document.getElementById("blog-list");
  const emptyMessage = document.getElementById("blog-list-empty");
  const tabs = Array.from(document.querySelectorAll("[data-blog-filter]"));

  if (!panel || !list || !tabs.length) {
    return;
  }

  function formatDate(dateString) {
    try {
      return dateFormatter.format(new Date(dateString));
    } catch (error) {
      return dateString;
    }
  }

  function moveIndicator(targetTab) {
    if (!indicator || !tabsContainer || !targetTab) {
      return;
    }

    const containerRect = tabsContainer.getBoundingClientRect();
    const tabRect = targetTab.getBoundingClientRect();
    const offset = tabRect.left - containerRect.left;

    indicator.style.width = `${tabRect.width}px`;
    indicator.style.transform = `translateX(${offset}px)`;
  }

  function updateDescription(targetTab) {
    if (!description || !targetTab) {
      return;
    }

    if (!description.dataset.defaultCopy) {
      description.dataset.defaultCopy = description.textContent.trim();
    }

    const nextDescription = targetTab.dataset.blogDescription || description.dataset.defaultCopy;
    description.textContent = nextDescription;
  }

  function setActiveTab(filter) {
    let activeTab = null;
    tabs.forEach((tab) => {
      const isActive = tab.dataset.blogFilter === filter;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && tab.id) {
        panel.setAttribute("aria-labelledby", tab.id);
        activeTab = tab;
      }
    });
    moveIndicator(activeTab);
    updateDescription(activeTab);
  }

  function renderList(filter) {
    const posts = BLOG_POSTS[filter] || [];
    list.innerHTML = "";
    panel.setAttribute("data-active-filter", filter);

    if (!posts.length) {
      emptyMessage.hidden = false;
      return;
    }

    emptyMessage.hidden = true;
    const fallbackTag = filter === "weekly-mini" ? "Weekly Mini" : "Full essay";
    const fragment = document.createDocumentFragment();

    posts.forEach((post) => {
      const li = document.createElement("li");
      li.className = "blog-card";
      const readableDate = post.date ? formatDate(post.date) : "Drafting";
      const dateAttribute = post.date ? ` datetime="${post.date}"` : "";
      const tagLabel = post.tag || fallbackTag;
      const summary = post.summary || "More details soon.";
      const cta = post.readLength || "Read post";
      const href = post.href || "#";

      li.innerHTML = `
        <a class="blog-card-link" href="${href}">
          <div class="blog-card-meta">
            <span class="blog-card-tag">${tagLabel}</span>
            <time class="blog-card-date"${dateAttribute}>${readableDate}</time>
          </div>
          <h3 class="blog-card-title">${post.title || "Untitled"}</h3>
          <p class="blog-card-summary">${summary}</p>
          <span class="blog-card-cta">${cta}</span>
        </a>
      `;

      fragment.appendChild(li);
    });

    list.appendChild(fragment);
  }

  function handleTabClick(event) {
    const button = event.currentTarget;
    const filter = button.dataset.blogFilter;

    if (!filter) return;
    if (panel.getAttribute("data-active-filter") === filter) return;

    setActiveTab(filter);
    renderList(filter);
  }

  tabs.forEach((tab) => tab.addEventListener("click", handleTabClick));
  window.addEventListener("resize", () => {
    const active = tabs.find((tab) => tab.classList.contains("is-active"));
    moveIndicator(active);
  });

  setActiveTab(DEFAULT_FILTER);
  renderList(DEFAULT_FILTER);
})();
