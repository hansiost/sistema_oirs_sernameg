
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BackofficeRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login/backoffice');
  }, [router]);

  return null; 
}
