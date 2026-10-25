import { whatsappLink } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/social-icons";

export function WhatsAppButton({ number }: { number: string }) {
  return (
    <a
      href={whatsappLink(number, "Hello HANLAR PURE, I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-4 z-30 flex size-12 items-center justify-center rounded-full bg-black text-gold shadow-lg ring-1 ring-gold/40 transition-transform duration-300 hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
