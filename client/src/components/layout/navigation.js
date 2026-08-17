import {
  BookOpen,
  BotMessageSquare,
  ChartNoAxesCombined,
  LayoutDashboard,
  Languages,
  MessageSquareText,
  Settings,
  UserRound,
} from 'lucide-react';

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Tutor', path: '/tutor', icon: BotMessageSquare },
  { label: 'Conversations', path: '/conversations', icon: MessageSquareText },
  { label: 'Lessons', path: '/lessons', icon: BookOpen },
  { label: 'Vocabulary', path: '/vocabulary', icon: Languages },
  { label: 'Progress', path: '/progress', icon: ChartNoAxesCombined },
  { label: 'Profile', path: '/profile', icon: UserRound },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function getPageTitle(pathname) {
  if (pathname === '/grammar') return 'Grammar Practice';
  return navigationItems.find((item) => item.path === pathname)?.label || 'Language Hub';
}
