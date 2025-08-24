import React from 'react'
import { Button } from './ui/button'
import { Search, ShoppingCart } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className='w-full sticky top-0 bg- left-0 px-4 py-2 flex justify-between items-center'>
        <div></div>
        <div className='flex items-center gap-2'>
            <Button size="icon"><Search/></Button>
            <Button size="icon"><ShoppingCart/></Button>
        </div>
    </nav>
  )
}

export default Navbar
