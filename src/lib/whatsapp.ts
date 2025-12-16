interface WhatsAppLinkParams {
  phone?: string;
  text: string;
}

export function makeWhatsAppLink({ phone, text }: WhatsAppLinkParams): string {
  const whatsappNumber = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
}

export function getProductEnquiryText(productName: string, productUrl: string): string {
  return `Hi! I'm interested in: ${productName}. Link: ${productUrl}`;
}

export function getGeneralEnquiryText(): string {
  return "Hi! I'd like to make an enquiry about your products.";
}

export function getAbsoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}
