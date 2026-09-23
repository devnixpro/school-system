import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container-custom py-24 text-center">
        <h1 className="font-poppins text-5xl font-bold text-navy-900 mb-4">
          DevNixEdu
        </h1>
        <p className="text-navy-500 text-lg mb-2">
          Multi-Tenant School Management Platform
        </p>
        <p className="text-navy-400 text-sm">
          Frontend scaffold running. Modules will be added by the team.
        </p>
      </main>
      <Footer />
    </>
  );
}