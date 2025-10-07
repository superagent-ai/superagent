import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Mermaid } from '@/components/mdx/mermaid';
import { IconCard } from '@/components/mdx/icon-card';
import {
  Shield,
  Ban,
  Lock,
  Zap,
  GitMerge,
  BarChart3,
  Rocket,
  Settings,
  BookOpen,
  Cloud,
  Workflow,
  Cpu,
  Server,
  Bot,
  Activity,
} from 'lucide-react';
import { SiPython, SiTypescript } from 'react-icons/si';

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Mermaid,
    IconCard,
    // Lucide icons
    Shield,
    Ban,
    Lock,
    Zap,
    GitMerge,
    BarChart3,
    Rocket,
    Settings,
    BookOpen,
    Cloud,
    Workflow,
    Cpu,
    Server,
    Bot,
    Activity,
    TypeScriptIcon: SiTypescript,
    PythonIcon: SiPython,
    ...components,
  };
}
