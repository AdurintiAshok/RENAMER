import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginCard from "./components/LoginCard";
import ImageRenamer from "./components/ImageRenamer";
import PrivateRoute from "./components/PrivateRoute";
import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./utils/firebase"; // Adjust path as needed

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);



  return (
    <Router>
     
          <Routes>
            <Route path="/" element={<ImageRenamer />} />
     
          </Routes>
    
    </Router>
  );
}

export default App;
