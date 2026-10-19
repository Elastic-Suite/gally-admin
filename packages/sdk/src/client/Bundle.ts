/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2024-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

// Names of the optional Gally bundles, as returned by the `extraBundles` query.
// Keep in sync with the Bundle enum in gally-admin-shared.
export enum Bundle {
  VIRTUAL_CATEGORY = 'GallyVirtualCategoryBundle',
  BOOST = 'GallyBoostBundle',
  THESAURUS = 'GallyThesaurusBundle',
  VECTOR_SEARCH = 'GallyVectorSearchBundle',
  SEARCH_USAGE = 'GallySearchUsageBundle',
  TERM_SUGGESTION = 'GallyTermSuggestionBundle',
}
