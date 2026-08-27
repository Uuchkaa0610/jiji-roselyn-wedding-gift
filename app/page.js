"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/*
 * PERSONALIZE YOUR GIFT HERE
 * Replace the names, date, words, and image paths below.
 * Put your own JPG/PNG files in public/images, then use "/images/your-file.jpg".
 */
const wedding = {
  partnerOne: "Jiji",
  partnerTwo: "Roselyn",
  date: "September 14, 2026",
  location: "A beautiful beginning",
  giftFrom: "Your Friends",
  heroImage: "/images/jiji-roselyn-2-2x.jpg",
  letter: [
    "May your marriage be filled with the kind of love that feels like home—steady on ordinary days, joyful on the extraordinary ones, and stronger through every season.",
    "This little corner of the world is yours to fill with the moments you never want to forget: the laughter, the happy tears, the quiet glances, and every beautiful chapter still to come.",
    "Here’s to your first day of forever, and to a lifetime of choosing one another.",
  ],
};

const story = [
  {
    number: "01",
    label: "The beginning",
    title: "Two stories found each other.",
    text: "A thousand small moments led here—shared laughter, growing dreams, and the beautiful certainty that life was better together.",
  },
  {
    number: "02",
    label: "The promise",
    title: "A yes to every tomorrow.",
    text: "One question became the promise of a lifetime: to be a safe place, a greatest adventure, and a forever kind of love.",
  },
  {
    number: "03",
    label: "The forever",
    title: "The best chapter starts now.",
    text: "Surrounded by the people who love you most, you began the grandest part of your story—hand in hand, heart to heart.",
  },
];

const starterMemories = [
  {
    id: "sunset-together",
    src: "/images/jiji-roselyn-1-2x.jpg",
    alt: "Jiji and Roselyn sitting together beneath a glowing sunset",
    caption: "Every sunset, together",
    note: "Side by side",
    layout: "md:col-span-12",
    height: "h-[460px] sm:h-[700px] md:h-[900px] lg:h-[1060px]",
    position: "center",
    fit: "object-cover md:object-contain",
    featured: true,
  },
  {
    id: "same-moon",
    src: "/images/jiji-roselyn-2-2x.jpg",
    alt: "Jiji and Roselyn embracing beside the ocean under a crescent moon",
    caption: "Under the same moon",
    note: "Where the night felt like home",
    layout: "md:col-span-5",
    height: "h-[480px] md:h-[760px]",
    position: "center",
  },
  {
    id: "golden-hour",
    src: "/images/jiji-roselyn-3-2x.jpg",
    alt: "Jiji and Roselyn sharing a golden-hour portrait beside a tree",
    caption: "A love with its own light",
    note: "Golden hour",
    layout: "md:col-span-7",
    height: "h-[500px] md:h-[700px]",
    position: "center",
  },
  {
    id: "close-to-you",
    src: "/images/jiji-roselyn-4-2x.jpg",
    alt: "Jiji and Roselyn sharing a quiet close embrace",
    caption: "Close to you",
    note: "In every quiet moment",
    layout: "md:col-span-7",
    height: "h-[500px] md:h-[680px]",
    position: "center",
  },
  {
    id: "every-adventure",
    src: "/images/jiji-roselyn-5-2x.jpg",
    alt: "Jiji and Roselyn reaching for one another beneath a starry sky",
    caption: "Into every adventure",
    note: "Always reaching for one another",
    layout: "md:col-span-5",
    height: "h-[500px] md:h-[680px]",
    position: "center",
  },
];

const uploadStorageKey = "wedding-gift-personal-photos";

