
// src/main.tsx or main.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css'; // or './tailwind.css'
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Blog from './pages/Blog';


const App = () => {

  return (

    <BrowserRouter>
       
       <Routes>

     <Route path="/signin" element={<Signin />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/blog" element={<Blog />} />

       </Routes>
        
    </BrowserRouter>

  )
}

export default App