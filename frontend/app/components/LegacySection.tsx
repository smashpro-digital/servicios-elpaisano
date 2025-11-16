type Props = { html: string };

export default function LegacySection({ html }: Props) {
  return (
    <section
      className="page-section"
      // We trust this static content you control
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
