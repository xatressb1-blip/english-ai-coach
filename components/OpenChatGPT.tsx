"use client";

export default function OpenChatGPT() {
  const handleOpen = () => {
    window.open("https://chatgpt.com", "_blank");
  };

  return (
    <button
      onClick={handleOpen}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
    >
      🌐 Open ChatGPT
    </button>
  );
}