import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
