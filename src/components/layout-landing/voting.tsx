"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useGetVoting } from "@/app/_services/voting";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const Voting: React.FC = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { data: voting } = useGetVoting({
    page: page.toString(),
    sort: "startDate",
    dir: "asc",
    limit: "1",
    status: "1",
  });

  useEffect(() => {
    if (voting?.data?.total && voting.data.limit) {
      const calculatedTotalPage = Math.ceil(
        voting.data.total / voting.data.limit
      );
      setTotalPage(calculatedTotalPage);
    }
  }, [voting]);

  const votingList = voting?.data?.list || [];

  const handleNext = () => {
    if (page < totalPage) setPage((prev) => prev + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div>
      {votingList.map((voting) => (
        <section
          key={voting.id}
          className="group relative py-12 h-[300px] sm:h-[400px] md:h-[500px] w-full max-w-full"
        >
          {/* BACKGROUND */}
          <Image
            src={voting.banner?.url || "/images/voting-banner.png"}
            alt="Voting Banner"
            fill
            priority
            className="absolute inset-0 object-cover z-0"
          />

          {/* LINK di bawah */}
          <Link
            href={`/voting/${voting.id}`}
            className="absolute inset-0 z-0 block"
            aria-label="Go to voting page"
          />

          {/* BUTTONS */}
          {page > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // optional safety
                handlePrev();
              }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 backdrop-blur-md text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 transition duration-300 z-10 -translate-x-6"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {page < totalPage && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // optional safety
                handleNext();
              }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 backdrop-blur-md text-white p-3 rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 transition duration-300 z-10 translate-x-6"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}
        </section>
      ))}
    </div>
  );
};

export default Voting;
