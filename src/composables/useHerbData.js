/**
 * Herbapedia JSON-LD Data Composable
 *
 * Loads and manages data from @herbapedia/data package.
 * Provides herbs, categories, and search functionality.
 *
 * Architecture:
 * - Plants contain botanical data (scientific name, common names, images)
 * - System profiles (TCM, Ayurveda, etc.) contain system-specific content
 * - This composable merges plant + system data for display
 */

import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// Import all JSON-LD files using Vite glob
// Plants: botanical data
const plantModules = import.meta.glob('@herbapedia/data/entities/plants/*/entity.jsonld', {
  eager: true
})

// TCM profiles: TCM-specific content
const tcmModules = import.meta.glob('@herbapedia/data/systems/tcm/herbs/*/profile.jsonld', {
  eager: true
})

// Western profiles: Western herbalism content
const westernModules = import.meta.glob('@herbapedia/data/systems/western/herbs/*/profile.jsonld', {
  eager: true
})

// Reference data for lookups
const meridianModules = import.meta.glob('@herbapedia/data/systems/tcm/meridians.jsonld', {
  eager: true
})
const natureModules = import.meta.glob('@herbapedia/data/systems/tcm/natures.jsonld', {
  eager: true
})
const flavorModules = import.meta.glob('@herbapedia/data/systems/tcm/flavors.jsonld', {
  eager: true
})
const categoryModules = import.meta.glob('@herbapedia/data/systems/tcm/categories.jsonld', {
  eager: true
})

// Western reference data: actions and organ affinities
const westernActionModules = import.meta.glob('@herbapedia/data/systems/western/actions.jsonld', {
  eager: true
})
const westernOrganModules = import.meta.glob('@herbapedia/data/systems/western/organs.jsonld', {
  eager: true
})

// Chemical compounds reference data
const chemicalModules = import.meta.glob('@herbapedia/data/reference/chemicals/compounds.jsonld', {
  eager: true
})

// Cache for merged data
const plantsCache = new Map()
const tcmCache = new Map()
const westernCache = new Map()
const mergedCache = new Map()
const categoryCache = new Map()

// Western reference data caches
const westernActionCache = new Map()
const westernOrganCache = new Map()

// Chemical compounds cache
const chemicalCache = new Map()

// Category mapping from TCM category ID to site category
const TCM_CATEGORY_MAP = {
  'tonify-qi': 'chinese-herbs',
  'tonify-blood': 'chinese-herbs',
  'tonify-yin': 'chinese-herbs',
  'tonify-yang': 'chinese-herbs',
  'clear-heat': 'chinese-herbs',
  'drain-damp': 'chinese-herbs',
  'transform-phlegm': 'chinese-herbs',
  'regulate-qi': 'chinese-herbs',
  'invigorate-blood': 'chinese-herbs',
  'calm-spirit': 'chinese-herbs',
  'aromatize': 'chinese-herbs',
  'tonify-qi-and-yin': 'chinese-herbs',
  'digestion': 'chinese-herbs',
  'external': 'chinese-herbs',
  'reduce-swelling': 'chinese-herbs',
  'stop-bleeding': 'chinese-herbs',
}

/**
 * Initialize caches from imported modules
 */
