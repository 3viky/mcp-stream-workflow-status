/**
 * @transftw/lilith-ui
 *
 * Unified theme-agnostic UI component library.
 * Components automatically adapt to luxe or cyberpunk themes via semantic tokens.
 */

import "./styled.d.ts"

// Primitives
export { Button, Badge, Input, Textarea, Card, FormField, Select, Alert, Spinner, Avatar, Checkbox, StatusBadge } from './components/primitives'
export type { ButtonProps, BadgeProps, InputProps, TextareaProps, CardProps, FormFieldProps, SelectProps, SelectOption, AlertProps, SpinnerProps, AvatarProps, CheckboxProps, StatusBadgeProps, BadgeVariant } from './components/primitives'

// Layout
export { Container, Section, Grid, Stack, Spacer, ButtonGroup } from './components/layout'
export type { ContainerProps, SectionProps, GridProps, StackProps, SpacerProps, ButtonGroupProps } from './components/layout'

// Typography
export { Heading, Text } from './components/typography'
export type { HeadingProps, TextProps } from './components/typography'

// Navigation
export { Navigation, AnnouncementBar } from './components/navigation'
export type { NavigationProps, NavigationItem, AnnouncementBarProps } from './components/navigation'

// Feedback
export {
  Modal,
  ModalActions,
  PromptDialog,
  PromptDialogProvider,
  PromptDialogContext,
  usePromptDialog,
  ToastProvider,
  useToast,
  Dropdown,
  DropdownItem,
  Tooltip,
  Tabs,
  Popover
} from './components/feedback'
export type {
  ModalProps,
  ModalActionsProps,
  PromptDialogProps,
  PromptOptions,
  PromptDialogContextType,
  Toast,
  ToastType,
  DropdownProps,
  TooltipProps,
  TabsProps,
  Tab,
  PopoverProps
} from './components/feedback'

// Data
export { DataTable, StickyDataTable, Pagination, Gallery, Sparkline } from './components/data'
export type { DataTableProps, Column, StickyDataTableProps, StickyColumn, ColumnGroup, SortFn, PaginationProps, GalleryProps, GalleryImage, SparklineProps } from './components/data'

// Animated
export { FadeIn, ParallaxSection } from './components/animated'
export type { FadeInProps, ParallaxSectionProps } from './components/animated'

// Hooks
export { useScrollTrigger, useParallax, useSmoothScroll, useRanking, useRankingMock, useAnalytics, useAnalyticsMock } from './hooks'
export type { UseScrollTriggerOptions, UseParallaxOptions, UseSmoothScrollOptions, UseRankingOptions, UseRankingResult, UseAnalyticsOptions, UseAnalyticsResult, ListingPerformance, RankingInsights, ReviewInsights, ClientDashboard } from './hooks'

// Admin
export {
  UserManagementTable,
  AlertBadge,
  BulkActionToolbar,
  ConfirmDialog,
  RoleEditor,
  SystemHealthIndicator,
  AdvancedSearch,
  ModerationQueue,
  AuditLogViewer
} from './components/admin'
export type {
  User,
  UserManagementTableProps,
  AlertBadgeProps,
  BulkAction,
  BulkActionToolbarProps,
  ConfirmDialogProps,
  Permission,
  Role,
  RoleEditorProps,
  ServiceStatus,
  ResourceMetric,
  SystemHealthIndicatorProps,
  SearchField,
  SearchFilter,
  SavedSearch,
  AdvancedSearchProps,
  ModerationItem,
  ModerationQueueProps,
  AuditLogEntry,
  AuditLogViewerProps
} from './components/admin'

