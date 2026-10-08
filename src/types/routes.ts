export type AppRoute =
  | '/'
  | '/dashboard'
  | '/auth'
  | '/docs'
  | '/careers'
  | '/press'
  | '/help'
  | '/status'
  | '/terms'
  | '/privacy'
  | '/licenses';

export interface RouteMeta {
  path: AppRoute;
  title: string;
  description: string;
  category?: 'main' | 'company' | 'legal' | 'app';
}

export const ROUTE_REGISTRY: Record<AppRoute, RouteMeta> = {
  '/': {
    path: '/',
    title: 'Mekai | Diagnostics intelligence for the modern workshop',
    description: 'Mekai | Diagnostics intelligence for the modern workshop',
    category: 'main',
  },
  '/dashboard': {
    path: '/dashboard',
    title: 'Mekai | Dashboard',
    description: 'Active automotive diagnostic intelligence workspace with live telemetry and DTC reasoning.',
    category: 'app',
  },
  '/auth': {
    path: '/auth',
    title: 'Mekai | Auth',
    description: 'Verify your authorized workshop credentials and access token to launch the Mekai diagnostic engine.',
    category: 'app',
  },
  '/docs': {
    path: '/docs',
    title: 'Mekai | Docs',
    description: 'Comprehensive technical architecture, OBD-II/CAN protocols, multimodal acoustics, and API integration guides.',
    category: 'company',
  },
  '/careers': {
    path: '/careers',
    title: 'Mekai | Careers',
    description: 'Join the team building next-generation diagnostic intelligence for workshops and automotive engineers.',
    category: 'company',
  },
  '/press': {
    path: '/press',
    title: 'Mekai | Press',
    description: 'Press inquiries, brand media kit, and company announcements for Mekai by Cestcore Limited.',
    category: 'company',
  },
  '/help': {
    path: '/help',
    title: 'Mekai | Help',
    description: 'Workshop technical support, ticket submission, and in-app diagnostic troubleshooting guidance.',
    category: 'company',
  },
  '/status': {
    path: '/status',
    title: 'Mekai | Status',
    description: 'Real-time telemetry and component uptime for Mekai diagnostic pipeline and cloud services.',
    category: 'company',
  },
  '/terms': {
    path: '/terms',
    title: 'Mekai | Terms',
    description: 'Terms and conditions governing the use of Mekai diagnostic intelligence software and workshop tools.',
    category: 'legal',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Mekai | Privacy',
    description: 'Data security, telemetry confidentiality, and privacy standards at Cestcore Limited.',
    category: 'legal',
  },
  '/licenses': {
    path: '/licenses',
    title: 'Mekai | Licenses',
    description: 'Open source software notices, third-party libraries, and compliance disclosures.',
    category: 'legal',
  },
};