function initializeCaches() {
  if (plantsCache.size > 0) return // Already initialized

  // Process plant entities
  for (const [path, module] of Object.entries(plantModules)) {
    const data = module?.default || module
    if (data && data['@id']) {
      const slug = data['@id'].replace('plant/', '')
      plantsCache.set(slug, {
        slug,
        ...data
      })
    }
  }

  // Process TCM profiles
  for (const [path, module] of Object.entries(tcmModules)) {
    const data = module?.default || module
    if (data && data['@id']) {
      const slug = data['@id'].replace('tcm/', '')
      tcmCache.set(slug, {
        slug,
        ...data
      })
    }
  }

  // Process Western profiles
  for (const [path, module] of Object.entries(westernModules)) {
    const data = module?.default || module
    if (data && data['@id']) {
      const slug = data['@id'].replace('western/', '')
      westernCache.set(slug, {
        slug,
        ...data
      })
    }
  }

  // Build merged cache (plants + TCM data + Western data)
  for (const [slug, plant] of plantsCache) {
    // Find TCM profile for this plant
    let tcmProfile = null
    for (const [tcmSlug, tcm] of tcmCache) {
      if (tcm.derivedFromPlant && tcm.derivedFromPlant['@id']) {
        const plantRef = tcm.derivedFromPlant['@id']
          .replace('plant/', '')
          .replace('#root', '')
          .replace('#leaf', '')
        if (plantRef === slug) {
          tcmProfile = tcm
          break
        }
      }
    }

    // Find Western profile for this plant
    let westernProfile = westernCache.get(slug) || null

    // Determine category
    let category = 'western-herbs'
    let herbType = 'plant'

    if (tcmProfile) {
      herbType = 'tcm-herb'
      const categoryRef = tcmProfile.hasCategory
      if (categoryRef && typeof categoryRef === 'object' && categoryRef['@id']) {
        const categoryId = categoryRef['@id'].replace('category/', '')
        category = TCM_CATEGORY_MAP[categoryId] || 'chinese-herbs'
      } else {
        category = 'chinese-herbs'
      }
    } else if (westernProfile) {
      herbType = 'western-herb'
      category = 'western-herbs'
    } else {
      // Determine from slug patterns
      if (slug.includes('vitamin-')) {
        category = 'vitamins'
      } else if (['calcium', 'copper', 'iodine', 'iron', 'magnesium', 'manganese', 'potassium', 'selenium', 'zinc'].includes(slug)) {
        category = 'minerals'
      } else if (['choline', 'chondroitin', 'glucosamine', 'inositol', 'lecithin', 'lysine', 'melatonin', 'methionine', 'capigen', 'ceramides', 'chitosan', 'cysteine', 'glycerin', 'glycine', 'linolenic'].some(n => slug.includes(n))) {
        category = 'nutrients'
      }
    }

    // Merge plant and system data (TCM + Western)
    const merged = {
      slug,
      category,
      type: tcmProfile ? 'tcm-herb' : (westernProfile ? 'western-herb' : 'plant'),

      // Plant data
      name: plant.name || {},
      commonName: plant.commonName || {},
      scientificName: plant.scientificName || null,
      family: plant.family || null,
      genus: plant.genus || null,
      species: plant.species || null,
      botanicalDescription: plant.botanicalDescription || {},
      description: plant.description || {},
      geographicalDistribution: plant.geographicalDistribution || {},
      hasPart: plant.hasPart || [],
      containsChemical: plant.containsChemical || [],
      image: plant.image ? `/@herbapedia/data/${plant.image}` : null,

      // TCM profile data
      tcmSlug: tcmProfile?.slug || null,
      pinyin: tcmProfile?.pinyin || null,
      chineseName: tcmProfile?.chineseName || null,
      hasCategory: tcmProfile?.hasCategory || null,
      hasNature: tcmProfile?.hasNature || null,
      hasFlavor: tcmProfile?.hasFlavor || [],
      entersMeridian: tcmProfile?.entersMeridian || [],
      actions: tcmProfile?.actions || [],
      indications: tcmProfile?.indications || [],
      contraindications: tcmProfile?.contraindications || {},
      dosage: tcmProfile?.dosage || {},
      preparation: tcmProfile?.preparation || {},

      // System-scoped content - TCM
      tcmHistory: tcmProfile?.tcmHistory || {},
      tcmTraditionalUsage: tcmProfile?.tcmTraditionalUsage || {},
      tcmModernResearch: tcmProfile?.tcmModernResearch || {},
      tcmFunctions: tcmProfile?.tcmFunctions || {},
      tcmBotanicalSource: tcmProfile?.tcmBotanicalSource || {},
      tcmClassicalReference: tcmProfile?.tcmClassicalReference || {},
      tcmSafetyConsideration: tcmProfile?.tcmSafetyConsideration || {},

      // System-scoped content - Western
      westernSlug: westernProfile?.slug || null,
      hasAction: westernProfile?.hasAction || [],
      hasOrganAffinity: westernProfile?.hasOrganAffinity || [],
      westernHistory: westernProfile?.westernHistory || {},
      westernTraditionalUsage: westernProfile?.westernTraditionalUsage || {},
      westernModernResearch: westernProfile?.westernModernResearch || {},
      westernConstituents: westernProfile?.westernConstituents || {},

      sameAs: [...(plant.sameAs || []), ...(tcmProfile?.sameAs || []), ...(westernProfile?.sameAs || [])],
      source: plant.source || tcmProfile?.source || westernProfile?.source || null
    }

    mergedCache.set(slug, merged)

    // Build category index
    if (!categoryCache.has(category)) {
      categoryCache.set(category, [])
    }
    categoryCache.get(category).push(merged)
  }
}

