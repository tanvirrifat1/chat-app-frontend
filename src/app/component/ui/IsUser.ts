import { getCurrentUser } from "@/app/service/authService";
import { jwtDecode } from "jwt-decode";

const IsUser = async () => {
  try {
    const token = await getCurrentUser();

    if (token) {
      const decoded = jwtDecode(token);

      return decoded;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default IsUser;
