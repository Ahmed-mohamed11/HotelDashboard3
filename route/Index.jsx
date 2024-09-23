import { Routes, Route } from "react-router-dom";
import Error404Modern from "../pages/error/404-modern";
import { Suspense } from "react";

//! Admin Pages Routes
const AdminPages = ({loading}) => {
  return (
    <Suspense fallback={<div />}>
      <Routes>
        <Route
          exact
          path={`${import.meta.env.VITE_PUBLIC_URL}/`}
          element={<div>ServerDash</div>}
        />
       
        <Route path={"/*"} element={<Error404Modern />} />
      </Routes>
    </Suspense>
  );
};


export { AdminPages };
