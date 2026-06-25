export interface Product {
  id: string;
  name: string;
  subName: string;
  price: string;
  description: string;
  folderPath: string;
  detailImage?: string;
  videoType?: 'sequence' | 'mp4';
  videoSrc?: string;
  animationDuration?: number;
  reverseFrames?: boolean;
  isDark?: boolean;
  themeColor: string;
  gradient: string;
  features: string[];
  stats: { label: string; val: string }[];
  section1: { title: string; subtitle: string };
  section2: { title: string; subtitle: string };
  section3: { title: string; subtitle: string };
  section4: { title: string; subtitle: string };
  detailsSection: { title: string; description: string; imageAlt: string };
  freshnessSection: { title: string; description: string };
  buyNowSection: {
    price: string;
    unit: string;
    processingParams: string[];
    deliveryPromise: string;
    returnPolicy: string;
  };
  packages?: { id: string; label: string; price: string; unit: string }[];
}

export const products: Product[] = [
  {
    id: "lassi",
    detailImage: "/Thumbnail/Smoodh_Lassi.jpg",
    name: "Smoodh Lassi",
    subName: "Creamy tradition.",
    price: "₹20",
    packages: [
      { id: "lassi-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "lassi-180ml", label: "180ml PET", price: "₹20", unit: "per 180ml PET" }
    ],
    description: "Real Dahi - Rose Infused - No Artificial Flavors",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Smoodh_Lassi.mp4",
    animationDuration: 7,
    isDark: false,
    themeColor: "#E91E63",
    gradient: "linear-gradient(135deg, #FFEEF4 0%, #F8BBD0 100%)",
    features: ["Real Dahi", "Rose Infused", "No Artificial Flavors"],
    stats: [
      { label: "Artificial", val: "0%" },
      { label: "Dahi", val: "100%" },
      { label: "Freshness", val: "Max" },
    ],
    section1: { title: "Smoodh Lassi.", subtitle: "Creamy tradition." },
    section2: {
      title: "Real dahi, real taste.",
      subtitle:
        "Thick, creamy lassi made from fresh churned dahi with a delicate hint of rose.",
    },
    section3: {
      title: "Probiotic goodness.",
      subtitle:
        "Natural gut-friendly cultures that refresh your body from the inside out.",
    },
    section4: { title: "Made from dahi, not powder.", subtitle: "" },
    detailsSection: {
      title: "The Classic Reimagined",
      description:
        "Smoodh Lassi brings the beloved street-side lassi experience into a perfectly crafted bottle. Made with 100% real dahi, gently blended to a silky smooth consistency, and kissed with natural rose essence. Every sip is a nostalgic journey — thick, creamy, and refreshingly authentic. No artificial thickeners, no shortcuts.",
      imageAlt: "Lassi Details",
    },
    freshnessSection: {
      title: "Chill-Chain Perfection",
      description:
        "Our lassi is prepared in small batches using fresh dahi and immediately chilled to lock in the live cultures and creamy texture. The cold-chain is maintained from our dairy to your doorstep, ensuring every bottle delivers the same fresh-from-the-matka taste. Real ingredients, real freshness.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 180ml PET",
      processingParams: ["Real Dahi", "Rose Infused", "Probiotic Rich"],
      deliveryPromise:
        "Available at stores near you. Chilled packaging ensures peak freshness.",
      returnPolicy:
        "100% Satisfaction Guarantee. Not happy? We'll replace it, no questions asked.",
    },
  },
  {
    id: "chocolate",
    detailImage: "/Thumbnail/Smoodh_Chocolate.jpg",
    name: "Smoodh Chocolate",
    subName: "Velvety indulgence.",
    price: "₹20",
    packages: [
      { id: "chocolate-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "chocolate-150ml", label: "150ml PET", price: "₹20", unit: "per 150ml PET" }
    ],
    description: "Rich Cocoa - Flavoured Milk - Smooth & Creamy",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/smoodh_chocolate.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#C62828",
    gradient: "linear-gradient(135deg, #5D4037 0%, #3E2723 100%)",
    features: ["Rich Cocoa", "Creamy Milk", "Smooth Texture"],
    stats: [
      { label: "Cocoa", val: "Rich" },
      { label: "Milk", val: "100%" },
      { label: "Smoothness", val: "Max" },
    ],
    section1: { title: "Smoodh Chocolate.", subtitle: "Velvety indulgence." },
    section2: {
      title: "Decadence in every sip.",
      subtitle:
        "Rich, dark cocoa blended with creamy milk for a smooth, irresistible chocolate experience.",
    },
    section3: {
      title: "The chocolate fix you deserve.",
      subtitle:
        "A perfectly balanced blend that satisfies your chocolate cravings anytime, anywhere.",
    },
    section4: { title: "Real cocoa, real satisfaction.", subtitle: "" },
    detailsSection: {
      title: "Chocolate Done Right",
      description:
        "Smoodh Chocolate Flavoured Milk is crafted for true chocolate lovers. We blend premium cocoa with fresh, creamy milk to create a drink that's rich without being heavy, sweet without being cloying. The iconic red bottle houses a velvety smooth chocolate experience that hits different — whether it's your morning pick-me-up or your afternoon indulgence.",
      imageAlt: "Chocolate Details",
    },
    freshnessSection: {
      title: "Blended for Perfection",
      description:
        "Our chocolate milk is blended using a precise cocoa-to-milk ratio that delivers maximum flavor with a silky mouthfeel. We use quality cocoa sourced for its deep, robust profile and combine it with farm-fresh milk. The result is a smooth, consistent chocolate drink that's leagues ahead of the competition.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 150ml PET",
      processingParams: ["Rich Cocoa", "Fresh Milk", "Perfectly Blended"],
      deliveryPromise:
        "Available at stores nationwide. Enjoy chilled for the best experience.",
      returnPolicy: "Taste the smoothness or get your money back.",
    },
  },
  {
    id: "chocolate-hazelnut",
    detailImage: "/Thumbnail/Smoodh_Chocolate_Hazelnut.jpg",
    name: "Smoodh Chocolate Hazelnut",
    subName: "Nutty perfection.",
    price: "₹20",
    packages: [
      { id: "hazelnut-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "hazelnut-150ml", label: "150ml PET", price: "₹20", unit: "per 150ml PET" }
    ],
    description: "Chocolate & Hazelnut - Flavoured Milk - Premium Blend",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Smoodh_ChocolateHazelnut.mp4",
    animationDuration: 7,
    isDark: false,
    themeColor: "#B0E0E6",
    gradient: "linear-gradient(135deg, #E0F7FA 0%, #B0E0E6 100%)",
    features: ["Chocolate & Hazelnut", "Creamy Milk", "Premium Blend"],
    stats: [
      { label: "Hazelnut", val: "Rich" },
      { label: "Cocoa", val: "100%" },
      { label: "Blend", val: "Premium" },
    ],
    section1: {
      title: "Smoodh Chocolate Hazelnut.",
      subtitle: "Nutty perfection.",
    },
    section2: {
      title: "Where chocolate meets hazelnut.",
      subtitle:
        "A luxurious fusion of rich chocolate and roasted hazelnut in every creamy sip.",
    },
    section3: {
      title: "Elevated indulgence.",
      subtitle:
        "The sophisticated flavor combination that turns an ordinary moment into something extraordinary.",
    },
    section4: {
      title: "Two flavors, one smooth experience.",
      subtitle: "",
    },
    detailsSection: {
      title: "The Premium Fusion",
      description:
        "Smoodh Chocolate Hazelnut takes our chocolate milk to the next level. We infuse premium cocoa with the warm, nutty richness of roasted hazelnuts, creating a flavor profile that's reminiscent of the finest European pralines — but in a refreshing, drinkable form. The distinctive blue bottle is your passport to a premium taste experience that's unmatched in the market.",
      imageAlt: "Chocolate Hazelnut Details",
    },
    freshnessSection: {
      title: "Crafted with Precision",
      description:
        "The balance between chocolate and hazelnut is an art. Too much of either and the magic is lost. Our blend masters have perfected the ratio — the cocoa provides depth and richness, while the hazelnut adds a buttery, aromatic finish. Combined with fresh milk, the result is a harmonious drink that's smooth, nutty, and utterly addictive.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 150ml PET",
      processingParams: ["Rich Cocoa", "Roasted Hazelnut", "Fresh Milk"],
      deliveryPromise:
        "Available at stores nationwide. Best served chilled.",
      returnPolicy: "Not impressed? Full replacement guaranteed.",
    },
  },
  {
    id: "coffee-frappe",
    detailImage: "/Thumbnail/Smoodh_Coffee_Frape.jpg",
    name: "Smoodh Coffee Frappe",
    subName: "Café style refreshment.",
    price: "₹20",
    packages: [
      { id: "coffee-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "coffee-150ml", label: "150ml PET", price: "₹20", unit: "per 150ml PET" }
    ],
    description: "Premium Coffee - Flavoured Milk - Smooth Creamy Texture",
    folderPath: "/images/coffee-frappe",
    videoType: "mp4",
    videoSrc: "/videos/mp4/coffee_frape.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#4E342E",
    gradient: "linear-gradient(135deg, #4E342E 0%, #3E2723 100%)",
    features: ["Premium Coffee", "Creamy Milk", "Café Style"],
    stats: [
      { label: "Strength", val: "Bold" },
      { label: "Creaminess", val: "100%" },
      { label: "Smoothness", val: "Max" },
    ],
    section1: { title: "Smoodh Coffee Frappe.", subtitle: "Café style refreshment." },
    section2: {
      title: "Coffee that keeps up with you.",
      subtitle:
        "Bold coffee blended with creamy milk for a perfectly balanced pick-me-up.",
    },
    section3: {
      title: "Smooth energy.",
      subtitle:
        "A satisfying coffee experience anytime, anywhere.",
    },
    section4: { title: "Coffeehouse taste. Anywhere.", subtitle: "" },
    detailsSection: {
      title: "The Café Experience in a Bottle",
      description:
        "Smoodh Coffee Frappe brings the luxurious, creamy indulgence of a premium coffeehouse frappe straight to you. We blend aromatic, full-bodied coffee with rich, velvety milk to create a refreshing drink that redefines convenience without compromising on taste. The deep coffee brown bottle holds your perfect daily boost, delivering a smooth, chilled coffee experience that satisfies your caffeine cravings in the most delicious way possible.",
      imageAlt: "Coffee Frappe Details",
    },
    freshnessSection: {
      title: "Masterfully Blended",
      description:
        "Our coffee frappe is created through a meticulous blending process that marries robust coffee extract with our signature high-quality milk. We ensure flavor consistency in every batch, so every bottle delivers that perfect harmony of bold coffee notes and creamy sweetness, kept fresh and delicious.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 150ml PET",
      processingParams: ["Aromatic Coffee", "Premium Milk", "Smoothly Blended"],
      deliveryPromise:
        "Available at stores nationwide. Enjoy chilled for the ultimate café experience.",
      returnPolicy: "100% Satisfaction Guarantee. Not happy? We'll replace it, no questions asked.",
    },
  },
  {
    id: "kesar-badam",
    detailImage: "/Thumbnail/Smoodh_Kesar_Badam.png",
    name: "Smoodh Kesar Badam",
    subName: "Royal richness.",
    price: "₹20",
    packages: [
      { id: "kesar-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "kesar-150ml", label: "150ml PET", price: "₹20", unit: "per 150ml PET" }
    ],
    description: "Saffron & Almond - Flavoured Milk - Traditional Recipe",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/kesar_badam.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#F57F17",
    gradient: "linear-gradient(135deg, #FFF9C4 0%, #FFECB3 100%)",
    features: ["Saffron Rich", "Almond Goodness", "Premium Milk"],
    stats: [
      { label: "Almond", val: "Rich" },
      { label: "Saffron", val: "Premium" },
      { label: "Blend", val: "Royal" },
    ],
    section1: { title: "Smoodh Kesar Badam.", subtitle: "Royal richness." },
    section2: {
      title: "Saffron meets almond.",
      subtitle:
        "A luxurious blend inspired by Indian traditions.",
    },
    section3: {
      title: "Crafted for indulgence.",
      subtitle:
        "Rich flavor with every sip, bringing the essence of festivities to your everyday.",
    },
    section4: { title: "Tradition perfected.", subtitle: "" },
    detailsSection: {
      title: "A Royal Heritage in Every Sip",
      description:
        "Smoodh Kesar Badam is a tribute to India's rich culinary traditions. We've combined the delicate, aromatic notes of premium saffron with the wholesome richness of almonds and creamy milk. This luxurious blend offers a comforting, nostalgic taste that feels both indulgent and familiar. The vibrant saffron-gold bottle is a promise of authentic flavor, crafted for those who appreciate the finer things in life.",
      imageAlt: "Kesar Badam Details",
    },
    freshnessSection: {
      title: "Purity and Quality",
      description:
        "We source only the finest ingredients to create our Kesar Badam flavoured milk. The saffron is carefully selected for its vibrant color and distinct aroma, perfectly complementing our high-quality milk base. Our advanced blending process ensures a smooth, lump-free consistency that preserves the integrity of these traditional ingredients.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 150ml PET",
      processingParams: ["Premium Saffron", "Rich Almonds", "High-Quality Milk"],
      deliveryPromise:
        "Available at stores nationwide. Best served chilled.",
      returnPolicy: "Taste the tradition or get your money back.",
    },
  },
  {
    id: "toffee-caramel",
    detailImage: "/Thumbnail/Smoodh_ToffeeCaramel.png",
    name: "Smoodh Toffee Caramel",
    subName: "Sweet nostalgia.",
    price: "₹20",
    packages: [
      { id: "toffee-80ml", label: "80ml Tetra", price: "₹10", unit: "per 80ml Tetra" },
      { id: "toffee-150ml", label: "150ml PET", price: "₹20", unit: "per 150ml PET" }
    ],
    description: "Caramel & Toffee - Flavoured Milk - Comforting Sweetness",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/toffee_caramel.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#E65100",
    gradient: "linear-gradient(135deg, #FFE0B2 0%, #FFCC80 100%)",
    features: ["Caramel Richness", "Toffee Sweetness", "Creamy Blend"],
    stats: [
      { label: "Sweetness", val: "Perfect" },
      { label: "Creaminess", val: "100%" },
      { label: "Depth", val: "Rich" },
    ],
    section1: { title: "Smoodh Toffee Caramel.", subtitle: "Sweet nostalgia." },
    section2: {
      title: "Comfort in every sip.",
      subtitle:
        "Toffee sweetness blended with creamy milk for a dessert-like experience.",
    },
    section3: {
      title: "Smooth caramel delight.",
      subtitle:
        "Rich flavor that lingers, making every moment a little sweeter.",
    },
    section4: { title: "Sweet. Creamy. Irresistible.", subtitle: "" },
    detailsSection: {
      title: "The Ultimate Sweet Escape",
      description:
        "Smoodh Toffee Caramel is a comforting embrace in a bottle. We've captured the buttery, rich essence of golden caramel and classic toffee, blending it seamlessly with our signature creamy milk. It's a decadent, dessert-like treat that satisfies your sweet tooth without being overpowering. The warm amber bottle invites you to take a moment for yourself and indulge in pure, sweet nostalgia.",
      imageAlt: "Toffee Caramel Details",
    },
    freshnessSection: {
      title: "Perfectly Balanced Sweetness",
      description:
        "Creating the perfect caramel milk requires precision. We balance the deep, complex notes of toffee and caramel with a premium, fresh milk base to ensure the sweetness is just right. Our smooth blending technique guarantees a silky texture that elevates this comforting flavor combination.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 150ml PET",
      processingParams: ["Golden Caramel", "Classic Toffee", "Premium Milk Base"],
      deliveryPromise:
        "Available at stores nationwide. Enjoy chilled for a delicious treat.",
      returnPolicy: "100% Satisfaction Guarantee. Not happy? We'll replace it, no questions asked.",
    },
  },
  {
    id: "appy-fizz",
    detailImage: "/Thumbnail/Appy_Fizz.jpg",
    name: "Appy Fizz",
    subName: "Electrifying Sparkle.",
    price: "₹20",
    packages: [
      { id: "appy-160ml", label: "160ml PET", price: "₹15", unit: "per 160ml PET" },
      { id: "appy-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" },
      { id: "appy-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" },
      { id: "appy-1l", label: "1L PET", price: "₹65", unit: "per 1L PET" }
    ],
    description: "Sparkling apple fizz crafted to electrify every sip.",
    folderPath: "/images/appy-fizz",
    videoType: "mp4",
    videoSrc: "/videos/mp4/appy_fizz.mp4",
    isDark: true,
    themeColor: "#00FF00",
    gradient: "linear-gradient(135deg, #0a1f0a 0%, #000000 100%)",
    features: ["Real Apple Juice", "Crisp Carbonation", "Bold Energy"],
    stats: [
      { label: "Fizz", val: "High" },
      { label: "Apple", val: "100%" },
      { label: "Vibe", val: "Electric" },
    ],
    section1: { title: "Appy Fizz.", subtitle: "Electrifying Sparkle." },
    section2: {
      title: "A burst of electric energy.",
      subtitle: "Crisp, bold apple sparkling beverage that defines the modern generation.",
    },
    section3: {
      title: "Feel the fizz.",
      subtitle: "Unleash the ultimate bubbly refreshment packed with real fruit goodness.",
    },
    section4: { title: "Bold. Bubbly. Unstoppable.", subtitle: "" },
    detailsSection: {
      title: "The Original Fizz",
      description: "Appy Fizz revolutionizes the sparkling beverage category. It's the drink that started the fizz revolution—blending the crisp, authentic taste of real apples with an electrifying carbonation that wakes up your senses. Crafted for those who lead and never follow, every chilled sip is a statement of bold individuality.",
      imageAlt: "Appy Fizz Bottle",
    },
    freshnessSection: {
      title: "Carbonated Perfection",
      description: "Our state-of-the-art bottling ensures the signature fizz stays trapped until the very moment you twist the cap. Made with real apple juice from the finest orchards and infused with precise carbonation to create the ultimate sparkling texture.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 250ml PET",
      processingParams: ["Real Apple Juice", "Max Carbonation", "Electric Vibe"],
      deliveryPromise: "Delivered chilled for an instantly refreshing experience.",
      returnPolicy: "Unmatched quality in every bottle.",
    },
  },
  {
    id: "b-fizz",
    detailImage: "/Thumbnail/B_Fizz.jpg",
    name: "B Fizz",
    subName: "Intense. Masculine. Bold.",
    price: "₹20",
    packages: [
      { id: "bfizz-160ml", label: "160ml PET", price: "₹15", unit: "per 160ml PET" },
      { id: "bfizz-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" },
      { id: "bfizz-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" }
    ],
    description: "A dark malt-flavored sparkling sensation for the bold.",
    folderPath: "/images/b-fizz",
    videoType: "mp4",
    videoSrc: "/videos/mp4/b_fizz.mp4",
    isDark: true,
    themeColor: "#FFC107",
    gradient: "linear-gradient(135deg, #2a1a00 0%, #000000 100%)",
    features: ["Malt Flavor", "Intense Carbonation", "Zero Alcohol"],
    stats: [
      { label: "Malt", val: "Rich" },
      { label: "Intensity", val: "Max" },
      { label: "Alcohol", val: "0%" },
    ],
    section1: { title: "B Fizz.", subtitle: "The bold new sensation." },
    section2: {
      title: "Malt meets fizz.",
      subtitle: "An intense, premium malt-flavored beverage without the alcohol.",
    },
    section3: {
      title: "Dark, deep, delicious.",
      subtitle: "A distinct caramel and malt profile wrapped in explosive carbonation.",
    },
    section4: { title: "For the brave.", subtitle: "" },
    detailsSection: {
      title: "Redefining the Bold",
      description: "B Fizz is not just a drink; it's an attitude. Combining the deep, robust flavors of malt and caramel with a sharp, biting fizz, this beverage delivers a highly sophisticated and intense tasting experience. Designed for adult palates seeking a powerful, non-alcoholic refreshment that stands out in a crowd.",
      imageAlt: "B Fizz Details",
    },
    freshnessSection: {
      title: "Precision Crafted",
      description: "Every bottle of B Fizz undergoes a meticulous brewing-inspired process to extract authentic malt essence, which is then rapidly chilled and carbonated. This ensures the deep flavor profile is perfectly preserved alongside its signature bold fizz.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 250ml PET",
      processingParams: ["Malt Extract", "Deep Caramel", "Bold Fizz"],
      deliveryPromise: "Shipped fast. Best enjoyed ice cold.",
      returnPolicy: "100% satisfaction.",
    },
  },
  {
    id: "frooti",
    detailImage: "/Thumbnail/Frooti.jpg",
    name: "Frooti",
    subName: "Fresh 'N' Juicy",
    price: "₹20",
    packages: [
      { id: "frooti-125ml", label: "125ml Tetra", price: "₹10", unit: "per 125ml Tetra" },
      { id: "frooti-160ml", label: "160ml Tetra", price: "₹15", unit: "per 160ml Tetra" },
      { id: "frooti-300ml", label: "300ml PET", price: "₹20", unit: "per 300ml PET" },
      { id: "frooti-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" },
      { id: "frooti-1.2l", label: "1.2L PET", price: "₹60", unit: "per 1.2L PET" },
      { id: "frooti-2l", label: "2L PET", price: "₹100", unit: "per 2L PET" }
    ],
    description: "The iconic, original mango drink loved by generations.",
    folderPath: "/images/frooti",
    videoType: "mp4",
    videoSrc: "/videos/mp4/frooti.mp4",
    isDark: true,
    themeColor: "#FFC107",
    gradient: "linear-gradient(135deg, #FFF9C4 0%, #FF9800 100%)",
    features: ["Real Mangoes", "Juicy Texture", "Iconic Taste"],
    stats: [
      { label: "Mangoes", val: "100% Real" },
      { label: "Vibe", val: "Playful" },
      { label: "Legacy", val: "Iconic" },
    ],
    section1: { title: "Frooti.", subtitle: "Fresh 'n' Juicy." },
    section2: {
      title: "The taste of pure nostalgia.",
      subtitle: "Made with the pulpiest, sweetest mangoes handpicked for perfection.",
    },
    section3: {
      title: "A tropical escape.",
      subtitle: "Every gulp takes you back to sunny summer days and pure joy.",
    },
    section4: { title: "Mango magic in a bottle.", subtitle: "" },
    detailsSection: {
      title: "The Original Mango Icon",
      description: "Frooti isn't just a mango drink—it's a cultural phenomenon. For decades, it has been the definitive taste of Indian summers. We source only the finest, ripest mangoes to create that unmistakable thick, juicy texture and vibrant sweetness. Whether you're making new memories or reliving the old ones, Frooti delivers a burst of pure, unadulterated sunshine.",
      imageAlt: "Frooti Splash",
    },
    freshnessSection: {
      title: "From Orchard to Bottle",
      description: "Our mangoes are harvested at the absolute peak of their ripeness and immediately pulped to capture their natural aroma and sweetness. Flash-pasteurization ensures that the fresh, tropical taste remains untouched by time.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 300ml PET",
      processingParams: ["Real Mango Pulp", "No Preservatives", "Nostalgic Taste"],
      deliveryPromise: "Delivered fresh. Enjoy the taste of summer instantly.",
      returnPolicy: "Quality guaranteed in every pack.",
    },
  },
  {
    id: "frio-cola",
    detailImage: "/Thumbnail/Frio_Cola.jpg",
    name: "Frio Cola",
    subName: "Dark. Bold. Fizzy.",
    price: "₹20",
    packages: [
      { id: "friocola-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" },
      { id: "friocola-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" },
      { id: "friocola-1.5l", label: "1.5L PET", price: "₹80", unit: "per 1.5L PET" }
    ],
    description: "An electrifying twist on the classic dark cola experience.",
    folderPath: "/images/frio-cola",
    videoType: "mp4",
    videoSrc: "/videos/mp4/frio_cola.mp4",
    isDark: true,
    themeColor: "#E53935",
    gradient: "linear-gradient(135deg, #2b0000 0%, #000000 100%)",
    features: ["Classic Cola", "Bold Spices", "Frio Chill"],
    stats: [
      { label: "Intensity", val: "High" },
      { label: "Spice", val: "Bold" },
      { label: "Chill", val: "Max" },
    ],
    section1: { title: "Frio Cola.", subtitle: "Dark. Bold. Fizzy." },
    section2: {
      title: "The ultimate cola experience.",
      subtitle: "A deep, rich blend of spices and caramel wrapped in intense carbonation.",
    },
    section3: {
      title: "Unapologetically bold.",
      subtitle: "Designed to deliver a refreshing jolt of energy and classic cola flavor.",
    },
    section4: { title: "Taste the thunder.", subtitle: "" },
    detailsSection: {
      title: "A New Cola Standard",
      description: "Frio Cola redefines the traditional cola with a bolder, punchier flavor profile. We've dialed up the aromatic spices and deep caramel notes, combining them with the signature Frio high-voltage carbonation. The result is a dark, glossy, and intensely satisfying beverage that commands attention and quenches thirst like no other.",
      imageAlt: "Frio Cola Splash",
    },
    freshnessSection: {
      title: "Crafted for the Bold",
      description: "Our unique cola syrup is blended at sub-zero temperatures before carbonation, ensuring the complex aromatic spices and caramel flavors are locked in. The ultra-chilled bottling process guarantees an explosive fizz the moment you crack it open.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 250ml PET",
      processingParams: ["Aromatic Spices", "Deep Caramel", "Frio Carbonation"],
      deliveryPromise: "Fast delivery. Best served over ice.",
      returnPolicy: "100% satisfaction guaranteed.",
    },
  },
  {
    id: "frio-lime",
    detailImage: "/Thumbnail/Frio_Lime.png",
    name: "Frio Lime",
    subName: "Crisp. Citrus. Refreshing.",
    price: "₹20",
    packages: [
      { id: "friolime-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" },
      { id: "friolime-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" },
      { id: "friolime-1.5l", label: "1.5L PET", price: "₹80", unit: "per 1.5L PET" }
    ],
    description: "A zesty, refreshing clear lime drink.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/frio_lime.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#84cc16",
    gradient: "linear-gradient(135deg, #1a2e05 0%, #000000 100%)",
    features: ["Zesty Lime", "Clear & Crisp", "Frio Chill"],
    stats: [
      { label: "Zest", val: "High" },
      { label: "Citrus", val: "Fresh" },
      { label: "Chill", val: "Max" },
    ],
    section1: { title: "Frio Lime.", subtitle: "Crisp. Citrus. Refreshing." },
    section2: {
      title: "The clear choice.",
      subtitle: "A sharp, tangy burst of lime wrapped in intense carbonation.",
    },
    section3: {
      title: "Unapologetically zesty.",
      subtitle: "Designed to deliver a refreshing jolt of energy and bright citrus flavor.",
    },
    section4: { title: "Taste the chill.", subtitle: "" },
    detailsSection: {
      title: "A Zesty Revolution",
      description: "Frio Lime brings a wave of crisp, clear refreshment with every sip. We've captured the sharp tang of fresh limes and elevated it with the signature Frio high-voltage carbonation. The result is a vibrant, clear beverage that instantly refreshes and energizes, perfect for those who crave a bright citrus kick.",
      imageAlt: "Frio Lime Splash",
    },
    freshnessSection: {
      title: "Crafted for the Crisp",
      description: "Our lime essence is extracted at its peak zest, blended at sub-zero temperatures before carbonation, ensuring the bright citrus notes are locked in. The ultra-chilled bottling process guarantees an explosive fizz and a clean finish the moment you crack it open.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 250ml PET",
      processingParams: ["Zesty Lime Essence", "Clear Blend", "Frio Carbonation"],
      deliveryPromise: "Fast delivery. Best served ice cold.",
      returnPolicy: "100% satisfaction guaranteed.",
    },
  },
  {
    id: "frio-orange",
    detailImage: "/Thumbnail/Frio_Orange.jpg",
    name: "Frio Orange",
    subName: "Tangy. Vibrant. Bold.",
    price: "₹20",
    packages: [
      { id: "frioorange-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" },
      { id: "frioorange-600ml", label: "600ml PET", price: "₹40", unit: "per 600ml PET" },
      { id: "frioorange-1.5l", label: "1.5L PET", price: "₹80", unit: "per 1.5L PET" }
    ],
    description: "A burst of tangy orange wrapped in intense carbonation.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/frio_orange.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#f97316",
    gradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    features: ["Tangy Orange", "Bold Fizz", "Refreshing"],
    stats: [
      { label: "Tang", val: "High" },
      { label: "Orange", val: "Zesty" },
      { label: "Chill", val: "Max" },
    ],
    section1: { title: "Frio Orange.", subtitle: "Tangy. Vibrant. Bold." },
    section2: { title: "The vibrant choice.", subtitle: "A sharp, tangy burst of orange." },
    section3: { title: "Unapologetically orange.", subtitle: "Designed to deliver a refreshing jolt of energy." },
    section4: { title: "Taste the tang.", subtitle: "" },
    detailsSection: {
      title: "A Tangy Revolution",
      description: "Frio Orange brings a wave of crisp, sweet and tangy refreshment with every sip. Perfect for those who crave a bright citrus kick.",
      imageAlt: "Frio Orange Splash",
    },
    freshnessSection: {
      title: "Crafted for the Tang",
      description: "Our orange essence is extracted at its peak, blended before carbonation to ensure the bright citrus notes are locked in.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 250ml PET",
      processingParams: ["Tangy Orange Essence", "Vibrant Blend", "Frio Carbonation"],
      deliveryPromise: "Fast delivery. Best served ice cold.",
      returnPolicy: "100% satisfaction guaranteed.",
    },
  },
  {
    id: "bombay99-club-soda",
    detailImage: "/Thumbnail/Bombay99_ClubSoda.png",
    name: "Bombay 99 Club Soda",
    subName: "Crisp & Clean.",
    price: "₹60",
    packages: [
      { id: "clubsoda-250ml", label: "250ml Can", price: "₹60", unit: "per 250ml Can" }
    ],
    description: "Premium carbonated water for the perfect mix.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Bombay99_ClubSoda.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#0EA5E9",
    gradient: "linear-gradient(135deg, #001e2b 0%, #000000 100%)",
    features: ["Crisp Fizz", "Zero Calories", "Perfect Mixer"],
    stats: [
      { label: "Fizz", val: "High" },
      { label: "Purity", val: "100%" },
      { label: "Calories", val: "0" },
    ],
    section1: { title: "Bombay 99 Club Soda.", subtitle: "Crisp & Clean." },
    section2: {
      title: "Elevate your mix.",
      subtitle: "The essential premium sparkling water for crafting the finest beverages.",
    },
    section3: {
      title: "Pure effervescence.",
      subtitle: "Designed to enhance flavors, not mask them.",
    },
    section4: { title: "Mix with the best.", subtitle: "" },
    detailsSection: {
      title: "The Perfect Mixer",
      description: "Bombay 99 Club Soda is crafted to be the ultimate companion for your favorite spirits and syrups. It features a perfectly balanced mineral profile and an aggressive, long-lasting carbonation that elevates any drink. Clean, crisp, and refreshing.",
      imageAlt: "Bombay 99 Club Soda",
    },
    freshnessSection: {
      title: "Crystal Clear Quality",
      description: "We use an advanced multi-stage filtration process to ensure the purest water base. This pristine water is then super-chilled and carbonated to lock in a tight, bubbly fizz that lasts longer in your glass.",
    },
    buyNowSection: {
      price: "₹60",
      unit: "per 250ml Can",
      processingParams: ["Ultra-Filtered Water", "Max Carbonation", "Balanced Minerals"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  },
  {
    id: "bombay99-ginger-ale",
    detailImage: "/Thumbnail/Bomabay99_GingerAle.png",
    name: "Bombay 99 Ginger Ale",
    subName: "Spicy & Sweet.",
    price: "₹60",
    packages: [
      { id: "gingerale-250ml", label: "250ml Can", price: "₹60", unit: "per 250ml Can" }
    ],
    description: "Classic ginger ale with a perfect balance of spice and sweetness.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Bombay99_GingerAle.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#D97706",
    gradient: "linear-gradient(135deg, #2b1700 0%, #000000 100%)",
    features: ["Real Ginger", "Balanced Sweetness", "Refreshing Bite"],
    stats: [
      { label: "Spice", val: "Medium" },
      { label: "Sweetness", val: "Balanced" },
      { label: "Refreshment", val: "Max" },
    ],
    section1: { title: "Bombay 99 Ginger Ale.", subtitle: "Spicy & Sweet." },
    section2: {
      title: "A classic redefined.",
      subtitle: "Made with authentic ginger flavor for a warm, refreshing experience.",
    },
    section3: {
      title: "Warmth in every bubble.",
      subtitle: "The perfect balance of subtle ginger spice and sweet effervescence.",
    },
    section4: { title: "Refreshingly ginger.", subtitle: "" },
    detailsSection: {
      title: "Authentic Ginger Taste",
      description: "Bombay 99 Ginger Ale brings back the classic taste of real ginger ale. We've crafted a blend that highlights the warming, slightly spicy notes of ginger root, perfectly balanced with a touch of sweetness and crisp carbonation. It's excellent on its own or as a premium mixer.",
      imageAlt: "Bombay 99 Ginger Ale",
    },
    freshnessSection: {
      title: "Crafted with Care",
      description: "Our ginger ale is made using high-quality ginger extracts. The blending process ensures that the delicate spice notes are preserved, while our precision carbonation gives it a lively, effervescent mouthfeel.",
    },
    buyNowSection: {
      price: "₹60",
      unit: "per 250ml Can",
      processingParams: ["Ginger Extract", "Balanced Sweetness", "Crisp Fizz"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  },
  {
    id: "bombay99-tonic-water",
    detailImage: "/Thumbnail/Bomabay99_IndianTonicWater.png",
    name: "Bombay 99 Tonic Water",
    subName: "Bitter & Botanical.",
    price: "₹60",
    packages: [
      { id: "tonic-250ml", label: "250ml Can", price: "₹60", unit: "per 250ml Can" }
    ],
    description: "Premium Indian tonic water with distinctive quinine bitterness.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Bombay99_TonicWater.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#9333EA",
    gradient: "linear-gradient(135deg, #1d0a2b 0%, #000000 100%)",
    features: ["Distinct Bitterness", "Botanical Notes", "Premium Mixer"],
    stats: [
      { label: "Bitterness", val: "High" },
      { label: "Sweetness", val: "Low" },
      { label: "Botanicals", val: "Rich" },
    ],
    section1: { title: "Bombay 99 Tonic Water.", subtitle: "Bitter & Botanical." },
    section2: {
      title: "The classic companion.",
      subtitle: "Crafted with premium quinine for an authentic Indian tonic experience.",
    },
    section3: {
      title: "Sophisticated flavor.",
      subtitle: "A complex profile of bitterness and subtle botanicals.",
    },
    section4: { title: "Mix with distinction.", subtitle: "" },
    detailsSection: {
      title: "Authentic Indian Tonic",
      description: "Bombay 99 Tonic Water pays homage to the classic Indian tonic. It features the distinctive, sharp bitterness of quinine, complemented by subtle botanical notes and a touch of sweetness. This sophisticated profile makes it the ideal mixer for premium spirits, enhancing their complex flavors.",
      imageAlt: "Bombay 99 Tonic Water",
    },
    freshnessSection: {
      title: "Premium Ingredients",
      description: "We source high-quality quinine to ensure an authentic, crisp bitterness. Our careful formulation balances this with natural botanicals and intense carbonation to create a tonic water that stays bubbly and flavorful.",
    },
    buyNowSection: {
      price: "₹60",
      unit: "per 250ml Can",
      processingParams: ["Premium Quinine", "Natural Botanicals", "Crisp Carbonation"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  },
  {
    id: "bailley-soda",
    detailImage: "/Thumbnail/Bailey_Soda.png",
    name: "Bailley Soda Water",
    subName: "Extra Punch.",
    price: "₹15",
    packages: [
      { id: "bailleylsoda-300ml", label: "300ml PET", price: "₹15", unit: "per 300ml PET" },
      { id: "bailleylsoda-600ml", label: "600ml PET", price: "₹30", unit: "per 600ml PET" },
      { id: "bailleylsoda-750ml", label: "750ml PET", price: "₹40", unit: "per 750ml PET" }
    ],
    description: "Premium soda water with an extra punch of carbonation.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Bailley_SodaWater.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#0ea5e9",
    gradient: "linear-gradient(135deg, #082f49 0%, #000000 100%)",
    features: ["Extra Carbonation", "Zero Calories", "Premium Mixer"],
    stats: [
      { label: "Fizz", val: "Extra" },
      { label: "Purity", val: "100%" },
      { label: "Calories", val: "0" },
    ],
    section1: { title: "Bailley Soda Water.", subtitle: "Extra Punch." },
    section2: { title: "Elevate your drink.", subtitle: "The essential premium sparkling water." },
    section3: { title: "Pure effervescence.", subtitle: "Designed to enhance flavors." },
    section4: { title: "Mix with the best.", subtitle: "" },
    detailsSection: {
      title: "The Perfect Mixer",
      description: "Bailley Soda Water is crafted to be the ultimate companion. It features an aggressive, long-lasting carbonation that elevates any drink.",
      imageAlt: "Bailley Soda Water",
    },
    freshnessSection: {
      title: "Crystal Clear Quality",
      description: "We use an advanced filtration process to ensure the purest water base. This pristine water is carbonated to lock in a tight fizz.",
    },
    buyNowSection: {
      price: "₹15",
      unit: "per 300ml PET",
      processingParams: ["Filtered Water", "Extra Carbonation", "Balanced Minerals"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  },
  {
    id: "bailley-water",
    detailImage: "/Thumbnail/Bailey_Water.png",
    name: "Bailley Water",
    subName: "Pure. Safe. Refreshing.",
    price: "₹20",
    packages: [
      { id: "bailley-water-250ml", label: "250ml", price: "₹6", unit: "per 250ml Bottle" },
      { id: "bailley-water-500ml", label: "500ml", price: "₹10", unit: "per 500ml Bottle" },
      { id: "bailley-water-1l", label: "1L", price: "₹20", unit: "per 1L Bottle" },
      { id: "bailley-water-5l", label: "5L", price: "₹65", unit: "per 5L Bottle" },
      { id: "bailley-water-20l", label: "20L Jar", price: "₹130", unit: "per 20L Jar" }
    ],
    description: "Packaged drinking water with added minerals.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Bailley_Water.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#3b82f6",
    gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    features: ["Pure Water", "Added Minerals", "Refreshing"],
    stats: [
      { label: "Purity", val: "100%" },
      { label: "Minerals", val: "Added" },
      { label: "Taste", val: "Crisp" },
    ],
    section1: { title: "Bailley Water.", subtitle: "Pure Drop of Life." },
    section2: { title: "Refreshingly pure.", subtitle: "Hydration you can trust." },
    section3: { title: "Every drop counts.", subtitle: "Filtered to perfection." },
    section4: { title: "Stay hydrated.", subtitle: "" },
    detailsSection: {
      title: "Trusted Purity",
      description: "Bailley Packaged Drinking Water is a symbol of purity. It goes through a rigorous multi-stage purification process to ensure every drop is safe, clean, and refreshing.",
      imageAlt: "Bailley Water",
    },
    freshnessSection: {
      title: "Mineral Enriched",
      description: "We add the perfect balance of vital minerals to not only make the water safe but also give it a crisp, sweet taste that truly quenches your thirst.",
    },
    buyNowSection: {
      price: "₹20",
      unit: "per 1L Bottle",
      processingParams: ["Multi-Stage Filtration", "Ozonated", "Mineralized"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  },
  {
    id: "dhishoom",
    detailImage: "/Thumbnail/Dhishoom.png",
    name: "Dhishoom",
    subName: "Jeera Masala Punch.",
    price: "₹10",
    packages: [
      { id: "dhishoom-125ml", label: "125ml PET", price: "₹10", unit: "per 125ml PET" },
      { id: "dhishoom-250ml", label: "250ml PET", price: "₹20", unit: "per 250ml PET" }
    ],
    description: "A lip-smacking jeera masala soda with a punch.",
    folderPath: "",
    videoType: "mp4",
    videoSrc: "/videos/mp4/Dhishoom.mp4",
    animationDuration: 7,
    isDark: true,
    themeColor: "#8b5cf6",
    gradient: "linear-gradient(135deg, #2e1065 0%, #000000 100%)",
    features: ["Jeera Masala", "Digestive", "Strong Punch"],
    stats: [
      { label: "Spice", val: "Punchy" },
      { label: "Jeera", val: "Rich" },
      { label: "Fizz", val: "High" },
    ],
    section1: { title: "Dhishoom.", subtitle: "Jeera Masala Soda." },
    section2: { title: "A punch of flavor.", subtitle: "Authentic jeera masala with a sparkling twist." },
    section3: { title: "Desi refreshment.", subtitle: "The ultimate thirst quencher after a heavy meal." },
    section4: { title: "Feel the Dhishoom.", subtitle: "" },
    detailsSection: {
      title: "The Ultimate Desi Drink",
      description: "Dhishoom brings the authentic taste of Indian street-style jeera soda into a hygienic, beautifully packaged bottle. The robust cumin and masala blend gives a refreshing punch.",
      imageAlt: "Dhishoom Bottle",
    },
    freshnessSection: {
      title: "Spiced to Perfection",
      description: "Our proprietary spice mix is carefully balanced with strong carbonation to ensure that every sip provides that signature 'dhishoom' hit of flavor and refreshment.",
    },
    buyNowSection: {
      price: "₹10",
      unit: "per 125ml PET",
      processingParams: ["Real Jeera", "Authentic Spices", "Strong Fizz"],
      deliveryPromise: "Fast delivery.",
      returnPolicy: "Satisfaction guaranteed.",
    },
  }
];
