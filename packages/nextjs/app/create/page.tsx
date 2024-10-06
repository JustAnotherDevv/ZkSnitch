"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { NewSubmissionForm } from "~~/components/new-submisstion-form";

// @ts-nocheck

const Create: NextPage = () => {
  const { address } = useAccount();

  useEffect(() => {
    const initializeClient = async () => {};

    initializeClient();
  }, []);

  return (
    <div className="p-4">
      <div className="mt-8">
        <NewSubmissionForm />
      </div>
    </div>
  );
};

export default Create;
