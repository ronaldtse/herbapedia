<template>
  <div class="category-view">
    <!-- Category Hero Banner -->
    <div class="category-hero" :style="heroStyle">
      <div class="category-hero__overlay">
        <div class="container">
          <h1 class="category-hero__title">{{ categoryTitle }}</h1>
          <p class="category-hero__count">{{ filteredHerbs.length }} {{ t('common.items') }}</p>
        </div>
      </div>
    </div>

    <div class="container">
      <nav class="breadcrumbs">
        <router-link :to="localePath('/herbs')">{{ t('nav.herbs') }}</router-link>
        <span>/</span>
        <span>{{ categoryTitle }}</span>
      </nav>

      <!-- Category Description -->
      <CategoryDescription :category="category" />

      <div class="category-view__grid">
        <HerbCard
          v-for="herb in filteredHerbs"
          :key="herb.slug"
          :to="localePath(`/herbs/${herb.category}/${herb.slug}`)"
          :title="localizer.getName(herb)"
          :english-title="localizer.getCommonName(herb)"
          :scientific-name="herb.scientificName"
          :image="herb.image"
          :category="herb.category"
        />
      </div>

      <div v-if="filteredHerbs.length === 0" class="category-view__empty">
        <p>{{ t('common.noHerbsFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import HerbCard from '@/components/ui/HerbCard.vue'
import CategoryDescription from '@/components/ui/CategoryDescription.vue'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useHerbsByCategory, useHerbLocalizer } from '@/composables/useHerbData'

const route = useRoute()
const { t, locale } = useI18n()
const category = computed(() => route.params.category)

const localizer = useHerbLocalizer()

// Category title based on locale
const categoryTitle = computed(() => localizer.getCategoryLabel(category.value))

// Banner images mapping
const bannerImages = {
  'chinese-herbs': '/@herbapedia/data/media/images/banners/tcm-banner.jpg',
  'western-herbs': '/@herbapedia/data/media/images/banners/western-banner.jpg',
  'vitamins': '/@herbapedia/data/media/images/banners/vitamin-banner.jpg',
  'minerals': '/@herbapedia/data/media/images/banners/mineral-banner.jpg',
  'nutrients': '/@herbapedia/data/media/images/banners/nutrients-banner.jpg'
}

// Hero style with background image
const heroStyle = computed(() => {
  const image = bannerImages[category.value]
  return image ? { backgroundImage: `url(${image})` } : {}
})

// Helper to generate localized paths
const localePath = (path) => {
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Get herbs by category
const categoryHerbs = useHerbsByCategory(category)

// Filtered herbs (already filtered by category from the composable)
const filteredHerbs = computed(() => categoryHerbs.value)
</script>

<style scoped>
.category-view {
  min-height: calc(100vh - var(--header-height));
}

/* Hero Banner Styles */
.category-hero {
  position: relative;
  height: 280px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.category-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--spacing-2xl);
}

.category-hero__title {
  font-family: var(--font-serif);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: white;
  margin: 0 0 var(--spacing-sm);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.category-hero__count {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin: var(--spacing-xl) 0;
}

.breadcrumbs a {
  color: var(--color-primary);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.category-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.category-view__empty {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-light);
}

@media (max-width: 640px) {
  .category-hero {
    height: 200px;
  }

  .category-hero__title {
    font-size: var(--font-size-2xl);
  }

  .category-hero__count {
    font-size: var(--font-size-base);
  }
}
</style>
