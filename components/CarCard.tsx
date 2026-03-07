"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { CarProps } from '@/types'
import CustomButton from './CustomButton'
import { calculateCarRent, generateCarImageUrl } from '@/utils'
import CarDetails from './CarDetails'

interface CarCardProps {
    car: CarProps;
    imageUrl: string;
    isBookmarked?: boolean;
}

const CarCard = ({ car, imageUrl, isBookmarked = false }: CarCardProps) => {
    const { year, make, model, transmission, drive, fuel_type = 'Gas' } = car;

    const { data: session } = useSession();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [imgSrc, setImgSrc] = useState(imageUrl);
    const [bookmarked, setBookmarked] = useState(isBookmarked);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    const carRent = calculateCarRent(year);

    async function toggleBookmark() {
        if (!session) {
            router.push('/auth/signin');
            return;
        }

        setBookmarkLoading(true);

        const method = bookmarked ? 'DELETE' : 'POST';
        await fetch('/api/bookmarks', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ make, model, year }),
        });

        setBookmarked(!bookmarked);
        setBookmarkLoading(false);
    }

    return (
        <div className="car-card group">
            <div className="car-card__content">
                <h2 className="car-card__content-title">
                    {make} {model}
                </h2>

                <button
                    onClick={toggleBookmark}
                    disabled={bookmarkLoading}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this car'}
                    className="p-1 rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={bookmarked ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={2}
                        className={`w-5 h-5 ${bookmarked ? 'text-primary-blue' : 'text-grey'}`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                        />
                    </svg>
                </button>
            </div>

            <p className="flex mt-6 text-[32px] font-extrabold">
                <span className="self-start text-[14px] font-semibold">
                $
                </span>
                {carRent}
                <span className="self-end text-[14px] font-semibold">
                    /day
                </span>
            </p>

            <div className='relative w-full h-40 my-3 object-contain'>
                <Image src={imgSrc} alt='car model' fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority className='object-contain' onError={() => setImgSrc(generateCarImageUrl(car))}/>
            </div>

            <div className="relative flex flex-col gap-2 w-full mt-2">
                <div className='flex flex-row lg:group-hover:invisible w-full justify-between text-grey'>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/steering-wheel.svg" alt='steering wheel' width={20} height={20}/>
                        <p className='text-[14px]'>
                            {transmission === 'a' ? 'Automatic' : 'Manual'}
                        </p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/tire.svg" alt='tire' width={20} height={20}/>
                        <p className='text-[14px]'>
                            {drive.toUpperCase()}
                        </p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-2'>
                        <Image src="/gas.svg" alt='gas' width={20} height={20}/>
                        <p className='text-[14px]'>
                            {fuel_type.toUpperCase() || 'Gas' || 'Electricity' || 'Hybrid' || 'Diesel' || 'Petrol' }
                        </p>
                    </div>
                </div>

                <div className="car-card__btn-container">
                    <CustomButton
                    title='View More'
                    containerStyles='w-full py-[16px] rounded-xl bg-primary-blue cursor-pointer hover:bg-primary-blue-dark  transition-colors'
                    textStyles='text-white text-[14px] leading-[17px] font-bold'
                    rightIcon='/right-arrow.svg'
                    handleClick={() => setIsOpen(true)}
                    />
                </div>
            </div>

            <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} imageUrl={imageUrl} />
        </div>
    )
}

export default CarCard
