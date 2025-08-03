"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ExternalLink, ArrowUp, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

interface CouponData {
  id: string
  code?: string
  title: string
  description: string
  discount: string
  discountType: "percentage" | "dollar" | "deal" | "super"
  verified: boolean
  expiresAt: string
  storeUrl: string
  storeName: string
  brandLogo: string
  rating: number
  savings: string
  type: "code" | "deal"
  details: string
  uses: number
  isExpired?: boolean
  moreInfo: string
  hasCode: boolean
}

interface CaptchaImage {
  id: string
  src: string
  cutoutX: number
  cutoutY: number
  pieceWidth: number
  pieceHeight: number
}

const captchaImages: CaptchaImage[] = [
  {
    id: "landscape1",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    cutoutX: 200, // Centered position
    cutoutY: 120,
    pieceWidth: 80,
    pieceHeight: 80,
  },
  {
    id: "nature1",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop",
    cutoutX: 180,
    cutoutY: 100,
    pieceWidth: 80,
    pieceHeight: 80,
  },
  {
    id: "city1",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    cutoutX: 220,
    cutoutY: 110,
    pieceWidth: 80,
    pieceHeight: 80,
  },
  {
    id: "ocean1",
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=250&fit=crop",
    cutoutX: 190,
    cutoutY: 130,
    pieceWidth: 80,
    pieceHeight: 80,
  },
]

