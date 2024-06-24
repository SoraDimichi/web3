"use client";

import React, { useEffect, useMemo, HTMLAttributes } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { minidenticon } from "minidenticons";

type MinidenticonP = { username: string } & HTMLAttributes<HTMLImageElement>;

class HLSColor {
  private lightness: number;
  private lightnessIndex: number;
  public color: string;

  constructor(color: string) {
    this.color = color;
    this.lightness = this.getLightness();
    this.lightnessIndex = this.getLightnessIndex();
  }

  private getLightnessIndex(): number {
    return this.color.lastIndexOf("%");
  }

  private getLightness(): number {
    const substring = this.color.substring(0, this.lightnessIndex);
    const regex = /[0-9]+(?=[^0-9]*$)/;
    const [match] = substring.match(regex)!;
    return Number(match);
  }

  private replaceLightness(lightness: number) {
    const beforePercent = this.color.substring(0, this.lightnessIndex);

    const { index: startOfLightness } = beforePercent.match(/(\d+)(?!.*\d)/)!;

    return (
      this.color.substring(0, startOfLightness) +
      lightness +
      this.color.substring(this.lightnessIndex, this.color.length)
    );
  }

  public darker(persent: number) {
    return this.replaceLightness(
      this.lightness - this.lightness * (persent / 100),
    );
  }
}

const MinidenticonImg = ({ username }: MinidenticonP) => {
  const svg = useMemo(() => minidenticon(username), [username]);
  const parser = new DOMParser();
  const color = parser
    .parseFromString(svg, "image/svg+xml")
    .querySelector("svg")!
    .getAttribute("fill")!;
  const nickname = generateNickname(username);
  const background = new HLSColor(color);

  return (
    <div
      style={{ background: background.darker(60) }}
      className="gap-2 rounded-lg max-h-min p-2 text-white flex flex-col items-center justify-center"
    >
      <img
        style={{ background: background.darker(90) }}
        className="rounded-lg shadow-lg"
        src={"data:image/svg+xml;utf8," + svg}
        alt={nickname}
      />
      <p
        style={{ color }}
        className="capitalize text-lg leading-none font-semibold"
      >
        {nickname}
      </p>
    </div>
  );
};

function hexToBase26(hex: string) {
  const decimal = BigInt("0x" + hex);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  let base26 = "";

  let number = decimal;
  while (number > 0) {
    base26 = alphabet[Number(number % BigInt(26))] + base26;
    number = number / BigInt(26);
  }

  return base26;
}

function generateNickname(ethAddress: string) {
  const without0x = ethAddress.slice(2);
  const base26 = hexToBase26(without0x);
  const letters = base26.replace(/[0-9]/g, "").split("").reverse().join("");
  const vowels = "aeiou";

  console.log(letters);
  let nickname = "";
  let isConsonantNext = true;

  for (let char of letters) {
    const isVowel = vowels.includes(char.toLowerCase());

    if (isConsonantNext && !isVowel) {
      nickname += char;
      isConsonantNext = false;
    } else if (!isConsonantNext && isVowel) {
      nickname += char;
      isConsonantNext = true;
    }

    if (nickname.length == 5) break;
  }
  return nickname;
}

