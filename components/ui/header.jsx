"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="wealth logo"
            height={60}
            width={200}
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Right side auth buttons */}
        <div className="flex items-center space-x-4">

          {isSignedIn && (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

                <Link href="/transaction/create">
                <Button  className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 rounded-xl px-4">
                  <PenBox size={18} />
                  <span className="hidden md:inline"> Add Transaction</span>
                </Button>
              </Link>

              <UserButton appearance={{
                elements:{
                  avatarBox: "w-10 h-10"
                },
              }} />
            </>
          )}

          {!isSignedIn && (
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          )}

        </div>

      </nav>
    </div>
  );
};

export default Header;