const couponsData: CouponData[] = [
  {
    id: "1",
    code: "SAVE40",
    title: "Save up to 40% on Everything at adidas",
    description: "Get massive savings on your entire order with this exclusive discount",
    discount: "40%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-08-31",
    storeUrl: "https://www.adidas.com/?utm_source=couponfollow&utm_medium=referral&utm_campaign=save40",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.9,
    savings: "$32.00",
    type: "deal",
    details:
      "Valid on all regular-priced items. Cannot be combined with other offers. Minimum purchase of $50 required.",
    uses: 163,
    moreInfo:
      "This discount applies to all categories including footwear, apparel, and accessories. Free shipping included on orders over $50.",
    hasCode: false,
  },
  {
    id: "2",
    title: "Super Sale - Up to 60% Off Selected Items",
    description: "Massive savings on selected items during our super sale event",
    discount: "SUPER",
    discountType: "super",
    verified: true,
    expiresAt: "2025-09-15",
    storeUrl: "https://www.adidas.com/us/sale?utm_source=couponfollow&utm_medium=referral&utm_campaign=supersale",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.7,
    savings: "$45.00",
    type: "deal",
    details: "Up to 60% off on selected items. Sale prices as marked. While supplies last.",
    uses: 89,
    moreInfo: "Super sale includes end-of-season items, discontinued styles, and overstocked merchandise.",
    hasCode: false,
  },
  {
    id: "3",
    code: "STUDENT20",
    title: "Student Discount - 20% Off Everything",
    description: "20% off for verified students on all purchases",
    discount: "20%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-12-31",
    storeUrl:
      "https://www.adidas.com/us/student-discount?utm_source=couponfollow&utm_medium=referral&utm_campaign=student20",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.5,
    savings: "$15.00",
    type: "code",
    details: "Valid student ID required. Applies to full-price items only. One use per customer.",
    uses: 234,
    moreInfo: "Student verification required through UNiDAYS or Student Beans. Discount applies year-round.",
    hasCode: true,
  },
  {
    id: "4",
    title: "Free Shipping on Orders Over $50",
    description: "Get free standard shipping on all orders over $50",
    discount: "FREE",
    discountType: "deal",
    verified: true,
    expiresAt: "2025-12-31",
    storeUrl: "https://www.adidas.com/?utm_source=couponfollow&utm_medium=referral&utm_campaign=freeship",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.8,
    savings: "$8.95",
    type: "deal",
    details: "Free standard shipping automatically applied at checkout on orders $50+. No code needed.",
    uses: 1247,
    moreInfo:
      "Standard shipping typically takes 3-5 business days. Express shipping options available for additional cost.",
    hasCode: false,
  },
  {
    id: "5",
    code: "MILITARY15",
    title: "Military & First Responder Discount - 15% Off",
    description: "15% discount for military personnel and first responders",
    discount: "15%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-12-31",
    storeUrl:
      "https://www.adidas.com/us/military-discount?utm_source=couponfollow&utm_medium=referral&utm_campaign=military15",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.6,
    savings: "$18.50",
    type: "code",
    details: "Valid ID verification required. Cannot be combined with other offers. Excludes limited editions.",
    uses: 156,
    moreInfo: "Available to active duty, veterans, and first responders. Verification through ID.me required.",
    hasCode: true,
  },
  {
    id: "6",
    code: "WELCOME10",
    title: "New Customer Special - 10% Off First Order",
    description: "First-time customers get 10% off their initial purchase",
    discount: "10%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-10-31",
    storeUrl: "https://www.adidas.com/?utm_source=couponfollow&utm_medium=referral&utm_campaign=welcome10",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.3,
    savings: "$12.00",
    type: "code",
    details: "Valid for new customers only. Minimum purchase of $75 required. One use per customer.",
    uses: 892,
    moreInfo: "Perfect for first-time shoppers. Sign up for adiClub membership to unlock additional benefits.",
    hasCode: true,
  },
  {
    id: "7",
    code: "SHOES25",
    title: "25% Off All Footwear",
    description: "Get 25% off all shoes including sneakers, running shoes, and more",
    discount: "25%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-09-30",
    storeUrl: "https://www.adidas.com/us/shoes?utm_source=couponfollow&utm_medium=referral&utm_campaign=shoes25",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.7,
    savings: "$28.75",
    type: "code",
    details:
      "Valid on all footwear categories. Excludes limited editions and collaborations. Cannot be combined with other offers.",
    uses: 445,
    moreInfo: "Includes running shoes, lifestyle sneakers, soccer cleats, and basketball shoes. All sizes available.",
    hasCode: true,
  },
  {
    id: "8",
    title: "adiClub Members - Extra 30% Off Sale Items",
    description: "adiClub members get an additional 30% off already reduced sale items",
    discount: "30%",
    discountType: "percentage",
    verified: true,
    expiresAt: "2025-08-25",
    storeUrl: "https://www.adidas.com/us/sale?utm_source=couponfollow&utm_medium=referral&utm_campaign=adiclub30",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.4,
    savings: "$35.00",
    type: "deal",
    details: "adiClub membership required (free to join). Discount automatically applied to sale items at checkout.",
    uses: 678,
    moreInfo:
      "Join adiClub for free to access this deal plus exclusive member benefits, early access to drops, and birthday rewards.",
    hasCode: false,
  },
]

const expiredCoupons: CouponData[] = [
  {
    id: "exp1",
    code: "SUMMER25",
    title: "Summer Sale 25% Off",
    description: "Summer collection discount - now expired",
    discount: "25%",
    discountType: "percentage",
    verified: false,
    expiresAt: "2025-07-31",
    storeUrl: "",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.2,
    savings: "$20.00",
    type: "code",
    details: "This offer has expired.",
    uses: 456,
    isExpired: true,
    moreInfo: "This was a limited-time summer promotion.",
    hasCode: true,
  },
  {
    id: "exp2",
    title: "Spring Collection Sale",
    description: "Spring season discount - expired",
    discount: "15%",
    discountType: "percentage",
    verified: false,
    expiresAt: "2025-06-30",
    storeUrl: "",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.0,
    savings: "$12.00",
    type: "deal",
    details: "This offer has expired.",
    uses: 321,
    isExpired: true,
    moreInfo: "This was a spring season promotional offer.",
    hasCode: false,
  },
  {
    id: "exp3",
    code: "BACKTOSCHOOL",
    title: "Back to School - 20% Off",
    description: "Back to school promotion - expired",
    discount: "20%",
    discountType: "percentage",
    verified: false,
    expiresAt: "2025-07-15",
    storeUrl: "",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.1,
    savings: "$16.00",
    type: "code",
    details: "This offer has expired.",
    uses: 789,
    isExpired: true,
    moreInfo: "This was a back-to-school seasonal promotion targeting students and parents.",
    hasCode: true,
  },
  {
    id: "exp4",
    code: "FLASH30",
    title: "Flash Sale - 30% Off Everything",
    description: "24-hour flash sale - expired",
    discount: "30%",
    discountType: "percentage",
    verified: false,
    expiresAt: "2025-07-01",
    storeUrl: "",
    storeName: "adidas",
    brandLogo: "https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png",
    rating: 4.6,
    savings: "$24.00",
    type: "code",
    details: "This offer has expired.",
    uses: 1234,
    isExpired: true,
    moreInfo: "This was a limited 24-hour flash sale with high demand.",
    hasCode: true,
  },
]