// Initialize on first use
initializeCaches()

/**
 * Get localized value from language map
 */
function getLocalizedValue(langMap, locale, fallbackLocale = 'en') {
  if (!langMap) return null
  if (typeof langMap === 'string') return langMap
  if (typeof langMap === 'object') {
    // Try exact match first
    if (langMap[locale]) return langMap[locale]
    // Fallback to other variants
    if (locale.startsWith('zh-H') && langMap['zh-Hant']) return langMap['zh-Hant']
    if (locale.startsWith('zh-') && langMap['zh-Hans']) return langMap['zh-Hans']
    if (locale === 'zh-Hant' && langMap['zh-Hans']) return langMap['zh-Hans']
    if (locale === 'zh-Hans' && langMap['zh-Hant']) return langMap['zh-Hant']
    // Fallback to English
    if (langMap[fallbackLocale]) return langMap[fallbackLocale]
    // Return first value
    const keys = Object.keys(langMap)
    if (keys.length > 0) return langMap[keys[0]]
  }
  return null
}

/**
 * Get all herbs
 */
export function useAllHerbs() {
  return computed(() => Array.from(mergedCache.values()))
}

/**
 * Get herbs by category
 * Accepts either a string or a computed ref
 */
export function useHerbsByCategory(category) {
  return computed(() => {
    const cat = typeof category === 'object' && 'value' in category ? category.value : category
    return categoryCache.get(cat) || []
  })
}

/**
 * Get a single herb by slug
 */
export function useHerb(slug) {
  return computed(() => mergedCache.get(slug) || null)
}

/**
 * Get TCM profile for a plant slug
 */
export function useTcmProfile(plantSlug) {
  return computed(() => {
    const tcm = tcmCache.get(plantSlug)
    if (!tcm) return null

    // Find the plant slug from the TCM profile
    const plantRef = tcm.derivedFromPlant?.['@id']
    if (plantRef) {
      const refSlug = plantRef.replace('plant/', '').replace('#root', '').replace('#leaf', '')
      const plant = plantsCache.get(refSlug)
      return {
        ...tcm,
        plant
      }
    }
    return tcm
  })
}

/**
 * Get category statistics
 */
export function useCategoryStats() {
  const stats = {}
  categoryCache.forEach((herbs, category) => {
    stats[category] = herbs.length
  })
  return stats
}

/**
 * Search herbs by name or scientific name
 */
export function useHerbSearch(query) {
  return computed(() => {
    if (!query.value) return []

    const searchTerm = query.value.toLowerCase()
    return Array.from(mergedCache.values()).filter(herb => {
      const name = getLocalizedValue(herb.name, 'en', 'en') || ''
      const scientificName = herb.scientificName || ''
      const pinyin = herb.pinyin || ''

      return name.toLowerCase().includes(searchTerm) ||
        scientificName.toLowerCase().includes(searchTerm) ||
        pinyin.toLowerCase().includes(searchTerm)
    })
  })
}

/**
 * Category labels (localized)
 */
export const categoryLabels = {
  'chinese-herbs': { en: 'Chinese Herbs', 'zh-Hant': '中藥', 'zh-Hans': '中药' },
  'western-herbs': { en: 'Western Herbs', 'zh-Hant': '西方草本', 'zh-Hans': '西方草本' },
  'vitamins': { en: 'Vitamins', 'zh-Hant': '維生素', 'zh-Hans': '维生素' },
  'minerals': { en: 'Minerals', 'zh-Hant': '礦物質', 'zh-Hans': '矿物质' },
  'nutrients': { en: 'Nutrients', 'zh-Hant': '營養素', 'zh-Hans': '营养素' }
}

/**
 * Get all categories with counts
 */
export function useCategories() {
  return computed(() => Object.entries(categoryLabels).map(([slug, title]) => ({
    slug,
    title,
    count: categoryCache.get(slug)?.length || 0
  })))
}

/**
 * Get localized name for a herb
 */
export function useLocalizedHerbName() {
  const { locale } = useI18n()

  return computed(() => (herb) => {
    if (!herb) return null
    return getLocalizedValue(herb.name, locale.value) ||
           getLocalizedValue(herb.name, 'en') ||
           herb.slug
  })
}

