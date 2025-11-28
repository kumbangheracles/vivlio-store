type RichTextRendererProps = {
  html?: string;
};

const RichTextRenderer = ({ html }: RichTextRendererProps) => {
  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default RichTextRenderer;
