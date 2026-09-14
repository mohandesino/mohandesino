import { Outlet } from "react-router-dom";
import Header from "../components/Header";

function MainLayout() {
  return (
    <div dir="rtl">

      <Header />

      <main>
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;