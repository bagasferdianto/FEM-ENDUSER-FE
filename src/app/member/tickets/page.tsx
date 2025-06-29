"use client";

import MemberLayout from "@/components/layout-member";
import Header from "@/components/header-page/header-page";
import Tickets from "./_components/data-history-tickets-table";
import History from "./_components/data-history-purchase-table";
import NavigationTabs from "./_components/navigation-tabs";
import { useSearchParams } from "next/navigation";

const TicketHistoryPage = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'ticket';

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white h-screen px-4 sm:px-8 md:px-16 pt-28 pb-14">
        <Header title="E-Tiket" />
        <NavigationTabs />
        {currentTab === 'ticket' && <Tickets />}
        {currentTab === 'payment' && <History />}
      </div>
    </MemberLayout>
  );
};

export default TicketHistoryPage;
