type CodePanelProps = {
  title: string;
  code: string;
};

export default function CodePanel({ title, code }: CodePanelProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </section>
  );
}
