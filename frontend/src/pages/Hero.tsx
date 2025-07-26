import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div>Hero

      <Button onClick={() => navigate('/feeds')}>go to feed</Button>
    </div>
  )
}

export default Hero