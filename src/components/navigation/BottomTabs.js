'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './BottomTabs.css';

const tabs = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/threats', icon: '🎯', label: 'Threats' },
  { path: '/valech', icon: '📊', label: 'Analytics' },
  { path: '/abilities', icon: '⚡', label: 'Actions' }
];

export const BottomTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-tabs" role="navigation" aria-label="Primary navigation">
      {tabs.map(tab => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`tab ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
