"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useVerifyEmailMutation } from "../redux/feature/userAPI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Verify() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(180);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const emailFromQuery =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email")
      : null;

  const [verifyEmail] = useVerifyEmailMutation();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }

    setCode(newCode);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    if (code.some((digit) => digit === "")) return;

    setIsLoading(true);

    const formData = {
      email: emailFromQuery,
      oneTimeCode: Number(code.join("")),
    };

    try {
      const result = await verifyEmail(formData).unwrap();

      if (result?.success) {
        toast.success(result.message || "Verification successful!");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/login`);
    } catch (error: any) {
      if (error?.data) {
        toast.error(error.data.message || error.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
    setIsLoading(false);
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-4 pt-12 pb-8 px-8">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">
                Verify your email
              </h1>
              <p className="text-base text-slate-600 leading-relaxed">
                We have sent a 6-digit verification code to
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 text-center">
                Enter verification code
              </label>

              {/* Code Input */}
              <div className="flex justify-center gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 bg-white"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isCodeComplete || isLoading}
              className={`w-full h-11 text-base font-medium rounded-lg transition-all duration-200 ${
                !isCodeComplete || isLoading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
            <div>
              <p className="text-base text-slate-600 leading-relaxed">
                OTP will expire in {minutes}:{seconds < 10 ? "0" : ""}
                {seconds} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
