"use client";

import { useState } from "react";
import type { Course } from "@/lib/courses";

const API = process.env.NEXT_PUBLIC_API_URL;

type LikeButtonProps = {
  courseId: string;
  initialLikes: number;
};

export default function LikeButton({ courseId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    setFailed(false);
    try {
      const res = await fetch(`${API}/courses/${courseId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const course: Course = await res.json();
      setLikes(course.likes);
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-medium"
      >
        <span>❤</span>
        <span>{likes}</span>
      </button>
      {failed && <p className="text-red-600 text-xs">Failed to like</p>}
    </div>
  );
}
