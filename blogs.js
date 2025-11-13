(function () {
  const BLOG_POSTS = {
    "weekly-mini": [
      {
        title: "Week 07 · Debugging routers at 2 a.m.",
        summary:
          "Snapshot from the field while we hustled to bring a privacy-first hotspot back to life before a campus trip.",
        date: "2024-12-06",
        readLength: "4 min read",
        tag: "Prototype log",
        href: "blogs/weekly-mini/week-07-field-notes.html"
      },
      {
        title: "Week 08 · Pencil math for faster grant reviews",
        summary:
          "Mini-post on the heuristics I'm testing to decide if a student hardware grant is a YES in under ten minutes.",
        date: "2024-12-13",
        readLength: "3 min read",
        tag: "Mentorship",
        href: "blogs/weekly-mini/week-08-grants.html"
      },
      {
        title: "Week 09 · Shipping delight into onboarding emails",
        summary:
          "Three tiny experiments that made Blueprint Boulder volunteer onboarding way more human.",
        date: "2024-12-20",
        readLength: "5 min read",
        tag: "Ops",
        href: "blogs/weekly-mini/week-09-onboarding.html"
      }
    ],
    full: [
      {
        title: "The calm workbench: designing routers students can trust",
        summary:
          "A long-form teardown of the constraints, trade-offs, and moments of luck while building a low-cost secure router.",
        date: "2024-11-10",
        readLength: "11 min read",
        tag: "Hardware build",
        href: "blogs/full/calm-workbench.html"
      },
      {
        title: "Learning loops from Blueprint Boulder",
        summary:
          "What two years of mentoring nonprofit software teams taught me about pacing, kindness, and momentum.",
        date: "2024-10-05",
        readLength: "13 min read",
        tag: "Playbook",
        href: "blogs/full/blueprint-learning-loops.html"
      }
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
