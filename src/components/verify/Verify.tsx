import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      console.error("No token found!");
      return;
    }

    const apiUrl = `${import.meta.env.VITE_APP_API_URL}/api/verify-email`;

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Email verified successfully!");
          navigate("/login");  // Redirect after success
        } else {
          alert("Verification failed!");
        }
      })
      .catch((err) => console.error("Error:", err));
  }, [searchParams, navigate]);

  return <h2>Verifying your email...</h2>;
};

export default VerifyEmail;
