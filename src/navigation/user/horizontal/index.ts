// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation: HorizontalNavItemsType = [
  {
    title: 'chat_to_website',
    path: '/chat',
    icon: 'mingcute:magic-hat-2-line'
  },
  {
    title: 'wizard_to_website',
    path: '/wizard',
    icon: 'game-icons:wizard-face'
  },
  {
    title: 'website',
    icon: 'fluent:web-asset-16-regular',
    children: [
      {
        title: 'wizard',
        path: '/website/wizard',
        icon: 'ph:magic-wand',
        badgeContent: 'new',
        badgeColor: 'primary'
      },
      {
        title: 'content',
        path: '/website/content',
        icon: 'streamline:chat-bubble-square-write',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'analytics',
        path: '/website/analytics',
        icon: 'tabler:brand-google-analytics',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'dns',
        path: '/website/dns',
        icon: 'lets-icons:globe-light',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'brand',
    icon: 'fluent:color-20-regular',
    children: [
      {
        title: 'settings',
        path: '/brand/settings',
        icon: 'streamline:ai-settings-spark',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'brand',
        path: '/brand',
        icon: 'icon-park-outline:color-filter',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'crm',
    icon: 'fluent:people-community-16-regular',
    children: [
      {
        title: 'inquiries',
        icon: 'lets-icons:form-light',
        path: '/crm/inquiries',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'crm',
        icon: 'fluent:people-community-add-20-regular',
        path: '/crm',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'booking',
    icon: 'mdi-light:calendar',
    children: [
      {
        title: 'settings',
        path: '/booking/settings',
        icon: 'carbon:calendar-settings',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'calendar',
        path: '/booking/calendar',
        icon: 'fluent-mdl2:primary-calendar',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'bookings',
        path: '/booking/bookings',
        icon: 'teenyicons:calendar-tick-outline',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'blog',
    icon: 'carbon:blog',
    children: [
      {
        title: 'settings',
        path: '/blog/settings',
        icon: 'fluent:clipboard-settings-20-regular',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'posts',
        path: '/blog/posts',
        icon: 'carbon:ai-launch',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'analytics',
        path: '/blog/analytics',
        icon: 'carbon:analytics-custom',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'pay',
    icon: 'circum:money-check-1',
    children: [
      {
        title: 'settings',
        path: '/pay/settings',
        icon: 'fluent:task-list-square-settings-20-regular',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'invoices',
        path: '/pay/invoices',
        icon: 'mdi:invoice-text-check-outline',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      },
      {
        title: 'accounting',
        path: '/pay/accounting',
        icon: 'system-uicons:document-stack',
        badgeContent: 'soon',
        badgeColor: 'default',
        disabled: true
      }
    ]
  },
  {
    title: 'resources',
    icon: 'iwwa:help',
    children: [
      {
        title: 'help_center',
        path: 'https://github.com/younes-alturkey',
        icon: 'mdi:help-outline',
        externalLink: true,
        openInNewTab: true
      },
      {
        title: 'report_issue',
        path: 'https://github.com/younes-alturkey',
        icon: 'ph:bug-light',
        externalLink: true,
        openInNewTab: true
      },
      {
        title: 'request_feature',
        path: 'https://github.com/younes-alturkey',
        icon: 'fluent:emoji-add-24-regular',
        externalLink: true,
        openInNewTab: true
      },
      {
        title: 'safha_community',
        path: 'https://github.com/younes-alturkey',
        icon: 'radix-icons:discord-logo',
        externalLink: true,
        openInNewTab: true
      }
    ]
  }
]

export default navigation
