"use client"

import Hero from '@/components/layout-landing/hero';
import LineUp from '@/components/layout-landing/line-up';
import Matches from '@/components/layout-landing/matches';
import Voting from '@/components/layout-landing/voting';
import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';

export default function Home() {

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Matches />
      <Voting />
      <LineUp />
      <Footer />
    </div>
  )
}
