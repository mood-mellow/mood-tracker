"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AvatarFallback, Avatar as ShadAvatar } from "~/components/ui/avatar";

export const Avatar = ({ fallback }: { fallback: string }) => {
  fallback = fallback.substring(0, 2).toLocaleUpperCase();
  return (
    <ShadAvatar>
      <AvatarFallback className="bg-black text-white">
        {fallback}
      </AvatarFallback>
    </ShadAvatar>
  );
};
