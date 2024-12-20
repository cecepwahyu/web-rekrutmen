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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MenuBar from "../../../components/MenuBar";
import FooterCopyright from "../../../components/FooterCopyright";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import DekstopNavLinksAlt from "../../../components/DekstopNavLinksAlt";
import MobileDrawer from "../../../components/MobileDrawer";
import MobileMenuButton from "../../../components/MobileMenuButton";

// Define the form schema using zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof formSchema>;

const Login = () => {
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

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.responseCode === "000") {
        // Login successful
        const token = result.data.token;

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Show success toast
        toast.success("Login successful! Redirecting...", {
          style: {
            backgroundColor: "white", // White background
            color: "#4CAF50", // Green text color
            borderRadius: "8px", // Rounded corners
            padding: "10px 20px", // Padding
          },
        });

        // Redirect to another page after a short delay
        setTimeout(() => {
          window.location.href = "/karir"; // Redirect to the desired page
        }, 2000);
      } else {
        // Show error toast for server validation error
        toast.error(result.responseMessage || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans relative">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo Section */}
        <div
          className={`pl-4 sm:pl-24 text-darkBlue`}
          style={{ width: "300px", height: "auto" }}
        >
          <Image
            src={"/images/Logo_Color.png"} // Change the logo based on scroll state
            alt="BPD Logo"
            width={200}
            height={0} // Auto-scale height
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex relative py-6 flex-col justify-center">
          <DekstopNavLinksAlt />
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden">
          <MobileMenuButton onClick={() => { /* handle click */ }} isScrolled={isScrolled} />
        </div>
      </nav>

      <main className="flex items-center justify-center pt-10 sm:pt-20 min-h-screen px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
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
      </main>

      {/* Section Footer */}
      <FooterCopyright />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Login;
