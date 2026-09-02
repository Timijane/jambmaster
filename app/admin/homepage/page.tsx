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

  useEffect(() => {
    async function loadHomepage() {
      try {
        const ref = doc(db, "siteSettings", "homepage");
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setData(snapshot.data() as HomepageSettings);
        }
      } catch (error) {
        console.error("Failed to load homepage:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  async function saveHomepage() {
    setSaving(true);
    setSaved(false);

    try {
      await setDoc(doc(db, "siteSettings", "homepage"), data);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save homepage:", error);
      alert("Unable to save homepage.");
    } finally {
      setSaving(false);
    }
  }

  function updateHero(
    field: keyof HomepageSettings["hero"],
    value: string | number | string[]
  ) {
    setData((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }));
  }

  function updateAnnouncement(
    field: keyof HomepageSettings["announcement"],
    value: boolean | number | string[]
  ) {
    setData((current) => ({
      ...current,
      announcement: {
        ...current.announcement,
        [field]: value,
      },
    }));
  }

  function updateFooter(
    field: keyof HomepageSettings["footer"],
    value: string
  ) {
    setData((current) => ({
      ...current,
      footer: {
        ...current.footer,
        [field]: value,
      },
    }));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <p className="font-semibold text-violet-700">
          Loading Homepage Editor...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff]">
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              JAMBMASTER CMS
            </p>

            <h1 className="text-xl font-black text-gray-950">
              Homepage Editor
            </h1>
          </div>

          <button
            onClick={saveHomepage}
            disabled={saving}
            className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:opacity-60"
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-5 py-8">

        {/* Announcement */}
        <EditorSection
          title="Moving Announcement"
          description="Control the announcement displayed at the top of the homepage."
        >
          <Toggle
            label="Show announcement"
            value={data.announcement.enabled}
            onChange={(value) =>
              updateAnnouncement("enabled", value)
            }
          />

          <Input
            label="Announcements"
            value={data.announcement.items.join("\n")}
            multiline
            onChange={(value) =>
              updateAnnouncement(
                "items",
                value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
            help="Put each announcement on a separate line."
          />

          <NumberInput
            label="Rotation speed (seconds)"
            value={data.announcement.rotationSeconds}
            onChange={(value) =>
              updateAnnouncement("rotationSeconds", value)
            }
          />
        </EditorSection>

        {/* Hero */}
        <EditorSection
          title="Hero Section"
          description="Edit the main section visitors see when they enter JAMBMASTER."
        >
          <Input
            label="Eyebrow"
            value={data.hero.eyebrow}
            onChange={(value) => updateHero("eyebrow", value)}
          />

          <Input
            label="Main heading"
            value={data.hero.title}
            multiline
            onChange={(value) => updateHero("title", value)}
          />

          <Input
            label="Description"
            value={data.hero.description}
            multiline
            onChange={(value) => updateHero("description", value)}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Primary button text"
              value={data.hero.primaryButtonText}
              onChange={(value) =>
                updateHero("primaryButtonText", value)
              }
            />

            <Input
              label="Primary button link"
              value={data.hero.primaryButtonLink}
              onChange={(value) =>
                updateHero("primaryButtonLink", value)
              }
            />

            <Input
              label="Secondary button text"
              value={data.hero.secondaryButtonText}
              onChange={(value) =>
                updateHero("secondaryButtonText", value)
              }
            />

            <Input
              label="Secondary button link"
              value={data.hero.secondaryButtonLink}
              onChange={(value) =>
                updateHero("secondaryButtonLink", value)
              }
            />
          </div>

          <Input
            label="Hero image URLs"
            value={data.hero.images.join("\n")}
            multiline
            onChange={(value) =>
              updateHero(
                "images",
                value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
            help="Media Manager will replace this with image selection later."
          />

          <NumberInput
            label="Image rotation speed (seconds)"
            value={data.hero.imageRotationSeconds}
            onChange={(value) =>
              updateHero("imageRotationSeconds", value)
            }
          />
        </EditorSection>

        {/* Footer */}
        <EditorSection
          title="Footer"
          description="Manage the text displayed at the bottom of the website."
        >
          <Input
            label="Footer description"
            value={data.footer.description}
            multiline
            onChange={(value) =>
              updateFooter("description", value)
            }
          />

          <Input
            label="Managed by"
            value={data.footer.managedBy}
            onChange={(value) =>
              updateFooter("managedBy", value)
            }
          />

          <Input
            label="Copyright"
            value={data.footer.copyright}
            onChange={(value) =>
              updateFooter("copyright", value)
            }
          />
        </EditorSection>

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-sm font-bold text-violet-900">
            More homepage controls are coming into this editor as we
            connect the remaining sections and the Media Manager.
          </p>

          <p className="mt-2 text-sm leading-6 text-violet-700">
            Your existing homepage design will remain intact while we
            progressively move its content into the CMS.
          </p>
        </div>

      </div>
    </main>
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
    <section className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-7">
        <h2 className="text-xl font-black text-gray-950">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
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
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      )}

      {help && (
        <p className="mt-2 text-xs text-gray-400">
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
