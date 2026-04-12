/**
 * Global Configuration for Sarh Platform
 */
export const config = {
  // Admin Contact Information
  admin: {
    // WhatsApp number for notifications (Future use)
    // Format: Include country code without + or 00 (e.g., 9665XXXXXXXX)
    whatsappNumber: process.env.ADMIN_WHATSAPP_NUMBER || "966500000000",
  },
  
  // Real-time Settings
  notifications: {
    alertSoundUrl: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    highlightDuration: 10000, // 10 seconds
  }
};
