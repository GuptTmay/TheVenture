import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const NoPage = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col gap-4 justify-center items-center">
      <h2 className="text-muted-foreground text-3xl font-mono text-center mr-1">404</h2>
      <Button variant="secondary" onClick={() => nav('/')}>Return Home</Button>
      </div>
    </div>
  )
}
