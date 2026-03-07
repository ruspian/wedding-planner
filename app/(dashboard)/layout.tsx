import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <Sidebar />

      <main className="flex-1 w-full min-h-screen md:ml-64 pt-20 md:pt-8 px-4 md:px-8 pb-10">
        <div className="max-w-5xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
