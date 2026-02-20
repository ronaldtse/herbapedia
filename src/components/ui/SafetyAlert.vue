<template>
  <div v-if="hasWarnings" class="safety-alert" :class="severityClass">
    <div class="safety-alert__header">
      <span class="safety-alert__icon">{{ icon }}</span>
      <h3 class="safety-alert__title">{{ t('safety.title') }}</h3>
    </div>

    <div class="safety-alert__content">
      <div v-if="herbContraindications" class="safety-alert__item">
        <strong>{{ t('sections.contraindications') }}:</strong>
        <p>{{ herbContraindications }}</p>
      </div>

      <div v-if="herbSafetyConsideration" class="safety-alert__item">
        <strong>{{ t('sections.safetyConsideration') }}:</strong>
        <p>{{ herbSafetyConsideration }}</p>
      </div>
    </div>

    <p class="safety-alert__disclaimer">
      {{ t('safety.disclaimer') }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  herb: {
    type: Object,
    required: true
  }
})

const { t, locale } = useI18n()

// Extract contraindications
const herbContraindications = computed(() => {
  if (!props.herb?.contraindications) return null
  const c = props.herb.contraindications
  if (typeof c === 'string') return c
  return c[locale.value] || c['en'] || c['zh-Hant'] || null
})

// Extract safety consideration
const herbSafetyConsideration = computed(() => {
  if (!props.herb?.tcmSafetyConsideration) return null
  const s = props.herb.tcmSafetyConsideration
  if (typeof s === 'string') return s
  return s[locale.value] || s['en'] || s['zh-Hant'] || null
})

// Check if any warnings exist
const hasWarnings = computed(() => {
  return herbContraindications.value || herbSafetyConsideration.value
})

// Determine severity based on content
const severityClass = computed(() => {
  const contraindications = herbContraindications.value?.toLowerCase() || ''
  const safety = herbSafetyConsideration.value?.toLowerCase() || ''

  // Check for high-severity keywords
  const severeKeywords = ['pregnancy', 'pregnant', 'pregnant women', '懷孕', '怀孕',
                          'severe', 'serious', '嚴重', '严重', 'do not use', '禁止']

  for (const keyword of severeKeywords) {
    if (contraindications.includes(keyword) || safety.includes(keyword)) {
      return 'safety-alert--severe'
    }
  }

  return 'safety-alert--warning'
})

// Icon based on severity
const icon = computed(() => {
  return severityClass.value === 'safety-alert--severe' ? '🚫' : '⚠️'
})
</script>

<style scoped>
.safety-alert {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-left: 4px solid #f59e0b;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.safety-alert--severe {
  background: #fee2e2;
  border-color: #ef4444;
  border-left-color: #ef4444;
}

.safety-alert__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.safety-alert__icon {
  font-size: var(--font-size-xl);
}

.safety-alert__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: #92400e;
  margin: 0;
}

.safety-alert--severe .safety-alert__title {
  color: #991b1b;
}

.safety-alert__content {
  margin-bottom: var(--spacing-md);
}

.safety-alert__item {
  margin-bottom: var(--spacing-sm);
}

.safety-alert__item:last-child {
  margin-bottom: 0;
}

.safety-alert__item strong {
  display: block;
  color: #92400e;
  margin-bottom: var(--spacing-xs);
}

.safety-alert--severe .safety-alert__item strong {
  color: #991b1b;
}

.safety-alert__item p {
  margin: 0;
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
}

.safety-alert__disclaimer {
  font-size: var(--font-size-xs);
  color: #a16207;
  margin: var(--spacing-md) 0 0;
  padding-top: var(--spacing-sm);
  border-top: 1px dashed #f59e0b;
  font-style: italic;
}

.safety-alert--severe .safety-alert__disclaimer {
  color: #b91c1c;
  border-top-color: #ef4444;
}
</style>
