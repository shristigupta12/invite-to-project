'use client'
import { useState, useRef, useEffect } from 'react'
import { IconUserPlus, IconX, IconInfoCircleFilled, IconWorld, IconChevronDown, IconChevronUp, IconCheck } from '@tabler/icons-react'
import Members from './members'

type Member = {
    name: string;
    profileUrl: string;
    email: string;
    access: 'view' | 'edit';
}

export default function InviteContainer() {
    const [canViewDropdown, setCanViewDropdown] = useState(false)
    const [linkMemberDropdown, setLinkMemberDropdown] = useState(false)
    const [accessLevel, setAccessLevel] = useState<'view' | 'edit'>('view')
    const [inputSelected, setInputSelected] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState("")
    const [enterValidEmail, setEnterValidEmail] = useState(false)
    const [profileImageIndex, setProfileImageIndex] = useState(1)
    const [membersList, setMembersList] = useState<Member[]>([])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setEnterValidEmail(false); // Reset validation message when input changes
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event?.target as Node)) {
                setCanViewDropdown(false)
            }
            if (inputRef.current && !inputRef.current.contains(event?.target as Node)) {
                setInputSelected(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    function isValidEmail(email: string) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const handleInviteClick = () => {
        if (!isValidEmail(inputValue)) {
            setEnterValidEmail(true);
            return;
        }

        const index = inputValue.indexOf('@');
        const name = inputValue.substring(0, index);
        const ext = (profileImageIndex % 2 === 0) ? "jpeg" : "png";
        const profileUrl = `/profile${profileImageIndex}.${ext}`;

        const memberDetails: Member = {
            name,
            profileUrl,
            email: inputValue,
            access: accessLevel
        }

        setMembersList(prevMembers => [...prevMembers, memberDetails]);
        setProfileImageIndex(prevIndex => prevIndex === 4 ? 1 : prevIndex + 1);
        setInputValue('');
        setEnterValidEmail(false);
    }

    return (
        <div className="mx-auto bg-white rounded-xl p-5 w-fit mt-44 border flex flex-col gap-6 shadow-lg">
            <div className="border-b-[2.5px] border-dashed pb-6 flex justify-between">
                <div className='rounded-full border w-12 h-12 flex items-center justify-center shadow'>
                    <IconUserPlus className='text-neutral-500' />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='text-xl font-semibold text-neutral-700'>Invite to project</div>
                    <div className='text-neutral-500'>Collaborate with members on this project.</div>
                </div>
                <IconX className='text-neutral-500 w-4 hover:cursor-pointer' />
            </div>

            <div className="border-b-[2.5px] border-dashed pb-6 flex flex-col gap-5">
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                        <div className='text-lg font-semibold text-neutral-700'>Invite Members</div>
                        <IconInfoCircleFilled className='text-neutral-300 text-sm size-5 hover:cursor-pointer' />
                    </div>
                    <div className="flex gap-3">
                        <div className='w-full relative flex' ref={inputRef} onClick={() => { setInputSelected(true) }}>
                            <div className='relative flex w-full'>
                                <input 
                                    className={`border-2 w-full rounded-lg pl-3 pr-32 outline-none focus:ring-0 ${inputSelected ? "border-red-500" : ""}`} 
                                    type='email' 
                                    value={inputValue} 
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                />
                                <div className='left-[238px] absolute text-neutral-700 font-semibold top-[10px]'>{`can ${accessLevel}`}</div>
                                <IconWorld className='absolute right-24 top-[11px] text-neutral-400 w-5' />
                                <IconChevronDown 
                                    className={`absolute ${canViewDropdown ? 'hidden' : 'block'} top-[11px] text-neutral-400 right-[10px] w-5 hover:cursor-pointer ${inputSelected ? "text-red-500" : ""}`} 
                                    onClick={() => setCanViewDropdown(!canViewDropdown)}
                                />
                                <IconChevronUp 
                                    className={`absolute ${canViewDropdown ? 'block' : 'hidden'} top-[11px] text-neutral-400 right-[10px] w-5 hover:cursor-pointer ${inputSelected ? "text-red-500" : ""}`} 
                                    onClick={() => setCanViewDropdown(!canViewDropdown)}
                                />
                            </div>
                            <div 
                                ref={dropdownRef} 
                                className={`absolute flex flex-col gap-1 right-0 -bottom-[84px] border rounded-xl shadow p-1 z-50 bg-white ${canViewDropdown ? "flex" : "hidden"}`}
                            >
                                <div 
                                    className={`hover:cursor-pointer w-32 px-2 py-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 font-semibold flex justify-between items-center ${accessLevel === "edit" ? "bg-neutral-100 text-neutral-600" : ""}`} 
                                    onClick={() => { setAccessLevel("edit"); setCanViewDropdown(false); }}
                                >
                                    <div>can edit</div>
                                    <IconCheck className={`size-4 text-neutral-400 ${accessLevel === "edit" ? "block" : "hidden"}`} />
                                </div>
                                <div 
                                    className={`hover:cursor-pointer w-32 px-2 py-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-600 font-semibold flex justify-between items-center ${accessLevel === "view" ? "bg-neutral-100 text-neutral-600" : ""}`} 
                                    onClick={() => { setAccessLevel("view"); setCanViewDropdown(false); }}
                                >
                                    <div>can view</div>
                                    <IconCheck className={`size-4 text-neutral-400 ${accessLevel === "view" ? "block" : "hidden"}`} />
                                </div>
                            </div>
                        </div>
                        <button 
                            className="border-2 rounded-lg h-fit py-2 px-3 shadow-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 cursor-pointer" 
                            onClick={handleInviteClick}
                        >
                            Invite
                        </button>
                    </div>
                    <div className={`text-red-500 text-xs ${enterValidEmail ? "flex" : "hidden"}`}>
                        Please enter a valid email
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='text-lg text-neutral-700 font-semibold'>Members with access</div>
                    <div>
                        {membersList.map((member, index) => (
                            <Members 
                                key={`${member.email}-${index}`}
                                name={member.name}
                                profileUrl={member.profileUrl}
                                email={member.email}
                                access={member.access}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className='text-lg font-semibold text-neutral-700 flex items-center gap-2'>
                    <div>Members with link</div>
                    <IconChevronDown 
                        className={`${linkMemberDropdown ? 'hidden' : 'block'} text-neutral-400 w-5 hover:cursor-pointer`} 
                        onClick={() => setLinkMemberDropdown(!linkMemberDropdown)}
                    />
                    <IconChevronUp 
                        className={`${linkMemberDropdown ? 'block' : 'hidden'} text-neutral-400 w-5 hover:cursor-pointer`} 
                        onClick={() => setLinkMemberDropdown(!linkMemberDropdown)}
                    />
                </div>
                <div className='text-neutral-500'>
                    Members who have the link have access to this project.
                </div>
            </div>
        </div>
    )
}