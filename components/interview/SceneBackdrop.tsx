import { ReactNode } from "react";

export type InterviewScene = "lobby" | "corridor" | "room";

const sceneImages: Record<InterviewScene, string> = {
  lobby: "/interview/scenes/corporate-lobby.webp",
  corridor: "/interview/scenes/office-corridor.webp",
  room: "/interview/scenes/interview-room.webp",
};

interface Props {
  scene: InterviewScene;
  children: ReactNode;
  className?: string;
  overlay?: "light" | "medium" | "dark";
}

const overlays = {
  light: "bg-slate-950/35",
  medium: "bg-slate-950/55",
  dark: "bg-slate-950/72",
};

export default function SceneBackdrop({ scene, children, className = "", overlay = "medium" }: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${sceneImages[scene]})` }}
        aria-hidden="true"
      />
      <div className={`absolute inset-0 ${overlays[overlay]}`} aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.22),transparent_38%)]" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
