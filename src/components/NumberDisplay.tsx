export default function NumberDisplay({number, color} : {number: number | string, color: string}) {
    return (
        <div className={`text-${color} px-2 leading-none text-[72px] w-[160px] font-clock text-right bg-black rounded-xl select-none`}>
            {number}
        </div>
    )
}