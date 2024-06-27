import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { VERCEL_URL } from "@/utils";

import dynamic from "next/dynamic";
const DynamicRedirect = dynamic(() => import("./components/Redirect"), {
  loading: () => <></>,
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "seamless",
    description: "lend usdc on seamless",
    other: {
      ...(await fetchMetadata(
        new URL("/seamless", VERCEL_URL || "http://localhost:3000")
      )),
    },
  };
}

export default function Home() {
  return (
    <>
      <head></head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <DynamicRedirect />
      </main>
    </>
  );
}
