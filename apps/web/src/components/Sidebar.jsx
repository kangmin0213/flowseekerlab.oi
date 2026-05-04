
import React from 'react';
import WeeklyAlphaWidget from './WeeklyAlphaWidget.jsx';
import RecentPostsWidget from './RecentPostsWidget.jsx';

function Sidebar() {
  return (
    <aside className="mt-6 lg:mt-0">
      <div className="sticky top-28 bg-muted/20 rounded-2xl spacing-sidebar border border-border/40 shadow-sm flex flex-col">
        <WeeklyAlphaWidget />
        
        <div className="mt-2">
          <RecentPostsWidget />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
