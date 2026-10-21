import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 py-16 text-center sm:py-20">
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
        Trợ lý luyện phỏng vấn tiếng Anh
      </span>

      <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-bold tracking-tight text-blue-700 sm:text-5xl lg:text-6xl">
        English AI Interview Coach
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
        Luyện trả lời với nhà tuyển dụng ảo, nhận phản hồi và từng bước cải thiện câu trả lời của chính mình.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/interview"
          className="rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white transition hover:bg-blue-700"
        >
          TỰ LUYỆN PHỎNG VẤN
        </Link>
        <Link
          href="#learning-path"
          className="rounded-xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 transition hover:bg-slate-50"
        >
          Học theo hướng dẫn
        </Link>
        <Link
          href="/teacher/classroom"
          className="rounded-xl border border-blue-200 bg-blue-50 px-7 py-4 text-base font-bold text-blue-800 transition hover:bg-blue-100"
        >
          Dành cho giáo viên
        </Link>
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-600">
        Tự luyện không cần mã lớp. Khi học theo Session, hãy mở liên kết tham gia do giáo viên cung cấp.
      </p>
    </section>
  );
}
