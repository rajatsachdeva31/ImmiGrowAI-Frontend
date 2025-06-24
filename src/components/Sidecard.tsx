import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface SideCardProps {
  services: string[];
  title: string;
  urls: string[];
}

export default function SideCard({ services, title, urls }: SideCardProps) {
  return (
    <Card className="md:h-full">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <ul>
          {services.map((service, index) => (
            <li key={index} className="mb-2">
              <Link
                href={urls[index]}
                className={buttonVariants({
                  variant: "ghost",
                  size: "lg",
                  className: "w-full justify-start",
                })}
              >
                {service}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
