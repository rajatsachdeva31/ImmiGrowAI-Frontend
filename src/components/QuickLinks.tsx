import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function QuickLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <Card>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={buttonVariants({
                variant: "outline",
                size: "lg", 
                className: "w-full",
              })}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}