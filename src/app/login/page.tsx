"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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

// Define the form schema using zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

type LoginFormValues = z.infer<typeof formSchema>;

const generateCaptcha = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

const createCaptchaImage = (captcha: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 150;
  canvas.height = 50;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(captcha, 10, 35);
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
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [forgotPasswordCaptcha, setForgotPasswordCaptcha] = useState(generateCaptcha());
  const [forgotPasswordCaptchaImage, setForgotPasswordCaptchaImage] = useState<string | null>(null);
  const [forgotPasswordCaptchaInput, setForgotPasswordCaptchaInput] = useState("");
  const router = useRouter();

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
      setCaptchaImage(createCaptchaImage(captcha));
      setForgotPasswordCaptchaImage(createCaptchaImage(forgotPasswordCaptcha));
    }
  }, [captcha, forgotPasswordCaptcha]);

  const regenerateCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptcha(newCaptcha);
    setCaptchaImage(createCaptchaImage(newCaptcha));
  };

  const regenerateForgotPasswordCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setForgotPasswordCaptcha(newCaptcha);
    setForgotPasswordCaptchaImage(createCaptchaImage(newCaptcha));
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    if (captchaInput !== captcha) {
      toast.error("Invalid CAPTCHA. Please try again.");
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
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        if (!result.data.isActive) {
          toast.error("Account is inactive! Please verify your account.", {
            style: {
              backgroundColor: "white",
              color: "red",
              borderRadius: "8px",
              padding: "10px 20px",
            },
          });
          setLoading(false);
          return;
        }

        const token = result.data.token;
        localStorage.setItem("token", token);

        toast.success("Login successful! Redirecting...", {
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
        toast.error(result.responseMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (forgotPasswordCaptchaInput !== forgotPasswordCaptcha) {
      toast.error("Invalid CAPTCHA. Please try again.");
      return;
    }

    if (!forgotPasswordEmail || !forgotPasswordIdentitas) {
      toast.error("Please enter your email and identification number.");
      return;
    }

    if (!forgotPasswordRecaptchaToken) {
      toast.error("Please complete the reCAPTCHA.");
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
        body: JSON.stringify({ no_identitas: forgotPasswordIdentitas, email: forgotPasswordEmail, recaptchaToken: forgotPasswordRecaptchaToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      toast.success("Password reset link sent! Please check your email.");
      setIsForgotPasswordOpen(false);
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setForgotPasswordLoading(false);
    }
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
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-center text-darkBlue mb-6">
              Login to Your Account
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          className="transition-transform duration-300 focus:scale-105"
                          id="password"
                          onKeyDown={(e) => handleKeyDown(e, "captchaInput")}
                        />
                      </FormControl>
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
                    Forgot Password?
                  </button>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  {captchaImage && (
                    <Image src={captchaImage} alt="CAPTCHA" width={150} height={50} className="border p-2" />
                  )}
                  <button type="button" onClick={regenerateCaptcha} className="text-xs text-blue-500 hover:underline">
                    Regenerate CAPTCHA
                  </button>
                  <Input
                    placeholder="Enter CAPTCHA"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="transition-transform duration-300 focus:scale-105"
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
              Do not have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
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
              onChange={(e) => setForgotPasswordIdentitas(e.target.value)}
              className="transition-transform duration-300 focus:scale-105"
            />
            <div className="flex flex-col items-center space-y-2">
              {forgotPasswordCaptchaImage && (
                <Image src={forgotPasswordCaptchaImage} alt="CAPTCHA" width={150} height={50} className="border p-2" />
              )}
              <button type="button" onClick={regenerateForgotPasswordCaptcha} className="text-xs text-blue-500 hover:underline">
                Regenerate CAPTCHA
              </button>
              <Input
                placeholder="Enter CAPTCHA"
                value={forgotPasswordCaptchaInput}
                onChange={(e) => setForgotPasswordCaptchaInput(e.target.value)}
                className="transition-transform duration-300 focus:scale-105"
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
    </div>
  );
};

export default Login;
