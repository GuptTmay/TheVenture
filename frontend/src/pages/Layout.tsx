import { ModeToggle } from "@/components/ModeToggle"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div>Layout
      <nav>
        
      </nav>
      <ModeToggle />
      <Outlet/>
    </div>
  )
}

export default Layout