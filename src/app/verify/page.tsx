// src/app/verify/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react"; // ✅ ایمپورت کردن Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "urql";
import Link from "next/link";

// Mutation برای تأیید حساب
const VERIFY_ACCOUNT_MUTATION = `
  mutation VerifyCustomer($token: String!) {
    verifyCustomerAccount(token: $token) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on VerificationTokenInvalidError {
        errorCode
        message
      }
      ... on VerificationTokenExpiredError {
        errorCode
        message
      }
    }
  }
`;

// ✅ محتوای اصلی را به یک کامپوننت جدید منتقل می‌کنیم
function VerifyComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [statusMessage, setStatusMessage] = useState(
    "در حال تأیید حساب شما..."
  );

  const [verifyResult, executeVerify] = useMutation(VERIFY_ACCOUNT_MUTATION);

  useEffect(() => {
    const verifyAccount = async () => {
      if (token) {
        const result = await executeVerify({ token });
        const data = result.data?.verifyCustomerAccount;

        if (data?.__typename === "CurrentUser") {
          setStatusMessage(
            "حساب شما با موفقیت تأیید شد! در حال انتقال به پروفایل..."
          );
          setTimeout(() => {
            router.push("/profile");
          }, 2000);
        } else {
          setStatusMessage("خطا در تأیید حساب: لینک نامعتبر یا منقضی شده است.");
        }
      } else {
        setStatusMessage("توکن تأیید یافت نشد.");
      }
    };

    verifyAccount();
  }, [token, executeVerify, router]);

  return (
    <div className="container mx-auto max-w-sm p-4 flex flex-col justify-center items-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">تأیید حساب کاربری</h1>
      <p className="text-gray-400">{statusMessage}</p>
      {verifyResult.error && (
        <Link href="/" className="text-custom-yellow mt-6">
          بازگشت به صفحه اصلی
        </Link>
      )}
    </div>
  );
}

// ✅ کامپوننت اصلی حالا شامل Suspense است
export default function VerifyPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">در حال بارگذاری...</p>}>
      <VerifyComponent />
    </Suspense>
  );
}
