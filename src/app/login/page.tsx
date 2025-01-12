"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Define the form schema using zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

type LoginFormValues = z.infer<typeof formSchema>;

const generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const operator = Math.random() > 0.5 ? "+" : "-";
  const question = `${num1} ${operator} ${num2}`;
  const answer = operator === "+" ? num1 + num2 : num1 - num2;
  return { question, answer: answer.toString() };
};

const createMathCaptchaImage = (question: string) => {
  if (typeof window === 'undefined') return null; // Ensure this runs only in the browser

  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 70;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Background
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(question, 20, 45);

    // Add some lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  }

  return canvas.toDataURL("image/png");
};

const handleKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const nextField = document.getElementById(nextFieldId);
    if (nextField) {
      nextField.focus();
    }
  }
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordIdentitas, setForgotPasswordIdentitas] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordRecaptchaToken, setForgotPasswordRecaptchaToken] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(generateMathCaptcha());
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [forgotPasswordCaptcha, setForgotPasswordCaptcha] = useState(generateMathCaptcha());
  const [forgotPasswordCaptchaImage, setForgotPasswordCaptchaImage] = useState<string | null>(null);
  const [forgotPasswordCaptchaInput, setForgotPasswordCaptchaInput] = useState("");
  const [dialogMessage, setDialogMessage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const showDialog = (message: string, isError: boolean = false) => {
    setDialogMessage(message);
    setDialogOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/"); // Redirect to homepage if already logged in
    }
  }, [router]);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleForgotPasswordRecaptchaChange = (token: string | null) => {
    setForgotPasswordRecaptchaToken(token);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCaptchaImage(createMathCaptchaImage(captcha.question));
      setForgotPasswordCaptchaImage(createMathCaptchaImage(forgotPasswordCaptcha.question));
    }
  }, [captcha, forgotPasswordCaptcha]);

  const regenerateCaptcha = () => {
    const newCaptcha = generateMathCaptcha();
    setCaptcha(newCaptcha);
    setCaptchaImage(createMathCaptchaImage(newCaptcha.question));
  };

  const regenerateForgotPasswordCaptcha = () => {
    const newCaptcha = generateMathCaptcha();
    setForgotPasswordCaptcha(newCaptcha);
    setForgotPasswordCaptchaImage(createMathCaptchaImage(newCaptcha.question));
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    if (captchaInput !== captcha.answer) {
      showDialog("CAPTCHA Tidak Valid. Anda bisa mencoba ulang.", true);
      regenerateCaptcha(); // Regenerate CAPTCHA on wrong input
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        if (errorJson.responseCode === "401") {
          throw new Error("Email or password is incorrect");
        } else {
          throw new Error("Email or password is incorrect");
        }
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        if (!result.data.isActive) {
          showDialog("Akun Anda tidak aktif. Silahkan hubungi Administrator.", true);
          setLoading(false);
          return;
        }

        const token = result.data.token;
        localStorage.setItem("token", token);

        toast.success("Login successful! Redirecting...", {
          style: {
        background: 'white',
        color: 'green',
          },
        });

        setTimeout(() => {
          window.location.href = "/karir";
        }, 2000);
      } else {
        showDialog(result.responseMessage || "Login failed. Please try again.", true);
        regenerateCaptcha(); // Regenerate CAPTCHA on failed login
      }
    } catch (error) {
      showDialog((error as Error).message || "An error occurred. Please try again later.", true);
      regenerateCaptcha(); // Regenerate CAPTCHA on error
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordCaptchaInput !== forgotPasswordCaptcha.answer) {
      showDialog("CAPTCHA Tidak Valid. Anda bisa mencoba ulang.", true);
      regenerateForgotPasswordCaptcha(); // Regenerate CAPTCHA on wrong input
      return;
    }

    if (!forgotPasswordEmail || !forgotPasswordIdentitas) {
      showDialog("Please enter your email and identification number.", true);
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(forgotPasswordEmail)) {
      showDialog("Format email tidak valid!", true);
      return;
    }

    // KTP number validation
    if (forgotPasswordIdentitas.length !== 16 || !/^\d+$/.test(forgotPasswordIdentitas)) {
      showDialog("Nomor KTP harus terdiri dari 16 digit angka.", true);
      return;
    }

    setForgotPasswordLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ no_identitas: forgotPasswordIdentitas, email: forgotPasswordEmail }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      showDialog("Password reset link sent! Please check your email.");
      setIsForgotPasswordOpen(false);

      // Store email and identitas in localStorage
      localStorage.setItem("forgotPasswordEmail", forgotPasswordEmail);
      localStorage.setItem("forgotPasswordIdentitas", forgotPasswordIdentitas);

      // Redirect to OTP page
      setTimeout(() => {
        router.push("/otp");
      }, 2000);
    } catch (error) {
      console.error("Error during password reset:", error);
      showDialog("An error occurred. Please try again later.", true);
      regenerateForgotPasswordCaptcha(); // Regenerate CAPTCHA on error
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <Toaster />
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
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-center text-darkBlue mb-6">
              Masuk ke akun Anda
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan email"
                          type="email"
                          {...field}
                          className="transition-transform duration-300 focus:scale-105"
                          onKeyDown={(e) => handleKeyDown(e, "password")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Kata Sandi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Masukkan kata sandi"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="transition-transform duration-300 focus:scale-105"
                            id="password"
                            onKeyDown={(e) => handleKeyDown(e, "captchaInput")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </FormControl>
                      <span className="mt-1 text-grey text-xs">* (min 8 karakter)</span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right">
                  <button
                    type="button"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    Lupa Password?
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  {captchaImage && (
                    <Image src={captchaImage} alt="CAPTCHA" width={200} height={70} className="rounded-md" />
                  )}
                  <button type="button" onClick={regenerateCaptcha} className="text-xs text-blue-500 hover:underline">
                    Generate ulang CAPTCHA
                  </button>
                  <Input
                    placeholder="Captcha (Jawab soal di atas)"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="mt-4 form-input w-full"
                    id="captchaInput"
                    onKeyDown={(e) => handleKeyDown(e, "loginButton")}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-darkBlue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
                  disabled={loading}
                  id="loginButton"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="text-center text-gray-700 mt-4">
              Anda belum memiliki akun?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Daftar
              </a>
            </div>
          </div>
        </div>

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="font-normal">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Masukkan Alamat Email"
              type="email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="transition-transform duration-300 focus:scale-105"
            />
            <Input
              placeholder="Masukkan No KTP"
              type="text"
              value={forgotPasswordIdentitas}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 16) {
                  setForgotPasswordIdentitas(value);
                }
              }}
              className="transition-transform duration-300 focus:scale-105"
            />
            <div className="flex flex-col items-center space-y-2">
              {forgotPasswordCaptchaImage && (
                <Image src={forgotPasswordCaptchaImage} alt="CAPTCHA" width={200} height={70} className="rounded-md" />
              )}
              <button type="button" onClick={regenerateForgotPasswordCaptcha} className="text-xs text-blue-500 hover:underline">
                Generate ulang CAPTCHA
              </button>
              <Input
                placeholder="Enter CAPTCHA"
                value={forgotPasswordCaptchaInput}
                onChange={(e) => setForgotPasswordCaptchaInput(e.target.value)}
                className="mt-4 form-input w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleForgotPassword}
              className={`bg-darkBlue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform duration-300 hover:scale-105 ${forgotPasswordLoading ? "animate-pulse" : ""}`}
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="font-normal">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex items-center">
            {dialogMessage && (
              <span>{dialogMessage}</span>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
