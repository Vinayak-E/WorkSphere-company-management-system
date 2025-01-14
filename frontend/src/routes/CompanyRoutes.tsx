import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from '@/components/company/CompanyLayout'
import Departments from '@/components/company/Departments'

const CompanyRoutes = () => {
    return (
    <Routes>
      <Route />
      <Route
          path="/"
          element={<Departments/> }
        />
    </Routes>
    )
  }
  
  export default CompanyRoutes