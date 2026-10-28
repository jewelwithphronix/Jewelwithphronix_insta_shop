// Change your store details here — header, footer and product page all read from this file.
export const BRAND = {
  name: "Jewelwithphronix",
  initial: "J", // letter shown inside the round logo mark
  tagline: "The joy of wearing best.",
  announcements: [
    "Get Free Shipping above ₹5000",
    "Flat 20% OFF on orders above ₹1,00,000",
  ],
  freeShippingAbove: 5000, // cart madhe free shipping progress bar
  shippingFee: null, // shipping charge (₹) below freeShippingAbove; null = "confirmed on WhatsApp"
  bulkOffer: { above: 100000, percent: 20 }, // announcement madhla "Flat 20% OFF above ₹1,00,000"
  pickupStore: "Jewelwithphronix,Nashik", // shown under "Pickup available at"
  whatsapp: "+91 92724 71332",
  email: "teamphronix@gmail.com",
  instagram: "https://www.instagram.com/jewelwithphronix?vrfl=MTR2YTV2NGk5amNrNQ==",
  gst: "YOUR-GST-NUMBER",
  requireLogin: true, // true = aadhi sign in kara
  // adminPassword: "phronix@admin", // he BADLA
  adminEmail: "jewelwithphronix@gmail.com", // fakt ha email /admin vaparu shakto
  returnFormUrl: "", // Google Form link ithe taka
  storeAddress: "Jewelwithphronix,Nashik, Maharashtra, India",
  hours: "Mon – Sat, 10:00 AM – 7:00 PM",
};