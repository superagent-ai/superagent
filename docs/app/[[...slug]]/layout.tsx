import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import Image from 'next/image';

function SuperagentSdkIcon() {
  return (
    <div className="size-5 relative">
      <Image
        src="/superagent-logo-square-flat-favicon.webp"
        alt="Superagent SDK"
        fill
        className="rounded object-contain dark:hidden"
      />
      <Image
        src="/superagent-logo-square-flat-favicon-dark.webp"
        alt="Superagent SDK"
        fill
        className="rounded object-contain hidden dark:block"
      />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      {...baseOptions()}
      sidebar={{
        tabs: {
          transform: (option, node) => {
            if (option.url?.includes('/sdk')) {
              return {
                ...option,
                icon: <SuperagentSdkIcon />,
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