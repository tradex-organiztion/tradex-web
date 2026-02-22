'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores'
import { useAuthStore } from '@/stores/useAuthStore'
import { useState, useRef, useEffect } from 'react'

// 아이콘 컴포넌트들 (Figma에서 추출한 SVG)
function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.50049 9.0664C9.50049 8.87162 9.50036 8.75531 9.49333 8.66926C9.48677 8.58922 9.47669 8.58022 9.48226 8.59114C9.46628 8.55978 9.4407 8.5342 9.40934 8.51822C9.42026 8.52379 9.41126 8.51371 9.33122 8.50715C9.24517 8.50012 9.12886 8.49999 8.93408 8.49999H7.06689C6.87212 8.49999 6.7558 8.50012 6.66976 8.50715C6.58972 8.51371 6.58071 8.52379 6.59163 8.51822C6.56027 8.5342 6.53469 8.55978 6.51872 8.59114C6.52428 8.58022 6.5142 8.58922 6.50765 8.66926C6.50062 8.75531 6.50049 8.87162 6.50049 9.0664V13.5H9.50049V9.0664ZM13.8338 11.8665C13.8338 12.2316 13.8345 12.5358 13.8143 12.7832C13.7936 13.0364 13.7484 13.2739 13.6339 13.4987C13.4582 13.8437 13.1775 14.1244 12.8325 14.3001C12.6078 14.4146 12.3702 14.4598 12.117 14.4805C11.8696 14.5007 11.5655 14.5 11.2004 14.5H4.80062C4.4355 14.5 4.13137 14.5007 3.88395 14.4805C3.6308 14.4598 3.39322 14.4146 3.16845 14.3001C2.82349 14.1244 2.54279 13.8437 2.36702 13.4987C2.25255 13.2739 2.20737 13.0364 2.18668 12.7832C2.16647 12.5358 2.16715 12.2316 2.16715 11.8665V6.33268L1.63395 6.73307C1.41311 6.8987 1.09981 6.85419 0.93408 6.63346C0.768447 6.41261 0.812956 6.09931 1.03369 5.93359L7.06038 1.4134C7.25429 1.26797 7.46007 1.10251 7.70361 1.0384C7.89822 0.987198 8.10276 0.987199 8.29736 1.0384C8.5409 1.10251 8.74668 1.26797 8.94059 1.4134L14.9673 5.93359C15.188 6.09931 15.2325 6.41261 15.0669 6.63346C14.9012 6.85419 14.5879 6.8987 14.367 6.73307L13.8338 6.33268V11.8665ZM10.5005 13.5H11.2004C11.582 13.5 11.8384 13.4998 12.0356 13.4837C12.227 13.4681 12.3184 13.4396 12.3787 13.4088C12.5355 13.329 12.6628 13.2017 12.7427 13.0449C12.7734 12.9846 12.8019 12.8931 12.8175 12.7018C12.8337 12.5046 12.8338 12.2481 12.8338 11.8665V5.58268L8.9803 2.69335L8.67106 2.46353C8.41709 2.27927 8.31362 2.22058 8.21273 2.194C8.07367 2.1574 7.9273 2.1574 7.78825 2.194C7.65373 2.22943 7.51511 2.32252 7.02067 2.69335L3.16715 5.58268V11.8665C3.16715 12.2481 3.16731 12.5046 3.18343 12.7018C3.19907 12.8932 3.22754 12.9846 3.2583 13.0449C3.33818 13.2017 3.46549 13.329 3.62223 13.4088C3.68259 13.4396 3.774 13.4681 3.96533 13.4837C4.16258 13.4998 4.419 13.5 4.80062 13.5H5.50049V9.0664C5.50049 8.88807 5.50043 8.72407 5.51155 8.58788C5.52317 8.44585 5.54925 8.29017 5.62744 8.13671C5.73927 7.91731 5.9178 7.73878 6.13721 7.62695C6.29066 7.54876 6.44635 7.52268 6.58838 7.51106C6.72456 7.49993 6.88856 7.49999 7.06689 7.49999H8.93408C9.11241 7.49999 9.27641 7.49993 9.4126 7.51106C9.55463 7.52268 9.71031 7.54875 9.86377 7.62695C10.0832 7.73878 10.2617 7.91731 10.3735 8.13671C10.4517 8.29019 10.4785 8.44584 10.4901 8.58788C10.5012 8.72407 10.5005 8.88807 10.5005 9.0664V13.5Z" fill="currentColor"/>
    </svg>
  )
}

