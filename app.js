/**
 * GlucoPulse - Blood Sugar Monitor Application
 * Pure Vanilla JavaScript ES6 Implementation
 */

// Global Application State
const state = {
  logs: [],
  settings: {
    unit: 'mg/dL', // 'mg/dL' or 'mmol/L'
    hypoLimit: 70,  // in mg/dL
    targetLow: 70,  // in mg/dL
    targetHigh: 180, // in mg/dL
    hyperLimit: 250  // in mg/dL
  },
  chartFilterDays: 7, // 7, 14, 30, or 'all'
  tableTimingFilter: 'all',
  searchQuery: '',
  editingLogId: null
};

// Storage Key Constants
const STORAGE_LOGS_KEY = 'glucopulse_logs_v1';
const STORAGE_SETTINGS_KEY = 'glucopulse_settings_v1';

// Conversion Utility Functions
const CONVERSION_FACTOR = 18.0182;

function mgDlToMmol(mgDl) {
  return (mgDl / CONVERSION_FACTOR).toFixed(1);
}

function mmolToMgDl(mmol) {
  return Math.round(mmol * CONVERSION_FACTOR);
}

function toLocalISOString(date = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatGlucoseValue(valMgDl, unit = state.settings.unit) {
  if (unit === 'mmol/L') {
    return mgDlToMmol(valMgDl);
  }
  return Math.round(valMgDl).toString();
}

function parseInputGlucose(value, unit = state.settings.unit) {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return unit === 'mmol/L' ? mmolToMgDl(num) : Math.round(num);
}

// Data Storage Manager
const Storage = {
  load() {
    try {
      const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
      }

      const savedLogs = localStorage.getItem(STORAGE_LOGS_KEY);
      if (savedLogs) {
        state.logs = JSON.parse(savedLogs);
      } else {
        // First load: pre-populate with realistic demo logs for immediate wow factor!
        this.loadDemoData();
      }
    } catch (err) {
      console.error('Failed to load data from localStorage:', err);
      state.logs = [];
    }
  },

  saveLogs() {
    try {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(state.logs));
    } catch (err) {
      console.error('Failed to save logs to localStorage:', err);
    }
  },

  saveSettings() {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(state.settings));
    } catch (err) {
      console.error('Failed to save settings to localStorage:', err);
    }
  },

  loadDemoData() {
    const now = new Date();
    const demoLogs = [];
    
    // Generate realistic sample data spanning 7 days
    const sampleReadings = [
      { offsetHours: 2, glucose: 112, timing: 'Post-Meal', carbs: 45, bolus: 4.5, basal: 0, medication: 'Metformin 500mg', activity: 'None', notes: 'Oatmeal & coffee' },
      { offsetHours: 6, glucose: 95, timing: 'Pre-Meal', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'Light', notes: 'Pre-lunch walk' },
      { offsetHours: 8, glucose: 142, timing: 'Post-Meal', carbs: 65, bolus: 6.0, basal: 0, medication: '', activity: 'None', notes: 'Chicken salad & rice' },
      { offsetHours: 14, glucose: 108, timing: 'Bedtime', carbs: 10, bolus: 0, basal: 18.0, medication: 'Lantus 18U', activity: 'None', notes: 'Bedtime snack' },
      
      { offsetHours: 24 + 1, glucose: 128, timing: 'Fasting', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Morning check' },
      { offsetHours: 24 + 5, glucose: 165, timing: 'Post-Meal', carbs: 55, bolus: 5.5, basal: 0, medication: 'Metformin 500mg', activity: 'None', notes: 'Lunch' },
      { offsetHours: 24 + 11, glucose: 64, timing: 'Random', carbs: 20, bolus: 0, basal: 0, medication: '', activity: 'Intense', notes: 'Mild hypo after gym session! 15g juice taken.' },
      { offsetHours: 24 + 12, glucose: 102, timing: 'Post-Meal', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Re-check after juice' },
      
      { offsetHours: 48 + 2, glucose: 92, timing: 'Fasting', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Woke up feeling great' },
      { offsetHours: 48 + 7, glucose: 210, timing: 'Post-Meal', carbs: 85, bolus: 8.0, basal: 0, medication: '', activity: 'None', notes: 'Pasta dinner - high spike' },
      { offsetHours: 48 + 14, glucose: 135, timing: 'Bedtime', carbs: 0, bolus: 1.5, basal: 18.0, medication: 'Lantus 18U', activity: 'None', notes: 'Correction bolus' },
      
      { offsetHours: 72 + 2, glucose: 104, timing: 'Fasting', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Normal fasting' },
      { offsetHours: 72 + 8, glucose: 118, timing: 'Post-Meal', carbs: 40, bolus: 4.0, basal: 0, medication: 'Metformin 500mg', activity: 'Moderate', notes: '30m evening walk' },
      
      { offsetHours: 96 + 2, glucose: 115, timing: 'Fasting', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Fasting check' },
      { offsetHours: 96 + 9, glucose: 262, timing: 'Post-Meal', carbs: 90, bolus: 9.0, basal: 0, medication: '', activity: 'None', notes: 'Birthday cake slice' },
      { offsetHours: 96 + 14, glucose: 148, timing: 'Bedtime', carbs: 0, bolus: 2.0, basal: 18.0, medication: 'Lantus 18U', activity: 'None', notes: 'Night correction' },

      { offsetHours: 120 + 2, glucose: 98, timing: 'Fasting', carbs: 0, bolus: 0, basal: 0, medication: '', activity: 'None', notes: 'Good morning reading' },
      { offsetHours: 120 + 7, glucose: 125, timing: 'Post-Meal', carbs: 50, bolus: 5.0, basal: 0, medication: 'Metformin 500mg', activity: 'Light', notes: 'Balanced lunch' }
    ];

    sampleReadings.forEach((item, index) => {
      const logTime = new Date(now.getTime() - item.offsetHours * 60 * 60 * 1000);
      demoLogs.push({
        id: 'demo_' + (index + 1) + '_' + Date.now(),
        glucose: item.glucose,
        timing: item.timing,
        carbs: item.carbs,
        bolus: item.bolus,
        basal: item.basal,
        medication: item.medication,
        activity: item.activity,
        notes: item.notes,
        timestamp: logTime.toISOString()
      });
    });

    state.logs = demoLogs;
    this.saveLogs();
  }
};

// Health Metrics Calculator
const HealthCalc = {
  getStatus(glucoseMgDl) {
    const { hypoLimit, targetLow, targetHigh, hyperLimit } = state.settings;
    if (glucoseMgDl < hypoLimit) return { key: 'hypo', label: 'Hypo (Low)', pillClass: 'status-pill-hypo' };
    if (glucoseMgDl > hyperLimit) return { key: 'hyper', label: 'Hyper (Very High)', pillClass: 'status-pill-hyper' };
    if (glucoseMgDl > targetHigh) return { key: 'high', label: 'Elevated High', pillClass: 'status-pill-high' };
    return { key: 'normal', label: 'In Target Range', pillClass: 'status-pill-normal' };
  },

  getAverageGlucose(logs) {
    if (!logs || logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.glucose, 0);
    return Math.round(sum / logs.length);
  },

  getEstimatedA1C(avgMgDl) {
    if (!avgMgDl || avgMgDl === 0) return 0;
    // Formula: eAG (mg/dL) = (28.7 * A1C) - 46.7  =>  A1C = (avgMgDl + 46.7) / 28.7
    const a1c = (avgMgDl + 46.7) / 28.7;
    return a1c.toFixed(1);
  },

  getTimeInRange(logs) {
    if (!logs || logs.length === 0) return 0;
    const { targetLow, targetHigh } = state.settings;
    const countInRange = logs.filter(l => l.glucose >= targetLow && l.glucose <= targetHigh).length;
    return Math.round((countInRange / logs.length) * 100);
  }
};

// Canvas Chart Renderer
const ChartRenderer = {
  canvas: null,
  ctx: null,
  tooltip: null,
  points: [],

  init() {
    this.canvas = document.getElementById('glucoseCanvasChart');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById('chartTooltip');

    // Attach resize listener
    window.addEventListener('resize', () => this.render());

    // Mouse interactive tooltips
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => {
      if (this.tooltip) this.tooltip.classList.add('hidden');
    });
  },

  getFilteredLogs() {
    if (state.chartFilterDays === 'all') {
      return [...state.logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
    const days = parseInt(state.chartFilterDays, 10);
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return state.logs
      .filter(l => new Date(l.timestamp) >= cutoff)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  render() {
    if (!this.canvas || !this.ctx) return;

    // Adjust canvas resolution for retina displays
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const logs = this.getFilteredLogs();
    this.points = [];

    // Padding for axes
    const padding = { top: 20, right: 20, bottom: 35, left: 45 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    if (logs.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No readings recorded in selected time window', width / 2, height / 2);
      return;
    }

    // Determine Y axis bounds (in mg/dL)
    const minG = 40;
    const maxG = Math.max(300, ...logs.map(l => l.glucose) + 20);

    const getY = (valMgDl) => {
      const ratio = (valMgDl - minG) / (maxG - minG);
      return padding.top + chartH - (ratio * chartH);
    };

    // 1. Draw Target Range Band Shading (70 - 180 mg/dL)
    const targetLowY = getY(state.settings.targetLow);
    const targetHighY = getY(state.settings.targetHigh);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.fillRect(padding.left, targetHighY, chartW, targetLowY - targetHighY);

    // Target Range boundary lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(padding.left, targetLowY);
    ctx.lineTo(padding.left + chartW, targetLowY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding.left, targetHighY);
    ctx.lineTo(padding.left + chartW, targetHighY);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 2. Draw Y-Axis Grid & Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Outfit, sans-serif';
    ctx.textAlign = 'right';

    const yTicks = [50, 100, 150, 200, 250, 300];
    yTicks.forEach(tick => {
      if (tick >= minG && tick <= maxG) {
        const yPos = getY(tick);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, yPos);
        ctx.lineTo(padding.left + chartW, yPos);
        ctx.stroke();

        const labelVal = formatGlucoseValue(tick, state.settings.unit);
        ctx.fillText(labelVal, padding.left - 8, yPos + 4);
      }
    });

    // 3. Map X coordinates
    const startTime = new Date(logs[0].timestamp).getTime();
    const endTime = new Date(logs[logs.length - 1].timestamp).getTime();
    const timeSpan = Math.max(1, endTime - startTime);

    const getX = (tStr) => {
      if (logs.length === 1) return padding.left + chartW / 2;
      const t = new Date(tStr).getTime();
      const ratio = (t - startTime) / timeSpan;
      return padding.left + (ratio * chartW);
    };

    // Draw X-Axis Time Labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    const stepCount = Math.min(5, logs.length);
    for (let i = 0; i < stepCount; i++) {
      const idx = Math.floor(i * (logs.length - 1) / Math.max(1, stepCount - 1));
      const log = logs[idx];
      const x = getX(log.timestamp);
      const dateObj = new Date(log.timestamp);
      const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
      ctx.fillText(dateStr, x, padding.top + chartH + 20);
    }

    // 4. Draw Connecting Line & Gradient Fill
    if (logs.length > 1) {
      ctx.beginPath();
      logs.forEach((log, idx) => {
        const x = getX(log.timestamp);
        const y = getY(log.glucose);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Area gradient fill below line
      const firstX = getX(logs[0].timestamp);
      const lastX = getX(logs[logs.length - 1].timestamp);
      ctx.lineTo(lastX, padding.top + chartH);
      ctx.lineTo(firstX, padding.top + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 5. Plot Reading Data Points with Status Colors
    logs.forEach(log => {
      const x = getX(log.timestamp);
      const y = getY(log.glucose);
      const status = HealthCalc.getStatus(log.glucose);

      let color = '#10b981'; // normal green
      if (status.key === 'hypo') color = '#ef4444';
      else if (status.key === 'high') color = '#f59e0b';
      else if (status.key === 'hyper') color = '#f97316';

      // Outer halo
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Inner white center
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Store point coordinates for mouse tooltip detection
      this.points.push({ x, y, log });
    });
  },

  handleMouseMove(e) {
    if (!this.points || this.points.length === 0 || !this.tooltip) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closest = null;
    let minDistance = 25; // Detection radius in pixels

    this.points.forEach(pt => {
      const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
      if (dist < minDistance) {
        minDistance = dist;
        closest = pt;
      }
    });

    if (closest) {
      const { log } = closest;
      const displayVal = formatGlucoseValue(log.glucose, state.settings.unit);
      const dateStr = new Date(log.timestamp).toLocaleString([], {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      let extraInfo = [];
      if (log.carbs) extraInfo.push(`${log.carbs}g Carbs`);
      if (log.bolus) extraInfo.push(`${log.bolus}U Bolus`);
      if (log.basal) extraInfo.push(`${log.basal}U Basal`);

      const extraText = extraInfo.length > 0 ? ` &bull; ${extraInfo.join(', ')}` : '';

      this.tooltip.innerHTML = `
        <strong>${displayVal} ${state.settings.unit}</strong> (${log.timing})<br/>
        <span style="color: #94a3b8; font-size: 0.75rem;">${dateStr}${extraText}</span>
      `;
      this.tooltip.style.left = `${closest.x}px`;
      this.tooltip.style.top = `${closest.y}px`;
      this.tooltip.classList.remove('hidden');
    } else {
      this.tooltip.classList.add('hidden');
    }
  }
};

// UI Manager & Event Handling
const UI = {
  init() {
    this.bindEvents();
    this.setDefaultTimestamp();
    this.renderAll();
  },

  setDefaultTimestamp() {
    const input = document.getElementById('timestampInput');
    if (input) {
      input.value = toLocalISOString(new Date());
    }
  },

  bindEvents() {
    // Unit Toggle Buttons
    document.getElementById('unitMgDlBtn')?.addEventListener('click', () => this.switchUnit('mg/dL'));
    document.getElementById('unitMmolBtn')?.addEventListener('click', () => this.switchUnit('mmol/L'));

    // Form Submission
    document.getElementById('glucoseForm')?.addEventListener('submit', (e) => this.handleLogSubmit(e));

    // Time filter buttons for chart
    document.querySelectorAll('.time-filter-buttons .filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.time-filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.chartFilterDays = e.target.getAttribute('data-days');
        ChartRenderer.render();
      });
    });

    // Table Controls
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase();
      this.renderTable();
    });

    document.getElementById('filterTimingSelect')?.addEventListener('change', (e) => {
      state.tableTimingFilter = e.target.value;
      this.renderTable();
    });

    document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => {
      if (confirm('Load demo glucose readings into your app?')) {
        Storage.loadDemoData();
        this.renderAll();
      }
    });

    document.getElementById('clearAllLogsBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all saved blood sugar logs? This action cannot be undone.')) {
        state.logs = [];
        Storage.saveLogs();
        this.renderAll();
      }
    });

    // Modals Handling
    document.getElementById('themeSettingsBtn')?.addEventListener('click', () => this.openSettingsModal());
    document.getElementById('exportImportBtn')?.addEventListener('click', () => this.openExportModal());

    // Modal Close Buttons & Backdrop Clicks
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeAllModals();
      });
    });

    // Settings Form Submission
    document.getElementById('settingsForm')?.addEventListener('submit', (e) => this.handleSettingsSubmit(e));

    // Edit Log Form Submission
    document.getElementById('editLogForm')?.addEventListener('submit', (e) => this.handleEditSubmit(e));

    // Data Export & Import Handlers
    document.getElementById('exportCsvBtn')?.addEventListener('click', () => this.exportCsv());
    document.getElementById('exportJsonBtn')?.addEventListener('click', () => this.exportJson());
    document.getElementById('triggerImportBtn')?.addEventListener('click', () => {
      document.getElementById('importJsonInput')?.click();
    });
    document.getElementById('importJsonInput')?.addEventListener('change', (e) => this.importJson(e));
  },

  switchUnit(newUnit) {
    if (state.settings.unit === newUnit) return;
    state.settings.unit = newUnit;
    Storage.saveSettings();

    // Update Unit Buttons Active State
    document.getElementById('unitMgDlBtn')?.classList.toggle('active', newUnit === 'mg/dL');
    document.getElementById('unitMmolBtn')?.classList.toggle('active', newUnit === 'mmol/L');

    // Update Form Labels & Placeholders
    document.querySelectorAll('#formUnitLabel, #editUnitLabel').forEach(el => {
      el.textContent = newUnit;
    });

    const mainInput = document.getElementById('glucoseInput');
    if (mainInput) {
      mainInput.placeholder = newUnit === 'mmol/L' ? 'e.g. 6.1' : 'e.g. 110';
    }

    this.renderAll();
  },

  handleLogSubmit(e) {
    e.preventDefault();

    const rawGlucose = document.getElementById('glucoseInput').value;
    const timing = document.getElementById('timingSelect').value;
    const carbs = parseFloat(document.getElementById('carbsInput').value) || 0;
    const bolus = parseFloat(document.getElementById('bolusInput').value) || 0;
    const basal = parseFloat(document.getElementById('basalInput').value) || 0;
    const medication = document.getElementById('medicationInput').value.trim();
    const activity = document.getElementById('activitySelect').value;
    const timestampStr = document.getElementById('timestampInput').value;

    const glucoseMgDl = parseInputGlucose(rawGlucose, state.settings.unit);

    if (glucoseMgDl <= 0 || isNaN(glucoseMgDl)) {
      alert('Please enter a valid blood glucose measurement.');
      return;
    }

    const newLog = {
      id: 'log_' + Date.now(),
      glucose: glucoseMgDl,
      timing,
      carbs,
      bolus,
      basal,
      medication,
      activity,
      notes: medication,
      timestamp: new Date(timestampStr).toISOString()
    };

    state.logs.push(newLog);
    Storage.saveLogs();

    // Reset Form & Update Timestamp
    document.getElementById('glucoseInput').value = '';
    document.getElementById('carbsInput').value = '';
    document.getElementById('bolusInput').value = '';
    document.getElementById('basalInput').value = '';
    document.getElementById('medicationInput').value = '';
    this.setDefaultTimestamp();

    this.renderAll();
  },

  renderAll() {
    this.renderSummaryCards();
    this.renderTable();
    ChartRenderer.render();
    this.checkHypoAlert();
  },

  renderSummaryCards() {
    const unit = state.settings.unit;
    const avgMgDl = HealthCalc.getAverageGlucose(state.logs);
    const avgValDisplay = avgMgDl > 0 ? formatGlucoseValue(avgMgDl, unit) : '--';
    
    document.getElementById('avgGlucoseVal').textContent = avgValDisplay;
    document.getElementById('avgGlucoseUnit').textContent = unit;

    const lowTargetStr = formatGlucoseValue(state.settings.targetLow, unit);
    const highTargetStr = formatGlucoseValue(state.settings.targetHigh, unit);
    const avgSub = document.getElementById('avgGlucoseSub');
    if (avgSub) {
      avgSub.textContent = `Target: ${lowTargetStr} - ${highTargetStr} ${unit}`;
    }

    const chartRangeLabel = document.getElementById('chartRangeLabel');
    if (chartRangeLabel) {
      chartRangeLabel.textContent = `${lowTargetStr} - ${highTargetStr} ${unit}`;
    }

    const estA1C = HealthCalc.getEstimatedA1C(avgMgDl);
    document.getElementById('estA1cVal').textContent = estA1C > 0 ? `${estA1C} %` : '-- %';

    const tirPct = HealthCalc.getTimeInRange(state.logs);
    document.getElementById('tirVal').textContent = state.logs.length > 0 ? `${tirPct} %` : '-- %';

    document.getElementById('totalLogsVal').textContent = state.logs.length.toString();

    // Subtitle for latest log
    const lastSub = document.getElementById('lastLoggedSub');
    if (state.logs.length > 0) {
      const sorted = [...state.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latest = sorted[0];
      const relTime = new Date(latest.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      lastSub.textContent = `Latest: ${relTime}`;
    } else {
      lastSub.textContent = 'No recent logs';
    }
  },

  renderTable() {
    const tbody = document.getElementById('logsTableBody');
    const emptyState = document.getElementById('emptyTableState');
    const badge = document.getElementById('logCountBadge');

    if (!tbody) return;

    let filtered = [...state.logs];

    // Filter by timing context
    if (state.tableTimingFilter !== 'all') {
      filtered = filtered.filter(l => l.timing === state.tableTimingFilter);
    }

    // Filter by search query
    if (state.searchQuery) {
      filtered = filtered.filter(l => 
        l.timing.toLowerCase().includes(state.searchQuery) ||
        (l.notes && l.notes.toLowerCase().includes(state.searchQuery)) ||
        (l.medication && l.medication.toLowerCase().includes(state.searchQuery))
      );
    }

    // Sort descending by timestamp
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (badge) badge.textContent = `${filtered.length} entries`;

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) {
        emptyState.classList.remove('hidden');
        const emptyTitle = emptyState.querySelector('h3');
        const emptyDesc = emptyState.querySelector('p');
        if (state.logs.length > 0) {
          if (emptyTitle) emptyTitle.textContent = 'No Matching Glucose Logs';
          if (emptyDesc) emptyDesc.textContent = 'No readings match your search query or selected timing filter.';
        } else {
          if (emptyTitle) emptyTitle.textContent = 'No Glucose Logs Recorded Yet';
          if (emptyDesc) emptyDesc.textContent = 'Start by filling out the log form above or click "Load Demo Logs" to explore features!';
        }
      }
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tbody.innerHTML = filtered.map(log => {
      const dateStr = new Date(log.timestamp).toLocaleString([], {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      const displayGlucose = formatGlucoseValue(log.glucose, state.settings.unit);
      const status = HealthCalc.getStatus(log.glucose);

      const carbsStr = log.carbs ? `${log.carbs}g` : '-';
      
      let insulinParts = [];
      if (log.bolus) insulinParts.push(`${log.bolus}U Bolus`);
      if (log.basal) insulinParts.push(`${log.basal}U Basal`);
      const insulinStr = insulinParts.length > 0 ? insulinParts.join(', ') : '-';

      const notesStr = log.notes || log.medication || '-';

      return `
        <tr>
          <td style="font-weight: 500;">${dateStr}</td>
          <td>
            <strong style="font-size: 1rem;">${displayGlucose}</strong>
            <span style="color: #94a3b8; font-size: 0.78rem;">${state.settings.unit}</span>
          </td>
          <td><span class="timing-tag">${log.timing}</span></td>
          <td>${carbsStr}</td>
          <td>${insulinStr}</td>
          <td><span style="color: #cbd5e1;">${notesStr}</span></td>
          <td><span class="status-pill ${status.pillClass}">${status.label}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-icon-btn" onclick="UI.editLog('${log.id}')" title="Edit Log">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-icon-btn delete-btn" onclick="UI.deleteLog('${log.id}')" title="Delete Log">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  checkHypoAlert() {
    const banner = document.getElementById('hypoAlertBanner');
    if (!banner || state.logs.length === 0) return;

    // Get latest log chronologically
    const sorted = [...state.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latest = sorted[0];

    if (latest.glucose < state.settings.hypoLimit) {
      const displayVal = formatGlucoseValue(latest.glucose, state.settings.unit);
      document.getElementById('hypoAlertMsg').textContent = 
        `Latest reading is ${displayVal} ${state.settings.unit} (LOW!). Consume 15g fast-acting carbs (e.g. 4 oz juice or 3-4 glucose tablets) and recheck in 15 minutes.`;
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  },

  editLog(id) {
    const log = state.logs.find(l => l.id === id);
    if (!log) return;

    state.editingLogId = id;
    document.getElementById('editLogId').value = id;
    document.getElementById('editGlucoseInput').value = formatGlucoseValue(log.glucose, state.settings.unit);
    document.getElementById('editTimingSelect').value = log.timing;
    document.getElementById('editCarbsInput').value = log.carbs || '';
    document.getElementById('editBolusInput').value = log.bolus || '';
    document.getElementById('editBasalInput').value = log.basal || '';
    document.getElementById('editMedicationInput').value = log.notes || log.medication || '';
    document.getElementById('editActivitySelect').value = log.activity || 'None';

    const d = new Date(log.timestamp);
    document.getElementById('editTimestampInput').value = toLocalISOString(d);

    document.getElementById('editLogModal').classList.remove('hidden');
  },

  handleEditSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('editLogId').value;
    const index = state.logs.findIndex(l => l.id === id);
    if (index === -1) return;

    const rawGlucose = document.getElementById('editGlucoseInput').value;
    const glucoseMgDl = parseInputGlucose(rawGlucose, state.settings.unit);

    state.logs[index] = {
      ...state.logs[index],
      glucose: glucoseMgDl,
      timing: document.getElementById('editTimingSelect').value,
      carbs: parseFloat(document.getElementById('editCarbsInput').value) || 0,
      bolus: parseFloat(document.getElementById('editBolusInput').value) || 0,
      basal: parseFloat(document.getElementById('editBasalInput').value) || 0,
      medication: document.getElementById('editMedicationInput').value.trim(),
      notes: document.getElementById('editMedicationInput').value.trim(),
      activity: document.getElementById('editActivitySelect').value,
      timestamp: new Date(document.getElementById('editTimestampInput').value).toISOString()
    };

    Storage.saveLogs();
    this.closeAllModals();
    this.renderAll();
  },

  deleteLog(id) {
    if (confirm('Delete this reading from your log history?')) {
      state.logs = state.logs.filter(l => l.id !== id);
      Storage.saveLogs();
      this.renderAll();
    }
  },

  openSettingsModal() {
    const { unit, hypoLimit, targetLow, targetHigh, hyperLimit } = state.settings;
    document.querySelectorAll('.unit-text').forEach(el => el.textContent = unit);

    document.getElementById('setHypoLimit').value = formatGlucoseValue(hypoLimit, unit);
    document.getElementById('setTargetLow').value = formatGlucoseValue(targetLow, unit);
    document.getElementById('setTargetHigh').value = formatGlucoseValue(targetHigh, unit);
    document.getElementById('setHyperLimit').value = formatGlucoseValue(hyperLimit, unit);

    document.getElementById('settingsModal').classList.remove('hidden');
  },

  handleSettingsSubmit(e) {
    e.preventDefault();
    const unit = state.settings.unit;

    state.settings.hypoLimit = parseInputGlucose(document.getElementById('setHypoLimit').value, unit);
    state.settings.targetLow = parseInputGlucose(document.getElementById('setTargetLow').value, unit);
    state.settings.targetHigh = parseInputGlucose(document.getElementById('setTargetHigh').value, unit);
    state.settings.hyperLimit = parseInputGlucose(document.getElementById('setHyperLimit').value, unit);

    Storage.saveSettings();
    document.getElementById('chartRangeLabel').textContent = `${formatGlucoseValue(state.settings.targetLow, unit)} - ${formatGlucoseValue(state.settings.targetHigh, unit)} ${unit}`;

    this.closeAllModals();
    this.renderAll();
  },

  openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  },

  exportCsv() {
    if (state.logs.length === 0) {
      alert('No logs available to export.');
      return;
    }

    const headers = ['Timestamp', 'Glucose (mg/dL)', 'Glucose (mmol/L)', 'Timing Context', 'Carbs (g)', 'Bolus Insulin (U)', 'Basal Insulin (U)', 'Medication/Notes', 'Activity', 'Status'];
    const rows = state.logs.map(l => {
      const status = HealthCalc.getStatus(l.glucose);
      return [
        `"${new Date(l.timestamp).toLocaleString()}"`,
        l.glucose,
        mgDlToMmol(l.glucose),
        `"${l.timing}"`,
        l.carbs || 0,
        l.bolus || 0,
        l.basal || 0,
        `"${(l.notes || l.medication || '').replace(/"/g, '""')}"`,
        `"${l.activity || 'None'}"`,
        `"${status.label}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `glucopulse_logs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportJson() {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      settings: state.settings,
      logs: state.logs
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `glucopulse_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  importJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && Array.isArray(parsed.logs)) {
          state.logs = parsed.logs;
          if (parsed.settings) state.settings = { ...state.settings, ...parsed.settings };

          Storage.saveLogs();
          Storage.saveSettings();
          this.closeAllModals();
          this.renderAll();
          alert('Data restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error reading JSON backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  Storage.load();
  ChartRenderer.init();
  UI.init();
});
