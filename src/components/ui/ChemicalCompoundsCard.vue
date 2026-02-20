<template>
  <div v-if="hasCompounds" class="chemical-compounds-card">
    <h3 class="chemical-compounds-card__title">{{ t('compounds.title') }}</h3>

    <div class="chemical-compounds-card__grid">
      <div class="compounds-list">
        <div
          v-for="compound in compoundLabels"
          :key="compound.id"
          class="compound-item"
        >
          <span class="compound-tag">
            <span class="compound-tag__icon">⚗️</span>
            <span class="compound-tag__label">{{ compound.label }}</span>
          </span>
          <p v-if="compound.description" class="compound-description">
            {{ compound.description }}
          </p>
        </div>
      </div>
    </div>

    <div class="chemical-compounds-card__note">
      <span class="note-icon">💡</span>
      <span class="note-text">{{ t('compounds.note') }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChemicalReferences } from '@/composables/useHerbData'

const props = defineProps({
  herb: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const { getCompoundLabels } = useChemicalReferences()

// Get compound labels from @id references
const compoundLabels = computed(() => {
  if (!props.herb.containsChemical || !Array.isArray(props.herb.containsChemical)) {
    return []
  }
  return getCompoundLabels(props.herb.containsChemical)
})

// Check if herb has compound references
const hasCompounds = computed(() => {
  return props.herb.containsChemical && props.herb.containsChemical.length > 0
})
</script>

<style scoped>
.chemical-compounds-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.chemical-compounds-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid #8b5cf6;
}

.chemical-compounds-card__grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.compounds-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.compound-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-md);
}

.compound-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: #7c3aed;
  width: fit-content;
}

.compound-tag__icon {
  font-size: var(--font-size-base);
}

.compound-tag__label {
  line-height: 1;
}

.compound-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  margin: 0;
  padding-left: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.chemical-compounds-card__note {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
  font-style: italic;
}

.note-icon {
  flex-shrink: 0;
}

.note-text {
  line-height: var(--line-height-relaxed);
}
</style>
