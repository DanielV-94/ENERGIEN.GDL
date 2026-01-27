function initializeProgressCircles() {
  const e = new IntersectionObserver(
    (t) => {
      t.forEach((t) => {
        if (t.isIntersecting) {
          (t.target.querySelectorAll(".stat-circle").forEach((e, t) => {
            setTimeout(() => {
              animateCircle(e);
            }, 200 * t);
          }),
            e.unobserve(t.target));
        }
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -50px 0px" },
  );
  document.querySelectorAll(".impact-dashboard").forEach((t) => {
    e.observe(t);
  });
}
function animateCircle(e) {
  const t = e.querySelector(".case-stat__value"),
    n = e.querySelector(".case-stat__unit");
  if (!t) return;
  const r = parseInt(t.textContent) || 0,
    o = n ? n.textContent : "";
  let a = r;
  if ("kW" === o) {
    const e = 1e3;
    a = Math.min((r / e) * 100, 100);
  } else if ("Unidades" === o) {
    const e = 2e3;
    a = Math.min((r / e) * 100, 100);
  } else "%" === o && (a = r);
  (e.style.setProperty("--target-progress", a),
    e.classList.add("animated"),
    animateValue(t, 0, r, 1500));
}
function animateValue(e, t, n, r) {
  const o = performance.now(),
    a = n - t;
  requestAnimationFrame(function s(i) {
    const c = i - o,
      l = Math.min(c / r, 1),
      u = 1 - Math.pow(1 - l, 4),
      d = Math.round(t + a * u);
    ((e.textContent = d.toLocaleString()),
      l < 1 ? requestAnimationFrame(s) : (e.textContent = n.toLocaleString()));
  });
}
(document.addEventListener("DOMContentLoaded", function () {
  initializeProgressCircles();
}),
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".stat-circle").forEach((e) => {
      (e.addEventListener("mouseenter", function () {
        ((this.style.transform = "scale(1.05)"),
          (this.style.transition = "transform 0.3s ease"));
      }),
        e.addEventListener("mouseleave", function () {
          this.style.transform = "scale(1)";
        }));
    });
  }));
