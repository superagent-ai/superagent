import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      {...baseOptions()}
      sidebar={{
        tabs: {
          transform: (option, node) => {
            if (option.url?.includes('safety-agent')) {
              return {
                ...option,
                icon: (
                  <div className="size-5 relative">
                    <Image
                      src="/logo.png"
                      alt="Safety Agent"
                      fill
                      className="rounded object-contain"
                    />
                  </div>
                ),
              };
            }
            if (option.url?.includes('legacy')) {
              return {
                ...option,
                icon: (
                  <div className="size-5 relative">
                    <Image
                      src="/ninja_icon.png"
                      alt="Legacy"
                      fill
                      className="rounded object-contain"
                    />
                  </div>
                ),
              };
            }
            return option;
          },
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}