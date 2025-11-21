import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-wide">offerGPT</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com/joekariuki/offerGPT"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-200 transition-colors"
          >
            View on GitHub
          </Link>
          <SignedOut>
            <Link
              href="/sign-in"
              className="hover:text-red-200 transition-colors"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
