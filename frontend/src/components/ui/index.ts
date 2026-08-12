/**
 * UI Kit — primitivas puras.
 *
 * Ningún componente de esta capa importa de `data/`, `stores/` ni `i18n/`:
 * reciben el texto ya traducido por props. Es lo que permite reutilizarlos
 * en los nueve realms sin arrastrar dependencias.
 */

export { Badge, type BadgeProps, type BadgeTone } from './badge';
export { Band, type BandAspect } from './band';
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from './button';
export { Display, type DisplayLevel, type DisplaySize } from './display';
export { EmptyState } from './empty-state';
export { EditorialBanner, type EditorialBannerAlign, type EditorialBannerProps } from './editorial-banner';
export { EditorialImage, type EditorialImageProps } from './editorial-image';
export {
  EditorialOverlay,
  type EditorialOverlayDirection,
  type EditorialOverlayProps,
  type EditorialTone,
} from './editorial-overlay';
export {
  FullBleedSection,
  type FullBleedSectionProps,
} from './full-bleed-section';
export { Equalizer, type EqualizerScale } from './equalizer';
export { ErrorState, type ErrorTone } from './error-state';
export { Field } from './field';
export { FrequencyDisc, type DiscSize } from './frequency-disc';
export {
  GlassPanel,
  type GlassPanelProps,
  type GlassPanelRadius,
  type GlassPanelTag,
} from './glass-panel';
export { GradientText } from './gradient-text';
export { IconButton, type IconButtonProps, type IconButtonSize } from './icon-button';
export { Input, type InputProps } from './input';
export { Kicker, type KickerSpacing, type KickerTone } from './kicker';
export { LoadingOrb, type OrbTone } from './loading-orb';
export { Magnetic } from './magnetic';
export { MediaSkeleton, type MediaSkeletonProps } from './media-skeleton';
export { Pill, type PillProps } from './pill';
export { ProgressBar, type ProgressBarHeight } from './progress-bar';
export { Prose, type ProseMaxWidth, type ProseSize } from './prose';
export { SectionHeading, type SectionHeadingAlign } from './section-heading';
export { SegmentedControl } from './segmented-control';
export { Skeleton, type SkeletonVariant } from './skeleton';
export { Stat, type StatSize, type StatTone } from './stat';
export { StepProgress, type StepProgressProps } from './step-progress';
export { Textarea, type TextareaProps, type TextareaVariant } from './textarea';
