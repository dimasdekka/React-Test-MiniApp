import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useLocation, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema, type LoginFormData } from "../types";
import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/products";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect kalau sudah ter autentikasi
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Login berhasil!");
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.status === 401
            ? "Email atau password salah"
            : "Terjadi kesalahan saat login. Coba lagi.";
        toast.error(message);
      } else {
        toast.error("Terjadi kesalahan tidak terduga");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-surface flex items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="w-full max-w-md">
        {/* Brand Identity Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] mb-6">
            <span
              className="material-symbols-outlined text-on-primary text-4xl"
              data-icon="inventory_2"
            >
              inventory_2
            </span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface mb-2">
            StoreMini
          </h1>
          <p className="font-body text-on-surface-variant text-sm font-medium">
            The Editorial Inventory System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-lg shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] p-10 relative overflow-hidden">
          {/* Decorative Ghost Gradient */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-8 tracking-tight">
              Welcome Back
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              id="login-form"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant px-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span
                      className="material-symbols-outlined text-outline text-lg"
                      data-icon="mail"
                    >
                      mail
                    </span>
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="curator@storemini.com"
                    className={`w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-lg py-3.5 pl-12 pr-4 text-sm font-body transition-all placeholder:text-outline/60 outline-none ${
                      errors.email
                        ? "ring-error focus:ring-error"
                        : "ring-outline-variant/15 focus:ring-primary/40"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="px-1 text-xs font-semibold text-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label
                    className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-primary font-label text-[11px] font-bold hover:underline"
                    tabIndex={-1}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span
                      className="material-symbols-outlined text-outline text-lg"
                      data-icon="lock"
                    >
                      lock
                    </span>
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full bg-surface-container-high border-none ring-1 focus:ring-2 rounded-lg py-3.5 pl-12 pr-12 text-sm font-body transition-all placeholder:text-outline/60 outline-none ${
                      errors.password
                        ? "ring-error focus:ring-error"
                        : "ring-outline-variant/15 focus:ring-primary/40"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors cursor-pointer flex items-center"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="px-1 text-xs font-semibold text-error">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-label font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">
                      progress_activity
                    </span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <span
                      className="material-symbols-outlined text-lg"
                      data-icon="arrow_forward"
                    >
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-outline-variant/10 text-center space-y-3">
              <p className="font-body text-[11px] text-outline">
                Akun demo: <span className="font-bold">john@mail.com</span> /{" "}
                <span className="font-bold">changeme</span>
              </p>
              <p className="font-body text-sm text-on-surface-variant">
                Don't have an account?
                <Link
                  to="#"
                  className="text-primary font-bold hover:underline ml-1"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <footer className="mt-12 text-center">
          <div className="flex justify-center space-x-6 text-[10px] font-label font-bold uppercase tracking-[0.2em] text-outline/60">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
          <p className="mt-4 text-[10px] text-outline/40 font-medium">
            © 2024 StoreMini Editorial Inventory. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
