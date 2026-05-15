(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const header = $("#siteHeader");

  // -------- Header scroll state --------
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // -------- Hero background slideshow (index only) --------
  function initHeroSlideshow() {
    const root = document.querySelector("[data-hero-slideshow]");
    if (!root) return;
    const slides = Array.from(root.querySelectorAll("[data-hero-slide]"));
    const dotsWrap = root.querySelector(".hero__dots");
    if (slides.length < 2) {
      if (dotsWrap) dotsWrap.hidden = true;
      return;
    }

    let idx = 0;
    let timerId = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function goTo(nextIdx) {
      idx = (nextIdx + slides.length) % slides.length;
      slides.forEach((el, i) => {
        el.classList.toggle("is-active", i === idx);
      });
      if (dotsWrap) {
        const dots = dotsWrap.querySelectorAll(".hero__dot");
        dots.forEach((d, i) => {
          d.classList.toggle("is-active", i === idx);
          d.setAttribute("aria-selected", i === idx ? "true" : "false");
        });
      }
    }

    function advance() {
      goTo(idx + 1);
    }

    function stop() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function start() {
      if (reduceMotion) return;
      stop();
      timerId = window.setInterval(advance, 6500);
    }

    function restart() {
      start();
    }

    if (dotsWrap && !reduceMotion) {
      slides.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "hero__dot" + (i === 0 ? " is-active" : "");
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
        btn.setAttribute("aria-label", "背景画像 " + (i + 1));
        btn.addEventListener("click", () => {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(btn);
      });
    } else if (dotsWrap) {
      dotsWrap.hidden = true;
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  initHeroSlideshow();

  // -------- Mobile navigation + backdrop --------
  const navToggle = $("#navToggle");
  const siteNav = $("#siteNav");

  function getOrCreateBackdrop() {
    let backdrop = $(".nav-backdrop");
    if (!backdrop && header) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      backdrop.id = "navBackdrop";
      backdrop.setAttribute("aria-hidden", "true");
      header.insertAdjacentElement("afterend", backdrop);
    }
    return backdrop;
  }

  function closeMobileMenu() {
    if (!navToggle || !siteNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("is-nav-open");
    if (header) header.classList.remove("is-nav-open");
    const bd = $(".nav-backdrop");
    if (bd) bd.classList.remove("is-visible");
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  function openMobileMenu() {
    if (!navToggle || !siteNav) return;
    getOrCreateBackdrop();
    navToggle.setAttribute("aria-expanded", "true");
    siteNav.classList.add("is-open");
    document.body.classList.add("is-nav-open");
    if (header) header.classList.add("is-nav-open");
    const bd = $(".nav-backdrop");
    if (bd) bd.classList.add("is-visible");
    const first = siteNav.querySelector("a");
    if (first) {
      requestAnimationFrame(() => {
        try {
          first.focus({ preventScroll: true });
        } catch (_) {
          first.focus();
        }
      });
    }
  }

  if (navToggle && siteNav) {
    const backdrop = getOrCreateBackdrop();

    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeMobileMenu();
      else openMobileMenu();
    });

    if (backdrop) {
      backdrop.addEventListener("click", closeMobileMenu);
    }

    siteNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 1024) closeMobileMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) closeMobileMenu();
    });
  }

  // -------- Back to top --------
  function initBackToTop() {
    let btn = $(".back-to-top");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "back-to-top";
      btn.setAttribute("aria-label", "ページ先頭へ戻る");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      document.body.appendChild(btn);
    }

    const onScroll = () => {
      const show = window.scrollY > 360;
      btn.classList.toggle("is-visible", show);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  initBackToTop();

  // -------- Scroll reveal --------
  const reveals = $$(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // -------- Lazy video autoplay (iOS-safe with retry) --------
  const videos = $$("video[src], video source[src]").map((el) =>
    el.tagName === "VIDEO" ? el : el.parentElement
  );

  function tryPlay(v, attempts) {
    if (!v || v.dataset.userPaused === "1") return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        if (attempts > 0) {
          setTimeout(() => tryPlay(v, attempts - 1), 350);
        }
      });
    }
  }

  if (videos.length && "IntersectionObserver" in window) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            tryPlay(v, 3);
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { threshold: 0.15 }
    );
    videos.forEach((v) => vio.observe(v));
  }

  // iOS Safari sometimes rejects autoplay before first user interaction:
  // resume any in-view videos on the first touch / scroll gesture.
  let kicked = false;
  function kickPlay() {
    if (kicked) return;
    kicked = true;
    videos.forEach((v) => {
      const r = v.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (inView && v.paused) tryPlay(v, 2);
    });
  }
  window.addEventListener("touchstart", kickPlay, { once: true, passive: true });
  window.addEventListener("scroll", kickPlay, { once: true, passive: true });

  // -------- FAQ accordion smooth close --------
  $$(".faq-item").forEach((item) => {
    const summary = $("summary", item);
    if (!summary) return;
    summary.addEventListener("click", () => {
      const siblings = $$(".faq-item", item.parentElement);
      siblings.forEach((other) => {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    });
  });

  // -------- News filter (visual only stub) --------
  const filterButtons = $$(".news-filter button");
  if (filterButtons.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
      });
    });
  }

  // -------- Smooth anchor scroll (account for sticky header) --------
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerOffset = (header && header.offsetHeight) || 0;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
    window.scrollTo({ top, behavior: "smooth" });
  });

  // -------- Contact form basic validation (client-side only) --------
  const form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;
      $$("input,textarea,select", form).forEach((field) => {
        if (field.hasAttribute("required") && !field.value.trim()) {
          field.style.borderColor = "#ef4444";
          isValid = false;
        } else {
          field.style.borderColor = "";
        }
      });
      if (!isValid) {
        alert("必須項目をご入力ください。");
        return;
      }
      alert(
        "お問い合わせありがとうございます。担当者より2営業日以内にご返信いたします。"
      );
      form.reset();
    });
  }
})();
