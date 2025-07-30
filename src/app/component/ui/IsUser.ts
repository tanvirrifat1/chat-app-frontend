import { getCurrentUser } from "@/app/service/authService";
import { jwtDecode } from "jwt-decode";

const IsUser = async () => {
  try {
    const token = await getCurrentUser();
    console.log("Token:", token);

    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
    } else {
      console.log("No token found.");
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

export default IsUser;
