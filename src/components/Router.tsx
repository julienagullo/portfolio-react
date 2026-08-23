import type { ComponentType } from 'react';
import Portfolio from './Portfolio';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import NotFound from '../pages/NotFound';
import WebManager from '../pages/WebManager';

// URL dérivée du nom du composant (WebManager -> /web-manager).
const PAGES: ComponentType[] = [WebManager];

function toSlug(componentName: string): string {
  return componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

const PAGE_BY_SLUG: Record<string, ComponentType> = Object.fromEntries(
  PAGES.map((page) => [toSlug(page.name), page]),
);

export default function Router() {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, '');

  if (slug === '') {
    return <Portfolio />;
  }

  const Page = PAGE_BY_SLUG[slug] ?? NotFound;

  return (
    <>
      <Header />
      <Page />
      <Footer />
    </>
  );
}
