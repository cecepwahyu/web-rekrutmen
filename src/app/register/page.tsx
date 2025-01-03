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
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the form schema using zod
const formSchema = z.object({
  nama: z.string().min(1, "Nama is required."),
  username: z.string().min(3, "Username must be at least 6 characters."),
  no_identitas: z.string().min(16, "NIK must be at least 16 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);

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
      username: "",
      no_identitas: "",
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true);
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
          if (errorJson.responseMessage.includes("already exist")) {
            if (errorJson.data.includes("Username")) {
              toast.error("Username already registered. Please choose another one.");
            } else if (errorJson.data.includes("Email")) {
              toast.error("Email already registered. Please use another email.");
            } else {
              toast.error("Register failed. Please try again.");
            }
          } else {
            toast.error(errorJson.responseMessage || "Register failed. Please try again.");
          }
        } catch (e) {
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        return;
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        // Login successful
        if (typeof window !== "undefined") {
          //localStorage.setItem("token", result.data.token);
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

        // Redirect to another page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        // Show error toast for server validation error
        toast.error(result.responseMessage || "Register failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during register:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
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

        <div className="flex flex-col justify-center items-center w-full bg-white flex-grow relative z-10 -mt-32 pb-10 px-4"> {/* Added px-4 for padding */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4"> {/* Added mx-4 for margin */}
            <h2 className="text-2xl font-bold text-center text-darkBlue mb-6">
              Daftar Akun Baru
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                {/* Nama Field */}
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          type="text"
                          {...field}
                          className="transition-transform duration-300 focus:scale-105"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your username"
                          type="username"
                          {...field}
                          className="transition-transform duration-300 focus:scale-105"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* No Identitas Field */}
                <FormField
                  control={form.control}
                  name="no_identitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No Identitas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your No Identitas"
                          type="number"
                          {...field}
                          className="transition-transform duration-300 focus:scale-105"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                        />
                      </FormControl>
                      <FormMessage />
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
              </form>
            </Form>

            <div className="text-center text-gray-700 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
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
