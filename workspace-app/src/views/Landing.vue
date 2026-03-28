<template>
  <div class="landing">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <span class="brand-icon">◆</span>
          <span class="brand-name">ScannerHub</span>
        </div>
        <div class="navbar-links">
          <button class="nav-link" @click="scrollToFeatures">Features</button>
          <button class="nav-link" @click="scrollToPricing">Pricing</button>
          <router-link to="/login" class="btn btn-nav">Sign In</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span>🚀 Trusted by 5000+ Development Teams</span>
          </div>
          <h1 class="hero-title">Enterprise-Grade Code Security</h1>
          <p class="hero-subtitle">
            Scan your codebase for vulnerabilities, quality issues, and compliance violations in seconds. 
            Get actionable insights with zero false positives.
          </p>
          <div class="hero-actions">
            <router-link class="btn btn-primary btn-large" to="/login">
              Start Free Trial
            </router-link>
            <button class="btn btn-outline btn-large" @click="scrollToFeatures">
              View Demo
            </button>
          </div>
          <p class="hero-subtext">No credit card required. 14-day free trial included.</p>
        </div>
        <div class="hero-visual">
          <div class="visual-card">
            <div class="visual-header">
              <div class="visual-dot red"></div>
              <div class="visual-dot yellow"></div>
              <div class="visual-dot green"></div>
            </div>
            <div class="visual-content">
              <div class="scan-line"></div>
              <div class="scan-line"></div>
              <div class="scan-line short"></div>
              <div class="status-badge">✓ Scan Complete</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="trust-section">
        <p class="trust-label">Trusted by industry leaders</p>
        <div class="trust-logos">
          <div class="logo-item">Stripe</div>
          <div class="logo-item">GitHub</div>
          <div class="logo-item">Slack</div>
          <div class="logo-item">AWS</div>
          <div class="logo-item">Google Cloud</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" ref="featuresRef">
      <div class="section-container">
        <div class="section-header">
          <h2>Powerful Security at Every Level</h2>
          <p>Everything you need to maintain code quality and security standards</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Vulnerability Detection</h3>
            <p>Identify security risks with OWASP Top 10, CWE Top 25, and custom rule detection</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                <polyline points="12 12 20 7.5"></polyline>
                <polyline points="12 12 12 21"></polyline>
                <polyline points="12 12 4 7.5"></polyline>
              </svg>
            </div>
            <h3>Code Quality Metrics</h3>
            <p>Track complexity, maintainability, and performance issues across your codebase</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Real-time Scanning</h3>
            <p>Continuous monitoring with instant alerts on new vulnerabilities and compliance issues</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Advanced Analytics</h3>
            <p>Detailed dashboards with trends, reports, and actionable recommendations</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"></path>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>CI/CD Integration</h3>
            <p>Native integrations with GitHub, GitLab, Jenkins, and all major platforms</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>Expert Support</h3>
            <p>Priority support from security experts available 24/7 for enterprise plans</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Section -->
    <section class="comparison-section">
      <div class="section-container">
        <h2>Why Choose ScannerHub?</h2>
        <div class="comparison-grid">
          <div class="comparison-item">
            <div class="comparison-icon check">✓</div>
            <h4>Zero Configuration</h4>
            <p>Set up scanning in minutes, not weeks</p>
          </div>
          <div class="comparison-item">
            <div class="comparison-icon check">✓</div>
            <h4>99.99% Uptime SLA</h4>
            <p>Enterprise-grade reliability and performance</p>
          </div>
          <div class="comparison-item">
            <div class="comparison-icon check">✓</div>
            <h4>GDPR Compliant</h4>
            <p>Your data stays with you, fully encrypted</p>
          </div>
          <div class="comparison-item">
            <div class="comparison-icon check">✓</div>
            <h4>30 Day Money Back</h4>
            <p>Risk-free guarantee on all plans</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section" ref="pricingRef">
      <div class="section-container">
        <div class="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your team's needs</p>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card">
            <h3>Starter</h3>
            <div class="price-box">
              <span class="currency">$</span>
              <span class="amount">29</span>
              <span class="period">/month</span>
            </div>
            <p class="price-desc">For small teams getting started</p>
            <ul class="pricing-features">
              <li><span class="check">✓</span> Up to 3 projects</li>
              <li><span class="check">✓</span> Core scanning rules</li>
              <li><span class="check">✓</span> Weekly scans</li>
              <li><span class="check">✓</span> Email support</li>
              <li class="disabled"><span class="cross">✗</span> CI/CD integration</li>
            </ul>
            <button class="btn btn-secondary btn-block">Get Started</button>
          </div>

          <div class="pricing-card featured">
            <div class="badge-featured">MOST POPULAR</div>
            <h3>Professional</h3>
            <div class="price-box">
              <span class="currency">$</span>
              <span class="amount">99</span>
              <span class="period">/month</span>
            </div>
            <p class="price-desc">For growing development teams</p>
            <ul class="pricing-features">
              <li><span class="check">✓</span> Unlimited projects</li>
              <li><span class="check">✓</span> All scanning rules</li>
              <li><span class="check">✓</span> Daily scans</li>
              <li><span class="check">✓</span> Priority support</li>
              <li><span class="check">✓</span> CI/CD integration</li>
            </ul>
            <button class="btn btn-primary btn-block">Start Free Trial</button>
          </div>

          <div class="pricing-card">
            <h3>Enterprise</h3>
            <div class="price-box">
              <span class="amount custom">Custom</span>
            </div>
            <p class="price-desc">For mission-critical deployments</p>
            <ul class="pricing-features">
              <li><span class="check">✓</span> Unlimited everything</li>
              <li><span class="check">✓</span> Custom rules & policies</li>
              <li><span class="check">✓</span> Real-time scanning</li>
              <li><span class="check">✓</span> Dedicated account manager</li>
              <li><span class="check">✓</span> On-site support available</li>
            </ul>
            <button class="btn btn-outline btn-block">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-container">
        <h2>Common Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>What integrations are supported?</h4>
            <p>We support GitHub, GitLab, Bitbucket, Jenkins, CircleCI, and major cloud platforms.</p>
          </div>
          <div class="faq-item">
            <h4>How long does it take to scan?</h4>
            <p>Most scans complete in under 30 seconds, depending on codebase size and complexity.</p>
          </div>
          <div class="faq-item">
            <h4>Can I migrate from another tool?</h4>
            <p>Yes! Our team provides free migration assistance for enterprise customers.</p>
          </div>
          <div class="faq-item">
            <h4>What about data privacy?</h4>
            <p>Your code never leaves your VPC. We offer on-premise, cloud, and hybrid deployments.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
      <div class="section-container center">
        <h2>Ready to secure your codebase?</h2>
        <p>Join thousands of teams already using ScannerHub</p>
        <router-link class="btn btn-primary btn-large" to="/login">
          Start Your Free Trial
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuresRef = ref(null)
const pricingRef = ref(null)

