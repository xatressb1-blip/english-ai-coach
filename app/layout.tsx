import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeechProvider } from "@/context/SpeechContext";
import { InterviewProvider } from "@/context/InterviewContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { EvaluationProvider } from "@/context/EvaluationContext";
import { LiveCoachProvider } from "@/context/LiveCoachContext";
import { SpeechActivityProvider } from "@/context/SpeechActivityContext";
import { VoiceCoachProvider } from "@/context/VoiceCoachContext";
import Footer from "@/components/layout/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {

  title: {
    default: "English AI Coach",
    template: "%s | English AI Coach",
  },

  description:
    "AI-powered English Interview Practice Platform for Students",
   // metadataBase: new URL("https://english-ai-coach.vercel.app"),
  applicationName: "English AI Coach",
icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "English",
    "Interview",
    "AI",
    "Speaking",
    "IELTS",
    "Job Interview",
    "Education",
  ],

  authors: [
    {
      name: "Faculty of Information Technology",
    },
  ],

  creator: "Faculty of Information Technology",

  robots: {

    index: true,

    follow: true,

  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
   <body
  className="
    min-h-screen
    flex
    flex-col
    bg-gray-50
    text-gray-900
    overflow-x-hidden
    antialiased
    selection:bg-blue-200
    selection:text-blue-900
  "
>

    <InterviewProvider>

        <SpeechProvider>

            <SpeechActivityProvider>

    <VoiceCoachProvider>

        <LiveCoachProvider>

            <EvaluationProvider>

                        <HistoryProvider>

                            <main
  className="
    flex-1
    w-full
    max-w-screen-2xl
    mx-auto
    px-4
    sm:px-6
    lg:px-8
  "
>

                                {children}

                            </main>

                            <Footer />

                        </HistoryProvider>

                    </EvaluationProvider>

</LiveCoachProvider>

</VoiceCoachProvider>

</SpeechActivityProvider>

        </SpeechProvider>

    </InterviewProvider>

</body>
    </html>
  );
}
