import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authProvider";
import { useEffect } from "react";

const Container = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-neutral-100 flex flex-col">
      <Header />

      <section className="p-8 flex-1 flex pb-32">
        <div className="max-w-6xl w-full mx-auto">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default Container;
