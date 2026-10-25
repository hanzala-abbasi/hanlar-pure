import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow="Policies" title={title} />
      <section className="py-16 md:py-20">
        <Container className="max-w-3xl">
          <p className="mb-10 border-l-2 border-gold bg-off-white px-5 py-4 text-sm">
            {/* TODO(content) */}
            <strong>Placeholder:</strong> Replace with final policy before launch.
          </p>
          <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:font-normal">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
