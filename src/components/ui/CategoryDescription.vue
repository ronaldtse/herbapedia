<template>
  <div class="category-description">
    <div class="category-description__icon" v-html="categoryIcon"></div>
    <div class="category-description__content">
      <p class="category-description__text">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const { locale } = useI18n()

// Category icons as SVG
const categoryIcons = {
  'chinese-herbs': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.2"/></svg>',
  'western-herbs': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c-4 4-6 8-6 12 0 4 2.5 6 6 6s6-2 6-6c0-4-2-8-6-12z"/><path d="M12 8v8"/><path d="M9 12h6"/></svg>',
  'vitamins': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="2" width="10" height="20" rx="5"/><path d="M12 6v4"/><path d="M10 8h4"/></svg>',
  'minerals': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l8 6v8l-8 6-8-6V8l8-6z"/><path d="M12 22V10"/><path d="M4 8l8 2 8-2"/></svg>',
  'nutrients': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><circle cx="12" cy="16" r="3"/><path d="M10 10l2 4"/><path d="M14 10l-2 4"/></svg>'
}

// Category descriptions in multiple languages
const descriptions = {
  'chinese-herbs': {
    en: 'Traditional Chinese Medicinal herbs have been used for thousands of years to promote health and treat illness. Each herb has specific properties (nature, flavor, meridian affinity) that determine its therapeutic applications.',
    'zh-Hant': '中藥材已有數千年歷史，用於促進健康和治療疾病。每種藥材都有特定的屬性（藥性、味道、歸經），決定其治療應用。',
    'zh-Hans': '中药材已有数千年历史，用于促进健康和治疗疾病。每种药材都有特定的属性（药性、味道、归经），决定其治疗应用。'
  },
  'western-herbs': {
    en: 'Western herbalism draws from European and North American traditional medicine. These herbs are valued for their active compounds and therapeutic actions on specific body systems.',
    'zh-Hant': '西方草本醫學源自歐洲和北美傳統醫學。這些草藥因其活性成分和對特定身體系統的治療作用而受到重視。',
    'zh-Hans': '西方草药医学源自欧洲和北美传统医学。这些草药因其活性成分和对特定身体系统的治疗作用而受到重视。'
  },
  'vitamins': {
    en: 'Vitamins are essential organic compounds that the body needs in small amounts for proper metabolism, growth, and overall health. They play crucial roles in immune function, energy production, and cellular repair.',
    'zh-Hant': '維他命是人體必需的有機化合物，身體需要少量以維持正常代謝、生長和整體健康。它們在免疫功能、能量產生和細胞修復中發揮關鍵作用。',
    'zh-Hans': '维生素是人体必需的有机化合物，身体需要少量以维持正常代谢、生长和整体健康。它们在免疫功能、能量产生和细胞修复中发挥关键作用。'
  },
  'minerals': {
    en: 'Minerals are inorganic elements essential for various bodily functions including bone formation, nerve transmission, and enzyme activity. They must be obtained through diet as the body cannot produce them.',
    'zh-Hant': '礦物質是各種身體功能所需的無機元素，包括骨骼形成、神經傳導和酶活性。它們必須通過飲食獲得，因為人體無法自行產生。',
    'zh-Hans': '矿物质是各种身体功能所需的无机元素，包括骨骼形成、神经传导和酶活性。它们必须通过饮食获得，因为人体无法自行产生。'
  },
  'nutrients': {
    en: 'Nutrients include amino acids, fatty acids, and other beneficial compounds that support health. Many serve as building blocks for proteins, hormones, and cellular structures.',
    'zh-Hant': '營養素包括氨基酸、脂肪酸和其他有益化合物，支持身體健康。許多營養素作為蛋白質、激素和細胞結構的構建塊。',
    'zh-Hans': '营养素包括氨基酸、脂肪酸和其他有益化合物，支持身体健康。许多营养素作为蛋白质、激素和细胞结构的构建块。'
  }
}

const categoryIcon = computed(() => categoryIcons[props.category] || '🌿')

const description = computed(() => {
  const desc = descriptions[props.category]
  if (!desc) return ''
  return desc[locale.value] || desc['en']
})
</script>

<style scoped>
.category-description {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border: 1px solid var(--color-border);
}

.category-description__icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  color: var(--color-primary);
}

.category-description__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.category-description__text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

@media (max-width: 640px) {
  .category-description {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
