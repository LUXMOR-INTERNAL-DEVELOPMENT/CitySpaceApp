function Page({ title }) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <h1>{title}</h1>
      <p>This is the {title} page.</p>
    </div>
  );
}

export default Page;