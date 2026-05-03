
import React from 'react';
import WeeklyAlphaWidget from './WeeklyAlphaWidget.jsx';
import RecentPostsWidget from './RecentPostsWidget.jsx';

function Sidebar() {
  return (
    <aside className="lg:w-1/3 lg:pl-6 xl:pl-8 mt-12 lg:mt-0">
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
