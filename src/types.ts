export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface CapabilityCardData {
  id: string;
  title: string;
  description: string;
  theme: 'sage' | 'white' | 'dark';
  iconName: 'obd' | 'acoustic' | 'vision';
}

export interface WorkflowStepData {
  step: string;
  title: string;
  description: string;
}

export interface StatMetricData {
  id: string;
  metric: string;
  label: string;
  isCta?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
