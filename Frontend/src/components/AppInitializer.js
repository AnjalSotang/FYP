import { jwtDecode } from "jwt-decode"; // ✅ correct for non-default export
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProfile, fetchProfile } from "../../store/authSlice";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const { token, data: profile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || profile) return;

    try {
      const decoded = jwtDecode(token); // ✅ correct use
      const { role, id } = decoded;

      console.log("Decoded ID:", id);
      console.log("Decoded role:", role);

      if (role === "admin") {
        dispatch(fetchAdminProfile());
      } else {
        dispatch(fetchProfile());
      }
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }, [token, profile, dispatch]);

  return children;
}


// import * as jwt from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react"; // Missing import
// import { fetchAdminProfile, fetchProfile } from "../../store/authSlice";

// export default function AppInitializer({ children }) {
//   const dispatch = useDispatch();
//   const { token, data: profile } = useSelector((state) => state.auth);

//   useEffect(() => {
//     let role = null;
//     if (token) {
//       try {
//         const decoded = jwt.jwtDecode(token); // Use the correct function from the module
//         role = decoded.role; // assumes your token contains { id, role, ... }
//         console.log("Decoded token:", role);
//       } catch (e) {
//         console.error("Invalid token:", e);
//       }
//     }

//     if (token && !profile) {
//       if (role === 'admin') {
//         dispatch(fetchAdminProfile());
//       } else {
//         dispatch(fetchProfile());
//       }
//     }
//   }, [token, profile, dispatch]);

//   return children;
// }