function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this photo."));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error("This photo format is not supported."));
      image.onload = () => {
        const maxEdge = 1400;
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function WeddingGift() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [uploadedMemories, setUploadedMemories] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const uploadInputRef = useRef(null);
  const closeButtonRef = useRef(null);
  const lastFocusedRef = useRef(null);

  const couple = wedding.partnerOne + " & " + wedding.partnerTwo;
  const initials = wedding.partnerOne.charAt(0) + " & " + wedding.partnerTwo.charAt(0);
  const allMemories = useMemo(
    () => starterMemories.concat(uploadedMemories),
    [uploadedMemories],
  );

  useEffect(() => {
    const restorePhotos = window.setTimeout(() => {
      try {
        const savedPhotos = window.localStorage.getItem(uploadStorageKey);
        if (savedPhotos) setUploadedMemories(JSON.parse(savedPhotos));
      } catch {
        window.localStorage.removeItem(uploadStorageKey);
      }
    }, 0);
    return () => window.clearTimeout(restorePhotos);
  }, []);

  useEffect(() => {
    if (!giftOpened) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [giftOpened]);

  useEffect(() => {
    if (activeIndex === null) return undefined;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % allMemories.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + allMemories.length) % allMemories.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.setTimeout(() => lastFocusedRef.current?.focus(), 0);
    };
  }, [activeIndex, allMemories.length]);

  const openGift = () => {
    setOpening(true);
    window.setTimeout(() => {
      setGiftOpened(true);
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 900);
  };

  const openMemory = (index) => {
    lastFocusedRef.current = document.activeElement;
    setActiveIndex(index);
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, 6 - uploadedMemories.length));
    event.target.value = "";

    if (!files.length) {
      setUploadMessage("Choose a JPG, PNG, or WebP photo.");
      return;
    }

    setUploadMessage("Adding your memories…");
    try {
      const additions = await Promise.all(
        files.map(async (file, index) => ({
          id: "personal-" + Date.now() + "-" + index,
          src: await optimizeImage(file),
          alt: "Personal wedding memory: " + file.name,
          caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          note: "Your personal memory",
          layout: index % 3 === 0 ? "md:col-span-7" : "md:col-span-5",
          height: index % 3 === 0 ? "h-[500px] md:h-[620px]" : "h-[430px] md:h-[520px]",
          position: "center",
          uploaded: true,
        })),
      );
      const nextPhotos = uploadedMemories.concat(additions);
      window.localStorage.setItem(uploadStorageKey, JSON.stringify(nextPhotos));
      setUploadedMemories(nextPhotos);
      setUploadMessage(
        additions.length +
          (additions.length === 1 ? " photo added and saved on this device." : " photos added and saved on this device."),
      );
    } catch {
      setUploadMessage("That photo was too large to save. Try a smaller image.");
    }
  };

  const removeUploadedPhoto = (id) => {
    const nextPhotos = uploadedMemories.filter((photo) => photo.id !== id);
    window.localStorage.setItem(uploadStorageKey, JSON.stringify(nextPhotos));
    setUploadedMemories(nextPhotos);
    setUploadMessage("Photo removed from this device.");
  };

  const shareGift = async () => {
    const shareData = {
      title: couple + " — Wedding Memories",
      text: "A beautiful wedding keepsake made with love.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Gift shared.");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Gift link copied.");
      }
    } catch {
      setShareMessage("");
    }
  };

  if (!giftOpened) {
    return (
      <main className={"gift-wrap-stage relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#eee4d3] px-4 py-8 text-[#30291f] " + (opening ? "is-opening" : "")}>
        <div className="absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_20%_12%,rgba(255,255,255,.95),transparent_24%),radial-gradient(circle_at_82%_88%,rgba(173,132,67,.22),transparent_28%)]" />
        <div className="gift-ribbon-vertical absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-[linear-gradient(90deg,#8e6328,#efcf8d_48%,#8b5e22)] opacity-85 shadow-[0_0_55px_rgba(205,164,87,.3)] sm:w-24" />
        <div className="gift-ribbon-horizontal absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 bg-[linear-gradient(0deg,#8e6328,#efcf8d_48%,#8b5e22)] opacity-85 shadow-[0_0_55px_rgba(205,164,87,.3)] sm:h-24" />

        <section className="gift-card luxury-paper relative z-10 flex min-h-[82svh] w-full max-w-6xl items-center justify-center border border-[#b69254]/55 bg-[#fffdf8]/95 px-6 py-16 text-center shadow-[0_35px_100px_rgba(77,57,29,.22)] backdrop-blur-sm sm:px-12">
          <div className="pointer-events-none absolute inset-3 border border-[#b69254]/25 sm:inset-5" />
          <span className="absolute left-7 top-7 h-12 w-12 border-l border-t border-[#b69254] sm:left-10 sm:top-10 sm:h-20 sm:w-20" />
          <span className="absolute bottom-7 right-7 h-12 w-12 border-b border-r border-[#b69254] sm:bottom-10 sm:right-10 sm:h-20 sm:w-20" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#9a7339]">
              A wedding gift for
            </p>
            <p className="mt-8 font-[Georgia] text-[clamp(4.5rem,13vw,10rem)] leading-[0.76] tracking-[-0.065em] text-[#332b20]">
              {wedding.partnerOne}
              <span className="gold-foil mx-[0.08em] block py-4 text-[0.56em] font-normal italic sm:inline sm:py-0">
                &
              </span>
              {wedding.partnerTwo}
            </p>
            <div className="mx-auto mt-10 flex max-w-sm items-center gap-5 text-[#b48a48]">
              <span className="h-px flex-1 bg-current" />
              <span className="text-lg">✦</span>
              <span className="h-px flex-1 bg-current" />
            </div>
            <h1 className="mx-auto mt-9 max-w-2xl font-[Georgia] text-3xl font-normal leading-tight sm:text-5xl">
              A little home for your
              <em className="gold-foil font-normal"> forever memories.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[#766b5b] sm:text-lg">
              Made with all our love to celebrate your first day as a family—and every beautiful day that follows.
            </p>
            <button
              className="group mt-10 inline-flex min-h-14 items-center gap-5 rounded-full bg-[#30291f] px-8 text-xs font-semibold uppercase tracking-[0.26em] text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#a87a35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c9a565]/40 sm:min-h-16 sm:px-10"
              onClick={openGift}
              type="button"
            >
              Open your gift
              <span className="text-lg transition group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-8 font-[Georgia] text-lg italic text-[#8d806e]">
              With love, {wedding.giftFrom}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf6] text-[#29251f] selection:bg-[#c6a15b]/30">
      <header className="absolute inset-x-0 top-0 z-30">
        <nav
          aria-label="Wedding keepsake navigation"
          className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-6 sm:px-10 lg:px-16"
        >
          <a
            className="font-[Georgia] text-2xl italic tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0c17f]"
            href="#top"
          >
            {initials}
          </a>
          <div className="hidden items-center gap-10 text-xs font-medium uppercase tracking-[0.2em] text-white/80 lg:flex">
            <a className="transition hover:text-[#e4c989] focus-visible:outline-none focus-visible:text-[#e4c989]" href="#story">
              Your story
            </a>
            <a className="transition hover:text-[#e4c989] focus-visible:outline-none focus-visible:text-[#e4c989]" href="#memories">
              The album
            </a>
            <a className="transition hover:text-[#e4c989] focus-visible:outline-none focus-visible:text-[#e4c989]" href="#letter">
              Our letter
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Share this wedding gift"
              className="hidden min-h-11 rounded-full border border-white/40 bg-white/10 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md transition hover:bg-white hover:text-[#4e4029] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:inline-flex sm:items-center"
              onClick={shareGift}
              type="button"
            >
              Share gift
            </button>
            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Open navigation"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-lg text-white backdrop-blur-md lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
            >
              {mobileMenuOpen ? "×" : "≡"}
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="mx-5 rounded-3xl border border-[#d5b774]/35 bg-[#fffdf8] p-6 text-center shadow-2xl lg:hidden">
            <div className="flex flex-col gap-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#463b2c]">
              {[
                ["Your story", "#story"],
                ["The album", "#memories"],
                ["Our letter", "#letter"],
              ].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="relative flex min-h-[100svh] items-end" id="top">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-65 blur-2xl"
          src={wedding.heroImage}
        />
        <img
          alt="Jiji and Roselyn embracing beneath a crescent moon by the ocean"
          className="absolute inset-0 h-full w-full object-contain object-center"
          fetchPriority="high"
          src={wedding.heroImage}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,14,11,.78)_0%,rgba(16,14,11,.28)_56%,rgba(16,14,11,.45)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,14,11,.82)_0%,transparent_58%,rgba(16,14,11,.28)_100%)]" />
        <p aria-hidden="true" className="pointer-events-none absolute right-[-0.04em] top-[18%] font-[Georgia] text-[22vw] italic leading-none tracking-[-0.08em] text-white/[0.045]">
          forever
        </p>

        <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-10 px-5 pb-14 pt-36 sm:px-10 sm:pb-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-16 lg:pb-24">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-14 bg-[#d2b06b]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ead8ae]">
                Your first day of forever
              </p>
            </div>
            <h1 className="max-w-6xl font-[Georgia] text-[clamp(4.7rem,12vw,11.5rem)] font-normal leading-[0.75] tracking-[-0.065em] text-white">
              {wedding.partnerOne}
              <span className="gold-foil mx-[0.08em] font-normal italic">&</span>
              <br className="sm:hidden" />
              {wedding.partnerTwo}
            </h1>
            <p className="mt-9 max-w-2xl font-[Georgia] text-xl italic leading-8 text-white/[0.82] sm:text-2xl sm:leading-9">
              “May this little home for your memories grow more beautiful with every year you share.”
            </p>
          </div>

          <div className="flex items-end justify-between gap-8 border-t border-white/25 pt-7 lg:min-w-[330px] lg:flex-col lg:items-start lg:border-l lg:border-t-0 lg:pb-3 lg:pl-10 lg:pt-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9bd80]">
                The date
              </p>
              <p className="mt-3 text-sm tracking-[0.14em] text-white">{wedding.date}</p>
            </div>
            <div className="text-right lg:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9bd80]">
                The beginning
              </p>
              <p className="mt-3 max-w-[250px] text-sm leading-6 tracking-[0.08em] text-white/[0.88]">
                {wedding.location}
              </p>
            </div>
          </div>
        </div>
        <div className="hero-seal absolute bottom-10 right-10 z-10 hidden h-36 w-36 rotate-[-6deg] items-center justify-center rounded-full border border-[#e5c989]/60 bg-[#2b241b]/70 text-center text-white backdrop-blur-md xl:flex">
          <div>
            <p className="font-[Georgia] text-3xl italic text-[#e2c37e]">{initials}</p>
            <span className="mx-auto mt-2 block h-px w-10 bg-[#d6b66d]" />
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.24em]">Forever</p>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-10 lg:py-36" id="story">
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#c7a45f]/45 to-transparent" />
        <div className="mx-auto max-w-[1440px]" data-reveal>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a6813f]">
                A gift made with love
              </p>
              <h2 className="mt-7 max-w-3xl font-[Georgia] text-[clamp(3.7rem,7vw,7.2rem)] font-normal leading-[0.88] tracking-[-0.055em] text-[#332d24]">
                Keep every
                <em className="gold-foil block font-normal">beautiful chapter.</em>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-2xl text-lg leading-9 text-[#756b5d] sm:text-xl sm:leading-10">
                Dear {wedding.partnerOne} and {wedding.partnerTwo}, this is more than an album. It is a place for the glances, the laughter, the tiny details, and the people who made one extraordinary day unforgettable.
              </p>
              <p className="mt-8 font-[Georgia] text-2xl italic text-[#9d773d]">
                May it grow right alongside your love.
              </p>
            </div>
          </div>

          <div className="relative mt-24 grid gap-5 lg:min-h-[980px]" data-reveal>
            <div aria-hidden="true" className="absolute left-[42%] top-[12%] hidden h-[460px] w-[460px] rounded-full border border-[#b78b43]/25 lg:block" />
            <div aria-hidden="true" className="absolute left-[45%] top-[15%] hidden h-[400px] w-[400px] rounded-full border border-[#b78b43]/15 lg:block" />

            <figure className="relative h-[680px] overflow-hidden shadow-[0_32px_90px_rgba(67,48,22,.18)] lg:absolute lg:left-0 lg:top-0 lg:h-[860px] lg:w-[68%]">
              <img
                alt="Jiji and Roselyn sitting together beneath a glowing sunset"
                className="h-full w-full object-cover object-center"
                loading="lazy"
                src="/images/jiji-roselyn-1-2x.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1711]/45 via-transparent to-transparent" />
              <figcaption className="absolute bottom-8 left-8 text-white sm:bottom-12 sm:left-12">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e3c887]">The greatest adventure</p>
                <p className="mt-3 font-[Georgia] text-4xl italic sm:text-5xl">Together, always.</p>
              </figcaption>
            </figure>

            <figure className="relative h-[500px] overflow-hidden border-[10px] border-[#fbfaf6] shadow-[0_30px_80px_rgba(67,48,22,.2)] lg:absolute lg:bottom-0 lg:right-0 lg:h-[560px] lg:w-[36%]">
              <img
                alt="Jiji and Roselyn sharing a close embrace"
                className="h-full w-full object-cover"
                loading="lazy"
                src="/images/jiji-roselyn-4-2x.jpg"
              />
            </figure>

            <div className="luxury-paper relative z-10 mx-auto max-w-md border border-[#b78b43]/40 bg-[#fffdf7]/95 p-9 text-center shadow-[0_28px_80px_rgba(67,48,22,.16)] backdrop-blur sm:p-12 lg:absolute lg:left-[49%] lg:top-[12%] lg:w-[390px] lg:-translate-x-1/2">
              <p className="gold-foil font-[Georgia] text-7xl italic leading-none">{initials}</p>
              <div className="mx-auto mt-6 flex max-w-40 items-center gap-3 text-[#ad8241]">
                <span className="h-px flex-1 bg-current" />
                <span>✦</span>
                <span className="h-px flex-1 bg-current" />
              </div>
              <p className="mt-7 font-[Georgia] text-3xl italic leading-tight text-[#3d3428]">
                “Where there is love, there is a lifetime of wonder.”
              </p>
            </div>

            <div className="relative z-10 max-w-lg bg-[#29231b] p-9 text-white shadow-[0_28px_80px_rgba(30,24,16,.24)] sm:p-12 lg:absolute lg:bottom-[3%] lg:left-[34%] lg:w-[430px]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d9b76c]">Our wish for you</p>
              <p className="mt-6 font-[Georgia] text-4xl italic leading-tight">
                May you always find your way back to this much joy.
              </p>
            </div>
          </div>

          <div className="mt-24 grid border-y border-[#b89656]/30 lg:grid-cols-3">
            {story.map((chapter) => (
              <article
                className="group relative border-b border-[#b89656]/30 px-2 py-12 last:border-b-0 sm:px-8 lg:border-b-0 lg:border-r lg:py-16 lg:last:border-r-0"
                key={chapter.number}
              >
                <div className="flex items-center justify-between">
                  <span className="font-[Georgia] text-5xl italic text-[#d5bc8a]">{chapter.number}</span>
                  <span className="h-px w-16 bg-[#b89656]/45 transition-all duration-500 group-hover:w-24" />
                </div>
                <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-[#a6813f]">{chapter.label}</p>
                <h3 className="mt-5 max-w-sm font-[Georgia] text-4xl leading-tight tracking-[-0.025em]">{chapter.title}</h3>
                <p className="mt-6 max-w-sm text-base leading-8 text-[#786f62]">{chapter.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="luxury-paper relative overflow-hidden bg-[#f1eadf] px-5 py-24 sm:px-10 lg:py-36" id="memories">
        <p aria-hidden="true" className="pointer-events-none absolute -right-10 top-6 font-[Georgia] text-[18vw] italic leading-none tracking-[-0.08em] text-[#9b7438]/[0.055]">
          memories
        </p>
        <div className="relative mx-auto max-w-[1540px]" data-reveal>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9b7438]">The wedding album</p>
              <h2 className="mt-6 max-w-4xl font-[Georgia] text-[clamp(3.8rem,8vw,8.2rem)] font-normal leading-[0.85] tracking-[-0.06em]">
                Moments worth
                <em className="gold-foil block font-normal">holding onto.</em>
              </h2>
            </div>
            <div className="max-w-lg lg:pb-3">
              <p className="text-lg leading-8 text-[#716758]">
                These five moments now live at the heart of the keepsake. Add more photographs whenever a new favorite deserves a place beside them.
              </p>
              <button
                className="mt-7 inline-flex min-h-14 items-center gap-4 rounded-full bg-[#332d24] px-7 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:-translate-y-1 hover:bg-[#a77e3e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a77e3e]/25"
                onClick={() => uploadInputRef.current?.click()}
                type="button"
              >
                <span className="text-xl font-light">＋</span>
                Add your photos
              </button>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                multiple
                onChange={handleUpload}
                ref={uploadInputRef}
                type="file"
              />
              <p aria-live="polite" className="mt-4 min-h-6 text-sm text-[#857968]">
                {uploadMessage || "You can add up to six personal photos. They stay saved on this device."}
              </p>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
            {allMemories.map((memory, index) => (
              <article
                className={
                  "group relative overflow-hidden " +
                  (memory.featured ? "bg-[#241810] ring-1 ring-[#bd9753]/45 " : "bg-[#d9cfbe] ") +
                  memory.layout +
                  " " +
                  memory.height
                }
                key={memory.id}
              >
                <button
                  aria-label={"Open photo: " + memory.caption}
                  className="absolute inset-0 h-full w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#e1c484]"
                  onClick={() => openMemory(index)}
                  type="button"
                >
                  {memory.featured && (
                    <img
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-3xl"
                      src={memory.src}
                    />
                  )}
                  <img
                    alt={memory.alt}
                    className={
                      "relative h-full w-full transition duration-700 ease-out group-hover:scale-[1.025] " +
                      (memory.fit || "object-cover")
                    }
                    loading="lazy"
                    src={memory.src}
                    style={{ objectPosition: memory.position }}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-85 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 block p-6 sm:p-8">
                    <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#e2c98f]">{memory.note}</span>
                    <span className="mt-3 block font-[Georgia] text-3xl text-white sm:text-4xl">{memory.caption}</span>
                  </span>
                </button>
                {memory.uploaded && (
                  <button
                    aria-label={"Remove " + memory.caption}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-[#a77e3e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    onClick={() => removeUploadedPhoto(memory.id)}
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </article>
            ))}

            <button
              className="group flex min-h-[390px] flex-col items-center justify-center border border-[#a77e3e]/45 bg-[#fbf7ef] px-8 text-center transition hover:border-[#a77e3e] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a77e3e]/25 md:col-span-12"
              onClick={() => uploadInputRef.current?.click()}
              type="button"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#a77e3e]/45 font-[Georgia] text-4xl font-light text-[#a77e3e] transition duration-500 group-hover:rotate-90 group-hover:bg-[#a77e3e] group-hover:text-white">
                +
              </span>
              <span className="mt-7 font-[Georgia] text-4xl">Add the memories only you have</span>
              <span className="mt-4 max-w-lg text-base leading-7 text-[#776d60]">
                Choose your favorite wedding photos and watch them become part of the keepsake.
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[92svh] items-center justify-center overflow-hidden px-5 py-24 text-center text-white">
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          src="/images/jiji-roselyn-3-2x.jpg"
        />
        <div className="absolute inset-0 bg-[#17130d]/75" />
        <div className="relative mx-auto max-w-6xl" data-reveal>
          <div className="mx-auto flex max-w-xs items-center gap-4 text-[#d9b96f]">
            <span className="h-px flex-1 bg-current" />
            <span className="text-xl">✦</span>
            <span className="h-px flex-1 bg-current" />
          </div>
          <blockquote className="mt-10 font-[Georgia] text-[clamp(3.5rem,8vw,8.5rem)] font-normal italic leading-[0.92] tracking-[-0.05em]">
            “Grow old with me.
            <span className="gold-foil block">The best is yet to be.”</span>
          </blockquote>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-white/[0.7]">
            For every tomorrow
          </p>
        </div>
      </section>

      <section className="relative bg-[#fbfaf6] px-5 py-24 sm:px-10 lg:py-40" id="letter">
        <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-px bg-gradient-to-b from-[#a77e3e] to-transparent" />
        <div className="mx-auto max-w-6xl" data-reveal>
          <div className="luxury-paper border border-[#ad8a4f]/45 bg-[#fffefa] p-7 shadow-[0_30px_90px_rgba(79,58,26,.1)] sm:p-12 lg:p-20">
            <div className="border border-[#ad8a4f]/25 px-6 py-12 sm:px-12 lg:px-20 lg:py-20">
              <p className="text-center text-xs font-bold uppercase tracking-[0.34em] text-[#9b7438]">
                A letter for the happy couple
              </p>
              <div className="mx-auto mt-9 h-px max-w-36 bg-[#b68d4c]/55" />
              <h2 className="mt-12 font-[Georgia] text-[clamp(3.4rem,7vw,6.8rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                Dear {wedding.partnerOne}
                <span className="gold-foil italic"> & </span>
                {wedding.partnerTwo},
              </h2>
              <div className="mt-12 space-y-7 text-lg leading-9 text-[#6e6558] sm:text-xl sm:leading-10">
                {wedding.letter.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-14 border-t border-[#b68d4c]/30 pt-10">
                <p className="font-[Georgia] text-2xl italic text-[#8d7144]">With all our love,</p>
                <p className="mt-3 font-[Georgia] text-4xl">{wedding.giftFrom}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#231f19] px-5 py-20 text-center text-white sm:px-10">
        <p className="font-[Georgia] text-[clamp(4rem,10vw,8rem)] leading-none tracking-[-0.06em]">
          {wedding.partnerOne}
          <span className="gold-foil mx-[0.08em] italic">&</span>
          {wedding.partnerTwo}
        </p>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-[#d7bd86]">
          {wedding.date}
        </p>
        <div className="mx-auto mt-10 h-px max-w-xs bg-gradient-to-r from-transparent via-[#c7a45f] to-transparent" />
        <button
          className="mt-10 min-h-12 rounded-full border border-white/25 px-7 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-[#c7a45f] hover:text-[#e0c98f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0c98f]"
          onClick={shareGift}
          type="button"
        >
          Share this gift
        </button>
        <p aria-live="polite" className="mt-4 min-h-5 text-sm text-white/60">
          {shareMessage}
        </p>
        <p className="mt-12 font-[Georgia] text-lg italic text-white/55">Made with love for your forever.</p>
      </footer>

      {activeIndex !== null && allMemories[activeIndex] && (
        <div
          aria-label="Wedding photo viewer"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#15120e]/95 p-4 sm:p-8"
          role="dialog"
        >
          <button
            aria-label="Close photo viewer"
            className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/20 text-3xl font-light text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b86d]"
            onClick={() => setActiveIndex(null)}
            ref={closeButtonRef}
            type="button"
          >
            ×
          </button>
          <button
            aria-label="Previous photo"
            className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-2xl text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b86d] sm:left-8"
            onClick={() => setActiveIndex((activeIndex - 1 + allMemories.length) % allMemories.length)}
            type="button"
          >
            ←
          </button>
          <figure className="flex max-h-full max-w-6xl flex-col items-center">
            <img
              alt={allMemories[activeIndex].alt}
              className="max-h-[78svh] max-w-full object-contain shadow-2xl"
              src={allMemories[activeIndex].src}
            />
            <figcaption className="mt-6 text-center">
              <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#d8b86d]">
                {activeIndex + 1} / {allMemories.length}
              </span>
              <span className="mt-2 block font-[Georgia] text-2xl text-white sm:text-3xl">
                {allMemories[activeIndex].caption}
              </span>
            </figcaption>
          </figure>
          <button
            aria-label="Next photo"
            className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-2xl text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8b86d] sm:right-8"
            onClick={() => setActiveIndex((activeIndex + 1) % allMemories.length)}
            type="button"
          >
            →
          </button>
        </div>
      )}
    </main>
  );
}
