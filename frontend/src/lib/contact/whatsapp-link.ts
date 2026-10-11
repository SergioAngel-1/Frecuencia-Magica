const WHATSAPP_BASE = 'https://wa.me/';

/**
 * Enlace «click to chat» de WhatsApp con el mensaje ya escrito.
 *
 * `number` va en formato internacional; se ignora todo lo que no sea cifra
 * (`+`, espacios, guiones). Sin cifras, el enlace no lleva destinatario y
 * WhatsApp deja elegirlo.
 */
export function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, '');
  const text = message.trim();

  return `${WHATSAPP_BASE}${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
