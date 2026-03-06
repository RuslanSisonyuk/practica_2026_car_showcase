"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { CustomButton } from './';

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
              <CustomButton
                title="Bookmarks"
                btnType="button"
                containerStyles="text-primary-blue cursor-pointer hover:bg-primary-blue hover:text-white transition-colors bg-white rounded-2xl min-w-[130px]"
                handleClick={() => router.push('/bookmarks')}
              />

              <CustomButton
                title="Profile"
                btnType='button'
                containerStyles="text-primary-blue cursor-pointer hover:bg-primary-blue hover:text-white transition-colors bg-white rounded-2xl min-w-[130px]"
                handleClick={() => router.push('/profile')}
              />

              <CustomButton
                title="Sign Out"
                btnType="button"
                containerStyles="text-primary-blue cursor-pointer hover:bg-primary-blue hover:text-white transition-colors bg-white rounded-2xl min-w-[130px]"
                handleClick={() => signOut({ callbackUrl: '/' })}
              />
            </>
          ) : (
            <Link href="/auth/signin">
              <CustomButton
                title="Sign In"
                btnType="button"
                containerStyles="text-primary-blue cursor-pointer hover:bg-primary-blue hover:text-white transition-colors bg-white rounded-2xl min-w-[130px]"
              />
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
