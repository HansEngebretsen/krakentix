import React, { useState, useMemo, useEffect, useRef } from 'react';

// Design Tokens & Semantic Variables (Scaled to 75%)
const CSS_VARS = `
:root {
  /* Light Mode Palette */
  --color-bg-main: #dce5eb;         /* Greybg */
  --color-surface: #ebeff3;         /* Whitebg */
  --color-surface-muted: rgba(255, 255, 255, 0.4);
  --color-border-subtle: rgba(79, 84, 127, 0.1);
  --color-border-base: rgba(79, 84, 127, 0.2);
  
  --color-text-dim: rgba(79, 84, 127, 0.7);
  --color-text-base: #4f547f;       /* Text */
  --color-text-dark: #4e537d;       /* Darkbg */
  
  --color-accent-bg: #a7e4e9;       /* Highlightbg */
  --color-accent-text: #005670;
  
  /* High Contrast Solid Badges */
  --color-success-bg: #93d7c2;
  --color-success-text: #006948;
  --color-success-primary: #059669; 
  
  --color-danger-bg: #fecaca;
  --color-danger-text: #7f1d1d;
  --color-danger-primary: #dc2626;

  /* Geometry & Scale (Original * 0.75) */
  --space-2: 0.375rem;
  --space-3: 0.5625rem;
  --space-4: 0.75rem;
  --space-5: 0.9375rem;
  --space-6: 1.125rem;
  --space-8: 1.5rem;
  --space-10: 1.875rem;
  --space-12: 2.25rem;
  --space-16: 3rem;

  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  
  /* Typography Variables (Original * 0.75) */
  --text-xs: 8.25px;
  --text-sm: 0.65625rem;
  --text-base: 0.75rem;
  --text-lg: 0.84375rem;
  --text-xl: 0.9375rem;
  --text-2xl: 1.125rem;
  --text-3xl: 1.40625rem;
  --text-4xl: 1.6875rem;
  --text-5xl: 2.25rem;
  
  --radius-outer: clamp(9px, 3vw, 18px);
  --radius-inner: clamp(6px, 1.5vw, 12px);
  --radius-header: 99px;
}

.dark-mode {
  /* Dark Mode Palette Mapping */
  --color-bg-main: #42476e;         /* Darkbg */
  --color-surface: #4f547f;         /* Text */
  --color-surface-muted: rgba(0, 0, 0, 0.15);
  --color-border-subtle: rgba(191, 201, 216, 0.1);
  --color-border-base: rgba(191, 201, 216, 0.2);
  
  --color-text-dim: rgba(191, 201, 216, 0.7);
  --color-text-base: #bfc9d8;       /* textondarkbg */
  --color-text-dark: #ebeff3;       /* Whitebg */
  
  --color-accent-bg: rgba(167, 228, 233, 0.15);
  --color-accent-text: #a7e4e9;     /* Highlightbg */

  --color-success-bg: rgba(0, 86, 112, 0.6);
  --color-success-text: #a7e4e9;
  --color-success-primary: #34d399;
  
  --color-danger-bg: rgba(185, 28, 28, 0.4);
  --color-danger-text: #fca5a5;
  --color-danger-primary: #f87171;
}

/* Custom Scrollbar System */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-base) transparent;
}

::-webkit-scrollbar {
  width: 4.5px;
  height: 4.5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-base);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-dim);
}

/* Highlight Animation */
@keyframes delayedFade {
  0% { background-color: transparent; }
  10% { background-color: var(--color-border-base); }
  90% { background-color: var(--color-border-base); }
  100% { background-color: transparent; }
}
.row-highlight td {
  animation: delayedFade 7s ease-in-out forwards;
}

/* Modal Settings */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
}
.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
.modal-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border-base);
  border-radius: var(--radius-inner);
  padding: var(--space-6);
  width: 90%;
  max-width: 300px;
  box-shadow: 0 7.5px 22.5px rgba(0,0,0,0.2);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: var(--space-4);
}
.modal-title {
  font-size: var(--text-lg);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-dark);
  margin: 0;
}
.modal-close {
  background: transparent;
  border: none;
  color: var(--color-text-dim);
  cursor: pointer;
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.modal-close:hover { color: var(--color-text-dark); background: var(--color-border-subtle); }

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  font-weight: 700;
  color: var(--color-text-base);
  text-transform: uppercase;
  font-size: var(--text-sm);
  letter-spacing: 0.05em;
}
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 18px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--color-border-base);
  border-radius: 18px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 13.5px;
  width: 13.5px;
  left: 2.25px;
  bottom: 2.25px;
  background-color: var(--color-surface);
  border-radius: 50%;
}
input:checked + .slider { background-color: var(--color-text-dark); }
input:checked + .slider:before { transform: translateX(12px); }

/* Core System */
.app-container {
  min-height: 100vh;
  background-color: var(--color-bg-main);
  color: var(--color-text-dark);
  font-family: var(--font-sans);
  padding: 0 var(--space-4) var(--space-6);
  @media (min-width: 768px) { padding: 0 var(--space-6) var(--space-12); }
  @media (min-width: 1024px) { padding: 0 var(--space-8) var(--space-16); }
}

.dashboard-layout {
  max-width: 54rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  @media (min-width: 768px) { gap: var(--space-12); }
}

/* Header & Search */
.header-system {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  @media (min-width: 768px) { gap: var(--space-6); }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100vw;
    margin-inline: calc(50% - 50vw);
    padding: var(--space-4) var(--space-4) 0;
    @media (min-width: 768px) { padding: 12px 12px 0; }
    @media (min-width: 1024px) { padding: 12px 12px 0; }
  }

  .logo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    &:hover { opacity: 0.8; }
  }

  .main-logo-icon {
    display: block;
    flex: none;
    width: 20px;
    height: 20px;
    background: var(--color-text-dark);
    -webkit-mask: url("./assets/logo.png") center / contain no-repeat;
    mask: url("./assets/logo.png") center / contain no-repeat;
  }

  .header-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    text-align: left;
    margin: 0;
    @media (min-width: 768px) { font-size: 12px; }
  }
  .header-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .header-subtitle {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: var(--color-text-dim);
    margin: 0;
    @media (min-width: 768px) { font-size: 12px; }
  }

  .header-actions {
    display: flex;
    gap: var(--space-2);
  }

  .icon-btn {
    background: transparent;
    color: var(--color-text-dark);
    border: none;
    padding: var(--space-2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    &:hover { opacity: 0.7; background: var(--color-border-subtle); }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-3);
    flex: 1 1 auto;
    min-width: 0;
  }
  @media (max-width: 767px) {
    .top-bar { flex-wrap: wrap; row-gap: var(--space-2); padding: 10px 12px 0; }
    .logo-container { flex: 0 0 100%; min-width: 0; }
    .header-right { flex: 0 0 100%; order: 2; }
    .top-bar .header-right .search-container { flex: 1 1 auto; }
  }
  .header-right .search-container {
    flex: 0 1 240px;
    min-width: 120px;
    width: auto;
  }
  .header-right .search-container .search-input {
    padding: 4px 26px 4px 10px;
    font-size: 11.5px;
    font-weight: 400;
    @media (min-width: 768px) { padding: 4px 26px 4px 10px; font-size: 11.5px; }
  }
  .header-right .search-clear { right: 6px; }
  .search-kbd {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    min-width: 14px;
    padding: 0 3px;
    border: 1px solid var(--color-border-base);
    border-radius: 4px;
    font: 500 9px/1.3 var(--font-mono);
    text-align: center;
    color: var(--color-text-dim);
    pointer-events: none;
  }
  .search-container {
    position: relative;
    width: 100%;

    .search-input {
      width: 100%;
      background: var(--color-surface);
      border: 1px solid var(--color-border-base);
      padding: var(--space-4) var(--space-5);
      font-size: var(--text-base);
      @media (min-width: 768px) { padding: var(--space-5); font-size: var(--text-xl); }
      font-weight: 500;
      font-family: var(--font-mono);
      border-radius: var(--radius-header);
      color: var(--color-text-dark);

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--color-text-dark);
      }
      &::placeholder { color: var(--color-text-dim); }
    }

    .search-clear {
      position: absolute;
      right: var(--space-5);
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      padding: 0;
      color: var(--color-text-dim);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { color: var(--color-text-dark); }
    }
  }
}

/* Common Badges */
.stat-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  border-radius: 4.5px;
  line-height: 1;
  @media (min-width: 768px) { font-size: var(--text-base); }
}
.stat-badge.positive { background: var(--color-success-bg); color: var(--color-success-text); }
.stat-badge.negative { background: var(--color-danger-bg); color: var(--color-danger-text); }

.net-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  z-index: 10;
  @media (min-width: 768px) { top: var(--space-4); right: var(--space-4); }
}

/* Global Tooltip (Unified API) */
.chart-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--space-2);
  z-index: 50;
  background: var(--color-text-dark);
  color: var(--color-surface);
  padding: var(--space-2) var(--space-3);
  border-radius: 4.5px;
  font-size: var(--text-xs);
  white-space: nowrap;
  box-shadow: 0 3px 9px rgba(0,0,0,0.15);
  pointer-events: none;
  text-align: center;
  font-family: var(--font-mono);
  flex-direction: column;
  gap: 1.5px;
}
.bar-wrapper:hover .chart-tooltip,
.mini-map-dot:hover .chart-tooltip {
  display: flex;
}
.chart-tooltip .tooltip-title { 
  font-weight: 800; 
  text-transform: uppercase; 
  letter-spacing: 0.05em;
}
.chart-tooltip .tooltip-value {
  font-weight: 500;
  opacity: 0.9;
}
.chart-tooltip .stat-badge {
  font-size: var(--text-xs);
  padding: 1.5px 4.5px;
  border-radius: 3px;
  line-height: 1;
}

/* Summary Grid */
.summary-grid {
  background: var(--color-surface-muted);
  padding: var(--space-6);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-outer);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  width: 100%;
  font-family: var(--font-mono);

  @media (min-width: 768px) { padding: var(--space-10); gap: var(--space-12); }
  @media (min-width: 1024px) { grid-template-columns: auto auto auto minmax(0, 1fr); }

  &.global-summary {
    background: transparent;
    padding: 0;
    border: none;
    border-radius: 0;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .label {
      font-size: var(--text-xs);
      color: var(--color-text-dim);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: var(--space-2);
      margin-bottom: 0;
      font-family: var(--font-sans);
    }
    .value {
      font-size: var(--text-2xl);
      font-weight: 700;
      letter-spacing: -0.05em;
      @media (min-width: 768px) { font-size: var(--text-5xl); }
    }
  }

  .summary-item.full-width-mobile {
    grid-column: 1 / -1;
  }
  @media (min-width: 1024px) {
    .summary-item.full-width-mobile {
      grid-column: auto;
    }
  }
}

/* Mini Map Styles */
.mini-map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}
.mini-map-header .attended-stat {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.mini-map-sub-stat {
  font-family: var(--font-mono);
  font-size: 6.75px;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 1.5px;
}
.mini-map-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-subtle);
  font-family: var(--font-mono);
  font-size: 6.75px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-dim);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4.5px;
}
.legend-item .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.legend-item .dot.attended { background: var(--color-text-dark); }
.legend-item .dot.positive { background: var(--color-success-primary); }
.legend-item .dot.negative { background: var(--color-danger-primary); }

.mini-map-season-marker {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 6.75px;
  font-weight: 800;
  padding: 1.5px 4.5px;
  background: var(--color-surface);
  border-radius: 3px;
  color: var(--color-text-dim);
  margin-inline: 3px;
}
.mini-map-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mini-map-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3px;
}
.mini-map-row .mini-map-season-marker {
  justify-content: center;
  min-width: 20px;
  margin-inline: 0 3px;
}
/* playoffs nest under their season: indented one marker width */
.mini-map-row.is-playoffs { padding-left: 23px; }
.mini-map-dot {
  width: 7.5px;
  height: 7.5px;
  cursor: pointer;
  position: relative;
  @media (min-width: 768px) { width: 9px; height: 9px; margin-inline: 1.5px; }
}
.mini-map-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--dot-color);
}
.mini-map-dot:hover {
  z-index: 50;
}
.mini-map-dot:hover::before {
  box-shadow: 0 0 0 1.5px var(--color-surface);
}

/* Season Section Structure */
.season-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-dark);
  padding-inline: var(--space-2);
  @media (min-width: 768px) {
    font-size: var(--text-xl);
    padding-inline: 0;
  }
}

.season-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border-base);
  padding: var(--space-4);
  border-radius: var(--radius-outer);
  
  @media (min-width: 768px) { padding: var(--space-12); }
  
  &.no-padding {
    padding: 0;
    border: none;
    background: transparent;
  }
}

/* Season Ledger Layout */
.ledger-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: var(--color-bg-main);
  overflow: hidden;
  border-radius: var(--radius-inner);
  align-items: center;
  @media (min-width: 900px) { flex-direction: row; align-items: center; gap: var(--space-8); }

  .ledger-content {
    flex: 1;
    width: 100%;
    padding: var(--space-4);
    overflow-x: auto;
    @media (min-width: 768px) { padding: var(--space-8); }
    @media (min-width: 1280px) { max-width: 36rem; }
  }

  .ledger-visual {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: var(--space-4);

    @media (min-width: 900px) {
      width: auto;
      margin-left: auto;
      padding: var(--space-6);
      padding-right: var(--space-12);
      border-top: none;
      border-left: 1px solid var(--color-border-subtle);
      background: transparent;
    }
  }
}

/* Ledger Table */
.ledger-table {
  width: 100%;
  border-separate: separate;
  border-spacing: 0 var(--space-2);
  font-family: var(--font-mono);

  th {
    width: 1%; 
    height: 1.5rem;
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-text-base);
    text-align: left;
    @media (min-width: 768px) { height: 1.875rem; }
    
    .th-box {
      background: var(--color-surface);
      padding: var(--space-2);
      width: 100%; 
      display: inline-block; 
      white-space: nowrap;
    }
  }

  td {
    padding: var(--space-2);
    font-size: var(--text-base);
    white-space: nowrap;
    @media (min-width: 768px) { padding: var(--space-2) var(--space-4); font-size: var(--text-2xl); }
  }

  .row-label {
    padding: 0.375rem 0.5625rem;
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    font-family: var(--font-mono);
    @media (min-width: 768px) { padding: 0.5625rem 0.75rem; }
  }

  .kept-row {
    font-weight: 700;
    color: var(--color-text-dark);
    font-size: var(--text-xl);
    @media (min-width: 768px) { font-size: var(--text-3xl); }
    .label-badge { background: var(--color-text-base); color: var(--color-surface); }
  }

  .sold-row, .paid-row {
    color: var(--color-text-dim);
    .label-badge { background: var(--color-surface); border: 1px solid var(--color-border-subtle); }
  }

  .divider-row {
    height: 0.375rem;
    .line { border-bottom: 1.5px dashed var(--color-border-base); width: 100%; }
  }
}

/* Bar Chart Component */
.bar-chart-system {
  margin-top: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-inner);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: relative;
  @media (min-width: 768px) { padding: var(--space-8); }

  .chart-canvas {
    display: flex;
    gap: var(--space-4);
    @media (min-width: 768px) { gap: var(--space-6); }

    .y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 4.5rem;
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-weight: 700;
      color: var(--color-text-dim);
      text-transform: uppercase;
      padding-block: var(--space-2);
      @media (min-width: 768px) { height: 6rem; }
    }

    .bars-container {
      position: relative;
      height: 4.5rem;
      flex: 1;
      display: flex;
      align-items: stretch;
      gap: 1.5px;
      @media (min-width: 768px) { height: 6rem; gap: 3px; }

      .zero-line {
        position: absolute;
        inset-inline: 0;
        border-top: 1px solid var(--color-border-base);
        z-index: 0;
        pointer-events: none;
      }

      .bar-wrapper {
        flex: 1;
        position: relative;
        z-index: 10;
        
        .bar {
          width: 100%;
          cursor: pointer;
          
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}

/* Sales Table Component */
.sales-table-wrapper {
  margin-top: var(--space-6);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-inner);
  overflow: hidden;
  background: var(--color-surface);
  font-family: var(--font-mono);
  @media (min-width: 768px) { margin-top: var(--space-8); }

  .scroll-container { overflow-x: auto; }

  table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;

    thead {
      background: var(--color-bg-main);
      color: var(--color-text-dim);
      font-size: var(--text-xs);
      text-transform: uppercase;
      font-weight: 700;
      font-family: var(--font-sans);

      th {
        padding: var(--space-3);
        cursor: pointer;
        white-space: nowrap;
        &:hover { background: var(--color-border-subtle); }
        @media (min-width: 768px) { padding: var(--space-5); }
      }
    }

    tbody {
      font-size: var(--text-sm);
      @media (min-width: 768px) { font-size: var(--text-lg); }
      tr {
        border-bottom: 1px solid var(--color-bg-main);
        &.is-hovered { background: var(--color-border-subtle); }
        &:hover { background: var(--color-bg-main); }
      }
      td { 
        padding: var(--space-3); 
        color: var(--color-text-base); 
        white-space: nowrap;
        @media (min-width: 768px) { padding: var(--space-5); }
      }
    }
  }
}

.money-token {
  display: inline-flex;
  align-items: baseline;
  font-family: var(--font-mono);
  white-space: nowrap;
  letter-spacing: -0.05em;
  line-height: 1;

  .sign { margin-right: 2px; font-family: var(--font-sans); font-weight: 400; font-size: 0.9em; }
  .currency { font-size: 0.65em; position: relative; top: -0.45em; }
  .suffix { font-size: 0.6em; position: relative; top: 0.1em; margin-left: 2px; font-family: var(--font-sans); text-transform: lowercase; }
}

.donut-visual {
  width: 6rem;
  height: 6rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  @media (min-width: 768px) { width: 8.25rem; height: 8.25rem; }

  svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
  
  .donut-label {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--space-2);

    .percent { font-size: var(--text-3xl); font-weight: 700; line-height: 1; color: var(--color-text-dark); letter-spacing: -0.05em; @media (min-width: 768px) { font-size: var(--text-4xl); } }
    .text { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
  }
}
`;

