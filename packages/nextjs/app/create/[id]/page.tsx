"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { NewSubmissionForm } from "~~/components/new-submisstion-form";

// @ts-nocheck

const Create = ({ params }: { params: { id: string } }) => {
  const { address } = useAccount();
  const { id } = params;

  useEffect(() => {
    const initializeClient = async () => {};

    initializeClient();
  }, []);

  return (
    <div className="p-4">
      <div className="mt-8">
        <NewSubmissionForm id={id} />
      </div>
    </div>
  );
};

export default Create;
