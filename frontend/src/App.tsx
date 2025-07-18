import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [msg, setMsg] = useState("Old msg!!");
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      fetch("http://localhost:3000/api/v1/post/get")
        .then((res) => res.json())
        .then((data) => {
          console.log("GET:", data);
          setMsg(data.message);
        });
    }, 2 * 1000);

    return () => clearTimeout(timeOutId);
  }, []);

  return <>{msg}</>;
}

export default App;
