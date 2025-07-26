import { ModeToggle } from "@/components/ModeToggle"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div>Layout
      <ModeToggle />
      <Outlet/>
    </div>
  )
}

export default Layout