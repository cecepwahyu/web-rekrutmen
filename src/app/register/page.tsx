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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

// Define the form schema using zod
const formSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi."),
  no_identitas: z.string().min(16, "NIK / No Identitas harus memiliki minimal 16 karakter."),
  email: z.string().email("Harap masukkan email yang valid."),
  password: z
    .string()
    .min(8, "Kata sandi harus terdiri dari setidaknya 8 karakter.")
    .regex(/[A-Z]/, "Kata sandi harus mengandung setidaknya satu huruf kapital.")
    .regex(/[0-9]/, "Kata sandi harus mengandung setidaknya satu angka.")
    .regex(/[^a-zA-Z0-9]/, "Kata sandi harus mengandung setidaknya satu karakter khusus."),
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

  const [isChecked, setIsChecked] = useState(false); // Add state for checkbox
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [agreements, setAgreements] = useState({
    recruitment: false,
    dataUsage: false,
    holdDiploma: false,
    understand: false, // Add new state for the final checkbox
  });
  const [agreementError, setAgreementError] = useState("");

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
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 16) {
      form.setValue("no_identitas", value);
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
        errors[key] = "Kolom ini wajib diisi.";
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
                text: "Email sudah terdaftar. Silakan gunakan email lain.",
              });
            } else if (errorJson.data.includes("NIK")) {
              Swal.fire({
                icon: "error",
                title: "Duplicate NIK",
                text: "NIK sudah terdaftar. Silahkan gunakan NIK lain.",
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
    setIsDialogOpen(true);
  };

  const handleAgreementSubmit = async () => {
    if (!agreements.understand) {
      setAgreementError("Silakan centang persetujuan untuk melanjutkan.");
      return;
    }

    setIsDialogOpen(false);

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
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans relative">
      <main className="pt-28 bg-gradient-to-r from-[#015CAC] to-[#018ED2] relative z-10 flex flex-col min-h-screen">
        <MenuBar />
        <div className="bg-white flex-grow relative z-10 shadow-lg rounded-b-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
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
                            type="text" // Change to text to prevent scientific notation
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

                  {/* Checkbox */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="confirmation"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="mr-2 mt-1"
                    />
                    <label htmlFor="confirmation" className="text-gray-500 text-sm leading-tight">
                      Pastikan Email dan NIK Anda sudah benar, karena Anda tidak dapat melakukan perubahan dan pendaftaran ketika terjadi kesalahan pada penulisan Email dan NIK.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-darkBlue text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-transform duration-300 hover:scale-105"
                    disabled={loading || !isChecked} // Disable button if not checked
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="overflow-y-auto max-h-[80vh] w-full md:w-[80vw] lg:w-[60vw] p-4 md:p-6 bg-white rounded-lg shadow-lg">
          <DialogTitle className="text-lg md:text-xl font-semibold text-darkBlue">
            Kebijakan Privasi
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base mt-2 text-gray-700">
            Silakan menyetujui syarat dan ketentuan berikut untuk melanjutkan aplikasi Anda.
          </DialogDescription>
          <FormGroup className="mt-4 space-y-4">
            <p className="text-gray-700">1. Saya bersedia memberikan/menyerahkan/mengisi data pribadi saya kepada PT Bank BPD DIY untuk memproses dan/atau menggunakan dan/atau memanfaatkan data pribadi tersebut sebatas keperluan rekrutmen Bank.</p>
            <p className="text-gray-700">2. Data dan dokumen yang saya input melalui web rekrutmen Bank BPD DIY adalah benar dan sesuai dengan data diri saya.</p>
            <p className="text-gray-700">3. Apabila terdapat ketidakbenaran atas data dan dokumen tersebut, saya bertanggung jawab penuh atas segala akibatnya.</p>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreements.understand}
                  onChange={(e) =>
                    setAgreements({
                      ...agreements,
                      understand: e.target.checked,
                    })
                  }
                />
              }
              label="Saya sepenuhnya paham dan setuju dengan kebijakan di atas."
              className="text-gray-700"
            />
          </FormGroup>
          {agreementError && (
            <p className="text-red-500 text-sm mt-2">{agreementError}</p>
          )}
          <DialogFooter className="mt-6 flex justify-end">
            <button
              onClick={handleAgreementSubmit}
              className="bg-darkBlue text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