// --- DATA INJECTION & COMPILATION LOGIC ---
const RAW_SCHEDULE = {
  "2021-2022": [
    { "date": "2021-10-23", "opponent": "Canucks", "location": "Home", "package": "Red" },
    { "date": "2021-10-26", "opponent": "Canadiens", "location": "Home", "package": "Blue" },
    { "date": "2021-10-28", "opponent": "Wild", "location": "Home", "package": "Blue" },
    { "date": "2021-10-31", "opponent": "Rangers", "location": "Home", "package": "Red" },
    { "date": "2021-11-04", "opponent": "Sabres", "location": "Home", "package": "Red" },
    { "date": "2021-11-11", "opponent": "Ducks", "location": "Home", "package": "Blue" },
    { "date": "2021-11-13", "opponent": "Wild", "location": "Home", "package": "Red" },
    { "date": "2021-11-17", "opponent": "Blackhawks", "location": "Home", "package": "Blue" },
    { "date": "2021-11-19", "opponent": "Avalanche", "location": "Home", "package": "Red" },
    { "date": "2021-11-21", "opponent": "Capitals", "location": "Home", "package": "Blue" },
    { "date": "2021-11-24", "opponent": "Hurricanes", "location": "Home", "package": "Blue" },
    { "date": "2021-12-03", "opponent": "Oilers", "location": "Home", "package": "Red" },
    { "date": "2021-12-06", "opponent": "Penguins", "location": "Home", "package": "Blue" },
    { "date": "2021-12-09", "opponent": "Jets", "location": "Home", "package": "Red" },
    { "date": "2021-12-11", "opponent": "Blue Jackets", "location": "Home", "package": "Blue" },
    { "date": "2021-12-18", "opponent": "Oilers", "location": "Home", "package": "Blue" },
    { "date": "2021-12-19", "opponent": "Maple Leafs", "location": "Home", "package": "Red" },
    { "date": "2021-12-21", "opponent": "Coyotes", "location": "Home", "package": "Red" },
    { "date": "2021-12-29", "opponent": "Flyers", "location": "Home", "package": "Blue" },
    { "date": "2021-12-30", "opponent": "Flames", "location": "Home", "package": "Red" },
    { "date": "2022-01-01", "opponent": "Canucks", "location": "Home", "package": "Blue" },
    { "date": "2022-01-04", "opponent": "Islanders", "location": "Home", "package": "Red" },
    { "date": "2022-01-06", "opponent": "Senators", "location": "Home", "package": "Blue" },
    { "date": "2022-01-15", "opponent": "Kings", "location": "Home", "package": "Blue" },
    { "date": "2022-01-17", "opponent": "Blackhawks", "location": "Home", "package": "Red" },
    { "date": "2022-01-20", "opponent": "Sharks", "location": "Home", "package": "Red" },
    { "date": "2022-01-21", "opponent": "Blues", "location": "Home", "package": "Blue" },
    { "date": "2022-01-23", "opponent": "Panthers", "location": "Home", "package": "Red" },
    { "date": "2022-01-25", "opponent": "Predators", "location": "Home", "package": "Blue" },
    { "date": "2022-02-24", "opponent": "Bruins", "location": "Home", "package": "Blue" },
    { "date": "2022-03-02", "opponent": "Predators", "location": "Home", "package": "Red" },
    { "date": "2022-03-16", "opponent": "Lightning", "location": "Home", "package": "Red" },
    { "date": "2022-03-19", "opponent": "Red Wings", "location": "Home", "package": "Red" },
    { "date": "2022-03-30", "opponent": "Golden Knights", "location": "Home", "package": "Blue" },
    { "date": "2022-04-01", "opponent": "Golden Knights", "location": "Home", "package": "Red" },
    { "date": "2022-04-03", "opponent": "Stars", "location": "Home", "package": "Blue" },
    { "date": "2022-04-09", "opponent": "Flames", "location": "Home", "package": "Blue" },
    { "date": "2022-04-16", "opponent": "Devils", "location": "Home", "package": "Red" },
    { "date": "2022-04-20", "opponent": "Avalanche", "location": "Home", "package": "Blue" },
    { "date": "2022-04-27", "opponent": "Kings", "location": "Home", "package": "Red" },
    { "date": "2022-04-29", "opponent": "Sharks", "location": "Home", "package": "Blue" }
  ],
  "2022-2023": [
    { "date": "2022-09-27", "opponent": "CGY", "location": "Home", "package": "Preseason Red" },
    { "date": "2022-10-01", "opponent": "VAN", "location": "Home", "package": "Preseason Blue" },
    { "date": "2022-10-15", "opponent": "VGK", "location": "Home", "package": "Red" },
    { "date": "2022-10-17", "opponent": "CAR", "location": "Home", "package": "Blue" },
    { "date": "2022-10-19", "opponent": "STL", "location": "Home", "package": "Red" },
    { "date": "2022-10-25", "opponent": "BUF", "location": "Home", "package": "Red" },
    { "date": "2022-10-27", "opponent": "VAN", "location": "Home", "package": "Blue" },
    { "date": "2022-10-29", "opponent": "PIT", "location": "Home", "package": "Blue" },
    { "date": "2022-11-08", "opponent": "NSH", "location": "Home", "package": "Red" },
    { "date": "2022-11-11", "opponent": "MIN", "location": "Home", "package": "Blue" },
    { "date": "2022-11-13", "opponent": "WPG", "location": "Home", "package": "Blue" },
    { "date": "2022-11-17", "opponent": "NYR", "location": "Home", "package": "Red" },
    { "date": "2022-11-19", "opponent": "LAK", "location": "Home", "package": "Blue" },
    { "date": "2022-11-23", "opponent": "SJS", "location": "Home", "package": "Red" },
    { "date": "2022-12-01", "opponent": "WSH", "location": "Home", "package": "Red" },
    { "date": "2022-12-03", "opponent": "FLA", "location": "Home", "package": "Blue" },
    { "date": "2022-12-06", "opponent": "MTL", "location": "Home", "package": "Blue" },
    { "date": "2022-12-18", "opponent": "WPG", "location": "Home", "package": "Red" },
    { "date": "2022-12-20", "opponent": "STL", "location": "Home", "package": "Blue" },
    { "date": "2022-12-28", "opponent": "CGY", "location": "Home", "package": "Red" },
    { "date": "2022-12-30", "opponent": "EDM", "location": "Home", "package": "Red" },
    { "date": "2023-01-01", "opponent": "NYI", "location": "Home", "package": "Blue" },
    { "date": "2023-01-16", "opponent": "TBL", "location": "Home", "package": "Red" },
    { "date": "2023-01-19", "opponent": "NJD", "location": "Home", "package": "Red" },
    { "date": "2023-01-21", "opponent": "COL", "location": "Home", "package": "Blue" },
    { "date": "2023-01-25", "opponent": "VAN", "location": "Home", "package": "Red" },
    { "date": "2023-01-27", "opponent": "CGY", "location": "Home", "package": "Blue" },
    { "date": "2023-01-28", "opponent": "CBJ", "location": "Home", "package": "Red" },
    { "date": "2023-02-18", "opponent": "DET", "location": "Home", "package": "Red" },
    { "date": "2023-02-23", "opponent": "BOS", "location": "Home", "package": "Blue" },
    { "date": "2023-02-26", "opponent": "TOR", "location": "Home", "package": "Red" },
    { "date": "2023-03-07", "opponent": "ANA", "location": "Home", "package": "Blue" },
    { "date": "2023-03-09", "opponent": "OTT", "location": "Home", "package": "Blue" },
    { "date": "2023-03-11", "opponent": "DAL", "location": "Home", "package": "Red" },
    { "date": "2023-03-13", "opponent": "DAL", "location": "Home", "package": "Blue" },
    { "date": "2023-03-18", "opponent": "EDM", "location": "Home", "package": "Blue" },
    { "date": "2023-03-30", "opponent": "ANA", "location": "Home", "package": "Red" },
    { "date": "2023-04-01", "opponent": "LAK", "location": "Home", "package": "Red" },
    { "date": "2023-04-03", "opponent": "ARI", "location": "Home", "package": "Blue" },
    { "date": "2023-04-06", "opponent": "ARI", "location": "Home", "package": "Red" },
    { "date": "2023-04-08", "opponent": "CHI", "location": "Home", "package": "Blue" },
    { "date": "2023-04-11", "opponent": "VGK", "location": "Home", "package": "Blue" },
    { "date": "2023-04-13", "opponent": "VGK", "location": "Home", "package": "Blue" }
  ],
  "2023-2024": [
    { "date": "2023-10-17", "opponent": "Colorado", "location": "Home", "package": "Red" },
    { "date": "2023-10-19", "opponent": "Carolina", "location": "Home", "package": "Blue" },
    { "date": "2023-10-21", "opponent": "NY Rangers", "location": "Home", "package": "Red" },
    { "date": "2023-11-02", "opponent": "Nashville", "location": "Home", "package": "Blue" },
    { "date": "2023-11-04", "opponent": "Calgary", "location": "Home", "package": "Red" },
    { "date": "2023-11-11", "opponent": "Edmonton", "location": "Home", "package": "Blue" },
    { "date": "2023-11-13", "opponent": "Colorado", "location": "Home", "package": "Blue" },
    { "date": "2023-11-16", "opponent": "NY Islanders", "location": "Home", "package": "Red" },
    { "date": "2023-11-20", "opponent": "Calgary", "location": "Home", "package": "Blue" },
    { "date": "2023-11-22", "opponent": "San Jose", "location": "Home", "package": "Red" },
    { "date": "2023-11-24", "opponent": "Vancouver", "location": "Home", "package": "Blue" },
    { "date": "2023-12-07", "opponent": "New Jersey", "location": "Home", "package": "Blue" },
    { "date": "2023-12-09", "opponent": "Tampa Bay", "location": "Home", "package": "Blue" },
    { "date": "2023-12-10", "opponent": "Minnesota", "location": "Home", "package": "Red" },
    { "date": "2023-12-12", "opponent": "Florida", "location": "Home", "package": "Blue" },
    { "date": "2023-12-14", "opponent": "Chicago", "location": "Home", "package": "Red" },
    { "date": "2023-12-16", "opponent": "Los Angeles", "location": "Home", "package": "Blue" },
    { "date": "2023-12-29", "opponent": "Philadelphia", "location": "Home", "package": "Red" },
    { "date": "2024-01-01", "opponent": "Vegas", "location": "Home", "package": "N/A" },
    { "date": "2024-01-04", "opponent": "Ottawa", "location": "Home", "package": "Red" },
    { "date": "2024-01-21", "opponent": "Toronto", "location": "Home", "package": "Red" },
    { "date": "2024-01-24", "opponent": "Chicago", "location": "Home", "package": "Blue" },
    { "date": "2024-01-26", "opponent": "St. Louis", "location": "Home", "package": "Red" },
    { "date": "2024-01-28", "opponent": "Columbus", "location": "Home", "package": "Blue" },
    { "date": "2024-02-19", "opponent": "Detroit", "location": "Home", "package": "Red" },
    { "date": "2024-02-22", "opponent": "Vancouver", "location": "Home", "package": "Red" },
    { "date": "2024-02-24", "opponent": "Minnesota", "location": "Home", "package": "Blue" },
    { "date": "2024-02-26", "opponent": "Boston", "location": "Home", "package": "Blue" },
    { "date": "2024-02-29", "opponent": "Pittsburgh", "location": "Home", "package": "Red" },
    { "date": "2024-03-02", "opponent": "Edmonton", "location": "Home", "package": "Red" },
    { "date": "2024-03-08", "opponent": "Winnipeg", "location": "Home", "package": "Blue" },
    { "date": "2024-03-12", "opponent": "Vegas", "location": "Home", "package": "Red" },
    { "date": "2024-03-14", "opponent": "Washington", "location": "Home", "package": "Blue" },
    { "date": "2024-03-16", "opponent": "Nashville", "location": "Home", "package": "Red" },
    { "date": "2024-03-18", "opponent": "Buffalo", "location": "Home", "package": "Red" },
    { "date": "2024-03-24", "opponent": "Montreal", "location": "Home", "package": "Blue" },
    { "date": "2024-03-26", "opponent": "Anaheim", "location": "Home", "package": "Blue" },
    { "date": "2024-03-28", "opponent": "Anaheim", "location": "Home", "package": "Red" },
    { "date": "2024-03-30", "opponent": "Dallas", "location": "Home", "package": "Blue" },
    { "date": "2024-04-09", "opponent": "Arizona", "location": "Home", "package": "Red" },
    { "date": "2024-04-11", "opponent": "San Jose", "location": "Home", "package": "Blue" }
  ],
  "2024-2025": [
    { "date": "2024-09-22", "opponent": "CGY", "location": "Home", "package": "Preseason Blue" },
    { "date": "2024-09-27", "opponent": "VAN", "location": "Home", "package": "Preseason Red" },
    { "date": "2024-10-08", "opponent": "STL", "location": "Home", "package": "Red" },
    { "date": "2024-10-17", "opponent": "PHI", "location": "Home", "package": "Blue" },
    { "date": "2024-10-19", "opponent": "CGY", "location": "Home", "package": "Red" },
    { "date": "2024-10-22", "opponent": "COL", "location": "Home", "package": "Blue" },
    { "date": "2024-10-24", "opponent": "WPG", "location": "Home", "package": "Red" },
    { "date": "2024-10-26", "opponent": "CAR", "location": "Home", "package": "Red" },
    { "date": "2024-11-08", "opponent": "VGK", "location": "Home", "package": "Blue" },
    { "date": "2024-11-12", "opponent": "CBJ", "location": "Home", "package": "Red" },
    { "date": "2024-11-14", "opponent": "CHI", "location": "Home", "package": "Blue" },
    { "date": "2024-11-16", "opponent": "NYI", "location": "Home", "package": "Blue" },
    { "date": "2024-11-17", "opponent": "NYR", "location": "Home", "package": "Red" },
    { "date": "2024-11-20", "opponent": "NSH", "location": "Home", "package": "Blue" },
    { "date": "2024-11-27", "opponent": "ANA", "location": "Home", "package": "Red" },
    { "date": "2024-11-30", "opponent": "SJS", "location": "Home", "package": "Blue" },
    { "date": "2024-12-10", "opponent": "FLA", "location": "Home", "package": "Red" },
    { "date": "2024-12-12", "opponent": "BOS", "location": "Home", "package": "Blue" },
    { "date": "2024-12-14", "opponent": "TBL", "location": "Home", "package": "Red" },
    { "date": "2024-12-17", "opponent": "OTT", "location": "Home", "package": "Red" },
    { "date": "2024-12-30", "opponent": "UTA", "location": "Home", "package": "Blue" },
    { "date": "2025-01-02", "opponent": "VAN", "location": "Home", "package": "Red" },
    { "date": "2025-01-04", "opponent": "EDM", "location": "Home", "package": "Blue" },
    { "date": "2025-01-06", "opponent": "NJD", "location": "Home", "package": "Red" },
    { "date": "2025-01-18", "opponent": "LAK", "location": "Home", "package": "Red" },
    { "date": "2025-01-20", "opponent": "BUF", "location": "Home", "package": "Blue" },
    { "date": "2025-01-23", "opponent": "WSH", "location": "Home", "package": "Red" },
    { "date": "2025-01-25", "opponent": "PIT", "location": "Home", "package": "Blue" },
    { "date": "2025-01-28", "opponent": "ANA", "location": "Home", "package": "Blue" },
    { "date": "2025-01-30", "opponent": "SJS", "location": "Home", "package": "Red" },
    { "date": "2025-02-02", "opponent": "CGY", "location": "Home", "package": "Blue" },
    { "date": "2025-02-04", "opponent": "DET", "location": "Home", "package": "Red" },
    { "date": "2025-02-06", "opponent": "TOR", "location": "Home", "package": "Red" },
    { "date": "2025-03-04", "opponent": "MIN", "location": "Home", "package": "Red" },
    { "date": "2025-03-12", "opponent": "MTL", "location": "Home", "package": "Blue" },
    { "date": "2025-03-14", "opponent": "UTA", "location": "Home", "package": "Red" },
    { "date": "2025-03-16", "opponent": "WPG", "location": "Home", "package": "Blue" },
    { "date": "2025-03-27", "opponent": "EDM", "location": "Home", "package": "Blue" },
    { "date": "2025-03-29", "opponent": "DAL", "location": "Home", "package": "Blue" },
    { "date": "2025-03-31", "opponent": "DAL", "location": "Home", "package": "Red" },
    { "date": "2025-04-15", "opponent": "LAK", "location": "Home", "package": "Blue" }
  ],
  "2025-2026": [
    { "date": "2025-09-21", "opponent": "VAN", "location": "Home", "package": "Preseason Blue" },
    { "date": "2025-09-29", "opponent": "CGY", "location": "Home", "package": "Preseason Red" },
    { "date": "2025-10-09", "opponent": "EDM", "location": "Home", "package": "Red" },
    { "date": "2025-10-16", "opponent": "ANA", "location": "Home", "package": "Red" },
    { "date": "2025-10-18", "opponent": "VGK", "location": "Home", "package": "Blue" },
    { "date": "2025-10-25", "opponent": "EDM", "location": "Home", "package": "Red" },
    { "date": "2025-10-28", "opponent": "MTL", "location": "Home", "package": "Blue" },
    { "date": "2025-10-31", "opponent": "NYR", "location": "Home", "package": "Red" },
    { "date": "2025-11-04", "opponent": "CHI", "location": "Home", "package": "Blue" },
    { "date": "2025-11-06", "opponent": "SJS", "location": "Home", "package": "Red" },
    { "date": "2025-11-11", "opponent": "CBJ", "location": "Home", "package": "Blue" },
    { "date": "2025-11-13", "opponent": "WPG", "location": "Home", "package": "Red" },
    { "date": "2025-11-15", "opponent": "SJS", "location": "Home", "package": "Blue" },
    { "date": "2025-11-26", "opponent": "DAL", "location": "Home", "package": "Red" },
    { "date": "2025-11-29", "opponent": "EDM", "location": "Home", "package": "Blue" },
    { "date": "2025-12-09", "opponent": "MIN", "location": "Home", "package": "Blue" },
    { "date": "2025-12-11", "opponent": "LAK", "location": "Home", "package": "Red" },
    { "date": "2025-12-13", "opponent": "DET", "location": "Home", "package": "Red" },
    { "date": "2025-12-14", "opponent": "BUF", "location": "Home", "package": "Blue" },
    { "date": "2025-12-16", "opponent": "COL", "location": "Home", "package": "Red" },
    { "date": "2025-12-28", "opponent": "PHI", "location": "Home", "package": "Blue" },
    { "date": "2025-12-29", "opponent": "VAN", "location": "Home", "package": "Red" },
    { "date": "2026-01-08", "opponent": "NSH", "location": "Home", "package": "Blue" },
    { "date": "2026-01-09", "opponent": "MIN", "location": "Home", "package": "Red" },
    { "date": "2026-01-20", "opponent": "PIT", "location": "Home", "package": "Red" },
    { "date": "2026-01-25", "opponent": "NJD", "location": "Home", "package": "Red" },
    { "date": "2026-01-27", "opponent": "NYI", "location": "Home", "package": "Blue" },
    { "date": "2026-01-29", "opponent": "TOR", "location": "Home", "package": "Red" },
    { "date": "2026-01-31", "opponent": "ANA", "location": "Home", "package": "Blue" },
    { "date": "2026-02-28", "opponent": "VAN", "location": "Home", "package": "Blue" },
    { "date": "2026-03-03", "opponent": "CAR", "location": "Home", "package": "Blue" },
    { "date": "2026-03-05", "opponent": "STL", "location": "Home", "package": "Blue" },
    { "date": "2026-03-07", "opponent": "OTT", "location": "Home", "package": "Red" },
    { "date": "2026-03-10", "opponent": "NSH", "location": "Home", "package": "Red" },
    { "date": "2026-03-12", "opponent": "COL", "location": "Home", "package": "Blue" },
    { "date": "2026-03-15", "opponent": "FLA", "location": "Home", "package": "Red" },
    { "date": "2026-03-17", "opponent": "TBL", "location": "Home", "package": "Red" },
    { "date": "2026-04-02", "opponent": "UTA", "location": "Home", "package": "Blue" },
    { "date": "2026-04-04", "opponent": "CHI", "location": "Home", "package": "Red" },
    { "date": "2026-04-13", "opponent": "LAK", "location": "Home", "package": "Blue" },
    { "date": "2026-04-18", "opponent": "CGY", "location": "Home", "package": "Blue" }
  ]
};

