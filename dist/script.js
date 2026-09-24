/* ==========================================================================
   נורית כנורי – site behaviour
   - mobile navigation
   - accessibility widget (persisted in localStorage)
   - jobs rendering, filtering and search
   - contact form (opens the visitor's email client with a prepared message)
   ========================================================================== */
(function () {
  "use strict";

  var CV_EMAIL = "cb2@kinory.co.il";
  var INFO_EMAIL = "nurit@kinory.co.il";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     Accessibility widget
     ------------------------------------------------------------------ */
  var A11Y_KEY = "nk-a11y";
  var A11Y_CLASSES = {
    contrast: "a11y-contrast",
    links: "a11y-links",
    readable: "a11y-readable",
    motion: "a11y-no-motion",
    cursor: "a11y-cursor"
  };
  var FONT_STEPS = 3;

  function loadA11y() {
    try {
      var raw = window.localStorage.getItem(A11Y_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function saveA11y(state) {
    try {
      window.localStorage.setItem(A11Y_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage unavailable – settings apply for this page only */
    }
  }

  function applyA11y(state) {
    var body = document.body;
    Object.keys(A11Y_CLASSES).forEach(function (key) {
      body.classList.toggle(A11Y_CLASSES[key], !!state[key]);
    });
    var step = Math.max(0, Math.min(FONT_STEPS, state.font || 0));
    document.documentElement.style.setProperty("--font-scale", String(1 + step * 0.125));

    $all("[data-a11y]").forEach(function (btn) {
      var action = btn.getAttribute("data-a11y");
      if (A11Y_CLASSES[action]) {
        btn.setAttribute("aria-pressed", state[action] ? "true" : "false");
      }
      if (action === "font-up") btn.disabled = step >= FONT_STEPS;
      if (action === "font-down") btn.disabled = step <= 0;
    });
  }

  function initA11y() {
    var state = loadA11y();
    applyA11y(state);

    var toggle = $(".a11y-toggle");
    var panel = $(".a11y-panel");
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (open) {
        var first = $("button", panel);
        if (first) first.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
    });

    $("[data-a11y-close]", panel).addEventListener("click", function () {
      setOpen(false);
      toggle.focus();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (panel.hidden) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });

    $all("[data-a11y]", panel).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-a11y");
        if (action === "font-up") {
          state.font = Math.min(FONT_STEPS, (state.font || 0) + 1);
        } else if (action === "font-down") {
          state.font = Math.max(0, (state.font || 0) - 1);
        } else if (action === "reset") {
          state = {};
        } else if (A11Y_CLASSES[action]) {
          state[action] = !state[action];
        }
        saveA11y(state);
        applyA11y(state);
      });
    });
  }

  /* ------------------------------------------------------------------
     Jobs
     ------------------------------------------------------------------ */
  var ICON_PIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>';

  function categoryName(key) {
    var cats = window.NK_CATEGORIES || {};
    return cats[key] || key;
  }

  function jobCard(job, compact) {
    var reqs = (job.requirements || [])
      .map(function (r) {
        return "<li>" + escapeHtml(r) + "</li>";
      })
      .join("");

    var tags =
      '<span class="tag">' + escapeHtml(categoryName(job.category)) + "</span>" +
      (job.hybrid ? '<span class="tag tag--accent">אפשרות לעבודה היברידית</span>' : "");

    var details = compact
      ? ""
      : '<details><summary>דרישות התפקיד</summary><ul>' + reqs + "</ul></details>";

    var applyHref = "contact.html?job=" + encodeURIComponent(job.id);

    return (
      '<article class="job-card" data-category="' + escapeHtml(job.category) + '">' +
      '<div class="job-card__meta">' + tags + "</div>" +
      "<h3>" + escapeHtml(job.title) + "</h3>" +
      '<p class="job-card__summary">' + escapeHtml(job.summary) + "</p>" +
      '<p class="job-card__location">' + ICON_PIN + "<span>" + escapeHtml(job.location) + "</span></p>" +
      details +
      '<div class="job-card__footer">' +
      '<a class="btn btn--primary btn--sm" href="' + applyHref + '">שליחת קורות חיים למשרה</a>' +
      (compact ? "" : '<span class="job-card__eeo">המשרה מיועדת לנשים ולגברים כאחד</span>') +
      "</div>" +
      "</article>"
    );
  }

  function initFeaturedJobs() {
    var host = $("#featured-jobs");
    if (!host || !window.NK_JOBS) return;
    var jobs = window.NK_JOBS.filter(function (j) {
      return j.featured;
    });
    if (jobs.length < 3) {
      window.NK_JOBS.forEach(function (j) {
        if (jobs.length < 3 && jobs.indexOf(j) === -1) jobs.push(j);
      });
    }
    host.innerHTML = jobs
      .slice(0, 3)
      .map(function (j) {
        return jobCard(j, true);
      })
      .join("");
  }

  function initJobsPage() {
    var grid = $("#jobs-grid");
    if (!grid || !window.NK_JOBS) return;

    var chipsHost = $("#job-filters");
    var searchInput = $("#job-search");
    var countEl = $("#jobs-count");
    var jobs = window.NK_JOBS.slice();
    var activeCat = "all";
    var query = "";

    var params = new URLSearchParams(window.location.search);
    var catParam = params.get("cat");
    if (catParam && window.NK_CATEGORIES[catParam]) activeCat = catParam;

    function usedCategories() {
      var seen = {};
      jobs.forEach(function (j) {
        seen[j.category] = true;
      });
      return Object.keys(window.NK_CATEGORIES).filter(function (k) {
        return seen[k];
      });
    }

    function renderChips() {
      if (!chipsHost) return;
      var cats = [["all", "כל המשרות"]].concat(
        usedCategories().map(function (k) {
          return [k, categoryName(k)];
        })
      );
      chipsHost.innerHTML = cats
        .map(function (c) {
          return (
            '<button type="button" class="chip" data-cat="' + c[0] + '" aria-pressed="' +
            (c[0] === activeCat ? "true" : "false") + '">' + escapeHtml(c[1]) + "</button>"
          );
        })
        .join("");
    }

    function matches(job) {
      if (activeCat !== "all" && job.category !== activeCat) return false;
      if (!query) return true;
      var hay = [job.title, job.summary, job.location, categoryName(job.category)]
        .concat(job.requirements || [])
        .join(" ")
        .toLowerCase();
      return hay.indexOf(query) !== -1;
    }

    function render() {
      var list = jobs.filter(matches);
      if (countEl) {
        countEl.textContent = list.length
          ? "מוצגות " + list.length + " משרות מתוך " + jobs.length
          : "לא נמצאו משרות התואמות לחיפוש";
      }
      if (!list.length) {
        grid.innerHTML =
          '<div class="jobs-empty"><p><strong>לא נמצאו משרות מתאימות.</strong></p>' +
          '<p class="muted">מוזמנים/ות לשלוח קורות חיים ונחזור אליכם כשתיפתח משרה מתאימה.</p>' +
          '<a class="btn btn--primary" href="contact.html">שליחת קורות חיים</a></div>';
        return;
      }
      grid.innerHTML = list
        .map(function (j) {
          return jobCard(j, false);
        })
        .join("");
    }

    if (chipsHost) {
      chipsHost.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        activeCat = chip.getAttribute("data-cat");
        $all(".chip", chipsHost).forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        var url = new URL(window.location.href);
        if (activeCat === "all") url.searchParams.delete("cat");
        else url.searchParams.set("cat", activeCat);
        window.history.replaceState(null, "", url);
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        query = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    renderChips();
    render();
  }

  /* ------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------ */
  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    var jobId = params.get("job");
    var type = params.get("type");
    var subjectInput = $("#subject", form);
    var jobNote = $("#job-note");

    if (jobId && window.NK_JOBS) {
      var job = window.NK_JOBS.filter(function (j) {
        return String(j.id) === String(jobId);
      })[0];
      if (job) {
        if (subjectInput) subjectInput.value = "מועמדות למשרה: " + job.title;
        if (jobNote) {
          jobNote.hidden = false;
          $("strong", jobNote).textContent = job.title;
        }
      }
    }

    if (type === "employer") {
      var employerRadio = $('input[name="audience"][value="employer"]', form);
      if (employerRadio) employerRadio.checked = true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var audience = data.get("audience") || "candidate";
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var email = String(data.get("email") || "").trim();
      var subject = String(data.get("subject") || "").trim();
      var message = String(data.get("message") || "").trim();

      var to = audience === "employer" ? INFO_EMAIL : CV_EMAIL;
      if (!subject) {
        subject = audience === "employer" ? "פנייה ממעסיק – " + name : "קורות חיים – " + name;
      }

      var lines = [
        "שלום נורית,",
        "",
        (audience === "employer" ? "פנייה ממעסיק" : "פנייה ממועמד/ת") + ":",
        "שם: " + name,
        "טלפון: " + phone,
        "אימייל: " + email,
        "",
        message,
        ""
      ];
      if (audience !== "employer") {
        lines.push("* קורות החיים מצורפים להודעה זו.");
      }

      var href =
        "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      window.location.href = href;

      var status = $("#form-status");
      if (status) {
        status.textContent =
          audience === "employer"
            ? "תוכנת הדואר נפתחה עם הפנייה מוכנה לשליחה אל " + to
            : "תוכנת הדואר נפתחה. אנא צרפו את קובץ קורות החיים ושלחו אל " + to;
      }
    });
  }

  /* ------------------------------------------------------------------
     Misc
     ------------------------------------------------------------------ */
  function initYear() {
    $all("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initA11y();
    initFeaturedJobs();
    initJobsPage();
    initContactForm();
    initYear();
  });
})();
