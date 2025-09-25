"use client";
import CustomResult from "@/components/CustomResult";
import { useSearchParams } from "next/navigation";

export default async function ResultPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  if (!status) return null;
  return (
    <>
      <div className="w-screen h-screen flex m-0 justify-center items-center">
        <CustomResult result={status as "success" | "failed" | "error"} />
      </div>
    </>
  );
}