/**
 * Composable for localized herb display
 */
export function useHerbLocalizer() {
  const { locale } = useI18n()

  return {
    /**
     * Get localized name
     */
    getName: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.name, locale.value)
    },

    /**
     * Get localized common name
     */
    getCommonName: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.commonName, locale.value)
    },

    /**
     * Get localized description
     */
    getDescription: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.description, locale.value)
    },

    /**
     * Get localized TCM content
     */
    getTcmHistory: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmHistory, locale.value)
    },

    getTcmTraditionalUsage: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmTraditionalUsage, locale.value)
    },

    getTcmModernResearch: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmModernResearch, locale.value)
    },

    getTcmFunctions: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.tcmFunctions, locale.value)
    },

    /**
     * Get localized Western content
     */
    getWesternHistory: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernHistory, locale.value)
    },

    getWesternTraditionalUsage: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernTraditionalUsage, locale.value)
    },

    getWesternModernResearch: (herb) => {
      if (!herb) return null
      return getLocalizedValue(herb.westernModernResearch, locale.value)
    },

    /**
     * Get category label
     */
    getCategoryLabel: (categorySlug) => {
      return getLocalizedValue(categoryLabels[categorySlug], locale.value)
    }
  }
}

/**
 * Get TCM reference data with lookup helpers
 */
export function useTcmReferences() {
  const { locale } = useI18n()

  const meridians = ref([])
  const natures = ref([])
  const flavors = ref([])
  const categories = ref([])

  // Lookup maps for fast access
  const meridianMap = new Map()
  const natureMap = new Map()
  const flavorMap = new Map()
  const categoryMap = new Map()

  // Load reference data
  for (const [path, module] of Object.entries(meridianModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      meridians.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) meridianMap.set(id, item)
      })
    }
  }
  for (const [path, module] of Object.entries(natureModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      natures.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) natureMap.set(id, item)
      })
    }
  }
  for (const [path, module] of Object.entries(flavorModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      flavors.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) flavorMap.set(id, item)
      })
    }
  }
  for (const [path, module] of Object.entries(categoryModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      categories.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) categoryMap.set(id, item)
      })
    }
  }

  /**
   * Get localized label for a reference item
   */
  function getLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  /**
   * Get nature label from @id reference
   */
  function getNatureLabel(natureRef) {
    if (!natureRef) return null
    const id = typeof natureRef === 'object' ? natureRef['@id'] : natureRef
    const item = natureMap.get(id)
    return item ? getLabel(item) : id
  }

  /**
   * Get flavor labels from @id array
   */
  function getFlavorLabels(flavorRefs) {
    if (!flavorRefs || !Array.isArray(flavorRefs)) return []
    return flavorRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = flavorMap.get(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  /**
   * Get meridian labels from @id array
   */
  function getMeridianLabels(meridianRefs) {
    if (!meridianRefs || !Array.isArray(meridianRefs)) return []
    return meridianRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = meridianMap.get(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  /**
   * Get category label from @id reference
   */
  function getCategoryLabel(categoryRef) {
    if (!categoryRef) return null
    const id = typeof categoryRef === 'object' ? categoryRef['@id'] : categoryRef
    const item = categoryMap.get(id)
    return item ? getLabel(item) : id
  }

  return {
    meridians,
    natures,
    flavors,
    categories,
    // Lookup functions
    getNatureLabel,
    getFlavorLabels,
    getMeridianLabels,
    getCategoryLabel
  }
}

/**
 * Get Western herbalism reference data with lookup helpers
 */
export function useWesternReferences() {
  const { locale } = useI18n()

  const actions = ref([])
  const organs = ref([])

  // Lookup maps for fast access
  const actionMap = new Map()
  const organMap = new Map()

  // Load reference data
  for (const [path, module] of Object.entries(westernActionModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      actions.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) actionMap.set(id, item)
      })
    }
  }
  for (const [path, module] of Object.entries(westernOrganModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      organs.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) organMap.set(id, item)
      })
    }
  }

  /**
   * Get localized label for a reference item
   */
  function getLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  /**
   * Get action labels from @id array
   */
  function getActionLabels(actionRefs) {
    if (!actionRefs || !Array.isArray(actionRefs)) return []
    return actionRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = actionMap.get(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  /**
   * Get organ affinity labels from @id array
   */
  function getOrganLabels(organRefs) {
    if (!organRefs || !Array.isArray(organRefs)) return []
    return organRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = organMap.get(id)
      return item ? { id, label: getLabel(item) } : { id, label: id }
    })
  }

  return {
    actions,
    organs,
    // Lookup functions
    getActionLabels,
    getOrganLabels
  }
}

