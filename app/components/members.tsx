
"use client"
import React, { useState, useEffect, useRef } from 'react'
import { IconWorld, IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react'
import Image from 'next/image'

type MemberProps = {
    name: string;
    profileUrl: string;
    email: string;
    access: 'view' | 'edit';
}

export default function Members({ name, profileUrl, email, access }: MemberProps) {
    const [canViewDropdown, setCanViewDropdown] = useState(false)
    const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>(access)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setCanViewDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="flex justify-between items-center py-1">
            <div className='flex items-center gap-2'>
                <div className='rounded-full overflow-hidden w-[30px] h-[30px]'>
                    <Image 
                        src={profileUrl} 
                        alt={`${name}'s profile`} 
                        width={30} 
                        height={30} 
                        className='object-cover w-full h-full' 
                    />
                </div>
                <div className='flex flex-col'>
                    <div className='text-lg font-semibold text-neutral-700'>{name}</div>
                    <div className='text-neutral-500'>{email}</div>
                </div>
            </div>
            <div className='flex gap-1 relative'>
                <IconWorld className='text-neutral-400 w-5' />
                <div className='text-neutral-500'>{`can ${accessLevel}`}</div>
                <IconChevronDown 
                    className={`${canViewDropdown ? 'hidden' : 'block'} text-neutral-400 w-5 hover:cursor-pointer`} 
                    onClick={() => setCanViewDropdown(true)}
                />
                <IconChevronUp 
                    className={`${canViewDropdown ? 'block' : 'hidden'} text-neutral-400 w-5 hover:cursor-pointer`} 
                    onClick={() => setCanViewDropdown(false)}
                />

                <div 
                    ref={dropdownRef}
                    className={`absolute flex flex-col gap-1 top-full mt-1 right-0 border rounded-xl shadow p-1 z-50 bg-white ${canViewDropdown ? "flex" : "hidden"}`}
                >
                    <div 
                        className={`hover:cursor-pointer w-32 px-2 py-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 font-semibold flex justify-between items-center ${accessLevel === "edit" ? "bg-neutral-100 text-neutral-600" : ""}`} 
                        onClick={() => {setAccessLevel("edit"); setCanViewDropdown(false);}}
                    >
                        <div>can edit</div> 
                        <IconCheck className={`size-4 text-neutral-400 ${accessLevel === "edit" ? "block" : "hidden"}`} />
                    </div>
                    <div 
                        className={`hover:cursor-pointer w-32 px-2 py-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 font-semibold flex justify-between items-center ${accessLevel === "view" ? "bg-neutral-100 text-neutral-600" : ""}`} 
                        onClick={() => {setAccessLevel("view"); setCanViewDropdown(false);}}
                    >
                        <div>can view</div> 
                        <IconCheck className={`size-4 text-neutral-400 ${accessLevel === "view" ? "block" : "hidden"}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}