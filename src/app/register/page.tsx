"use client";

import React, { useState } from "react";
import MenuBar from "../../../components/MenuBar";
import FooterSection from "../../../components/FooterSection";
import FooterCopyright from "../../../components/FooterCopyright";
import { ScrollToTopButton } from "../../../components/ScrollToTopButton";
import {
  Form,
  FormControl,
  FormDescription,
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
import DekstopNavLinksAlt from '../../../components/DekstopNavLinksAlt';
import Image from "next/image";

// Define the form schema using zod
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 6 characters."),
  no_identitas: z.string().min(16, "NIK must be at least 16 characters."),
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const Register = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      const response = await fetch("http://localhost:8080/api/register", {
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
        localStorage.setItem("token", result.data.token);

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
    <div className="min-h-screen bg-white font-sans relative">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo Section */}
            <div
                    className={`pl-4 sm:pl-24 text-darkBlue`}
                    style={{ width: '300px', height: 'auto' }}
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
      </nav>

      <main className="flex items-center justify-center pt-20 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-darkBlue mb-6">
            Daftar Akun Baru
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-darkBlue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
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
      </main>

      {/* Section Footer */}
      {/* <FooterSection /> */}

      {/* Section Copyright */}
      <FooterCopyright />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default Register;
