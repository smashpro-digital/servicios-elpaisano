type AboutContentProps = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
};

export default function AboutContent({
  title,
  subtitle,
  paragraphs,
}: AboutContentProps) {
  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Servicios El Paisano
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className="text-base leading-7 text-slate-700"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-base leading-7 text-slate-700">
                More information about Servicios El Paisano will be available
                soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}