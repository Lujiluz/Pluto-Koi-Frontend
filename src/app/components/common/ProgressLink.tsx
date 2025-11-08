"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, MouseEvent, forwardRef } from "react";
import { startGlobalNavigation } from "@/hooks/useNavigationProgress";

interface ProgressLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const ProgressLink = forwardRef<HTMLAnchorElement, ProgressLinkProps>(({ href, children, className, title, onClick, ...props }, ref) => {
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call user's onClick first
    onClick?.(e);

    // Don't start progress for same page or external links
    if (e.defaultPrevented) return;

    const destination = typeof href === "string" ? href : href.pathname || "";

    // Check if it's the same page
    if (destination === pathname) return;

    // Check if it's an external link
    if (destination.startsWith("http") || destination.startsWith("mailto:") || destination.startsWith("tel:")) {
      return;
    }

    // Start the global navigation progress
    startGlobalNavigation();
  };

  return (
    <Link ref={ref} href={href} className={className} title={title} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
});

ProgressLink.displayName = "ProgressLink";

export default ProgressLink;
