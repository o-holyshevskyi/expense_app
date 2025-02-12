import { navItems } from "@/shared/nav-items";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-[100%] flex flex-wrap justify-center items-center gap-10">
      {navItems.map((cardItem, index) => (
        <Card
          key={cardItem.id}
          isPressable
          className={`dark:bg-zinc-900 max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] opacity-0 animate-fade-in delay-${index * 100}`}
        >
          <CardBody className="flex justify-center items-center">
            <Link href={cardItem.href} passHref>
              <div className="flex flex-col justify-center items-center">
                <p className="text-tiny uppercase font-bold dark:text-zinc-300 text-default-500 mb-2">{cardItem.label}</p>
                {cardItem.icon}
              </div>
            </Link>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
