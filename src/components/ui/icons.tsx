import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Tradex Design System - Icon Components
 * Based on Figma: https://www.figma.com/design/bIuxiR3Mqy0PfLkxIQv4Oa
 *
 * Size: 24x24 (default)
 * All icons accept className for color customization via text-* classes
 */

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string
}

const iconDefaults: React.SVGAttributes<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
}

// Arrow Icons
export function IconArrowDown({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconArrowUp({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M17 14L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconArrowLeft({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M14 7L9 12L14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconArrowRight({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M10 7L15 12L10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Action Icons
export function IconClose({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconCloseFill({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1"/>
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconSearch({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 20L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconMenu({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconEdit({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconDownload({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconUpload({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconFilter({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconSetting({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Navigation Icons
export function IconHome({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconInbox({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconBarChart({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M12 20V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 20V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconMonitor({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 21H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 17V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconTarget({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconDollar({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M12 1V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Visibility Icons
export function IconVisibility({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconVisibilityOff({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.0789 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18488 10.8539C9.34884 10.4859 9.58525 10.1547 9.88 9.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Status Icons
export function IconCheckCircle({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconAlert({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.64149 19.6871 1.81442 19.9905C1.98735 20.2939 2.23672 20.5468 2.53773 20.7239C2.83875 20.901 3.18094 20.9962 3.53 21H20.47C20.8191 20.9962 21.1612 20.901 21.4623 20.7239C21.7633 20.5468 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 9V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 17H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconInfo({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconXCircle({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15 9L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 9L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Communication Icons
export function IconMic({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M12 1C11.2044 1 10.4413 1.31607 9.87868 1.87868C9.31607 2.44129 9 3.20435 9 4V12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12V4C15 3.20435 14.6839 2.44129 14.1213 1.87868C13.5587 1.31607 12.7956 1 12 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 10V12C19 13.8565 18.2625 15.637 16.9497 16.9497C15.637 18.2625 13.8565 19 12 19C10.1435 19 8.36301 18.2625 7.05025 16.9497C5.7375 15.637 5 13.8565 5 12V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 19V23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 23H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconAttach({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42975 14.0991 2.00647 15.16 2.00647C16.2209 2.00647 17.2394 2.42975 17.99 3.18C18.7403 3.93064 19.1635 4.94909 19.1635 6.01C19.1635 7.07091 18.7403 8.08936 17.99 8.84L9.41 17.41C9.03469 17.7853 8.52561 17.9965 7.995 17.9965C7.46439 17.9965 6.95531 17.7853 6.58 17.41C6.20469 17.0347 5.99353 16.5256 5.99353 15.995C5.99353 15.4644 6.20469 14.9553 6.58 14.58L15.07 6.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Exchange Icons
export function IconBinance({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M12 2L7.5 6.5L9.27 8.27L12 5.54L14.73 8.27L16.5 6.5L12 2Z" fill="currentColor"/>
      <path d="M18.5 10.5L16.73 12.27L18.5 14.04L20.27 12.27L18.5 10.5Z" fill="currentColor"/>
      <path d="M12 18.46L9.27 15.73L7.5 17.5L12 22L16.5 17.5L14.73 15.73L12 18.46Z" fill="currentColor"/>
      <path d="M5.5 10.5L3.73 12.27L5.5 14.04L7.27 12.27L5.5 10.5Z" fill="currentColor"/>
      <path d="M12 9.77L9.77 12L12 14.23L14.23 12L12 9.77Z" fill="currentColor"/>
    </svg>
  )
}

export function IconBybit({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M4 6H8L12 18H8L4 6Z" fill="currentColor"/>
      <path d="M12 6H16L20 18H16L12 6Z" fill="currentColor"/>
    </svg>
  )
}

// Misc Icons
export function IconCopy({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconPin({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconZap({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconIdea({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M9 18H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 22H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.09 14C15.7253 13.3753 16.2096 12.6152 16.5069 11.7764C16.8043 10.9376 16.907 10.0422 16.8066 9.15742C16.7062 8.27267 16.4056 7.42276 15.9288 6.67186C15.4519 5.92095 14.8116 5.28867 14.055 4.82282C13.2984 4.35696 12.4451 4.06993 11.5594 3.98363C10.6736 3.89734 9.77997 4.01427 8.94536 4.32494C8.11076 4.63562 7.35732 5.13179 6.74243 5.77646C6.12754 6.42113 5.66813 7.19698 5.4 8.05C5.00224 9.33177 5.00458 10.7045 5.4066 11.985C5.80862 13.2655 6.59177 14.3924 7.65 15.22L8.1 15.59C8.35292 15.8091 8.55613 16.0798 8.69635 16.3841C8.83657 16.6884 8.91059 17.0197 8.91355 17.3556C8.91651 17.6914 8.84835 18.024 8.71353 18.3307C8.57871 18.6375 8.38024 18.9118 8.13099 19.1356C7.88175 19.3594 7.58732 19.5277 7.26765 19.6292C6.94798 19.7306 6.61024 19.7627 6.27701 19.7233C5.94378 19.6839 5.62251 19.5739 5.33485 19.4004C5.04719 19.2269 4.79981 18.9936 4.61 18.7168L4.27 18.2168C3.20813 16.7348 2.59219 14.9903 2.49145 13.1779C2.39071 11.3655 2.80953 9.56224 3.70088 7.97078C4.59223 6.37931 5.91913 5.0656 7.52 4.18C9.12088 3.29441 10.9324 2.88916 12.7462 3.00824C14.5601 3.12733 16.3 3.7655 17.77 4.84954C19.24 5.93358 20.3784 7.41759 21.0505 9.1264C21.7225 10.8352 21.9001 12.697 21.5629 14.5003C21.2257 16.3036 20.3878 17.9729 19.15 19.32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconDoubleChevron({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M13 17L18 12L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 17L11 12L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconPlus({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconMinus({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconCheck({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconRefresh({ size = 24, className, ...props }: IconProps) {
  return (
    <svg {...iconDefaults} width={size} height={size} className={cn("text-current", className)} {...props}>
      <path d="M1 4V10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 20V14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.49 9C19.9828 7.56678 19.1209 6.28549 17.9845 5.27542C16.8482 4.26535 15.4745 3.55976 13.9917 3.22426C12.5089 2.88875 10.9652 2.93434 9.50481 3.35677C8.04437 3.77921 6.71475 4.56471 5.64 5.64L1 10M23 14L18.36 18.36C17.2853 19.4353 15.9556 20.2208 14.4952 20.6432C13.0348 21.0657 11.4911 21.1112 10.0083 20.7757C8.52547 20.4402 7.1518 19.7347 6.01547 18.7246C4.87913 17.7145 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
