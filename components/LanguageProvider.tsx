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
    "checkout.notePlaceholder": "e.g. Deliver at 5pm",
    "checkout.contactInfo": "Contact Information",
    "checkout.phone": "Phone Number",
    "checkout.orderNote": "Delivery Note (Optional)",

    // Orders
    "orders.title": "My Orders",
    "orders.searchPlaceholder": "Search by order ID...",
    "orders.noOrders": "No orders found",
    "orders.noOrdersDesc": "You haven't placed any orders yet.",
    "order.id": "Order ID",
    "order.date": "Date",
    "order.total": "Total",
    "order.items": "Items",
    "order.itemsCount": "items",
    "order.viewDetails": "View Details",
    "order.hideDetails": "Hide Details",
    "order.reorder": "Reorder",
    "order.track": "Track",
    "order.payment": "Payment",
    "order.deliveryTo": "Delivery to",
    "order.qty": "Qty",
    "order.status.pending": "Pending",
    "order.status.processing": "Processing",
    "order.status.shipped": "Shipped",
    "order.status.delivered": "Delivered",
    "order.status.cancelled": "Cancelled",
    "order.payNow": "Pay Now",

    // Cart / Sheets
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.checkout": "Checkout",
    "cart.subtotal": "Subtotal",
    "cart.addToCart": "Add to Cart",
    "product.viewDetails": "View Details",
    "fav.title": "Favourites",
    "fav.empty": "You haven't added any favourites yet",
    "product.color": "Color",
    "product.selectSize": "Select Size",
    "product.sizeGuide": "Size Guide",
    "product.about": "About the Product",
    "product.shippingReturns": "Shipping & Returns",
    "product.care": "Care Instructions",
    "product.similar": "Similar Products",
    "product.fastShipping": "Fast Shipping",
    "product.securePay": "Secure Pay",
    "product.easyReturns": "Easy Returns",
    "product.noDescription": "No description provided for this product yet.",
    "product.shippingDesc": "We offer free standard shipping on all orders over $50. Standard delivery typically takes 3-5 business days. If you're not completely satisfied with your purchase, it can be returned within 30 days of receipt, provided the items remain in their original condition.",
    "product.careDesc": "Machine wash cold with like colors. Do not bleach. Tumble dry low. Iron on low heat if necessary. Do not dry clean.",
    
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
    
    // Categories & Brands pages
    "cat.title": "Categories",
    "cat.description": "Browse by category to find what you want faster.",
    "cat.searchPlaceholder": "Search in this category...",
    "cat.noProducts": "No products found",
    "cat.noProductsDesc": "We couldn't find any products in this category.",
    "brand.title": "Brands",
    "brand.description": "Pick a brand to browse products.",
    "brand.searchPlaceholder": "Search in this brand...",
    "brand.noProducts": "No products found",
    "brand.noProductsDesc": "We couldn't find any products for this brand.",
    "common.productsFound": "products found",
    "sort.newest": "Newest Arrivals",
    "sort.oldest": "Oldest First",
    "sort.priceLow": "Price: Low to High",
    "sort.priceHigh": "Price: High to Low",

    // Favourites
    "fav.noFavs": "No favourites yet",
    "fav.description": "Tap the heart icon on a product to save it.",

    // Image Search
    "search.upload": "Upload Image",
    "search.imageDesc": "Search by image to find similar products",
    "search.title": "Search for products",
    "search.instruction": "Enter a search term or upload an image to find products",

    // Maintenance
    "error.maintenanceTitle": "Under Maintenance",
    "error.maintenanceDesc": "We're currently performing some scheduled maintenance. We'll be back online shortly.",
    "error.serverDownTitle": "Server Unavailable",
    "error.serverDownDesc": "We're having trouble connecting to our servers. Please try again later.",
    "error.refresh": "Refresh Page",
    "error.noInternetTitle": "No Internet Connection",
    "error.noInternetDesc": "Please check your network settings and try again.",

    // FAQs
    "faq.title": "Frequently Asked Questions",
    "faq.description": "Everything you need to know about our products and services.",
    "faq.q1": "What are your shipping hours?",
    "faq.a1": "We deliver from 8:00 AM to 6:00 PM every day.",
    "faq.q2": "Do you offer cash on delivery?",
    "faq.a2": "Yes, we support Cash on Delivery (COD) for most areas.",
    "faq.q3": "How can I track my order?",
    "faq.a3": "You can check your order status in your profile history.",
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
    "checkout.notePlaceholder": "ឧទាហរណ៍៖ ដឹកជញ្ជូននៅម៉ោង ៥ ល្ងាច",
    "checkout.contactInfo": "ព័ត៌មានទំនាក់ទំនង",
    "checkout.phone": "លេខទូរស័ព្ទ",
    "checkout.orderNote": "ចំណាំការដឹកជញ្ជូន (ជម្រើស)",

    // Orders
    "orders.title": "ការបញ្ជាទិញរបស់ខ្ញុំ",
    "orders.searchPlaceholder": "ស្វែងរកតាមលេខកូដបញ្ជាទិញ...",
    "orders.noOrders": "រកមិនឃើញការបញ្ជាទិញទេ",
    "orders.noOrdersDesc": "អ្នកមិនទាន់បានធ្វើការបញ្ជាទិញនៅឡើយទេ។",
    "order.id": "លេខកូដបញ្ជាទិញ",
    "order.date": "កាលបរិច្ឆេទ",
    "order.total": "សរុប",
    "order.items": "ទំនិញ",
    "order.itemsCount": "ទំនិញ",
    "order.viewDetails": "មើលព័ត៌មានលម្អិត",
    "order.hideDetails": "លាក់ព័ត៌មានលម្អិត",
    "order.reorder": "បញ្ជាទិញម្តងទៀត",
    "order.track": "តាមដាន",
    "order.payment": "ការទូទាត់",
    "order.deliveryTo": "ដឹកជញ្ជូនទៅ",
    "order.qty": "ចំនួន",
    "order.status.pending": "កំពុងរងចាំ",
    "order.status.processing": "កំពុងរៀបចំ",
    "order.status.shipped": "កំពុងដឹកជញ្ជូន",
    "order.status.delivered": "បានដឹកជញ្ជូន",
    "order.status.cancelled": "បានបោះបង់",
    "order.payNow": "ទូទាត់ឥឡូវនេះ",

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
    "product.color": "ពណ៌",
    "product.selectSize": "ជ្រើសរើសទំហំ",
    "product.sizeGuide": "តារាងទំហំ",
    "product.about": "អំពីផលិតផល",
    "product.shippingReturns": "ការដឹកជញ្ជូន និងការបង្វិលសង",
    "product.care": "ការថែទាំ",
    "product.similar": "ផលិតផលស្រដៀងគ្នា",
    "product.fastShipping": "ដឹករហ័ស",
    "product.securePay": "ទូទាត់សុវត្ថិភាព",
    "product.easyReturns": "ប្តូរវិញងាយស្រួល",
    "product.noDescription": "មិនទាន់មានការពិពណ៌នាសម្រាប់ផលិតផលនេះនៅឡើយទេ។",
    "product.shippingDesc": "យើងផ្តល់ជូននូវការដឹកជញ្ជូនស្តង់ដារដោយឥតគិតថ្លៃសម្រាប់ការបញ្ជាទិញទាំងអស់លើសពី ៥០ ដុល្លារ។ ការដឹកជញ្ជូនតាមស្តង់ដារជាធម្មតាចំណាយពេល ៣-៥ ថ្ងៃនៃថ្ងៃធ្វើការ។ ប្រសិនបើអ្នកមិនពេញចិត្តទាំងស្រុងចំពោះការទិញរបស់អ្នកទេ វាអាចត្រូវបានបង្វិលសងវិញក្នុងរយៈពេល ៣០ ថ្ងៃបន្ទាប់ពីការទទួល បានផ្តល់ថាទំនិញស្ថិតក្នុងស្ថានភាពដើមរបស់វា។",
    "product.careDesc": "បោកគក់ក្នុងម៉ាស៊ីនដោយទឹកត្រជាក់ជាមួយពណ៌ស្រដៀងគ្នា។ កុំប្រើទឹកសាវែ។ សម្ងួតក្នុងកម្រិតទាប។ អ៊ុតក្នុងកម្រិតកម្ដៅទាបបើចាំបាច់។ កុំធ្វើការសម្ងួតដោយវិធីគីមី។",

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

    // Categories & Brands pages
    "cat.title": "ប្រភេទផលិតផល",
    "cat.description": "ស្វែងរកតាមប្រភេទផលិតផលដើម្បីស្វែងរកអ្វីដែលអ្នកចង់បានកាន់តែរហ័ស។",
    "cat.searchPlaceholder": "ស្វែងរកក្នុងប្រភេទនេះ...",
    "cat.noProducts": "រកមិនឃើញផលិតផលទេ",
    "cat.noProductsDesc": "យើងរកមិនឃើញផលិតផលក្នុងប្រភេទនេះទេ។",
    "brand.title": "ម៉ាកផលិតផល",
    "brand.description": "ជ្រើសរើសម៉ាកផលិតផលដើម្បីមើលផលិតផល។",
    "brand.searchPlaceholder": "ស្វែងរកក្នុងម៉ាកផលិតផលនេះ...",
    "brand.noProducts": "រកមិនឃើញផលិតផលទេ",
    "brand.noProductsDesc": "យើងរកមិនឃើញផលិតផលសម្រាប់ម៉ាកនេះទេ។",
    "common.productsFound": "ផលិតផលត្រូវបានរកឃើញ",
    "sort.newest": "ផលិតផលថ្មីបំផុត",
    "sort.oldest": "ផលិតផលចាស់បំផុត",
    "sort.priceLow": "តម្លៃ៖ ទាបទៅខ្ពស់",
    "sort.priceHigh": "តម្លៃ៖ ខ្ពស់ទៅទាប",

    // Favourites
    "fav.noFavs": "មិនទន្តមានទំនិញដែលពេញចិត្ត",
    "fav.description": "ចុចលើរូបបេះដូងលើផលិតផលដើម្បីរក្សាវាទុក។",

    // Image Search
    "search.upload": "បញ្ចេញរូបភាព",
    "search.imageDesc": "ស្វែងរកតាមរូបភាពដើម្បីស្វែងរកផលិតផលស្រដៀងគ្នា",
    "search.title": "ស្វែងរកផលិតផល",
    "search.instruction": "បញ្ចូលពាក្យស្វែងរក ឬបញ្ចេញរូបភាពដើម្បីស្វែងរកផលិតផល",

    // Maintenance
    "error.maintenanceTitle": "កំពុងជួសជុលប្រព័ន្ធ",
    "error.maintenanceDesc": "យើងកំពុងធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធដើម្បីឱ្យការប្រើប្រាស់កាន់តែប្រសើរ។ សូមរង់ចាំបន្តិច យើងនឹងត្រឡប់មកវិញក្នុងពេលឆាប់ៗនេះ។",
    "error.serverDownTitle": "ម៉ាស៊ីនបម្រើមានបញ្ហា",
    "error.serverDownDesc": "យើងកំពុងមានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើរបស់យើង។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    "error.refresh": "ព្យាយាមម្តងទៀត",
    "error.noInternetTitle": "មិនមានការតភ្ជាប់អ៊ីនធឺណិត",
    "error.noInternetDesc": "សូមពិនិត្យមើលការកំណត់បណ្តាញរបស់អ្នក ហើយព្យាយាមម្តងទៀត។",

    // FAQs
    "faq.title": "សំណួរដែលសួរញឹកញាប់",
    "faq.description": "អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវដឹងអំពីផលិតផល និងសេវាកម្មរបស់យើង។",
    "faq.q1": "តើម៉ោងដឹកជញ្ជូនរបស់អ្នកគឺជាអ្វី?",
    "faq.a1": "យើងដឹកជញ្ជូនចាប់ពីម៉ោង ៨:០០ ព្រឹក ដល់ ៦:០០ ល្ងាច ជារៀងរាល់ថ្ងៃ។",
    "faq.q2": "តើអ្នកមានសេវាបង់ប្រាក់ពេលទទួលទំនិញទេ?",
    "faq.a2": "បាទ យើងគាំទ្រការបង់ប្រាក់ពេលទទួលទំនិញ (COD) សម្រាប់តំបន់ភាគច្រើន។",
    "faq.q3": "តើខ្ញុំអាចតាមដានការបញ្ជាទិញរបស់ខ្ញុំយ៉ាងដូចម្ដេច?",
    "faq.a3": "អ្នកអាចពិនិត្យមើលស្ថានភាពការបញ្ជាទិញរបស់អ្នកនៅក្នុងប្រវត្តិរូបរបស់អ្នក។",
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
