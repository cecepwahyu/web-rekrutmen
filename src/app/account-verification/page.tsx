"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams from next/navigation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define the form schema using zod
const formSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 characters."),
});

type OtpFormValues = z.infer<typeof formSchema>;

const AccountVerification = () => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [invalidOtpDialogOpen, setInvalidOtpDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);

  // Get no_identitas and email from local storage
  const no_identitas = typeof window !== "undefined" ? localStorage.getItem("no_identitas") : null;
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Timer functionality
  useEffect(() => {
    let interval: any;
    if (isDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsDisabled(false);
            return 30; // Reset the timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDisabled]);

  const handleResendClick = async () => {
    setIsDisabled(true);

    try {
      toast("Sending OTP...", {
        style: {
          backgroundColor: "white",
          color: "#007BFF",
          borderRadius: "8px",
          padding: "10px 20px",
        },
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ no_identitas, email }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        toast.success("OTP resent successfully!", {
          style: {
            backgroundColor: "white",
            color: "#4CAF50",
            borderRadius: "8px",
            padding: "10px 20px",
          },
        });
      } else {
        toast.error(
          result.responseMessage || "Failed to resend OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error("An error occurred while resending OTP. Please try again.");
    } finally {
      setTimer(30);
    }
  };

  const handleOtp = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/account-verification`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        },
        body: JSON.stringify({
        otp: data.otp,
        }),
      });

      if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
      toast.success("OTP successful! Redirecting...", {
        style: {
        backgroundColor: "white",
        color: "#4CAF50",
        borderRadius: "8px",
        padding: "10px 20px",
        },
      });

      setTimeout(() => {
        window.location.href = "/login"; // Redirect to login page
      }, 2000);
      } else {
      toast.error(
        result.responseMessage || "OTP Verification failed. Please try again."
      );
      }
    } catch (error) {
      console.error("Error during OTP Verification:", error);
      setDialogMessage("Kode OTP invalid.");
      setInvalidOtpDialogOpen(true);
      setTimeout(() => setInvalidOtpDialogOpen(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpClick = async () => {
    const data = form.getValues();
    if (!data.otp) {
      setError("OTP code is required.");
      return;
    }
    setError(null);
    await handleOtp(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <MenuBar />
      <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10 flex flex-col min-h-screen">
        <div className="bg-white flex-grow relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#015CAC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#018ED2', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path fill="url(#grad1)"
              d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
          </svg>
        </div>

        <div className="flex flex-col justify-center items-center w-full bg-white flex-grow relative z-10 -mt-32 pb-10">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-t-8 border-darkBlue">
            <h2 className="text-3xl font-bold text-center text-darkBlue mb-6">
              Verifikasi Akun
            </h2>
            <p className="text-center mb-4 text-gray-700">
              One Time Password (OTP) telah dikirimkan ke alamat email Anda
            </p>

            <p className="text-center mb-4 text-gray-700">Masukkan kode OTP untuk verifikasi.</p>

            <form className="space-y-4" onSubmit={form.handleSubmit(handleOtp)}>
              <div className="flex items-center justify-center">
                <input
                  type="text"
                  maxLength={6}
                  className="w-48 h-12 text-center text-darkBlue border border-gray-300 rounded-md focus:ring-2 focus:ring-darkBlue focus:border-darkBlue"
                  {...form.register("otp")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                  }}
                />
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <button
                type="button"
                onClick={handleOtpClick}
                className={`w-full py-3 mt-4 text-white font-bold rounded-md transition duration-300 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-darkBlue hover:bg-blue-700"
                }`}
                disabled={loading} // Disable button during API call
              >
                {loading ? "Sedang memverifikasi..." : "Verifikasi OTP"}
              </button>
            </form>

            <div className="text-center text-gray-700 mt-4">
              Belum menerima OTP?{" "}
              <button
                onClick={handleResendClick}
                className={`font-bold ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-darkBlue hover:underline"
                }`}
                disabled={isDisabled}
              >
                Kirim ulang {isDisabled && `(${timer}s)`}
              </button>
            </div>
          </div>
        </div>

        <Dialog open={invalidOtpDialogOpen} onOpenChange={setInvalidOtpDialogOpen}>
          <DialogContent className="font-normal">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Info</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex items-center">
              {dialogMessage && (
                <span>{dialogMessage}</span>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default AccountVerification;
