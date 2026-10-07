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
    title: 'Mekai — Diagnostic Intelligence for the Modern Workshop',
    description: 'Conversational automotive diagnostic intelligence for master technicians and workshops by Cestcore Limited.',
    category: 'main',
  },
  '/dashboard': {
    path: '/dashboard',
    title: 'Diagnostic Console — Mekai',
    description: 'Active automotive diagnostic intelligence workspace with live telemetry and DTC reasoning.',
    category: 'app',
  },
  '/auth': {
    path: '/auth',
    title: 'Workshop Access & Authentication — Mekai',
    description: 'Verify your authorized workshop credentials and access token to launch the Mekai diagnostic engine.',
    category: 'app',
  },
  '/docs': {
    path: '/docs',
    title: 'Technical Documentation & Architecture — Mekai',
    description: 'Comprehensive technical architecture, OBD-II/CAN protocols, multimodal acoustics, and API integration guides.',
    category: 'company',
  },
  '/careers': {
    path: '/careers',
    title: 'Careers & Engineering Opportunities — Mekai',
    description: 'Join the team building next-generation diagnostic intelligence for workshops and automotive engineers.',
    category: 'company',
  },
  '/press': {
    path: '/press',
    title: 'Press & Media Resources — Mekai',
    description: 'Press inquiries, brand media kit, and company announcements for Mekai by Cestcore Limited.',
    category: 'company',
  },
  '/help': {
    path: '/help',
    title: 'Help, Support & Technical Assistance — Mekai',
    description: 'Workshop technical support, ticket submission, and in-app diagnostic troubleshooting guidance.',
    category: 'company',
  },
  '/status': {
    path: '/status',
    title: 'System Telemetry & Service Status — Mekai',
    description: 'Real-time telemetry and component uptime for Mekai diagnostic pipeline and cloud services.',
    category: 'company',
  },
  '/terms': {
    path: '/terms',
    title: 'Terms of Service — Mekai',
    description: 'Terms and conditions governing the use of Mekai diagnostic intelligence software and workshop tools.',
    category: 'legal',
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy — Mekai',
    description: 'Data security, telemetry confidentiality, and privacy standards at Cestcore Limited.',
    category: 'legal',
  },
  '/licenses': {
    path: '/licenses',
    title: 'Open Source Licenses & Compliance — Mekai',
    description: 'Open source software notices, third-party libraries, and compliance disclosures.',
    category: 'legal',
  },
};
