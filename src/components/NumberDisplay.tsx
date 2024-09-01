export default function NumberDisplay({number} : {number: number | string}) {
    return (
        <div className="px-2 leading-none text-[72px] w-[160px] font-clock text-red-500 text-right bg-black rounded-xl select-none">
            {number}
        </div>
    )
}