import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type MediaPurpose =
  | "logo"
  | "favicon"
  | "hero_1"
  | "hero_2"
  | "hero_3"
  | "about"
  | "learning"
  | "cbt"
  | "battle"
  | "aiCoach"
  | "analytics"
  | "community"
  | "mission"
  | "other";

export type MediaItem = {
  id: string;
  url: string;
  publicId: string;
  fileName: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  purpose: MediaPurpose;
  location: string;
  homepageSlot?: number | null;
  createdAt?: Timestamp | null;
  uploadedBy?: string;
};

export const MEDIA_PURPOSES: {
  value: MediaPurpose;
  label: string;
  description: string;
}[] = [
  {
    value: "logo",
    label: "Logo",
    description: "Main JAMBMASTER website logo.",
  },
  {
    value: "favicon",
    label: "Favicon",
    description: "Small icon displayed in the browser tab.",
  },
  {
    value: "hero_1",
    label: "Hero Image 1",
    description: "First rotating homepage hero image.",
  },
  {
    value: "hero_2",
    label: "Hero Image 2",
    description: "Second rotating homepage hero image.",
  },
  {
    value: "hero_3",
    label: "Hero Image 3",
    description: "Third rotating homepage hero image.",
  },
  {
    value: "about",
    label: "About Section",
    description: "Homepage About JAMBMASTER image.",
  },
  {
    value: "learning",
    label: "Learning Section",
    description: "Homepage Learning section image.",
  },
  {
    value: "cbt",
    label: "CBT Section",
    description: "Homepage CBT Practice section image.",
  },
  {
    value: "battle",
    label: "Battle Arena",
    description: "Homepage Battle Arena section image.",
  },
  {
    value: "aiCoach",
    label: "AI JAMB Coach",
    description: "Homepage AI Coach section image.",
  },
  {
    value: "analytics",
    label: "Analytics Section",
    description: "Homepage Analytics section image.",
  },
  {
    value: "community",
    label: "Community Section",
    description: "Homepage Community section image.",
  },
  {
    value: "mission",
    label: "Mission Section",
    description: "Homepage Mission section image.",
  },
  {
    value: "other",
    label: "Other",
    description: "General website media.",
  },
];

export async function getMediaItems(): Promise<MediaItem[]> {
  const mediaQuery = query(
    collection(db, "media"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(mediaQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<MediaItem, "id">),
  }));
}

export async function saveMediaItem(
  item: Omit<MediaItem, "id" | "createdAt">
) {
  const mediaRef = await addDoc(collection(db, "media"), {
    ...item,
    createdAt: serverTimestamp(),
  });

  return mediaRef.id;
}

export async function deleteMediaItem(
  mediaId: string
) {
  await deleteDoc(doc(db, "media", mediaId));
}

export async function assignMediaToHomepage(
  media: MediaItem
) {
  const homepageRef = doc(
    db,
    "siteSettings",
    "homepage"
  );

  if (media.purpose === "logo") {
    await setDoc(
      doc(db, "siteSettings", "site"),
      {
        logo: media.url,
        logoMediaId: media.id,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return;
  }

  if (media.purpose === "favicon") {
    await setDoc(
      doc(db, "siteSettings", "site"),
      {
        favicon: media.url,
        faviconMediaId: media.id,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return;
  }

  if (
    media.purpose === "hero_1" ||
    media.purpose === "hero_2" ||
    media.purpose === "hero_3"
  ) {
    const slot =
      media.purpose === "hero_1"
        ? 0
        : media.purpose === "hero_2"
          ? 1
          : 2;

    const homepageSnapshot = await getDoc(
      homepageRef
    );

    const existingData = homepageSnapshot.exists()
      ? homepageSnapshot.data()
      : {};

    const existingHero = existingData.hero || {};

    const existingImages = Array.isArray(
      existingHero.images
    )
      ? [...existingHero.images]
      : [];

    while (existingImages.length < 3) {
      existingImages.push("");
    }

    existingImages[slot] = media.url;

    await setDoc(
      homepageRef,
      {
        hero: {
          ...existingHero,
          images: existingImages,
        },
      },
      { merge: true }
    );

    return;
  }

  const sectionMap: Record<
    string,
    string
  > = {
    about: "about",
    learning: "learning",
    cbt: "cbt",
    battle: "battle",
    aiCoach: "aiCoach",
    analytics: "analytics",
    community: "community",
    mission: "mission",
  };

  const section = sectionMap[media.purpose];

  if (!section) {
    return;
  }

  await setDoc(
    homepageRef,
    {
      [section]: {
        image: media.url,
      },
    },
    { merge: true }
  );
}
