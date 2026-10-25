/**
 * Page-identity contract for every TestverQA module page (guest role, staging).
 * Titles/headings were captured live during exploration of
 * https://testplay.venomva.com/ (see .testver/explore/frontier.json).
 */
export const MODULE_PAGES: Array<{
  path: string;
  title: string;
  h1: string;
}> = [
  // Already covered by dedicated specs (kept for reference):
  { path: '/', title: 'Home · TestverQA', h1: 'A complete playground for test automation' },
  { path: '/auth/login', title: 'Sign in · TestverQA', h1: 'Welcome back 👋' },
  { path: '/auth/forgot', title: 'Forgot password · TestverQA', h1: 'Reset your password' },
  { path: '/forms', title: 'Form Elements · TestverQA', h1: 'Form Elements Playground' },
  { path: '/elements', title: 'Buttons & Interactions · TestverQA', h1: 'Buttons & Interactions' },
  { path: '/tables', title: 'Tables & Grids · TestverQA', h1: 'Tables & Grids' },
  { path: '/widgets', title: 'Tabs & Accordions · TestverQA', h1: 'Tabs, Accordions & Navigation Widgets' },
  { path: '/dynamic', title: 'Loaders & Waits · TestverQA', h1: 'Loaders & Waits' },
  { path: '/debug/state', title: 'State Inspector · TestverQA', h1: 'State Inspector' },
  { path: '/shop', title: 'Shop · TestverQA', h1: 'Shop' },

  // Newly surveyed modules (guest crawl):
  { path: '/ajax', title: 'AJAX & API · TestverQA', h1: 'AJAX & API' },
  { path: '/realtime', title: 'Real-time / WebSocket · TestverQA', h1: 'Real-time / WebSocket' },
  { path: '/files', title: 'File Operations · TestverQA', h1: 'File Operations' },
  { path: '/dialogs', title: 'Modals & Dialogs · TestverQA', h1: 'Modals, Alerts & Toasts' },
  { path: '/frames', title: 'iFrames & Windows · TestverQA', h1: 'iFrames & Windows' },
  { path: '/dragdrop', title: 'Drag & Drop · TestverQA', h1: 'Drag & Drop' },
  { path: '/shadow', title: 'Shadow DOM · TestverQA', h1: 'Shadow DOM & Web Components' },
  { path: '/canvas', title: 'Canvas & SVG · TestverQA', h1: 'Canvas & SVG' },
  { path: '/admin', title: 'Admin Dashboard · TestverQA', h1: 'Admin Dashboard' },
  { path: '/locators', title: 'Locator Challenges · TestverQA', h1: 'Locator Challenges' },
  { path: '/edge', title: 'Edge Cases · TestverQA', h1: 'Edge Cases' },
  { path: '/i18n', title: 'i18n & RTL · TestverQA', h1: 'i18n & RTL' },
  { path: '/a11y', title: 'Accessibility · TestverQA', h1: 'Accessibility (a11y)' },
  { path: '/api-docs', title: 'API Documentation · TestverQA', h1: 'API Documentation' },
];