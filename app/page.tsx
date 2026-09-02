"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultHomepage } from "@/lib/default-homepage";
import { HomepageSettings } from "@/lib/cms";
import {
  defaultSiteSettings,
  SiteSettings,
} from "@/lib/site-settings";

const features = [
  {
    number: "01",
    title: "Personalized Learning",
    description:
      "Build your preparation around the four subjects you actually selected for JAMB. Study topics, resources and materials in a structured learning environment.",
    icon: "book",
  },
  {
    number: "02",
    title: "Real CBT Practice",
    description:
      "Practise with timed computer-based tests designed to help you become familiar with the pressure, speed and discipline required during JAMB.",
    icon: "monitor",
  },
  {
    number: "03",
    title: "JAMB Battle Arena",
    description:
      "Challenge other students in competitive JAMB battles. Compete one-on-one or against groups and see how you perform under pressure.",
    icon: "swords",
  },
  {
    number: "04",
    title: "AI JAMB Coach",
    description:
      "Get intelligent guidance that can explain difficult questions, identify learning gaps, recommend practice and help organize your preparation.",
    icon: "spark",
  },
  {
    number: "05",
    title: "Performance Analytics",
    description:
      "Understand your preparation with performance trends, subject mastery, strengths, weaknesses and recommendations for improvement.",
    icon: "chart",
  },
  {
    number: "06",
    title: "Student Community",
    description:
      "Connect with other JAMB candidates, share achievements, encourage friends, create challenges and become part of a preparation community.",
    icon: "users",
  },
];

const journey = [
  {
    number: "01",
    title: "Create your student profile",
    text: "Tell JAMBMASTER about your JAMB year, target university, course, target score and academic goals.",
  },
  {
    number: "02",
    title: "Choose your four subjects",
    text: "Your learning environment is organized around the four subjects you will take in JAMB.",
  },
  {
    number: "03",
    title: "Learn your topics",
    text: "Study structured topics using educational materials, resources, videos and guided learning.",
  },
  {
    number: "04",
    title: "Practise continuously",
    text: "Move from learning to questions and timed CBTs until answering becomes faster and more confident.",
  },
  {
    number: "05",
    title: "Battle and compete",
    text: "Challenge other students and use competition as another way to test your knowledge and consistency.",
  },
  {
    number: "06",
    title: "Analyze and improve",
    text: "Use your performance data to discover where you are strong, where you need work and what to study next.",
  },
];

