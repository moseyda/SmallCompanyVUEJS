<template>
  <div class="landing">
    <div class="landing-hero">
      <div class="hero-content">
        <h1 class="hero-title">ScannerHub</h1>
        <p class="hero-subtitle">Code Quality & Security Scanner SaaS</p>
        <p class="hero-description">
          Automated scanning for vulnerabilities, code quality, and compliance. 
          Protect your codebase 24/7 with real-time detection and intelligent remediation.
        </p>
        <div class="hero-actions">
          <router-link class="btn btn-primary btn-large" to="/login">
            Get Started
          </router-link>
          <button class="btn btn-secondary btn-large" @click="scrollToFeatures">
            Learn More
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-placeholder">
          <span class="material-icons">security</span>
        </div>
      </div>
    </div>

    <section class="features-section" ref="featuresRef">
      <h2>Core Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon material-icons">verified_user</span>
          <h3>Security Scanning</h3>
          <p>Detect vulnerabilities and security risks using industry-standard rulesets (OWASP, CWE, PCI-DSS)</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon material-icons">assessment</span>
          <h3>Code Quality Analysis</h3>
          <p>Monitor code complexity, performance issues, and maintainability metrics across your projects</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon material-icons">check_circle</span>
          <h3>Compliance Checking</h3>
          <p>Ensure your code meets regulatory compliance requirements and internal standards</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon material-icons">flash_on</span>
          <h3>Real-time Alerts</h3>
          <p>Get instant notifications when new vulnerabilities or issues are detected</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon material-icons">build</span>
          <h3>CI/CD Integration</h3>
          <p>Seamlessly integrate with your existing deployment pipelines for automated scanning</p>
        </div>
        <div class="feature-card">
          <span class="feature-icon material-icons">trending_up</span>
          <h3>Analytics & Insights</h3>
          <p>Track security posture and code quality trends over time with detailed dashboards</p>
        </div>
      </div>
    </section>

    <section class="pricing-section">
      <h2>Plans</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Starter</h3>
          <p class="price">$29<span>/mo</span></p>
          <ul class="pricing-features">
            <li>Up to 3 projects</li>
            <li>Basic scanning rules</li>
            <li>Weekly scans</li>
            <li>Email support</li>
          </ul>
          <button class="btn btn-secondary">Choose Plan</button>
        </div>
        <div class="pricing-card featured">
          <span class="badge">Popular</span>
          <h3>Professional</h3>
          <p class="price">$99<span>/mo</span></p>
          <ul class="pricing-features">
            <li>Unlimited projects</li>
            <li>All scanning rules</li>
            <li>Daily scans</li>
            <li>Priority support</li>
          </ul>
          <button class="btn btn-primary">Choose Plan</button>
        </div>
        <div class="pricing-card">
          <h3>Enterprise</h3>
          <p class="price">Custom</p>
          <ul class="pricing-features">
            <li>Unlimited everything</li>
            <li>Custom rules</li>
            <li>Real-time scanning</li>
            <li>Dedicated support</li>
          </ul>
          <button class="btn btn-secondary">Contact Sales</button>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Ready to secure your codebase?</h2>
      <p>Start your free 14-day trial today. No credit card required.</p>
      <router-link class="btn btn-primary btn-large" to="/login">
        Start Free Trial
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const featuresRef = ref(null)

const scrollToFeatures = () => {
  featuresRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.landing {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #e2e8f0;
  overflow-x: hidden;
}

.landing-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.hero-content {
  display: grid;
  gap: 1.5rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #cbd5e1;
  font-weight: 600;
}

.hero-description {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.8;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.btn-large {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(96, 165, 250, 0.3);
}

.btn-secondary {
  background: transparent;
  color: #60a5fa;
  border: 2px solid #60a5fa;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(96, 165, 250, 0.1);
  transform: translateY(-2px);
}

.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-placeholder {
  width: 300px;
  height: 300px;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(96, 165, 250, 0.2);
}

.visual-placeholder .material-icons {
  font-size: 120px;
  color: #60a5fa;
}

.features-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features-section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: rgba(148, 163, 184, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.1);
  padding: 2rem;
  border-radius: 12px;
  display: grid;
  gap: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.05);
}

.feature-icon {
  font-size: 2.5rem;
  color: #60a5fa;
  margin: 0 auto;
}

.feature-card h3 {
  font-size: 1.3rem;
  color: #f1f5f9;
}

.feature-card p {
  color: #cbd5e1;
  line-height: 1.6;
}

.pricing-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-section h2 {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.pricing-card {
  background: rgba(148, 163, 184, 0.05);
  border: 1px solid rgba(148, 163, 184, 0.1);
  padding: 2rem;
  border-radius: 12px;
  display: grid;
  gap: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
  border-color: rgba(96, 165, 250, 0.3);
}

.pricing-card.featured {
  border-color: #60a5fa;
  background: rgba(96, 165, 250, 0.08);
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: -12px;
  left: 20px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.pricing-card h3 {
  font-size: 1.5rem;
  color: #f1f5f9;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #60a5fa;
}

.price span {
  font-size: 1rem;
  color: #cbd5e1;
}

.pricing-features {
  list-style: none;
  display: grid;
  gap: 0.8rem;
  text-align: left;
}

.pricing-features li {
  color: #cbd5e1;
  padding-left: 1.5rem;
  position: relative;
}

.pricing-features li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #34d399;
  font-weight: bold;
}

.cta-section {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(52, 211, 153, 0.1));
  border-top: 1px solid rgba(96, 165, 250, 0.2);
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
}

.cta-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #f1f5f9;
}

.cta-section p {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .landing-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .visual-placeholder {
    width: 200px;
    height: 200px;
  }

  .visual-placeholder .material-icons {
    font-size: 80px;
  }

  .features-section,
  .pricing-section,
  .cta-section {
    padding: 2rem 1rem;
  }

  .pricing-card.featured {
    transform: scale(1);
  }
}
</style>
