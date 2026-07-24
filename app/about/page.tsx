export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-slate-800">

          🤖 English AI Coach

        </h1>

        <p className="mt-3 text-lg text-slate-500">

          Learn English. Build Confidence. Ace Interviews.

        </p>

        <div className="mt-4 inline-block rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

          Version Beta 0.9

        </div>

      </div>

      <section className="grid gap-8 md:grid-cols-2">

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="mb-4 text-2xl font-bold">

            🎯 Mission

          </h2>

          <p className="leading-8 text-slate-600">

            English AI Coach helps students practice English speaking,
            improve interview skills, and receive AI-powered feedback
            in a realistic interview environment.

          </p>

        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">

          <h2 className="mb-4 text-2xl font-bold">

            👨‍🎓 Target Users

          </h2>

          <ul className="space-y-3 text-slate-600">

            <li>• College students</li>

            <li>• University students</li>

            <li>• Job seekers</li>

            <li>• English learners</li>

          </ul>

        </div>

      </section>

      <section className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-2xl font-bold">

          🚀 Key Features

        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>🎤 AI Interview Practice</div>

          <div>🧠 AI Evaluation</div>

          <div>📊 Learning Dashboard</div>

          <div>📜 Interview History</div>

          <div>💬 Speaking Assessment</div>

          <div>📈 Progress Tracking</div>

        </div>

      </section>

      <section className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="mb-4 text-2xl font-bold">

          👨‍💻 Developed by

        </h2>

        <p className="leading-8 text-slate-600">

          Faculty of Information Technology

          <br />

          College of Agricultural Mechanics

        </p>

      </section>

    </main>
  );
}