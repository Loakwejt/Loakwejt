'use client';

import { useState } from 'react';
import { cn, Tabs, TabsList, TabsTrigger, TabsContent } from '@builderly/ui';
import { Palette } from './Palette';
import { Inspector } from './Inspector';
import { SectionPicker } from './SectionPicker';
import { useEditorStore } from '../store/editor-store';

interface RightSidebarProps {
  defaultTab?: 'components' | 'sections' | 'properties';
}

export function RightSidebar({ defaultTab = 'components' }: RightSidebarProps) {
  const { selectedNodeId } = useEditorStore();
  
  // Auto-switch to properties when a node is selected
  const [activeTab, setActiveTab] = useState<'components' | 'sections' | 'properties'>(defaultTab);
  
  // Switch to properties tab when node is selected
  const effectiveTab = selectedNodeId && activeTab !== 'properties' ? 'properties' : activeTab;

  return (
    <div className="flex flex-col h-full bg-[hsl(220,10%,14%)] overflow-hidden">
      {/* Tabs Header */}
      <Tabs 
        value={effectiveTab} 
        onValueChange={(v) => setActiveTab(v as typeof activeTab)} 
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="h-8 rounded-none border-b border-border bg-[hsl(220,10%,12%)] p-0 justify-start gap-0 w-full shrink-0">
          <TabsTrigger 
            value="components" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[10px] px-1 gap-1"
          >
            <span className="text-[9px]">🧩</span>
            Elemente
          </TabsTrigger>
          <TabsTrigger 
            value="sections" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[10px] px-1 gap-1"
          >
            <span className="text-[9px]">📦</span>
            Sektionen
          </TabsTrigger>
          <TabsTrigger 
            value="properties" 
            className="flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-[10px] px-1 gap-1"
          >
            <span className="text-[9px]">⚙️</span>
            Eigenschaften
          </TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="flex-1 overflow-hidden m-0">
          <Palette />
        </TabsContent>

        <TabsContent value="sections" className="flex-1 overflow-hidden m-0">
          <SectionPicker />
        </TabsContent>

        <TabsContent value="properties" className="flex-1 overflow-auto m-0">
          <Inspector />
        </TabsContent>
      </Tabs>
    </div>
  );
}
