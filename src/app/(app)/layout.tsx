import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[url('/bg-win.png')]/  fixed top-0 bottom-0 left-0 right-0  h-screen w-full bg-fixed max-md:bg-opacity-10 bg-no-repeat bg-cover">
      <Navbar />
      <div className="md:w-[100%] mt-[60px] md:mt-[70px] max-md:mb-[80px] pb-20 ">
        {children}
      </div>
      <Footer />
    </div>
  );
}