function IconAI({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.66732 14.1666C9.94346 14.1666 10.1673 14.3904 10.1673 14.6666C10.1673 14.9427 9.94346 15.1666 9.66732 15.1666H6.33398C6.05784 15.1666 5.83398 14.9427 5.83398 14.6666C5.83398 14.3904 6.05784 14.1666 6.33398 14.1666H9.66732ZM12.1673 5.99992C12.1673 3.69873 10.3018 1.83325 8.00065 1.83325C5.69946 1.83325 3.83398 3.69873 3.83398 5.99992C3.83398 7.66131 4.80663 9.09626 6.21549 9.76554C6.38974 9.84837 6.5006 10.0244 6.50065 10.2174V10.6666C6.50065 10.9839 6.50113 11.1969 6.51237 11.3619C6.52332 11.5224 6.5425 11.6008 6.5638 11.6523C6.64838 11.8565 6.81078 12.0189 7.01497 12.1034C7.06641 12.1247 7.14486 12.1439 7.30534 12.1549C7.47029 12.1661 7.6833 12.1666 8.00065 12.1666C8.31801 12.1666 8.53101 12.1661 8.69596 12.1549C8.85644 12.1439 8.93489 12.1247 8.98633 12.1034C9.19052 12.0189 9.35292 11.8565 9.4375 11.6523C9.4588 11.6008 9.47798 11.5224 9.48893 11.3619C9.50018 11.1969 9.50065 10.9839 9.50065 10.6666V10.2174C9.5007 10.0244 9.61156 9.84837 9.78581 9.76554C11.1947 9.09626 12.1673 7.66131 12.1673 5.99992ZM13.1673 5.99992C13.1673 7.94708 12.0897 9.64098 10.5007 10.5214V10.6666C10.5007 10.9704 10.5011 11.2233 10.487 11.4303C10.4726 11.6416 10.4415 11.8415 10.3613 12.0351C10.1753 12.4842 9.81826 12.8412 9.36914 13.0273C9.17557 13.1074 8.97569 13.1385 8.76432 13.1529C8.55741 13.167 8.30444 13.1666 8.00065 13.1666C7.69686 13.1666 7.44389 13.167 7.23698 13.1529C7.02561 13.1385 6.82573 13.1074 6.63216 13.0273C6.18304 12.8412 5.82604 12.4842 5.63997 12.0351C5.5598 11.8415 5.52875 11.6416 5.51432 11.4303C5.50021 11.2233 5.50065 10.9704 5.50065 10.6666V10.5214C3.91157 9.64098 2.83398 7.94708 2.83398 5.99992C2.83398 3.14645 5.14718 0.833252 8.00065 0.833252C10.8541 0.833252 13.1673 3.14645 13.1673 5.99992Z" fill="currentColor"/>
    </svg>
  )
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 11.8665V2C1.5 1.72386 1.72386 1.5 2 1.5C2.27615 1.5 2.5 1.72386 2.5 2V11.8665C2.5 12.2482 2.50016 12.5046 2.51628 12.7018C2.53192 12.8932 2.56039 12.9846 2.59115 13.0449C2.67103 13.2017 2.79834 13.329 2.95508 13.4089C3.01544 13.4396 3.10685 13.4681 3.29818 13.4837C3.49543 13.4998 3.75185 13.5 4.13347 13.5H14C14.2761 13.5 14.5 13.7239 14.5 14C14.5 14.2761 14.2761 14.5 14 14.5H4.13347C3.76835 14.5 3.46422 14.5007 3.2168 14.4805C2.96364 14.4598 2.72607 14.4146 2.5013 14.3001C2.15634 14.1244 1.87564 13.8437 1.69987 13.4987C1.5854 13.2739 1.54022 13.0364 1.51953 12.7832C1.49932 12.5358 1.5 12.2317 1.5 11.8665ZM4.16667 11.6667V9.66667C4.16667 9.39052 4.39053 9.16667 4.66667 9.16667C4.94281 9.16667 5.16667 9.39052 5.16667 9.66667V11.6667C5.16667 11.9428 4.94281 12.1667 4.66667 12.1667C4.39053 12.1667 4.16667 11.9428 4.16667 11.6667ZM7.16667 11.6667V7.66667C7.16667 7.39052 7.39053 7.16667 7.66667 7.16667C7.94281 7.16667 8.16667 7.39052 8.16667 7.66667V11.6667C8.16667 11.9428 7.94281 12.1667 7.66667 12.1667C7.39053 12.1667 7.16667 11.9428 7.16667 11.6667ZM10.1667 11.6667V5.66667C10.1667 5.39052 10.3905 5.16667 10.6667 5.16667C10.9428 5.16667 11.1667 5.39052 11.1667 5.66667V11.6667C11.1667 11.9428 10.9428 12.1667 10.6667 12.1667C10.3905 12.1667 10.1667 11.9428 10.1667 11.6667ZM13.1667 11.6667V3.66667C13.1667 3.39052 13.3905 3.16667 13.6667 3.16667C13.9428 3.16667 14.1667 3.39052 14.1667 3.66667V11.6667C14.1667 11.9428 13.9428 12.1667 13.6667 12.1667C13.3905 12.1667 13.1667 11.9428 13.1667 11.6667Z" fill="currentColor"/>
    </svg>
  )
}

