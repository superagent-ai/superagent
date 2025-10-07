'use client';
import { use, useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const id = useId();
  const { theme } = useTheme();
  const [svg, setSvg] = useState<string>();

  useEffect(() => {
    const renderChart = async () => {
      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
      });

      const { svg: renderedSvg } = await mermaid.render(id, chart);
      setSvg(renderedSvg);
    };

    renderChart().catch(console.error);
  }, [id, chart, theme]);

  if (!svg) {
    return <div className="flex items-center justify-center p-4">Loading diagram...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}