'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

const NavigationTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'ticket';

  const handleTabClick = (tab: string) => {
    router.push(`/member/tickets?tab=${tab}`);
  };

  return (
    <div className="inline-flex items-center bg-zinc-200 rounded-md overflow-hidden text-sm font-medium p-2 w-fit gap-2">
      <button
        onClick={() => handleTabClick('ticket')}
        className={clsx(
          'px-4 py-1 rounded-md transition',
          currentTab === 'ticket'
            ? 'bg-white text-black'
            : 'text-gray-500 hover:text-black'
        )}
      >
        Riwayat Tiket
      </button>
      <button
        onClick={() => handleTabClick('payment')}
        className={clsx(
          'px-4 py-1 rounded-md transition',
          currentTab === 'payment'
            ? 'bg-white text-black'
            : 'text-gray-500 hover:text-black'
        )}
      >
        Riwayat Pembayaran
      </button>
    </div>
  );
};

export default NavigationTabs;
