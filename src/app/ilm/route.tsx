/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./ilm";
import {
  IMAGE_URL,
  STRATEGY_ADDRESS,
  useFetchStrategyApy,
  VERCEL_URL,
} from "@/utils";

function convertTextToPath(textElementString: string): string {
  // Regular expression to extract attributes and text content
  const regex = /<text\s+([^>]*)>([\s\S]*?)<\/text>/;
  const match = textElementString.match(regex);

  if (!match) {
    throw new Error("Invalid <text> element string.");
  }

  // Extract attributes and text content
  const attributesString = match[1].trim();
  const textContent = match[2].trim();

  // Parse attributes
  const attrsRegex = /(\w+)=["']([^"']+)["']/g;
  let attrMatch;
  const parsedAttributes: Record<string, string> = {};

  while ((attrMatch = attrsRegex.exec(attributesString)) !== null) {
    const [, name, value] = attrMatch;
    parsedAttributes[name] = value;
  }

  // Construct path element string
  const pathElementString = `<path d="M0,0" fill="${
    parsedAttributes.fill || "black"
  }">${textContent}</path>`;

  return pathElementString;
}

// Example usage:
const textElementString = `
  <text
    x="50%"
    y="85%"
    font-family="Arial, sans-serif"
    font-size="14"
    fill="#6d9b30"
    text-anchor="middle"
    alignment-baseline="middle"
  >
    Boost wstETH
  </text>
`;

const apyString = (strategyAPY: number) => {
  return `
  <text
    x="50%"
    y="20%"
    font-family="Arial, sans-serif"
    font-size="24"
    fill="#6d9b30"
    text-anchor="middle"
    alignment-baseline="middle"
    font-weight="bold"
  >
    ${strategyAPY}% APY
  </text>`;
};

const handleRequest = frames(async (ctx) => {
  let strategyAPY = 0;
  try {
    const strategyAPYRes = await useFetchStrategyApy(STRATEGY_ADDRESS);
    console.log("strategyAPY", strategyAPY);
    strategyAPY = strategyAPYRes.data.value.toFixed(2);
  } catch (e) {
    console.error(e);
  }

  let buttons = [
    <Button action="tx" target={`${VERCEL_URL}/ilm/supply/tx`} post_url="/">
      Supply ETH
    </Button>,
    <Button action="tx" target={`${VERCEL_URL}/ilm/withdraw/tx`} post_url="/">
      Withdraw wstETH
    </Button>,
  ];

  if (ctx.message?.transactionId) {
    buttons.push(
      <Button
        action="link"
        target={`https://app.seamlessprotocol.com/#/?asset=0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452-0x4200000000000000000000000000000000000006&tab=My+Positions`}
      >
        View your positions
      </Button>
    );
  }

  // Let's construct an image with the current APY

  return {
    image: (
      <svg
        width="191"
        height="100"
        viewBox="0 0 191 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bg"
            patternUnits="userSpaceOnUse"
            width="191"
            height="100"
          >
            <image
              href="https://arweave.net/VgkozyIoaTBWE7j_qiVskIUa2UfRIKc78A-F2Uu9XFY"
              x="0"
              y="0"
              width="191"
              height="100"
            />
          </pattern>
        </defs>
        <rect width="191" height="100" fill="url(#bg)" />
        {convertTextToPath(textElementString)}
      </svg>
    ),
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    textInput: "How much wstETH?",
    buttons: buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
