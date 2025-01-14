import { Routes,Route, } from "react-router-dom"
import AdminLogin from "../pages/Admin/AdminLogin"
import AdminLayout from "@/components/admin/AdminLayout"
import AdminDashboard from "@/components/admin/AdminDasboard"
import CompaniesList from "@/components/admin/CompaniesList"

const AdminRoutes = () => {
  return (
    <>
  <Routes>
    <Route path="/" element={<AdminLogin/>} />

  <Route element={ <AdminLayout />} >
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path='/companiesList' element={<CompaniesList />}/>
        </Route>
  </Routes>

    </>
  )
}

export default AdminRoutes