const scrollToFeatures = () => {
  featuresRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToPricing = () => {
  pricingRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.landing {
  width: calc(100% + 2 * calc(1.3rem * var(--space-scale)));
  min-height: 100vh;
  margin: calc(-1.3rem * var(--space-scale));
  background: #ffffff;
  color: #1f2937;
  overflow-x: hidden;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.brand-icon {
  color: #2563eb;
  font-size: 1.8rem;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #2563eb;
}

.btn-nav {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-nav:hover {
  background: #1d4ed8;
}

/* Hero Section */
.hero-section {
  padding: 6rem 2rem;
  background: white;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 4rem;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  width: fit-content;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: #1f2937;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

.btn-outline {
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
}

.btn-outline:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-block {
  width: 100%;
}

.hero-subtext {
  color: #9ca3af;
  font-size: 0.95rem;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.visual-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 300px;
}

.visual-header {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.visual-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.visual-dot.red { background: #ef4444; }
.visual-dot.yellow { background: #fbbf24; }
.visual-dot.green { background: #10b981; }

.visual-content {
  padding: 1.5rem;
}

.scan-line {
  height: 8px;
  background: linear-gradient(90deg, #2563eb, #10b981);
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.scan-line.short {
  width: 70%;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: #dcfce7;
  color: #166534;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

/* Trust Section */
.trust-section {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem 2rem;
  border-top: 1px solid #e5e7eb;
}

.trust-label {
  color: #9ca3af;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.trust-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.logo-item {
  font-weight: 700;
  color: #d1d5db;
  font-size: 1rem;
}

/* Section Container */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-container.center {
  text-align: center;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-header p {
  font-size: 1.1rem;
  color: #6b7280;
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
  text-align: left;
}

.feature-card:hover {
  border-color: #2563eb;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.1);
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #2563eb;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
}

.feature-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* Comparison Section */
.comparison-section {
  padding: 4rem 2rem;
  background: #f9fafb;
}

.comparison-section h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 3rem;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.comparison-item {
  text-align: center;
  padding: 1.5rem;
}

.comparison-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.comparison-icon.check {
  background: #dcfce7;
  color: #166534;
}

.comparison-item h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.comparison-item p {
  color: #6b7280;
}

/* Pricing Section */
.pricing-section {
  padding: 6rem 2rem;
  background: white;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.pricing-card {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s;
}

.pricing-card:hover {
  border-color: #2563eb;
  box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.1);
  transform: translateY(-4px);
}

.pricing-card.featured {
  border-color: #2563eb;
  background: #fafbff;
  border-width: 2px;
}

.badge-featured {
  position: absolute;
  top: -12px;
  left: 20px;
  background: #2563eb;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.pricing-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
}

.amount.custom {
  font-size: 1.8rem;
}

.period {
  color: #6b7280;
  font-size: 0.95rem;
}

.price-desc {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.pricing-features {
  list-style: none;
  margin-bottom: 1.5rem;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.pricing-features li.disabled {
  color: #d1d5db;
}

.check {
  color: #10b981;
  font-weight: 700;
}

.cross {
  color: #ef4444;
  font-weight: 700;
}

/* FAQ Section */
.faq-section {
  padding: 6rem 2rem;
  background: #f9fafb;
}

.faq-section h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
  margin-bottom: 3rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.faq-item {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.faq-item h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.faq-item p {
  color: #6b7280;
  line-height: 1.6;
}

/* Final CTA */
.final-cta {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
}

.final-cta h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.final-cta p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
  }

  .navbar-links {
    width: 100%;
    justify-content: space-between;
  }

  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 0;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .pricing-grid,
  .features-grid,
  .faq-grid {
    grid-template-columns: 1fr;
  }

  .badge-featured {
    left: 1rem;
  }
}
</style>
