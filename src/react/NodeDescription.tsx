import React, { Suspense, memo } from 'react';

interface NodeDescriptionProps {
  id: string;
  description?: string;
}

export default memo(function NodeDescription({
  id,
  description,
}: NodeDescriptionProps) {
  const FallbackDescription = () =>
    description ? (
      <span dangerouslySetInnerHTML={{ __html: description }} />
    ) : null;

  const Description = React.lazy(() =>
    (async () => {
      try {
        return await import(`./customNodes/${id}`);
      } catch {
        return Promise.resolve({ default: FallbackDescription });
      }
    })()
  );

  return (
    <Suspense fallback={<FallbackDescription />}>
      <Description />
    </Suspense>
  );
});