function IconJournal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.00098 1.33301C9.14232 1.33301 9.27793 1.38938 9.37793 1.48926L13.1777 5.29004C13.2776 5.39003 13.334 5.52567 13.334 5.66699V13.4668C13.334 14.1295 12.7965 14.667 12.1338 14.667H3.86719C3.20466 14.6667 2.66797 14.1294 2.66797 13.4668V2.5332C2.66804 1.87067 3.2047 1.33325 3.86719 1.33301H9.00098ZM3.86719 2.40039C3.7938 2.40064 3.73445 2.45978 3.73438 2.5332V13.4668C3.73438 13.5403 3.79376 13.6003 3.86719 13.6006H12.1338C12.2074 13.6006 12.2676 13.5404 12.2676 13.4668V6.2002H9.66797C9.00523 6.2002 8.46777 5.66274 8.46777 5V2.40039H3.86719ZM9.96094 7.03223C10.1271 6.78913 10.459 6.72665 10.7021 6.89258C10.9453 7.05872 11.0078 7.39061 10.8418 7.63379L8.1084 11.6338C8.01887 11.7648 7.87577 11.8495 7.71777 11.8643C7.55978 11.879 7.40326 11.8221 7.29102 11.71L5.62305 10.0439C5.41481 9.83572 5.41487 9.49737 5.62305 9.28906C5.83127 9.08086 6.16963 9.0809 6.37793 9.28906L7.59082 10.502L9.96094 7.03223ZM9.53418 5C9.53418 5.07364 9.59433 5.13379 9.66797 5.13379H11.5127L9.53418 3.1543V5Z" fill="currentColor"/>
    </svg>
  )
}

