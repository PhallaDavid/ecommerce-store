"use client"

import * as React from "react"

export type Language = "en" | "kh"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.brands": "Brands",
    "nav.deals": "Deals",
    "nav.newArrivals": "New Arrivals",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.signIn": "Sign In",
    "nav.account": "Account",
    "nav.profile": "Profile",
    "nav.orders": "My Orders",
    "nav.settings": "Settings",
    "nav.logout": "Logout",
    "nav.search": "Search ...",
    "nav.browseCategories": "Browse Categories",
    "nav.browseBrands": "Browse Brands",
    "nav.viewAll": "View all",
    
    // Auth
    "auth.welcomeBack": "Welcome back",
    "auth.createAccount": "Create an account",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.signUp": "Sign up",
    "auth.signIn": "Sign in",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.fullName": "Full Name",
    "auth.phone": "Phone Number",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot password?",
    "auth.continueWith": "Or continue with",
    "auth.byClicking": "By clicking continue, you agree to our",
    "auth.terms": "Terms of Service",
    "auth.privacy": "Privacy Policy",
    "auth.accountCreated": "Your account has been successfully created. Redirecting to login page...",
    "auth.continueToLogin": "Continue to Login",
    "auth.minCharacters": "Minimum 8 characters.",
    "auth.google": "Continue with Google",
    
    // Home
    "home.topCategories": "Top Categories",
    "home.topBrands": "Top Brands",
    "home.promotion": "Promotion Products",
    "home.newArrivals": "New Arrivals",
    "home.flashSale": "Flash Sale",
    "home.shopNow": "Shop Now",
    "home.seeAll": "See All",
    "home.browseCategories": "Browse Categories",
    "home.browseBrands": "Browse Brands",
    "home.noBanners": "No banners",
    "home.addBanners": "Add active banners to show here.",
    "home.newCollection": "New Collection",
    "home.exploreCollection": "Explore our latest arrivals and style trends.",
    "home.viewMore": "View More",

    // Profile
    "profile.title": "My Profile",
    "profile.personalInfo": "Personal Information",
    "profile.saveChanges": "Save Changes",
    "profile.editProfile": "Edit Profile",
    "profile.phone": "Phone Number",
    "profile.age": "Age",
    "profile.gender": "Gender",
    "profile.genderSelect": "Select gender",
    "profile.male": "Male",
    "profile.female": "Female",
    "profile.address": "Address",
    "profile.memberSince": "Member since",
    "profile.updateProfile": "Update Profile",
    "profile.refresh": "Refresh",
    "profile.saving": "Saving...",
    "profile.updateSuccess": "Profile updated successfully!",
    "profile.updateError": "Failed to update profile",
    "profile.notLoggedIn": "You are not logged in",
    "profile.loginToFetch": "Login to fetch your profile and update it.",
    "profile.avatarUrl": "Avatar URL",
    "profile.pasteUrl": "Paste an image URL to update your avatar.",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.paymentMethod": "Payment Method",
    "checkout.orderSummary": "Order Summary",
    "checkout.subtotal": "Subtotal",
    "checkout.shipping": "Shipping Fee",
    "checkout.total": "Total",
    "checkout.placeOrder": "Place Order",
    "checkout.deliveryAddress": "Delivery Address",
    "checkout.selectLocation": "Select Location on Map",
    "checkout.items": "items",
    "checkout.stepCart": "Cart",
    "checkout.stepDelivery": "Delivery",
    "checkout.stepPayment": "Payment",
    "checkout.stepDone": "Done",
    "checkout.reviewCart": "Review your cart",
    "checkout.deliveryDetails": "Delivery Details",
    "checkout.orderPlaced": "Order Placed! 🎉",
    "checkout.thankYou": "Thank you! Confirmation sent to",
    "checkout.continueShopping": "Continue Shopping",
    "checkout.goHome": "Go Home",
    "checkout.scanBank": "Scan with any Cambodian banking app",
    "checkout.fastDelivery": "Fast Delivery",
    "checkout.securePay": "Secure Pay",
    "checkout.encrypted": "Encrypted",
    "checkout.couponCode": "Coupon Code",
    "checkout.apply": "Apply",
    "checkout.applied": "Applied ✓",
    "checkout.back": "Back",
    "checkout.continueToDelivery": "Continue to Delivery",
    "checkout.continueToPayment": "Continue to Payment",
    "checkout.placingOrder": "Placing Order...",

    // Cart / Sheets
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.addToCart": "Add to Cart",
    "product.viewDetails": "View Details",
    "fav.title": "Favourites",
    "fav.empty": "You haven't added any favourites yet",
    
    // Common
    "common.loading": "Loading...",
    "common.backToHome": "Back to Home",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.success": "Success",

    // Themes
    "nav.theme": "Theme",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    
    // Footer
    "footer.description": "Modern essentials, fast delivery, and secure checkout — built for everyday shopping.",
    "footer.quickLinks": "Quick Links",
    "footer.social": "Social",
    "footer.paymentMethods": "Payment Methods",
    "footer.allRightsReserved": "All rights reserved.",
  },
  kh: {
    // Header
    "nav.home": "ទំព័រដើម",
    "nav.categories": "ប្រភេទផលិតផល",
    "nav.brands": "ម៉ាកផលិតផល",
    "nav.deals": "ការបញ្ចុះតម្លៃ",
    "nav.newArrivals": "ផលិតផលថ្មី",
    "nav.about": "អំពីយើង",
    "nav.contact": "ទំនាក់ទំនង",
    "nav.signIn": "ចូលប្រើ",
    "nav.account": "គណនី",
    "nav.profile": "ព័ត៌មានផ្ទាល់ខ្លួន",
    "nav.orders": "ការបញ្ជាទិញ",
    "nav.settings": "ការកំណត់",
    "nav.logout": "ចាកចេញ",
    "nav.search": "ស្វែងរក ...",
    "nav.browseCategories": "ស្វែងរកតាមប្រភេទ",
    "nav.browseBrands": "ស្វែងរកតាមម៉ាក",
    "nav.viewAll": "មើលទាំងអស់",

    // Auth
    "auth.welcomeBack": "សូមស្វាគមន៍ត្រឡប់មកវិញ",
    "auth.createAccount": "បង្កើតគណនី",
    "auth.login": "ចូលប្រើ",
    "auth.register": "ចុះឈ្មោះ",
    "auth.signUp": "ចុះឈ្មោះ",
    "auth.signIn": "ចូលប្រើ",
    "auth.noAccount": "មិនទាន់មានគណនីមែនទេ?",
    "auth.hasAccount": "មានគណនីរួចហើយមែនទេ?",
    "auth.fullName": "ឈ្មោះពេញ",
    "auth.phone": "លេខទូរស័ព្ទ",
    "auth.password": "ពាក្យសម្ងាត់",
    "auth.confirmPassword": "បញ្ជាក់ពាក្យសម្ងាត់",
    "auth.forgotPassword": "ភ្លេចពាក្យសម្ងាត់?",
    "auth.continueWith": "ឬបន្តជាមួយ",
    "auth.byClicking": "តាមរយៈការចុះឈ្មោះ អ្នកយល់ព្រមតាម",
    "auth.terms": "លក្ខខណ្ឌប្រើប្រាស់",
    "auth.privacy": "គោលការណ៍ឯកជនភាព",
    "auth.accountCreated": "គណនីរបស់អ្នកត្រូវបានបង្កើតដោយជោគជ័យ។ កំពុងបញ្ជូនទៅកាន់ទំព័រចូលប្រើ...",
    "auth.continueToLogin": "បន្តទៅកាន់ការចូលប្រើ",
    "auth.minCharacters": "យ៉ាងហោចណាស់ ៨ តួអក្សរ។",
    "auth.google": "បន្តជាមួយ Google",

    // Home
    "home.topCategories": "ប្រភេទពេញនិយម",
    "home.topBrands": "ម៉ាកផលិតផលពេញនិយម",
    "home.promotion": "ផលិតផលបញ្ចុះតម្លៃ",
    "home.newArrivals": "ផលិតផលថ្មីៗ",
    "home.flashSale": "ការលក់បង្គ្រប់",
    "home.shopNow": "ទិញឥឡូវនេះ",
    "home.seeAll": "មើលទាំងអស់",
    "home.browseCategories": "ស្វែងរកតាមប្រភេទ",
    "home.browseBrands": "ស្វែងរកតាមម៉ាក",
    "home.noBanners": "គ្មានផ្ទាំងផ្សាយពាណិជ្ជកម្ម",
    "home.addBanners": "បន្ថែមផ្ទាំងផ្សាយពាណិជ្ជកម្មដើម្បីបង្ហាញនៅទីនេះ។",
    "home.newCollection": "បណ្តុំផលិតផលថ្មី",
    "home.exploreCollection": "ស្វែងរកផលិតផលថ្មីៗ និងនិន្នាការម៉ូដចុងក្រោយបំផុតរបស់យើង។",
    "home.viewMore": "មើលបន្ថែម",

    // Profile
    "profile.title": "គណនីរបស់ខ្ញុំ",
    "profile.personalInfo": "ព័ត៌មានផ្ទាល់ខ្លួន",
    "profile.saveChanges": "រក្សាទុកការផ្លាស់ប្តូរ",
    "profile.editProfile": "កែសម្រួលព័ត៌មាន",
    "profile.phone": "លេខទូរស័ព្ទ",
    "profile.age": "អាយុ",
    "profile.gender": "ភេទ",
    "profile.genderSelect": "ជ្រើសរើសភេទ",
    "profile.male": "ប្រុស",
    "profile.female": "ស្រី",
    "profile.address": "អាសយដ្ឋាន",
    "profile.memberSince": "សមាជិកតាំងពី",
    "profile.updateProfile": "ធ្វើបច្ចុប្បន្នភាពព័ត៌មាន",
    "profile.refresh": "ទាញយកឡើងវិញ",
    "profile.saving": "កំពុងរក្សាទុក...",
    "profile.updateSuccess": "ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាព!",
    "profile.updateError": "ការធ្វើបច្ចុប្បន្នភាពព័ត៌មានបានបរាជ័យ",
    "profile.notLoggedIn": "អ្នកមិនទាន់បានចូលប្រើទេ",
    "profile.loginToFetch": "ចូលប្រើដើម្បីទាញយកព័ត៌មានរបស់អ្នក។",
    "profile.avatarUrl": "តំណភ្ជាប់រូបភាព",
    "profile.pasteUrl": "បិទភ្ជាប់តំណភ្ជាប់រូបភាពដើម្បីប្តូររូបតំណាងរបស់អ្នក។",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.paymentMethod": "វិធីសាស្រ្តទូទាត់",
    "checkout.orderSummary": "សេចក្តីសង្ខេបនៃការបញ្ជាទិញ",
    "checkout.subtotal": "តម្លៃសរុប",
    "checkout.shipping": "ថ្លៃសេវាដឹកជញ្ជូន",
    "checkout.total": "តម្លៃសរុបរួម",
    "checkout.placeOrder": "បញ្ជាទិញឥឡូវនេះ",
    "checkout.deliveryAddress": "អាសយដ្ឋានដឹកជញ្ជូន",
    "checkout.selectLocation": "ជ្រើសរើសទីតាំងលើផែនទី",
    "checkout.items": "មុខទំនិញ",
    "checkout.stepCart": "កន្ត្រក",
    "checkout.stepDelivery": "ការដឹកជញ្ជូន",
    "checkout.stepPayment": "ការទូទាត់",
    "checkout.stepDone": "រួចរាល់",
    "checkout.reviewCart": "ពិនិត្យកន្ត្រកទំនិញ",
    "checkout.deliveryDetails": "ព័ត៌មានដឹកជញ្ជូន",
    "checkout.orderPlaced": "ការបញ្ជាទិញបានជោគជ័យ! 🎉",
    "checkout.thankYou": "សូមអគុណ! ការបញ្ជាក់ត្រូវបានផ្ញើទៅកាន់",
    "checkout.continueShopping": "បន្តទិញទំនិញ",
    "checkout.goHome": "ត្រឡប់ទៅដើម",
    "checkout.scanBank": "ស្កេនជាមួយកម្មវិធីធនាគារណាក៏បាន",
    "checkout.fastDelivery": "ដឹករហ័ស",
    "checkout.securePay": "ទូទាត់មានសុវត្ថិភាព",
    "checkout.encrypted": "ប្រព័ន្ធការពារ",
    "checkout.couponCode": "លេខកូដបញ្ចុះតម្លៃ",
    "checkout.apply": "បញ្ជាក់",
    "checkout.applied": "បានបញ្ជាក់ ✓",
    "checkout.back": "មកវិញ",
    "checkout.continueToDelivery": "បន្តទៅការដឹកជញ្ជូន",
    "checkout.continueToPayment": "បន្តទៅការទូទាត់",
    "checkout.placingOrder": "កំពុងបញ្ជាទិញ...",

    // Cart / Sheets
    "cart.title": "កន្ត្រកទំនិញ",
    "cart.empty": "កន្ត្រកទំនិញរបស់អ្នកទទេ",
    "cart.addItems": "បន្ថែមទំនិញដើម្បីមើលវានៅទីនេះ។",
    "cart.continueShopping": "បន្តការទិញទំនិញ",
    "cart.checkout": "ទៅកាន់ការ Checkout",
    "cart.subtotal": "តម្លៃសរុប",
    "cart.addToCart": "បន្ថែមទៅកន្ត្រក",
    "product.viewDetails": "មើលផលិតផល",
    "fav.title": "ទំនិញដែលពេញចិត្ត",
    "fav.empty": "អ្នកមិនទាន់មានទំនិញដែលពេញចិត្តនៅឡើយទេ",

    // Common
    "common.loading": "កំពុងផ្ទុក...",
    "common.backToHome": "ត្រឡប់ទៅទំព័រដើម",
    "common.error": "មានកំហុសមួយបានកើតឡើង",
    "common.retry": "ព្យាយាមម្តងទៀត",
    "common.success": "ជោគជ័យ",

    // Themes
    "nav.theme": "រចនាប័ទ្ម",
    "theme.light": "ពន្លឺ",
    "theme.dark": "ងងឹត",
    "theme.system": "ប្រព័ន្ធ",

    // Footer
    "footer.description": "សម្ភារៈប្រើប្រាស់ទាន់សម័យ ការដឹកជញ្ជូនរហ័ស និងការទូទាត់ដែលមានសុវត្ថិភាព — បង្កើតឡើងសម្រាប់តម្រូវការទិញទំនិញប្រចាំថ្ងៃរបស់អ្នក។",
    "footer.quickLinks": "តំណភ្ជាប់រហ័ស",
    "footer.social": "បណ្តាញសង្គម",
    "footer.paymentMethods": "វិធីសាស្ត្រទូទាត់",
    "footer.allRightsReserved": "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  }
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<Language>("en")

  React.useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "kh")) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    return (translations[language] as Record<string, string>)[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
