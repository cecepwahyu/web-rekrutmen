"use client";

import React, { useState, useEffect } from "react";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../components/FooterCopyright";
import { ScrollToTopButton } from "../../components/ScrollToTopButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import Swal from "sweetalert2";

// Define the form schema using zod
const formSchema = z.object({
  nama: z.string().min(1, "Nama is required."),
  //username: z.string().min(3, "Username must be at least 6 characters."),
  no_identitas: z.string().min(16, "NIK must be at least 16 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add state for showing password
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); // Add state for field errors
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Add a state to manage the scroll state
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  // Add event listener for scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      //username: "",
      no_identitas: "",
      email: "",
      password: "",
    },
  });

  // Custom input handler for No Identitas field
  const handleNoIdentitasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 16) {
      form.setValue("no_identitas", e.target.value);
    }
  };

  // Function to check password strength
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^a-zA-Z0-9]/.test(password),
    });
  };

  // Handle form submission
  const handleRegister = async (data: RegisterFormValues) => {
    // Check if any field is empty
    const emptyFields = Object.entries(data).filter(([key, value]) => !value);
    if (emptyFields.length > 0) {
      const errors: { [key: string]: string } = {};
      emptyFields.forEach(([key]) => {
        errors[key] = "This field is required.";
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({}); // Clear previous errors
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          const errors: { [key: string]: string } = {};
          if (errorJson.responseMessage.includes("already exist")) {
            if (errorJson.data.includes("Email")) {
              Swal.fire({
                icon: "error",
                title: "Duplicate Email",
                text: "Email already registered. Please use another email.",
              });
            } else if (errorJson.data.includes("NIK")) {
              Swal.fire({
                icon: "error",
                title: "Duplicate NIK",
                text: "NIK already registered. Please use another NIK.",
              });
            } else {
              errors.general = "Register failed. Please try again.";
            }
          } else {
            errors.general = errorJson.data || "Register failed. Please try again.";
          }
          setFieldErrors(errors);
        } catch (e) {
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        return;
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        // Store no_identitas and email in local storage
        if (typeof window !== "undefined") {
          localStorage.setItem("no_identitas", data.no_identitas);
          localStorage.setItem("email", data.email);
        }

        // Show success toast
        toast.success("Register successful! Redirecting...", {
          style: {
            backgroundColor: "white", // White background
            color: "#4CAF50", // Green text color
            borderRadius: "8px", // Rounded corners
            padding: "10px 20px", // Padding
          },
        });

        // Redirect to account verification page after a short delay
        setTimeout(() => {
          window.location.href = "/account-verification";
        }, 2000);
      } else {
        // Show error toast for server validation error
        setFieldErrors({ general: result.responseMessage || "Register failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during register:", error);
      setFieldErrors({ general: "An error occurred. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10 flex flex-col min-h-screen">
        <MenuBar />
        <div className="bg-white flex-grow relative z-10 shadow-lg rounded-b-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            {/* <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: "#015CAC", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#018ED2", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="url(#grad1)"
              d="M0,0L120,10.7C240,21,480,43,720,48C960,53,1200,43,1320,37.3L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
            ></path> */}
          </svg>
        </div>

        <div className="flex flex-col justify-center items-center w-full bg-white flex-grow relative z-10 -mt-12 pb-10 px-4">
          <div className="w-full max-w-4xl mx-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full transform transition-all duration-500 hover:scale-105">
              <h2 className="text-3xl font-bold text-center text-darkBlue mb-6">Daftar Akun Baru</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                  {/* Nama Field */}
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            type="text"
                            {...field}
                            className="transition-transform duration-300 focus:scale-105 border-2 border-gray-300 rounded-lg p-2"
                          />
                        </FormControl>
                        <FormMessage />
                        {fieldErrors.nama && <p className="text-red-500">{fieldErrors.nama}</p>}
                      </FormItem>
                    )}
                  />

                  {/* No Identitas Field */}
                  <FormField
                    control={form.control}
                    name="no_identitas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          No Identitas (KTP) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your No Identitas"
                            type="number"
                            value={field.value}
                            onChange={handleNoIdentitasChange}
                            className="transition-transform duration-300 focus:scale-105 border-2 border-gray-300 rounded-lg p-2"
                          />
                        </FormControl>
                        <FormMessage />
                        {fieldErrors.no_identitas && <p className="text-red-500">{fieldErrors.no_identitas}</p>}
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            className="transition-transform duration-300 focus:scale-105 border-2 border-gray-300 rounded-lg p-2"
                          />
                        </FormControl>
                        <FormMessage />
                        {fieldErrors.email && <p className="text-red-500">{fieldErrors.email}</p>}
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              className="transition-transform duration-300 focus:scale-105 border-2 border-gray-300 rounded-lg p-2"
                              onChange={(e) => {
                                field.onChange(e);
                                checkPasswordStrength(e.target.value);
                              }}
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
                        <FormDescription className="text-blue-600/80">
                          Password baru harus memenuhi kriteria berikut
                        </FormDescription>
                        <div className="mt-2 space-y-2 rounded-md bg-blue-50/50 p-3 text-sm">
                          <div className="flex items-center gap-2">
                            {passwordStrength.length ? (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                            )}
                            <p>Minimal 8 karakter</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.uppercase ? (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                            )}
                            <p>Minimal 1 huruf kapital</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.lowercase ? (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                            )}
                            <p>Minimal 1 huruf kecil</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.number ? (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                            )}
                            <p>Minimal 1 angka</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {passwordStrength.specialChar ? (
                              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                            ) : (
                              <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                            )}
                            <p>Minimal 1 karakter khusus</p>
                          </div>
                        </div>
                        <FormMessage />
                        {fieldErrors.password && <p className="text-red-500">{fieldErrors.password}</p>}
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-darkBlue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Register in progress..." : "Register"}
                  </Button>
                  {fieldErrors.general && <p className="text-red-500 text-center mt-4">{fieldErrors.general}</p>}
                </form>
              </Form>

              <div className="text-center text-gray-700 mt-4">
                Sudah memiliki Akun?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>

        <FooterCopyright />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default Register;
