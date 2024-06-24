"use client";

import React, { useMemo, HTMLAttributes } from "react";
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

export const MinidenticonImg = ({ username }: MinidenticonP) => {
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
