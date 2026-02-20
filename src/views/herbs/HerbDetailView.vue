<template>
  <div class="herb-detail-view">
    <div class="container container-narrow">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/herbs')">{{ t('nav.herbs') }}</router-link>
        <span>/</span>
        <router-link :to="localePath(`/herbs/${herb?.category}`)">{{ categoryTitle }}</router-link>
        <span>/</span>
        <span>{{ herbTitle }}</span>
      </nav>

      <article v-if="herb" class="herb-detail">
        <header class="herb-detail__header">
          <div class="herb-detail__image-wrapper">
            <img
              v-if="herb.image"
              :src="herb.image"
              :alt="herbTitle"
              class="herb-detail__image"
            />
            <div v-else class="herb-detail__placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          <div class="herb-detail__meta">
            <span class="herb-detail__category">{{ categoryTitle }}</span>
            <h1 class="herb-detail__title">{{ herbTitle }}</h1>
            <p v-if="localizer.getCommonName(herb)" class="herb-detail__english-title">{{ localizer.getCommonName(herb) }}</p>
            <p v-if="herbScientificName" class="herb-detail__scientific">
              {{ herbScientificName }}
            </p>
          </div>
        </header>

        <!-- TCM Properties Card -->
        <TcmPropertiesCard v-if="herb.type === 'tcm-herb'" :herb="herb" />

        <!-- Western Properties Card -->
        <WesternPropertiesCard v-if="herb.type === 'western-herb'" :herb="herb" />

        <!-- Chemical Compounds Card -->
        <ChemicalCompoundsCard v-if="herb.containsChemical?.length" :herb="herb" />

        <!-- Safety Alert -->
        <SafetyAlert v-if="herb" :herb="herb" />

        <div class="herb-detail__content">
          <!-- Description -->
          <section v-if="herbDescription" class="herb-detail__section">
            <h2>{{ t('sections.description') }}</h2>
            <p>{{ herbDescription }}</p>
          </section>

          <!-- History -->
          <section v-if="herbHistory" class="herb-detail__section">
            <h2>{{ t('sections.history') }}</h2>
            <p>{{ herbHistory }}</p>
          </section>

          <!-- Traditional Usage -->
          <section v-if="herbTraditionalUsage" class="herb-detail__section">
            <h2>{{ t('sections.traditionalUsage') }}</h2>
            <p style="white-space: pre-line;">{{ herbTraditionalUsage }}</p>
          </section>

          <!-- Functions -->
          <section v-if="herbFunctions" class="herb-detail__section">
            <h2>{{ t('sections.functions') }}</h2>
            <p style="white-space: pre-line;">{{ herbFunctions }}</p>
          </section>

          <!-- Actions (for TCM herbs) -->
          <section v-if="herb.actions && herb.actions.length > 0" class="herb-detail__section">
            <h2>{{ t('tcm.actions') }}</h2>
            <ul class="herb-detail__list">
              <li v-for="(action, index) in herb.actions" :key="index">{{ action }}</li>
            </ul>
          </section>

          <!-- Indications (for TCM herbs) -->
          <section v-if="herb.indications && herb.indications.length > 0" class="herb-detail__section">
            <h2>{{ t('sections.indications') }}</h2>
            <ul class="herb-detail__list">
              <li v-for="(indication, index) in herb.indications" :key="index">{{ indication }}</li>
            </ul>
          </section>

          <!-- Modern Research -->
          <section v-if="herbModernResearch" class="herb-detail__section">
            <h2>{{ t('sections.modernResearch') }}</h2>
            <p style="white-space: pre-line;">{{ herbModernResearch }}</p>
          </section>

          <!-- Classical Reference (for TCM herbs) -->
          <section v-if="herbClassicalReference" class="herb-detail__section herb-detail__section--quote">
            <h2>{{ t('sections.classicalReference') }}</h2>
            <blockquote>{{ herbClassicalReference }}</blockquote>
          </section>

          <!-- Contraindications (for TCM herbs) -->
          <section v-if="herbContraindications" class="herb-detail__section herb-detail__section--warning">
            <h2>{{ t('sections.contraindications') }}</h2>
            <p>{{ herbContraindications }}</p>
          </section>

          <!-- Safety Consideration (for TCM herbs) -->
          <section v-if="herbSafetyConsideration" class="herb-detail__section herb-detail__section--warning">
            <h2>{{ t('sections.safetyConsideration') }}</h2>
            <p>{{ herbSafetyConsideration }}</p>
          </section>

          <!-- Dosage (for TCM herbs) -->
          <section v-if="herbDosage" class="herb-detail__section">
            <h2>{{ t('sections.dosage') }}</h2>
            <p>{{ herbDosage }}</p>
          </section>

          <!-- External Links -->
          <section v-if="hasExternalLinks" class="herb-detail__section">
            <h2>{{ t('links.title') }}</h2>
            <div class="herb-detail__links">
              <a
                v-for="link in externalLinks"
                :key="link.url"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="herb-detail__link"
              >
                <span class="herb-detail__link-icon">{{ link.icon }}</span>
                <span class="herb-detail__link-label">{{ link.label }}</span>
                <span class="herb-detail__link-arrow">→</span>
              </a>
            </div>
          </section>

          <aside class="herb-detail__disclaimer">
            <p>
              <strong>{{ t('disclaimer.title') }}:</strong> {{ t('disclaimer.text') }}
            </p>
          </aside>
        </div>

        <!-- Related Herbs -->
        <RelatedHerbs v-if="herb" :herb="herb" :limit="4" />
      </article>

      <div v-else class="herb-detail__not-found">
        <h1>{{ t('common.notFound') }}</h1>
        <p>{{ t('common.herbNotFound') }}</p>
        <router-link :to="localePath('/herbs')" class="herb-detail__back-link">
          &larr; {{ t('common.backToHerbs') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useHerb, useHerbLocalizer } from '@/composables/useHerbData'
import TcmPropertiesCard from '@/components/ui/TcmPropertiesCard.vue'
import WesternPropertiesCard from '@/components/ui/WesternPropertiesCard.vue'
import ChemicalCompoundsCard from '@/components/ui/ChemicalCompoundsCard.vue'
import RelatedHerbs from '@/components/ui/RelatedHerbs.vue'
import SafetyAlert from '@/components/ui/SafetyAlert.vue'

const route = useRoute()
const { t, locale } = useI18n()
const slug = computed(() => route.params.slug)

const herb = ref(null)

// Category titles based on locale
const getCategoryTitle = (categorySlug) => {
  const titles = {
    'chinese-herbs': t('categories.chineseHerbs'),
    'western-herbs': t('categories.westernHerbs'),
    'vitamins': t('categories.vitamins'),
    'minerals': t('categories.minerals'),
    'nutrients': t('categories.nutrients')
  }
  return titles[categorySlug] || categorySlug
}

const categoryTitle = computed(() => getCategoryTitle(herb.value?.category))

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Get localized content
const localizer = useHerbLocalizer()

// Computed properties for localized display
const herbTitle = computed(() => {
  if (!herb.value) return null
  return localizer.getName(herb.value) || herb.value.slug
})

const herbScientificName = computed(() => herb.value?.scientificName)

const herbHistory = computed(() =>
  localizer.getTcmHistory(herb.value) || localizer.getWesternHistory(herb.value))
const herbTraditionalUsage = computed(() =>
  localizer.getTcmTraditionalUsage(herb.value) || localizer.getWesternTraditionalUsage(herb.value))
const herbModernResearch = computed(() =>
  localizer.getTcmModernResearch(herb.value) || localizer.getWesternModernResearch(herb.value))
const herbFunctions = computed(() => localizer.getTcmFunctions(herb.value))
const herbDescription = computed(() => localizer.getDescription(herb.value))

// Additional TCM content
const herbClassicalReference = computed(() => {
  if (!herb.value?.tcmClassicalReference) return null
  return localizer.getTcmHistory(herb.value) || herb.value.tcmClassicalReference['zh-Hant'] || herb.value.tcmClassicalReference['en']
})

const herbContraindications = computed(() => {
  if (!herb.value?.contraindications) return null
  const c = herb.value.contraindications
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant'] || null
})

const herbSafetyConsideration = computed(() => {
  if (!herb.value?.tcmSafetyConsideration) return null
  const s = herb.value.tcmSafetyConsideration
  if (typeof s === 'string') return s
  return s[locale.value] || s['en'] || s['zh-Hant'] || null
})

const herbDosage = computed(() => {
  if (!herb.value?.dosage) return null
  const d = herb.value.dosage
  if (typeof d === 'string') return d
  return d[locale.value] || d['en'] || d['zh-Hant'] || null
})

// External links
const externalLinks = computed(() => {
  if (!herb.value?.sameAs) return []
  const links = []

  for (const link of herb.value.sameAs) {
    const url = typeof link === 'object' ? link['@id'] || link : link

    if (typeof url === 'string') {
      if (url.includes('wikidata.org')) {
        links.push({
          url,
          label: t('links.wikidata'),
          icon: '📊'
        })
      } else if (url.includes('gbif.org')) {
        links.push({
          url,
          label: t('links.gbif'),
          icon: '🌿'
        })
      } else if (url.includes('wikipedia.org')) {
        links.push({
          url,
          label: t('links.wikipedia'),
          icon: '📚'
        })
      }
    }
  }

  return links
})

const hasExternalLinks = computed(() => externalLinks.value.length > 0)

// Watch slug changes and load herb
watch(slug, (newSlug) => {
  if (newSlug) {
    const herbData = useHerb(newSlug)
    herb.value = herbData.value
  }
}, { immediate: true })
</script>

<style scoped>
.herb-detail-view {
  padding: var(--spacing-2xl) 0;
  min-height: calc(100vh - var(--header-height));
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.herb-detail__header {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
}

.herb-detail__image-wrapper {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-background);
}

.herb-detail__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.herb-detail__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}

