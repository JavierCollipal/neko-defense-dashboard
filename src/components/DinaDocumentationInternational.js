// 🐾⚖️🌍 DINA DOCUMENTATION INTERNATIONAL - COMPREHENSIVE VERSION 🌍⚖️🐾
// Research updated October 2025 - Full comprehensive data from MongoDB
import React, { useState, useEffect } from 'react';
import GlobalThreatMap from './GlobalThreatMap';
import DinaTimeline from './DinaTimeline';
import '../styles/DinaDocumentationInternational.css';

// 🎯 API URL - NestJS backend runs on port 4000, nyaa~!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// 🌍 Translations for all languages
const translations = {
  en: {
    loading: 'Loading DINA documentation, nyaa~...',
    headerTitle: 'DINA INTERNATIONAL DOCUMENTATION ARCHIVE',
    headerSubtitle: 'Chilean Secret Police (1973-1977) - Crimes Against Humanity - International Hunt Operation',
    headerMethodology: 'Methodology: Simon Wiesenthal Nazi-Hunting Precedent',
    headerLegal: 'Legal Basis: No Statute of Limitations for Crimes Against Humanity',
    navOverview: 'OVERVIEW',
    navPerpetrators: 'PERPETRATORS',
    navWanted: 'WANTED AGENTS',
    navAllAgents: 'ALL AGENTS (1,097)',
    navCenters: 'TORTURE CENTERS',
    navInternational: 'INTERNATIONAL CRIMES',
    navMap: 'GLOBAL MAP',
    navTimeline: 'TIMELINE',
    mapTitle: 'DINA GLOBAL OPERATIONS MAP',
    timelineTitle: 'DINA OPERATIONS TIMELINE',
    footerMission: 'Mission: Document all DINA crimes to ensure accountability and justice for victims',
    footerPrinciple: 'Principle: "Justice, not vengeance" - Simon Wiesenthal',
    footerCooperation: 'International cooperation with: FBI, CIA, Interpol, ICC, Chilean Judicial System, Human Rights Organizations'
  },
  es: {
    loading: 'Cargando documentación DINA...',
    headerTitle: 'ARCHIVO INTERNACIONAL DINA',
    headerSubtitle: 'Policía Secreta Chilena (1973-1977) - Crímenes contra la Humanidad - Operación de Caza Internacional',
    headerMethodology: 'Metodología: Precedente de Caza de Nazis de Simon Wiesenthal',
    headerLegal: 'Base Legal: Sin Estatuto de Limitaciones para Crímenes contra la Humanidad',
    navOverview: 'RESUMEN',
    navPerpetrators: 'PERPETRADORES',
    navWanted: 'AGENTES BUSCADOS',
    navAllAgents: 'TODOS LOS AGENTES (1.097)',
    navCenters: 'CENTROS DE TORTURA',
    navInternational: 'CRÍMENES INTERNACIONALES',
    navMap: 'MAPA GLOBAL',
    navTimeline: 'LÍNEA DE TIEMPO',
    mapTitle: 'MAPA GLOBAL DE OPERACIONES DINA',
    timelineTitle: 'LÍNEA DE TIEMPO DE OPERACIONES DINA',
    footerMission: 'Misión: Documentar todos los crímenes DINA para asegurar responsabilidad y justicia para las víctimas',
    footerPrinciple: 'Principio: "Justicia, no venganza" - Simon Wiesenthal',
    footerCooperation: 'Cooperación internacional con: FBI, CIA, Interpol, CPI, Sistema Judicial Chileno, Organizaciones de Derechos Humanos'
  },
  pt: {
    loading: 'Carregando documentação DINA...',
    headerTitle: 'ARQUIVO INTERNACIONAL DINA',
    headerSubtitle: 'Polícia Secreta Chilena (1973-1977) - Crimes contra a Humanidade - Operação de Caça Internacional',
    headerMethodology: 'Metodologia: Precedente de Caça aos Nazistas de Simon Wiesenthal',
    headerLegal: 'Base Legal: Sem Estatuto de Limitações para Crimes contra a Humanidade',
    navOverview: 'RESUMO',
    navPerpetrators: 'PERPETRADORES',
    navWanted: 'AGENTES PROCURADOS',
    navAllAgents: 'TODOS OS AGENTES (1.097)',
    navCenters: 'CENTROS DE TORTURA',
    navInternational: 'CRIMES INTERNACIONAIS',
    navMap: 'MAPA GLOBAL',
    navTimeline: 'LINHA DO TEMPO',
    mapTitle: 'MAPA GLOBAL DE OPERAÇÕES DINA',
    timelineTitle: 'LINHA DO TEMPO DE OPERAÇÕES DINA',
    footerMission: 'Missão: Documentar todos os crimes DINA para garantir responsabilidade e justiça para as vítimas',
    footerPrinciple: 'Princípio: "Justiça, não vingança" - Simon Wiesenthal',
    footerCooperation: 'Cooperação internacional com: FBI, CIA, Interpol, TPI, Sistema Judicial Chileno, Organizações de Direitos Humanos'
  },
  de: {
    loading: 'Lade DINA-Dokumentation...',
    headerTitle: 'INTERNATIONALES DINA DOKUMENTATIONSARCHIV',
    headerSubtitle: 'Chilenische Geheimpolizei (1973-1977) - Verbrechen gegen die Menschlichkeit - Internationale Jagdoperation',
    headerMethodology: 'Methodik: Simon Wiesenthals Nazi-Jagd-Präzedenzfall',
    headerLegal: 'Rechtsgrundlage: Keine Verjährungsfrist für Verbrechen gegen die Menschlichkeit',
    navOverview: 'ÜBERSICHT',
    navPerpetrators: 'TÄTER',
    navWanted: 'GESUCHTE AGENTEN',
    navAllAgents: 'ALLE AGENTEN (1.097)',
    navCenters: 'FOLTERZENTREN',
    navInternational: 'INTERNATIONALE VERBRECHEN',
    navMap: 'WELTKARTE',
    navTimeline: 'ZEITLINIE',
    mapTitle: 'DINA GLOBALE OPERATIONSKARTE',
    timelineTitle: 'DINA-OPERATIONSZEITLINIE',
    footerMission: 'Mission: Dokumentation aller DINA-Verbrechen zur Sicherstellung von Verantwortlichkeit und Gerechtigkeit für Opfer',
    footerPrinciple: 'Prinzip: "Gerechtigkeit, nicht Rache" - Simon Wiesenthal',
    footerCooperation: 'Internationale Zusammenarbeit mit: FBI, CIA, Interpol, IStGH, Chilenisches Justizsystem, Menschenrechtsorganisationen'
  }
};

