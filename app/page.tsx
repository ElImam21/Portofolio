"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--f-display",
});
const body = Libre_Franklin({
  subsets: ["latin"],
  variable: "--f-body",
});

/* ───────────── DATA ───────────── */

const EMAIL = "imulyazid5457@gmail.com";

const navLinks = [
  { id: "tentang", label: "Keahlian" },
  { id: "proyek", label: "Proyek" },
  { id: "pengalaman", label: "Pengalaman" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "kontak", label: "Kontak" },
];
const sectionIds = ["beranda", ...navLinks.map((l) => l.id)];

const skillGroups = [
  { judul: "Bahasa", items: ["Go (Golang)", "TypeScript", "JavaScript", "PHP"] },
  {
    judul: "Backend",
    items: ["REST API", "Clean Architecture", "JWT Auth", "WebSocket", "Laravel"],
  },
  { judul: "Frontend & Mobile", items: ["Next.js", "Astro", "React Native"] },
  { judul: "Database", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { judul: "Tooling", items: ["CI/CD (Vercel)", "Git"] },
];
const totalSkills = skillGroups.reduce((n, g) => n + g.items.length, 0);

type Kategori = "Backend" | "Frontend" | "Mobile";
const filters: ("Semua" | Kategori)[] = ["Semua", "Backend", "Frontend", "Mobile"];

const projects: {
  title: string;
  role: string;
  period: string;
  tech: string[];
  description: string;
  highlight: string;
  pola: string;
  kategori: Kategori[];
}[] = [
  {
    title: "Sistem Informasi Desa Kepayang",
    role: "Fullstack Developer (Backend + Frontend Admin)",
    period: "2026",
    tech: ["Go (Golang)", "Next.js", "TypeScript", "REST API", "MySQL"],
    description:
      "Sistem informasi desa terintegrasi dengan REST API backend menggunakan Go (91+ commit) dan panel admin berbasis Next.js untuk mengelola data warga, dokumen desa, dan konten digital.",
    highlight: "91+ commit backend",
    pola: "pola-pinstripe",
    kategori: ["Backend", "Frontend"],
  },
  {
    title: "Platform Edukasi Hak Cipta Interaktif",
    role: "Freelance Web Developer",
    period: "Mei – Juni 2026",
    tech: ["Astro", "Fuse.js", "CI/CD", "Vercel"],
    description:
      "Merancang platform edukasi hak cipta interaktif untuk kreator konten digital Indonesia dengan fitur pencarian fuzzy cerdas berbasis Fuse.js dan deployment otomatis berbasis CI/CD Vercel.",
    highlight: "Fuzzy search & performa tinggi",
    pola: "pola-plaid",
    kategori: ["Frontend"],
  },
  {
    title: "Sistem Manajemen Dokumen & Real-Time App",
    role: "IT Intern Backend Developer",
    period: "Nov 2025 – Jan 2026",
    tech: ["Go", "Clean Architecture", "WebSocket", "Cloudinary", "React Native"],
    description:
      "Pengembangan sistem backend surat masuk/keluar di Dinas Sosial Kubu Raya berbasis Clean Architecture, notifikasi real-time WebSocket, integrasi Cloudinary, serta aplikasi mobile pendukung.",
    highlight: "Dinas Sosial Kubu Raya",
    pola: "pola-argyle",
    kategori: ["Backend", "Mobile"],
  },
  {
    title: "Sistem Perpustakaan Laravel",
    role: "Fullstack Developer",
    period: "2025",
    tech: ["PHP", "Laravel", "Blade", "MySQL"],
    description:
      "Aplikasi manajemen perpustakaan komprehensif berbasis PHP/Laravel mencakup modul manajemen buku, data anggota, serta alur transaksi peminjaman.",
    highlight: "Fullstack PHP",
    pola: "pola-herringbone",
    kategori: ["Backend", "Frontend"],
  },
];

const experiences = [
  {
    role: "Freelance Web Developer",
    company: "Proyek Klien Perseorangan",
    period: "Mei 2026 – Juni 2026",
    durasi: "2 bulan",
    points: [
      "Merancang dan mempublikasikan platform edukasi hak cipta interaktif berbasis Astro.",
      "Mengimplementasikan pencarian fuzzy (Fuse.js) untuk optimasi pencarian informasi.",
      "Menyiapkan pipeline deployment otomatis CI/CD melalui Vercel.",
    ],
  },
  {
    role: "IT Intern - Backend & IT Support",
    company: "Dinas Sosial Kabupaten Kubu Raya",
    period: "November 2025 – Januari 2026",
    durasi: "3 bulan",
    points: [
      "Membangun backend sistem manajemen surat berbasis Go dengan arsitektur Clean Architecture.",
      "Mengintegrasikan unggah media Cloudinary, notifikasi real-time WebSocket, dan otentikasi token UUID.",
      "Mengembangkan aplikasi mobile cross-platform berbasis React Native (Expo).",
      "Memberikan IT support operasional (troubleshooting hardware & MS Office).",
    ],
  },
];

const seminars = [
  {
    judul: "Seminar Nasional Entrepreneur (WIMNUS 2022)",
    sub: "“Indonesia Recovery” – Hotel Harris Pontianak",
  },
  {
    judul: "Seminar “Mendesain Kesuksesan” (Lampung Cerdas 2021)",
    sub: "Successful Experience Program",
  },
];

const goSnippet = [
  "// internal/usecase/surat.go (ilustrasi)",
  "func (u *suratUsecase) Kirim(ctx context.Context, in KirimSurat) error {",
  "\tsurat, err := entity.NewSurat(in.Nomor, in.Perihal)",
  "\tif err != nil {",
  "\t\treturn err",
  "\t}",
  "\tif err := u.repo.Simpan(ctx, surat); err != nil {",
  "\t\treturn err",
  "\t}",
  "\t// kabari penerima secara real-time",
  "\treturn u.notifier.Push(ctx, in.PenerimaID, surat.ID)",
  "}",
];

const pad = "px-6 sm:px-10 lg:px-16 xl:px-24";

/* ───────────── KOMPONEN KECIL ───────────── */

function Judul({
  children,
  sub,
  terang = false,
}: {
  children: React.ReactNode;
  sub?: string;
  terang?: boolean;
}) {
  return (
    <div className="mb-12 max-w-3xl md:mb-16">
      <h2
        className={`font-display text-5xl font-semibold leading-[1.05] md:text-7xl ${
          terang ? "text-ivory" : "text-walnut"
        }`}
      >
        {children}
      </h2>
      <div className="mt-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-16 bg-cognac" />
        <span className="h-2 w-2 rotate-45 bg-brass" />
        <span className="h-px w-6 bg-cognac/50" />
      </div>
      {sub && (
        <p
          className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${
            terang ? "text-sand/80" : "text-leather"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Highlight({ line }: { line: string }) {
  const parts = line.split(
    /(\/\/.*$|\b(?:func|return|if|nil)\b|\b(?:context\.Context|error)\b)/
  );
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("//"))
          return (
            <span key={i} className="italic text-tan">
              {p}
            </span>
          );
        if (/^(func|return|if|nil)$/.test(p))
          return (
            <span key={i} className="text-ember">
              {p}
            </span>
          );
        if (/^(context\.Context|error)$/.test(p))
          return (
            <span key={i} className="text-camel">
              {p}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function Bingkai({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative border border-brass/60 p-4 pt-10 ${className}`}>
      <span className="absolute left-4 top-2 font-display text-xl italic">
        {label}
      </span>
      {children}
    </div>
  );
}

function Segel() {
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label="Segel monogram IH dengan tulisan Backend, Fullstack Developer, Pontianak"
      className="h-auto w-full max-w-[26rem] drop-shadow-[0_18px_30px_rgba(46,27,16,0.28)]"
    >
      <defs>
        <path
          id="lingkar"
          d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"
        />
        <radialGradient id="lilin" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#d2763a" />
          <stop offset="60%" stopColor="#b4531a" />
          <stop offset="100%" stopColor="#8c3d10" />
        </radialGradient>
      </defs>

      <g className="seal-ring">
        <circle cx="200" cy="200" r="192" fill="none" stroke="#b08a3e" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="184" fill="none" stroke="#b08a3e" strokeWidth=".7" />
        <text
          fontFamily="var(--font-display)"
          fontSize="22"
          fontStyle="italic"
          fill="#2e1b10"
          letterSpacing="2"
        >
          <textPath href="#lingkar" textLength="930" lengthAdjust="spacing">
            Backend ◆ Fullstack Developer ◆ Pontianak ◆ Go ◆ TypeScript ◆
          </textPath>
        </text>
      </g>

      <circle cx="200" cy="200" r="116" fill="url(#lilin)" stroke="#8c3d10" strokeWidth="2" />
      <circle cx="200" cy="200" r="102" fill="none" stroke="#fbf5e8" strokeOpacity=".45" strokeWidth="1" />
      <circle cx="200" cy="200" r="98" fill="none" stroke="#fbf5e8" strokeOpacity=".25" strokeWidth=".6" strokeDasharray="2 5" />
      <text
        x="200"
        y="222"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="600"
        fontSize="84"
        fill="#fbf5e8"
      >
        IH
      </text>
      <text
        x="200"
        y="258"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="17"
        fill="#fbf5e8"
        fillOpacity=".85"
      >
        Pontianak
      </text>
    </svg>
  );
}

/* ───────────── HALAMAN ───────────── */

export default function Home() {
  const tahun = useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026
  );

  const [aktif, setAktif] = useState("beranda");
  const [menuBuka, setMenuBuka] = useState(false);
  const [filter, setFilter] = useState<"Semua" | Kategori>("Semua");
  const [tersalin, setTersalin] = useState(false);
  const progres = useRef<HTMLDivElement>(null);

  // Garis progres scroll
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const p = total > 0 ? el.scrollTop / total : 0;
      if (progres.current) progres.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menandai bagian yang sedang dibaca di navigasi
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setAktif(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  async function salinEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      /* clipboard tidak tersedia, abaikan */
    }
    setTersalin(true);
    setTimeout(() => setTersalin(false), 2200);
  }

  const tampil = projects.filter(
    (p) => filter === "Semua" || p.kategori.includes(filter)
  );

  return (
    <div
      className={`${display.variable} ${body.variable} font-body min-h-screen w-full overflow-x-hidden bg-parchment text-walnut`}
    >
      {/* Progres scroll */}
      <div
        ref={progres}
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-cognac"
      />

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-brass/30 bg-parchment/85 backdrop-blur-md">
        <nav className={`flex w-full items-center justify-between py-3 ${pad}`}>
          <a href="#beranda" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-brass bg-cognac font-display text-lg font-semibold italic text-ivory">
              IH
            </span>
            <span className="font-display text-xl font-semibold">Imam Hakimi</span>
          </a>

          <ul className="hidden items-center gap-9 text-sm md:flex">
            {navLinks.map((l) => {
              const on = aktif === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className={`relative py-1 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-cognac after:transition-transform ${
                      on
                        ? "text-rust after:scale-x-100"
                        : "text-leather after:scale-x-0 hover:text-rust"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#kontak"
            className="hidden rounded-sm border border-cognac px-4 py-1.5 text-sm text-rust transition-colors hover:bg-cognac hover:text-ivory md:inline-block"
          >
            Hubungi saya
          </a>

          <button
            type="button"
            aria-label={menuBuka ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuBuka}
            onClick={() => setMenuBuka((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-sm border border-brass/60 md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-px w-5 bg-walnut transition-all ${
                  menuBuka ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-px w-5 bg-walnut transition-opacity ${
                  menuBuka ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-walnut transition-all ${
                  menuBuka ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </nav>

        {menuBuka && (
          <ul className={`flex flex-col border-t border-brass/30 bg-parchment pb-4 md:hidden ${pad}`}>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setMenuBuka(false)}
                  className="block border-b border-brass/20 py-3 font-display text-2xl"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main className="w-full">
        {/* HERO */}
        <section
          id="beranda"
          className="grain relative flex min-h-[100svh] w-full flex-col bg-[linear-gradient(160deg,#ecdab9_0%,#dcc298_55%,#c9a374_100%)]"
        >
          <div
            className={`grid w-full flex-1 items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.35fr_1fr] lg:gap-16 ${pad}`}
          >
            <div className="flex flex-col items-start gap-7">
              <h1 className="font-display text-[clamp(3.4rem,9.5vw,9rem)] font-semibold leading-[0.92] tracking-tight text-walnut">
                Imam Mulyazid
                <br />
                Hakimi
              </h1>

              <p className="font-display text-2xl italic text-rust md:text-4xl">
                Backend & Fullstack Developer dari Pontianak
              </p>

              <p className="max-w-2xl text-base leading-relaxed text-leather md:text-lg">
                Lulusan S1 Teknik Informatika (IPK 3,72) dengan spesialisasi
                utama dalam{" "}
                <span className="font-semibold text-walnut">Go (Golang)</span>{" "}
                dan{" "}
                <span className="font-semibold text-walnut">TypeScript</span>.
                Berpengalaman merancang REST API handal, Clean Architecture,
                sistem autentikasi, serta aplikasi web & mobile modern.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={`mailto:${EMAIL}`}
                  className="rounded-sm bg-cognac px-7 py-3 text-sm font-semibold text-ivory shadow-lg shadow-cognac/25 transition-colors hover:bg-rust"
                >
                  Kirim email
                </a>
                <a
                  href="https://github.com/ElImam21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-leather/50 px-7 py-3 text-sm font-medium transition-colors hover:border-cognac hover:text-rust"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/imam-mulyazid-h/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm border border-leather/50 px-7 py-3 text-sm font-medium transition-colors hover:border-cognac hover:text-rust"
                >
                  LinkedIn
                </a>
              </div>

              <p className="inline-flex items-center gap-2.5 text-sm text-leather">
                <span className="h-2 w-2 rounded-full bg-cognac" />
                Terbuka untuk peluang kerja & proyek
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Segel />
            </div>
          </div>

          {/* Buku besar ringkasan */}
          <dl
            className={`grid w-full grid-cols-1 gap-x-12 gap-y-3 border-t border-brass/60 py-8 text-leather sm:grid-cols-2 lg:grid-cols-4 ${pad}`}
          >
            {[
              { l: "IPK S1", n: "3,72" },
              { l: "Commit backend Go", n: "91+" },
              { l: "Proyek unggulan", n: String(projects.length) },
              { l: "Teknologi", n: String(totalSkills) },
            ].map((s) => (
              <div key={s.l} className="leader text-base">
                <dt>{s.l}</dt>
                <i />
                <dd className="font-display text-3xl font-semibold text-rust">
                  {s.n}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* KEAHLIAN */}
        <section id="tentang" className={`w-full py-24 md:py-32 ${pad}`}>
          <Judul>Keahlian & tumpukan teknologi</Judul>

          <div className="grid w-full gap-14 lg:grid-cols-[1fr_1.5fr]">
            <p className="max-w-xl font-display text-2xl leading-relaxed text-leather first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-8xl first-letter:font-semibold first-letter:leading-[0.8] first-letter:text-cognac md:text-3xl">
              Fokus saya di sisi backend: merancang layanan yang rapi, mudah
              diuji, dan gampang dirawat, lalu menghubungkannya ke antarmuka web
              maupun mobile.
            </p>

            <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
              {skillGroups.map((g) => (
                <div key={g.judul}>
                  <div className="leader mb-4 text-leather">
                    <h3 className="font-display text-2xl font-semibold text-walnut">
                      {g.judul}
                    </h3>
                    <i />
                    <span className="text-sm">{g.items.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span
                        key={s}
                        className="rounded-sm border border-brass/50 bg-ivory px-3 py-1.5 text-sm text-walnut transition-colors hover:border-cognac hover:text-rust"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid w-full items-stretch gap-8 lg:grid-cols-2">
            <figure className="frame-double flex flex-col justify-between gap-6 bg-ivory p-8 md:p-10">
              <Bingkai label="Delivery (HTTP & WebSocket)" className="bg-sand/70">
                <Bingkai label="Repository" className="bg-camel/60">
                  <Bingkai label="Usecase" className="bg-camel">
                    <Bingkai label="Entity" className="border-rust bg-cognac text-ivory">
                      <p className="text-sm">Aturan bisnis inti</p>
                    </Bingkai>
                  </Bingkai>
                </Bingkai>
              </Bingkai>
              <figcaption className="text-sm leading-relaxed text-leather">
                Lapisan Clean Architecture: dependensi selalu mengarah ke dalam,
                sehingga logika bisnis tidak bergantung pada framework.
              </figcaption>
            </figure>

            <div className="flex flex-col overflow-hidden rounded-sm border border-walnut bg-walnut text-sand shadow-xl shadow-walnut/20">
              <div className="flex items-center justify-between border-b border-leather px-5 py-3 text-xs text-camel">
                <span>surat.go</span>
                <span>Go</span>
              </div>
              <pre className="flex-1 overflow-x-auto p-6 text-[13px] leading-relaxed">
                <code>
                  {goSnippet.map((line, i) => (
                    <div key={i} className="whitespace-pre">
                      <Highlight line={line} />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* PROYEK */}
        <section id="proyek" className={`grain w-full bg-linen py-24 md:py-32 ${pad}`}>
          <Judul sub="Empat proyek yang paling menggambarkan cara kerja saya, dari sistem pemerintahan desa sampai platform edukasi untuk kreator.">
            Proyek unggulan
          </Judul>

          <div
            role="tablist"
            aria-label="Filter proyek"
            className="mb-10 flex flex-wrap gap-2"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-sm border px-5 py-2 text-sm transition-colors ${
                  filter === f
                    ? "border-cognac bg-cognac text-ivory"
                    : "border-leather/40 text-leather hover:border-cognac hover:text-rust"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-12">
            {tampil.map((p, i) => {
              const span =
                tampil.length % 2 === 1 && i === tampil.length - 1
                  ? "lg:col-span-12"
                  : i % 4 === 0 || i % 4 === 3
                  ? "lg:col-span-7"
                  : "lg:col-span-5";
              return (
                <article
                  key={p.title}
                  className={`group flex flex-col overflow-hidden border border-brass/50 bg-ivory transition-colors hover:border-cognac ${span}`}
                >
                  <div className="relative h-36 w-full overflow-hidden border-b border-brass/40 bg-sand">
                    <div className={`pola ${p.pola}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent" />
                    <span className="absolute left-5 top-4 rounded-sm border border-brass/50 bg-ivory/90 px-3 py-1 text-xs text-rust">
                      {p.highlight}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-8">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-3xl font-semibold leading-tight">
                          {p.title}
                        </h3>
                        <span className="shrink-0 pt-1.5 text-xs text-leather">
                          {p.period}
                        </span>
                      </div>
                      <p className="font-display text-lg italic text-rust">{p.role}</p>
                      <p className="max-w-prose text-[15px] leading-relaxed text-leather">
                        {p.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-brass/40 pt-5">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-sm bg-sand/70 px-2.5 py-1 text-xs text-walnut"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* PENGALAMAN */}
        <section id="pengalaman" className={`w-full py-24 md:py-32 ${pad}`}>
          <Judul>Pengalaman kerja</Judul>

          <div className="w-full">
            {experiences.map((exp) => (
              <div
                key={exp.role}
                className="grid gap-4 border-t border-brass/50 py-10 md:grid-cols-[300px_1fr] md:gap-14"
              >
                <div>
                  <p className="font-display text-2xl italic text-rust">{exp.period}</p>
                  <p className="mt-1 text-sm text-leather">{exp.durasi}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-3xl font-semibold md:text-4xl">
                    {exp.role}
                  </h3>
                  <p className="text-leather">{exp.company}</p>
                  <ul className="max-w-3xl space-y-3 pt-3 text-[15px] leading-relaxed text-leather">
                    {exp.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="border-t border-brass/50" />
          </div>
        </section>

        {/* PENDIDIKAN */}
        <section id="pendidikan" className={`grain w-full bg-linen py-24 md:py-32 ${pad}`}>
          <Judul>Pendidikan & seminar</Judul>

          <div className="grid w-full gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="frame-double flex flex-col justify-between gap-10 bg-ivory p-10 md:p-14">
              <div>
                <p className="font-display text-2xl italic text-rust">2022 – 2026</p>
                <h3 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                  S1 Teknik Informatika
                </h3>
                <p className="mt-2 text-leather">Universitas Muhammadiyah Pontianak</p>
              </div>
              <div className="leader text-leather">
                <span className="text-sm">Indeks Prestasi Kumulatif</span>
                <i />
                <span className="font-display text-7xl font-semibold leading-none text-cognac">
                  3,72
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {seminars.map((s) => (
                <div
                  key={s.judul}
                  className="flex-1 border border-brass/40 border-l-[4px] border-l-cognac bg-ivory p-7"
                >
                  <h3 className="font-display text-2xl font-semibold leading-snug">
                    {s.judul}
                  </h3>
                  <p className="mt-2 text-sm text-leather">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAK */}
        <section
          id="kontak"
          className="grain grain-dark w-full bg-[linear-gradient(170deg,#3b2415_0%,#2e1b10_100%)]"
        >
          <div className={`flex w-full flex-col items-start gap-8 py-28 md:py-40 ${pad}`}>
            <h2 className="max-w-5xl font-display text-[clamp(2.8rem,7vw,6.5rem)] font-semibold leading-[1] text-ivory">
              Punya proyek atau lowongan yang cocok? Mari bicara.
            </h2>

            <div className="flex flex-wrap items-center gap-5">
              <a
                href={`mailto:${EMAIL}`}
                className="break-all font-display text-3xl italic text-ember underline decoration-ember/40 underline-offset-8 transition-colors hover:decoration-ember md:text-5xl"
              >
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={salinEmail}
                className="rounded-sm border border-camel/60 px-4 py-2 text-sm text-sand transition-colors hover:border-ember hover:text-ember"
              >
                <span aria-live="polite">{tersalin ? "Tersalin" : "Salin email"}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/ElImam21"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-camel/50 px-7 py-3 text-sm text-sand transition-colors hover:border-ember hover:text-ember"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/imam-mulyazid-h/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-camel/50 px-7 py-3 text-sm text-sand transition-colors hover:border-ember hover:text-ember"
              >
                LinkedIn
              </a>
            </div>

            {/* Tanda tangan */}
            <div className="mt-6">
              <p className="font-display text-4xl italic text-camel md:text-5xl">
                Imam Mulyazid Hakimi
              </p>
              <svg viewBox="0 0 320 24" className="mt-1 w-64 text-brass" aria-hidden="true">
                <path
                  d="M2 14 C 60 2, 110 22, 170 10 S 280 6, 318 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <footer
            className={`flex w-full flex-col items-center justify-between gap-3 border-t border-leather py-7 text-sm text-camel sm:flex-row ${pad}`}
          >
            <p>© {tahun} Imam Mulyazid Hakimi, Pontianak, Indonesia.</p>
            <p>Dibangun dengan Next.js & Tailwind CSS</p>
          </footer>
        </section>
      </main>
    </div>
  );
}