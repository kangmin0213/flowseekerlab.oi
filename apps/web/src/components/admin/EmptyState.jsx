
import React from 'react';
import { FileQuestion } from 'lucide-react';

function EmptyState({ title = "No data found", description = "There is nothing to display here yet.", icon: Icon = FileQuestion, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center admin-card">
      <div className="h-16 w-16 bg-[hsl(var(--admin-hover))] rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
      </div>
      <h3 className="text-lg font-serif font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
