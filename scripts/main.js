import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
const select = (t) => document.querySelector(t);
function runLoader() {
  const t = select(".loader"),
    e = select(".loader__beam"),
    o = select(".loader__glow");
  return t && e && o
    ? new Promise((r) => {
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
            onComplete: () => {
              gsap.to(t, { autoAlpha: 0, duration: 0.45, onComplete: r });
            },
          })
          .to(o, { opacity: 0.8, duration: 0.6 })
          .to(e, { width: "240px", duration: 0.7 }, "<")
          .to(e, { width: "120px", duration: 0.35 })
          .to(e, { width: "100%", duration: 0.6, ease: "power3.out" })
          .to(t, { yPercent: -6, duration: 0.3 }, "-=0.25");
      })
    : Promise.resolve();
}
function splitKineticText() {
  const t = select("[data-kinetic]");
  if (!t) return;
  const e = t.textContent.trim().split(" ");
  t.innerHTML = e
    .map(
      (t) =>
        `<span class="kinetic-word"><span class="kinetic-inner">${t}</span></span>`,
    )
    .join(" ");
}
function animateHero() {
  const t = document.querySelectorAll(".kinetic-word");
  (gsap.from(t, {
    yPercent: 120,
    rotateX: -90,
    opacity: 0,
    stagger: 0.06,
    duration: 1.1,
    ease: "expo.out",
    delay: 0.1,
  }),
    gsap.from(".hero__lead", {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.55,
      ease: "power3.out",
    }),
    gsap.from(".hero__actions", {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      delay: 0.75,
      ease: "back.out(1.7)",
    }),
    gsap.from(".hero__meta", {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.95,
      ease: "power4.out",
    }));
}
function initEnergyCanvas() {
  const t = select("#energy-canvas");
  if (!t) return;
  const e = new THREE.WebGLRenderer({ canvas: t, antialias: !0, alpha: !0 }),
    o = new THREE.Scene(),
    r = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
  r.position.z = 20;
  const a = (() => {
      const t = document.createElement("canvas");
      ((t.width = 32), (t.height = 32));
      const e = t.getContext("2d"),
        o = e.createRadialGradient(16, 16, 0, 16, 16, 16);
      return (
        o.addColorStop(0, "rgba(255,255,255,1)"),
        o.addColorStop(1, "rgba(255,255,255,0)"),
        (e.fillStyle = o),
        e.fillRect(0, 0, 32, 32),
        new THREE.CanvasTexture(t)
      );
    })(),
    n = new THREE.Group();
  o.add(n);
  const i = (t, e, o = 0.5, r = { x: 40, y: 25, z: 20 }) => {
      const n = new THREE.BufferGeometry(),
        i = [],
        s = [];
      for (let t = 0; t < e; t++)
        (i.push((Math.random() - 0.5) * r.x),
          i.push((Math.random() - 0.5) * r.y),
          i.push((Math.random() - 0.5) * r.z),
          s.push(0.01 + 0.035 * Math.random()));
      (n.setAttribute("position", new THREE.Float32BufferAttribute(i, 3)),
        (n.userData = { speeds: s, spread: r }));
      const c = new THREE.PointsMaterial({
        size: o,
        map: a,
        transparent: !0,
        opacity: 0.8,
        color: t,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
      });
      return new THREE.Points(n, c);
    },
    s = i(16765286, 120, 0.6, { x: 38, y: 24, z: 18 }),
    c = i(16753978, 90, 0.68, { x: 42, y: 26, z: 22 }),
    d = i(16774084, 70, 0.74, { x: 34, y: 22, z: 16 });
  n.add(s, c, d);
  const l = () => {
      const t = window.innerWidth,
        o = window.innerHeight;
      (e.setSize(t, o),
        e.setPixelRatio(Math.min(window.devicePixelRatio, 1.8)),
        (r.aspect = t / o),
        r.updateProjectionMatrix());
    },
    p = () => {
      (requestAnimationFrame(p),
        [s, c, d].forEach((t) => {
          const e = t.geometry.attributes.position.array,
            o = t.geometry.userData.speeds,
            r = t.geometry.userData.spread;
          for (let t = 0; t < o.length; t++)
            ((e[3 * t + 1] += o[t]),
              e[3 * t + 1] > r.y / 2 &&
                ((e[3 * t + 1] = -r.y / 2),
                (e[3 * t] = (Math.random() - 0.5) * r.x),
                (e[3 * t + 2] = (Math.random() - 0.5) * r.z)));
          t.geometry.attributes.position.needsUpdate = !0;
        }));
      const t = 5e-4 * performance.now();
      ((n.rotation.y = 0.08 * Math.sin(0.35 * t)),
        (n.rotation.x = 0.04 * Math.cos(0.22 * t)),
        e.render(o, r));
    };
  (l(), window.addEventListener("resize", l), p());
}
function init() {
  (splitKineticText(),
    runLoader().then(() => {
      (animateHero(), initStoryAnimation());
    }),
    initEnergyCanvas());
}
function initStoryAnimation() {
  const t = select(".traveling-sun"),
    e = select(".story-path"),
    o = select("#story");
  if (!t || !e || !o) return;

  // Solo aplicar animaciones GSAP en pantallas mayores a 768px
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (!isMobile) {
    (gsap.set(t, { autoAlpha: 0, scale: 1 }),
      gsap.to(t, {
        scrollTrigger: {
          trigger: o,
          start: "top 40%",
          end: "bottom bottom",
          scrub: 0.3,
          markers: !1,
        },
        motionPath: {
          path: e,
          align: e,
          autoRotate: !1,
          alignOrigin: [0.5, 0.5],
        },
        transformOrigin: "50% 50%",
        ease: "none",
      }),
      gsap.to(t, {
        rotation: "+=360",
        duration: 10,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      }),
      ScrollTrigger.create({
        trigger: o,
        start: "top 98%",
        end: "top 30%",
        onEnter: () => gsap.to(t, { autoAlpha: 1, duration: 0.5 }),
        onLeaveBack: () => gsap.to(t, { autoAlpha: 0, duration: 0.5 }),
      }));
  }

  document.querySelectorAll(".station").forEach((t, e) => {
    if (!isMobile) {
      gsap.from(t, {
        scrollTrigger: {
          trigger: t,
          start: "top 60%",
          end: "top 20%",
          scrub: !1,
          markers: !1,
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      });
    }
    const o = t.querySelector(".station__title");
    if (o && !isMobile) {
      gsap.from(o, {
        scrollTrigger: {
          trigger: t,
          start: "top 65%",
          end: "top 25%",
          scrub: !1,
        },
        letterSpacing: "-0.03em",
        opacity: 0.3,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      });
    }
    const r = t.querySelectorAll(".station__features li");
    if (r.length && !isMobile) {
      gsap.from(r, {
        scrollTrigger: {
          trigger: t,
          start: "top 55%",
          end: "top 15%",
          scrub: !1,
        },
        opacity: 0,
        x: -20,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.5)",
      });
    }
  });
  document.querySelectorAll(".station__image").forEach((t) => {
    ScrollTrigger.create({
      trigger: t,
      start: "top 75%",
      end: "bottom 25%",
      onEnter: () => t.classList.add("in-view"),
      onLeave: () => t.classList.remove("in-view"),
      onEnterBack: () => t.classList.add("in-view"),
      onLeaveBack: () => t.classList.remove("in-view"),
    });
  });
}
document.addEventListener("DOMContentLoaded", init);
