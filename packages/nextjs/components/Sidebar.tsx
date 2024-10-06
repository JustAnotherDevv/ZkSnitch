"use client";

import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { FaucetButton } from "./scaffold-eth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AlertCircle, Building, FileText, Home } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Snitch",
    href: "/create",
    icon: FileText,
  },
  // {
  //   title: "Organizations",
  //   href: "/org",
  //   icon: Building,
  // },
  // {
  //   title: "About",
  //   href: "/about",
  //   icon: AlertCircle,
  // },
];

export default function Sidebar() {
  const location = usePathname();

  // useEffect(() => {
  //   const initializeClient = async () => {};

  //   initializeClient();
  // }, []);

  console.log(location, `\n`, location.split("/"));

  return (
    <div className="flex h-screen flex-col border-r">
      <div className="flex h-18 items-center border-b px-4 py-4">
        <Link className="flex items-center space-x-2" href="/">
          <div className=" overflow-hidden rounded-full">
            <Image
              alt="Snich logo"
              className="cursor-pointer w-12 h-12 overflow-hidden"
              // fill
              src="/snitch.jpeg"
              width="128"
              height="128"
            />
          </div>
          <span className="text-3xl font-extrabold">ZkSnitch</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          {sidebarNavItems.map(item => (
            <Button
              key={item.href}
              variant={location.split("/")[1] === item.href.split("/")[1] ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                location.split("/")[1] === item.href.split("/")[1] && "bg-muted font-medium",
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto mx-auto px-2">
        <FaucetButton />
        {/* <ConnectButton chainStatus="icon" showBalance={false} /> */}
        <ConnectButton chainStatus="icon" showBalance={false} />
        {/* <ConnectButton chainStatus="none" showBalance={false} /> */}
        <p className="text-sm text-gray-400 mt-4 text-center mb-2">Built for EthRome 2024</p>
      </div>
    </div>
  );
}
