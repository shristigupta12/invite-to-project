import Image from "next/image"

type MemberProps = {
    name: string;
    profileUrl: string;
    access: 'view' | 'edit';
}

export function MembersWithLink({name, profileUrl, access}: MemberProps){
    return(
        <div className="flex flex-col items-center bg-neutral-100 border rounded-md p-2 w-20 ">
            <div className='rounded-full overflow-hidden w-[25px] h-[25px]'>
                <Image 
                    src={profileUrl} 
                    alt={`${name}'s profile`} 
                    width={30} 
                    height={30} 
                    className='object-cover w-full h-full' 
                />
            </div>
            <div className="text-sm font-semibold text-neutral-700">{name}</div>
            <span className='text-neutral-500 sm:text-[10px] text-[8px] sm:-mt-2 -mt-1 '>can {access}</span>
        </div>
    )
}