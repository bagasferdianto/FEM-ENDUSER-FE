"use client";

import Header from "@/components/header-page/header-page";
import Tickets from "./data-history-tickets-table";
import History from "./data-history-purchase-table";
import NavigationTabs from "./navigation-tabs";
import { useSearchParams } from "next/navigation";

const TicketContent = () => {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'ticket';

    return (
        <div className="flex flex-col gap-4 bg-white min-h-screen h-fit px-4 sm:px-8 md:px-16 pt-28 pb-14">
            <Header title="E-Tiket" />
            <NavigationTabs />
            {currentTab === 'ticket' && <Tickets />}
            {currentTab === 'payment' && <History />}
        </div>
    );
};

export default TicketContent;
