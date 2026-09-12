import { Instagram, MessageCircle, Mail } from "lucide-react";
import { whatsappNumber } from "@/lib/order";

export const contactLinks = {
  instagram: "https://www.instagram.com/vidanapraialeve/",
  whatsapp: "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent("Olá, estou no site da Vida na Praia Leve e gostaria de fazer um pedido"),
  email: "mailto:contato@vidanapraialeve.com.br",
  location: "https://www.google.com/maps/search/?api=1&query=Peru%C3%ADbe%2C%20SP",
};
export function FooterContacts() {
  return <div className="mt-8 flex items-center gap-3">
    {[
      { Icon: Instagram, label: "Instagram da Vida na Praia Leve", href: contactLinks.instagram },
      { Icon: MessageCircle, label: "Conversar pelo WhatsApp", href: contactLinks.whatsapp },
      { Icon: Mail, label: "Enviar e-mail", href: contactLinks.email },
    ].map(({ Icon, label, href }) => <a key={label} href={href} aria-label={label} title={label} target={href.startsWith("https:") ? "_blank" : undefined} rel={href.startsWith("https:") ? "noopener noreferrer" : undefined} className="size-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-colors">
      <Icon className="size-4" aria-hidden="true" />
    </a>)}
  </div>;
}
