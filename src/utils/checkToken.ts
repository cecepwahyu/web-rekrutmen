export const checkTokenValidity = async (): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.status === 401) {
        return false; // Token is invalid or expired
      }
  
      const data = await response.json();
      return data?.responseCode === "000"; // Adjust based on your API's success response
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  };
  