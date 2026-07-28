import InterviewEngine from "@/components/interview/InterviewEngine";

export default function InterviewPage() {

  return (

    <main
      className="
        min-h-[100dvh]
        bg-slate-100

        px-4
        py-4

        sm:px-6
        sm:py-6

        lg:px-8
        lg:py-8

        xl:px-10
        xl:py-10
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-6xl
        "
      >

        <InterviewEngine />

      </div>

    </main>

  );

}
