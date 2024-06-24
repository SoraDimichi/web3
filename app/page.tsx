"use client";

import React, { useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { MinidenticonImg } from "./_avatar";

export default function Home() {
  const [, setProvider] = React.useState<null | Web3Provider>(null);
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
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        {address && <MinidenticonImg username={address} />}
        {error?.code === "4001" && <p>Connect to metamask wallet</p>}
      </div>
    </main>
  );
}
