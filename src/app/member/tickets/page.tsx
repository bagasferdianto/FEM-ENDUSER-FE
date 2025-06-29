"use client";

import MemberLayout from "@/components/layout-member";
import { Suspense } from "react";
import TicketContent from "./_components/ticket-content";

const TicketHistoryPage = () => {

    return (
        <MemberLayout withFooter>
            <Suspense>
                <TicketContent />
            </Suspense>
        </MemberLayout>
    );
};

export default TicketHistoryPage;
