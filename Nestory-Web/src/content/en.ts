import type { Dictionary } from "./types";

export const en: Dictionary = {
  locale: "en",
  meta: {
    title: "Nestory — Your Home's Smart Inventory Assistant",
    description:
      "Manage your pantry, shopping list, bills, assets, and medicine from one place with Nestory. Reduce waste with expiry reminders, barcode scanning, and smart shopping suggestions.",
  },
  nav: {
    home: "Home",
    features: "Features",
    support: "Support",
    privacy: "Privacy",
  },
  hero: {
    eyebrow: "A smarter way to run your home",
    title: "A record of everything in your home, in one place.",
    subtitle:
      "Pantry, shopping list, bills, assets, and medicine tracking — Nestory brings it all together. Get notified before things expire, cut down on waste, and stay in sync with the rest of your household.",
    ctaPrimary: "Explore the app",
    ctaSecondary: "How it works",
  },
  showcase: {
    eyebrow: "Inside the app",
    title: "Scroll to explore",
    subtitle: "Here's how Nestory fits into your everyday routine.",
    items: [
      {
        tag: "Pantry",
        title: "Scan a barcode, we handle the rest",
        description:
          "Add items by barcode or photo and set the expiry date. Nestory reminds you before anything goes to waste.",
      },
      {
        tag: "Shopping",
        title: "Smart shopping suggestions",
        description:
          "Nestory learns your consumption patterns and suggests restocking items before you run out — automatically added to your list.",
      },
      {
        tag: "Bills & Assets",
        title: "Never miss a due date or warranty",
        description:
          "Track bill due dates and warranty periods for your electronics in one screen, with timely reminders.",
      },
      {
        tag: "Waste Report",
        title: "See exactly what you're wasting",
        description:
          "Monthly reports show the total value of discarded items, helping you rethink your shopping habits.",
      },
      {
        tag: "Household Sharing",
        title: "Manage it together",
        description:
          "Everyone linked to the same home sees the pantry, list, and bills; changes reach every member instantly via push notifications.",
      },
    ],
  },
  features: {
    eyebrow: "What you can do",
    title: "One app, everything your home needs",
    items: [
      {
        icon: "pantry",
        title: "Pantry Tracking",
        description:
          "Add items by barcode or photo, get notified before their expiry date arrives.",
      },
      {
        icon: "shopping",
        title: "Smart Shopping List",
        description:
          "Items you're running low on get suggested automatically; share the list with your household.",
      },
      {
        icon: "bills",
        title: "Bill Tracking",
        description:
          "Never miss a due date, keep every past payment in one place.",
      },
      {
        icon: "assets",
        title: "Asset & Warranty Tracking",
        description:
          "Record purchase dates and warranty periods for your electronics and valuables.",
      },
      {
        icon: "medicine",
        title: "Medicine Reminders",
        description:
          "Track doses and expiry dates so you never miss a dose.",
      },
      {
        icon: "waste",
        title: "Waste Report",
        description:
          "See the monetary value of discarded items and improve your shopping decisions.",
      },
      {
        icon: "widget",
        title: "Home Screen Widget",
        description:
          "See what's expiring today right from your home screen, no need to open the app.",
      },
      {
        icon: "family",
        title: "Household Sharing",
        description:
          "Everyone sharing a home stays up to date, with instant push notifications for changes.",
      },
    ],
  },
  download: {
    title: "Nestory is coming soon",
    subtitle:
      "The iOS and Android apps are currently in testing. Be the first to know when they launch.",
    comingSoon: "Coming Soon",
    appStore: "App Store",
    playStore: "Google Play",
  },
  footer: {
    tagline: "Your home's smart inventory assistant.",
    productTitle: "Product",
    languageTitle: "Language",
    rights: "All rights reserved.",
  },
  support: {
    title: "Support",
    intro:
      "Have a question about Nestory? Browse the frequently asked questions below or reach out to us directly.",
    faq: [
      {
        q: "How can I download Nestory?",
        a: "The app is currently in testing. Once it's live on the iOS and Android stores, it will be announced on this page.",
      },
      {
        q: "Is my data safe?",
        a: "Yes. The camera is used only on your device — photos are never uploaded to our servers. We do not share your data with third parties or use it for marketing. See our Privacy Policy for details.",
      },
      {
        q: "How do I delete my account and data?",
        a: "From within the app, go to Settings > Danger Zone and confirm with your password to permanently delete your account. All data for homes you own is removed as part of this process.",
      },
      {
        q: "How do I share a home with other people?",
        a: "You can invite household members from within the app. Invited members can view and edit the shared pantry, shopping list, and bills.",
      },
      {
        q: "I want to report a bug or suggest a feature, how do I reach you?",
        a: "You can always reach us at support@nestoryhomekit.com. Your feedback helps us improve the app.",
      },
    ],
    contactTitle: "Get in touch",
    contactBody:
      "For questions, feedback, or support requests, you can email us at:",
  },
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: July 2026",
    intro:
      "This Privacy Policy explains what data is collected and how it is used when you use the Nestory app.",
    sections: [
      {
        heading: "Data we collect",
        body: "This app stores your name, email, and the pantry, shopping, household, bill, and asset data you enter, plus medicine records, so it can provide its core features to you and the members of your home.",
      },
      {
        heading: "Camera usage",
        body: "Camera access is used only on your device (for barcode/expiry-date scanning) — photos are never uploaded to our servers.",
      },
      {
        heading: "Notifications",
        body: "Your push notification token is stored so we can send you expiry and bill-due reminders.",
      },
      {
        heading: "Sharing with third parties",
        body: "We do not sell your data to third parties or share it for marketing.",
      },
      {
        heading: "Account deletion",
        body: "When you delete your account, all data for homes you own is permanently removed.",
      },
    ],
    contact:
      "For questions about how your data is handled, contact privacy@nestoryhomekit.com.",
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated: July 2026",
    body: "By using this app you agree to use it only for its intended purpose of managing your household's pantry, shopping, bills, assets, and related information. The app does not provide medical or financial advice — the medicine and bill modules are for reminders and record-keeping only. Expiry-date and barcode scanning results are informational; final food-safety decisions are yours. The app is provided as-is, without warranty of any kind, and is under active development, so features may change.",
    contact: "For questions, contact support@nestoryhomekit.com.",
  },
  accountDeletion: {
    title: "Account Deletion",
    intro:
      "If you'd like to permanently delete your Nestory account and the data linked to it, you can do so in a few steps from within the app.",
    stepsTitle: "How to delete",
    steps: [
      "Open the Nestory app and go to the Settings tab.",
      'Scroll to the "Danger Zone" section and tap "Delete Account".',
      "Enter your current password to confirm your identity and confirm the action.",
      "Once confirmed, your account and the data listed below are permanently deleted — this cannot be undone.",
    ],
    dataRemovedTitle: "What gets deleted",
    dataRemoved:
      "When your account is deleted, your profile information (name, email, password), session, and push notification tokens are removed. All data for homes you own — including pantry, shopping list, bill, asset, and medicine records — is permanently deleted. If you're a member of a home owned by someone else, only your link to that home is removed; the home's data is unaffected.",
    blockedTitle: "When deletion isn't immediate",
    blocked:
      "If a home you own still has other active members, account deletion is blocked. In that case, you'll need to either transfer ownership to another member or remove the other members from the home first.",
    contact:
      "To request account deletion without using the app, or for any questions, contact privacy@nestoryhomekit.com.",
  },
};
