"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  assignMediaToHomepage,
  deleteMediaItem,
  getMediaItems,
  MEDIA_PURPOSES,
  MediaItem,
  MediaPurpose,
  saveMediaItem,
} from "@/lib/media";

const CLOUDINARY_CLOUD_NAME = "dmbjrohtn";
const CLOUDINARY_UPLOAD_PRESET = "pelumi";

export default function MediaManagerPage() {
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [selectedPurpose, setSelectedPurpose] =
    useState<MediaPurpose>("other");

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedMedia, setSelectedMedia] =
    useState<MediaItem | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          router.replace("/admin/login");
          return;
        }

        try {
          const adminRef = doc(
            db,
            "adminUsers",
            currentUser.uid
          );

          const adminSnapshot =
            await getDoc(adminRef);

          if (
            !adminSnapshot.exists() ||
            adminSnapshot.data().active !== true
          ) {
            await signOut(auth);
            router.replace(
              "/admin/login?error=unauthorized"
            );
            return;
          }

          setUser(currentUser);
          setCheckingAuth(false);

          await loadMedia();
        } catch (err) {
          console.error(
            "Admin verification error:",
            err
          );

          await signOut(auth);
          router.replace(
            "/admin/login?error=authorization"
          );
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  async function loadMedia() {
    setLoadingMedia(true);
    setError("");

    try {
      const items = await getMediaItems();
      setMedia(items);
    } catch (err) {
      console.error(
        "Failed to load media:",
        err
      );

      setError(
        "Unable to load the media library."
      );
    } finally {
      setLoadingMedia(false);
    }
  }

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    setSelectedFiles(Array.from(files));
    setMessage("");
    setError("");
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      setError(
        "Please select at least one image."
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage("");
    setError("");

    try {
      for (
        let index = 0;
        index < selectedFiles.length;
        index++
      ) {
        const file = selectedFiles[index];

        const uploaded = await uploadToCloudinary(
          file
        );

        const mediaId =
          await saveMediaItem({
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
            fileName: file.name,
            resourceType:
              uploaded.resource_type || "image",
            format: uploaded.format || "",
            bytes:
              uploaded.bytes || file.size,
            width: uploaded.width,
            height: uploaded.height,
            purpose: selectedPurpose,
            location:
              selectedPurpose === "other"
                ? "general"
                : selectedPurpose === "logo" ||
                    selectedPurpose === "favicon"
                  ? "site"
                  : "homepage",
            homepageSlot:
              getHomepageSlot(selectedPurpose),
            uploadedBy:
              user?.email || "",
          });

        const savedMedia: MediaItem = {
          id: mediaId,
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          fileName: file.name,
          resourceType:
            uploaded.resource_type || "image",
          format: uploaded.format || "",
          bytes:
            uploaded.bytes || file.size,
          width: uploaded.width,
          height: uploaded.height,
          purpose: selectedPurpose,
          location:
            selectedPurpose === "other"
              ? "general"
              : selectedPurpose === "logo" ||
                  selectedPurpose === "favicon"
                ? "site"
                : "homepage",
          homepageSlot:
            getHomepageSlot(selectedPurpose),
          uploadedBy:
            user?.email || "",
        };

        await assignMediaToHomepage(
          savedMedia
        );

        setUploadProgress(
          Math.round(
            ((index + 1) /
              selectedFiles.length) *
              100
          )
        );
      }

      const purposeLabel =
        getPurposeLabel(selectedPurpose);

      setMessage(
        `${selectedFiles.length} ${
          selectedFiles.length === 1
            ? "image"
            : "images"
        } uploaded and assigned to ${purposeLabel}.`
      );

      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadMedia();
    } catch (err) {
      console.error(
        "Upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(
    item: MediaItem
  ) {
    const confirmed =
      window.confirm(
        `Delete "${item.fileName}" from the JAMBMASTER media library?\n\nThis removes the Firestore media record. The Cloudinary file will remain until secure server-side deletion is added.`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMediaItem(item.id);

      setMedia((current) =>
        current.filter(
          (mediaItem) =>
            mediaItem.id !== item.id
        )
      );

      if (
        selectedMedia?.id === item.id
      ) {
        setSelectedMedia(null);
      }

      setMessage(
        "Media record deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete error:",
        err
      );

      setError(
        "Unable to delete the media record."
      );
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(
        url
      );

      setMessage(
        "Image URL copied to clipboard."
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch {
      setError(
        "Unable to copy the URL."
      );
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />

          <p className="font-bold text-violet-700">
            Securing Media Manager...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ff]">
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <button
            type="button"
            onClick={() =>
              router.push("/admin")
            }
            className="text-left"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              JAMBMASTER CMS
            </p>

            <h1 className="text-xl font-black text-gray-950 sm:text-2xl">
              Media Manager
            </h1>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/homepage"
                )
              }
              className="hidden rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50 sm:block"
            >
              Homepage CMS
            </button>

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800"
            >
              Choose Image
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        {/* UPLOAD PANEL */}
        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              Add Website Media
            </p>

            <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">
              Upload and assign an image
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
              Tell JAMBMASTER exactly where the image
              belongs before uploading it. The system
              will store the image in Cloudinary and
              automatically assign it to the selected
              website location.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Where should this image be used?
              </label>

              <select
                value={selectedPurpose}
                onChange={(event) =>
                  setSelectedPurpose(
                    event.target
                      .value as MediaPurpose
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-100"
              >
                {MEDIA_PURPOSES.map(
                  (purpose) => (
                    <option
                      key={purpose.value}
                      value={purpose.value}
                    >
                      {purpose.label}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs leading-5 text-gray-400">
                {
                  MEDIA_PURPOSES.find(
                    (item) =>
                      item.value ===
                      selectedPurpose
                  )?.description
                }
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Selected image
              </label>

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="flex min-h-[54px] w-full items-center justify-between rounded-xl border border-dashed border-violet-200 bg-violet-50 px-4 py-3 text-left transition hover:border-violet-400 hover:bg-violet-100"
              >
                <div>
                  <p className="text-sm font-bold text-violet-800">
                    {selectedFiles.length > 0
                      ? `${selectedFiles.length} image${
                          selectedFiles.length >
                          1
                            ? "s"
                            : ""
                        } selected`
                      : "Choose image"}
                  </p>

                  <p className="mt-1 text-xs text-violet-500">
                    JPG, PNG, WEBP and other
                    supported image formats
                  </p>
                </div>

                <span className="text-lg text-violet-700">
                  +
                </span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={
              selectedPurpose === "hero_1" ||
              selectedPurpose === "hero_2" ||
              selectedPurpose === "hero_3"
                ? false
                : true
            }
            className="hidden"
            onChange={handleFileSelection}
          />

          {selectedFiles.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Selected Files
              </p>

              <div className="mt-3 space-y-2">
                {selectedFiles.map(
                  (file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                    >
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {file.name}
                      </p>

                      <p className="ml-4 shrink-0 text-xs text-gray-400">
                        {formatBytes(
                          file.size
                        )}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleUpload}
              disabled={
                uploading ||
                selectedFiles.length === 0
              }
              className="rounded-xl bg-gradient-to-r from-violet-700 to-purple-900 px-6 py-3.5 font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? `Uploading ${uploadProgress}%...`
                : "Upload to Homepage"}
            </button>

            {selectedFiles.length > 0 &&
              !uploading && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFiles([]);

                    if (
                      fileInputRef.current
                    ) {
                      fileInputRef.current.value =
                        "";
                    }
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  Clear Selection
                </button>
              )}
          </div>

          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">
                  Uploading and assigning...
                </span>

                <span className="text-violet-700">
                  {uploadProgress}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-violet-700 transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {message && (
          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* LIBRARY */}
        <section className="mt-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
                Media Library
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Uploaded Website Images
              </h2>
            </div>

            <div className="rounded-full bg-violet-100 px-4 py-2 text-xs font-black text-violet-700">
              {media.length} items
            </div>
          </div>

          {loadingMedia ? (
            <div className="rounded-3xl border border-violet-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />

              <p className="text-sm font-bold text-gray-600">
                Loading media library...
              </p>
            </div>
          ) : media.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-violet-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-700">
                ▣
              </div>

              <h3 className="mt-5 text-xl font-black text-gray-950">
                No media yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Upload your first JAMBMASTER image
                using the assignment system above.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {media.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onSelect={() =>
                    setSelectedMedia(item)
                  }
                  onCopy={() =>
                    copyUrl(item.url)
                  }
                  onDelete={() =>
                    handleDelete(item)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </section>

      {selectedMedia && (
        <MediaDetails
          item={selectedMedia}
          onClose={() =>
            setSelectedMedia(null)
          }
          onCopy={() =>
            copyUrl(selectedMedia.url)
          }
        />
      )}

      <footer className="mt-10 border-t border-violet-100 bg-white py-7">
        <div className="mx-auto max-w-7xl px-5 text-center">
          <p className="text-sm font-bold text-gray-700">
            JAMBMASTER Media Manager
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Managed by Triangletech
          </p>
        </div>
      </footer>
    </main>
  );
}

async function uploadToCloudinary(
  file: File
) {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      "Cloudinary cloud name is missing."
    );
  }

  if (!CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary upload preset is missing."
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary response:",
      result
    );

    throw new Error(
      result?.error?.message ||
        "Cloudinary upload failed."
    );
  }

  return result;
}

function MediaCard({
  item,
  onSelect,
  onCopy,
  onDelete,
}: {
  item: MediaItem;
  onSelect: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={item.url}
            alt={item.fileName}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          <div className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur">
            {getPurposeLabel(
              item.purpose
            )}
          </div>
        </div>
      </button>

      <div className="p-4">
        <p
          className="truncate text-sm font-black text-gray-900"
          title={item.fileName}
        >
          {item.fileName}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {formatBytes(item.bytes)}
          {item.width && item.height
            ? ` • ${item.width} × ${item.height}`
            : ""}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onSelect}
            className="flex-1 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
          >
            Details
          </button>

          <button
            type="button"
            onClick={onCopy}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold text-gray-600 transition hover:border-violet-200 hover:text-violet-700"
          >
            Copy
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-red-100 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaDetails({
  item,
  onClose,
  onCopy,
}: {
  item: MediaItem;
  onClose: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
              Media Details
            </p>

            <h2 className="mt-1 max-w-xl truncate text-lg font-black text-gray-950">
              {item.fileName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 transition hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={item.url}
              alt={item.fileName}
              className="max-h-[450px] w-full object-contain"
            />
          </div>

          <div className="space-y-4">
            <Detail
              label="Purpose"
              value={getPurposeLabel(
                item.purpose
              )}
            />

            <Detail
              label="Location"
              value={item.location}
            />

            <Detail
              label="File name"
              value={item.fileName}
            />

            <Detail
              label="Format"
              value={
                item.format || "Unknown"
              }
            />

            <Detail
              label="File size"
              value={formatBytes(
                item.bytes
              )}
            />

            {item.width &&
              item.height && (
                <Detail
                  label="Dimensions"
                  value={`${item.width} × ${item.height}px`}
                />
              )}

            <Detail
              label="Cloudinary ID"
              value={item.publicId}
            />

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">
                Image URL
              </p>

              <div className="rounded-xl bg-gray-50 p-3">
                <p className="break-all text-xs leading-5 text-gray-600">
                  {item.url}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCopy}
              className="w-full rounded-xl bg-violet-700 px-4 py-3 font-bold text-white transition hover:bg-violet-800"
            >
              Copy Image URL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function getHomepageSlot(
  purpose: MediaPurpose
) {
  if (purpose === "hero_1") {
    return 1;
  }

  if (purpose === "hero_2") {
    return 2;
  }

  if (purpose === "hero_3") {
    return 3;
  }

  return null;
}

function getPurposeLabel(
  purpose: MediaPurpose
) {
  return (
    MEDIA_PURPOSES.find(
      (item) => item.value === purpose
    )?.label || "Other"
  );
}

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 Bytes";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${parseFloat(
    (
      bytes /
      Math.pow(1024, index)
    ).toFixed(2)
  )} ${units[index]}`;
}
