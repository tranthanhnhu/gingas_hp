(function () {
  "use strict";

  function initProductSlider(root) {
    var viewport = root.querySelector(".product-slider__viewport");
    var track = root.querySelector(".product-slider__track");
    if (!viewport || !track) return;

    var slides = Array.prototype.slice.call(
      root.querySelectorAll(".product-slider__slide")
    );
    if (!slides.length) return;

    var prevBtn = root.querySelector(".product-slider__btn--prev");
    var nextBtn = root.querySelector(".product-slider__btn--next");
    var dotsWrap = root.querySelector(".product-slider__dots");
    var counter = root.querySelector(".product-slider__counter");
    var index = 0;
    var multi = slides.length > 1;
    var lazyReady = false;

    root.classList.toggle("is-single", !multi);

    function prepareLazyImages() {
      slides.forEach(function (slide) {
        var img = slide.querySelector("img");
        if (!img) return;
        var url = img.getAttribute("data-src") || img.getAttribute("src");
        if (!url) return;
        img.dataset.src = url;
        img.removeAttribute("src");
        img.removeAttribute("loading");
        img.classList.add("product-slider__img--lazy");
      });
    }

    function ensureImageLoaded(i) {
      if (i < 0 || i >= slides.length) return;
      var img = slides[i].querySelector("img");
      if (!img || !img.dataset.src) return;
      if (img.dataset.loaded === "1") return;

      img.dataset.loaded = "loading";
      img.addEventListener(
        "load",
        function onLoad() {
          img.removeEventListener("load", onLoad);
          img.classList.remove("product-slider__img--lazy");
          img.dataset.loaded = "1";
        },
        { once: true }
      );
      img.addEventListener(
        "error",
        function onErr() {
          img.removeEventListener("error", onErr);
          img.dataset.loaded = "error";
        },
        { once: true }
      );
      img.src = img.dataset.src;
    }

    function preloadNearby(center) {
      ensureImageLoaded(center);
      ensureImageLoaded(center + 1);
      ensureImageLoaded(center - 1);
    }

    function activateLazy() {
      if (lazyReady) return;
      lazyReady = true;
      preloadNearby(index);
    }

    if (slides.some(function (s) { return s.querySelector("img"); })) {
      prepareLazyImages();
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                activateLazy();
                io.disconnect();
              }
            });
          },
          { rootMargin: "280px 0px", threshold: 0.01 }
        );
        io.observe(root);
      } else {
        activateLazy();
      }
    }

    if (multi && dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "product-slider__dot";
        dot.setAttribute("aria-label", "画像 " + (i + 1));
        dot.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          goTo(i);
        });
        dotsWrap.appendChild(dot);
      });
    }

    function motion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
    }

    function syncUi() {
      var dots = root.querySelectorAll(".product-slider__dot");
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-selected", i === index ? "true" : "false");
      });
      if (counter) counter.textContent = index + 1 + " / " + slides.length;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      var slide = slides[index];
      viewport.scrollTo({
        left: slide.offsetLeft - track.offsetLeft,
        behavior: motion(),
      });
      syncUi();
      if (lazyReady) preloadNearby(index);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(index - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(index + 1);
      });
    }

    var scrollTimer;
    viewport.addEventListener(
      "scroll",
      function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          var left = viewport.scrollLeft;
          var closest = 0;
          var minDist = Infinity;
          slides.forEach(function (slide, i) {
            var dist = Math.abs(slide.offsetLeft - track.offsetLeft - left);
            if (dist < minDist) {
              minDist = dist;
              closest = i;
            }
          });
          if (closest !== index) {
            index = closest;
            syncUi();
            if (lazyReady) preloadNearby(index);
          }
        }, 60);
      },
      { passive: true }
    );

    root.addEventListener("keydown", function (e) {
      if (!multi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    syncUi();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-product-slider]").forEach(initProductSlider);
  });
})();
