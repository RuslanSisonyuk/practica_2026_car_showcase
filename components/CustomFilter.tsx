"use client"
import { useState, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CustomFilterProps } from "@/types";
import { Listbox, Transition, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { updateSearchParams } from "@/utils";

const CustomFilter = ({ title, options }: CustomFilterProps) => {  
  const [selected, setSelected] = useState(options[0]);

  const router = useRouter();

  const handleUpdateParams = (e: { title: string, value: string }) => {
    const newPathname = updateSearchParams(title, e.value.toLowerCase());
    router.push(newPathname, { scroll: false });
  }

  return (
    <div className="w-fit">
      <Listbox 
        value={selected} 
        onChange={(e: any) => {
          setSelected(e);
          handleUpdateParams(e);
        }}
        >
        <div className="relative w-fit z-10">
          <ListboxButton className="custom-filter__btn">
            <span className="block truncate">
              {selected.title}
            </span>
            <Image src="/chevron-up-down.svg" alt="chevron up down" width={20} height={20} className="ml-4 object-contain" />
          </ListboxButton>
          <Transition 
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          >
            <ListboxOptions className="custom-filter__options">
              {options.map((option) => (
                <ListboxOption key={option.title} value={option} className={({ active }) => `cursor-default select-none py-2 px-4
                ${active ? 'bg-primary-blue text-white' : 'text-gray-900'}`}>
                  {({ selected }) => (
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                      {option.title}
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CustomFilter