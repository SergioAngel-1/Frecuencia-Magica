/**
 * Canales de contacto directo.
 *
 * El número de WhatsApp llega por entorno (`NEXT_PUBLIC_WHATSAPP_NUMBER`) en
 * formato internacional; aquí se queda sólo con las cifras. Sin número, el
 * enlace abre WhatsApp con el mensaje ya escrito y deja elegir el contacto:
 * nunca apunta a un teléfono inventado.
 */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
