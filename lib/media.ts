import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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
  createdAt?: Timestamp | null;
  uploadedBy?: string;
};

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
