"use client";
const PasswordCheck = ({ valid, text }: { valid: boolean; text: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full border flex items-center justify-center text-xs
        ${
          valid
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-400 text-transparent"
        }`}
      >
        ✓
      </div>
      <span
        className={`${
          valid ? "text-green-600" : "text-gray-500"
        } transition-colors`}
      >
        {text}
      </span>
    </div>
  );
};

export default PasswordCheck;
