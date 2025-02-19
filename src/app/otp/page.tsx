"use client";

import React, { useState, useEffect, Suspense } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog as MuiDialog, DialogTitle as MuiDialogTitle, DialogContent as MuiDialogContent, DialogActions } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes as faTimesIcon } from "@fortawesome/free-solid-svg-icons";

// Define the form schema using zod
const formSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 characters."),
});

type OtpFormValues = z.infer<typeof formSchema>;

const Otp = () => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [noIdentitas, setNoIdentitas] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidOtpDialogOpen, setInvalidOtpDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters from URL after component mounts
  useEffect(() => {
    if (searchParams) {
      const no_identitas = searchParams.get("no_identitas");
      const email = searchParams.get("email");
      setNoIdentitas(no_identitas);
      setEmail(email);
    }
  }, [searchParams]);

  // Extract email and no_identitas from localStorage or sessionStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail");
    const storedIdentitas = localStorage.getItem("forgotPasswordIdentitas");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error("Email not found. Please go back to the login/forgot password page.");
      router.push("/login"); // Redirect to login page if email is not found
    }
    if (storedIdentitas) {
      setNoIdentitas(storedIdentitas);
    }
  }, [router]);

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
          body: JSON.stringify({ no_identitas: noIdentitas, email }),
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

  const handlePasswordChange = async () => {
    if (!email) {
      toast.error("Email cannot be blank.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        toast.success("Password updated successfully!", {
          style: {
            backgroundColor: "white",
            color: "#4CAF50",
            borderRadius: "8px",
            padding: "10px 20px",
          },
        });

        setTimeout(() => {
          window.location.href = "/karir";
        }, 2000);
      } else {
        toast.error(result.responseMessage || "Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password update:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const isConfirmPasswordMatch = () => {
    return newPassword === confirmPassword;
  };

  const handleOtp = async (data: OtpFormValues) => {
    if (!email) {
      toast.error("Email cannot be blank.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/otp-verification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            otp: data.otp,
            no_identitas: noIdentitas,
            email,
          }),
        });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        toast.success("OTP successful! Please change your password.", {
          style: {
            backgroundColor: "white",
            color: "#4CAF50",
            borderRadius: "8px",
            padding: "10px 20px",
          },
        });

        setOpenDialog(true);
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
              Verifikasi OTP
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
                  isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-darkBlue hover:bg-blue-700"
                }`}
                disabled={isDisabled}
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
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

        <MuiDialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <MuiDialogTitle>Ubah Password</MuiDialogTitle>
          <MuiDialogContent>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="mt-2 space-y-2 rounded-md bg-blue-50/50 p-3 text-sm">
              <div className="flex items-center gap-2">
                {passwordStrength.length ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                )}
                <p>Minimal 8 karakter</p>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.uppercase ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                )}
                <p>Minimal 1 huruf kapital</p>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.lowercase ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                )}
                <p>Minimal 1 huruf kecil</p>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.number ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                )}
                <p>Minimal 1 angka</p>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.specialChar ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimesIcon} className="text-red-500" />
                )}
                <p>Minimal 1 karakter khusus</p>
              </div>
            </div>
            <div className="relative mt-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </MuiDialogContent>
          <DialogActions>
            <Button
              onClick={handlePasswordChange}
              className={`bg-darkBlue text-white ${!isPasswordStrong() || !isConfirmPasswordMatch() ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={!isPasswordStrong() || !isConfirmPasswordMatch()}
            >
              Update Password
            </Button>
          </DialogActions>
        </MuiDialog>

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

const OtpPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Otp />
  </Suspense>
);

export default OtpPage;