// Analytics
export {
  MetricCard,
  TrendIndicator,
  DateRangePicker,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  HeatMap,
  FunnelChart,
  LeaderboardTable,
  RealtimeMetric,
  DashboardLayout,
  DashboardWidget,
} from './components/analytics'
export type {
  MetricCardProps,
  TrendIndicatorProps,
  DateRange,
  DateRangePickerProps,
  DataPoint,
  LineChartProps,
  BarDataPoint,
  BarChartProps,
  PieDataPoint,
  PieChartProps,
  AreaDataPoint,
  AreaChartProps,
  HeatMapCell,
  HeatMapProps,
  FunnelStage,
  FunnelChartProps,
  LeaderboardEntry,
  LeaderboardTableProps,
  RealtimeMetricProps,
  DashboardLayoutProps,
  DashboardWidgetProps,
} from './components/analytics'

// Creator
export {
  MediaUpload,
  TagInput,
  RichTextEditor,
  MarkdownEditor,
  ContentPreview,
  CodeEditor,
  FileManager,
  ImageCropper,
  VideoPlayer,
  AudioPlayer,
  SchedulePicker,
  DraftAutosave
} from './components/creator'
export type {
  UploadedFile,
  MediaUploadProps,
  TagInputProps,
  RichTextEditorProps,
  MarkdownEditorProps,
  ContentPreviewProps,
  CodeEditorProps,
  FileItem,
  FileManagerProps,
  ImageCropperProps,
  VideoPlayerProps,
  AudioPlayerProps,
  SchedulePreset,
  SchedulePickerProps,
  DraftAutosaveProps
} from './components/creator'

// Forms
export {
  MultiStepForm,
  DatePicker,
  RangeSlider,
  ColorPicker,
  PhoneInput,
  StepIndicator,
  DynamicFieldArray,
  AddressInput,
  SearchableMultiSelect
} from './components/forms'
export type {
  FormStep,
  MultiStepFormProps,
  DatePickerProps,
  RangeSliderProps,
  ColorPickerProps,
  PhoneInputProps,
  StepIndicatorProps,
  DynamicFieldArrayProps,
  AddressInputProps,
  Address,
  SearchableMultiSelectProps,
  SearchableSelectOption
} from './components/forms'

// Realtime
export {
  NotificationCenter,
  LiveIndicator,
  ActivityIndicator,
  PresenceAvatar,
  TypingIndicator,
  RealtimeCounter
} from './components/realtime'
export type {
  Notification,
  NotificationCenterProps,
  LiveIndicatorProps,
  ActivityIndicatorProps,
  PresenceAvatarProps,
  TypingIndicatorProps,
  RealtimeCounterProps
} from './components/realtime'

// Utilities
export {
  formatNumber,
  formatCompactNumber,
  formatValue,
  formatDate,
  formatDateTime,
  formatRelativeTime
} from './utils/formatters'
export type { NumberFormat, FormatOptions } from './utils/formatters'

export {
  calculateChartDimensions,
  calculateScale,
  createLinearScale,
  generateTicks,
  generateLinePath,
  generateAreaPath,
  calculateSparklinePoints
} from './utils/chart'
export type { ChartDimensions, ScaleConfig } from './utils/chart'

export {
  sortByProperty,
  sortByComparator,
  sortByFn,
  reverse,
  combineSort
} from './utils/sorting'

// Ranking
export {
  RankingBreakdown,
  RankingTipCard,
  RankingDashboard,
  RankingBadge,
  getRankingBadges
} from './components/ranking'
export type {
  RankingBreakdownProps,
  RankingFactor,
  RankingTipCardProps,
  RankingTip,
  TipPriority,
  RankingDashboardProps,
  RankingExplanation,
  RankingBadgeProps,
  BadgeType
} from './components/ranking'

// Payment
export {
  SegpayPaymentForm,
  ThreeDSecureModal,
  CryptoPaymentWidget
} from './components/payment'
export type {
  SegpayPaymentFormProps,
  PaymentResult,
  PaymentError,
  ThreeDSecureModalProps,
  CryptoPaymentWidgetProps,
  CryptoCurrency,
  CryptoPaymentStatus
} from './components/payment'
