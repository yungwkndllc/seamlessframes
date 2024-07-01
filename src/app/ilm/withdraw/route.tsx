/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./supply";
import { IMAGE_URL, VERCEL_URL } from "@/utils";

const handleRequest = frames(async (ctx) => {
  return {
    image: IMAGE_URL,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
