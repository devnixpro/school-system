'use client';

import { ModalProvider } from '@/context/ModalContext';

export default function Providers({ children }) {
  return <ModalProvider>{children}</ModalProvider>;
}