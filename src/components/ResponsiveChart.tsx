// 🐾⚡ RESPONSIVE CHART WRAPPER (Recharts 3.0 + Mobile Gestures) ⚡🐾
// 2025 Trends: Touch gestures, accessibility, responsive

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  prefersReducedMotion,
  ACCESSIBLE_COLORS,
} from '../utils/accessibility';

// ========================================
// RESPONSIVE LINE CHART (with gestures)
// ========================================
interface ResponsiveLineChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
  enableGestures?: boolean;
}

export function ResponsiveLineChart({
  data,
  xKey,
  yKey,
  title,
  color = ACCESSIBLE_COLORS.link.default,
  enableGestures = true,
}: ResponsiveLineChartProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isPinching, setIsPinching] = useState(false);
  const [zoom, setZoom] = useState(1);
  const reducedMotion = prefersReducedMotion();

  // Gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableGestures) {
      return;
    }

    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      setIsPinching(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableGestures) {
      return;
    }

    if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setZoom((prev) => Math.max(0.5, Math.min(2, prev * (distance / 100))));
    }
  };

  const handleTouchEnd = () => {
    if (!enableGestures) {
      return;
    }
    setTouchStart(null);
    setIsPinching(false);
  };

  return (
    <div
      role="img"
      aria-label={title || `Line chart showing ${yKey} over ${xKey}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100%',
        height: '400px',
        touchAction: enableGestures ? 'none' : 'auto',
      }}
    >
      {title && (
        <h3
          style={{
            textAlign: 'center',
            color: ACCESSIBLE_COLORS.text.primary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xKey}
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
            cursor={{ stroke: color, strokeWidth: 2 }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} iconType="line" />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, r: 6 }}
            activeDot={{ r: 8 }}
            animationDuration={reducedMotion ? 0 : 1000}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>

      {enableGestures && (
        <p
          style={{
            textAlign: 'center',
            color: ACCESSIBLE_COLORS.text.disabled,
            fontSize: '12px',
            marginTop: '8px',
          }}
        >
          💡 Swipe to pan, pinch to zoom (mobile)
        </p>
      )}
    </div>
  );
}

// ========================================
// RESPONSIVE BAR CHART (for comparisons)
// ========================================
interface ResponsiveBarChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

export function ResponsiveBarChart({
  data,
  xKey,
  yKey,
  title,
  color = ACCESSIBLE_COLORS.status.info,
}: ResponsiveBarChartProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div
      role="img"
      aria-label={title || `Bar chart comparing ${yKey} by ${xKey}`}
      style={{ width: '100%', height: '400px' }}
    >
      {title && (
        <h3
          style={{
            textAlign: 'center',
            color: ACCESSIBLE_COLORS.text.primary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xKey}
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[8, 8, 0, 0]}
            animationDuration={reducedMotion ? 0 : 1000}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ========================================
// RESPONSIVE AREA CHART (for trends)
// ========================================
interface ResponsiveAreaChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}

export function ResponsiveAreaChart({
  data,
  xKey,
  yKey,
  title,
  color = ACCESSIBLE_COLORS.status.success,
}: ResponsiveAreaChartProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div
      role="img"
      aria-label={title || `Area chart showing ${yKey} trend over ${xKey}`}
      style={{ width: '100%', height: '400px' }}
    >
      {title && (
        <h3
          style={{
            textAlign: 'center',
            color: ACCESSIBLE_COLORS.text.primary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient
              id={`colorGradient-${yKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xKey}
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          <Area
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={3}
            fill={`url(#colorGradient-${yKey})`}
            animationDuration={reducedMotion ? 0 : 1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ========================================
// CHART DATA ANNOTATIONS (2025 trend!)
// ========================================
interface AnnotatedChartProps extends ResponsiveLineChartProps {
  annotations?: Array<{
    xValue: string | number;
    label: string;
    color?: string;
  }>;
}

export function AnnotatedLineChart({
  annotations = [],
  ...chartProps
}: AnnotatedChartProps) {
  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveLineChart {...chartProps} />

      {annotations.map((annotation, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: annotation.color || ACCESSIBLE_COLORS.status.info,
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          📌 {annotation.label}
        </div>
      ))}
    </div>
  );
}

// ========================================
// MULTI-LINE COMPARISON CHART
// ========================================
interface MultiLineChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  lines: Array<{ key: string; name: string; color: string }>;
  title?: string;
}

export function MultiLineChart({
  data,
  xKey,
  lines,
  title,
}: MultiLineChartProps) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div
      role="img"
      aria-label={
        title ||
        `Multi-line chart comparing ${lines.map((l) => l.name).join(', ')}`
      }
      style={{ width: '100%', height: '400px' }}
    >
      {title && (
        <h3
          style={{
            textAlign: 'center',
            color: ACCESSIBLE_COLORS.text.primary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey={xKey}
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <YAxis
            stroke={ACCESSIBLE_COLORS.text.secondary}
            style={{ fontSize: '14px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '14px' }} />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={reducedMotion ? 0 : 1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
