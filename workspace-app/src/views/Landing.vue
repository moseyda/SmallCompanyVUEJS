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
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--ink-950);
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--line-soft);
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink-950);
}

.brand-icon {
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--brand-sky);
  color: white;
  font-size: 1rem;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-link {
  background: none;
  border: none;
  font-size: 0.96rem;
  font-weight: 600;
  color: var(--ink-600);
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--ink-950);
}

.btn-nav {
  padding: 0.65rem 1.25rem;
  background: var(--brand-teal);
  color: white;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-nav:hover {
  background: color-mix(in srgb, var(--brand-teal) 80%, black 20%);
  transform: translateY(-1px);
}

.hero-section {
  padding: 5.5rem 1.5rem;
}

.hero-container {
  max-width: var(--content-max);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr);
  gap: 2rem;
  align-items: center;
}

.hero-content {
  display: grid;
  gap: 1.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.95rem;
  border-radius: var(--radius-sm);
  background: var(--surface-soft);
  color: var(--ink-950);
  font-size: 0.95rem;
  border: 1px solid var(--line-soft);
}

.hero-title {
  font-size: clamp(2.25rem, 4vw, 3.75rem);
  line-height: 0.98;
  max-width: 42rem;
}

.hero-subtitle {
  max-width: 42rem;
  color: var(--ink-600);
  font-size: 1rem;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 1.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  background: var(--brand-teal);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--brand-teal) 85%, black 15%);
  transform: translateY(-1px);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 1.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-soft);
  background: transparent;
  color: var(--ink-950);
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-outline:hover {
  background: var(--surface-soft);
  transform: translateY(-1px);
}

.btn-large {
  padding: 1rem 1.8rem;
  font-size: 1rem;
}

.btn-outline:hover {
  background: var(--surface-soft);
  transform: translateY(-1px);
}

.hero-subtext {
  color: var(--ink-600);
}

.hero-visual {
  display: grid;
  place-items: center;
}

.visual-card {
  width: 100%;
  min-height: 360px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--line-soft);
  box-shadow: var(--shadow-soft);
}

.visual-header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.visual-dot {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 999px;
}

.visual-dot.red { background: #f97316; }
.visual-dot.yellow { background: #facc15; }
.visual-dot.green { background: #10b981; }

.visual-content {
  display: grid;
  gap: 0.85rem;
}

.scan-line {
  height: 1rem;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(92,168,255,0.35), rgba(0,167,142,0.3));
}

.scan-line.short {
  width: 55%;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 0.95rem;
  border-radius: var(--radius-sm);
  background: var(--surface-strong);
  color: var(--ink-950);
  font-weight: 700;
  border: 1px solid var(--line-soft);
}

.trust-section {
  margin-top: 2.5rem;
  display: grid;
  gap: 1rem;
}

.trust-label {
  color: var(--ink-600);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.trust-logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.logo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--ink-600);
  border: 1px solid var(--line-soft);
  font-weight: 600;
}

.section-container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.section-header {
  display: grid;
  gap: 0.6rem;
  margin-bottom: 1.8rem;
}

.section-header h2,
.section-header p {
  color: var(--ink-950);
}

.features-grid,
.comparison-grid,
.pricing-grid,
.faq-grid {
  display: grid;
  gap: 1.5rem;
}

.features-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.feature-card,
.comparison-item,
.pricing-card,
.faq-item {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line-soft);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-soft);
}

.feature-icon,
.comparison-icon {
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: var(--surface-soft);
  color: var(--brand-teal);
  margin-bottom: 1rem;
}

.feature-icon svg,
.comparison-icon {
  width: 1.4rem;
  height: 1.4rem;
}

.feature-card h3,
.comparison-item h4,
.pricing-card h3,
.faq-item h4 {
  margin-bottom: 0.7rem;
}

.feature-card p,
.comparison-item p,
.faq-item p {
  color: var(--ink-600);
  line-height: 1.75;
}

.comparison-grid {
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
}

.comparison-icon.check {
  font-size: 1rem;
  color: var(--brand-teal);
}

.pricing-grid {
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.pricing-card {
  display: grid;
  gap: 1rem;
}

.pricing-card.featured {
  border-color: var(--brand-teal);
}

.badge-featured {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-sm);
  background: var(--brand-sky);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.price-box {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.currency,
.amount,
.period {
  color: var(--ink-950);
}

.amount {
  font-size: 2.8rem;
  font-weight: 800;
}

.period {
  font-size: 1rem;
}

.price-desc {
  color: var(--ink-600);
}

.pricing-features {
  display: grid;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--ink-600);
}

.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 999px;
  background: var(--brand-teal);
  color: white;
  font-size: 0.85rem;
}

.cross {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 999px;
  background: var(--bg-badge);
  color: var(--ink-600);
  font-size: 0.85rem;
}

.btn-block {
  width: 100%;
}

.btn-secondary {
  background: linear-gradient(135deg, var(--btn-secondary-bg-start), var(--btn-secondary-bg-end));
  color: var(--btn-secondary-text);
  border: 1px solid var(--btn-secondary-border);
}

.btn-outline {
  border: 1px solid var(--line-soft);
}

.faq-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.faq-item h4 {
  margin-bottom: 0.8rem;
}

.final-cta {
  padding: 3rem 1.5rem 4rem;
}

.final-cta .section-container {
  text-align: center;
}

.final-cta h2 {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  margin-bottom: 0.75rem;
}

.final-cta p {
  color: var(--ink-600);
  margin-bottom: 1.25rem;
}

@media (max-width: 960px) {
  .hero-container,
  .section-container,
  .pricing-grid,
  .features-grid,
  .comparison-grid,
  .faq-grid {
    grid-template-columns: 1fr;
  }

  .navbar-container,
  .hero-section,
  .section-container,
  .final-cta {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 680px) {
  .navbar-links {
    gap: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
