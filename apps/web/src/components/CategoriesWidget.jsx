
import React, { useState } from 'react';
import { categoriesHierarchy } from '@/data/mockData.js';
import { ChevronDown, ChevronRight } from 'lucide-react';

function CategoriesWidget() {
  const [expanded, setExpanded] = useState({
    'crypto-alpha': true // Default open for demonstration
  });

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mb-10">
      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5 pb-2 border-b border-border">
        Categories
      </h3>
      <ul className="flex flex-col gap-1.5">
        {categoriesHierarchy.map((category) => (
          <li key={category.id} className="flex flex-col">
            <div className="flex items-center justify-between group py-2">
              <button className="flex-grow text-left text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                <span className="relative inline-block">
                  {category.name}
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground/30 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                </span>
              </button>
              
              {category.children && category.children.length > 0 && (
                <button 
                  onClick={() => toggleExpand(category.id)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                  aria-label={expanded[category.id] ? "Collapse category" : "Expand category"}
                >
                  {expanded[category.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>

            {/* Sub-categories */}
            {category.children && category.children.length > 0 && expanded[category.id] && (
              <ul className="flex flex-col gap-1.5 pl-4 mt-1 mb-2 border-l-2 border-border/50">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <button className="group flex items-center justify-between w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 pl-2">
                      <span className="relative">
                        {child.name}
                        <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground/20 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesWidget;
