"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultHomepage } from "@/lib/default-homepage";
import { HomepageSettings } from "@/lib/cms";

export default function HomepageEditor() {
  const [data, setData] = useState<HomepageSettings>(defaultHomepage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomepage() {
      try {
        const ref = doc(db, "siteSettings", "homepage");
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          const savedData = snapshot.data() as Partial<HomepageSettings>;

          setData({
            ...defaultHomepage,
            ...savedData,
            announcement: {
              ...defaultHomepage.announcement,
              ...(savedData.announcement || {}),
            },
            hero: {
              ...defaultHomepage.hero,
              ...(savedData.hero || {}),
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
      } catch (err) {
        console.error("Failed to load homepage:", err);
        setError("Unable to load homepage settings.");
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  async function saveHomepage() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      await setDoc(doc(db, "siteSettings", "homepage"), data);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save homepage:", err);
      setError("Unable to save homepage. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateSection<
    T extends keyof HomepageSettings
  >(
    section: T,
    field: keyof HomepageSettings[T],
    value: string
  ) {
    setData((current) => ({
      ...current,
      [section]: {
        ...(current[section] as object),
        [field]: value,
      },
    }));
  }

  function updateNumber(
    section: "announcement" | "hero",
    field: "rotationSeconds" | "imageRotationSeconds",
    value: number
  ) {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  function updateAnnouncementItems(value: string) {
    setData((current) => ({
      ...current,
      announcement: {
        ...current.announcement,
        items: value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  }

  function updateHeroImages(value: string) {
    setData((current) => ({
      ...current,
      hero: {
        ...current.hero,
        images: value
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  }

  function updateBoolean(
    section: "announcement",
    field: "enabled",
    value: boolean
  ) {
    setData((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />

          <p className="font-bold text-violet-700">
            Loading Homepage Editor...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff]">
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              JAMBMASTER CMS
            </p>

            <h1 className="text-xl font-black text-gray-950 sm:text-2xl">
              Homepage Editor
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => window.open("/", "_blank")}
              className="hidden rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 sm:block"
            >
              View Website
            </button>

            <button
              type="button"
              onClick={saveHomepage}
              disabled={saving}
              className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
            >
              {saving
                ? "Saving..."
                : saved
                  ? "Saved ✓"
                  : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-5 py-8">
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-700 to-purple-900 p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
            Website Content Management
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Control your entire homepage
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-violet-100">
            Every major section below is connected to the public
            JAMBMASTER homepage. Change the content, save it, and the
            website will use the updated information.
          </p>
        </div>

        {/* ANNOUNCEMENT */}
        <EditorSection
          title="Moving Announcement"
          description="Control the announcement bar displayed at the top of the homepage."
        >
          <Toggle
            label="Show announcement"
            value={data.announcement.enabled}
            onChange={(value) =>
              updateBoolean("announcement", "enabled", value)
            }
          />

          <Input
            label="Announcements"
            value={data.announcement.items.join("\n")}
            multiline
            onChange={updateAnnouncementItems}
            help="Enter one announcement per line."
          />

          <NumberInput
            label="Rotation speed"
            value={data.announcement.rotationSeconds}
            onChange={(value) =>
              updateNumber(
                "announcement",
                "rotationSeconds",
                value
              )
            }
          />
        </EditorSection>

        {/* HERO */}
        <EditorSection
          title="Hero Section"
          description="This is the main section visitors see when they enter JAMBMASTER."
        >
          <Input
            label="Eyebrow"
            value={data.hero.eyebrow}
            onChange={(value) =>
              updateSection("hero", "eyebrow", value)
            }
          />

          <Input
            label="Main heading"
            value={data.hero.title}
            multiline
            onChange={(value) =>
              updateSection("hero", "title", value)
            }
            help="You can use line breaks to control how the heading appears."
          />

          <Input
            label="Description"
            value={data.hero.description}
            multiline
            onChange={(value) =>
              updateSection("hero", "description", value)
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Primary button text"
              value={data.hero.primaryButtonText}
              onChange={(value) =>
                updateSection(
                  "hero",
                  "primaryButtonText",
                  value
                )
              }
            />

            <Input
              label="Primary button link"
              value={data.hero.primaryButtonLink}
              onChange={(value) =>
                updateSection(
                  "hero",
                  "primaryButtonLink",
                  value
                )
              }
            />

            <Input
              label="Secondary button text"
              value={data.hero.secondaryButtonText}
              onChange={(value) =>
                updateSection(
                  "hero",
                  "secondaryButtonText",
                  value
                )
              }
            />

            <Input
              label="Secondary button link"
              value={data.hero.secondaryButtonLink}
              onChange={(value) =>
                updateSection(
                  "hero",
                  "secondaryButtonLink",
                  value
                )
              }
            />
          </div>

          <Input
            label="Hero image URLs"
            value={data.hero.images.join("\n")}
            multiline
            onChange={updateHeroImages}
            help="Enter one image URL per line. Cloudinary Media Manager will be connected later."
          />

          <NumberInput
            label="Image rotation speed"
            value={data.hero.imageRotationSeconds}
            onChange={(value) =>
              updateNumber(
                "hero",
                "imageRotationSeconds",
                value
              )
            }
          />
        </EditorSection>

        {/* ABOUT */}
        <ContentSection
          title="About JAMBMASTER"
          section={data.about}
          imageLabel="About section image"
          onChange={(field, value) =>
            updateSection("about", field, value)
          }
        />

        {/* METHOD */}
        <TextOnlySection
          title="JAMBMASTER Method"
          section={data.method}
          onChange={(field, value) =>
            updateSection("method", field, value)
          }
        />

        {/* FEATURES */}
        <TextOnlySection
          title="Features Section"
          section={data.features}
          onChange={(field, value) =>
            updateSection("features", field, value)
          }
        />

        {/* LEARNING */}
        <ContentSection
          title="Learning Section"
          section={data.learning}
          imageLabel="Learning section image"
          onChange={(field, value) =>
            updateSection("learning", field, value)
          }
        />

        {/* CBT */}
        <ContentSection
          title="CBT Practice Section"
          section={data.cbt}
          imageLabel="CBT section image"
          onChange={(field, value) =>
            updateSection("cbt", field, value)
          }
        />

        {/* BATTLE */}
        <ContentSection
          title="Battle Arena Section"
          section={data.battle}
          imageLabel="Battle section image"
          onChange={(field, value) =>
            updateSection("battle", field, value)
          }
        />

        {/* AI */}
        <ContentSection
          title="AI JAMB Coach Section"
          section={data.aiCoach}
          imageLabel="AI Coach section image"
          onChange={(field, value) =>
            updateSection("aiCoach", field, value)
          }
        />

        {/* ANALYTICS */}
        <ContentSection
          title="Analytics Section"
          section={data.analytics}
          imageLabel="Analytics section image"
          onChange={(field, value) =>
            updateSection("analytics", field, value)
          }
        />

        {/* COMMUNITY */}
        <ContentSection
          title="Community Section"
          section={data.community}
          imageLabel="Community section image"
          onChange={(field, value) =>
            updateSection("community", field, value)
          }
        />

        {/* MISSION */}
        <ContentSection
          title="Mission Section"
          section={data.mission}
          imageLabel="Mission section image"
          onChange={(field, value) =>
            updateSection("mission", field, value)
          }
        />

        {/* FINAL CTA */}
        <EditorSection
          title="Final Call To Action"
          description="Control the final conversion section before the footer."
        >
          <Input
            label="Title"
            value={data.finalCta.title}
            multiline
            onChange={(value) =>
              updateSection("finalCta", "title", value)
            }
          />

          <Input
            label="Description"
            value={data.finalCta.description}
            multiline
            onChange={(value) =>
              updateSection(
                "finalCta",
                "description",
                value
              )
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Button text"
              value={data.finalCta.buttonText}
              onChange={(value) =>
                updateSection(
                  "finalCta",
                  "buttonText",
                  value
                )
              }
            />

            <Input
              label="Button link"
              value={data.finalCta.buttonLink}
              onChange={(value) =>
                updateSection(
                  "finalCta",
                  "buttonLink",
                  value
                )
              }
            />
          </div>
        </EditorSection>

        {/* FOOTER */}
        <EditorSection
          title="Footer"
          description="Manage the information displayed at the bottom of the website."
        >
          <Input
            label="Footer description"
            value={data.footer.description}
            multiline
            onChange={(value) =>
              updateSection(
                "footer",
                "description",
                value
              )
            }
          />

          <Input
            label="Managed by"
            value={data.footer.managedBy}
            onChange={(value) =>
              updateSection(
                "footer",
                "managedBy",
                value
              )
            }
          />

          <Input
            label="Copyright"
            value={data.footer.copyright}
            onChange={(value) =>
              updateSection(
                "footer",
                "copyright",
                value
              )
            }
          />
        </EditorSection>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <p className="text-sm font-bold text-green-900">
            Homepage CMS connected
          </p>

          <p className="mt-1 text-sm leading-6 text-green-700">
            Changes saved here are stored in Firestore and used by
            the public JAMBMASTER homepage.
          </p>
        </div>
      </div>
    </main>
  );
}

type TextSection = {
  eyebrow: string;
  title: string;
  description: string;
};

type ContentSectionData = TextSection & {
  image: string;
};

function ContentSection({
  title,
  section,
  imageLabel,
  onChange,
}: {
  title: string;
  section: ContentSectionData;
  imageLabel: string;
  onChange: (
    field: keyof ContentSectionData,
    value: string
  ) => void;
}) {
  return (
    <EditorSection
      title={title}
      description={`Edit the text and image used in the ${title.toLowerCase()}.`}
    >
      <Input
        label="Eyebrow"
        value={section.eyebrow}
        onChange={(value) => onChange("eyebrow", value)}
      />

      <Input
        label="Title"
        value={section.title}
        multiline
        onChange={(value) => onChange("title", value)}
      />

      <Input
        label="Description"
        value={section.description}
        multiline
        onChange={(value) =>
          onChange("description", value)
        }
      />

      <Input
        label={imageLabel}
        value={section.image}
        onChange={(value) => onChange("image", value)}
        help="Cloudinary Media Manager will replace direct URL entry later."
      />

      {section.image && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
          <img
            src={section.image}
            alt={`${title} preview`}
            className="h-52 w-full object-cover"
          />
        </div>
      )}
    </EditorSection>
  );
}

function TextOnlySection({
  title,
  section,
  onChange,
}: {
  title: string;
  section: TextSection;
  onChange: (
    field: keyof TextSection,
    value: string
  ) => void;
}) {
  return (
    <EditorSection
      title={title}
      description={`Edit the text displayed in the ${title.toLowerCase()}.`}
    >
      <Input
        label="Eyebrow"
        value={section.eyebrow}
        onChange={(value) => onChange("eyebrow", value)}
      />

      <Input
        label="Title"
        value={section.title}
        multiline
        onChange={(value) => onChange("title", value)}
      />

      <Input
        label="Description"
        value={section.description}
        multiline
        onChange={(value) =>
          onChange("description", value)
        }
      />
    </EditorSection>
  );
}

function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-black text-gray-950">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <div className="space-y-5">
        {children}
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  multiline = false,
  help,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  help?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          rows={5}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      ) : (
        <input
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      )}

      {help && (
        <p className="mt-2 text-xs leading-5 text-gray-400">
          {help}
        </p>
      )}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-800">
        {label}
      </label>

      <input
        type="number"
        min={1}
        max={60}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
      <span className="text-sm font-bold text-gray-800">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!value)}
        aria-label={label}
        aria-pressed={value}
        className={`relative h-7 w-12 rounded-full transition ${
          value ? "bg-violet-700" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            value ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
