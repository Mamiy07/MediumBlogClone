import { useState } from 'react';
import Button from '../components/ui/button';
import Input from '../components/ui/input';
import '../index.css';
import axios from 'axios';
const Signup = () => {

   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const handleClick = async () => {
     try {
       const response = await axios.post('https://mediumblogclone-1.onrender.com/api/v1/user/signup', {
         email,
         name,
         password,
       });
       console.log('Signup successful:', response.data);
     } catch (error) {
       console.error('Signup failed:', error);
       
     }
   };

  return (
    <div id='signup' className='flex  items-center justify-center '>
      <div className='flex flex-col items-start pl-4 justify-center mt-10 h-[650px] w-[400px] bg-[#f7e6f4] backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl'>
        <p className='text-red-500'>{error}</p>
        <h1 className='text-3xl font-semibold text-black mb-6 pl-[110px] '>Sign Up</h1>
        <div className='flex flex-col items-center gap-4'>
          <Input label="Email" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Name" placeholder="JohnDoe" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleClick} text="Sign Up" />
        </div>
        <p className='text-sm text-black pl-16 mt-4'>Already have an account? <a href="/signin" className='text-blue-500 hover:underline'>Sign In</a></p>
         
      </div>
    </div>
  )
}

export default Signup