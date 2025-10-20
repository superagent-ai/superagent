import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Mermaid } from "@/components/mdx/mermaid";
import { IconCard } from "@/components/mdx/icon-card";
import { APIPage } from "fumadocs-openapi/ui";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { openapi } from "@/lib/openapi";
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
  Check,
  EyeOff,
} from "lucide-react";
import { SiPython, SiTypescript } from "react-icons/si";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
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
    Check,
    EyeOff,
    TypeScriptIcon: SiTypescript,
    PythonIcon: SiPython,
    img: (props) => <ImageZoom {...(props as any)} />,
    ...components,
  };
}
