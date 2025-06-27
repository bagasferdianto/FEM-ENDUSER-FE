'use client';

import React from 'react';
import Link from 'next/link';

const Voting: React.FC = () => {
    return (
        <section className="py-12 h-[300px] sm:h-[400px] md:h-[500px] w-full relative">
            <Link href="/voting" className="absolute inset-0 z-10" aria-label="Go to voting page" />

            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/voting-banner.png')" }}
            >
            </div>
        </section>
    );
};

export default Voting;
