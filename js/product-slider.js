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

    root.classList.toggle("is-single", !multi);

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