function IconStrategy({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_target)">
        <path d="M0.833984 7.99992C0.833984 4.04188 4.04261 0.833252 8.00065 0.833252C8.27679 0.833252 8.50065 1.05711 8.50065 1.33325C8.50065 1.60939 8.27679 1.83325 8.00065 1.83325C4.59489 1.83325 1.83398 4.59416 1.83398 7.99992C1.83398 11.4057 4.59489 14.1666 8.00065 14.1666C11.4064 14.1666 14.1673 11.4057 14.1673 7.99992C14.1673 7.72378 14.3912 7.49992 14.6673 7.49992C14.9435 7.49992 15.1673 7.72378 15.1673 7.99992C15.1673 11.958 11.9587 15.1666 8.00065 15.1666C4.04261 15.1666 0.833984 11.958 0.833984 7.99992ZM4.16732 7.99992C4.16732 5.88283 5.88356 4.16658 8.00065 4.16658C8.27679 4.16658 8.50065 4.39044 8.50065 4.66658C8.50065 4.94273 8.27679 5.16658 8.00065 5.16658C6.43584 5.16658 5.16732 6.43511 5.16732 7.99992C5.16732 9.56472 6.43584 10.8333 8.00065 10.8333C9.56546 10.8333 10.834 9.56472 10.834 7.99992C10.834 7.72378 11.0578 7.49992 11.334 7.49992C11.6101 7.49992 11.834 7.72378 11.834 7.99992C11.834 10.117 10.1177 11.8333 8.00065 11.8333C5.88356 11.8333 4.16732 10.117 4.16732 7.99992ZM12.7474 0.839762C12.906 0.865513 13.0427 0.966198 13.1146 1.10994L13.7064 2.29354L14.8906 2.88599C15.0344 2.95786 15.1351 3.09453 15.1608 3.25317C15.1865 3.41181 15.1345 3.57312 15.0208 3.68677L13.0208 5.68677C12.9271 5.78053 12.7999 5.83324 12.6673 5.83325H10.8743L8.35417 8.35343C8.15891 8.54868 7.8424 8.54867 7.64713 8.35343C7.45188 8.15817 7.45188 7.84166 7.64713 7.6464L10.1673 5.12622V3.33325C10.1673 3.20064 10.22 3.0735 10.3138 2.97974L12.3138 0.979736L12.3587 0.940023C12.4679 0.854344 12.6086 0.817245 12.7474 0.839762ZM11.1673 3.54028V4.83325H12.4603L13.8229 3.46997L13.11 3.11385C13.0134 3.06546 12.9351 2.98658 12.8867 2.88989L12.5299 2.177L11.1673 3.54028Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip_target">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

function IconRisk({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.2833 1.01298C8.42541 0.842598 8.66309 0.786605 8.86663 0.87496C9.07 0.963398 9.19094 1.17506 9.1635 1.39514L8.56715 6.16663H12.8621C13.0336 6.16663 13.1968 6.16593 13.3269 6.17769C13.4467 6.18854 13.6446 6.21587 13.8126 6.35152C14.0117 6.51246 14.1263 6.7563 14.1225 7.01233C14.1192 7.22835 14.0132 7.39766 13.9448 7.4967C13.8705 7.60427 13.7656 7.72945 13.6557 7.86129L7.71819 14.9869C7.57609 15.1574 7.33843 15.2133 7.13486 15.125C6.93138 15.0366 6.81053 14.8249 6.83798 14.6048L7.43434 9.83329H3.13942C2.96776 9.83329 2.80414 9.83401 2.67392 9.82222C2.55403 9.81136 2.35621 9.78413 2.18824 9.6484C1.98912 9.48746 1.8752 9.24359 1.879 8.98759L1.88486 8.90881C1.90813 8.73041 1.99621 8.58992 2.05608 8.50321C2.13039 8.39563 2.23591 8.2705 2.3458 8.13863L8.2833 1.01298ZM3.11402 8.7786C3.09812 8.79769 3.08263 8.81558 3.06845 8.83264C3.09075 8.83267 3.11442 8.83329 3.13942 8.83329H8.00074C8.14412 8.83332 8.28085 8.89507 8.37574 9.00256C8.47048 9.11001 8.51456 9.25299 8.49684 9.39514L8.04111 13.0358L12.8875 7.22131C12.9034 7.20217 12.9182 7.18373 12.9324 7.16663H8.00074C7.85733 7.16663 7.72066 7.10487 7.62574 6.99735C7.53094 6.88989 7.48692 6.74698 7.50465 6.60478L7.95973 2.9635L3.11402 8.7786Z" fill="currentColor"/>
    </svg>
  )
}

function IconProfit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_dollar)">
        <path d="M14.1673 7.99992C14.1673 4.59416 11.4064 1.83325 8.00065 1.83325C4.59489 1.83325 1.83398 4.59416 1.83398 7.99992C1.83398 11.4057 4.59489 14.1666 8.00065 14.1666C11.4064 14.1666 14.1673 11.4057 14.1673 7.99992ZM9.83398 6.22192C9.83387 5.63913 9.36144 5.1667 8.77865 5.16658H7.33398C6.68965 5.16658 6.16732 5.68892 6.16732 6.33325C6.16732 6.97758 6.68965 7.49992 7.33398 7.49992H8.66732C9.86393 7.49992 10.834 8.46997 10.834 9.66658C10.834 10.8632 9.86393 11.8333 8.66732 11.8333H8.50065V12.3333C8.50065 12.6094 8.27679 12.8333 8.00065 12.8333C7.72451 12.8333 7.50065 12.6094 7.50065 12.3333V11.8333H7.22266C6.08758 11.8331 5.16743 10.913 5.16732 9.77791C5.16732 9.50177 5.39118 9.27791 5.66732 9.27791C5.94346 9.27791 6.16732 9.50177 6.16732 9.77791C6.16743 10.3607 6.63986 10.8331 7.22266 10.8333H8.66732C9.31165 10.8333 9.83398 10.3109 9.83398 9.66658C9.83398 9.02225 9.31165 8.49992 8.66732 8.49992H7.33398C6.13737 8.49992 5.16732 7.52987 5.16732 6.33325C5.16732 5.13663 6.13737 4.16658 7.33398 4.16658H7.50065V3.66659C7.50065 3.39044 7.72451 3.16659 8.00065 3.16659C8.27679 3.16659 8.50065 3.39044 8.50065 3.66659V4.16658H8.77865C9.91372 4.1667 10.8339 5.08684 10.834 6.22192C10.834 6.49807 10.6101 6.72192 10.334 6.72192C10.0578 6.72192 9.83398 6.49807 9.83398 6.22192ZM15.1673 7.99992C15.1673 11.958 11.9587 15.1666 8.00065 15.1666C4.04261 15.1666 0.833984 11.958 0.833984 7.99992C0.833984 4.04188 4.04261 0.833252 8.00065 0.833252C11.9587 0.833252 15.1673 4.04188 15.1673 7.99992Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip_dollar">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { label: '홈', href: '/home', icon: IconHome },
      { label: 'Tradex AI', href: '/ai', icon: IconAI },
    ],
  },
  {
    title: 'Chart',
    items: [
      { label: '차트 분석', href: '/chart', icon: IconChart },
    ],
  },
  {
    title: 'Trading Log',
    items: [
      { label: '매매일지 관리', href: '/trading/journal', icon: IconJournal },
    ],
  },
  {
    title: 'Trading Analysis',
    items: [
      { label: '전략 분석', href: '/analysis/strategy', icon: IconStrategy },
      { label: '리스크 패턴', href: '/analysis/risk', icon: IconRisk },
      { label: '수익 관리', href: '/portfolio/assets', icon: IconProfit },
    ],
  },
]

