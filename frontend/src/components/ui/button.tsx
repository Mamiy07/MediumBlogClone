
const Button = ({text , onClick }: {text: string, onClick: () => void}) => {
  return (
    <div>
      <button onClick={onClick} className="bg-black text-white py-2 text-2xl font-sans  px-12 rounded-2xl mt-4">{text}</button>
    </div>
  )
}

export default Button