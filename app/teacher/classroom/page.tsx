import TeacherClassroomDashboard from "@/components/classroom/TeacherClassroomDashboard";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default function TeacherClassroomPage() {
  return (
    <>
    <Navbar />
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-100 via-slate-50 to-indigo-50 px-2 py-5 sm:px-5 sm:py-8">
      <TeacherClassroomDashboard />
    </main>
    </>
  );
}
