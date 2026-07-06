/* Home page: render notes.json with search, category filter, zh/en toggle. */
(function () {
  const I18N = {
    zh: {
      siteTitle: "我的知識庫",
      searchPlaceholder: "搜尋筆記…",
      empty: "未有符合嘅筆記",
      footer: "用 HTML 寫筆記 · S3 + CloudFront · GitHub Actions 自動部署",
      all: "全部",
      toggleLabel: "EN",
      categories: {
        web3: "Web3",
        defi: "DeFi",
        crypto: "Crypto",
        investing: "投資",
        tech: "Tech",
        deployment: "Deployment"
      }
    },
    en: {
      siteTitle: "My Knowledge Base",
      searchPlaceholder: "Search notes…",
      empty: "No matching notes",
      footer: "Notes in HTML · S3 + CloudFront · deployed via GitHub Actions",
      all: "All",
      toggleLabel: "中文",
      categories: {
        web3: "Web3",
        defi: "DeFi",
        crypto: "Crypto",
        investing: "Investing",
        tech: "Tech",
        deployment: "Deployment"
      }
    }
  };

  let lang = localStorage.getItem("kb-lang") || "zh";
  let notes = [];
  let activeCategory = "all";
  let query = "";

  const $ = (sel) => document.querySelector(sel);

  function t(key) {
    return I18N[lang][key] || key;
  }

  function categoryLabel(cat) {
    return I18N[lang].categories[cat] || cat;
  }

  function applyI18n() {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    $("#lang-toggle").textContent = t("toggleLabel");
  }

  function noteHref(note) {
    // Prefer the current UI language; fall back to whatever the note has.
    const noteLang = note.langs.includes(lang) ? lang : note.langs[0];
    return note.path + "." + noteLang + ".html";
  }

  function matches(note) {
    if (activeCategory !== "all" && note.category !== activeCategory) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    const haystack = [
      note.title.zh || "",
      note.title.en || "",
      note.category,
      (note.tags || []).join(" ")
    ].join(" ").toLowerCase();
    return haystack.includes(q);
  }

  function renderCategories() {
    const cats = ["all", ...new Set(notes.map((n) => n.category))];
    const box = $("#categories");
    box.innerHTML = "";
    cats.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat === "all" ? t("all") : categoryLabel(cat);
      btn.addEventListener("click", () => {
        activeCategory = cat;
        render();
      });
      box.appendChild(btn);
    });
  }

  function renderNotes() {
    const list = $("#note-list");
    list.innerHTML = "";
    const visible = notes.filter(matches)
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    $("#empty").hidden = visible.length > 0;

    visible.forEach((note) => {
      const card = document.createElement("a");
      card.className = "note-card";
      card.href = noteHref(note);

      const title = document.createElement("p");
      title.className = "title";
      title.textContent = note.title[lang] || note.title.zh || note.title.en;

      const meta = document.createElement("div");
      meta.className = "meta";

      const cat = document.createElement("span");
      cat.className = "badge";
      cat.textContent = categoryLabel(note.category);
      meta.appendChild(cat);

      if (note.date) {
        const date = document.createElement("span");
        date.textContent = note.date;
        meta.appendChild(date);
      }

      (note.tags || []).forEach((tg) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tg;
        meta.appendChild(tag);
      });

      card.appendChild(title);
      card.appendChild(meta);
      list.appendChild(card);
    });
  }

  function render() {
    applyI18n();
    renderCategories();
    renderNotes();
  }

  $("#lang-toggle").addEventListener("click", () => {
    lang = lang === "zh" ? "en" : "zh";
    localStorage.setItem("kb-lang", lang);
    render();
  });

  $("#search").addEventListener("input", (e) => {
    query = e.target.value.trim();
    renderNotes();
  });

  fetch("notes.json")
    .then((res) => res.json())
    .then((data) => {
      notes = data.notes || [];
      render();
    })
    .catch((err) => {
      $("#empty").hidden = false;
      $("#empty").textContent = "Failed to load notes.json: " + err.message;
    });
})();
