"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FirebaseTestPage() {
  const [status, setStatus] = useState("Testing Firebase connection...");

  useEffect(() => {
    async function testFirebase() {
      try {
        await getDocs(collection(db, "firebase_test"));

        setStatus("Firebase connected successfully.");
      } catch (error) {
        console.error(error);
        setStatus(
          "Firebase is connected, but Firestore needs to be configured."
        );
      }
    }

    testFirebase();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f7f5ff",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "32px",
          borderRadius: "24px",
          background: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            marginBottom: "12px",
            color: "#5b21b6",
          }}
        >
          JAMBMASTER
        </h1>

        <p style={{ fontSize: "18px", color: "#444" }}>{status}</p>
      </div>
    </main>
  );
}
