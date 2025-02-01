import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-grow p-8">
          {/* Empty space for future content */}
        </div>
      </div>
  );
}
