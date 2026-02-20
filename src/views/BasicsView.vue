<template>
  <div class="basics-view">
    <div class="basics-hero">
      <div class="basics-hero__overlay">
        <div class="container">
          <h1 class="basics-hero__title">{{ t('basics.title') }}</h1>
          <p class="basics-hero__subtitle">{{ t('basics.subtitle') }}</p>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- What are Medicinal Plants -->
      <section class="basics-section">
        <h2 class="basics-section__title">{{ t('basics.medicinalPlants.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.medicinalPlants.p1') }}</p>
          <p>{{ t('basics.medicinalPlants.p2') }}</p>
          <p>{{ t('basics.medicinalPlants.p3') }}</p>
        </div>
      </section>

      <!-- Importance -->
      <section class="basics-section">
        <h2 class="basics-section__title">{{ t('basics.importance.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.importance.p1') }}</p>
          <p>{{ t('basics.importance.p2') }}</p>
          <p>{{ t('basics.importance.p3') }}</p>
        </div>
      </section>

      <!-- History -->
      <section class="basics-section">
        <h2 class="basics-section__title">{{ t('basics.history.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.history.p1') }}</p>
          <p>{{ t('basics.history.p2') }}</p>
          <p>{{ t('basics.history.p3') }}</p>
        </div>
      </section>

      <!-- Phytochemicals -->
      <section class="basics-section">
        <h2 class="basics-section__title">{{ t('basics.phytochemicals.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.phytochemicals.intro') }}</p>
          <div class="phytochemical-grid">
            <div class="phytochemical-card">
              <h3>{{ t('basics.phytochemicals.alkaloids.title') }}</h3>
              <p>{{ t('basics.phytochemicals.alkaloids.desc') }}</p>
              <span class="phytochemical-examples">{{ t('basics.phytochemicals.alkaloids.examples') }}</span>
            </div>
            <div class="phytochemical-card">
              <h3>{{ t('basics.phytochemicals.glycosides.title') }}</h3>
              <p>{{ t('basics.phytochemicals.glycosides.desc') }}</p>
              <span class="phytochemical-examples">{{ t('basics.phytochemicals.glycosides.examples') }}</span>
            </div>
            <div class="phytochemical-card">
              <h3>{{ t('basics.phytochemicals.polyphenols.title') }}</h3>
              <p>{{ t('basics.phytochemicals.polyphenols.desc') }}</p>
              <span class="phytochemical-examples">{{ t('basics.phytochemicals.polyphenols.examples') }}</span>
            </div>
            <div class="phytochemical-card">
              <h3>{{ t('basics.phytochemicals.terpenes.title') }}</h3>
              <p>{{ t('basics.phytochemicals.terpenes.desc') }}</p>
              <span class="phytochemical-examples">{{ t('basics.phytochemicals.terpenes.examples') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Major Systems -->
      <section class="basics-section">
        <h2 class="basics-section__title">{{ t('basics.systems.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.systems.intro') }}</p>
          <div class="systems-grid">
            <div class="system-card">
              <div class="system-card__icon">🌿</div>
              <h3>{{ t('basics.systems.tcm.title') }}</h3>
              <p>{{ t('basics.systems.tcm.desc') }}</p>
            </div>
            <div class="system-card">
              <div class="system-card__icon">🪷</div>
              <h3>{{ t('basics.systems.ayurveda.title') }}</h3>
              <p>{{ t('basics.systems.ayurveda.desc') }}</p>
            </div>
            <div class="system-card">
              <div class="system-card__icon">🌺</div>
              <h3>{{ t('basics.systems.jamu.title') }}</h3>
              <p>{{ t('basics.systems.jamu.desc') }}</p>
            </div>
            <div class="system-card">
              <div class="system-card__icon">🌱</div>
              <h3>{{ t('basics.systems.western.title') }}</h3>
              <p>{{ t('basics.systems.western.desc') }}</p>
            </div>
            <div class="system-card">
              <div class="system-card__icon">🏜️</div>
              <h3>{{ t('basics.systems.unani.title') }}</h3>
              <p>{{ t('basics.systems.unani.desc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SIPM Mission -->
      <section class="basics-section basics-section--highlight">
        <h2 class="basics-section__title">{{ t('basics.sipm.title') }}</h2>
        <div class="basics-section__content">
          <p>{{ t('basics.sipm.mission') }}</p>
          <ul class="sipm-goals">
            <li>{{ t('basics.sipm.goal1') }}</li>
            <li>{{ t('basics.sipm.goal2') }}</li>
            <li>{{ t('basics.sipm.goal3') }}</li>
            <li>{{ t('basics.sipm.goal4') }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.basics-view {
  min-height: calc(100vh - var(--header-height));
}

.basics-hero {
  position: relative;
  height: 320px;
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%);
  background-size: cover;
  background-position: center;
}

.basics-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.basics-hero__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin: 0 0 var(--spacing-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.basics-hero__subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 600px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.basics-section {
  padding: var(--spacing-2xl) 0;
  border-bottom: 1px solid var(--color-border);
}

.basics-section:last-child {
  border-bottom: none;
}

.basics-section--highlight {
  background: var(--color-surface);
  margin: 0 calc(-1 * var(--spacing-lg));
  padding: var(--spacing-2xl) var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.basics-section__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.basics-section__content p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
}

.basics-section__content p:last-child {
  margin-bottom: 0;
}

/* Phytochemical Grid */
.phytochemical-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.phytochemical-card {
  background: var(--color-background);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
}

.phytochemical-card h3 {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-sm);
}

.phytochemical-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.phytochemical-examples {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
}

/* Systems Grid */
.systems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.system-card {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.system-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.system-card__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.system-card h3 {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-sm);
}

.system-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  margin: 0;
  line-height: var(--line-height-relaxed);
}

/* SIPM Goals */
.sipm-goals {
  list-style: none;
  padding: 0;
  margin: var(--spacing-lg) 0 0;
}

.sipm-goals li {
  position: relative;
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.sipm-goals li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

@media (max-width: 640px) {
  .basics-hero {
    height: 240px;
  }

  .basics-hero__title {
    font-size: var(--font-size-2xl);
  }

  .basics-hero__subtitle {
    font-size: var(--font-size-base);
  }

  .phytochemical-grid,
  .systems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
