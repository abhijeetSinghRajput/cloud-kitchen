// pages/admin/AdminLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/admin/Navbar'

const AdminLayout = () => {
  return (
    <div>
        <Navbar />
        <div className="p-2 sm:p-4 max-w-screen-xl mx-auto">
            <Outlet /> 
        </div>
    </div>
  )
}

export default AdminLayout