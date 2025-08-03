// Mobile menu toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const nav = document.querySelector(".nav")
const headerRight = document.querySelector(".header-right")

mobileMenuBtn?.addEventListener("click", () => {
  nav.style.display = nav.style.display === "flex" ? "none" : "flex"
  headerRight.style.display = headerRight.style.display === "flex" ? "none" : "flex"
})

// Coupon code reveal functionality
const showCodeBtns = document.querySelectorAll(".show-code-btn")
const modal = document.getElementById("codeModal")
const closeModal = document.querySelector(".close")
const couponCodeSpan = document.getElementById("couponCode")
const copyCodeBtn = document.getElementById("copyCode")
const continueBtn = document.querySelector(".continue-btn")

showCodeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const code = btn.getAttribute("data-code")
    couponCodeSpan.textContent = code
    modal.style.display = "block"

    // Simulate loading and redirect
    setTimeout(() => {
      window.open("https://adidas.com", "_blank")
    }, 2000)
  })
})

closeModal?.addEventListener("click", () => {
  modal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"
  }
})

copyCodeBtn?.addEventListener("click", () => {
  const code = couponCodeSpan.textContent
  navigator.clipboard.writeText(code).then(() => {
    copyCodeBtn.textContent = "Copied!"
    setTimeout(() => {
      copyCodeBtn.textContent = "Copy"
    }, 2000)
  })
})

continueBtn?.addEventListener("click", () => {
  window.open("https://adidas.com", "_blank")
  modal.style.display = "none"
})

// Shop Now button functionality
const shopNowBtns = document.querySelectorAll(".shop-now-btn")
shopNowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    window.open("https://adidas.com", "_blank")
  })
})

// Email signup functionality
const getAlertsBtn = document.querySelector(".get-alerts-btn")
const emailInput = document.querySelector(".email-input")

getAlertsBtn?.addEventListener("click", () => {
  const email = emailInput.value
  if (email && email.includes("@")) {
    alert("Thank you for signing up! You'll receive adidas coupon alerts at " + email)
    emailInput.value = ""
  } else {
    alert("Please enter a valid email address.")
  }
})

// Search functionality
const searchBtn = document.querySelector(".search-btn")
const searchInput = document.querySelector(".search-input")

searchBtn?.addEventListener("click", () => {
  const query = searchInput.value.trim()
  if (query) {
    // Simulate search - in real implementation, this would redirect to search results
    alert("Searching for: " + query)
  }
})

searchInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click()
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      })
    }
  })
})

// Add loading states to buttons
const buttons = document.querySelectorAll("button")
buttons.forEach((btn) => {
  btn.addEventListener("click", function () {
    if (!this.classList.contains("loading")) {
      const originalText = this.textContent
      this.classList.add("loading")
      this.textContent = "Loading..."

      setTimeout(() => {
        this.classList.remove("loading")
        this.textContent = originalText
      }, 1000)
    }
  })
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe coupon cards for animation
document.querySelectorAll(".coupon-card").forEach((card) => {
  card.style.opacity = "0"
  card.style.transform = "translateY(20px)"
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(card)
})

// Add click tracking for analytics (placeholder)
document.addEventListener("click", (e) => {
  if (e.target.matches(".show-code-btn, .shop-now-btn, .get-alerts-btn")) {
    // In a real implementation, this would send analytics data
    console.log("Button clicked:", e.target.textContent, "at", new Date().toISOString())
  }
})
