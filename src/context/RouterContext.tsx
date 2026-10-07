import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppRoute, ROUTE_REGISTRY } from '../types/routes';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  goBack: () => void;
  pathname: string;
  hash: string;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(rawPath: string, rawHash: string): string {
  // Check if hash contains a legacy page name like #docs, #careers, #signup
  const cleanHash = rawHash.replace(/^#/, '').toLowerCase();

  if (cleanHash === 'signup' || cleanHash === 'login') {
    return '/auth';
  }

  if (['docs', 'careers', 'press', 'help', 'status', 'terms', 'privacy', 'licenses', 'auth', 'dashboard'].includes(cleanHash)) {
    return `/${cleanHash}`;
  }

  // Canonicalize pathname
  const trimmed = rawPath.replace(/\/+$/, '') || '/';
  return trimmed;
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalizePath(window.location.pathname, window.location.hash);
  });

  const [hash, setHash] = useState<string>(() => window.location.hash);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(window.location.search)
  );

  // Sync document title and meta description
  useEffect(() => {
    const meta = ROUTE_REGISTRY[currentPath as AppRoute];
    if (meta) {
      document.title = meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', meta.description);
      }
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', meta.title);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', meta.description);
      }
    } else {
      document.title = 'Mekai | Diagnostics intelligence for the modern workshop';
    }
  }, [currentPath]);

  // Handle browser back/forward and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const normalized = normalizePath(window.location.pathname, window.location.hash);
      setCurrentPath(normalized);
      setHash(window.location.hash);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial check: if user entered with a legacy hash (e.g. /#docs), replace with clean path /docs
    const initialHash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (['docs', 'careers', 'press', 'help', 'status', 'terms', 'privacy', 'licenses', 'auth', 'dashboard'].includes(initialHash)) {
      window.history.replaceState(null, '', `/${initialHash}`);
      setCurrentPath(`/${initialHash}`);
      setHash('');
    } else if (initialHash === 'signup' || initialHash === 'login') {
      window.history.replaceState(null, '', `/auth?mode=${initialHash}`);
      setCurrentPath('/auth');
      setHash('');
      setSearchParams(new URLSearchParams(`?mode=${initialHash}`));
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((target: string, options?: { replace?: boolean; scroll?: boolean }) => {
    const url = new URL(target, window.location.origin);
    const targetPath = url.pathname.replace(/\/+$/, '') || '/';
    const targetHash = url.hash;

    if (options?.replace) {
      window.history.replaceState(null, '', target);
    } else {
      window.history.pushState(null, '', target);
    }

    setCurrentPath(targetPath);
    setHash(targetHash);
    setSearchParams(url.searchParams);

    if (options?.scroll !== false) {
      if (targetHash) {
        const id = targetHash.replace(/^#/, '');
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      currentPath,
      navigate,
      goBack,
      pathname: currentPath,
      hash,
      searchParams,
    }),
    [currentPath, navigate, goBack, hash, searchParams]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