const DinaDocumentationInternational = () => {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState(null);
  const [perpetrators, setPerpetrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerp, setSelectedPerp] = useState(null);
  const [viewMode, setViewMode] = useState('overview');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  // 📋 Pagination state for ALL AGENTS view (1,097 total)
  const [allAgents, setAllAgents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [allAgentsLoading, setAllAgentsLoading] = useState(false);

  // 🌍 Get current translations
  const t = translations[language];

  useEffect(() => {
    fetchDinaData();
  }, []);

  // 📋 Fetch when viewMode changes to 'all-agents' or when page changes
  useEffect(() => {
    if (viewMode === 'all-agents') {
      fetchAllAgentsPaginated(currentPage);
    }
  }, [viewMode, currentPage]);

  const fetchDinaData = async () => {
    try {
      setLoading(true);
      console.log('🐾 [DINA] Starting data fetch, API_URL:', API_URL);

      // Fetch DINA statistics
      console.log('🐾 [DINA] Fetching stats from:', `${API_URL}/dina/stats`);
      const statsResponse = await fetch(`${API_URL}/dina/stats`);
      console.log('🐾 [DINA] Stats response status:', statsResponse.status);
      const statsData = await statsResponse.json();
      console.log('🐾 [DINA] Stats data:', statsData);
      if (statsData.success) setStats(statsData.data);

      // Fetch DINA perpetrators (comprehensive collection!)
      console.log('🐾 [DINA] Fetching perpetrators from:', `${API_URL}/dina/perpetrators`);
      const perpsResponse = await fetch(`${API_URL}/dina/perpetrators`);
      console.log('🐾 [DINA] Perpetrators response status:', perpsResponse.status);
      const perpsData = await perpsResponse.json();
      console.log('🐾 [DINA] Perpetrators data:', perpsData);
      console.log('🐾 [DINA] perpsData.success:', perpsData.success);
      console.log('🐾 [DINA] perpsData.count:', perpsData.count);
      console.log('🐾 [DINA] perpsData.data length:', perpsData.data?.length);

      if (perpsData.success) {
        console.log('✅ Loaded comprehensive DINA agents:', perpsData.count);
        console.log('✅ Setting perpetrators state with:', perpsData.data);
        setPerpetrators(perpsData.data);
      } else {
        console.error('❌ perpsData.success is false!');
      }

      setLoading(false);
      console.log('🐾 [DINA] Data fetch complete!');
    } catch (error) {
      console.error('❌ Failed to fetch DINA data:', error);
      console.error('❌ Error details:', error.message, error.stack);
      setLoading(false);
    }
  };

  const showDetails = (perp) => {
    setSelectedPerp(perp);
    setViewMode('details');
  };

  const changeView = (mode) => {
    setViewMode(mode);
    setSelectedPerp(null);
    if (mode === 'all-agents') {
      setCurrentPage(1); // Reset to page 1 when entering this view
    }
  };

  // 📋 Fetch paginated ALL AGENTS (1,097 total)
  const fetchAllAgentsPaginated = async (page) => {
    try {
      setAllAgentsLoading(true);
      console.log(`🐾 [ALL-AGENTS] Fetching page ${page}...`);

      const response = await fetch(`${API_URL}/dina/all-agents?page=${page}&limit=50`);
      const data = await response.json();

      console.log(`✅ [ALL-AGENTS] Page ${page} loaded:`, data);

      if (data.success) {
        setAllAgents(data.data);
        setPagination(data.pagination);
      }

      setAllAgentsLoading(false);
    } catch (error) {
      console.error('❌ Failed to fetch all agents:', error);
      setAllAgentsLoading(false);
    }
  };

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇨🇱', name: 'Español' },
    { code: 'pt', flag: '🇧🇷', name: 'Português' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' }
  ];

  if (loading) {
    return (
      <div className="dina-international-container">
        <div className="dina-loading">
          ⚖️ {t.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="dina-international-container">
      {/* Language Selector */}
      <div className="language-selector">
        <button
          className="language-button"
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
        >
          🌐 {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.name}
        </button>
        {showLanguageMenu && (
          <div className="language-menu">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${language === lang.code ? 'active' : ''}`}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLanguageMenu(false);
                }}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="dina-international-header">
        <h1>🌍⚖️ {t.headerTitle} ⚖️🌍</h1>
        <p className="dina-subtitle">
          {t.headerSubtitle}
        </p>
        <p className="dina-methodology">
          📚 {t.headerMethodology}
        </p>
        <p className="dina-legal">
          ⚖️ {t.headerLegal}
        </p>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="dina-stats-international">
          <div className="stat-box-international">
            <div className="stat-value">{stats.perpetrators?.total_known_agents || 1097}</div>
            <div className="stat-label">Total Known Agents (2008 Army List)</div>
          </div>
          <div className="stat-box-international">
            <div className="stat-value">{perpetrators.length}</div>
            <div className="stat-label">High-Profile Documented</div>
          </div>
          <div className="stat-box-international success">
            <div className="stat-value">{stats.perpetrators?.convicted || 0}</div>
            <div className="stat-label">Convicted</div>
          </div>
          <div className="stat-box-international warning">
            <div className="stat-value">{stats.perpetrators?.atLarge || 0}</div>
            <div className="stat-label">⚠️ At Large</div>
          </div>
          <div className="stat-box-international critical">
            <div className="stat-value">{stats.perpetrators?.neverProsecuted || 0}</div>
            <div className="stat-label">❌ Never Prosecuted (Impunity)</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="dina-navigation">
        <button
          className={`nav-button ${viewMode === 'overview' ? 'active' : ''}`}
          onClick={() => changeView('overview')}
        >
          🏠 {t.navOverview}
        </button>
        <button
          className={`nav-button ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => changeView('list')}
        >
          📋 {t.navPerpetrators} ({perpetrators.length})
        </button>
        <button
          className={`nav-button ${viewMode === 'wanted' ? 'active' : ''}`}
          onClick={() => changeView('wanted')}
        >
          🎯 {t.navWanted}
        </button>
        <button
          className={`nav-button ${viewMode === 'all-agents' ? 'active' : ''}`}
          onClick={() => changeView('all-agents')}
        >
          📋 {t.navAllAgents}
        </button>
        <button
          className={`nav-button ${viewMode === 'centers' ? 'active' : ''}`}
          onClick={() => changeView('centers')}
        >
          🏢 {t.navCenters}
        </button>
        <button
          className={`nav-button ${viewMode === 'international' ? 'active' : ''}`}
          onClick={() => changeView('international')}
        >
          🌍 {t.navInternational}
        </button>
        <button
          className={`nav-button ${viewMode === 'map' ? 'active' : ''}`}
          onClick={() => changeView('map')}
        >
          🌍 {t.navMap}
        </button>
        <button
          className={`nav-button ${viewMode === 'timeline' ? 'active' : ''}`}
          onClick={() => changeView('timeline')}
        >
          ⏰ {t.navTimeline}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="dina-content-area">
        {/* OVERVIEW VIEW */}
        {viewMode === 'overview' && (
          <div className="overview-section">
            <div className="overview-banner">
              <h2>🔍 INTERNATIONAL HUNT OPERATION ACTIVE</h2>
              <p>Comprehensive documentation of Chilean dictatorship crimes (1973-1990) following Simon Wiesenthal methodology</p>
            </div>

            <div className="overview-grid">
              <div className="overview-card mission">
                <h3>🎯 MISSION</h3>
                <p>Document all DINA perpetrators and ensure accountability through international cooperation and universal jurisdiction.</p>
              </div>

              <div className="overview-card scope">
                <h3>🌍 SCOPE</h3>
                <p>Operation Condor network (Chile, Argentina, Uruguay, Paraguay, Brazil, Bolivia) + International crimes (USA, Italy, Europe)</p>
              </div>

              <div className="overview-card jurisdiction">
                <h3>⚖️ UNIVERSAL JURISDICTION</h3>
                <p>Crimes against humanity have NO statute of limitations. Any country can prosecute. No safe haven for perpetrators, nyaa~!</p>
              </div>
            </div>

            <div className="overview-stats-cards">
              <div className="stats-card victims">
                <h4>📊 Dictatorship Victims (1973-1990)</h4>
                <div className="stat-list">
                  <div>~30,000 Total Victims</div>
                  <div>27,255 Tortured</div>
                  <div>2,279 Executed</div>
                  <div>957 Disappeared</div>
                </div>
              </div>

              <div className="stats-card dina">
                <h4>⚡ DINA Specific (1973-1977 - Only 4 Years!)</h4>
                <div className="stat-list critical">
                  <div>2,279 Murders</div>
                  <div>957 Forced Disappearances</div>
                  <div>4,500+ Villa Grimaldi Detainees</div>
                  <div>1,100+ Londres 38 Detainees</div>
                </div>
                <p className="note">💀 DINA responsible for MAJORITY of regime's crimes</p>
              </div>
            </div>

            <div className="quick-access">
              <button className="quick-button" onClick={() => changeView('wanted')}>
                🎯 View Wanted Agents →
              </button>
              <button className="quick-button" onClick={() => changeView('international')}>
                🌍 View International Crimes →
              </button>
              <button className="quick-button" onClick={() => changeView('centers')}>
                🏢 View Torture Centers →
              </button>
            </div>
          </div>
        )}

        {/* PERPETRATORS LIST VIEW */}
        {viewMode === 'list' && (
          <div className="perpetrators-list-international">
            <h3>📋 Documented DINA Agents & Collaborators ({perpetrators.length})</h3>
            <p className="list-description">High-profile agents with comprehensive research - Updated October 2025</p>
            {perpetrators.length === 0 ? (
              <div className="no-data">No perpetrators loaded. Check API connection and restart NestJS API!</div>
            ) : (
              <div className="perp-grid-international">
                {perpetrators.map((perp, index) => (
                  <div key={index} className={`perp-card-international ${perp.status?.includes('AT LARGE') ? 'at-large' : ''} ${perp.status?.includes('NEVER PROSECUTED') ? 'impunity' : ''}`} onClick={() => showDetails(perp)}>
                    <div className={`perp-status-badge ${
                      perp.status?.includes('AT LARGE') ? 'warning' :
                      perp.status?.includes('NEVER PROSECUTED') ? 'critical' :
                      perp.status === 'CONVICTED - IMPRISONED' ? 'success' :
                      'default'
                    }`}>
                      {perp.status || 'Status Unknown'}
                    </div>
                    <div className="perp-name">{perp.fullName}</div>
                    {perp.alias && <div className="perp-alias">"{perp.alias}"</div>}
                    <div className="perp-role">{perp.role}</div>
                    {perp.rank && <div className="perp-rank">{perp.rank}</div>}
                    <div className={`perp-conviction ${perp.legalStatus?.convicted ? 'convicted' : 'unprosecuted'}`}>
                      {perp.legalStatus?.convicted ? '⚖️ CONVICTED' : '⚠️ UNPROSECUTED'}
                    </div>
                    {perp.legalStatus?.sentences && (
                      <div className="perp-sentences">{perp.legalStatus.sentences}</div>
                    )}
                    <div className="perp-crimes-count">
                      {perp.crimesAccused?.length || 0} crimes documented
                    </div>
                    {perp.priority && (
                      <div className="perp-priority">{perp.priority}</div>
                    )}
                    {perp.significance && (
                      <div className="perp-significance-preview">
                        {perp.significance.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WANTED AGENTS VIEW - COMPREHENSIVE */}
        {viewMode === 'wanted' && (
          <div className="wanted-agents-section">
            <h2>🎯 DINA WANTED AGENTS & STATUS TRACKING</h2>
            <p className="section-subtitle">Comprehensive database - Research updated October 2025</p>

            {/* Priority Case: Adriana Rivas */}
            <div className="wanted-highlight-card adriana-rivas">
              <h3>⚠️ HIGHEST PRIORITY - CURRENTLY AT LARGE</h3>
              <div className="adriana-card">
                <h4>Adriana Rivas Araya ("La Chani")</h4>
                <div className="rivas-info">
                  <div className="info-row"><strong>Status:</strong> <span className="critical-text">IMPRISONED IN AUSTRALIA - Fighting Extradition</span></div>
                  <div className="info-row"><strong>Charges:</strong> 7 counts aggravated kidnapping</div>
                  <div className="info-row"><strong>Role:</strong> DINA Lautaro Brigade - Contreras' Secretary</div>
                  <div className="info-row timeline-item">
                    <strong>Timeline:</strong>
                    <ul>
                      <li>1973-1977: Worked as Contreras' personal secretary</li>
                      <li>2010: Released on bail in Chile, fled to Australia</li>
                      <li>2019: Arrested in Australia on extradition request</li>
                      <li>July 2025: Australian Federal Court rejected appeal</li>
                      <li>March 2025: Next High Court hearing</li>
                    </ul>
                  </div>
                  <div className="info-row significance">
                    <strong>🎯 Significance:</strong> Most prominent DINA agent currently evading justice. May be "dozens more DINA agents in Australia who lied on migration applications."
                  </div>
                </div>
              </div>
            </div>

            <div className="wanted-stats-grid">
              <div className="wanted-stat">
                <div className="number">1,097</div>
                <div className="label">Total DINA Agents (2008 Army List)</div>
              </div>
              <div className="wanted-stat warning">
                <div className="number">1</div>
                <div className="label">Currently Fighting Extradition</div>
              </div>
              <div className="wanted-stat success">
                <div className="number">4</div>
                <div className="label">Currently Imprisoned</div>
              </div>
              <div className="wanted-stat critical">
                <div className="number">1</div>
                <div className="label">Never Prosecuted (Died in Impunity)</div>
              </div>
            </div>

            <h3>🔍 All Documented High-Profile Agents</h3>
            <div className="agents-comprehensive-list">
              {perpetrators.map((agent, index) => (
                <div key={index} className={`agent-detailed-card ${
                  agent.status?.includes('AT LARGE') ? 'at-large-border' :
                  agent.status?.includes('NEVER PROSECUTED') ? 'impunity-border' :
                  ''
                }`}>
                  <div className={`agent-status-header ${
                    agent.status?.includes('AT LARGE') ? 'at-large' :
                    agent.status?.includes('NEVER PROSECUTED') ? 'impunity' :
                    agent.status === 'CONVICTED - IMPRISONED' ? 'imprisoned' :
                    'default'
                  }`}>
                    {agent.status}
                  </div>
                  <h4>{agent.fullName}</h4>
                  {agent.alias && <p className="alias">Alias: "{agent.alias}"</p>}
                  <p><strong>Role:</strong> {agent.role}</p>
                  {agent.rank && <p><strong>Rank:</strong> {agent.rank}</p>}

                  <div className="legal-status-box">
                    <strong>⚖️ Legal Status:</strong>
                    <div>Convicted: {agent.legalStatus?.convicted ? '✅ YES' : '⚠️ NO'}</div>
                    <div>{agent.legalStatus?.currentStatus}</div>
                    {agent.legalStatus?.sentences && <div className="sentences">{agent.legalStatus.sentences}</div>}
                  </div>

                  {agent.significance && (
                    <div className={`significance-box ${agent.significance.includes('⚠️') ? 'critical-significance' : ''}`}>
                      <strong>🎯 Significance:</strong> {agent.significance}
                    </div>
                  )}

                  {agent.crimesAccused && agent.crimesAccused.length > 0 && (
                    <div className="crimes-summary">
                      <strong>Crimes:</strong> {agent.crimesAccused.slice(0, 3).join(', ')}
                      {agent.crimesAccused.length > 3 && ` (+${agent.crimesAccused.length - 3} more)`}
                    </div>
                  )}

                  <button className="view-details-btn" onClick={() => showDetails(agent)}>
                    View Full Details →
                  </button>
                </div>
              ))}
            </div>

            <div className="methodology-note">
              <h4>📚 Research Methodology</h4>
              <p>Following Simon Wiesenthal Nazi-hunting precedent: Systematic documentation, evidence preservation, pursuit of justice regardless of time elapsed. Sources: National Security Archive, Chilean court records, International court records, survivor testimonies.</p>
            </div>
          </div>
        )}

        {/* ALL AGENTS VIEW - PAGINATED (1,097 total) */}
        {viewMode === 'all-agents' && (
          <div className="all-agents-paginated-section">
            <h2>📋 ALL 1,097 KNOWN DINA AGENTS</h2>
            <p className="section-subtitle">From 2008 Chilean Army Official Disclosure - Browseable with Pagination</p>

            {pagination && (
              <div className="pagination-info-top">
                <span>Page {pagination.current_page} of {pagination.total_pages}</span>
                <span>Showing {allAgents.length} of {pagination.total_agents} total agents</span>
              </div>
            )}

            {allAgentsLoading ? (
              <div className="loading-pagination">Loading agents, nyaa~... 🐾</div>
            ) : (
              <>
                <div className="all-agents-grid">
                  {allAgents.map((agent, index) => (
                    <div key={agent.agentNumber || index} className="agent-card-simple">
                      <div className="agent-number">#{agent.agentNumber}</div>
                      <div className="agent-name">{agent.fullName}</div>
                      <div className="agent-rank-badge">{agent.rank}</div>
                      <div className={`agent-status-badge ${
                        agent.status === 'DECEASED' ? 'status-deceased' :
                        agent.status === 'UNLOCATED' ? 'status-unlocated' :
                        agent.status === 'UNPROSECUTED' ? 'status-unprosecuted' :
                        'status-unknown'
                      }`}>
                        {agent.status}
                      </div>
                      <div className="agent-source">
                        <small>{agent.source}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && (
                  <div className="pagination-controls">
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.has_previous}
                    >
                      ← Previous
                    </button>

                    <div className="page-numbers">
                      {/* First page */}
                      {pagination.current_page > 3 && (
                        <>
                          <button
                            className="page-number"
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>
                          {pagination.current_page > 4 && <span className="ellipsis">...</span>}
                        </>
                      )}

                      {/* Pages around current */}
                      {[...Array(5)].map((_, i) => {
                        const pageNum = pagination.current_page - 2 + i;
                        if (pageNum > 0 && pageNum <= pagination.total_pages) {
                          return (
                            <button
                              key={pageNum}
                              className={`page-number ${pageNum === pagination.current_page ? 'active' : ''}`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        return null;
                      })}

                      {/* Last page */}
                      {pagination.current_page < pagination.total_pages - 2 && (
                        <>
                          {pagination.current_page < pagination.total_pages - 3 && <span className="ellipsis">...</span>}
                          <button
                            className="page-number"
                            onClick={() => setCurrentPage(pagination.total_pages)}
                          >
                            {pagination.total_pages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.has_next}
                    >
                      Next →
                    </button>
                  </div>
                )}

                <div className="pagination-note">
                  <h4>📚 About This List</h4>
                  <p>This list contains all 1,097 DINA agents disclosed by the Chilean Army in 2008. Many remain unprosecuted and their current whereabouts are unknown. Research is ongoing to document each individual's role and legal status, nyaa~!</p>
                  <p><strong>Source:</strong> 2008 Chilean Army Official DINA Personnel Disclosure</p>
                  <p><strong>Note:</strong> The 8 high-profile agents with comprehensive research are available in the "PERPETRATORS" and "WANTED AGENTS" tabs.</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* TORTURE CENTERS VIEW */}
        {viewMode === 'centers' && (
          <div className="torture-centers-section">
            <h2>🏢 DINA SECRET DETENTION & TORTURE CENTERS NETWORK</h2>
            <p className="section-subtitle">Physical infrastructure of state terror - Many now serve as memorial sites</p>

            <div className="center-card-major villa-grimaldi">
              <h3>⭐ Villa Grimaldi (Cuartel Terranova)</h3>
              <div className="center-badge">MOST IMPORTANT DINA COMPLEX</div>
              <div className="center-info">
                <p><strong>📍 Location:</strong> Av. José Arrieta 8401, Peñalolén, Santiago</p>
                <p><strong>📅 Period:</strong> Mid-1974 to Mid-1978</p>
                <p><strong>👥 Detainees:</strong> ~4,500 people</p>
                <p className="critical"><strong>💀 Killed/Disappeared:</strong> 240+</p>
                <p className="success"><strong>✅ NOW:</strong> Parque por la Paz (Peace Park Memorial) - Open to public</p>
              </div>
              <div className="torture-methods">
                <strong>Documented Torture Methods:</strong>
                <ul>
                  <li>⚡ La Parrilla (The Grill) - Electric shock metal bed</li>
                  <li>⚡ Electric shock to lips, genitals, sensitive areas</li>
                  <li>💧 Waterboarding and near-drowning</li>
                  <li>🧠 Psychological torture and mock executions</li>
                </ul>
              </div>
              <p><strong>Commander:</strong> Colonel Manuel Contreras (DINA chief)</p>
            </div>

            <div className="center-card-major londres-38">
              <h3>⭐ Londres 38 (Yucatán)</h3>
              <div className="center-badge">FIRST DINA DETENTION CENTER</div>
              <div className="center-info">
                <p><strong>📍 Location:</strong> Londres 38, Downtown Santiago</p>
                <p><strong>📅 Period:</strong> September 1973 - December 1974</p>
                <p><strong>👥 Detainees:</strong> ~1,100 people</p>
                <p className="critical"><strong>💀 Executed:</strong> 94 (including 2 pregnant women)</p>
                <p className="success"><strong>✅ NOW:</strong> Memorial & Human Rights Center - Open to public</p>
              </div>
              <p>First link in DINA's chain of detention facilities. Code name: <strong>"Yucatán"</strong></p>
            </div>

            <div className="other-centers-grid">
              <h3>Other DINA Secret Centers</h3>
              <div className="center-item">
                <h4>🏢 Jose Domingo Cañas</h4>
                <p>📍 Santiago | 📅 1974-1975 | Major interrogation center</p>
              </div>
              <div className="center-item">
                <h4>🏢 Cuatro Alamos</h4>
                <p>📍 Santiago | 📅 1974-1976 | Transit detention center</p>
              </div>
              <div className="center-item">
                <h4>🏢 Venecia</h4>
                <p>📍 Santiago region | 📅 1974-1977 | Secret facility</p>
              </div>
              <div className="center-item critical-item">
                <h4>🏢 Venda Sexy</h4>
                <p>📍 Secret location | 📅 1974-1977 | Sexual torture center commanded by Ingrid Olderöck</p>
                <p className="critical-text">⚠️ 27+ disappeared from this center. Specialized in sexual violence.</p>
              </div>
            </div>

            <div className="centers-network-info">
              <h3>🗺️ Network of Terror</h3>
              <p>DINA operated a systematic network of clandestine detention centers across Chile used for:</p>
              <ul>
                <li>🔒 Secret arrests without legal process</li>
                <li>⚡ Systematic torture and interrogation</li>
                <li>💀 Executions and forced disappearances</li>
                <li>📦 Body disposal to hide evidence</li>
              </ul>
              <p className="memorial-note">Many of these sites are now memorials that can be visited to honor victims and preserve historical memory, desu! 🕊️</p>
            </div>
          </div>
        )}

        {/* INTERNATIONAL CRIMES VIEW */}
        {viewMode === 'international' && (
          <div className="international-crimes-section">
            <h2>🌍 DINA INTERNATIONAL TERRORISM & ASSASSINATIONS</h2>
            <p className="section-subtitle">Proving Universal Jurisdiction Applies - Crimes committed across 3 continents</p>

            <div className="jurisdiction-banner">
              <h3>⚖️ UNIVERSAL JURISDICTION PRINCIPLE</h3>
              <p>DINA committed crimes in USA, Europe, and Latin America. Any country can prosecute crimes against humanity. <strong>NO SAFE HAVEN!</strong></p>
            </div>

            <div className="crime-card-major letelier">
              <div className="crime-location">🇺🇸 WASHINGTON DC, UNITED STATES</div>
              <h3>Letelier-Moffitt Assassination</h3>
              <div className="crime-date">📅 September 21, 1976</div>
              <div className="victims-list">
                <strong>💀 Victims:</strong>
                <ul>
                  <li>Orlando Letelier - Chilean diplomat, former Foreign Minister</li>
                  <li>Ronni Karpen Moffitt - US citizen, innocent bystander</li>
                </ul>
              </div>
              <p><strong>Method:</strong> 🚗💣 Car bomb in Sheridan Circle, Washington DC</p>
              <p><strong>Perpetrators:</strong> Michael Townley (DINA agent), Cuban exile operatives</p>
              <p className="prosecution-result success">
                <strong>⚖️ Prosecution:</strong> Manuel Contreras convicted 1995 → 7 years prison
              </p>
              <p className="significance-text">
                <strong>🎯 Significance:</strong> International terrorism on US soil! First major conviction of Contreras.
              </p>
            </div>

            <div className="crime-card-major prats">
              <div className="crime-location">🇦🇷 BUENOS AIRES, ARGENTINA</div>
              <h3>General Carlos Prats Assassination</h3>
              <div className="crime-date">📅 September 30, 1974</div>
              <div className="victims-list">
                <strong>💀 Victims:</strong>
                <ul>
                  <li>General Carlos Prats - Chilean Army Commander (Pinochet's predecessor)</li>
                  <li>Sofía Cuthbert - His wife</li>
                </ul>
              </div>
              <p><strong>Method:</strong> 🚗💣 Car bomb explosion</p>
              <p className="prosecution-result success">
                <strong>⚖️ Prosecution:</strong> Manuel Contreras sentenced to <strong>2 LIFE SENTENCES</strong> (June 2008)
              </p>
              <p className="significance-text">
                <strong>🎯 Significance:</strong> Operation Condor cross-border assassination. Shows Argentina-Chile DINA cooperation.
              </p>
            </div>

            <div className="crime-card-major leighton">
              <div className="crime-location">🇮🇹 ROME, ITALY</div>
              <h3>Bernardo Leighton Attempted Assassination</h3>
              <div className="crime-date">📅 October 6, 1975</div>
              <div className="victims-list">
                <strong>🏥 Victims (Both Survived):</strong>
                <ul>
                  <li>Bernardo Leighton - Former Chilean Vice President</li>
                  <li>Anita Leighton - His wife</li>
                </ul>
              </div>
              <p><strong>Method:</strong> 🔫 Shooting attack in Rome</p>
              <p className="prosecution-result success">
                <strong>⚖️ Prosecution:</strong> Italian courts convicted Contreras & Raúl Iturriaga in absentia (18 years each, 1995)
              </p>
              <p className="significance-text">
                <strong>🎯 Significance:</strong> Proves European reach of DINA terror! International warrants issued.
              </p>
            </div>

            <div className="operation-condor-section">
              <h3>🦅 OPERATION CONDOR - Multinational State Terrorism</h3>
              <p><strong>📅 Founded:</strong> November 28, 1975, Santiago, Chile</p>
              <div className="condor-countries">
                <strong>Participating Countries:</strong>
                <div className="country-flags">
                  <span>🇨🇱 Chile (DINA)</span>
                  <span>🇦🇷 Argentina (SIDE)</span>
                  <span>🇺🇾 Uruguay</span>
                  <span>🇵🇾 Paraguay</span>
                  <span>🇧🇷 Brazil</span>
                  <span>🇧🇴 Bolivia</span>
                </div>
              </div>
              <div className="condor-victims">
                <strong>💀 Notable Victims:</strong>
                <ul>
                  <li>Zelmar Michelini - Uruguayan former MP (assassinated Buenos Aires)</li>
                  <li>Héctor Gutiérrez Ruiz - Uruguayan former MP (assassinated Buenos Aires)</li>
                  <li>Juan José Torres - Former Bolivian president (assassinated Buenos Aires)</li>
                </ul>
              </div>
              <p className="significance-text">
                <strong>🎯 Significance:</strong> Coordinated international state terrorism. Dictatorships hunted dissidents across borders.
              </p>
            </div>

            <div className="cia-connection-section">
              <h3>🔐 CIA COLLABORATION</h3>
              <p><strong>Evidence:</strong> Declassified US documents confirm DINA chief Manuel Contreras worked for CIA and received payments.</p>
              <p><strong>Source:</strong> National Security Archive, CIA FOIA releases, US Congressional investigations</p>
              <p><strong>🎯 Significance:</strong> US complicity in DINA operations. Questions about US knowledge of international assassinations.</p>
            </div>

            <div className="contreras-conviction-record">
              <h3>⚖️ Manuel Contreras - Final Conviction Record</h3>
              <p>DINA Commander (1973-1977) - One of most convicted agents in Latin American history</p>
              <div className="conviction-stats">
                <div className="stat-item"><strong>59</strong> Unappealable Sentences</div>
                <div className="stat-item"><strong>529</strong> Years in Prison</div>
                <div className="stat-item"><strong>💀</strong> Died in Prison (2015)</div>
              </div>
              <p><strong>Convicted for:</strong> Kidnapping, Forced Disappearance, Assassination, Torture, Crimes Against Humanity</p>
              <p className="justice-note">Justice achieved through persistent prosecution across multiple jurisdictions, nyaa~! ⚖️✨</p>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <GlobalThreatMap language={language} />
        )}

        {viewMode === 'timeline' && (
          <DinaTimeline language={language} />
        )}

        {viewMode === 'details' && selectedPerp && (
          <div className="perpetrator-details-comprehensive">
            <button className="back-button" onClick={() => changeView('list')}>
              ← Back to List
            </button>
            <div className="details-content-full">
              <h2>{selectedPerp.fullName}</h2>
              {selectedPerp.alias && <h3 className="alias-header">Alias: "{selectedPerp.alias}"</h3>}

              <div className={`status-badge-large ${
                selectedPerp.status?.includes('AT LARGE') ? 'warning' :
                selectedPerp.status?.includes('NEVER PROSECUTED') ? 'critical' :
                selectedPerp.status === 'CONVICTED - IMPRISONED' ? 'success' :
                'default'
              }`}>
                {selectedPerp.status}
              </div>

              <div className="detail-section">
                <h3>Role & Organization</h3>
                <p><strong>Role:</strong> {selectedPerp.role}</p>
                {selectedPerp.rank && <p><strong>Rank:</strong> {selectedPerp.rank}</p>}
                {selectedPerp.organization && (
                  <p><strong>Organizations:</strong> {selectedPerp.organization.join(', ')}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>⚖️ Legal Status</h3>
                <p className={selectedPerp.legalStatus?.convicted ? 'status-convicted' : 'status-unprosecuted'}>
                  <strong>Convicted:</strong> {selectedPerp.legalStatus?.convicted ? 'YES ⚖️' : 'NO ⚠️'}
                </p>
                <p><strong>Current Status:</strong> {selectedPerp.legalStatus?.currentStatus}</p>
                {selectedPerp.legalStatus?.sentences && (
                  <p><strong>Sentences:</strong> {selectedPerp.legalStatus.sentences}</p>
                )}
                {selectedPerp.legalStatus?.prisonLocation && (
                  <p><strong>Location:</strong> {selectedPerp.legalStatus.prisonLocation}</p>
                )}
              </div>

              {selectedPerp.crimesAccused && selectedPerp.crimesAccused.length > 0 && (
                <div className="detail-section">
                  <h3>💀 Crimes Accused</h3>
                  <ul className="crimes-list-detailed">
                    {selectedPerp.crimesAccused.map((crime, i) => (
                      <li key={i}>{crime}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPerp.notableOperations && selectedPerp.notableOperations.length > 0 && (
                <div className="detail-section">
                  <h3>🎯 Notable Operations</h3>
                  <ul className="operations-list">
                    {selectedPerp.notableOperations.map((op, i) => (
                      <li key={i}>{op}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPerp.timeline && selectedPerp.timeline.length > 0 && (
                <div className="detail-section">
                  <h3>📅 Timeline</h3>
                  <ul className="timeline-list">
                    {selectedPerp.timeline.map((event, i) => (
                      <li key={i}>{event}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedPerp.significance && (
                <div className="detail-section significance">
                  <h3>🎯 Significance</h3>
                  <p>{selectedPerp.significance}</p>
                </div>
              )}

              {selectedPerp.tags && selectedPerp.tags.length > 0 && (
                <div className="detail-section">
                  <h3>Tags</h3>
                  <div className="tags-container">
                    {selectedPerp.tags.map((tag, i) => (
                      <span key={i} className={`tag ${
                        tag.includes('AT LARGE') || tag.includes('UNPROSECUTED') ? 'tag-warning' :
                        tag.includes('CONVICTED') || tag.includes('IMPRISONED') ? 'tag-success' :
                        tag.includes('NEVER PROSECUTED') || tag.includes('IMPUNITY') || tag.includes('⚠️') ? 'tag-critical' :
                        'tag-default'
                      }`}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="verification-footer">
                <p><strong>Verification Status:</strong> {selectedPerp.verificationStatus}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dina-footer-international">
        <p>🐾 *purrs in international justice* 😻⚖️🌍</p>
        <p className="footer-mission">
          {t.footerMission}
        </p>
        <p className="footer-principle">
          {t.footerPrinciple}
        </p>
        <p className="footer-cooperation">
          {t.footerCooperation}
        </p>
      </div>
    </div>
  );
};

export default DinaDocumentationInternational;
