const PageBody = ({ content }: { content: string }) => {
  return (
    <article className="max-w-2xl mx-auto prose">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};
export default PageBody;
