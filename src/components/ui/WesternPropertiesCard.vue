<template>
  <div v-if="hasWesternProperties" class="western-properties-card">
    <h3 class="western-properties-card__title">{{ t('western.properties') }}</h3>

    <div class="western-properties-card__grid">
      <!-- Herbal Actions -->
      <div v-if="actionLabels.length > 0" class="western-property">
        <span class="western-property__label">{{ t('western.actions') }}</span>
        <div class="western-property__tags">
          <span
            v-for="action in actionLabels"
            :key="action.id"
            class="western-tag western-tag--action"
          >
            {{ action.label }}
          </span>
        </div>
      </div>

      <!-- Organ Affinities -->
      <div v-if="organLabels.length > 0" class="western-property">
        <span class="western-property__label">{{ t('western.organAffinities') }}</span>
        <div class="western-property__tags">
          <span
            v-for="organ in organLabels"
            :key="organ.id"
            class="western-tag western-tag--organ"
          >
            {{ organ.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Scientific Name -->
    <div v-if="herb.scientificName" class="western-properties-card__scientific">
      <span class="western-property__label">{{ t('western.scientificName') }}</span>
      <span class="western-properties-card__scientific-value">{{ herb.scientificName }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWesternReferences } from '@/composables/useHerbData'

const props = defineProps({
  herb: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const { getActionLabels, getOrganLabels } = useWesternReferences()

// Compute labels from @id references
const actionLabels = computed(() => getActionLabels(props.herb.hasAction))
const organLabels = computed(() => getOrganLabels(props.herb.hasOrganAffinity))

// Check if herb has any Western properties
const hasWesternProperties = computed(() => {
  return props.herb.type === 'western-herb' ||
         (props.herb.hasAction && props.herb.hasAction.length > 0) ||
         (props.herb.hasOrganAffinity && props.herb.hasOrganAffinity.length > 0) ||
         props.herb.westernHistory ||
         props.herb.westernTraditionalUsage
})
</script>

<style scoped>
.western-properties-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.western-properties-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-secondary);
  margin: 0 0 var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-secondary);
}

.western-properties-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.western-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.western-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.western-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.western-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.western-tag--action {
  background: #dcfce7;
  color: #166534;
}

.western-tag--organ {
  background: #f3e8ff;
  color: #7c3aed;
}

.western-properties-card__scientific {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.western-properties-card__scientific-value {
  font-style: italic;
  color: var(--color-text);
}
</style>
