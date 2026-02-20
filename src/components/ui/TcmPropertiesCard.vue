<template>
  <div v-if="hasTcmProperties" class="tcm-properties-card">
    <h3 class="tcm-properties-card__title">{{ t('tcm.properties') }}</h3>

    <div class="tcm-properties-card__grid">
      <!-- Nature (Temperature) -->
      <div v-if="natureLabel" class="tcm-property">
        <span class="tcm-property__label">{{ t('tcm.nature') }}</span>
        <span class="tcm-property__value tcm-property__value--nature" :class="natureClass">
          {{ natureLabel }}
        </span>
      </div>

      <!-- Flavors -->
      <div v-if="flavorLabels.length > 0" class="tcm-property">
        <span class="tcm-property__label">{{ t('tcm.flavor') }}</span>
        <div class="tcm-property__tags">
          <span
            v-for="flavor in flavorLabels"
            :key="flavor.id"
            class="tcm-tag tcm-tag--flavor"
          >
            {{ flavor.label }}
          </span>
        </div>
      </div>

      <!-- Meridians -->
      <div v-if="meridianLabels.length > 0" class="tcm-property">
        <span class="tcm-property__label">{{ t('tcm.meridian') }}</span>
        <div class="tcm-property__tags">
          <span
            v-for="meridian in meridianLabels"
            :key="meridian.id"
            class="tcm-tag tcm-tag--meridian"
          >
            {{ meridian.label }}
          </span>
        </div>
      </div>

      <!-- TCM Category -->
      <div v-if="categoryLabel" class="tcm-property">
        <span class="tcm-property__label">{{ t('tcm.category') }}</span>
        <span class="tcm-property__value">{{ categoryLabel }}</span>
      </div>
    </div>

    <!-- Pinyin -->
    <div v-if="herb.pinyin" class="tcm-properties-card__pinyin">
      <span class="tcm-property__label">{{ t('tcm.pinyin') }}</span>
      <span class="tcm-properties-card__pinyin-value">{{ herb.pinyin }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTcmReferences } from '@/composables/useHerbData'

const props = defineProps({
  herb: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const { getNatureLabel, getFlavorLabels, getMeridianLabels, getCategoryLabel } = useTcmReferences()

// Compute labels from @id references
const natureLabel = computed(() => getNatureLabel(props.herb.hasNature))
const flavorLabels = computed(() => getFlavorLabels(props.herb.hasFlavor))
const meridianLabels = computed(() => getMeridianLabels(props.herb.entersMeridian))
const categoryLabel = computed(() => getCategoryLabel(props.herb.hasCategory))

// Check if herb has any TCM properties
const hasTcmProperties = computed(() => {
  return props.herb.type === 'tcm-herb' ||
         props.herb.hasNature ||
         (props.herb.hasFlavor && props.herb.hasFlavor.length > 0) ||
         (props.herb.entersMeridian && props.herb.entersMeridian.length > 0) ||
         props.herb.hasCategory
})

// Nature class for styling (hot/warm/neutral/cool/cold)
const natureClass = computed(() => {
  if (!props.herb.hasNature) return ''
  const id = typeof props.herb.hasNature === 'object'
    ? props.herb.hasNature['@id']
    : props.herb.hasNature
  if (typeof id === 'string') {
    if (id.includes('hot')) return 'tcm-nature--hot'
    if (id.includes('warm')) return 'tcm-nature--warm'
    if (id.includes('neutral')) return 'tcm-nature--neutral'
    if (id.includes('cool')) return 'tcm-nature--cool'
    if (id.includes('cold')) return 'tcm-nature--cold'
  }
  return ''
})
</script>

<style scoped>
.tcm-properties-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.tcm-properties-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin: 0 0 var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-accent);
}

.tcm-properties-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.tcm-property {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tcm-property__label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-light);
}

.tcm-property__value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.tcm-property__value--nature {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tcm-property__value--nature.tcm-nature--hot {
  color: #dc2626;
}

.tcm-property__value--nature.tcm-nature--warm {
  color: #ea580c;
}

.tcm-property__value--nature.tcm-nature--neutral {
  color: var(--color-text);
}

.tcm-property__value--nature.tcm-nature--cool {
  color: #0891b2;
}

.tcm-property__value--nature.tcm-nature--cold {
  color: #2563eb;
}

.tcm-property__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tcm-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tcm-tag--flavor {
  background: #fef3c7;
  color: #92400e;
}

.tcm-tag--meridian {
  background: #dbeafe;
  color: #1e40af;
}

.tcm-properties-card__pinyin {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.tcm-properties-card__pinyin-value {
  font-style: italic;
  color: var(--color-text);
}
</style>