const KNOWN_SALES = {
  "25-26": [
    { date: "09/21/2025", opponent: "Vancouver Canucks", soldFor: 210.60, ticketsSold: 3, cost: 255.00, gainLoss: -44.40, emailLink: "https://mail.google.com/mail/u/0/#inbox/1991a70d3e39db14" },
    { date: "10/11/2025", opponent: "Vegas Golden Knights", soldFor: 267.30, ticketsSold: 3, cost: 255.00, gainLoss: 12.30, emailLink: "https://mail.google.com/mail/u/0/#inbox/199beea54f61fec7" },
    { date: "10/28/2025", opponent: "Montreal Canadiens", soldFor: 175.50, ticketsSold: 3, cost: 255.00, gainLoss: -79.50, emailLink: "https://mail.google.com/mail/u/0/#inbox/19a28a8b1dc1a036" },
    { date: "11/15/2025", opponent: "San Jose Sharks", soldFor: 294.30, ticketsSold: 3, cost: 255.00, gainLoss: 39.30, emailLink: "https://mail.google.com/mail/u/0/#inbox/19a500dce8701f65" },
    { date: "12/28/2025", opponent: "Philadelphia Flyers", soldFor: 332.10, ticketsSold: 3, cost: 255.00, gainLoss: 77.10, emailLink: "https://mail.google.com/mail/u/0/#inbox/19b154b103854d24" },
    { date: "01/01/2026", opponent: "Nashville Predators", soldFor: 297.00, ticketsSold: 3, cost: 255.00, gainLoss: 42.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/19b2e52ca55b4bfd" },
    { date: "01/06/2026", opponent: "Boston Bruins", soldFor: 364.50, ticketsSold: 3, cost: 255.00, gainLoss: 109.50, emailLink: "https://mail.google.com/mail/u/0/#inbox/19b2519e4acece2e" },
    { date: "01/21/2026", opponent: "New York Islanders", soldFor: 39.60, ticketsSold: 1, cost: 85.00, gainLoss: -45.40, emailLink: "https://mail.google.com/mail/u/0/#inbox/19be25db3b8ab581" },
    { date: "01/23/2026", opponent: "Anaheim Ducks", soldFor: 136.80, ticketsSold: 2, cost: 170.00, gainLoss: -33.20, emailLink: "https://mail.google.com/mail/u/0/#inbox/19becfe25a4448c3" },
    { date: "02/28/2026", opponent: "Vancouver Canucks", soldFor: 294.30, ticketsSold: 3, cost: 255.00, gainLoss: 39.30, emailLink: "https://mail.google.com/mail/u/0/#inbox/19ca1dad60428f06" },
    { date: "03/02/2026", opponent: "Carolina Hurricanes", soldFor: 132.30, ticketsSold: 3, cost: 255.00, gainLoss: -122.70, emailLink: "https://mail.google.com/mail/u/0/#inbox/19caf942f93ab2ca" },
    { date: "03/12/2026", opponent: "Colorado Avalanche", soldFor: 237.60, ticketsSold: 3, cost: 255.00, gainLoss: -17.40, emailLink: "https://mail.google.com/mail/u/0/#inbox/19cd5cceb6de4fe3" },
    { date: "04/02/2026", opponent: "Utah Mammoth", soldFor: 197.10, ticketsSold: 3, cost: 255.00, gainLoss: -57.90, emailLink: "https://mail.google.com/mail/u/0/#inbox/19d363e1deebdf6e" },
    { date: "04/11/2026", opponent: "Calgary Flames", soldFor: 256.50, ticketsSold: 3, cost: 255.00, gainLoss: 1.50, emailLink: "https://mail.google.com/mail/u/0/#inbox/19d5944531d59a7b" },
    { date: "04/13/2026", opponent: "Los Angeles Kings", soldFor: 210.60, ticketsSold: 3, cost: 255.00, gainLoss: -44.40, emailLink: "https://mail.google.com/mail/u/0/#inbox/19d73d185cd2b9b6" },
  ],
  "24-25": [
    { date: "11/20/2024", opponent: "Nashville Predators", soldFor: 297.00, ticketsSold: 3, cost: 279.00, gainLoss: 18.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/192bf3c3ed3b4c7c" },
    { date: "11/30/2024", opponent: "San Jose Sharks", soldFor: 351.00, ticketsSold: 3, cost: 279.00, gainLoss: 72.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/1934c6770eec7247" },
    { date: "12/30/2024", opponent: "Utah Hockey Club", soldFor: 73.80, ticketsSold: 1, cost: 93.00, gainLoss: -19.20, emailLink: "https://mail.google.com/mail/u/0/#inbox/1941550d8293190c" },
    { date: "01/20/2025", opponent: "Buffalo Sabres", soldFor: 280.80, ticketsSold: 3, cost: 279.00, gainLoss: 1.80, emailLink: "https://mail.google.com/mail/u/0/#inbox/1942aa14c2c49b5d" },
    { date: "01/25/2025", opponent: "Pittsburgh Penguins", soldFor: 90.90, ticketsSold: 1, cost: 93.00, gainLoss: -2.10, emailLink: "https://mail.google.com/mail/u/0/#inbox/1949eed22b846c58" },
    { date: "02/02/2025", opponent: "Calgary Flames", soldFor: 305.10, ticketsSold: 3, cost: 279.00, gainLoss: 26.10, emailLink: "https://mail.google.com/mail/u/0/#inbox/1947ccc28a5e33d0" },
    { date: "03/01/2025", opponent: "Vancouver Canucks", soldFor: 375.30, ticketsSold: 3, cost: 279.00, gainLoss: 96.30, emailLink: "https://mail.google.com/mail/u/0/#inbox/1950d23aa3b134a4" },
    { date: "03/27/2025", opponent: "Edmonton Oilers", soldFor: 288.90, ticketsSold: 3, cost: 279.00, gainLoss: 9.90, emailLink: "https://mail.google.com/mail/u/0/#inbox/19563f909c705d23" },
    { date: "03/29/2025", opponent: "Dallas Stars", soldFor: 321.30, ticketsSold: 3, cost: 279.00, gainLoss: 42.30, emailLink: "https://mail.google.com/mail/u/0/#inbox/195583ef1ec98a4e" },
    { date: "04/12/2025", opponent: "St. Louis Blues", soldFor: 267.30, ticketsSold: 3, cost: 279.00, gainLoss: -11.70, emailLink: "https://mail.google.com/mail/u/0/#inbox/195ac66d9250b820" },
  ],
  "23-24": [
    { date: "09/25/2023", opponent: "Calgary Flames (Preseason)", soldFor: 17.10, ticketsSold: 1, cost: 93.00, gainLoss: -75.90, emailLink: null },
    { date: "11/11/2023", opponent: "Edmonton Oilers", soldFor: 364.50, ticketsSold: 3, cost: 279.00, gainLoss: 85.50, emailLink: null },
    { date: "11/20/2023", opponent: "Calgary Flames", soldFor: 264.60, ticketsSold: 3, cost: 279.00, gainLoss: -14.40, emailLink: null },
    { date: "12/07/2023", opponent: "New Jersey Devils", soldFor: 305.10, ticketsSold: 3, cost: 279.00, gainLoss: 26.10, emailLink: null },
    { date: "12/12/2023", opponent: "Florida Panthers", soldFor: 299.70, ticketsSold: 3, cost: 279.00, gainLoss: 20.70, emailLink: null },
    { date: "01/28/2024", opponent: "Columbus Blue Jackets", soldFor: 310.50, ticketsSold: 3, cost: 279.00, gainLoss: 31.50, emailLink: null },
    { date: "02/24/2024", opponent: "Minnesota Wild", soldFor: 415.80, ticketsSold: 3, cost: 279.00, gainLoss: 136.80, emailLink: null },
    { date: "02/26/2024", opponent: "Boston Bruins", soldFor: 529.20, ticketsSold: 3, cost: 279.00, gainLoss: 250.20, emailLink: null },
    { date: "03/08/2024", opponent: "Winnipeg Jets", soldFor: 340.20, ticketsSold: 3, cost: 279.00, gainLoss: 61.20, emailLink: null },
    { date: "03/14/2024", opponent: "Washington Capitals", soldFor: 307.80, ticketsSold: 3, cost: 279.00, gainLoss: 28.80, emailLink: null },
    { date: "03/24/2024", opponent: "Montreal Canadiens", soldFor: 159.30, ticketsSold: 3, cost: 279.00, gainLoss: -119.70, emailLink: null },
    { date: "03/26/2024", opponent: "Anaheim Ducks", soldFor: 103.50, ticketsSold: 1, cost: 93.00, gainLoss: 10.50, emailLink: null },
    { date: "03/30/2024", opponent: "Dallas Stars", soldFor: 426.60, ticketsSold: 3, cost: 279.00, gainLoss: 147.60, emailLink: null },
    { date: "04/11/2024", opponent: "San Jose Sharks", soldFor: 334.80, ticketsSold: 3, cost: 279.00, gainLoss: 55.80, emailLink: null },
  ],
  "22-23": [
    { date: "10/27/2022", opponent: "Vancouver Canucks", soldFor: 339.00, ticketsSold: 3, cost: 270.00, gainLoss: 69.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/18367df8f3aa8510" },
    { date: "11/11/2022", opponent: "Minnesota Wild", soldFor: 378.00, ticketsSold: 3, cost: 270.00, gainLoss: 108.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/1845d5c1cbe25dcc" },
    { date: "12/06/2022", opponent: "Montreal Canadiens", soldFor: 324.00, ticketsSold: 3, cost: 270.00, gainLoss: 54.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/1842a0f058c43bd5" },
    { date: "12/20/2022", opponent: "St. Louis Blues", soldFor: 297.00, ticketsSold: 3, cost: 270.00, gainLoss: 27.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/18376367551b19b9" },
    { date: "02/16/2023", opponent: "Philadelphia Flyers", soldFor: 378.00, ticketsSold: 3, cost: 270.00, gainLoss: 108.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/186424cd5b7e1254" },
    { date: "03/09/2023", opponent: "Ottawa Senators", soldFor: 270.00, ticketsSold: 3, cost: 270.00, gainLoss: 0.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/186c3f2392f806ac" },
    { date: "03/13/2023", opponent: "Dallas Stars", soldFor: 312.00, ticketsSold: 3, cost: 270.00, gainLoss: 42.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/186d32fc14efc289" },
    { date: "04/08/2023", opponent: "Chicago Blackhawks", soldFor: 459.00, ticketsSold: 3, cost: 270.00, gainLoss: 189.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/18754286ccca23c4" },
    { date: "04/13/2023", opponent: "Vegas Golden Knights", soldFor: 363.00, ticketsSold: 3, cost: 270.00, gainLoss: 93.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/187790c389d826f1" },
    { date: "04/22/2023", opponent: "Colorado Avalanche (Playoffs)", soldFor: 270.00, ticketsSold: 1, cost: 90.00, gainLoss: 180.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/1879c4a9e9059db8" },
    { date: "04/28/2023", opponent: "Colorado Avalanche (Playoffs)", soldFor: 360.00, ticketsSold: 1, cost: 90.00, gainLoss: 270.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/187c0fe63b94f943" },
    { date: "05/09/2023", opponent: "Dallas Stars (Playoffs)", soldFor: 171.00, ticketsSold: 1, cost: 90.00, gainLoss: 81.00, emailLink: "https://mail.google.com/mail/u/0/#inbox/18802975eb082579" },
  ],
  "21-22": [
    { date: "11/21/2021", opponent: "Washington Capitals", soldFor: 190.00, ticketsSold: 3, cost: 270.00, gainLoss: -80.00, emailLink: "#" },
    { date: "01/15/2022", opponent: "Los Angeles Kings", soldFor: 252.00, ticketsSold: 3, cost: 270.00, gainLoss: -18.00, emailLink: "#" },
    { date: "01/21/2022", opponent: "St. Louis Blues", soldFor: 450.00, ticketsSold: 3, cost: 270.00, gainLoss: 180.00, emailLink: "#" },
    { date: "04/03/2022", opponent: "Dallas Stars", soldFor: 298.00, ticketsSold: 3, cost: 270.00, gainLoss: 28.00, emailLink: "#" },
  ]
};

const checkMatch = (name1, name2) => {
  const n1 = name1.toLowerCase();
  const n2 = name2.toLowerCase();
  if (n1.includes(n2) || n2.includes(n1)) return true;
  const aliases = [
    ['van', 'canuck'], ['vgk', 'knight', 'vegas'], ['mtl', 'canadien', 'montreal'], ['chi', 'blackhawk', 'chicago'],
    ['cbj', 'jacket', 'columbus'], ['sjs', 'shark', 'san jose'], ['edm', 'oiler', 'edmonton'], ['min', 'wild', 'minnesota'], ['buf', 'sabre', 'buffalo'],
    ['phi', 'flyer', 'philadelphia'], ['nsh', 'predator', 'nashville'], ['nyi', 'islander', 'new york'], ['ana', 'duck', 'anaheim'], ['car', 'hurricane', 'carolina'],
    ['stl', 'blue', 'st. louis', 'st louis'], ['col', 'avalanche', 'colorado'], ['uta', 'mammoth', 'utah'], ['lak', 'king', 'los angeles'], ['cgy', 'flame', 'calgary'],
    ['tbl', 'lightning', 'tampa'], ['njd', 'devil', 'new jersey'], ['tor', 'leaf', 'toronto'], ['pit', 'penguin', 'pittsburgh'], ['det', 'red wing', 'detroit'],
    ['bos', 'bruin', 'boston'], ['dal', 'star', 'dallas'], ['ott', 'senator', 'ottawa'], ['fla', 'panther', 'florida'], ['wsh', 'capital', 'washington'],
    ['wpg', 'jet', 'winnipeg'], ['ari', 'coyote', 'arizona'], ['nyr', 'ranger', 'ny rangers']
  ];
  for (let group of aliases) {
    if (group.some(alias => n1.includes(alias)) && group.some(alias => n2.includes(alias))) return true;
  }
  return false;
};

const isPlayoff = (name) => name.toLowerCase().includes('playoff');

const buildSeasonsData = () => {
  const seasonConfigs = [
    { id: "25-26", title: "25-26", jsonKey: "2025-2026", packageSize: 22 },
    { id: "24-25", title: "24-25", jsonKey: "2024-2025", packageSize: 22 },
    { id: "23-24", title: "23-24", jsonKey: "2023-2024", packageSize: 22 },
    { id: "22-23", title: "22-23", jsonKey: "2022-2023", packageSize: 22 },
    { id: "21-22", title: "21-22", jsonKey: "2021-2022", packageSize: 22 },
  ];

  return seasonConfigs.map(config => {
    const schedule = RAW_SCHEDULE[config.jsonKey] || [];
    let blueGames = schedule.filter(g => g.package.includes("Blue"));
    const sales = KNOWN_SALES[config.id] || [];

    // Dynamically infer game cost from the first fully known sale inside the array
    const sampleSale = sales.find(s => s.cost > 0);
    const inferredGameCost = sampleSale ? sampleSale.cost : 279; // fallback if no sales exist
    const inferredTicketCost = inferredGameCost / 3;

    let mergedSales = [];
    let unmatchedSales = [...sales];

    // 1. Cross-reference schedule with known sales to map official dates
    blueGames.forEach(game => {
      const matchIdx = unmatchedSales.findIndex(s => checkMatch(s.opponent, game.opponent) && !isPlayoff(s.opponent));
      
      if (matchIdx !== -1) {
        mergedSales.push({
          ...unmatchedSales[matchIdx],
          date: game.date, // Enforce Official Schedule Date
          ticketsKept: unmatchedSales[matchIdx].ticketsKept !== undefined ? unmatchedSales[matchIdx].ticketsKept : 3 - (unmatchedSales[matchIdx].ticketsSold || 0),
          isPackage: true
        });
        unmatchedSales.splice(matchIdx, 1);
      } else {
        // Automatically inject as fully attended if unsold
        if (config.id === '21-22') {
          // Special targeted fallback for 21-22: 3rd ticket was always sold for face value internally
          mergedSales.push({
            date: game.date,
            opponent: game.opponent,
            soldFor: inferredTicketCost,
            ticketsSold: 1,
            ticketsKept: 2,
            cost: inferredGameCost,
            gainLoss: 0,
            emailLink: null,
            isPackage: true
          });
        } else {
          mergedSales.push({
            date: game.date,
            opponent: game.opponent,
            soldFor: 0,
            ticketsSold: 0,
            ticketsKept: 3,
            cost: inferredGameCost,
            gainLoss: 0,
            emailLink: null,
            isPackage: true
          });
        }
      }
    });

    // 2. Add remaining overrides/playoffs
    unmatchedSales.forEach(s => {
      mergedSales.push({
        ...s,
        ticketsKept: s.ticketsKept !== undefined ? s.ticketsKept : 3 - (s.ticketsSold || 0),
        isPackage: !isPlayoff(s.opponent)
      });
    });

    // 3. Fallback padding to ensure divisor math matches strictly to the 22-game package limit
    let packageCount = mergedSales.filter(s => s.isPackage).length;
    let missingCount = config.packageSize - packageCount;
    for (let i = 0; i < missingCount; i++) {
      mergedSales.push({
        date: `${config.jsonKey.split('-')[0]}-09-15`, // General Preseason Timestamp
        opponent: "Preseason / Unlisted",
        soldFor: config.id === '21-22' ? inferredTicketCost : 0,
        ticketsSold: config.id === '21-22' ? 1 : 0,
        ticketsKept: config.id === '21-22' ? 2 : 3,
        cost: inferredGameCost,
        gainLoss: 0,
        emailLink: null,
        isPackage: true
      });
    }

    // 4. Calculate Core Metrics dynamically (Playoffs intentionally excluded)
    let metrics = {
      upfrontCost: 0,
      ticketCost: inferredTicketCost,
      totalSold: 0,
      totalKept: 0,
      gamesAttended: 0,
      totalGamesInPackage: 0,
      revenue: 0,
      gainLossSold: 0
    };

    // Sort early so we can attach a stable tracking ID for unified hovers
    mergedSales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    mergedSales.forEach((s, idx) => {
      s.saleId = idx;
      s.seasonId = config.id; // Critical mapping for inter-component hover sync
      if (s.isPackage) {
        metrics.totalGamesInPackage++;
        metrics.upfrontCost += s.cost;
        metrics.totalSold += s.ticketsSold;
        metrics.totalKept += s.ticketsKept;
        if (s.ticketsKept > 0) metrics.gamesAttended++;
        metrics.revenue += s.soldFor;
        metrics.gainLossSold += s.gainLoss;
      }
    });

    metrics.netCost = metrics.upfrontCost - metrics.revenue;
    metrics.costPerGameAttended = metrics.gamesAttended > 0 ? metrics.netCost / metrics.gamesAttended : 0;
    metrics.costPerTicketKept = metrics.totalKept > 0 ? metrics.netCost / metrics.totalKept : 0;

    return {
      id: config.id,
      title: config.title,
      metrics,
      sales: mergedSales
    };
  });
};

const FormatMoney = ({ val, dropSign = false, hideDollar = false, showPlus = false, suffix = '', bold = false }) => {
  const roundedVal = Math.round(val);
  const absVal = Math.abs(roundedVal);
  const numStr = new Intl.NumberFormat('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(absVal);
  const sign = roundedVal < 0 ? '–' : (showPlus && roundedVal > 0 ? '+' : '');
  
  return (
    <span className="money-token" style={{ fontWeight: bold ? 700 : 500 }}>
      {!dropSign && sign && <span className="sign">{sign}</span>}
      {!hideDollar && <span className="currency">$</span>}
      <span className="headerhighlight">{numStr}</span>
      {suffix && <span className="suffix">{suffix}</span>}
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const [y, m, d] = dateStr.split('-');
    return `${parseInt(m, 10)}/${parseInt(d, 10)}/${y.slice(-2)}`;
  }
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parseInt(parts[0], 10)}/${parseInt(parts[1], 10)}/${parts[2].slice(-2)}`;
  }
  return dateStr;
};

const SaleTooltip = ({ sale, hideDate = false }) => {
  const isSale = sale.ticketsSold > 0 && sale.ticketsKept === 0;
  const isAttended = sale.ticketsKept > 0;
  const isPositive = sale.gainLoss >= 0;
  
  return (
    <div className="chart-tooltip">
      <div className="tooltip-title">{sale.opponent}</div>
      <div className="tooltip-value" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4.5px', marginTop: '3px' }}>
        {!hideDate && <span>{formatDate(sale.date)}</span>}
        {isAttended ? (
          <span style={{ fontWeight: 800, color: 'var(--color-text-dim)', letterSpacing: '0.05em' }}>• ATTENDED</span>
        ) : (
          <span className={`stat-badge ${isPositive ? 'positive' : 'negative'}`}>
            <FormatMoney val={sale.gainLoss} showPlus={true} />
          </span>
        )}
      </div>
    </div>
  );
};

const SeasonBarChart = ({ sales, netGainLoss, hoveredSale, onHover, contextId }) => {
  const chartSales = sales.filter(s => s.ticketsKept === 0);
  if (chartSales.length === 0 && contextId !== 'search') return null;

  const values = chartSales.map(s => s.gainLoss);
  const maxGain = Math.max(...values, 1);
  const maxLoss = Math.min(...values, -1);
  const totalRange = maxGain - maxLoss;
  const zeroPos = (maxGain / totalRange) * 100;
  
  return (
    <div className="bar-chart-system">
      {netGainLoss !== undefined && (
        <div className={`stat-badge net-badge ${netGainLoss >= 0 ? 'positive' : 'negative'}`}>
          <FormatMoney val={netGainLoss} showPlus={true} bold={true} />
        </div>
      )}
      <div className="chart-canvas">
        <div className="y-axis">
          <span style={{ color: 'var(--color-success-primary)' }}>+{Math.round(maxGain)}</span>
          <span>$0</span>
          <span style={{ color: 'var(--color-danger-primary)' }}>{Math.round(maxLoss)}</span>
        </div>
        <div className="bars-container">
          <div className="zero-line" style={{ top: `${zeroPos}%` }} />
          {chartSales.map((sale, i) => {
            const isPositive = sale.gainLoss >= 0;
            const barHeight = (Math.abs(sale.gainLoss) / totalRange) * 100;
            const isHovered = hoveredSale?.seasonId === sale.seasonId && hoveredSale?.saleId === sale.saleId;

            return (
              <div 
                key={i} 
                className="bar-wrapper" 
                onMouseEnter={() => onHover && onHover({ seasonId: sale.seasonId, saleId: sale.saleId })} 
                onMouseLeave={() => onHover && onHover(null)}
                onClick={() => {
                  const el = document.getElementById(`sale-row-${contextId}-${sale.saleId}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <div 
                  className="bar"
                  style={{ 
                    height: `${Math.max(barHeight, 1.5)}%`, 
                    position: 'absolute', 
                    top: isPositive ? `${zeroPos - barHeight}%` : `${zeroPos}%`,
                    borderRadius: isPositive ? '1.5px 1.5px 0 0' : '0 0 1.5px 1.5px',
                    backgroundColor: isHovered ? 'var(--color-text-dark)' : isPositive ? 'var(--color-success-primary)' : 'var(--color-danger-primary)',
                    opacity: isHovered ? 1 : 0.8
                  }}
                />
                <SaleTooltip sale={sale} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SeasonLedger = ({ metrics }) => {
  const totalTix = metrics.totalSold + metrics.totalKept;
  const keptPercent = totalTix > 0 ? (metrics.totalKept / totalTix) * 100 : 100;
  const gamesSold = metrics.totalGamesInPackage - metrics.gamesAttended;
  const avgSoldPerTix = metrics.totalSold ? metrics.revenue / metrics.totalSold : 0;
  
  return (
    <div className="ledger-container">
      <div className="ledger-content">
        <table className="ledger-table">
          <thead>
            <tr>
              <th></th>
              <th><span className="th-box">#</span></th>
              <th><span className="th-box">Games</span></th>
              <th><span className="th-box">$ tix | g</span></th>
            </tr>
          </thead>
          <tbody>
            <tr className="kept-row">
              <td><span className="row-label label-badge">Kept</span></td>
              <td><FormatMoney val={metrics.netCost} bold={true} /></td>
              <td>{metrics.gamesAttended}</td>
              <td><FormatMoney val={metrics.costPerTicketKept} dropSign={true} bold={true} /><span style={{ marginInline: '0.375rem', fontWeight: 400, color: 'var(--color-border-base)' }}>|</span><FormatMoney val={metrics.costPerGameAttended} dropSign={true} bold={true} /></td>
            </tr>
            <tr className="sold-row">
              <td><span className="row-label label-badge">Sold</span></td>
              <td><FormatMoney val={metrics.revenue} /></td>
              <td>{gamesSold}</td>
              <td><FormatMoney val={avgSoldPerTix} dropSign={true} /><span style={{ marginInline: '0.375rem', fontWeight: 400, color: 'var(--color-border-base)' }}>|</span><FormatMoney val={avgSoldPerTix * 3} dropSign={true} /></td>
            </tr>
            <tr className="divider-row"><td></td><td><div className="line" style={{ width: '4.5rem' }}></div></td><td><div className="line" style={{ width: '3rem' }}></div></td><td><div className="line" style={{ width: '6rem' }}></div></td></tr>
            <tr className="paid-row">
              <td><span className="row-label label-badge">Paid</span></td>
              <td><FormatMoney val={metrics.upfrontCost} /></td>
              <td>{metrics.totalGamesInPackage}</td>
              <td><FormatMoney val={metrics.ticketCost} /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="ledger-visual">
        <div className="donut-visual">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-surface)" strokeWidth="16" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-text-dark)" strokeWidth="16" strokeDasharray={`${(keptPercent / 100) * 251.32} 251.32`} />
          </svg>
          <div className="donut-label">
            <span className="percent">{keptPercent.toFixed(0)}%</span>
            <span className="text">Kept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const seasonsData = useMemo(() => buildSeasonsData(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hideAttended, setHideAttended] = useState(true);
  const [hoveredSale, setHoveredSale] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [sortConfigs, setSortConfigs] = useState({ "25-26": { key: 'date', direction: 'asc' }, "24-25": { key: 'date', direction: 'asc' }, "23-24": { key: 'date', direction: 'asc' }, "22-23": { key: 'date', direction: 'asc' }, "21-22": { key: 'date', direction: 'asc' }, "search": { key: 'date', direction: 'asc' } });
  const filterInputRef = useRef(null);

  // "/" focuses search from anywhere, unless you're already typing in a field
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t.isContentEditable) return;
      e.preventDefault();
      filterInputRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.body.style.backgroundColor = '#4e537d';
    else document.body.style.backgroundColor = '#dce5eb';
  }, [isDarkMode]);

  const flatAllSales = useMemo(() => {
    return seasonsData.flatMap(season => season.sales).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [seasonsData]);

  const scrollToRow = (sale) => {
    if (sale.ticketsKept > 0 && hideAttended) {
      setHideAttended(false);
      setTimeout(() => executeScroll(sale), 100);
    } else {
      executeScroll(sale);
    }
  };

  const executeScroll = (sale) => {
    const rowId = 'sale-row-' + sale.seasonId + '-' + sale.saleId;
    const el = document.getElementById(rowId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setHighlightedRow(rowId);
        setTimeout(() => setHighlightedRow(null), 7000);
      }, 600);
    }
  };

  const processedSeasons = useMemo(() => seasonsData.map(season => {
    const sort = sortConfigs[season.id];
    let filtered = [...season.sales];
    filtered.sort((a, b) => {
      let vA = a[sort.key], vB = b[sort.key];
      if (sort.key === 'date') { vA = new Date(vA).getTime(); vB = new Date(vB).getTime(); }
      return sort.direction === 'asc' ? (vA < vB ? -1 : 1) : (vA > vB ? -1 : 1);
    });
    return { ...season, sales: filtered };
  }), [sortConfigs, seasonsData]);

  const globalSearchResults = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    const sort = sortConfigs["search"];
    
    let allMatches = flatAllSales.filter(s => 
      s.opponent.toLowerCase().includes(term) || s.date.includes(term) || s.gainLoss.toString().includes(term)
    );

    allMatches.sort((a, b) => {
      let vA = a[sort.key], vB = b[sort.key];
      if (sort.key === 'date') { vA = new Date(vA).getTime(); vB = new Date(vB).getTime(); }
      return sort.direction === 'asc' ? (vA < vB ? -1 : 1) : (vA > vB ? -1 : 1);
    });

    return allMatches;
  }, [searchTerm, sortConfigs, flatAllSales]);

  const aggregateStats = useMemo(() => {
    const num = seasonsData.length;
    const totals = seasonsData.reduce((acc, s) => { 
      acc.net += s.metrics.netCost; 
      acc.attended += s.metrics.gamesAttended; 
      acc.pkg += s.metrics.totalGamesInPackage; 
      acc.keptTix += s.metrics.totalKept; 
      acc.gl += s.metrics.gainLossSold; 
      return acc; 
    }, { net: 0, attended: 0, pkg: 0, keptTix: 0, gl: 0 });
    
    return { 
      avgNet: num > 0 ? totals.net / num : 0, 
      totalAttended: totals.attended,
      totalPkg: totals.pkg,
      avgAttended: num > 0 ? totals.attended / num : 0, 
      avgPkg: num > 0 ? totals.pkg / num : 0,
      avgCostPerGame: totals.attended > 0 ? totals.net / totals.attended : 0, 
      avgCostPerTix: totals.keptTix > 0 ? totals.net / totals.keptTix : 0,
      avgGL: num > 0 ? totals.gl / num : 0
    };
  }, [seasonsData]);

  const chronologicalSeasons = useMemo(() => {
    return [...seasonsData].reverse();
  }, [seasonsData]);

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>{CSS_VARS}</style>
      
      {/* Settings Modal */}
      <div className={`modal-overlay ${isSettingsOpen ? 'open' : ''}`} onClick={() => setIsSettingsOpen(false)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Settings</h3>
            <button className="modal-close" onClick={() => setIsSettingsOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="switch-container">
            <span>Show attended games in tables</span>
            <label className="switch">
              <input type="checkbox" checked={!hideAttended} onChange={() => setHideAttended(!hideAttended)} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        <header className="header-system">
          <div className="top-bar">
            <div className="logo-container" onClick={() => { setSearchTerm(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <span className="main-logo-icon" role="img" aria-label="Kraken" />
              <div className="header-text">
                <h2 className="header-title">Kraken season ticket analyzer | Hans</h2>
                <p className="header-subtitle">Data from the first 5 seasons of season tickets I held 2021–2026 for the Seattle Kraken</p>
              </div>
            </div>
            
            <div className="header-right">
            <div className="search-container">
              <input ref={filterInputRef} type="text" placeholder="Canucks, 2025-12, 77" aria-label="Search by opponent, date or amount (press / to focus)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
              {!searchTerm && <kbd className="search-kbd" aria-hidden="true">/</kbd>}
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="search-clear">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          
            <div className="header-actions">
              <button className="icon-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)} title="Toggle Theme">
                {isDarkMode ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
            </div>
            </div>
          </div>
          
          {!searchTerm && (
            <section className="season-card no-padding">
              <div className="summary-grid global-summary">
                <div className="summary-item">
                  <div className="value"><FormatMoney val={aggregateStats.avgNet} /></div>
                  <div className="label">cost per season</div>
                </div>
                <div className="summary-item">
                  <div className="value"><FormatMoney val={aggregateStats.avgCostPerTix} /></div>
                  <div className="label">avg cost per ticket</div>
                </div>
                <div className="summary-item">
                  <div className="value"><FormatMoney val={aggregateStats.avgCostPerGame} /></div>
                  <div className="label">avg cost per game</div>
                </div>
                <div className="summary-item full-width-mobile">
                  <div className="mini-map-header">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="attended-stat">{aggregateStats.totalAttended}/{aggregateStats.totalPkg} attended</span>
                      <span className="mini-map-sub-stat">avg {Math.round(aggregateStats.avgAttended)}/{Math.round(aggregateStats.avgPkg)} per season</span>
                    </div>
                    <div className={`stat-badge ${aggregateStats.avgGL >= 0 ? 'positive' : 'negative'}`}>
                      <FormatMoney val={aggregateStats.avgGL} showPlus={true} bold={true} />
                    </div>
                  </div>
                  <div className="mini-map-grid">
                    {chronologicalSeasons.map((season, sIndex) => {
                      const renderDot = (sale) => {
                        const isSale = sale.ticketsSold > 0;
                        const isPositive = sale.gainLoss >= 0;
                        const dotColor = !isSale ? 'var(--color-text-dark)' : isPositive ? 'var(--color-success-primary)' : 'var(--color-danger-primary)';

                        return (
                          <div
                            key={season.id + '-' + sale.saleId}
                            className="mini-map-dot"
                            style={{ '--dot-color': dotColor }}
                            onMouseEnter={() => setHoveredSale({ seasonId: sale.seasonId, saleId: sale.saleId })}
                            onMouseLeave={() => setHoveredSale(null)}
                            onClick={() => scrollToRow(sale)}
                          >
                            <SaleTooltip sale={sale} hideDate={false} />
                          </div>
                        );
                      };
                      // Playoff games get their own line under their season
                      const regular = season.sales.filter(s => !isPlayoff(s.opponent));
                      const playoffs = season.sales.filter(s => isPlayoff(s.opponent));

                      return (
                        <React.Fragment key={season.id}>
                          <div className="mini-map-row">
                            <div className="mini-map-season-marker">S{sIndex + 1}</div>
                            {regular.map(renderDot)}
                          </div>
                          {playoffs.length > 0 && (
                            <div className="mini-map-row is-playoffs">
                              <div className="mini-map-season-marker" title={`Season ${sIndex + 1} playoffs`}>P</div>
                              {playoffs.map(renderDot)}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  
                  <div className="mini-map-legend">
                    <div className="legend-item"><span className="dot attended"></span> Attended</div>
                    <div className="legend-item"><span className="dot positive"></span> Sold for more</div>
                    <div className="legend-item"><span className="dot negative"></span> Sold for less</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '6rem' }}>
          
          {/* SEARCH VIEW (Flattened & Reordered) */}
          {searchTerm && (
            <section className="season-group">
              <h2 className="section-title">{globalSearchResults.length} {searchTerm} tix sold</h2>
              <div className="season-card">
                <SeasonBarChart 
                  sales={globalSearchResults} 
                  netGainLoss={globalSearchResults.reduce((sum, item) => sum + item.gainLoss, 0)} 
                  hoveredSale={hoveredSale} 
                  onHover={setHoveredSale} 
                  contextId="search"
                />
                
                <div className="sales-table-wrapper">
                  <div className="scroll-container">
                    <table>
                      <thead>
                        <tr>
                          {/* Schema Reorder: Date First */}
                          <th onClick={() => setSortConfigs({...sortConfigs, "search": { key: 'date', direction: sortConfigs["search"].direction === 'asc' ? 'desc' : 'asc' }})}>Date</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, "search": { key: 'opponent', direction: sortConfigs["search"].direction === 'asc' ? 'desc' : 'asc' }})}>Opponent</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, "search": { key: 'gainLoss', direction: sortConfigs["search"].direction === 'asc' ? 'desc' : 'asc' }})}>G / L</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, "search": { key: 'soldFor', direction: sortConfigs["search"].direction === 'asc' ? 'desc' : 'asc' }})}>Revenue</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, "search": { key: 'cost', direction: sortConfigs["search"].direction === 'asc' ? 'desc' : 'asc' }})}>Cost</th>
                          <th>Sold</th>
                          <th style={{ textAlign: 'center' }}>Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {globalSearchResults.filter(r => !hideAttended || r.ticketsKept === 0).map((row, idx) => (
                          <tr 
                            id={'sale-row-search-' + row.saleId}
                            key={idx} 
                            className={(hoveredSale?.seasonId === row.seasonId && hoveredSale?.saleId === row.saleId ? 'is-hovered' : '') + (highlightedRow === 'sale-row-' + row.seasonId + '-' + row.saleId ? ' row-highlight' : '')} 
                            onMouseEnter={() => setHoveredSale({ seasonId: row.seasonId, saleId: row.saleId })} 
                            onMouseLeave={() => setHoveredSale(null)}
                          >
                            {/* Data Reorder: Date First */}
                            <td style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{formatDate(row.date)}</td>
                            <td style={{ fontWeight: 700, color: 'var(--color-text-dark)', fontSize: 'var(--text-base)', textTransform: 'uppercase' }}>{row.opponent} <span style={{fontSize: 'var(--text-xs)', fontWeight: 400, opacity: 0.6, marginLeft: '4.5px'}}>[{row.seasonId}]</span></td>
                            <td style={{ fontWeight: 700, color: row.gainLoss > 0 ? 'var(--color-success-primary)' : row.gainLoss < 0 ? 'var(--color-danger-primary)' : 'var(--color-text-dim)' }}>
                              {(row.ticketsSold > 0 && row.ticketsKept === 0) || row.seasonId === '21-22' ? <FormatMoney val={row.gainLoss} showPlus={true} /> : <span style={{ opacity: 0.5 }}>—</span>}
                            </td>
                            <td style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{row.soldFor > 0 ? <FormatMoney val={row.soldFor} /> : <span style={{ opacity: 0.5 }}>—</span>}</td>
                            <td style={{ opacity: 0.7 }}><FormatMoney val={row.cost} /></td>
                            <td style={{ paddingLeft: '1.125rem', opacity: 0.7 }}>{row.ticketsSold > 0 ? row.ticketsSold : '—'}</td>
                            <td style={{ textAlign: 'center' }}>
                              {row.emailLink ? (
                                <a href={row.emailLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '0.375rem', background: 'var(--color-bg-main)', color: 'var(--color-text-dim)', borderRadius: '4.5px' }}>
                                  <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </a>
                              ) : <span style={{ color: 'var(--color-border-base)' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!searchTerm && processedSeasons.map((season) => (
            <section key={season.id} className="season-group">
              <h2 className="section-title">
                {season.title}
                {season.id === '21-22' && <span style={{ fontSize: '7.5px', marginLeft: '9px', color: 'var(--color-text-dim)', fontWeight: '500', textTransform: 'none', letterSpacing: '0' }}>(Includes $90 recoup per attended game)</span>}
              </h2>
              <div className="season-card">
                <SeasonLedger metrics={season.metrics} />
                <SeasonBarChart 
                  sales={season.sales} 
                  netGainLoss={season.metrics.gainLossSold}
                  hoveredSale={hoveredSale} 
                  onHover={setHoveredSale} 
                  contextId={season.id}
                />
                
                <div className="sales-table-wrapper">
                  <div className="scroll-container">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => setSortConfigs({...sortConfigs, [season.id]: { key: 'gainLoss', direction: sortConfigs[season.id].direction === 'asc' ? 'desc' : 'asc' }})}>G / L</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, [season.id]: { key: 'soldFor', direction: sortConfigs[season.id].direction === 'asc' ? 'desc' : 'asc' }})}>Revenue</th>
                          <th onClick={() => setSortConfigs({...sortConfigs, [season.id]: { key: 'cost', direction: sortConfigs[season.id].direction === 'asc' ? 'desc' : 'asc' }})}>Cost</th>
                          <th>Sold</th><th>Date</th><th>Opponent</th><th style={{ textAlign: 'center' }}>Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {season.sales.filter(r => !hideAttended || r.ticketsKept === 0).map((row, idx) => (
                          <tr 
                            id={'sale-row-' + season.id + '-' + row.saleId}
                            key={idx} 
                            className={(hoveredSale?.seasonId === season.id && hoveredSale?.saleId === row.saleId ? 'is-hovered' : '') + (highlightedRow === 'sale-row-' + season.id + '-' + row.saleId ? ' row-highlight' : '')} 
                            onMouseEnter={() => setHoveredSale({ seasonId: season.id, saleId: row.saleId })} 
                            onMouseLeave={() => setHoveredSale(null)}
                          >
                            <td style={{ fontWeight: 700, color: row.gainLoss > 0 ? 'var(--color-success-primary)' : row.gainLoss < 0 ? 'var(--color-danger-primary)' : 'var(--color-border-base)' }}>
                              {(row.ticketsSold > 0 && row.ticketsKept === 0) || season.id === '21-22' ? <FormatMoney val={row.gainLoss} showPlus={true} /> : <span style={{ opacity: 0.5 }}>—</span>}
                            </td>
                            <td style={{ color: 'var(--color-text-dark)', fontWeight: 600 }}>{row.soldFor > 0 ? <FormatMoney val={row.soldFor} /> : <span style={{ opacity: 0.5 }}>—</span>}</td>
                            <td style={{ opacity: 0.7 }}><FormatMoney val={row.cost} /></td>
                            <td style={{ paddingLeft: '1.125rem', opacity: 0.7 }}>{row.ticketsSold > 0 ? row.ticketsSold : '—'}</td>
                            <td style={{ fontSize: 'var(--text-base)' }}>{formatDate(row.date)}</td>
                            <td style={{ fontWeight: 700, color: 'var(--color-text-dark)', fontSize: 'var(--text-base)', textTransform: 'uppercase' }}>{row.opponent}</td>
                            <td style={{ textAlign: 'center' }}>
                              {row.emailLink && row.emailLink !== '#' ? (
                                <a href={row.emailLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '0.375rem', background: 'var(--color-bg-main)', color: 'var(--color-text-dim)', borderRadius: '4.5px' }}>
                                  <svg width="10.5" height="10.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </a>
                              ) : <span style={{ color: 'var(--color-border-base)' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}