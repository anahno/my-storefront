// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useMutation } from "urql"; // ✅ useClient را حذف کردیم
import Link from "next/link";
import { useRouter } from "next/navigation";

const LOGIN_MUTATION = `
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        errorCode
        message
      }
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  // ✅ client را از اینجا حذف کردیم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loginResult, executeLogin] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    setErrorMessage("");
    const result = await executeLogin({ username: email, password });

    if (result.data?.login?.__typename === "CurrentUser") {
      // ✅ کد اشتباه client.clearCache() حذف شد
      router.push("/profile");
    } else {
      setErrorMessage("ایمیل یا رمز عبور اشتباه است.");
    }
  };

  return (
    <div className="container mx-auto max-w-sm p-4 flex flex-col justify-center min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">ورود به حساب کاربری</h1>
        <p className="text-gray-400 mt-2">
          خوشحالیم که دوباره شما را می‌بینیم!
        </p>
      </header>
      <div className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-custom-dark-2 rounded-lg p-4 border-none focus:ring-2 focus:ring-custom-yellow"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-custom-dark-2 rounded-lg p-4 border-none focus:ring-2 focus:ring-custom-yellow"
        />
      </div>
      <div className="text-left mt-4">
        <a href="#" className="text-sm text-custom-yellow">
          رمز عبور خود را فراموش کرده‌اید؟
        </a>
      </div>
      {errorMessage && (
        <div className="bg-red-900 border border-red-600 text-red-300 p-3 rounded-lg mt-6 text-center">
          {errorMessage}
        </div>
      )}
      <button
        onClick={handleLogin}
        disabled={loginResult.fetching}
        className="w-full bg-custom-yellow text-black font-bold p-4 rounded-lg mt-6 disabled:bg-gray-500"
      >
        {loginResult.fetching ? "در حال ورود..." : "ورود"}
      </button>
      <div className="text-center mt-6">
        <p className="text-gray-400">
          هنوز حساب کاربری ندارید؟{" "}
          <Link href="/register" className="font-bold text-custom-yellow">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
}
