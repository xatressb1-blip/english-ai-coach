"use client";

interface CopyPromptProps {
  text: string;
}

export default function CopyPrompt({ text }: CopyPromptProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("✅ Prompt copied successfully!");
    } catch (error) {
      alert("❌ Unable to copy prompt.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
    >
      📋 Copy Prompt
    </button>
  );
}