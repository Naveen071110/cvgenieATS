import Header from "@/components/header";
import Footer from "@/components/footer";
import { InteractiveDemo } from "@/components/interactive-demo";

export default function ATSScore() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main className="pt-8">
        <InteractiveDemo />
      </main>
      <Footer />
    </div>
  );
}
