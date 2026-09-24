"use client";

import { useLayoutEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** Keep Radix selection and keyboard behavior; measure only the visual indicator. */
export function WorkspaceTabs({value, onValueChange, options}: {
  value: string;
  onValueChange: (value: string) => void;
  options: [string, string][];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({left: 0, top: 0, width: 0});
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const measure = () => {
      const active = root.querySelector<HTMLElement>('[data-state="active"]');
      if (active) setIndicator({left: active.offsetLeft, top: active.offsetTop + active.offsetHeight - 2, width: active.offsetWidth});
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    root.querySelectorAll('[role="tab"]').forEach(tab => observer.observe(tab));
    return () => observer.disconnect();
  }, [value]);
  return <Tabs value={value} onValueChange={onValueChange}>
    <div ref={container} className="workspace-tabs-track">
      <TabsList className="view-tabs">
        {options.map(([key,label]) => <TabsTrigger value={key} key={key}>{label}</TabsTrigger>)}
      </TabsList>
      <span aria-hidden="true" className="tab-selection" style={{width: indicator.width, transform: `translate(${indicator.left}px, ${indicator.top}px)`, opacity: indicator.width ? 1 : 0}} />
    </div>
  </Tabs>;
}
