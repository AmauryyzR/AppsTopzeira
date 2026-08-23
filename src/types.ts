export type TabType = 'cover' | 'mathrender' | 'snake' | 'jogotop';

export interface TabItem {
  id: string;
  type: TabType;
  title: string;
  iconName: 'home' | 'calculator' | 'gamepad' | 'trees';
  active: boolean;
  closable: boolean;
  url?: string;
}

export interface AppMetadata {
  id: TabType;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  gradient: string;
  accentColor: string;
  icon: string;
  defaultPort: number;
}