export default function Home() {
  const [homepage, setHomepage] =
    useState<HomepageSettings>(defaultHomepage);

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(defaultSiteSettings);

  const [loading, setLoading] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  /*
   * Load homepage CMS configuration and global
   * website settings from Firestore.
   *
   * Empty custom image fields intentionally fall
   * back to the original default images below.
   */
  useEffect(() => {
    async function loadWebsiteConfiguration() {
      try {
        const homepageRef = doc(
          db,
          "siteSettings",
          "homepage"
        );

        const siteRef = doc(
          db,
          "siteSettings",
          "site"
        );

        const [homepageSnapshot, siteSnapshot] =
          await Promise.all([
            getDoc(homepageRef),
            getDoc(siteRef),
          ]);

        /*
         * HOMEPAGE SETTINGS
         */
        if (homepageSnapshot.exists()) {
          const savedData =
            homepageSnapshot.data() as Partial<HomepageSettings>;

          setHomepage({
            ...defaultHomepage,
            ...savedData,

            hero: {
              ...defaultHomepage.hero,
              ...(savedData.hero || {}),
            },

            announcement: {
              ...defaultHomepage.announcement,
              ...(savedData.announcement || {}),
            },

            about: {
              ...defaultHomepage.about,
              ...(savedData.about || {}),
            },

            method: {
              ...defaultHomepage.method,
              ...(savedData.method || {}),
            },

            features: {
              ...defaultHomepage.features,
              ...(savedData.features || {}),
            },

            learning: {
              ...defaultHomepage.learning,
              ...(savedData.learning || {}),
            },

            cbt: {
              ...defaultHomepage.cbt,
              ...(savedData.cbt || {}),
            },

            battle: {
              ...defaultHomepage.battle,
              ...(savedData.battle || {}),
            },

            aiCoach: {
              ...defaultHomepage.aiCoach,
              ...(savedData.aiCoach || {}),
            },

            analytics: {
              ...defaultHomepage.analytics,
              ...(savedData.analytics || {}),
            },

            community: {
              ...defaultHomepage.community,
              ...(savedData.community || {}),
            },

            mission: {
              ...defaultHomepage.mission,
              ...(savedData.mission || {}),
            },

            finalCta: {
              ...defaultHomepage.finalCta,
              ...(savedData.finalCta || {}),
            },

            footer: {
              ...defaultHomepage.footer,
              ...(savedData.footer || {}),
            },
          });
        }

        /*
         * GLOBAL SITE SETTINGS
         */
        if (siteSnapshot.exists()) {
          setSiteSettings({
            ...defaultSiteSettings,
            ...(siteSnapshot.data() as SiteSettings),
          });
        }
      } catch (error) {
        console.error(
          "Failed to load JAMBMASTER website configuration:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadWebsiteConfiguration();
  }, []);

  /*
   * Build the effective hero image list.
   *
   * Each custom slot works independently.
   *
   * Example:
   *
   * custom Hero 1
   * empty Hero 2
   * custom Hero 3
   *
   * becomes:
   *
   * custom Hero 1
   * default Hero 2
   * custom Hero 3
   */
  const heroImages = [
    homepage.hero.images?.[0] ||
      defaultHomepage.hero.images[0],

    homepage.hero.images?.[1] ||
      defaultHomepage.hero.images[1],

    homepage.hero.images?.[2] ||
      defaultHomepage.hero.images[2],
  ].filter(Boolean);

  /*
   * Keep the selected hero index valid whenever
   * the effective image list changes.
   */
  useEffect(() => {
    setHeroImageIndex((current) => {
      if (heroImages.length === 0) {
        return 0;
      }

      return current % heroImages.length;
    });
  }, [
    heroImages.length,
    homepage.hero.images?.[0],
    homepage.hero.images?.[1],
    homepage.hero.images?.[2],
  ]);

  /*
   * Hero image rotation.
   */
  useEffect(() => {
    if (heroImages.length <= 1) {
      return;
    }

    const seconds = Math.max(
      2,
      homepage.hero.imageRotationSeconds || 6
    );

    const interval = window.setInterval(() => {
      setHeroImageIndex((current) =>
        current + 1 >= heroImages.length
          ? 0
          : current + 1
      );
    }, seconds * 1000);

    return () => window.clearInterval(interval);
  }, [
    heroImages.length,
    homepage.hero.imageRotationSeconds,
  ]);

  /*
   * Moving announcement rotation.
   *
   * Empty CMS announcement items are ignored.
   */
  const announcementItems =
    homepage.announcement.items?.filter(
      (item) => item.trim().length > 0
    ) || [];

  useEffect(() => {
    if (
      !homepage.announcement.enabled ||
      announcementItems.length <= 1
    ) {
      return;
    }

    const seconds = Math.max(
      2,
      homepage.announcement.rotationSeconds || 5
    );

    const interval = window.setInterval(() => {
      setAnnouncementIndex((current) =>
        current + 1 >= announcementItems.length
          ? 0
          : current + 1
      );
    }, seconds * 1000);

    return () => window.clearInterval(interval);
  }, [
    homepage.announcement.enabled,
    homepage.announcement.rotationSeconds,
    announcementItems.length,
  ]);

  /*
   * Make sure the announcement index remains
   * valid if the CMS content changes.
   */
  useEffect(() => {
    setAnnouncementIndex((current) => {
      if (announcementItems.length === 0) {
        return 0;
      }

      return current % announcementItems.length;
    });
  }, [
    announcementItems.length,
    homepage.announcement.items,
  ]);

  const currentHeroImage =
    heroImages.length > 0
      ? heroImages[
          heroImageIndex % heroImages.length
        ]
      : defaultHomepage.hero.images[0];

  const announcement =
    announcementItems.length > 0
      ? announcementItems[
          announcementIndex % announcementItems.length
        ]
      : "";

  /*
   * IMAGE FALLBACK HELPERS
   *
   * If a custom image is deleted, the CMS leaves
   * the field empty. These helpers immediately
   * restore the original default image.
   */
  const aboutImage =
    homepage.about.image ||
    defaultHomepage.about.image;

  const learningImage =
    homepage.learning.image ||
    defaultHomepage.learning.image;

  const cbtImage =
    homepage.cbt.image ||
    defaultHomepage.cbt.image;

  const battleImage =
    homepage.battle.image ||
    defaultHomepage.battle.image;

  const aiCoachImage =
    homepage.aiCoach.image ||
    defaultHomepage.aiCoach.image;

  const analyticsImage =
    homepage.analytics.image ||
    defaultHomepage.analytics.image;

  const communityImage =
    homepage.community.image ||
    defaultHomepage.community.image;

  const missionImage =
    homepage.mission.image ||
    defaultHomepage.mission.image;

  /*
   * Global logo.
   *
   * If no custom logo exists, the normal
   * JAMBMASTER text branding is displayed.
   */
  const customLogo =
    siteSettings.logo?.trim() || "";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9ff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-[#6d28d9]" />

          <p className="text-sm font-bold text-[#6d28d9]">
            Loading JAMBMASTER...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#faf9ff] text-[#171321]">
      {/* MOVING ANNOUNCEMENT */}
      {homepage.announcement.enabled &&
        announcement && (
          <div className="relative z-[60] overflow-hidden bg-[#24113f] text-white">
            <div className="announcement-track">
              <div className="mx-auto flex min-h-[38px] max-w-7xl items-center justify-center px-5 text-center">
                <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
                  <span className="status-dot" />

                  <span
                    key={`${announcementIndex}-${announcement}`}
                    className="announcement-message"
                  >
                    {announcement}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* NAVIGATION */}
      <header className="site-header">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-3"
          >
            {customLogo ? (
              <img
                src={customLogo}
                alt="JAMBMASTER"
                className="h-12 w-auto max-w-[190px] object-contain"
              />
            ) : (
              <div className="logo-placeholder">
                LOGO
              </div>
            )}

            <div>
              <div className="text-xl font-black tracking-tight text-[#24113f]">
                JAMB
                <span className="text-[#7c3aed]">
                  MASTER
                </span>
              </div>

              <div className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-[#81778e] sm:block">
                Prepare. Battle. Succeed.
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#62586e] lg:flex">
            <a href="#about" className="nav-link">
              About
            </a>

            <a
              href="#features"
              className="nav-link"
            >
              Features
            </a>

            <a
              href="#journey"
              className="nav-link"
            >
              How It Works
            </a>

            <a
              href="#mission"
              className="nav-link"
            >
              Our Mission
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-[#493b59] transition hover:bg-white sm:block"
            >
              Log in
            </a>

            <a
              href="/signup"
              className="rounded-xl bg-[#6d28d9] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-900/15 transition hover:-translate-y-0.5 hover:bg-[#5b21b6] sm:px-5"
            >
              Start Free
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section relative">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-28">
          <div className="relative z-10 fade-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#6d28d9] shadow-sm backdrop-blur">
              <span className="status-dot" />
              {homepage.hero.eyebrow}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-[#21132f] sm:text-6xl lg:text-[76px]">
              {formatHeroTitle(
                homepage.hero.title
              )}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#675d72] sm:text-lg sm:leading-8">
              {homepage.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={
                  homepage.hero
                    .primaryButtonLink
                }
                className="primary-button group"
              >
                {
                  homepage.hero
                    .primaryButtonText
                }

                <span className="button-arrow">
                  →
                </span>
              </a>

              <a
                href={
                  homepage.hero
                    .secondaryButtonLink
                }
                className="secondary-button"
              >
                {
                  homepage.hero
                    .secondaryButtonText
                }
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#6c6278]">
              <div className="flex items-center gap-2">
                <span className="check-circle">
                  ✓
                </span>
                Learn
              </div>

              <div className="flex items-center gap-2">
                <span className="check-circle">
                  ✓
                </span>
                Practise
              </div>

              <div className="flex items-center gap-2">
                <span className="check-circle">
                  ✓
                </span>
                Battle
              </div>

              <div className="flex items-center gap-2">
                <span className="check-circle">
                  ✓
                </span>
                Improve
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto fade-up delay-one">
            <div className="hero-image-wrap">
              <img
                key={currentHeroImage}
                src={currentHeroImage}
                alt="Students preparing for JAMB"
                className="hero-image hero-image-fade"
              />

              <div className="hero-image-overlay" />

              <div className="hero-caption">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                  Your preparation
                </div>

                <div className="mt-1 text-xl font-black text-white">
                  Starts with a system.
                </div>
              </div>

              {heroImages.length > 1 && (
                <div className="absolute bottom-5 right-5 z-20 flex gap-1.5">
                  {heroImages.map(
                    (_, index) => (
                      <button
                        key={index}
                        type="button"
                        aria-label={`Show hero image ${
                          index + 1
                        }`}
                        onClick={() =>
                          setHeroImageIndex(
                            index
                          )
                        }
                        className={`h-1.5 rounded-full transition-all ${
                          index ===
                          heroImageIndex
                            ? "w-7 bg-white"
                            : "w-2 bg-white/45"
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </div>

            <div className="floating-card floating-score">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#83768f]">
                    Target Score
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#261532]">
                    300+
                  </p>
                </div>

                <div className="score-ring">
                  <span>↑</span>
                </div>
              </div>
            </div>

            <div className="floating-card floating-battle">
              <div className="flex items-center gap-3">
                <div className="battle-icon">
                  ⚔
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#83768f]">
                    JAMB Battle
                  </p>

                  <p className="mt-0.5 text-sm font-black text-[#261532]">
                    Ready to compete?
                  </p>
                </div>
              </div>
            </div>

            <div className="hero-decoration">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-[#21132f] px-5 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-eyebrow section-eyebrow-light">
                The reality
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                JAMB should not decide your
                future because you were not
                properly prepared.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Many students do not fail
                because they cannot learn. They
                struggle because preparation can
                be scattered, stressful and
                difficult to measure. JAMBMASTER
                brings the important parts of
                preparation into one connected
                experience.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="dark-mini-card">
                  <strong>Learn</strong>
                  <span>with structure</span>
                </div>

                <div className="dark-mini-card">
                  <strong>Practise</strong>
                  <span>with purpose</span>
                </div>

                <div className="dark-mini-card">
                  <strong>Improve</strong>
                  <span>with evidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="about-image-frame">
                <img
                  src={aboutImage}
                  alt="Students learning together"
                  className="about-image"
                />
              </div>

              <div className="about-note">
                <span className="about-note-icon">
                  ★
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#81758d]">
                    The goal
                  </p>

                  <p className="mt-1 font-black text-[#291638]">
                    Make preparation easier.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="section-eyebrow">
                {homepage.about.eyebrow}
              </p>

              <h2 className="section-title">
                {homepage.about.title}
              </h2>

              <p className="section-copy">
                {homepage.about.description}
              </p>

              <p className="section-copy">
                From selecting four subjects and
                setting a target score to studying
                topics, taking CBTs, battling other
                students and analyzing performance,
                every part of the experience is
                designed around one objective:
                helping students become better
                prepared.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="about-point">
                  <span>01</span>
                  <div>
                    <strong>Student-first</strong>
                    <p>
                      Built around how students
                      actually prepare.
                    </p>
                  </div>
                </div>

                <div className="about-point">
                  <span>02</span>
                  <div>
                    <strong>Data-driven</strong>
                    <p>
                      Use performance to understand
                      what comes next.
                    </p>
                  </div>
                </div>

                <div className="about-point">
                  <span>03</span>
                  <div>
                    <strong>Competitive</strong>
                    <p>
                      Turn preparation into healthy
                      competition.
                    </p>
                  </div>
                </div>

                <div className="about-point">
                  <span>04</span>
                  <div>
                    <strong>Personal</strong>
                    <p>
                      Your subjects, goals, pace and
                      progress matter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section className="method-section px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">
              {homepage.method.eyebrow}
            </p>

            <h2 className="section-title">
              {homepage.method.title}
            </h2>

            <p className="section-copy mx-auto">
              {homepage.method.description}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MethodCard
              number="01"
              title="Learn"
              text="Build knowledge through structured subjects, topics, materials, resources and educational videos."
            />

            <MethodCard
              number="02"
              title="Practise"
              text="Reinforce what you learn with questions, topic practice and realistic timed CBT experiences."
            />

            <MethodCard
              number="03"
              title="Compete"
              text="Challenge yourself against other students and turn preparation into a motivating experience."
            />

            <MethodCard
              number="04"
              title="Improve"
              text="Understand your results, identify weak areas and use your data to prepare more intelligently."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-eyebrow">
              {homepage.features.eyebrow}
            </p>

            <h2 className="section-title">
              {homepage.features.title}
            </h2>

            <p className="section-copy">
              {homepage.features.description}
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.number}
                number={feature.number}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING FEATURE */}
      <section className="feature-showcase px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="section-eyebrow">
              {homepage.learning.eyebrow}
            </p>

            <h2 className="section-title">
              {homepage.learning.title}
            </h2>

            <p className="section-copy">
              {homepage.learning.description}
            </p>

            <ul className="feature-list">
              <li>
                Structured JAMB topics and learning
                paths
              </li>
              <li>
                E-textbooks and study resources
              </li>
              <li>
                Educational videos and materials
              </li>
              <li>
                Personal study goals and progress
              </li>
              <li>
                Topic-focused preparation
              </li>
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <div className="feature-image-card">
              <img
                src={learningImage}
                alt="Student studying on a laptop"
                className="feature-image"
              />

              <div className="subject-panel">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a7d96]">
                  Your subjects
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span>Mathematics</span>
                  <span>English</span>
                  <span>Physics</span>
                  <span>Biology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CBT */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="cbt-preview">
              <div className="cbt-top">
                <span>JAMBMASTER CBT</span>
                <span className="timer-pill">
                  42:18
                </span>
              </div>

              <div className="cbt-body">
                <div className="cbt-question">
                  <span>
                    QUESTION 18 OF 60
                  </span>

                  <h3>
                    Which of the following best
                    describes the relationship
                    between...
                  </h3>

                  <div className="answers">
                    <div>
                      A. Option one
                    </div>

                    <div>
                      B. Option two
                    </div>

                    <div className="answer-selected">
                      C. Option three
                    </div>

                    <div>
                      D. Option four
                    </div>
                  </div>
                </div>

                <div className="question-map">
                  <span className="active">
                    18
                  </span>

                  <span>19</span>
                  <span>20</span>
                  <span>21</span>
                  <span>22</span>
                  <span>23</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="section-eyebrow">
              {homepage.cbt.eyebrow}
            </p>

            <h2 className="section-title">
              {homepage.cbt.title}
            </h2>

            <p className="section-copy">
              {homepage.cbt.description}
            </p>

            <div className="info-grid">
              <InfoItem title="Timed CBTs" />
              <InfoItem title="Topic practice" />
              <InfoItem title="Mock examinations" />
              <InfoItem title="Instant results" />
              <InfoItem title="Question review" />
              <InfoItem title="Performance history" />
            </div>
          </div>
        </div>
      </section>

      {/* BATTLE */}
      <section
        id="battles"
        className="battle-section px-5 py-20 text-white sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="section-eyebrow section-eyebrow-gold">
              {homepage.battle.eyebrow}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {homepage.battle.title}
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              {homepage.battle.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="battle-tag">
                1 vs 1
              </span>

              <span className="battle-tag">
                5 Players
              </span>

              <span className="battle-tag">
                10 Players
              </span>

              <span className="battle-tag">
                20 Players
              </span>

              <span className="battle-tag">
                Leaderboards
              </span>
            </div>
          </div>

          <div className="battle-board">
            <div className="battle-board-header">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/45">
                  Live battle
                </p>

                <h3 className="mt-1 text-xl font-black">
                  JAMB Champions
                </h3>
              </div>

              <div className="live-pill">
                <span />
                LIVE
              </div>
            </div>

            <BattleRow
              position="01"
              name="You"
              score="284"
              active
            />

            <BattleRow
              position="02"
              name="Player 02"
              score="276"
            />

            <BattleRow
              position="03"
              name="Player 03"
              score="263"
            />

            <BattleRow
              position="04"
              name="Player 04"
              score="251"
            />

            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-xs font-semibold text-white/50">
              Compete. Learn. Improve.
            </div>
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="ai-card">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="section-eyebrow">
                  {homepage.aiCoach.eyebrow}
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#241331] sm:text-5xl">
                  {homepage.aiCoach.title}
                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-[#6d6275]">
                  {homepage.aiCoach.description}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <AiPoint text="Explain difficult questions" />
                  <AiPoint text="Recommend practice" />
                  <AiPoint text="Create study plans" />
                  <AiPoint text="Identify learning gaps" />
                </div>
              </div>

              <div className="ai-chat">
                <div className="ai-chat-header">
                  <div className="ai-avatar">
                    AI
                  </div>

                  <div>
                    <p className="font-black text-[#291638]">
                      JAMB Coach
                    </p>

                    <p className="text-xs text-[#8b7f91]">
                      Your preparation assistant
                    </p>
                  </div>
                </div>

                <div className="chat-message student-message">
                  I keep struggling with this
                  topic. What should I do?
                </div>

                <div className="chat-message ai-message">
                  Let&apos;s break it down. I can
                  explain the concept first, then
                  give you practice questions
                  focused on this area.
                </div>

                <div className="chat-input">
                  <span>
                    Ask your JAMB Coach...
                  </span>

                  <b>→</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="analytics-section px-5 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-eyebrow">
              {homepage.analytics.eyebrow}
            </p>

            <h2 className="section-title">
              {homepage.analytics.title}
            </h2>

            <p className="section-copy">
              {homepage.analytics.description}
            </p>

            <div className="mt-8 space-y-3">
              <ProgressPoint
                title="Subject mastery"
                text="See how you are performing across your subjects."
              />

              <ProgressPoint
                title="Weak topics"
                text="Identify areas that require more attention."
              />

              <ProgressPoint
                title="Score trends"
                text="Track how your performance changes over time."
              />

              <ProgressPoint
                title="Smart recommendations"
                text="Know what to focus on next."
              />
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-header">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8b7e95]">
                  Performance
                </p>

                <h3 className="mt-1 text-2xl font-black text-[#251431]">
                  Your progress
                </h3>
              </div>

              <div className="score-number">
                <strong>72%</strong>
                <span>overall</span>
              </div>
            </div>

            <div className="chart">
              <div className="chart-line">
                <span className="chart-point point-one" />
                <span className="chart-point point-two" />
                <span className="chart-point point-three" />
                <span className="chart-point point-four" />
                <span className="chart-point point-five" />
              </div>
            </div>

            <div className="analytics-subjects">
              <SubjectBar
                name="English"
                value="82%"
                width="82%"
              />

              <SubjectBar
                name="Mathematics"
                value="74%"
                width="74%"
              />

              <SubjectBar
                name="Physics"
                value="68%"
                width="68%"
              />

              <SubjectBar
                name="Biology"
                value="63%"
                width="63%"
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY + TUTORS */}
      <section className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="community-card">
              <div className="card-icon purple-icon">
                ◎
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-[#7c3aed]">
                {homepage.community.eyebrow}
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-[#251431]">
                {homepage.community.title}
              </h3>

              <p className="mt-4 leading-7 text-[#71667b]">
                {homepage.community.description}
              </p>

              <div className="community-post mt-8">
                <div className="community-avatar">
                  A
                </div>

                <div>
                  <p className="text-sm font-black text-[#33213e]">
                    Anonymous Student
                  </p>

                  <p className="mt-1 text-sm text-[#71667b]">
                    Just crossed my first 250+
                    practice score. Let&apos;s go!
                  </p>

                  <div className="mt-3 flex gap-4 text-xs font-bold text-[#8b7f92]">
                    <span>
                      ♡ Encourage
                    </span>

                    <span>
                      ⚔ Challenge
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="tutor-card">
              <div className="card-icon gold-icon">
                ✦
              </div>

              <p className="mt-7 text-xs font-bold uppercase tracking-[0.15em] text-[#a16207]">
                Tutors & live learning
              </p>

              <h3 className="mt-3 text-3xl font-black tracking-tight text-[#251431]">
                Learn with people who can guide
                you.
              </h3>

              <p className="mt-4 leading-7 text-[#71667b]">
                Students can discover tutors,
                explore tutor profiles, compare
                learning options, book sessions and
                participate in private or group live
                classes.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <TutorFeature text="Tutor profiles" />
                <TutorFeature text="Ratings" />
                <TutorFeature text="Private lessons" />
                <TutorFeature text="Live classes" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section
        id="journey"
        className="journey-section px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">
              Your JAMB journey
            </p>

            <h2 className="section-title">
              One preparation journey.
              <br />
              Built around you.
            </h2>

            <p className="section-copy mx-auto">
              JAMBMASTER connects each stage of
              preparation so that students can move
              forward instead of preparing without
              knowing what to do next.
            </p>
          </div>

          <div className="journey-grid mt-14">
            {journey.map((item) => (
              <div
                key={item.number}
                className="journey-item"
              >
                <div className="journey-number">
                  {item.number}
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section
        id="mission"
        className="mission-section px-5 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="section-eyebrow section-eyebrow-gold">
            {homepage.mission.eyebrow}
          </p>

          <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            {homepage.mission.title}
          </h2>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-white/65 sm:text-lg">
            {homepage.mission.description}
          </p>

          <div className="mt-10 inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white/80 backdrop-blur">
            Battle JAMB. Overcome Failure. Achieve
            Your Score.
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-20 sm:py-28">
        <div className="final-cta mx-auto max-w-6xl">
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#facc15]">
              Your preparation starts here
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
              {homepage.finalCta.title}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              {homepage.finalCta.description}
            </p>

            <a
              href={
                homepage.finalCta.buttonLink
              }
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-black text-[#5b21b6] transition hover:-translate-y-1"
            >
              {homepage.finalCta.buttonText}

              <span>→</span>
            </a>
          </div>

          <div className="cta-shape cta-shape-one" />
          <div className="cta-shape cta-shape-two" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#e9e4ee] bg-white px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {customLogo ? (
              <img
                src={customLogo}
                alt="JAMBMASTER"
                className="h-12 w-auto max-w-[190px] object-contain"
              />
            ) : (
              <div className="text-xl font-black tracking-tight text-[#24113f]">
                JAMB
                <span className="text-[#7c3aed]">
                  MASTER
                </span>
              </div>
            )}

            <p className="mt-2 max-w-xl text-sm text-[#81778e]">
              {homepage.footer.description}
            </p>

            <p className="mt-3 text-xs font-bold text-[#7c3aed]">
              Managed by{" "}
              {homepage.footer.managedBy}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-[#706579]">
            <a
              href="#about"
              className="footer-link"
            >
              About
            </a>

            <a
              href="#features"
              className="footer-link"
            >
              Features
            </a>

            <a
              href="#journey"
              className="footer-link"
            >
              How It Works
            </a>

            <a
              href="/blog"
              className="footer-link"
            >
              Blog
            </a>

            <a
              href="/login"
              className="footer-link"
            >
              Login
            </a>

            <a
              href="/signup"
              className="footer-link"
            >
              Sign Up
            </a>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#eeeaf1] pt-6 text-xs text-[#9b92a3]">
          {homepage.footer.copyright}
        </div>
      </footer>
    </main>
  );
}

/*
 * Allows the CMS title to retain a strong visual hierarchy.
 * If the title contains line breaks, they are respected.
 */
function formatHeroTitle(title: string) {
  const parts = title.split("\n");

  if (parts.length === 1) {
    return title;
  }

  return parts.map((part, index) => (
    <span
      key={`${part}-${index}`}
      className="block"
    >
      {index === 1 ? (
        <span className="gradient-text">
          {part}
        </span>
      ) : (
        part
      )}
    </span>
  ));
}

function MethodCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="method-card">
      <div className="method-number">
        {number}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="feature-card">
      <div className="flex items-start justify-between gap-4">
        <div
          className={`feature-icon icon-${icon}`}
        >
          {icon === "book" && "▣"}
          {icon === "monitor" && "▤"}
          {icon === "swords" && "⚔"}
          {icon === "spark" && "✦"}
          {icon === "chart" && "↗"}
          {icon === "users" && "◎"}
        </div>

        <span className="feature-number">
          {number}
        </span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="feature-line" />
    </div>
  );
}

function InfoItem({
  title,
}: {
  title: string;
}) {
  return (
    <div className="info-item">
      <span>✓</span>
      {title}
    </div>
  );
}

function BattleRow({
  position,
  name,
  score,
  active = false,
}: {
  position: string;
  name: string;
  score: string;
  active?: boolean;
}) {
  return (
    <div
      className={`battle-row ${
        active ? "battle-row-active" : ""
      }`}
    >
      <span className="battle-position">
        {position}
      </span>

      <div className="battle-player">
        <div className="player-avatar">
          {name.charAt(0)}
        </div>

        <span>{name}</span>
      </div>

      <strong>{score}</strong>
    </div>
  );
}

function AiPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="ai-point">
      <span>✓</span>
      {text}
    </div>
  );
}

function ProgressPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="progress-point">
      <span>✓</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SubjectBar({
  name,
  value,
  width,
}: {
  name: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold">
        <span className="text-[#5f5469]">
          {name}
        </span>

        <span className="text-[#7c3aed]">
          {value}
        </span>
      </div>

      <div className="subject-track">
        <div
          className="subject-fill"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function TutorFeature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#eadfc9] bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#715a2d]">
      ✓ {text}
    </div>
  );
}
