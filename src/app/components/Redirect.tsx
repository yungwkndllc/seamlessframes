"use client";
import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    window.location.href =
      "https://app.seamlessprotocol.com/#/?asset=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  }, []);

  return <></>;
}