.herb-detail__placeholder svg {
  width: 64px;
  height: 64px;
}

.herb-detail__meta {
  flex: 1;
}

.herb-detail__category {
  display: inline-block;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-md);
}

.herb-detail__title {
  margin-bottom: var(--spacing-sm);
}

.herb-detail__english-title {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs);
}

.herb-detail__scientific {
  font-style: italic;
  color: var(--color-text-light);
  margin: 0;
}

.herb-detail__content {
  background: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.herb-detail__section {
  margin-bottom: var(--spacing-xl);
}

.herb-detail__section:last-of-type {
  margin-bottom: 0;
}

.herb-detail__section h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.herb-detail__section p {
  line-height: var(--line-height-relaxed);
}

.herb-detail__section--warning {
  background: #fef3c7;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid #f59e0b;
}

.herb-detail__section--warning h2 {
  border-bottom-color: #f59e0b;
}

.herb-detail__section--quote blockquote {
  font-style: italic;
  color: var(--color-text-light);
  padding-left: var(--spacing-md);
  border-left: 3px solid var(--color-accent);
  margin: 0;
}

.herb-detail__list {
  margin: 0;
  padding-left: var(--spacing-lg);
}

.herb-detail__list li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-relaxed);
}

.herb-detail__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.herb-detail__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.herb-detail__link:hover {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.herb-detail__link-icon {
  font-size: var(--font-size-lg);
}

.herb-detail__link-label {
  font-weight: var(--font-weight-medium);
}

.herb-detail__link-arrow {
  opacity: 0.5;
}

.herb-detail__disclaimer {
  margin-top: var(--spacing-2xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-left: 4px solid var(--color-accent);
  border-radius: var(--radius-sm);
}

.herb-detail__disclaimer p {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: 0;
}

.herb-detail__not-found {
  text-align: center;
  padding: var(--spacing-3xl);
}

.herb-detail__back-link {
  display: inline-block;
  margin-top: var(--spacing-lg);
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .herb-detail__header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .herb-detail__image-wrapper {
    width: 150px;
    height: 150px;
  }

  .herb-detail__links {
    flex-direction: column;
  }
}
</style>
