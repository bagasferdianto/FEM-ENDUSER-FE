"use client"

import Hero from '@/components/layout-landing/hero';
import LineUp from '@/components/layout-landing/line-up';
import Matches from '@/components/layout-landing/matches';
import Voting from '@/components/layout-landing/voting';
import MemberLayout from '@/components/layout-member';

export default function Home() {

  return (
    <MemberLayout withFooter>
      <Hero />
      <Matches />
      <Voting />
      <LineUp />
    </MemberLayout>
  )
}
