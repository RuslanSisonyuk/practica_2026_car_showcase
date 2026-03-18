"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { CustomButton } from './';

const btnStyles = "text-primary-blue cursor-pointer hover:bg-primary-blue hover:text-white transition-colors bg-white rounded-2xl min-w-[130px]";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

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

        {/* Desktop nav */}
        <div className='hidden sm:flex items-center gap-4'>
          {session ? (
            <>
              {session.user.role === "ADMIN" && <CustomButton title="Admin" btnType="button" containerStyles={btnStyles} handleClick={() => router.push('/admin')} />}
              <CustomButton title="Bookmarks" btnType="button" containerStyles={btnStyles} handleClick={() => router.push('/bookmarks')} />
              <CustomButton title="Profile" btnType='button' containerStyles={btnStyles} handleClick={() => router.push('/profile')} />
              <CustomButton title="Sign Out" btnType="button" containerStyles={btnStyles} handleClick={() => signOut({ callbackUrl: '/' })} />
            </>
          ) : (
            <Link href="/auth/signin">
              <CustomButton title="Sign In" btnType="button" containerStyles={btnStyles} />
            </Link>
          )}
        </div>

        {/* Mobile: sign-in button (unauthenticated) or hamburger (authenticated) */}
        <div className='sm:hidden'>
          {session ? (
            <button
              className='p-2 cursor-pointer'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          ) : (
            <Link href="/auth/signin">
              <CustomButton title="Sign In" btnType="button" containerStyles={btnStyles} />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className='sm:hidden bg-white px-6 py-4 flex flex-col gap-3 shadow-md'>
          {session ? (
            <>
              {session.user.role === "ADMIN" && <CustomButton title="Admin" btnType="button" containerStyles={`${btnStyles} w-full active:bg-primary-blue active:text-white`} handleClick={() => navigate('/admin')} />}
              <CustomButton title="Bookmarks" btnType="button" containerStyles={`${btnStyles} w-full active:bg-primary-blue active:text-white`} handleClick={() => navigate('/bookmarks')} />
              <CustomButton title="Profile" btnType='button' containerStyles={`${btnStyles} w-full active:bg-primary-blue active:text-white`} handleClick={() => navigate('/profile')} />
              <CustomButton title="Sign Out" btnType="button" containerStyles={`${btnStyles} w-full active:bg-primary-blue active:text-white`} handleClick={() => signOut({ callbackUrl: '/' })} />
            </>
          ) : (
            <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>
              <CustomButton title="Sign In" btnType="button" containerStyles={`${btnStyles} w-full active:bg-primary-blue active:text-white`} />
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
