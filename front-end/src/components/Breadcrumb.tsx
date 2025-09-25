"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "…"; // tambahin ellipsis
  }
  return text;
}

interface PropTypes {
  isBook?: boolean;
  bookName?: string;
}

export default function Breadcrumb(prop: PropTypes) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const { isBook, bookName } = prop;
  return (
    <nav className="flex items-center space-x-1 text-gray-600 text-sm">
      {parts.map((part, index) => {
        const href = "/" + parts.slice(0, index + 1).join("/");
        const isLast = index === parts.length - 1;

        const decoded = decodeURIComponent(part);
        const label = truncateText(decoded, 20);

        return (
          <span key={href} className="flex items-center">
            {!isLast ? (
              <Link
                href={href}
                className="capitalize hover:underline hover:text-gray-800"
                title={decoded}
              >
                {label}
              </Link>
            ) : (
              <div className="flex items-center gap-0">
                <span className="capitalize font-medium" title={decoded}>
                  {label}
                </span>

                {isBook && (
                  <>
                    <FaChevronRight className="mx-1 h-4 w-4 text-gray-400" />
                    <span className="capitalize font-medium">{bookName}</span>
                  </>
                )}
              </div>
            )}
            {!isLast && (
              <FaChevronRight className="mx-1 h-4 w-4 text-gray-400" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