// 프로필 호버 드롭다운 컴포넌트
function ProfileDropdown({
  user,
  onLogout,
  onOpenSettings,
}: {
  user: { username?: string; profileImageUrl?: string | null } | null
  onLogout: () => void
  onOpenSettings: (tab: 'account' | 'general' | 'notification') => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Profile Trigger */}
      <button className="flex w-full items-center gap-3 rounded-lg px-0 py-1 text-left transition-colors hover:bg-gray-50">
        <div className="flex size-7 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          {user?.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt={user.username || 'User'}
              width={28}
              height={28}
              className="size-full object-cover"
            />
          ) : (
            <svg className="size-4 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2.5 14C2.5 11.5147 4.96243 9.5 8 9.5C11.0376 9.5 13.5 11.5147 13.5 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
        <span className="text-body-2-bold text-label-normal">
          {user?.username || 'User'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[160px] rounded-lg border border-line-normal bg-white py-1 shadow-emphasize">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-body-2-medium text-label-normal transition-colors hover:bg-gray-50"
            onClick={() => {
              setIsOpen(false)
              onOpenSettings('account')
            }}
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 14C2 11.7909 4.68629 10 8 10C11.3137 10 14 11.7909 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            계정 설정
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-body-2-medium text-label-normal transition-colors hover:bg-gray-50"
            onClick={() => {
              setIsOpen(false)
              onOpenSettings('notification')
            }}
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5.33333C12 4.27247 11.5786 3.25505 10.8284 2.50491C10.0783 1.75476 9.06087 1.33333 8 1.33333C6.93913 1.33333 5.92172 1.75476 5.17157 2.50491C4.42143 3.25505 4 4.27247 4 5.33333C4 10 2 11.3333 2 11.3333H14C14 11.3333 12 10 12 5.33333Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.15333 13.3333C8.97268 13.6451 8.71003 13.9027 8.39434 14.0773C8.07865 14.2519 7.72165 14.3371 7.36133 14.3238C7.00101 14.3105 6.65134 14.1993 6.34914 14.0023C6.04695 13.8052 5.80351 13.5296 5.64533 13.2053" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            알림 설정
          </button>
          <div className="my-1 border-t border-line-normal" />
          <button
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-body-2-medium text-label-danger transition-colors hover:bg-gray-50"
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isSidebarCollapsed, setSidebarCollapsed, openSettings, isMobile, setIsMobile } = useUIStore()
  const { user, isDemoMode, logout } = useAuthStore()

  // 화면 크기 감지 및 모바일 모드 설정
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile, setSidebarCollapsed])

  const handleLoginClick = () => {
    logout() // 데모 모드 해제 및 상태 초기화
    router.push('/login')
  }

  const isActive = (href: string) => {
    const hasHash = href.includes('#')
    const basePath = href.split('#')[0]

    if (hasHash) return false
    if (basePath === '/home') return pathname === '/home'
    if (basePath === '/ai') return pathname === '/ai' || pathname.startsWith('/ai/')
    return pathname === basePath || pathname.startsWith(basePath + '/')
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && !isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/30"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-[200px] flex-col bg-white',
          'border-r border-gray-300/60',
          isMobile && (isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'),
          isMobile && 'transition-transform duration-300'
        )}
      >
        {/* Header: Logo - Figma: V mark + "Tradex" + collapse toggle */}
        <div className="flex items-center justify-between px-5" style={{ height: '48px' }}>
          <Link href="/home" className="flex items-center gap-2">
            <svg width="20" height="16" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.626 0.00586C14.707 0.00609 14.76 0.09261 14.726 0.16797L12.779 4.39551C12.761 4.43536 12.721 4.46094 12.679 4.46094H10.683C10.305 4.46105 9.961 4.68444 9.8 5.03516L8.859 7.07715L6.586 12.0146L6.436 12.3408C6.258 12.7274 5.878 12.9736 5.462 12.9736H1.833C1.723 12.9736 1.65 12.8559 1.697 12.7539L4.312 7.07715L5.517 4.46094L6.378 2.58984L6.586 2.13867L7.228 0.746094C7.436 0.294127 7.879 0.00596 8.365 0.00586H14.626ZM2.88 0.00586C2.924 0.00586 2.962 0.03339 2.98 0.07422H2.981L4.922 4.28809C4.956 4.36261 4.904 4.44892 4.823 4.44922H0.109C0.049 4.44907 0 4.399 0 4.33691V0.118164C0 0.0560561 0.049 0.00601 0.109 0.00586H2.88Z" fill="#121212"/>
            </svg>
            <span className="text-body-1-bold text-label-normal">Tradex</span>
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 hover:bg-gray-50 rounded transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
              <line x1="6" y1="2.5" x2="6" y2="13.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-5 py-8">
          <div className="flex flex-col gap-6">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex flex-col gap-1">
                {/* Section Title */}
                {section.title && (
                  <div className="px-2 py-1">
                    <span className="text-caption-medium text-gray-400">
                      {section.title}
                    </span>
                  </div>
                )}

                {/* Section Items */}
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setSidebarCollapsed(true)
                        }}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-2 py-1 text-body-2-medium transition-colors',
                          active
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'text-gray-500 hover:text-gray-900'
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-400 px-1.5 text-caption-medium text-white">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="border-t border-gray-300/60 px-5 py-3">
          {isDemoMode ? (
            <button
              onClick={handleLoginClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-body-2-medium text-white transition-colors hover:bg-gray-800"
            >
              로그인
            </button>
          ) : (
            <ProfileDropdown
              user={user}
              onLogout={() => {
                logout()
                router.push('/login')
              }}
              onOpenSettings={openSettings}
            />
          )}
        </div>
      </aside>
    </>
  )
}
