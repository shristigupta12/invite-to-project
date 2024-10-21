'use client'
import { useState, useRef, useEffect } from 'react'
import { IconUserPlus, IconX, IconInfoCircleFilled, IconWorld, IconChevronDown, IconChevronUp, IconCheck, IconLink } from '@tabler/icons-react'
import Members from './members'
import { MembersWithLink } from './members-with-link'

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
    const [inputValue, setInputValue] = useState("")
    const [enterValidEmail, setEnterValidEmail] = useState(false)
    const [profileImageIndex, setProfileImageIndex] = useState(1)
    const [membersList, setMembersList] = useState<Member[]>([])
    
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const memberLinkRef = useRef<HTMLDivElement>(null)

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
            if (memberLinkRef.current && !memberLinkRef.current.contains(event?.target as Node)) {
                setLinkMemberDropdown(false)
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

    const updateMemberAccess = (email: string, newAccess: 'view' | 'edit') => {
        setMembersList(prevMembers => 
            prevMembers.map(member => 
                member.email === email ? { ...member, access: newAccess } : member
            )
        );
    }

    return (
        <div className="mx-auto bg-white rounded-xl sm:p-5 py-5 px-3 w-fit mt-44 border flex flex-col gap-6 shadow-lg mb-60">
            <div className="border-b-[2.5px] border-dashed pb-6 flex justify-between">
                <div className='rounded-full border w-12 h-12 flex items-center justify-center shadow'>
                    <IconUserPlus className='text-neutral-500' />
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='sm:text-xl text-lg font-semibold text-neutral-700'>Invite to project</div>
                    <div className='max-sm:text-sm text-neutral-500'>Collaborate with members on this project.</div>
                </div>
                <IconX className='text-neutral-500 w-4 hover:cursor-pointer' />
            </div>

            <div className="border-b-[2.5px] border-dashed pb-6 flex flex-col gap-5">
                <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-1'>
                        <div className='md:text-lg font-semibold text-neutral-700'>Invite Members</div>
                        <IconInfoCircleFilled className='text-neutral-300 text-sm size-5 hover:cursor-pointer' />
                    </div>
                    <div className="flex gap-3">
                        <div className='w-full relative flex' ref={inputRef} onClick={() => { setInputSelected(true) }}>
                            <div className='relative flex w-full'>
                                <input 
                                    className={`border-2 w-full rounded-lg pl-3 pr-32 outline-none focus:ring-0 max-sm:text-sm ${inputSelected ? "border-red-500" : ""}`} 
                                    type='email' 
                                    value={inputValue} 
                                    onChange={handleInputChange}
                                    placeholder="Enter email address"
                                />
                                <div className='absolute flex gap-1 right-2 top-3 items-center '>
                                <IconWorld className='  text-neutral-400 sm:w-5 w-4 -mt-[1px]' />
                                <div className=' text-neutral-700 font-semibold max-sm:text-sm -mt-1'>{`can ${accessLevel}`}</div>
                                <div>
                                <IconChevronDown 
                                    className={` ${canViewDropdown ? 'hidden' : 'block'} text-neutral-400 w-4 hover:cursor-pointer ${inputSelected ? "text-red-500" : ""}`} 
                                    onClick={() => setCanViewDropdown(!canViewDropdown)}
                                />
                                <IconChevronUp 
                                    className={` ${canViewDropdown ? 'block' : 'hidden'} text-neutral-400 w-4 hover:cursor-pointer ${inputSelected ? "text-red-500" : ""}`} 
                                    onClick={() => setCanViewDropdown(!canViewDropdown)}
                                />
                                </div>
                                </div>
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
                    <div className='md:text-lg text-neutral-700 font-semibold'>Members with access</div>
                    <div>
                        {membersList.map((member, index) => (
                            <Members 
                                key={`${member.email}-${index}`}
                                name={member.name}
                                profileUrl={member.profileUrl}
                                email={member.email}
                                access={member.access}
                                setAccess={(newAccess) => updateMemberAccess(member.email, newAccess)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div className=' relative md:text-lg font-semibold text-neutral-700 flex items-center gap-2'>
                    <div >Members with link</div>
                    <IconChevronDown 
                        className={`${linkMemberDropdown ? 'hidden' : 'block'} text-neutral-400 w-5 hover:cursor-pointer`} 
                        onClick={() => setLinkMemberDropdown(!linkMemberDropdown)}
                    />
                    <IconChevronUp 
                        className={`${linkMemberDropdown ? 'block' : 'hidden'} text-neutral-400 w-5 hover:cursor-pointer`} 
                        onClick={() => setLinkMemberDropdown(!linkMemberDropdown)}
                    />
                    <div className={`absolute z-50 bg-white border rounded-lg p-3 top-8 shadow min-w-56 flex-col gap-5 ${linkMemberDropdown?"flex":"hidden"}`} ref={memberLinkRef}>

                        <div className='flex flex-col gap-2'>
                            <div className='text-md font-semibold text-neutral-700'>Members</div>
                            <div className='flex gap-4'>
                                {membersList.length>0 && membersList.map((member, index) => (
                                    <MembersWithLink 
                                        key={`${member.email}-${index}`}
                                        name={member.name}
                                        profileUrl={member.profileUrl}
                                        access={member.access}
                                    />
                                ))}
                            </div>
                            {membersList.length==0 && <div className='text-neutral-400 text-xs'>No members</div>}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <div className='text-md font-semibold text-neutral-700'>Share link</div>
                            <div className='flex justify-between gap-4'>
                                <div className='flex items-center justify-center gap-1 p-2 rounded-lg text-neutral-700 border bg-white text-sm border-neutral-200 shadow cursor-pointer hover:bg-neutral-100'>
                                    <IconLink className='size-5' />
                                    <div>Copy Link</div>
                                </div>
                                <div className={`bg-neutral-100 text-neutral-600 py-1 px-3 rounded-lg cursor-pointer text-sm border border-neutral-300 hover:bg-neutral-200 font-bold flex items-center`} onClick={()=>{setLinkMemberDropdown(false)}}>Done</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='text-neutral-500 max-sm:text-sm'>
                    Members who have the link have access to this project.
                </div>
            </div>
        </div>
    )
}