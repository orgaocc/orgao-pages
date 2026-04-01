import React, { useState, useRef, useEffect } from "react";

declare global {
  interface Window {
    pixel_x_app?: {
      send_event: (data: Record<string, string>) => Promise<void>;
    };
  }
}
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, X } from "lucide-react";
import logoImg from "@/assets/logo-jejum.webp";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
}

type FormDataState = {
  nome: string;
  email: string;
  telefone: string;
};

const INITIAL_FORM_DATA: FormDataState = {
  nome: "",
  email: "",
  telefone: "",
};

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_campaign: params.get("utm_campaign") || "",
    utm_source: params.get("utm_source") || "direto_site",
    utm_medium: params.get("utm_medium") || "direto_site",
    utm_content: params.get("utm_content") || "direto_site",
    utm_term: params.get("utm_term") || "direto_site",
    utm_id: params.get("utm_id") || "",
  };
}

function formatPhoneForWebhook(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("55")) return `+${digits}`;
  return `+55${digits}`;
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatSubmissionDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const FormModal: React.FC<FormModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const synced = useRef(false);

  // Sync PixelX autofill: poll DOM input values when modal opens
  // PixelX sets .value on the DOM directly, bypassing React onChange
  useEffect(() => {
    if (!open || synced.current) return;

    const readDomValues = () => {
      const nome = (document.getElementById("nome") as HTMLInputElement)?.value || "";
      const email = (document.getElementById("email") as HTMLInputElement)?.value || "";
      const telefone = (document.getElementById("telefone") as HTMLInputElement)?.value || "";

      if (nome || email || telefone) {
        synced.current = true;
        setFormData({
          nome,
          email,
          telefone: telefone ? applyPhoneMask(telefone) : "",
        });
      }
    };

    // Poll a few times to catch async PixelX autofill
    const timers = [
      setTimeout(readDomValues, 100),
      setTimeout(readDomValues, 300),
      setTimeout(readDomValues, 600),
      setTimeout(readDomValues, 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [open]);

  // Reset sync flag when modal closes so it re-checks next open
  useEffect(() => {
    if (!open) synced.current = false;
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // On first user interaction, sync ALL fields from DOM to prevent clearing
    if (!synced.current) {
      synced.current = true;
      const nome = (document.getElementById("nome") as HTMLInputElement)?.value || "";
      const email = (document.getElementById("email") as HTMLInputElement)?.value || "";
      const telefone = (document.getElementById("telefone") as HTMLInputElement)?.value || "";
      setFormData({
        nome: name === "nome" ? value : nome,
        email: name === "email" ? value : email,
        telefone: name === "telefone" ? applyPhoneMask(value) : (telefone ? applyPhoneMask(telefone) : ""),
      });
      return;
    }
    if (name === "telefone") {
      setFormData((prev) => ({ ...prev, telefone: applyPhoneMask(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const utms = getUtmParams();

    const body = {
      nome: formData.nome,
      email: formData.email,
      whatsapp: formatPhoneForWebhook(formData.telefone),
      utm_campaign: utms.utm_campaign,
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      utm_page: window.location.pathname,
      lancamento: "PCT33",
      utm_id: utms.utm_id,
      form: "lovable_jejum",
      source: "jep",
      precheckout: "true",
      submission_date: formatSubmissionDate(),
    };

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.functions.invoke("process-lead", {
        body,
      });
    } catch (err) {
      console.error("Process lead error:", err);
    }

    // Pixel X App lead event — must fire before redirect
    try {
      if (window.pixel_x_app?.send_event) {
        const phoneForPixel = formData.telefone.replace(/\D/g, "");
        await window.pixel_x_app.send_event({
          event_name: 'Lead',
          lead_name: formData.nome,
          lead_email: formData.email,
          lead_phone: phoneForPixel,
        });
      }
    } catch (err) {
      console.error("Pixel X App error:", err);
    }

    const utmSource = getUtmParams().utm_source;
    const phoneDigits = formData.telefone.replace(/\D/g, "");
    const xcod = new URLSearchParams(window.location.search).get("xcod");
    let redirectUrl = `https://pay.hotmart.com/E104660930C?checkoutMode=10&name=${encodeURIComponent(formData.nome)}&email=${encodeURIComponent(formData.email)}&phonenumber=${encodeURIComponent(phoneDigits)}&src=${encodeURIComponent(utmSource)}&sck=lovable_page`;
    if (xcod) {
      redirectUrl += `&xcod=${encodeURIComponent(xcod)}`;
    }
    window.location.href = redirectUrl;
  };

  const inputClasses = cn(
    "w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-body",
    "bg-secondary border border-border text-foreground placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage/40",
    "transition-all duration-200"
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-card rounded-3xl p-8 md:p-10 shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <img src={logoImg} alt="Jejum para Engravidar" className="max-w-[150px] h-auto mx-auto mb-4" />
              <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
                Garanta seu ingresso
              </h3>
              <p className="text-muted-foreground text-sm font-body">
                06 a 12 de Abril · Encontros online e ao vivo
              </p>
            </div>

            <form id="formLovable" onSubmit={handleSubmit} className="formLovable elementor-form space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-cta w-full text-lg mt-2"
              >
                {submitting ? "ENVIANDO..." : "QUERO GARANTIR MEU INGRESSO"}
              </button>

              <p className="text-[12px] text-foreground text-center mt-3 leading-snug">
                Os dados coletados são tratados nos termos da Lei Geral de Proteção de Dados e você pode se descadastrar da nossa lista de contatos a qualquer momento.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
