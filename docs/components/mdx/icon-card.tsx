'use client';
import { Card as FumadocsCard } from 'fumadocs-ui/components/card';
import { ReactNode } from 'react';

interface IconCardProps {
  title: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
}

export function IconCard({ title, description, href, icon }: IconCardProps) {
  return (
    <FumadocsCard 
      title={title} 
      description={description} 
      href={href}
      icon={icon}
    />
  );
}