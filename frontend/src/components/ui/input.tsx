
const Input = ({label, placeholder , value , onChange} : {label: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}) => {
  return (
    <div className="flex flex-col items-start">
      <p className="text-sm font-medium mb-2 text-black">{label}</p>
      <input value={value} onChange={onChange} placeholder={placeholder} className="border border-gray-300 w-[350px] text-black rounded-md p-2" />
    </div>
  )
}

export default Input