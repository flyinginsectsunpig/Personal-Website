import CodePanel from "../components/CodePanel";

const serviceSnippet = `public UserResponse create(UserRequest request) {
  User entity = User.builder()
      .name(request.name())
      .email(request.email())
      .role(request.role())
      .build();
  return mapToResponse(repository.save(entity));
}`;

export default function SpringBootPage() {
  return (
    <div className="page">
      <section className="card">
        <h1>Java &amp; Spring Boot Enterprise Architecture</h1>
        <p>Controller -&gt; Service -&gt; Repository with DTO mapping, validation, and OpenAPI docs.</p>
      </section>
      <CodePanel title="Service Layer Example" code={serviceSnippet} />
    </div>
  );
}
