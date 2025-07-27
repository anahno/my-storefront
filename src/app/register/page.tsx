// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useMutation } from "urql";
import Link from "next/link";
// ✅ ایمپورت useRouter حذف شد چون استفاده نمی‌شد
// import { useRouter } from "next/navigation";

// کوئری ثبت‌نام بدون تغییر باقی می‌ماند
const REGISTER_MUTATION = `
  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      __typename
    }
  }
`;

export default function RegisterPage() {
  // ✅ تعریف router حذف شد
  // const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const [registerResult, executeRegister] = useMutation(REGISTER_MUTATION);

  const handleRegister = async () => {
    setStatusMessage({ type: "", text: "" });

    const result = await executeRegister({
      input: {
        firstName,
        lastName,
        emailAddress: email,
        password,
      },
    });

    if (result.error) {
      if (result.error.message.includes("already exists")) {
        setStatusMessage({
          type: "error",
          text: "این ایمیل قبلاً ثبت شده است. لطفاً وارد شوید.",
        });
      } else if (result.error.message.includes("not strong enough")) {
        setStatusMessage({
          type: "error",
          text: "رمز عبور باید حداقل ۴ کاراکتر باشد.",
        });
      } else {
        setStatusMessage({ type: "error", text: "خطایی در ثبت‌نام رخ داد." });
      }
    } else if (result.data?.registerCustomerAccount?.__typename === "Success") {
      setStatusMessage({
        type: "success",
        text: "ثبت‌نام شما با موفقیت انجام شد! لطفاً ایمیل خود را برای لینک فعال‌سازی بررسی کنید.",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-sm p-4 flex flex-col justify-center min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">ایجاد حساب کاربری</h1>
        <p className="text-gray-400 mt-2">
          برای خرید و دسترسی به امکانات، ثبت‌نام کنید.
        </p>
      </header>

      {statusMessage.type === "success" ? (
        <div className="bg-green-900 border border-green-600 text-green-300 p-4 rounded-lg text-center">
          <p>{statusMessage.text}</p>
          <Link
            href="/login"
            className="font-bold text-custom-yellow mt-4 inline-block"
          >
            رفتن به صفحه ورود
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="نام"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-custom-dark-2 rounded-lg p-4 border-none focus:ring-2 focus:ring-custom-yellow"
            />
            <input
              type="text"
              placeholder="نام خانوادگی"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-custom-dark-2 rounded-lg p-4 border-none focus:ring-2 focus:ring-custom-yellow"
            />
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

          {statusMessage.type === "error" && (
            <div className="bg-red-900 border border-red-600 text-red-300 p-3 rounded-lg mt-6 text-center">
              {statusMessage.text}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={registerResult.fetching}
            className="w-full bg-custom-yellow text-black font-bold p-4 rounded-lg mt-6 disabled:bg-gray-500"
          >
            {registerResult.fetching ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              حساب کاربری دارید؟{" "}
              <Link href="/login" className="font-bold text-custom-yellow">
                وارد شوید
              </Link>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
