"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { CustomButton } from './';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <header className='w-full absolute z-10'>
      <nav className='max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4'>
        <Link href="/" className='flex justify-center items-center'>
          <Image
            src="/logo.svg"
            alt="car hub logo"
            width={118}
            height={18}
            className='object-contain'
          />
        </Link>

        <div className='flex items-center gap-4'>
          {session ? (
            <>
              <Link href="/bookmarks" className='text-primary-blue font-semibold text-sm hover:underline'>
                Bookmarks
              </Link>

              <Link href="/profile" className='text-primary-blue font-semibold text-sm hover:underline'>
                {session.user.name ?? session.user.email}
              </Link>

              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className='text-primary-blue font-semibold text-sm hover:underline'>
                  Admin
                </Link>
              )}

              <CustomButton
                title="Sign Out"
                btnType="button"
                containerStyles="text-primary-blue bg-white rounded-full min-w-[130px]"
                handleClick={() => signOut({ callbackUrl: '/' })}
              />
            </>
          ) : (
            <Link href="/auth/signin">
              <CustomButton
                title="Sign In"
                btnType="button"
                containerStyles="text-primary-blue bg-white rounded-full min-w-[130px]"
              />
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