export default function Home() {
  const [provider, setProvider] = React.useState<null | Web3Provider>(null);
  const [error, setError] = React.useState<any>(null);
  const [address, setAddress] = React.useState("");
  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum?.isMetaMask) {
      setError({ code: "4001" });
      return;
    }

    if (!ethereum.request) {
      console.log("unknown provider");
      return;
    }

    const initializeProvider = async () => {
      try {
        await ethereum.request!({ method: "eth_requestAccounts" });
        const provider = new Web3Provider(ethereum);
        setProvider(provider);
        setAddress(await provider.getSigner().getAddress());
      } catch (error) {
        setError(error);
      }
    };

    initializeProvider();
  }, []);

  return (
    <main className="grid min-h-screen flex-col content-center justify-between p-24">
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"> */}
      {/*   <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"> */}
      {/*     Get started by editing&nbsp; */}
      {/*     <code className="font-mono font-bold">app/page.tsx</code> */}
      {/*   </p> */}
      {/*   <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none"> */}
      {/*     <a */}
      {/*       className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0" */}
      {/*       href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" */}
      {/*       target="_blank" */}
      {/*       rel="noopener noreferrer" */}
      {/*     > */}
      {/*       By{" "} */}
      {/*       <Image */}
      {/*         src="/vercel.svg" */}
      {/*         alt="Vercel Logo" */}
      {/*         className="dark:invert" */}
      {/*         width={100} */}
      {/*         height={24} */}
      {/*         priority */}
      {/*       /> */}
      {/*     </a> */}
      {/*   </div> */}
      {/* </div> */}

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        {address && <MinidenticonImg username={address} />}

        {/* <Image */}
        {/*   className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert" */}
        {/*   src="/next.svg" */}
        {/*   alt="Next.js Logo" */}
        {/*   width={180} */}
        {/*   height={37} */}
        {/*   priority */}
        {/* /> */}
        {error?.code === "4001" && <p>Connect to metamask wallet</p>}
      </div>

      {/* <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"> */}
      {/*   <a */}
      {/*     href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" */}
      {/*     className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" */}
      {/*     target="_blank" */}
      {/*     rel="noopener noreferrer" */}
      {/*   > */}
      {/*     <h2 className="mb-3 text-2xl font-semibold"> */}
      {/*       Docs{" "} */}
      {/*       <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> */}
      {/*         -&gt; */}
      {/*       </span> */}
      {/*     </h2> */}
      {/*     <p className="m-0 max-w-[30ch] text-sm opacity-50"> */}
      {/*       Find in-depth information about Next.js features and API. */}
      {/*     </p> */}
      {/*   </a> */}
      {/**/}
      {/*   <a */}
      {/*     href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app" */}
      {/*     className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" */}
      {/*     target="_blank" */}
      {/*     rel="noopener noreferrer" */}
      {/*   > */}
      {/*     <h2 className="mb-3 text-2xl font-semibold"> */}
      {/*       Learn{" "} */}
      {/*       <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> */}
      {/*         -&gt; */}
      {/*       </span> */}
      {/*     </h2> */}
      {/*     <p className="m-0 max-w-[30ch] text-sm opacity-50"> */}
      {/*       Learn about Next.js in an interactive course with&nbsp;quizzes! */}
      {/*     </p> */}
      {/*   </a> */}
      {/**/}
      {/*   <a */}
      {/*     href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" */}
      {/*     className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" */}
      {/*     target="_blank" */}
      {/*     rel="noopener noreferrer" */}
      {/*   > */}
      {/*     <h2 className="mb-3 text-2xl font-semibold"> */}
      {/*       Templates{" "} */}
      {/*       <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> */}
      {/*         -&gt; */}
      {/*       </span> */}
      {/*     </h2> */}
      {/*     <p className="m-0 max-w-[30ch] text-sm opacity-50"> */}
      {/*       Explore starter templates for Next.js. */}
      {/*     </p> */}
      {/*   </a> */}
      {/**/}
      {/*   <a */}
      {/*     href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" */}
      {/*     className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" */}
      {/*     target="_blank" */}
      {/*     rel="noopener noreferrer" */}
      {/*   > */}
      {/*     <h2 className="mb-3 text-2xl font-semibold"> */}
      {/*       Deploy{" "} */}
      {/*       <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"> */}
      {/*         -&gt; */}
      {/*       </span> */}
      {/*     </h2> */}
      {/*     <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50"> */}
      {/*       Instantly deploy your Next.js site to a shareable URL with Vercel. */}
      {/*     </p> */}
      {/*   </a> */}
      {/* </div> */}
    </main>
  );
}
