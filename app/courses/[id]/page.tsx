import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import LikeButton from "@/components/LikeButton";
import { EnrollForm } from "@/components/EnrollForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <article className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <LikeButton courseId={course.id} initialLikes={course.likes} />
      </div>
      <p className="text-gray-700 text-lg">{course.description}</p>
      <div className="flex gap-4 text-sm font-medium text-gray-500 border-t pt-4">
        <span>Credits: {course.credits}</span>
        <span>•</span>
        <span>Type: {course.isElective ? "Elective" : "Compulsory"}</span>
      </div>
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3">Enroll in this course</h2>
        <EnrollForm courseId={course.id} />
      </div>
    </article>
  );
}