/**
 * Get Chemical Compounds reference data with lookup helpers
 */
export function useChemicalReferences() {
  const { locale } = useI18n()

  const compounds = ref([])

  // Load reference data
  for (const [path, module] of Object.entries(chemicalModules)) {
    const data = module?.default || module
    if (data && data['@graph']) {
      compounds.value = data['@graph']
      data['@graph'].forEach(item => {
        const id = item['@id']
        if (id) chemicalCache.set(id, item)
      })
    }
  }

  /**
   * Get localized label for a compound
   */
  function getLabel(item) {
    if (!item || !item.prefLabel) return null
    return getLocalizedValue(item.prefLabel, locale.value)
  }

  /**
   * Get compound labels from @id array
   */
  function getCompoundLabels(compoundRefs) {
    if (!compoundRefs || !Array.isArray(compoundRefs)) return []
    return compoundRefs.map(ref => {
      const id = typeof ref === 'object' ? ref['@id'] : ref
      const item = chemicalCache.get(id)
      return item ? { id, label: getLabel(item), description: getLocalizedValue(item.description, locale.value) } : { id, label: id, description: null }
    })
  }

  return {
    compounds,
    // Lookup functions
    getCompoundLabels
  }
}

/**
 * Find related herbs based on shared compounds, TCM category, or western actions
 */
export function useRelatedHerbs(currentHerb, limit = 5) {
  const { locale } = useI18n()

  return computed(() => {
    if (!currentHerb) return []

    const relatedHerbs = []
    const currentSlug = currentHerb.slug

    // Get current herb's compound IDs
    const currentCompoundIds = new Set(
      (currentHerb.containsChemical || []).map(c =>
        typeof c === 'object' ? c['@id'] : c
      )
    )

    // Get current herb's TCM category
    const currentCategory = currentHerb.hasCategory
      ? (typeof currentHerb.hasCategory === 'object'
          ? currentHerb.hasCategory['@id']
          : currentHerb.hasCategory)
      : null

    // Get current herb's western action IDs
    const currentActionIds = new Set(
      (currentHerb.hasAction || []).map(a =>
        typeof a === 'object' ? a['@id'] : a
      )
    )

    // Score each herb
    for (const [slug, herb] of mergedCache) {
      if (slug === currentSlug) continue

      let score = 0
      let matchReasons = []

      // Check shared compounds
      const herbCompoundIds = (herb.containsChemical || []).map(c =>
        typeof c === 'object' ? c['@id'] : c
      )
      const sharedCompounds = herbCompoundIds.filter(id => currentCompoundIds.has(id))
      if (sharedCompounds.length > 0) {
        score += sharedCompounds.length * 3
        matchReasons.push({ type: 'compounds', count: sharedCompounds.length })
      }

      // Check TCM category match
      if (currentCategory && herb.hasCategory) {
        const herbCategory = typeof herb.hasCategory === 'object'
          ? herb.hasCategory['@id']
          : herb.hasCategory
        if (herbCategory === currentCategory) {
          score += 2
          matchReasons.push({ type: 'category' })
        }
      }

      // Check shared western actions
      const herbActionIds = (herb.hasAction || []).map(a =>
        typeof a === 'object' ? a['@id'] : a
      )
      const sharedActions = herbActionIds.filter(id => currentActionIds.has(id))
      if (sharedActions.length > 0) {
        score += sharedActions.length
        matchReasons.push({ type: 'actions', count: sharedActions.length })
      }

      if (score > 0) {
        relatedHerbs.push({
          herb,
          score,
          matchReasons
        })
      }
    }

    // Sort by score (highest first), then by name
    relatedHerbs.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const nameA = getLocalizedValue(a.herb.name, locale.value) || a.herb.slug
      const nameB = getLocalizedValue(b.herb.name, locale.value) || b.herb.slug
      return nameA.localeCompare(nameB)
    })

    return relatedHerbs.slice(0, limit)
  })
}
