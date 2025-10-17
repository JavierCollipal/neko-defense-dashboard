'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './TopTabs.css';

const topTabs = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/threats', icon: '🎯', label: 'Threats' },
  { path: '/dina', icon: '📚', label: 'DINA' },
  { path: '/valech', icon: '📊', label: 'Analytics' },
  { path: '/abilities', icon: '⚡', label: 'Abilities' },
  { path: '/confessions', icon: '📝', label: 'Blog' },
  { path: '/youtube', icon: '📺', label: 'Videos' },
  { path: '/rag', icon: '🗄️', label: 'RAG' }
];

export const TopTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="top-tabs" role="navigation" aria-label="Top navigation">
      <div className="top-tabs-container">
        {topTabs.map(tab => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`top-tab-button ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="top-tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="top-tab-label">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
