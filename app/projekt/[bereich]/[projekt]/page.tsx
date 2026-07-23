import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";
import { PROJECTS, getProject } from "@/data/projects";
import { loadFragment } from "@/lib/fragment";
import { pageMetadata } from "@/lib/meta";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ bereich: p.bereich, projekt: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bereich: string; projekt: string }>;
}): Promise<Metadata> {
  const { bereich, projekt } = await params;
  const project = getProject(bereich, projekt);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.description ?? undefined,
    path: `/projekt/${bereich}/${projekt}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ bereich: string; projekt: string }>;
}) {
  const { bereich, projekt } = await params;
  const project = getProject(bereich, projekt);
  if (!project) notFound();

  const html = loadFragment(project.fragment);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <ProjectGallery />
    </>
  );
}