export default function AdidasCouponPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponData | null>(null)
  const [email, setEmail] = useState("")
  const [modalEmail, setModalEmail] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)

  // CAPTCHA states
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [currentCaptcha, setCurrentCaptcha] = useState<CaptchaImage | null>(null)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [piecePosition, setPiecePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [captchaStatus, setCaptchaStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle")
  const [attempts, setAttempts] = useState(0)
  // Add after the existing CAPTCHA states
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const puzzleRef = useRef<HTMLDivElement>(null)

  const showDiscountModal = (coupon: CouponData) => {
    if (coupon.isExpired) return
    setSelectedCoupon(coupon)
    setIsModalOpen(true)
    setModalEmail("")
    setShowCaptcha(false)
    setShowFeedback(false)
    setFeedbackGiven(false)
    setCaptchaStatus("idle")
    setSliderPosition(0)
    setPiecePosition(0)
    setAttempts(0)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    try {
      setIsModalOpen(false)
      setSelectedCoupon(null)
      setShowCaptcha(false)
      setShowFeedback(false)
      setFeedbackGiven(false)
      setCaptchaStatus("idle")
      setSliderPosition(0)
      setPiecePosition(0)
      setAttempts(0)
      document.body.style.overflow = "unset"
    } catch (error) {
      console.error("Error closing modal:", error)
      // Force reset
      setIsModalOpen(false)
      document.body.style.overflow = "unset"
    }
  }

  const getRandomCaptcha = (): CaptchaImage => {
    return captchaImages[Math.floor(Math.random() * captchaImages.length)]
  }

  const initiateCaptcha = () => {
    const newCaptcha = getRandomCaptcha()
    setCurrentCaptcha(newCaptcha)
    setShowCaptcha(true)
    setCaptchaStatus("idle")
    setSliderPosition(0)
    setPiecePosition(0)
  }

  const handleSliderStart = (clientX: number) => {
    setIsDragging(true)
    setCaptchaStatus("idle")
  }

  const handleSliderMove = (clientX: number) => {
    if (!isDragging || !trackRef.current || !puzzleRef.current) return

    const track = trackRef.current
    const puzzle = puzzleRef.current
    const trackRect = track.getBoundingClientRect()
    const puzzleRect = puzzle.getBoundingClientRect()

    const maxSliderPosition = trackRect.width - 60 // slider width
    const newSliderPosition = Math.max(0, Math.min(maxSliderPosition, clientX - trackRect.left - 30))

    // Calculate piece position directly based on slider position
    const sliderProgress = newSliderPosition / maxSliderPosition
    const maxPiecePosition = puzzleRect.width - 80 // piece width (80px)
    const newPiecePosition = sliderProgress * maxPiecePosition

    setSliderPosition(newSliderPosition)
    setPiecePosition(newPiecePosition)
  }

  const handleSliderEnd = () => {
    if (!isDragging || !currentCaptcha || !puzzleRef.current) return

    setIsDragging(false)
    setCaptchaStatus("verifying")

    // Calculate the correct target position for the piece
    const puzzle = puzzleRef.current
    const puzzleRect = puzzle.getBoundingClientRect()

    // Target position should be where the cutout is, minus half the piece width to center it
    const targetPosition = (currentCaptcha.cutoutX / 400) * puzzleRect.width - 40 // 40 is half of piece width (80px)
    const tolerance = 30 // Increased tolerance for better UX

    setTimeout(() => {
      if (Math.abs(piecePosition - targetPosition) <= tolerance) {
        setCaptchaStatus("success")
        // Hide the movable piece and show success overlay
        setTimeout(() => {
          if (selectedCoupon && selectedCoupon.storeUrl) {
            console.log("Redirecting to:", selectedCoupon.storeUrl)
            // Force open in new tab with proper URL
            try {
              const newWindow = window.open(selectedCoupon.storeUrl, "_blank", "noopener,noreferrer")
              if (!newWindow) {
                // Fallback if popup blocker prevents opening
                console.log("Popup blocked, using fallback")
              }
            } catch (error) {
              console.error("Error opening new window:", error)
            }

            // Show feedback screen instead of closing modal
            setTimeout(() => {
              setShowCaptcha(false)
              setShowFeedback(true)
              setFeedbackGiven(false)
              setCaptchaStatus("idle")
            }, 500)
          }
        }, 1500) // Longer delay to show the completed puzzle
      } else {
        setCaptchaStatus("failed")
        setAttempts((prev) => prev + 1)
      }
    }, 1000)
  }

  const resetCaptcha = () => {
    const newCaptcha = getRandomCaptcha()
    setCurrentCaptcha(newCaptcha)
    setSliderPosition(0)
    setPiecePosition(0)
    setCaptchaStatus("idle")
  }

  const handleEmailSignup = () => {
    if (email && email.includes("@")) {
      alert(`Thank you for signing up! You'll receive adidas coupon alerts at ${email}`)
      setEmail("")
    } else {
      alert("Please enter a valid email address.")
    }
  }

  const handleModalEmailSignup = () => {
    if (modalEmail && modalEmail.includes("@")) {
      alert(`Thank you! You'll receive ${selectedCoupon?.storeName} discount codes at ${modalEmail}`)
      setModalEmail("")
    } else {
      alert("Please enter a valid email address.")
    }
  }

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedCards(newExpanded)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Mouse events for slider
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleSliderMove(e.clientX)
    }

    const handleMouseUp = () => {
      handleSliderEnd()
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, sliderPosition, piecePosition, currentCaptcha])

  // Touch events for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleSliderMove(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      handleSliderEnd()
    }

    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, sliderPosition, piecePosition, currentCaptcha])

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isModalOpen])

  const CouponCard = ({ coupon, isExpired = false }: { coupon: CouponData; isExpired?: boolean }) => {
    const isExpanded = expandedCards.has(coupon.id)

    return (
      <div
        className={`bg-white rounded-xl shadow-md p-6 mb-4 transition-all duration-200 ${isExpired ? "opacity-60 grayscale" : "hover:shadow-lg"}`}
      >
        <div className="flex items-start justify-between">
          {/* Left Badge */}
          <div className={`flex-shrink-0 mr-6 ${isExpired ? "opacity-50" : ""}`}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-3 text-center min-w-[70px]">
              <div className="text-lg font-bold leading-tight">{coupon.discount}</div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-1 ${isExpired ? "text-gray-500" : "text-gray-800"}`}>
                  {coupon.title}
                </h3>
                <p className={`text-sm mb-2 ${isExpired ? "text-gray-400" : "text-gray-600"}`}>{coupon.description}</p>
                <div className={`text-xs mb-3 ${isExpired ? "text-gray-400" : "text-gray-500"}`}>
                  {coupon.uses} uses {isExpired && "• Expired"}
                </div>
              </div>

              {/* Use Discount Button */}
              <div className="ml-4">
                <button
                  onClick={() => showDiscountModal(coupon)}
                  disabled={isExpired}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    isExpired
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  aria-label={`Use discount for ${coupon.title}`}
                >
                  Use Discount
                </button>
              </div>
            </div>

            {/* More Information Toggle */}
            <button
              onClick={() => toggleCardExpansion(coupon.id)}
              className={`flex items-center text-sm font-medium transition-colors ${
                isExpired ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              More Information
              {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
            </button>

            {/* Expanded Information */}
            {isExpanded && (
              <div
                className={`mt-3 p-3 rounded-lg border-l-4 ${
                  isExpired ? "bg-gray-50 border-gray-300 text-gray-500" : "bg-blue-50 border-blue-400"
                }`}
              >
                <p className="text-sm mb-2">{coupon.details}</p>
                <p className="text-sm">{coupon.moreInfo}</p>
                <div className="mt-2 text-xs">
                  <span className={isExpired ? "text-gray-400" : "text-gray-500"}>
                    Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const handleFeedback = (isPositive: boolean) => {
    try {
      setFeedbackGiven(true)
      // Auto close after showing thank you message
      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (error) {
      console.error("Error handling feedback:", error)
      closeModal()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-600 text-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="font-bold text-lg tracking-wide">
                <span className="bg-teal-400 text-white px-2 py-1 rounded">COUPON</span>
                <span className="ml-1">FOLLOW</span>
              </div>
            </div>

            <nav className={`hidden md:flex items-center space-x-8`}>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Coupons
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Stores
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Cashback
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Saving Guides
              </a>
              <a href="#" className="hover:text-teal-400 transition-colors">
                More ▼
              </a>
            </nav>

            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a store"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 pr-10 text-gray-800 rounded border focus:outline-none focus:ring-2 focus:ring-teal-400 w-64"
                  aria-label="Search for stores"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-600 text-white p-4">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="hover:text-teal-400">
              Coupons
            </a>
            <a href="#" className="hover:text-teal-400">
              Stores
            </a>
            <a href="#" className="hover:text-teal-400">
              Cashback
            </a>
            <a href="#" className="hover:text-teal-400">
              Saving Guides
            </a>
            <div className="pt-4 border-t border-gray-500">
              <input
                type="text"
                placeholder="Search for a store"
                className="w-full px-3 py-2 text-gray-800 rounded"
                aria-label="Search for stores"
              />
            </div>
          </nav>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <a href="#" className="hover:underline">
              Home
            </a>{" "}
            ›{" "}
            <a href="#" className="hover:underline">
              Brands
            </a>{" "}
            › <span>Adidas</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-2 border">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png"
                alt="Adidas Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">adidas Coupon Codes</h1>
              <p className="text-blue-600 font-medium">Saving Tips & Hacks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Coupons */}
          <div className="lg:col-span-2">
            {/* Active Coupons */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Top adidas Promo Codes for August 2, 2025</h2>

            {couponsData.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}

            {/* Email Signup */}
            <div className="bg-gray-700 rounded-2xl p-6 mb-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-white lg:flex-shrink-0">Get adidas coupons instantly!</h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:min-w-[400px]">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 border-0"
                    aria-label="Email address for coupon alerts"
                  />
                  <button
                    onClick={handleEmailSignup}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
                  >
                    Get Alerts
                  </button>
                </div>
              </div>
            </div>

            {/* Expired Discounts Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Expired Discount Codes</h2>
              {expiredCoupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} isExpired={true} />
              ))}
            </div>

            {/* Current Coupons Table */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Current adidas Coupons for August 2025</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponsData.map((coupon) => (
                      <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-blue-600">{coupon.discount} Off</td>
                        <td className="py-3 px-4 text-gray-700">{coupon.title}</td>
                        <td className="py-3 px-4 text-gray-600">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* More Information About the Brand */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">More Information About adidas</h2>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">How to Redeem a Code</h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  To redeem your adidas coupon code, simply click the "Use Discount" button above to reveal your code.
                  Copy the code and visit adidas.com. Add your desired items to your cart and proceed to checkout. In
                  the promo code field, paste your coupon code and click apply. Your discount will be automatically
                  applied to your order total.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">What to Do If the Code Doesn't Work</h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  If your coupon code isn't working, first check that you've entered it correctly with no extra spaces.
                  Ensure the code hasn't expired and that your items are eligible for the discount. Some codes only work
                  on full-price items or have minimum purchase requirements. If you're still having trouble, try
                  clearing your browser cache or using a different browser.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Tips for Combining Offers</h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Most adidas coupon codes cannot be combined with other promotional offers. However, you can often
                  stack percentage discounts with free shipping offers. Student discounts and military discounts
                  typically cannot be combined with other coupon codes. Always check the terms and conditions of each
                  offer.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Where to Shop</h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  These coupon codes are valid on adidas.com and may also work in adidas retail stores. Some codes are
                  online-only, so be sure to check the terms. The adidas app often has exclusive mobile-only deals that
                  you won't find elsewhere.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Return and Refund Policy</h3>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  adidas offers a 30-day return policy for most items purchased with coupon codes. Items must be in
                  original condition with tags attached. If you used a coupon code for your purchase, the refund will be
                  processed for the amount you actually paid. Free return shipping is available for adiClub members.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Best Times to Shop</h3>
                <p className="text-gray-700 leading-relaxed">
                  The best adidas deals typically occur during major sale events like Black Friday, end-of-season
                  clearances, and back-to-school promotions. Sign up for our email alerts to be notified when new coupon
                  codes become available. Student discounts are available year-round with proper verification.
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="text-center text-sm text-gray-500 bg-gray-100 p-3 rounded-lg">
              When you make a purchase, we may earn a commission.
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Coupon Highlights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Discount:</span>
                  <span className="font-semibold">60% Off</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Coupon Codes:</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Offers:</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Avg. Savings:</span>
                  <span className="font-semibold">$25.41</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Top adidas Discount FAQs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Does adidas have coupon codes?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, right now there are 8 adidas promo codes available, as of August 2, 2025.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    How many promo codes are currently available for adidas?
                  </h4>
                  <p className="text-sm text-gray-600">
                    There are 8 adidas coupon codes that shoppers can use today to save on their next purchase.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Which coupon for adidas do customers use the most?</h4>
                  <p className="text-sm text-gray-600">
                    In the month of August the top working discount code for adidas is: Save up to 40% on Everything at
                    adidas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">adidas Savings Hacks</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    Does adidas offer a discount if I sign up for their email newsletter?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Yes, receive 15% off your next order when you sign up for the adidas email newsletter.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Can I get free shipping on my adidas order?</h4>
                  <p className="text-sm text-gray-600">
                    Yes, adidas offers free shipping on orders over $50 for adiClub members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-800 transition-colors">
              Contact us
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Terms of Use
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Job openings
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Cookies
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Company details
            </a>
            <span>·</span>
            <a href="#" className="hover:text-gray-800 transition-colors">
              Cookie settings
            </a>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Modal with CAPTCHA */}
      {isModalOpen && selectedCoupon && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full text-center relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8">
              {(() => {
                try {
                  if (!showCaptcha && !showFeedback) {
                    // Initial modal content
                    return (
                      <>
                        {/* Header - Brand Logo */}
                        <div className="mb-6">
                          <img
                            src={selectedCoupon.brandLogo || "/placeholder.svg"}
                            alt={`${selectedCoupon.storeName} logo`}
                            className="h-10 mx-auto mb-4"
                          />
                        </div>

                        {/* Main Content */}
                        <div className="mb-8">
                          <h3 id="modal-title" className="text-xl font-bold text-gray-800 mb-6">
                            {selectedCoupon.title}
                          </h3>

                          {/* No Code Needed Badge */}
                          <div className="mb-6">
                            <span className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium text-sm border">
                              No code needed
                            </span>
                          </div>

                          {/* Use Discount Button */}
                          <button
                            onClick={initiateCaptcha}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mx-auto"
                            aria-label={`Use discount at ${selectedCoupon.storeName}`}
                          >
                            <span>Use the discount</span>
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Footer Section - Email Subscription */}
                        <div className="border-t pt-6">
                          <div className="flex items-start space-x-4 mb-4">
                            <img
                              src={selectedCoupon.brandLogo || "/placeholder.svg"}
                              alt={`${selectedCoupon.storeName} logo`}
                              className="h-8 flex-shrink-0 mt-1"
                            />
                            <div className="text-left flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                Never miss out on {selectedCoupon.storeName} discount codes again
                              </h4>
                              <p className="text-sm text-gray-600 mb-4">
                                Take advantage of the best discount codes and offers from thousands of stores
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <input
                              type="email"
                              placeholder="Enter your email address"
                              value={modalEmail}
                              onChange={(e) => setModalEmail(e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                              aria-label="Email for discount codes"
                            />
                            <button
                              onClick={handleModalEmailSignup}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                      </>
                    )
                  } else if (showFeedback) {
                    // Feedback content
                    return (
                      <div className="py-8">
                        {/* Back Button */}
                        <div className="flex items-center mb-6">
                          <button
                            onClick={() => {
                              setShowFeedback(false)
                              setFeedbackGiven(false)
                            }}
                            className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            BACK TO DISCOUNT CODE
                          </button>
                        </div>

                        {!feedbackGiven ? (
                          <>
                            <h3 className="text-xl font-semibold text-gray-800 mb-8 text-center">
                              Did the discount code work?
                            </h3>

                            <div className="flex justify-center space-x-8 mb-8">
                              {/* Thumbs Up */}
                              <button
                                onClick={() => handleFeedback(true)}
                                className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors group"
                              >
                                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-600 transition-colors">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                  </svg>
                                </div>
                              </button>

                              {/* Thumbs Down */}
                              <button
                                onClick={() => handleFeedback(false)}
                                className="flex flex-col items-center p-6 hover:bg-gray-50 rounded-lg transition-colors group"
                              >
                                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-600 transition-colors">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322-1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                                  </svg>
                                </div>
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Thank You Message */
                          <div className="text-center py-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-8">Thank you for your feedback.</h3>

                            <div className="flex justify-center space-x-8">
                              {/* Thumbs Up - Highlighted */}
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                  </svg>
                                </div>
                              </div>

                              {/* Thumbs Down - Grayed out */}
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-400 rounded-lg flex items-center justify-center mb-2">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15.73 5.25h1.035A7.465 7.465 0 0118 9.375a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322-1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521.388-.482.987-.729 1.605-.729H9.77a4.5 4.5 0 011.423.23l3.114 1.04a4.5 4.5 0 001.423.23zM21.669 13.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.959 8.959 0 01-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    // CAPTCHA content - keep existing CAPTCHA implementation
                    return (
                      <div className="py-4">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Security Verification</h3>
                          <p className="text-sm text-gray-600">Please complete the puzzle to continue</p>
                        </div>

                        {currentCaptcha && (
                          <div className="mb-6">
                            {/* Keep existing CAPTCHA implementation */}
                            <div ref={puzzleRef} className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-64">
                              <img
                                src={currentCaptcha.src || "/placeholder.svg"}
                                alt="Puzzle background"
                                className="w-full h-full object-cover"
                              />

                              <div
                                className="absolute bg-white rounded-full border-2 border-dashed border-blue-400"
                                style={{
                                  left: currentCaptcha.cutoutX - 40,
                                  top: currentCaptcha.cutoutY - 40,
                                  width: 80,
                                  height: 80,
                                }}
                              />

                              <div
                                className="absolute w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg transition-all duration-100 cursor-move"
                                style={{
                                  left: piecePosition,
                                  top: currentCaptcha.cutoutY - 40,
                                  transform: isDragging ? "scale(1.05)" : "scale(1)",
                                  zIndex: 10,
                                }}
                              >
                                <div
                                  className="w-full h-full bg-cover bg-no-repeat rounded-full"
                                  style={{
                                    backgroundImage: `url(${currentCaptcha.src})`,
                                    backgroundPosition: `-${currentCaptcha.cutoutX - 40}px -${currentCaptcha.cutoutY - 40}px`,
                                    backgroundSize: `400px 250px`,
                                  }}
                                />
                              </div>

                              {captchaStatus === "success" && (
                                <div
                                  className="absolute w-20 h-20 rounded-full overflow-hidden border-2 border-green-400 shadow-lg"
                                  style={{
                                    left: currentCaptcha.cutoutX - 40,
                                    top: currentCaptcha.cutoutY - 40,
                                    zIndex: 15,
                                  }}
                                >
                                  <div
                                    className="w-full h-full bg-cover bg-no-repeat rounded-full"
                                    style={{
                                      backgroundImage: `url(${currentCaptcha.src})`,
                                      backgroundPosition: `-${currentCaptcha.cutoutX - 40}px -${currentCaptcha.cutoutY - 40}px`,
                                      backgroundSize: `400px 250px`,
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="relative">
                              <div
                                ref={trackRef}
                                className="w-full h-12 bg-gray-200 rounded-lg relative overflow-hidden"
                              >
                                <div
                                  ref={sliderRef}
                                  className="absolute top-0 h-full w-15 bg-blue-600 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center transition-colors"
                                  style={{
                                    left: `${sliderPosition}px`,
                                    width: "60px",
                                    backgroundColor:
                                      captchaStatus === "success"
                                        ? "#22c55e"
                                        : captchaStatus === "failed"
                                          ? "#ef4444"
                                          : "#2563eb",
                                  }}
                                  onMouseDown={(e) => handleSliderStart(e.clientX)}
                                  onTouchStart={(e) => handleSliderStart(e.touches[0].clientX)}
                                  role="slider"
                                  aria-label="Drag to complete puzzle"
                                  tabIndex={0}
                                >
                                  {captchaStatus === "verifying" ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : captchaStatus === "success" ? (
                                    <span className="text-white text-lg">✓</span>
                                  ) : captchaStatus === "failed" ? (
                                    <span className="text-white text-lg">✗</span>
                                  ) : (
                                    <span className="text-white text-lg">→</span>
                                  )}
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium pointer-events-none">
                                  {captchaStatus === "verifying"
                                    ? "Verifying..."
                                    : captchaStatus === "success"
                                      ? "Verified! Redirecting..."
                                      : captchaStatus === "failed"
                                        ? "Try again"
                                        : "Slide to complete puzzle"}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              {captchaStatus === "failed" && (
                                <div className="text-red-600 text-sm mb-2">
                                  Puzzle not completed correctly. Try again!
                                </div>
                              )}
                              {captchaStatus === "success" && (
                                <div className="text-green-600 text-sm mb-2">
                                  Verification successful! Redirecting...
                                </div>
                              )}
                            </div>

                            <div className="flex justify-center space-x-4 mt-4">
                              {captchaStatus === "failed" && (
                                <button
                                  onClick={resetCaptcha}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                                >
                                  Try Again
                                </button>
                              )}
                              <button
                                onClick={resetCaptcha}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                <RefreshCw className="h-4 w-4" />
                                <span>New puzzle</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  }
                } catch (error) {
                  console.error("Error rendering modal content:", error)
                  return (
                    <div className="py-8 text-center">
                      <p className="text-red-600">Something went wrong. Please try again.</p>
                      <button
                        onClick={closeModal}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Close
                      </button>
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
