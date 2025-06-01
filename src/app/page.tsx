"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"
import Navbar from "@/components/navbar-landing/navbar";

export default function Home() {

  const matches = [
    {
      series: "Series 1 Match Day 1 (03-05-2025)",
      ticketPrice: "Rp25.000,00",
      games: [
        { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 10:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 12:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 14:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 16:00 WIB", venue: "GOR Sritex Arena" },
      ],
    },
    {
      series: "Series 1 Match Day 2 (04-05-2025)",
      ticketPrice: "Rp25.000,00",
      games: [
        { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 10:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 12:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 14:00 WIB", venue: "GOR Sritex Arena" },
        { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 16:00 WIB", venue: "GOR Sritex Arena" },
      ],
    },
  ]

  const players = [
    { name: "Player 1", team: "Team A", image: "/placeholder.svg?height=200&width=150" },
    { name: "Player 2", team: "Team B", image: "/placeholder.svg?height=200&width=150" },
    { name: "Player 3", team: "Team C", image: "/placeholder.svg?height=200&width=150" },
    { name: "Player 4", team: "Team D", image: "/placeholder.svg?height=200&width=150" },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative h-[75.82vh] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/Header.svg?height=682&width=1440"
            alt="Stadium Background"
            fill
            className="object-cover"
          />
        </div>
        <header className="absolute top-0 left-0 w-full px-4 py-3 z-20">
          <Navbar />
        </header>
      </section>

      <section className="p-16 bg-white">
        <div className="container mx-auto">
          <div className="bg-[#00009C] rounded-lg py-8 px-10 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-2 text-white">Pertandingan Terdekat</h2>
            <p className="text-center text-white mb-8">Jangan sampai ketinggalan pada setiap pertandingannya</p>

            <div className="space-y-12">
              {matches.map((matchDay, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <div className="bg-[#FF113C] text-white p-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">{matchDay.series}</span>
                      <Badge variant="secondary" className="bg-white text-[#FF113C]">
                        Ticket For 1 Day
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold">{matchDay.ticketPrice}</span>
                      <Button size="sm" className="bg-blue-800 hover:bg-blue-900">
                        Beli Tiket
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white">
                    {matchDay.games.map((game, gameIndex) => (
                      <div key={gameIndex} className="flex items-center justify-between p-4 border-b last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                            {gameIndex + 1}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                            <span className="font-semibold">{game.teamA}</span>
                          </div>
                          <span className="text-red-500 font-bold">VS</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                            <span className="font-semibold">{game.teamB}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{game.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{game.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-semibold">Beli 1 Series Match</span>
                <span className="ml-2 text-sm">03-04 Mei 2025</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold">Rp40.000,00</span>
                <Button className="bg-blue-800 hover:bg-blue-900">Beli Tiket Bundling</Button>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? "bg-blue-600" : "bg-gray-300"}`}></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[url('/images/Voting.png')] bg-no-repeat bg-cover h-full w-full text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-white rounded-full"></div>
              <span className="text-sm">Series 1</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Vote Now! Player of The Series</h2>

            <div className="flex justify-center items-center space-x-8">
              {players.map((player, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-4">
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      width={150}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold">{player.name}</h3>
                  <p className="text-sm text-gray-300">{player.team}</p>
                </div>
              ))}
            </div>

            <Button className="mt-8 bg-white text-blue-900 hover:bg-gray-100 px-8 py-2">Selengkapnya</Button>
          </div>
        </div>
      </section>

      <section className="p-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4 items-center justify-between relative">
            <div>
              <Image
                src="/images/lineup.png?height=200&width=600"
                alt="Team Photo"
                width={500}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div className="container rounded-lg p-10 shadow-md">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">TIM & LINE-UP</h2>
              <p className="text-gray-600 mb-6">
                Tim dan line-up di Professional Futsal League (PFL) Indonesia menampilkan para pemain terbaik dari
                berbagai daerah membawa semangat dan kompetisi tinggi ke lapangan futsal. Dengan keberagaman strategi
                dan bakat, PFL Indonesia semakin memperkuat posisinya sebagai liga futsal terkemuka di tanah air.
              </p>
              <Button className="bg-blue-800 hover:bg-blue-900 text-white">Lihat tim & squad</Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1a2e] text-white p-16">
        <div className="container">
          <div className="grid justify-between md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-6">
              <div className="w-32 h-10 flex items-center justify-center relative">
                <Image
                  src="/images/PFL-Logo-Putih.png"
                  alt="PFL Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-300 text-sm max-w-[299px]">
                Kompetisi utama futsal di tingkat nasional dan berada di Indonesia yang diselenggarakan Federasi Futsal
                Indonesia.
              </p>
            </div>

            <div className="flex space-x-10 justify-end">
              <div>
                <h3 className="font-semibold mb-5">Pro Futsal League</h3>
                <ul className="space-y-5 text-sm text-gray-300">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Jadwal Pertandingan
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Voting
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Tim
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-5">Kontak Kami</h3>
                <div className="space-y-5 text-sm text-gray-300">
                  <div className="flex space-x-3 mt-4">
                    <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                    <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
                    <Youtube className="w-5 h-5 hover:text-red-400 cursor-pointer" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>+62 123-456-7890</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>admin@profutsalleague</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
