(function () {
  var accentMap = { dark: "#5BD8E8", light: "#156B7A" };

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    document.documentElement.style.setProperty("--accent", accentMap[theme]);
    try { localStorage.setItem("tt_theme", theme); } catch (e) {}
  }

  // Apply saved theme before first paint (body already has data-theme="dark" as fallback)
  var theme = "dark";
  try {
    var saved = localStorage.getItem("tt_theme");
    if (saved === "light" || saved === "dark") theme = saved;
  } catch (e) {}
  applyTheme(theme);

  function sunIcon() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  }
  function moonIcon() {
    return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  function updateThemeBtn(theme) {
    var btn = document.querySelector(".nav__theme");
    if (!btn) return;
    btn.innerHTML = theme === "dark" ? sunIcon() : moonIcon();
    btn.title = theme === "dark" ? "Switch to light" : "Switch to dark";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var currentTheme = document.body.dataset.theme || "dark";
    updateThemeBtn(currentTheme);

    var themeBtn = document.querySelector(".nav__theme");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = document.body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(next);
        updateThemeBtn(next);
      });
    }

    // Mobile menu
    var menuBtn = document.querySelector(".nav__menu-btn");
    var nav = document.querySelector(".nav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        menuBtn.textContent = open ? "✕" : "☰";
      });
      nav.querySelectorAll(".nav__link, .nav__portfolio, .nav__cta, .nav__brand").forEach(function (el) {
        el.addEventListener("click", function () {
          nav.classList.remove("open");
          if (menuBtn) menuBtn.textContent = "☰";
        });
      });
    }

    // Scroll-reveal
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = Array.from(document.querySelectorAll("section.section, section.contact"));
    var footerEl = document.querySelector(".footer");
    var allTargets = footerEl ? sections.concat([footerEl]) : sections;
    if (reduce || !("IntersectionObserver" in window)) {
      allTargets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    function revealCallback(entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }
    // Sections: -12% rootMargin so they reveal after scrolling a bit past the edge
    var sectionIo = new IntersectionObserver(revealCallback, { rootMargin: "0px 0px -12% 0px", threshold: 0 });
    // Footer: no rootMargin — it sits flush at the page bottom and the -12% zone never reaches it
    var footerIo = new IntersectionObserver(revealCallback, { rootMargin: "0px", threshold: 0 });

    allTargets.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        el.classList.add("is-visible");
      } else {
        // Footer: skip translateY — sliding the footer up shifts page height and causes scroll judder
        if (el === footerEl) el.style.transform = "none";
        el.classList.add("reveal");
        (el === footerEl ? footerIo : sectionIo).observe(el);
      }
    });
  });
})();
