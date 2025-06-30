"use client";

import MemberLayout from "@/components/layout-member";

const Profile = () => {
  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white h-screen px-4 sm:px-8 md:px-16 pt-28 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 h-full">
          <div className="flex flex-col justify-center items-center bg-blue-pfl bg-[url('/bg/pattern-2.png')] bg-cover border rounded-2xl shadow px-4 py-12 gap-8">
            <h1 className="text-4xl font-bold text-center text-white">
              Profile Setting
            </h1>
            <div className="flex justify-center items-start bg-white border rounded-xl shadow p-4 max-w-2xl h-full">
              <div className="flex flex-col gap-4">
                <h1 className="text-xl font-medium text-gray-900">Profile Anda</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default Profile;
