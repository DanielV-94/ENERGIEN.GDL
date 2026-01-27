function initializeImageModal() {
  const e = document.createElement("div");
  ((e.className = "image-modal"),
    (e.innerHTML =
      '\n    <span class="image-modal__close">&times;</span>\n    <div class="image-modal__content">\n      <img src="" alt="Imagen ampliada">\n    </div>\n  '),
    document.body.appendChild(e));
  const t = e.querySelector(".image-modal__content img"),
    n = e.querySelector(".image-modal__close");
  function i() {
    (e.classList.remove("active"), (document.body.style.overflow = ""));
  }
  (document.querySelectorAll(".case-card__main-image img").forEach((n) => {
    n.addEventListener("click", function () {
      (e.classList.add("active"),
        (t.src = this.src),
        (t.alt = this.alt),
        (document.body.style.overflow = "hidden"));
    });
  }),
    n.addEventListener("click", i),
    e.addEventListener("click", function (t) {
      t.target === e && i();
    }),
    document.addEventListener("keydown", function (t) {
      "Escape" === t.key && e.classList.contains("active") && i();
    }));
}
function initializeCarousels() {
  document.querySelectorAll(".carousel-container").forEach((e) => {
    const t = e
        .closest(".case-card__header")
        .querySelector(".case-card__main-image img"),
      n = e.querySelectorAll(".thumbnail-item");
    if (!t || 0 === n.length) return;
    (n[0].classList.add("active"),
      n.forEach((e, i) => {
        (e.addEventListener("click", function () {
          (n.forEach((e) => e.classList.remove("active")),
            this.classList.add("active"));
          const e = this.querySelector("img"),
            i = e.getAttribute("data-full") || e.src;
          ((t.style.opacity = "0.5"),
            setTimeout(() => {
              ((t.src = i), (t.style.opacity = "1"));
            }, 150));
        }),
          e.setAttribute("role", "button"),
          e.setAttribute("tabindex", "0"),
          e.setAttribute("aria-label", `Ver imagen ${i + 1}`),
          e.addEventListener("keydown", function (e) {
            ("Enter" !== e.key && " " !== e.key) ||
              (e.preventDefault(), this.click());
          }));
      }));
    let i = 0,
      a = 0;
    const c = e.querySelector(".carousel-thumbnails");
    (c.addEventListener(
      "touchstart",
      function (e) {
        i = e.changedTouches[0].screenX;
      },
      { passive: !0 },
    ),
      c.addEventListener(
        "touchend",
        function (e) {
          ((a = e.changedTouches[0].screenX),
            (function () {
              const e = 50,
                t = i - a;
              Math.abs(t) > e &&
                (t > 0
                  ? c.scrollBy({ left: 100, behavior: "smooth" })
                  : c.scrollBy({ left: -100, behavior: "smooth" }));
            })());
        },
        { passive: !0 },
      ));
  });
}
if (
  (document.addEventListener("DOMContentLoaded", function () {
    (initializeCarousels(), initializeImageModal());
  }),
  "IntersectionObserver" in window)
) {
  const e = new IntersectionObserver((e, t) => {
    e.forEach((e) => {
      if (e.isIntersecting) {
        const n = e.target,
          i = n.getAttribute("data-src");
        (i && ((n.src = i), n.removeAttribute("data-src")), t.unobserve(n));
      }
    });
  });
  document.querySelectorAll("img[data-src]").forEach((t) => {
    e.observe(t);
  });
}
