/**
 * Software Engineering Process Knowledge Base - Core Application Logic
 */

(function () {
    'use strict';

    // --- Local Storage Keys ---
    const STORAGE_KEYS = {
        THEME: 'seqa_wiki_theme',
        BOOKMARKS: 'seqa_wiki_bookmarks',
        CUSTOM_ASSETS: 'seqa_wiki_custom_assets',
        CHECKLIST_STATE: 'seqa_wiki_checklist_state',
        LAYOUT: 'seqa_wiki_layout'
    };

    // --- App State ---
    const AppState = {
        currentView: 'explore', // explore | detail | studio | checklists | glossary
        selectedPhase: null,   // null for all, or phase id ('requirements', etc.)
        selectedCategory: 'all', // 'all', 'guideline', 'template', 'checklist', 'policy'
        searchQuery: '',
        onlyFavorites: false,
        layoutMode: localStorage.getItem(STORAGE_KEYS.LAYOUT) || 'grid',
        theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
        bookmarks: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]')),
        customAssets: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_ASSETS) || '[]'),
        checklistProgress: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKLIST_STATE) || '{}'),
        activeAssetId: null,
        activeStudioTemplateId: 'adr-template',
        activeChecklistId: 'pre-merge-checklist',
        editingAssetId: null
    };

    // --- Helper to get all combined assets ---
    function getAllAssets() {
        return [...SE_PROCESS_DATA.assets, ...AppState.customAssets];
    }

    function getAssetById(id) {
        return getAllAssets().find(a => a.id === id);
    }

    function getChecklistById(id) {
        return SE_PROCESS_DATA.checklists.find(c => c.id === id);
    }

    function getPhaseById(id) {
        return SE_PROCESS_DATA.phases.find(p => p.id === id);
    }

    // --- Toast Notifications ---
    function showToast(message, icon = 'ℹ️') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Theme Controller ---
    function initTheme() {
        const htmlEl = document.documentElement;
        htmlEl.setAttribute('data-theme', AppState.theme);
        updateThemeIcon();

        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
                htmlEl.setAttribute('data-theme', AppState.theme);
                localStorage.setItem(STORAGE_KEYS.THEME, AppState.theme);
                updateThemeIcon();
                showToast(`Switched to ${AppState.theme} mode`, AppState.theme === 'dark' ? '🌙' : '☀️');
            });
        }
    }

    function updateThemeIcon() {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // --- Router & View Switcher ---
    function switchView(viewName, params = {}) {
        AppState.currentView = viewName;
        document.querySelectorAll('.view-panel').forEach(panel => {
            panel.classList.remove('active-view');
        });

        // Update active nav button styling
        document.querySelectorAll('.nav-item-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (viewName === 'explore') {
            document.getElementById('viewExplorer').classList.add('active-view');
            document.getElementById('navExploreBtn').classList.add('active');
            renderAssetsExplorer();
        } else if (viewName === 'detail') {
            document.getElementById('viewDetail').classList.add('active-view');
            if (params.id) {
                AppState.activeAssetId = params.id;
            }
            renderAssetDetail(AppState.activeAssetId);
        } else if (viewName === 'studio') {
            document.getElementById('viewStudio').classList.add('active-view');
            document.getElementById('navStudioBtn').classList.add('active');
            if (params.templateId) {
                AppState.activeStudioTemplateId = params.templateId;
            }
            renderTemplateStudio(AppState.activeStudioTemplateId);
        } else if (viewName === 'checklists') {
            document.getElementById('viewChecklists').classList.add('active-view');
            document.getElementById('navChecklistsBtn').classList.add('active');
            if (params.checklistId) {
                AppState.activeChecklistId = params.checklistId;
            }
            renderChecklistRunner(AppState.activeChecklistId);
        } else if (viewName === 'glossary') {
            document.getElementById('viewGlossary').classList.add('active-view');
            document.getElementById('navGlossaryBtn').classList.add('active');
            renderGlossary();
        } else if (viewName === 'favorites') {
            document.getElementById('viewExplorer').classList.add('active-view');
            document.getElementById('navFavoritesBtn').classList.add('active');
            AppState.onlyFavorites = true;
            renderAssetsExplorer();
        }
    }

    // --- Sidebar Navigation Init ---
    function initSidebar() {
        // Populate SDLC Phases in Sidebar
        const phaseListEl = document.getElementById('phaseNavList');
        if (phaseListEl) {
            phaseListEl.innerHTML = SE_PROCESS_DATA.phases.map(phase => `
        <li>
          <button class="nav-item-btn phase-nav-btn" data-phase-id="${phase.id}">
            <div class="nav-item-left">
              <span class="phase-dot" style="background-color: ${phase.color};"></span>
              <span>${phase.name}</span>
            </div>
            <span class="nav-badge-count" id="count-phase-${phase.id}">0</span>
          </button>
        </li>
      `).join('');

            phaseListEl.querySelectorAll('.phase-nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const phaseId = btn.getAttribute('data-phase-id');
                    if (AppState.selectedPhase === phaseId) {
                        AppState.selectedPhase = null; // toggle off
                    } else {
                        AppState.selectedPhase = phaseId;
                    }
                    AppState.onlyFavorites = false;
                    switchView('explore');
                });
            });
        }

        // Populate Asset Categories in Sidebar
        const catListEl = document.getElementById('categoryNavList');
        if (catListEl) {
            catListEl.innerHTML = SE_PROCESS_DATA.categories.filter(c => c.id !== 'all').map(cat => `
        <li>
          <button class="nav-item-btn cat-nav-btn" data-cat-id="${cat.id}">
            <div class="nav-item-left">
              <span class="nav-icon">${cat.icon}</span>
              <span>${cat.name}</span>
            </div>
            <span class="nav-badge-count" id="count-cat-${cat.id}">0</span>
          </button>
        </li>
      `).join('');

            catListEl.querySelectorAll('.cat-nav-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    AppState.selectedCategory = btn.getAttribute('data-cat-id');
                    AppState.onlyFavorites = false;
                    switchView('explore');
                });
            });
        }

        // Top buttons in sidebar
        document.getElementById('navExploreBtn')?.addEventListener('click', () => {
            AppState.selectedPhase = null;
            AppState.selectedCategory = 'all';
            AppState.onlyFavorites = false;
            AppState.searchQuery = '';
            const input = document.getElementById('globalSearchInput');
            if (input) input.value = '';
            switchView('explore');
        });

        document.getElementById('navFavoritesBtn')?.addEventListener('click', () => {
            switchView('favorites');
        });

        document.getElementById('navStudioBtn')?.addEventListener('click', () => switchView('studio'));
        document.getElementById('navChecklistsBtn')?.addEventListener('click', () => switchView('checklists'));
        document.getElementById('navGlossaryBtn')?.addEventListener('click', () => switchView('glossary'));

        // Mobile drawer toggle
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('appSidebar');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    }

    // --- Update Asset Counts in Sidebar ---
    function updateSidebarCounts() {
        const assets = getAllAssets();
        const totalEl = document.getElementById('totalAssetsCount');
        if (totalEl) totalEl.textContent = assets.length;

        const favEl = document.getElementById('favoritesCount');
        if (favEl) favEl.textContent = AppState.bookmarks.size;

        // Count per phase
        SE_PROCESS_DATA.phases.forEach(p => {
            const countEl = document.getElementById(`count-phase-${p.id}`);
            if (countEl) {
                countEl.textContent = assets.filter(a => a.phase === p.id).length;
            }
        });

        // Count per category
        SE_PROCESS_DATA.categories.forEach(c => {
            if (c.id === 'all') return;
            const countEl = document.getElementById(`count-cat-${c.id}`);
            if (countEl) {
                countEl.textContent = assets.filter(a => a.type === c.id).length;
            }
        });
    }

    // --- Render Interactive SDLC Process Flow Banner ---
    function renderProcessMap() {
        const flowContainer = document.getElementById('phaseCardsFlow');
        if (!flowContainer) return;

        const allAssets = getAllAssets();

        flowContainer.innerHTML = SE_PROCESS_DATA.phases.map(phase => {
            const count = allAssets.filter(a => a.phase === phase.id).length;
            const isActive = AppState.selectedPhase === phase.id;
            return `
        <div class="phase-node-card ${isActive ? 'active' : ''}" data-phase-id="${phase.id}" style="border-top: 3px solid ${phase.color};">
          <div class="phase-node-header">
            <span class="phase-node-icon">${phase.icon}</span>
            <span class="phase-node-name">${phase.name.split(' ')[0]}</span>
          </div>
          <div class="phase-node-desc">${phase.description}</div>
          <div class="phase-node-footer">
            <span>${count} Assets</span>
            <span style="color: ${phase.color}; font-weight: 600;">Explore →</span>
          </div>
        </div>
      `;
        }).join('');

        flowContainer.querySelectorAll('.phase-node-card').forEach(card => {
            card.addEventListener('click', () => {
                const phaseId = card.getAttribute('data-phase-id');
                if (AppState.selectedPhase === phaseId) {
                    AppState.selectedPhase = null;
                } else {
                    AppState.selectedPhase = phaseId;
                }
                renderAssetsExplorer();
            });
        });

        // Render expanded details if a phase is selected
        const detailsContainer = document.getElementById('phaseExpandedDetails');
        const resetBtn = document.getElementById('resetPhaseFilterBtn');

        if (AppState.selectedPhase) {
            const activePhase = getPhaseById(AppState.selectedPhase);
            if (activePhase) {
                detailsContainer.style.display = 'grid';
                if (resetBtn) resetBtn.style.display = 'inline-flex';

                document.getElementById('expandedPhaseName').innerHTML = `
          <span>${activePhase.icon} ${activePhase.name}</span>
          <span style="font-size: 11px; margin-left: 8px; color: var(--text-muted);">(RACI Matrix)</span>
        `;

                document.getElementById('expandedRaciGrid').innerHTML = `
          <div class="raci-item" style="border-color: #3b82f6;">
            <div class="raci-label">Responsible (R)</div>
            <div class="raci-val">${activePhase.raci.responsible}</div>
          </div>
          <div class="raci-item" style="border-color: #8b5cf6;">
            <div class="raci-label">Accountable (A)</div>
            <div class="raci-val">${activePhase.raci.accountable}</div>
          </div>
          <div class="raci-item" style="border-color: #f59e0b;">
            <div class="raci-label">Consulted (C)</div>
            <div class="raci-val">${activePhase.raci.consulted}</div>
          </div>
          <div class="raci-item" style="border-color: #10b981;">
            <div class="raci-label">Informed (I)</div>
            <div class="raci-val">${activePhase.raci.informed}</div>
          </div>
        `;

                document.getElementById('expandedQualityGate').textContent = activePhase.qualityGate;
            }
        } else {
            if (detailsContainer) detailsContainer.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'none';
        }

        resetBtn?.addEventListener('click', () => {
            AppState.selectedPhase = null;
            renderAssetsExplorer();
        });
    }

    // --- Render Category Filter Pills ---
    function renderFilterPills() {
        const pillsContainer = document.getElementById('categoryFilterPills');
        if (!pillsContainer) return;

        pillsContainer.innerHTML = SE_PROCESS_DATA.categories.map(cat => {
            const isActive = AppState.selectedCategory === cat.id && !AppState.onlyFavorites;
            return `
        <button class="filter-pill-btn ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
          <span>${cat.icon}</span>
          <span>${cat.name}</span>
        </button>
      `;
        }).join('');

        pillsContainer.querySelectorAll('.filter-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                AppState.selectedCategory = btn.getAttribute('data-cat-id');
                AppState.onlyFavorites = false;
                renderAssetsExplorer();
            });
        });
    }

    // --- Render Assets Explorer Grid ---
    function renderAssetsExplorer() {
        renderProcessMap();
        renderFilterPills();
        updateSidebarCounts();

        let filtered = getAllAssets();

        // Filter by Phase
        if (AppState.selectedPhase) {
            filtered = filtered.filter(a => a.phase === AppState.selectedPhase);
        }

        // Filter by Category
        if (AppState.selectedCategory && AppState.selectedCategory !== 'all') {
            filtered = filtered.filter(a => a.type === AppState.selectedCategory);
        }

        // Filter by Favorites
        if (AppState.onlyFavorites) {
            filtered = filtered.filter(a => AppState.bookmarks.has(a.id));
        }

        // Filter by Search Query
        if (AppState.searchQuery.trim()) {
            const q = AppState.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(a => {
                const matchTitle = a.title.toLowerCase().includes(q);
                const matchSummary = a.summary.toLowerCase().includes(q);
                const matchTags = a.tags && a.tags.some(t => t.toLowerCase().includes(q));
                const matchContent = a.content && a.content.toLowerCase().includes(q);
                const matchOwner = a.owner && a.owner.toLowerCase().includes(q);
                return matchTitle || matchSummary || matchTags || matchContent || matchOwner;
            });
        }

        const grid = document.getElementById('assetsGrid');
        const emptyState = document.getElementById('emptyState');
        const countText = document.getElementById('visibleAssetsCountText');

        if (countText) {
            countText.textContent = `Showing ${filtered.length} asset${filtered.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'flex';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        grid.className = `assets-grid ${AppState.layoutMode === 'list' ? 'list-layout' : ''}`;

        grid.innerHTML = filtered.map(asset => {
            const phase = getPhaseById(asset.phase) || { name: 'General', color: '#3b82f6', icon: '📦' };
            const isBookmarked = AppState.bookmarks.has(asset.id);
            const typeBadgeClass = `type-${asset.type}`;

            return `
        <article class="asset-card" data-asset-id="${asset.id}">
          <div class="asset-card-header">
            <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
              <span class="asset-type-badge ${typeBadgeClass}">${asset.type}</span>
              <span style="font-size: 11px; font-weight: 600; color: ${phase.color}; display: flex; align-items: center; gap: 4px;">
                <span>${phase.icon}</span> ${phase.name.split(' ')[0]}
              </span>
            </div>
            <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-bookmark-id="${asset.id}" title="Save to Bookmarks">
              ${isBookmarked ? '⭐' : '☆'}
            </button>
          </div>

          <h3 class="asset-card-title">${asset.title}</h3>
          <p class="asset-card-summary">${asset.summary}</p>

          <div class="asset-tags">
            ${(asset.tags || []).slice(0, 3).map(tag => `<span class="tag-badge">#${tag}</span>`).join('')}
          </div>

          <div class="asset-card-footer">
            <div class="asset-meta-item">
              <span>👤 ${asset.owner || 'Guild'}</span>
            </div>
            <div class="asset-meta-item">
              <span style="font-family: var(--font-mono); font-size: 11px; background: var(--bg-surface-elevated); padding: 2px 6px; border-radius: 4px;">${asset.version || 'v1.0'}</span>
            </div>
          </div>
        </article>
      `;
        }).join('');

        // Click on card opens detail
        grid.querySelectorAll('.asset-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.bookmark-btn')) return;
                const id = card.getAttribute('data-asset-id');
                switchView('detail', { id });
            });
        });

        // Bookmark toggles
        grid.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-bookmark-id');
                toggleBookmark(id);
            });
        });
    }

    // --- Toggle Bookmark ---
    function toggleBookmark(id) {
        if (AppState.bookmarks.has(id)) {
            AppState.bookmarks.delete(id);
            showToast('Removed from bookmarks', '☆');
        } else {
            AppState.bookmarks.add(id);
            showToast('Added to bookmarks', '⭐');
        }
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...AppState.bookmarks]));
        updateSidebarCounts();
        if (AppState.currentView === 'explore' || AppState.currentView === 'favorites') {
            renderAssetsExplorer();
        } else if (AppState.currentView === 'detail') {
            updateDetailBookmarkBtn(id);
        }
    }

    function updateDetailBookmarkBtn(id) {
        const isBookmarked = AppState.bookmarks.has(id);
        const btn = document.getElementById('detailBookmarkBtn');
        const icon = document.getElementById('detailBookmarkIcon');
        const text = document.getElementById('detailBookmarkText');
        if (btn && icon && text) {
            icon.textContent = isBookmarked ? '⭐' : '☆';
            text.textContent = isBookmarked ? 'Bookmarked' : 'Bookmark';
        }
    }

    // --- Render Asset Detail View ---
    function renderAssetDetail(assetId) {
        const asset = getAssetById(assetId);
        if (!asset) {
            showToast('Asset not found', '⚠️');
            switchView('explore');
            return;
        }

        const phase = getPhaseById(asset.phase) || { name: 'General', color: '#3b82f6', icon: '📦' };

        document.getElementById('detailTitle').textContent = asset.title;
        document.getElementById('detailSummary').textContent = asset.summary;
        document.getElementById('detailOwner').textContent = asset.owner || 'Architecture & Engineering Board';
        document.getElementById('detailVersion').textContent = asset.version || 'v1.0';
        document.getElementById('detailLastUpdated').textContent = asset.lastUpdated || '2026-08-19';
        document.getElementById('detailStatus').textContent = asset.status || 'Active';

        // Badges
        const badgesEl = document.getElementById('detailBadges');
        badgesEl.innerHTML = `
      <span class="asset-type-badge type-${asset.type}">${asset.type.toUpperCase()}</span>
      <span class="asset-type-badge" style="background: ${phase.color}22; color: ${phase.color}; border: 1px solid ${phase.color}55;">
        ${phase.icon} ${phase.name}
      </span>
      <span class="tag-badge">Status: ${asset.status || 'Active'}</span>
    `;

        // Render Markdown Content
        const renderedHtml = MarkdownParser.render(asset.content);
        const contentEl = document.getElementById('detailRenderedContent');
        contentEl.innerHTML = renderedHtml;

        // Generate Table of Contents (TOC)
        generateTOC(contentEl);

        // Primary action button context (e.g. Customize if template, Run if checklist)
        const actionBtn = document.getElementById('detailActionTriggerBtn');
        const actionIcon = document.getElementById('detailActionIcon');
        const actionText = document.getElementById('detailActionText');

        if (asset.type === 'template') {
            actionBtn.style.display = 'inline-flex';
            actionIcon.textContent = '🎨';
            actionText.textContent = 'Customize in Studio';
            actionBtn.onclick = () => switchView('studio', { templateId: asset.id });
        } else if (asset.type === 'checklist') {
            actionBtn.style.display = 'inline-flex';
            actionIcon.textContent = '✅';
            actionText.textContent = 'Run Interactive Gate';
            actionBtn.onclick = () => switchView('checklists', { checklistId: asset.id });
        } else {
            actionBtn.style.display = 'none';
        }

        // Action button handlers
        document.getElementById('detailBackBtn').onclick = () => switchView('explore');

        document.getElementById('detailCopyMdBtn').onclick = function () {
            TemplateEngine.copyToClipboard(asset.content, this, 'Markdown Copied!');
        };

        document.getElementById('detailDownloadBtn').onclick = () => {
            TemplateEngine.downloadMarkdown(asset.title, asset.content);
            showToast(`Exported ${asset.title}.md`, '⬇️');
        };

        document.getElementById('detailPrintBtn').onclick = () => window.print();

        document.getElementById('detailBookmarkBtn').onclick = () => toggleBookmark(asset.id);
        updateDetailBookmarkBtn(asset.id);
    }

    // --- Dynamic Table of Contents (TOC) Builder ---
    function generateTOC(contentElement) {
        const tocList = document.getElementById('detailTocList');
        const tocSidebar = document.getElementById('detailTocSidebar');
        if (!tocList || !tocSidebar) return;

        const headings = contentElement.querySelectorAll('h1, h2, h3');
        if (headings.length < 2) {
            tocSidebar.style.display = 'none';
            return;
        }

        tocSidebar.style.display = 'block';
        tocList.innerHTML = '';

        headings.forEach((h, idx) => {
            const id = `toc-heading-${idx}`;
            h.id = id;
            const li = document.createElement('li');
            li.style.marginLeft = h.tagName === 'H3' ? '12px' : '0';
            li.innerHTML = `<a href="#${id}" class="toc-link">${h.textContent}</a>`;
            tocList.appendChild(li);
        });

        tocList.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // --- Render Template Generator Studio ---
    function renderTemplateStudio(templateId) {
        const allAssets = getAllAssets();
        const templates = allAssets.filter(a => a.type === 'template' || a.fields);

        const selectEl = document.getElementById('studioTemplateSelect');
        selectEl.innerHTML = templates.map(t => `
      <option value="${t.id}" ${t.id === templateId ? 'selected' : ''}>${t.title}</option>
    `).join('');

        selectEl.onchange = (e) => {
            AppState.activeStudioTemplateId = e.target.value;
            renderTemplateStudio(e.target.value);
        };

        const activeTemplate = getAssetById(templateId) || templates[0];
        if (!activeTemplate) return;

        const formContainer = document.getElementById('studioFormFields');
        const fields = activeTemplate.fields || [
            { key: 'TITLE', label: 'Title / Initiative', placeholder: 'Enter Title' },
            { key: 'AUTHOR', label: 'Author', placeholder: 'Author Name' },
            { key: 'DATE', label: 'Date', placeholder: '2026-08-19' }
        ];

        const currentValues = {};

        formContainer.innerHTML = fields.map(f => {
            currentValues[f.key] = f.placeholder || '';
            return `
        <div class="form-group">
          <label class="form-label">${f.label}</label>
          <input type="text" class="form-input studio-field-input" data-field-key="${f.key}" placeholder="${f.placeholder || ''}" value="${f.placeholder || ''}">
        </div>
      `;
        }).join('');

        const previewEl = document.getElementById('studioPreviewArea');

        function updatePreview() {
            formContainer.querySelectorAll('.studio-field-input').forEach(input => {
                const key = input.getAttribute('data-field-key');
                currentValues[key] = input.value || input.placeholder;
            });

            const interpolated = TemplateEngine.interpolate(activeTemplate.content, currentValues);
            previewEl.innerHTML = MarkdownParser.render(interpolated);
            return interpolated;
        }

        // Attach real-time input listeners
        formContainer.querySelectorAll('.studio-field-input').forEach(input => {
            input.addEventListener('input', updatePreview);
        });

        const initialMd = updatePreview();

        // Studio Copy & Export handlers
        document.getElementById('studioCopyBtn').onclick = function () {
            const md = updatePreview();
            TemplateEngine.copyToClipboard(md, this, 'Template Copied!');
        };

        document.getElementById('studioDownloadBtn').onclick = () => {
            const md = updatePreview();
            TemplateEngine.downloadMarkdown(activeTemplate.title, md);
            showToast(`Exported ${activeTemplate.title}.md`, '⬇️');
        };
    }

    // --- Render Interactive Quality Gate Checklist Runner ---
    function renderChecklistRunner(checklistId) {
        const checklists = SE_PROCESS_DATA.checklists;
        const selectEl = document.getElementById('checklistSelect');

        selectEl.innerHTML = checklists.map(c => `
      <option value="${c.id}" ${c.id === checklistId ? 'selected' : ''}>${c.title}</option>
    `).join('');

        selectEl.onchange = (e) => {
            AppState.activeChecklistId = e.target.value;
            renderChecklistRunner(e.target.value);
        };

        const activeChecklist = getChecklistById(checklistId) || checklists[0];
        if (!activeChecklist) return;

        document.getElementById('activeChecklistTitle').textContent = activeChecklist.title;
        document.getElementById('activeChecklistDesc').textContent = activeChecklist.description;

        const itemsContainer = document.getElementById('activeChecklistItems');
        if (!AppState.checklistProgress[activeChecklist.id]) {
            AppState.checklistProgress[activeChecklist.id] = {};
        }

        const savedState = AppState.checklistProgress[activeChecklist.id];

        itemsContainer.innerHTML = activeChecklist.items.map((item, idx) => {
            const isChecked = !!savedState[item.id];
            return `
        <div class="interactive-check-item ${isChecked ? 'checked' : ''}" data-item-id="${item.id}">
          <div class="custom-checkbox">
            ${isChecked ? '✓' : ''}
          </div>
          <div class="check-content">
            <div class="check-item-text">${item.text}</div>
            <div class="check-item-cat">${item.category}</div>
          </div>
        </div>
      `;
        }).join('');

        function updateChecklistProgress() {
            const total = activeChecklist.items.length;
            let checkedCount = 0;
            activeChecklist.items.forEach(item => {
                if (savedState[item.id]) checkedCount++;
            });

            const pct = Math.round((checkedCount / total) * 100);
            const circleEl = document.getElementById('checklistProgressCircle');
            const textEl = document.getElementById('checklistProgressText');
            const countEl = document.getElementById('checklistItemsPassedCount');
            const summaryEl = document.getElementById('checklistStatusSummary');

            const circumference = 2 * Math.PI * 58; // 364.4
            const offset = circumference - (pct / 100) * circumference;

            if (circleEl) {
                circleEl.style.strokeDashoffset = offset;
                circleEl.style.stroke = pct === 100 ? 'var(--success)' : (pct > 50 ? 'var(--primary)' : 'var(--warning)');
            }

            if (textEl) textEl.textContent = `${pct}%`;
            if (countEl) countEl.textContent = `${checkedCount} of ${total} items verified`;
            if (summaryEl) {
                if (pct === 100) {
                    summaryEl.innerHTML = '<span style="color: var(--success); font-weight: 700;">🟢 GATE PASSED (READY)</span>';
                } else {
                    summaryEl.innerHTML = `<span style="color: var(--warning); font-weight: 600;">🟡 IN PROGRESS (${total - checkedCount} pending)</span>`;
                }
            }

            localStorage.setItem(STORAGE_KEYS.CHECKLIST_STATE, JSON.stringify(AppState.checklistProgress));
        }

        itemsContainer.querySelectorAll('.interactive-check-item').forEach(el => {
            el.addEventListener('click', () => {
                const itemId = el.getAttribute('data-item-id');
                const isCurrentlyChecked = !!savedState[itemId];
                savedState[itemId] = !isCurrentlyChecked;

                if (savedState[itemId]) {
                    el.classList.add('checked');
                    el.querySelector('.custom-checkbox').textContent = '✓';
                } else {
                    el.classList.remove('checked');
                    el.querySelector('.custom-checkbox').textContent = '';
                }

                updateChecklistProgress();
            });
        });

        updateChecklistProgress();

        // Reset Checklist button
        document.getElementById('resetChecklistBtn').onclick = () => {
            AppState.checklistProgress[activeChecklist.id] = {};
            renderChecklistRunner(activeChecklist.id);
            showToast('Checklist state reset', '↺');
        };

        // Generate Audit Sign-off Certificate Report
        document.getElementById('generateSignoffReportBtn').onclick = () => {
            const engineer = document.getElementById('signoffEngineerName').value.trim() || 'Lead Engineering Auditor';
            const ref = document.getElementById('signoffRefNumber').value.trim() || 'PROD-RELEASE-SIGN-OFF';
            const total = activeChecklist.items.length;
            let checkedCount = 0;

            const itemsMd = activeChecklist.items.map(item => {
                const checked = !!savedState[item.id];
                if (checked) checkedCount++;
                return `- [${checked ? 'x' : ' '}] **[${item.category}]** ${item.text}`;
            }).join('\n');

            const pct = Math.round((checkedCount / total) * 100);
            const dateStr = new Date().toISOString();

            const reportMarkdown = `# QUALITY GATE AUDIT CERTIFICATE
**Checklist:** ${activeChecklist.title}  
**Reference / Ticket:** ${ref}  
**Sign-off Auditor:** ${engineer}  
**Audit Timestamp:** ${dateStr}  
**Gate Status:** ${pct === 100 ? '✅ PASSED (100% Verified)' : `⚠️ INCOMPLETE (${pct}% Passed)`}  

---

## Verified Audit Criteria
${itemsMd}

---
*Generated by Software Engineering Process Knowledge Base & Quality Gatekeeper.*`;

            document.getElementById('signoffReportMarkdown').textContent = reportMarkdown;
            const modal = document.getElementById('signoffModal');
            modal.classList.add('open');

            document.getElementById('copySignoffBtn').onclick = function () {
                TemplateEngine.copyToClipboard(reportMarkdown, this, 'Audit Sign-off Copied!');
            };

            document.getElementById('downloadSignoffBtn').onclick = () => {
                TemplateEngine.downloadMarkdown(`AUDIT_${ref}_${activeChecklist.id}`, reportMarkdown);
                showToast('Audit report downloaded', '⬇️');
            };
        };

        document.getElementById('closeSignoffModalBtn').onclick = () => {
            document.getElementById('signoffModal').classList.remove('open');
        };
    }

    // --- Render Glossary ---
    function renderGlossary() {
        const grid = document.getElementById('glossaryGrid');
        if (!grid) return;

        grid.innerHTML = SE_PROCESS_DATA.glossary.map(item => `
      <div class="glossary-card">
        <div class="glossary-term">${item.term}</div>
        <div class="glossary-full">${item.full}</div>
        <div class="glossary-def">${item.def}</div>
      </div>
    `).join('');
    }

    // --- Fast Search & Command Palette (⌘K) ---
    function initSearch() {
        const headerInput = document.getElementById('globalSearchInput');
        const paletteModal = document.getElementById('paletteModal');
        const paletteInput = document.getElementById('paletteSearchInput');
        const paletteList = document.getElementById('paletteResultsList');

        if (headerInput) {
            headerInput.addEventListener('input', (e) => {
                AppState.searchQuery = e.target.value;
                if (AppState.currentView !== 'explore') {
                    switchView('explore');
                } else {
                    renderAssetsExplorer();
                }
            });
        }

        // Keyboard shortcut for Cmd+K / Ctrl+K
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                openPalette();
            }
            if (e.key === 'Escape') {
                closePalette();
                document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
            }
        });

        document.getElementById('searchTrigger')?.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                openPalette();
            }
        });

        function openPalette() {
            paletteModal.classList.add('open');
            paletteInput.value = '';
            paletteInput.focus();
            renderPaletteResults('');
        }

        function closePalette() {
            paletteModal.classList.remove('open');
        }

        paletteModal?.addEventListener('click', (e) => {
            if (e.target === paletteModal) closePalette();
        });

        paletteInput?.addEventListener('input', (e) => {
            renderPaletteResults(e.target.value);
        });

        function renderPaletteResults(query) {
            const q = query.toLowerCase().trim();
            const assets = getAllAssets();
            let results = assets;

            if (q) {
                results = assets.filter(a => {
                    return a.title.toLowerCase().includes(q) ||
                        a.summary.toLowerCase().includes(q) ||
                        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)));
                });
            }

            if (results.length === 0) {
                paletteList.innerHTML = `<li style="padding: 16px; text-align: center; color: var(--text-muted);">No matching assets found for "${query}"</li>`;
                return;
            }

            paletteList.innerHTML = results.slice(0, 8).map(a => `
        <li class="palette-result-item" data-asset-id="${a.id}">
          <div>
            <div style="font-weight: 600; font-size: 14px; color: var(--text-primary);">${a.title}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${a.summary.slice(0, 70)}...</div>
          </div>
          <span class="asset-type-badge type-${a.type}">${a.type}</span>
        </li>
      `).join('');

            paletteList.querySelectorAll('.palette-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const id = item.getAttribute('data-asset-id');
                    closePalette();
                    switchView('detail', { id });
                });
            });
        }
    }

    // --- Add / Edit Custom Process Asset Modal ---
    function initAssetModal() {
        const modal = document.getElementById('assetModal');
        const openBtn = document.getElementById('openCreateAssetBtn');
        const closeBtn = document.getElementById('closeAssetModalBtn');
        const cancelBtn = document.getElementById('cancelAssetModalBtn');
        const saveBtn = document.getElementById('saveAssetModalBtn');

        openBtn?.addEventListener('click', () => {
            AppState.editingAssetId = null;
            document.getElementById('assetModalTitle').textContent = 'Create New Process Asset';
            document.getElementById('modalAssetTitle').value = '';
            document.getElementById('modalAssetType').value = 'guideline';
            document.getElementById('modalAssetPhase').value = 'development';
            document.getElementById('modalAssetOwner').value = '';
            document.getElementById('modalAssetTags').value = '';
            document.getElementById('modalAssetSummary').value = '';
            document.getElementById('modalAssetContent').value = '# Document Title\n\n## 1. Purpose & Scope\nDescribe the objective...\n\n## 2. Standard Operating Procedure\n1. Step one\n2. Step two';
            modal.classList.add('open');
        });

        function closeModal() {
            modal.classList.remove('open');
        }

        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        saveBtn?.addEventListener('click', () => {
            const title = document.getElementById('modalAssetTitle').value.trim();
            const type = document.getElementById('modalAssetType').value;
            const phase = document.getElementById('modalAssetPhase').value;
            const owner = document.getElementById('modalAssetOwner').value.trim() || 'Internal Engineering Guild';
            const tagsStr = document.getElementById('modalAssetTags').value.trim();
            const summary = document.getElementById('modalAssetSummary').value.trim();
            const content = document.getElementById('modalAssetContent').value.trim();

            if (!title || !summary || !content) {
                showToast('Please fill in title, summary, and markdown content', '⚠️');
                return;
            }

            const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()).filter(Boolean) : ['Custom', 'OPA'];
            const id = 'custom-' + Date.now();

            const newAsset = {
                id,
                title,
                type,
                phase,
                version: 'v1.0',
                lastUpdated: new Date().toISOString().split('T')[0],
                owner,
                status: 'Active',
                summary,
                tags,
                content
            };

            AppState.customAssets.unshift(newAsset);
            localStorage.setItem(STORAGE_KEYS.CUSTOM_ASSETS, JSON.stringify(AppState.customAssets));

            showToast(`Created "${title}" successfully!`, '✅');
            closeModal();
            switchView('detail', { id });
        });
    }

    // --- Grid / List Layout Toggle & Empty State Reset ---
    function initLayoutToggle() {
        const gridBtn = document.getElementById('layoutGridBtn');
        const listBtn = document.getElementById('layoutListBtn');

        gridBtn?.addEventListener('click', () => {
            AppState.layoutMode = 'grid';
            localStorage.setItem(STORAGE_KEYS.LAYOUT, 'grid');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            renderAssetsExplorer();
        });

        listBtn?.addEventListener('click', () => {
            AppState.layoutMode = 'list';
            localStorage.setItem(STORAGE_KEYS.LAYOUT, 'list');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            renderAssetsExplorer();
        });

        document.getElementById('emptyResetBtn')?.addEventListener('click', () => {
            AppState.selectedPhase = null;
            AppState.selectedCategory = 'all';
            AppState.searchQuery = '';
            AppState.onlyFavorites = false;
            const input = document.getElementById('globalSearchInput');
            if (input) input.value = '';
            renderAssetsExplorer();
        });

        document.getElementById('openTemplateStudioBtn')?.addEventListener('click', () => {
            switchView('studio');
        });
    }

    // --- App Initialization ---
    function init() {
        initTheme();
        initSidebar();
        initSearch();
        initAssetModal();
        initLayoutToggle();

        // Initial render
        switchView('explore');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
