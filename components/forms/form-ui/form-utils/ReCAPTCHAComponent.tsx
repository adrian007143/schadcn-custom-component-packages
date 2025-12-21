"use client";

import { useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type Props = {
  onVerify: (token: string | null) => void;
  disabled?: boolean;
};

export default function ReCAPTCHAComponent({ onVerify, disabled }: Props) {
  const ref = useRef<ReCAPTCHA | null>(null);

  useEffect(() => {
    // reset when re-enabled (optional)
    if (!disabled) {
      ref.current?.reset();
    }
  }, [disabled]);

  return (
    <div className="flex justify-center ">
      <ReCAPTCHA
        ref={ref}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={(token) => onVerify(token)}
        onExpired={() => onVerify(null)}
      />
    </div>
  );
}
