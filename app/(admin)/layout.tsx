import SidebarAdmin from "@/components/layout/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex overflow-x-hidden">
      <SidebarAdmin />
      <main className="flex-1 w-full min-w-0 min-h-screen md:ml-64 pt-20 md:pt-8 px-4 md:px-8 pb-10">
        <div className="max-w-6xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
