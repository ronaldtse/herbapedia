<template>
  <div v-if="relatedHerbs.length > 0" class="related-herbs">
    <h3 class="related-herbs__title">{{ t('relatedHerbs.title') }}</h3>

    <div class="related-herbs__grid">
      <router-link
        v-for="item in relatedHerbs"
        :key="item.herb.slug"
        :to="getHerbPath(item.herb)"
        class="related-herb-card"
      >
        <div class="related-herb-card__image-wrapper">
          <img
            v-if="item.herb.image"
            :src="item.herb.image"
            :alt="getHerbName(item.herb)"
            class="related-herb-card__image"
          />
          <div v-else class="related-herb-card__placeholder">
            <span>🌿</span>
          </div>
        </div>

        <div class="related-herb-card__content">
          <h4 class="related-herb-card__name">{{ getHerbName(item.herb) }}</h4>
          <p v-if="item.herb.scientificName" class="related-herb-card__scientific">
            {{ item.herb.scientificName }}
          </p>

          <div class="related-herb-card__tags">
            <span
              v-for="reason in item.matchReasons.slice(0, 2)"
              :key="reason.type"
              class="related-herb-card__tag"
              :class="`related-herb-card__tag--${reason.type}`"
            >
              {{ getMatchLabel(reason) }}
            </span>
          </div>
        </div>

        <span class="related-herb-card__arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/i18n/locales'
import { useRelatedHerbs, useHerbLocalizer } from '@/composables/useHerbData'

const props = defineProps({
  herb: {
    type: Object,
    required: true
  },
  limit: {
    type: Number,
    default: 4
  }
})

const { t, locale } = useI18n()
const localizer = useHerbLocalizer()
const relatedHerbs = useRelatedHerbs(props.herb, props.limit)

// Helper to generate localized herb paths
function getHerbPath(herb) {
  const path = `/herbs/${herb.category}/${herb.slug}`
  if (locale.value === DEFAULT_LOCALE) {
    return path
  }
  return `/${locale.value}${path}`
}

// Get herb name based on locale
function getHerbName(herb) {
  return localizer.getName(herb) || herb.slug
}

// Get label for match reason
function getMatchLabel(reason) {
  if (reason.type === 'compounds') {
    return t('relatedHerbs.sharedCompounds', { count: reason.count })
  } else if (reason.type === 'category') {
    return t('relatedHerbs.sameCategory')
  } else if (reason.type === 'actions') {
    return t('relatedHerbs.similarActions')
  }
  return ''
}
</script>

<style scoped>
.related-herbs {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.related-herbs__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid #10b981;
}

.related-herbs__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.related-herb-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.related-herb-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.related-herb-card__image-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
}

.related-herb-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-herb-card__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.related-herb-card__content {
  flex: 1;
  min-width: 0;
}

.related-herb-card__name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-herb-card__scientific {
  font-size: var(--font-size-xs);
  font-style: italic;
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-herb-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.related-herb-card__tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.related-herb-card__tag--compounds {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
}

.related-herb-card__tag--category {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.related-herb-card__tag--actions {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.related-herb-card__arrow {
  flex-shrink: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.related-herb-card:hover .related-herb-card__arrow {
  opacity: 1;
}

@media (max-width: 640px) {
  .related-herbs__grid {
    grid-template-columns: 1fr;
  }
}
</style>
