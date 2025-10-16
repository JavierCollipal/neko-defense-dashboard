// 🐾⚖️ DINA DOCUMENTATION COMPONENT - Expose Chilean Dictatorship Crimes ⚖️🐾
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DinaCentersMap from './DinaCentersMap';
import '../styles/DinaDocumentation.css';

// 🎯 API URL - Express backend runs on port 5001 (same as main app), nyaa~!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function DinaDocumentation() {
  const { i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [perpetrators, setPerpetrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerp, setSelectedPerp] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'list', 'details', 'centers', 'international', 'wanted'
  const [statusFilter, setStatusFilter] = useState('all'); // 🎯 NEW: Filter for wanted agents view
  const [expandedAgentId, setExpandedAgentId] = useState(null); // 🎯 NEW: Track which agent card is expanded

  // 🎯 COMPREHENSIVE DINA AGENTS DATABASE - Research Updated October 2025
  const dinaAgentsDatabase = [
    {
      fullName: "Manuel Contreras Sepúlveda",
      codename: "Mamo",
      alias: "El Mamo",
      role: "DINA Commander & Chief",
      rank: "Brigadier General",
      organization: ["DINA (1973-1977)"],
      status: "DECEASED - CONVICTED",
      researchCapability: "Strategic intelligence, torture coordination, international operations, CIA liaison",
      workCapability: "Full command authority over all DINA operations, cross-border assassination planning, Operation Condor coordination",
      legalStatus: {
        convicted: true,
        currentStatus: "Died in prison August 7, 2015 (age 86)",
        sentences: "59 unappealable sentences totaling 529 years",
        prisonLocation: "Died at Military Hospital (was at Punta Peuco)"
      },
      crimesAccused: [
        "Commander of DINA",
        "Kidnapping",
        "Forced Disappearance",
        "Assassination (Letelier-Moffitt, Carlos Prats)",
        "Torture",
        "Crimes Against Humanity",
        "International Terrorism"
      ],
      notableOperations: [
        "Letelier-Moffitt Assassination (USA, 1976) - 7 years prison",
        "General Carlos Prats Assassination (Argentina, 1974) - 2 LIFE SENTENCES",
        "Operation Colombo",
        "Villa Grimaldi torture operations"
      ],
      verificationStatus: "HISTORICALLY VERIFIED",
      significance: "One of most convicted agents in Latin American history. Worked for CIA and received payments.",
      tags: ["DINA Chief", "International Crimes", "CIA Connection", "CONVICTED", "DECEASED"]
    },
    {
      fullName: "Adriana Rivas Araya",
      codename: "La Chani",
      alias: "La Chani",
      role: "DINA Agent - Lautaro Brigade Secretary",
      organization: ["DINA - Lautaro Brigade (1973-1977)"],
      status: "⚠️ AT LARGE - FIGHTING EXTRADITION",
      researchCapability: "Intelligence documentation, detainee records management, Contreras' personal secretary access to classified operations",
      workCapability: "Administrative control of Lautaro Brigade operations, coordination of kidnappings, victim processing and documentation",
      legalStatus: {
        convicted: false,
        currentStatus: "IMPRISONED IN AUSTRALIA since 2019 - Fighting Extradition",
        charges: "7 counts aggravated kidnapping (Reynalda Pereira, Fernando Navarro, Lincoyán Berríos, Horacio Cepeda, Juan Fernando Ortiz, Héctor Véliz, Víctor Díaz)",
        extraditionStatus: "Australian Federal Court rejected appeal July 2025. Next High Court hearing March 2025.",
        prisonLocation: "Sydney, Australia"
      },
      crimesAccused: [
        "Aggravated Kidnapping (7 counts)",
        "Complicity in Forced Disappearances",
        "Torture assistance"
      ],
      timeline: [
        "1973-1977: Worked as Contreras' personal secretary",
        "2010: Released on bail in Chile, fled to Australia",
        "2019: Arrested in Australia on extradition request",
        "2025: Fighting extradition in Australian courts"
      ],
      verificationStatus: "ACTIVE CASE",
      significance: "Most prominent DINA agent currently evading Chilean justice. May be 'dozens more DINA agents in Australia who lied on original migration applications.'",
      tags: ["AT LARGE", "EXTRADITION CASE", "UNPROSECUTED", "AUSTRALIA", "HIGH PRIORITY"]
    },
    {
      fullName: "Miguel Krassnoff Martchenko",
      codename: "Vlado",
      alias: "El Ruso (The Russian)",
      role: "DINA Operations Officer - Caupolicán Brigade",
      rank: "Captain (DINA)",
      organization: ["DINA", "Chilean Army"],
      status: "CONVICTED - IMPRISONED",
      researchCapability: "Torture techniques specialist, interrogation methods, forced disappearance logistics, Villa Grimaldi operations",
      workCapability: "Field operations commander, torture execution, kidnapping operations, death squad coordination, Operation Colombo implementation",
      legalStatus: {
        convicted: true,
        currentStatus: "SERVING SENTENCE",
        sentences: "1,047+ years in prison (convicted in 25+ cases)",
        prisonLocation: "Penal Punta Peuco, Chile",
        recentConvictions: "February 2024: Additional 20 years for Operation Colombo (total now 1,047 years)"
      },
      crimesAccused: [
        "Kidnapping (20+ counts)",
        "Forced Disappearance",
        "Torture",
        "Murder",
        "Crimes Against Humanity"
      ],
      notableOperations: [
        "Operation Colombo",
        "Villa Grimaldi torture operations",
        "Múltiple forced disappearances"
      ],
      verificationStatus: "CONVICTED",
      significance: "One of the most convicted DINA torturers. Known for sadistic torture methods.",
      tags: ["CONVICTED", "IMPRISONED", "1000+ YEARS", "TORTURER"]
    },
    {
      fullName: "Raúl Eduardo Iturriaga Neumann",
      codename: "Guatón",
      alias: "El Guatón",
      role: "DINA Deputy Director - Exterior Operations",
      rank: "Lieutenant Colonel",
      organization: ["DINA", "Chilean Army"],
      status: "CONVICTED - IMPRISONED",
      researchCapability: "International intelligence networks, Operation Condor coordination, foreign assassination planning, European connections",
      workCapability: "External operations command, cross-border assassination execution, diplomatic cover operations, multinational coordination with Argentine/Uruguayan services",
      legalStatus: {
        convicted: true,
        currentStatus: "SERVING SENTENCE",
        sentences: "200+ years in prison",
        prisonLocation: "Penal Punta Peuco, Chile",
        specialNotes: "Was fugitive 2007-2007 (captured after months)"
      },
      crimesAccused: [
        "General Carlos Prats Assassination (Argentina, 1974)",
        "Bernardo Leighton Attempted Assassination (Rome, Italy, 1975) - Italian courts convicted IN ABSENTIA 18 years",
        "Kidnapping",
        "Murder",
        "Crimes Against Humanity"
      ],
      notableOperations: [
        "Operation Condor coordinator",
        "International assassination operations",
        "Cross-border state terrorism"
      ],
      verificationStatus: "CONVICTED",
      significance: "Key figure in DINA's international operations. Italian warrant outstanding.",
      tags: ["CONVICTED", "IMPRISONED", "OPERATION CONDOR", "INTERNATIONAL CRIMES"]
    },
    {
      fullName: "Pedro Octavio Espinoza Bravo",
      codename: "Pedro",
      alias: "El Pedro",
      role: "DINA Second-in-Command",
      rank: "Brigadier General",
      organization: ["DINA", "Chilean Army"],
      status: "CONVICTED - IMPRISONED",
      researchCapability: "Strategic operations planning, DINA infrastructure management, international assassination coordination, Villa Grimaldi oversight",
      workCapability: "Deputy commander authority, operational planning for Letelier assassination, Carmelo Soria murder coordination, direct reporting to Contreras",
      legalStatus: {
        convicted: true,
        currentStatus: "SERVING SENTENCE (as of January 2025)",
        sentences: "200+ years in prison",
        prisonLocation: "Penal Punta Peuco, Chile",
        recentConvictions: "August 2023: 15 years for Carmelo Soria murder"
      },
      crimesAccused: [
        "Letelier-Moffitt Assassination (USA, 1976)",
        "Carmelo Soria murder (Spanish diplomat, 1976)",
        "Kidnapping",
        "Murder",
        "Crimes Against Humanity"
      ],
      notableOperations: [
        "Second-in-command to Contreras",
        "Letelier assassination operation",
        "Villa Grimaldi operations"
      ],
      verificationStatus: "CONVICTED",
      significance: "First military officer imprisoned at Punta Peuco. Contreras' right-hand man.",
      tags: ["CONVICTED", "IMPRISONED", "SECOND-IN-COMMAND", "LETELIER CASE"]
    },
    {
      fullName: "Marcelo Moren Brito",
      codename: "El Ronco",
      alias: "El Ronco (The Hoarse One)",
      role: "Villa Grimaldi Commander - Caupolicán Brigade Chief",
      rank: "Major",
      organization: ["DINA", "Chilean Army", "Caravan of Death"],
      status: "DECEASED - CONVICTED",
      researchCapability: "Mass torture facility management, psychological torture methods, execution protocols, Caravan of Death operations",
      workCapability: "Villa Grimaldi command (4,500+ detainees processed), torture center operations, mass execution coordination, 240+ deaths at single facility",
      legalStatus: {
        convicted: true,
        currentStatus: "Died September 11, 2015 (age 80) at Hospital Militar",
        sentences: "300+ years in prison",
        prisonLocation: "Died in hospital (was at Punta Peuco)"
      },
      crimesAccused: [
        "Commander of Villa Grimaldi torture center",
        "Torture of thousands",
        "Forced Disappearance",
        "Murder (75+ in Caravan of Death)",
        "Crimes Against Humanity"
      ],
      notableOperations: [
        "Villa Grimaldi chief (1974-1978) - 4,500 detainees, 240+ killed",
        "Caravan of Death (1973) - 75+ executions including Víctor Jara",
        "Operation Colombo"
      ],
      verificationStatus: "CONVICTED",
      significance: "One of most sanguinary DINA members. Villa Grimaldi under his command was worst torture center.",
      tags: ["CONVICTED", "DECEASED", "VILLA GRIMALDI COMMANDER", "CARAVAN OF DEATH"]
    },
    {
      fullName: "Osvaldo Romo Mena",
      codename: "Guatón Romo",
      alias: "El Guatón Romo (Fat Romo)",
      role: "DINA Interrogator & Torturer",
      organization: ["DINA (1973-1990)"],
      status: "DECEASED - CONVICTED",
      researchCapability: "Extreme interrogation techniques, psychological torture, forced disappearance logistics, informant identification",
      workCapability: "100+ forced disappearances, direct torture execution, brutal interrogations, Villa Grimaldi operations, Londres 38 work",
      legalStatus: {
        convicted: true,
        currentStatus: "Died July 4, 2007",
        sentences: "Life imprisonment (several suspended by Supreme Court)",
        prisonLocation: "Died (was imprisoned)"
      },
      crimesAccused: [
        "Forced Disappearance (100+ people)",
        "Torture",
        "Interrogation through torture",
        "Murder"
      ],
      verificationStatus: "CONVICTED",
      significance: "Known for extreme brutality in interrogations. Involved in over 100 disappearances.",
      tags: ["CONVICTED", "DECEASED", "TORTURER", "100+ VICTIMS"]
    },
    {
      fullName: "Ingrid Olderöck Bernhard",
      codename: "La Mujer de los Perros",
      alias: "La Mujer de los Perros (The Dog Woman)",
      role: "DINA Torture Specialist - Venda Sexy Commander",
      rank: "Major (Carabineros)",
      organization: ["DINA", "Carabineros de Chile", "Women's School"],
      status: "⚠️ DECEASED - NEVER PROSECUTED",
      researchCapability: "Sexual torture methods, dog training for assault, psychological warfare, female torturer training, Venda Sexy operations",
      workCapability: "Venda Sexy command, 27+ forced disappearances from facility, trained 70 female torturers, specialized in sexual violence and animal-assisted torture",
      legalStatus: {
        convicted: false,
        currentStatus: "Died March 17, 2001 (age 58) from internal hemorrhage",
        prosecution: "NEVER SUBJECTED TO JUDICIAL PROCESS - DIED IN IMPUNITY",
        charges: "None (despite multiple accusations)"
      },
      crimesAccused: [
        "Commander of 'Venda Sexy' torture center",
        "Sexual torture (trained dogs to assault prisoners sexually)",
        "Forced Disappearance (27+ people from Venda Sexy)",
        "Training 70 women in torture methods",
        "Extreme sadistic torture"
      ],
      notableOperations: [
        "Created and commanded 'Venda Sexy' torture center",
        "Women's School - trained female torturers",
        "Specialized in sexual violence and psychological torture"
      ],
      verificationStatus: "VERIFIED - UNPUNISHED",
      significance: "⚠️ ONE OF WORST CASES OF IMPUNITY! Never prosecuted despite heinous crimes. Became known only after 1981 assassination attempt.",
      tags: ["NEVER PROSECUTED", "DECEASED", "IMPUNITY", "SEXUAL TORTURE", "VENDA SEXY", "⚠️ UNPUNISHED"]
    }
  ];

  // 📊 Calculate wanted agents statistics
  // 🎯 NOW USES MONGODB DATA (perpetrators state) - Falls back to hardcoded if empty
  const calculateWantedStats = () => {
    const dataSource = perpetrators.length > 0 ? perpetrators : dinaAgentsDatabase;

    return {
      totalAgents: 1097, // Army's official 2008 list
      documented: dataSource.length,
      atLarge: dataSource.filter(a => a.status?.includes('AT LARGE')).length,
      convicted: dataSource.filter(a => a.legalStatus?.convicted).length,
      imprisoned: dataSource.filter(a => a.status === 'CONVICTED - IMPRISONED').length,
      deceased: dataSource.filter(a => a.status?.includes('DECEASED')).length,
      unprosecuted: dataSource.filter(a => !a.legalStatus?.convicted && !a.status?.includes('DECEASED')).length,
      neverProsecuted: dataSource.filter(a => a.legalStatus?.prosecution?.includes('NEVER')).length
    };
  };

  useEffect(() => {
    fetchDinaData();
  }, [i18n.language]); // Refetch when language changes, desu~!

  const fetchDinaData = async () => {
    try {
      setLoading(true);
      const userLang = i18n.language || 'en';
      console.log('🔍 [DinaDoc] Fetching DINA data from API, nyaa~ | Language:', userLang);

      // Fetch DINA statistics with timeout
      try {
        const statsController = new AbortController();
        const statsTimeout = setTimeout(() => statsController.abort(), 5000);

        const statsResponse = await fetch(`${API_URL}/dina/stats`, {
          signal: statsController.signal
        });
        clearTimeout(statsTimeout);

        const statsData = await statsResponse.json();
        if (statsData.success) {
          console.log('✅ [DinaDoc] Stats loaded successfully');
          setStats(statsData.data);
        } else {
          console.warn('⚠️ [DinaDoc] Stats API returned success: false');
        }
      } catch (statsError) {
        console.warn('⚠️ [DinaDoc] Stats fetch failed, using defaults:', statsError.message);
        // Set default stats if API fails
        setStats({
          total_documents: dinaAgentsDatabase.length,
          perpetrators: {
            total: dinaAgentsDatabase.length,
            convicted: dinaAgentsDatabase.filter(a => a.legalStatus?.convicted).length,
            unprosecuted: dinaAgentsDatabase.filter(a => !a.legalStatus?.convicted).length
          }
        });
      }

      // Fetch DINA perpetrators with timeout and fallback
      try {
        const perpsController = new AbortController();
        const perpsTimeout = setTimeout(() => perpsController.abort(), 5000);

        const perpsResponse = await fetch(`${API_URL}/dina/perpetrators?lang=${userLang}`, {
          signal: perpsController.signal
        });
        clearTimeout(perpsTimeout);

        const perpsData = await perpsResponse.json();
        if (perpsData.success && perpsData.data && perpsData.data.length > 0) {
          console.log(`✅ [DinaDoc] Loaded ${perpsData.data.length} perpetrators from API`);
          setPerpetrators(perpsData.data);
        } else {
          console.warn('⚠️ [DinaDoc] No perpetrators from API, using hardcoded database');
          setPerpetrators(dinaAgentsDatabase);
        }
      } catch (perpsError) {
        console.warn('⚠️ [DinaDoc] Perpetrators fetch failed, using hardcoded database:', perpsError.message);
        // Fallback to hardcoded database if API fails
        setPerpetrators(dinaAgentsDatabase);
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ [DinaDoc] Failed to fetch DINA data:', error);
      // Ultimate fallback: use hardcoded database
      setPerpetrators(dinaAgentsDatabase);
      setStats({
        total_documents: dinaAgentsDatabase.length,
        perpetrators: {
          total: dinaAgentsDatabase.length,
          convicted: dinaAgentsDatabase.filter(a => a.legalStatus?.convicted).length,
          unprosecuted: dinaAgentsDatabase.filter(a => !a.legalStatus?.convicted).length
        }
      });
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
  };

  // 🎯 Filter wanted agents by status - Uses MongoDB data!
  const getFilteredWantedAgents = () => {
    const dataSource = perpetrators.length > 0 ? perpetrators : dinaAgentsDatabase;

    if (statusFilter === 'all') {
      return dataSource;
    }

    return dataSource.filter(agent => {
      switch (statusFilter) {
        case 'at-large':
          return agent.status?.includes('AT LARGE');
        case 'imprisoned':
          return agent.status === 'CONVICTED - IMPRISONED';
        case 'never-prosecuted':
          return agent.legalStatus?.prosecution?.includes('NEVER');
        default:
          return true;
      }
    });
  };

  if (loading) {
    return (
      <div className="dina-container">
        <div className="dina-loading">
          ⚖️ Loading DINA documentation, nyaa~...
        </div>
      </div>
    );
  }

  return (
    <div className="dina-container">
      <div className="dina-header">
        <h2>🔍 DINA Documentation Archive</h2>
        <p className="dina-subtitle">
          Chilean Secret Police (1973-1977) - Crimes Against Humanity
        </p>
        <p className="dina-methodology">
          📚 Methodology: Simon Wiesenthal Nazi-Hunting Precedent
        </p>
        <p className="dina-legal">
          ⚖️ Legal Basis: No Statute of Limitations for Crimes Against Humanity
        </p>
      </div>

      {/* Enhanced Stats Dashboard - OPTION A */}
      {stats && (
        <div className="dina-stats-enhanced">
          <div className="stats-row-primary">
            <div className="stat-box">
              <div className="stat-value">{stats.total_documents}</div>
              <div className="stat-label">Total Documents</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.perpetrators?.total || 0}</div>
              <div className="stat-label">Perpetrators Documented</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{stats.perpetrators?.convicted || 0}</div>
              <div className="stat-label">Convicted</div>
            </div>
            <div className="stat-box warning">
              <div className="stat-value">{stats.perpetrators?.unprosecuted || 0}</div>
              <div className="stat-label">Still Unprosecuted</div>
            </div>
          </div>

          {/* NEW: Detailed Statistics Breakdown */}
          <div className="stats-detailed-section">
            <div className="stat-category victims-total">
              <h3>📊 Total Dictatorship Victims (1973-1990)</h3>
              <div className="stat-breakdown">
                <div className="stat-item large">~30,000 <span>Total Victims</span></div>
                <div className="stat-item">27,255 <span>Tortured</span></div>
                <div className="stat-item">2,279 <span>Executed</span></div>
                <div className="stat-item">957 <span>Disappeared</span></div>
              </div>
            </div>

            <div className="stat-category dina-specific highlight">
              <h3>⚡ DINA Specific Crimes (1973-1977 - Only 4 Years!)</h3>
              <div className="stat-breakdown">
                <div className="stat-item critical">2,279 <span>Murders</span></div>
                <div className="stat-item critical">957 <span>Forced Disappearances</span></div>
                <div className="stat-item">4,500+ <span>Villa Grimaldi Detainees</span></div>
                <div className="stat-item">1,100+ <span>Londres 38 Detainees</span></div>
              </div>
              <p className="stat-note">💀 DINA responsible for MAJORITY of regime's crimes in first 3 years</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="dina-navigation">
        <button
          className={`nav-btn ${viewMode === 'overview' ? 'active' : ''}`}
          onClick={() => changeView('overview')}
        >
          🏠 OVERVIEW
        </button>
        <button
          className={`nav-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => changeView('list')}
        >
          📋 PERPETRATORS
        </button>
        <button
          className={`nav-btn ${viewMode === 'wanted' ? 'active' : ''}`}
          onClick={() => changeView('wanted')}
        >
          🎯 WANTED AGENTS
        </button>
        <button
          className={`nav-btn ${viewMode === 'centers' ? 'active' : ''}`}
          onClick={() => changeView('centers')}
        >
          🏢 TORTURE CENTERS
        </button>
        <button
          className={`nav-btn ${viewMode === 'international' ? 'active' : ''}`}
          onClick={() => changeView('international')}
        >
          🌍 INTERNATIONAL CRIMES
        </button>
      </div>

      {/* Main Content Area with Multiple Views */}
      <div className="dina-content-area">

        {/* OVERVIEW VIEW */}
        {viewMode === 'overview' && (
          <div className="overview-section">
            <div className="overview-banner">
              <h2>🔍 DINA DOCUMENTATION OPERATION ACTIVE</h2>
              <p>Comprehensive documentation of Chilean dictatorship crimes (1973-1977)</p>
            </div>

            <div className="overview-cards">
              <div className="overview-card mission-card">
                <h3>🎯 MISSION</h3>
                <p>Document all DINA perpetrators and ensure accountability through evidence-based prosecution. Following the Simon Wiesenthal Nazi-hunting precedent.</p>
              </div>

              <div className="overview-card scope-card">
                <h3>📍 SCOPE</h3>
                <p>DINA operated 1973-1977 across Chile and internationally through Operation Condor. Documented: Torture centers, perpetrators, victims, and international crimes.</p>
              </div>

              <div className="overview-card jurisdiction-card">
                <h3>⚖️ UNIVERSAL JURISDICTION</h3>
                <p>Crimes against humanity have NO statute of limitations. Any country can prosecute. No safe haven for perpetrators, nyaa~!</p>
              </div>
            </div>

            <div className="quick-access-buttons">
              <button className="quick-btn" onClick={() => changeView('international')}>
                🌍 View International Crimes →
              </button>
              <button className="quick-btn" onClick={() => changeView('centers')}>
                🏢 View Torture Centers →
              </button>
              <button className="quick-btn" onClick={() => changeView('list')}>
                📋 View Perpetrators →
              </button>
            </div>
          </div>
        )}

        {/* WANTED AGENTS VIEW - COMPREHENSIVE DATABASE */}
        {viewMode === 'wanted' && (
          <div className="wanted-agents-view">
            <h2>🎯 DINA WANTED AGENTS & STATUS TRACKING</h2>
            <p className="wanted-subtitle">Comprehensive database of documented DINA agents - Updated October 2025</p>

            {/* Statistics Dashboard */}
            <div className="wanted-stats-dashboard">
              <div className="wanted-stat-card total">
                <div className="stat-number">{calculateWantedStats().totalAgents}</div>
                <div className="stat-label">Total DINA Agents (2008 Army List)</div>
              </div>
              <div className="wanted-stat-card documented">
                <div className="stat-number">{calculateWantedStats().documented}</div>
                <div className="stat-label">High-Profile Documented</div>
              </div>
              <div className="wanted-stat-card at-large warning">
                <div className="stat-number">{calculateWantedStats().atLarge}</div>
                <div className="stat-label">⚠️ AT LARGE - FIGHTING EXTRADITION</div>
              </div>
              <div className="wanted-stat-card imprisoned success">
                <div className="stat-number">{calculateWantedStats().imprisoned}</div>
                <div className="stat-label">Currently Imprisoned</div>
              </div>
              <div className="wanted-stat-card deceased">
                <div className="stat-number">{calculateWantedStats().deceased}</div>
                <div className="stat-label">Deceased (Convicted & Not)</div>
              </div>
              <div className="wanted-stat-card never-prosecuted critical">
                <div className="stat-number">{calculateWantedStats().neverProsecuted}</div>
                <div className="stat-label">⚠️ NEVER PROSECUTED (DIED IN IMPUNITY)</div>
              </div>
            </div>

            {/* Wanted Agents Comprehensive List */}
            <div className="wanted-agents-comprehensive">
              <h3>📋 Comprehensive DINA Agents Database</h3>
              <p className="database-note">Following Simon Wiesenthal Nazi-hunting precedent: NO statute of limitations for crimes against humanity, nyaa~!</p>

              {/* Filter by Status - 🎯 NOW INTERACTIVE! */}
              <div className="status-filter">
                <button
                  className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  ALL ({perpetrators.length > 0 ? perpetrators.length : dinaAgentsDatabase.length})
                </button>
                <button
                  className={`filter-btn warning ${statusFilter === 'at-large' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('at-large')}
                >
                  AT LARGE ({calculateWantedStats().atLarge})
                </button>
                <button
                  className={`filter-btn success ${statusFilter === 'imprisoned' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('imprisoned')}
                >
                  IMPRISONED ({calculateWantedStats().imprisoned})
                </button>
                <button
                  className={`filter-btn critical ${statusFilter === 'never-prosecuted' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('never-prosecuted')}
                >
                  NEVER PROSECUTED ({calculateWantedStats().neverProsecuted})
                </button>
              </div>

              {/* Agents Grid - 🎯 MODERN COLLAPSIBLE CARDS WITH MONGODB DATA! */}
              <div className="wanted-agents-grid-modern">
                {getFilteredWantedAgents().map((agent, index) => {
                  const agentId = `agent-${index}`;
                  const isExpanded = expandedAgentId === agentId;

                  return (
                    <div
                      key={index}
                      className={`wanted-agent-card-modern ${
                        agent.status.includes('AT LARGE') ? 'at-large-card' : ''
                      } ${
                        agent.status.includes('NEVER PROSECUTED') ? 'impunity-card' : ''
                      } ${
                        isExpanded ? 'expanded' : ''
                      }`}
                      onClick={() => setExpandedAgentId(isExpanded ? null : agentId)}
                    >
                      {/* COMPACT PREVIEW (Always Visible) */}
                      <div className="agent-preview">
                        {/* Prominent Status Badge */}
                        <div className={`status-badge-modern ${
                          agent.status.includes('AT LARGE') ? 'badge-warning' :
                          agent.status === 'CONVICTED - IMPRISONED' ? 'badge-success' :
                          agent.status.includes('NEVER PROSECUTED') ? 'badge-critical' :
                          agent.status.includes('DECEASED') && agent.legalStatus?.convicted ? 'badge-deceased-convicted' :
                          'badge-deceased'
                        }`}>
                          {agent.status}
                        </div>

                        {/* Agent Name & Identity */}
                        <h3 className="agent-name-modern">{agent.fullName}</h3>
                        {agent.alias && <div className="agent-alias-modern">"{agent.alias}"</div>}
                        <div className="agent-role-modern">{agent.role}</div>

                        {/* Quick Stats */}
                        <div className="agent-quick-stats">
                          <span className="stat-convicted">
                            {agent.legalStatus?.convicted ? '✅ CONVICTED' : '⚠️ UNPROSECUTED'}
                          </span>
                          <span className="stat-crimes">
                            💀 {agent.crimesAccused?.length || 0} crimes
                          </span>
                        </div>

                        {/* Expand Indicator */}
                        <div className="expand-indicator">
                          {isExpanded ? '▲ Click to collapse' : '▼ Click for full details'}
                        </div>
                      </div>

                      {/* DETAILED VIEW (Expandable) */}
                      {isExpanded && (
                        <div className="agent-details-expanded" onClick={(e) => e.stopPropagation()}>
                          {/* Identity Section */}
                          {agent.codename && (
                            <div className="detail-section-modern">
                              <h4>🎭 Codename</h4>
                              <p>"{agent.codename}"</p>
                            </div>
                          )}

                          {/* Organization */}
                          <div className="detail-section-modern">
                            <h4>🏢 Organization</h4>
                            <p>{agent.organization.join(', ')}</p>
                          </div>

                          {/* Legal Status */}
                          <div className="detail-section-modern legal-section">
                            <h4>⚖️ Legal Status</h4>
                            <div className="legal-grid">
                              <div className="legal-item">
                                <strong>Convicted:</strong> {agent.legalStatus?.convicted ? '✅ YES' : '⚠️ NO'}
                              </div>
                              <div className="legal-item">
                                <strong>Current:</strong> {agent.legalStatus?.currentStatus}
                              </div>
                              {agent.legalStatus?.sentences && (
                                <div className="legal-item highlight">
                                  <strong>Sentences:</strong> {agent.legalStatus.sentences}
                                </div>
                              )}
                              {agent.legalStatus?.prisonLocation && (
                                <div className="legal-item">
                                  <strong>Location:</strong> {agent.legalStatus.prisonLocation}
                                </div>
                              )}
                              {agent.legalStatus?.extraditionStatus && (
                                <div className="legal-item critical">
                                  <strong>🚨 Extradition:</strong> {agent.legalStatus.extraditionStatus}
                                </div>
                              )}
                              {agent.legalStatus?.prosecution && (
                                <div className="legal-item critical">
                                  <strong>⚠️ Prosecution:</strong> {agent.legalStatus.prosecution}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Crimes */}
                          <div className="detail-section-modern crimes-section">
                            <h4>💀 Crimes Accused</h4>
                            <ul className="crimes-list-modern">
                              {agent.crimesAccused.map((crime, i) => (
                                <li key={i}>{crime}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Capabilities (Collapsible within expanded view) */}
                          {agent.researchCapability && (
                            <div className="detail-section-modern">
                              <h4>🔍 Research Capability</h4>
                              <p className="capability-text">{agent.researchCapability}</p>
                            </div>
                          )}

                          {agent.workCapability && (
                            <div className="detail-section-modern">
                              <h4>⚡ Work Capability</h4>
                              <p className="capability-text">{agent.workCapability}</p>
                            </div>
                          )}

                          {/* Notable Operations */}
                          {agent.notableOperations && agent.notableOperations.length > 0 && (
                            <div className="detail-section-modern">
                              <h4>🎯 Notable Operations</h4>
                              <ul className="operations-list-modern">
                                {agent.notableOperations.map((op, i) => (
                                  <li key={i}>{op}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Timeline */}
                          {agent.timeline && agent.timeline.length > 0 && (
                            <div className="detail-section-modern timeline-section">
                              <h4>📅 Timeline</h4>
                              <ul className="timeline-list-modern">
                                {agent.timeline.map((event, i) => (
                                  <li key={i}>{event}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Significance */}
                          {agent.significance && (
                            <div className={`detail-section-modern significance-section ${agent.significance.includes('⚠️') ? 'critical-significance' : ''}`}>
                              <h4>🎯 Significance</h4>
                              <p>{agent.significance}</p>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="detail-section-modern tags-section">
                            <h4>🏷️ Tags</h4>
                            <div className="tags-modern">
                              {agent.tags.map((tag, i) => (
                                <span key={i} className={`tag-modern ${
                                  tag.includes('AT LARGE') || tag.includes('UNPROSECUTED') ? 'tag-warning-modern' :
                                  tag.includes('CONVICTED') || tag.includes('IMPRISONED') ? 'tag-success-modern' :
                                  tag.includes('NEVER PROSECUTED') || tag.includes('IMPUNITY') || tag.includes('⚠️') ? 'tag-critical-modern' :
                                  'tag-default-modern'
                                }`}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Verification */}
                          <div className="detail-section-modern verification-section">
                            <p><strong>Verification:</strong> {agent.verificationStatus}</p>
                          </div>

                          {/* Close Button */}
                          <button
                            className="close-details-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedAgentId(null);
                            }}
                          >
                            ✖ Close Details
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Additional Context */}
              <div className="wanted-context-section">
                <h3>📊 Context & Methodology</h3>
                <div className="context-card">
                  <h4>🎯 Simon Wiesenthal Precedent</h4>
                  <p>Following Nazi-hunter Simon Wiesenthal's methodology: Systematic documentation, evidence preservation, and pursuit of justice regardless of time elapsed.</p>
                </div>
                <div className="context-card">
                  <h4>⚖️ Universal Jurisdiction</h4>
                  <p>Crimes against humanity have NO statute of limitations. Any country can prosecute. Current focus: Adriana Rivas extradition from Australia.</p>
                </div>
                <div className="context-card">
                  <h4>📋 The 1,097 Agents List</h4>
                  <p>In 2008, the Chilean Army presented a list of 1,097 DINA agents to Judge Alejandro Solís. Of these, hundreds have been prosecuted, but many remain unpunished.</p>
                </div>
                <div className="context-card critical">
                  <h4>⚠️ Agents in Australia</h4>
                  <p>Adriana Rivas case suggests "dozens more DINA agents in Australia who lied on original migration applications." Investigation ongoing, desu~!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERPETRATORS LIST VIEW */}
        {viewMode === 'list' && (
          <div className="perpetrators-list">
            <h3>📋 Documented DINA Agents & Collaborators</h3>
            {perpetrators.length === 0 ? (
              <div className="no-data">No perpetrators documented yet, desu!</div>
            ) : (
              <div className="perp-grid">
                {perpetrators.map((perp, index) => (
                  <div key={index} className="perp-card" onClick={() => showDetails(perp)}>
                    <div className="perp-name">{perp.fullName}</div>
                    <div className="perp-role">{perp.role}</div>
                    <div className={`perp-status ${perp.legalStatus?.convicted ? 'convicted' : 'unprosecuted'}`}>
                      {perp.legalStatus?.convicted ? '⚖️ CONVICTED' : '⚠️ UNPROSECUTED'}
                    </div>
                    <div className="perp-verification">
                      Status: {perp.verificationStatus || 'unverified'}
                    </div>
                    {perp.organization && perp.organization.length > 0 && (
                      <div className="perp-org">
                        {perp.organization.slice(0, 2).join(', ')}
                      </div>
                    )}
                    <div className="perp-crimes-count">
                      {perp.crimesAccused?.length || 0} crimes documented
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TORTURE CENTERS VIEW - OPTION C */}
        {viewMode === 'centers' && (
          <div className="torture-centers-view">
            <h2>🏢 DINA Secret Detention & Torture Centers Network</h2>
            <p className="centers-subtitle">Physical infrastructure of state terror - Many now serve as memorial sites</p>

            {/* Interactive Map Component */}
            <DinaCentersMap />

            <div className="centers-grid">
              <div className="center-card villa-grimaldi">
                <h3>Villa Grimaldi (Cuartel Terranova)</h3>
                <div className="center-header-info">
                  <span className="center-significance">⭐ MOST IMPORTANT DINA COMPLEX</span>
                </div>
                <div className="center-stats">
                  <div className="center-stat">📍 Location: <strong>Av. José Arrieta 8401, Peñalolén, Santiago</strong></div>
                  <div className="center-stat">📅 Period: <strong>Mid-1974 to Mid-1978</strong></div>
                  <div className="center-stat">👥 Detainees: <strong>~4,500 people</strong></div>
                  <div className="center-stat critical">💀 Killed/Disappeared: <strong>240+</strong></div>
                </div>
                <div className="center-current-status success">
                  ✅ NOW: <strong>Parque por la Paz</strong> (Peace Park Memorial) - Open to public
                </div>
                <div className="torture-methods">
                  <h4>Documented Torture Methods:</h4>
                  <ul>
                    <li>⚡ <strong>La Parrilla</strong> (The Grill) - Electric shock metal bed</li>
                    <li>⚡ Electric shock to lips, genitals, sensitive areas</li>
                    <li>💧 Waterboarding and near-drowning</li>
                    <li>🧠 Psychological torture and mock executions</li>
                  </ul>
                </div>
                <div className="center-commander">Commander: <strong>Colonel Manuel Contreras (DINA chief)</strong></div>
              </div>

              <div className="center-card londres-38">
                <h3>Londres 38 (Yucatán)</h3>
                <div className="center-header-info">
                  <span className="center-significance">⭐ FIRST DINA DETENTION CENTER</span>
                </div>
                <div className="center-stats">
                  <div className="center-stat">📍 Location: <strong>Londres 38, Downtown Santiago</strong></div>
                  <div className="center-stat">📅 Period: <strong>September 1973 - December 1974</strong></div>
                  <div className="center-stat">👥 Detainees: <strong>~1,100 people</strong></div>
                  <div className="center-stat critical">💀 Executed: <strong>94 (including 2 pregnant women)</strong></div>
                </div>
                <div className="center-current-status success">
                  ✅ NOW: <strong>Memorial & Human Rights Center</strong> - Open to public
                </div>
                <div className="center-significance-note">
                  First link in DINA's chain of detention facilities. Code name: <strong>"Yucatán"</strong>
                </div>
              </div>

              <div className="center-card other-centers">
                <h3>Other DINA Secret Centers</h3>
                <div className="center-list">
                  <div className="center-list-item">
                    <h4>🏢 Jose Domingo Cañas</h4>
                    <p>📍 Santiago | 📅 1974-1975 | Major interrogation center</p>
                  </div>
                  <div className="center-list-item">
                    <h4>🏢 Cuatro Alamos</h4>
                    <p>📍 Santiago | 📅 1974-1976 | Transit detention center</p>
                  </div>
                  <div className="center-list-item">
                    <h4>🏢 Venecia</h4>
                    <p>📍 Santiago region | 📅 1974-1977 | Secret facility</p>
                  </div>
                  <div className="center-list-item">
                    <h4>🏢 Malloco</h4>
                    <p>📍 Santiago region | 📅 1974-1977 | Secret facility</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="centers-network-info">
              <h3>🗺️ Network of Terror</h3>
              <p>DINA operated a systematic network of clandestine detention centers across Chile. These facilities were used for:</p>
              <ul>
                <li>🔒 Secret arrests without legal process</li>
                <li>⚡ Systematic torture and interrogation</li>
                <li>💀 Executions and forced disappearances</li>
                <li>📦 Body disposal to hide evidence</li>
              </ul>
              <p className="memorial-note">Many of these sites are now memorials that can be visited to honor the victims and preserve historical memory, desu! 🕊️</p>
            </div>
          </div>
        )}

        {/* INTERNATIONAL CRIMES VIEW - OPTION B */}
        {viewMode === 'international' && (
          <div className="international-crimes-view">
            <h2>🌍 DINA International Terrorism & Assassinations</h2>
            <p className="international-subtitle">Proving Universal Jurisdiction Applies - Crimes committed across 3 continents</p>

            <div className="jurisdiction-banner">
              <h3>⚖️ UNIVERSAL JURISDICTION PRINCIPLE</h3>
              <p>DINA committed crimes in USA, Europe, and Latin America. Any country can prosecute crimes against humanity. <strong>NO SAFE HAVEN!</strong></p>
            </div>

            <div className="crimes-timeline">
              <div className="crime-card letelier-crime">
                <div className="crime-location">🇺🇸 WASHINGTON DC, UNITED STATES</div>
                <h3>Letelier-Moffitt Assassination</h3>
                <div className="crime-date">📅 September 21, 1976</div>
                <div className="crime-victims">
                  <h4>💀 Victims:</h4>
                  <ul>
                    <li><strong>Orlando Letelier</strong> - Chilean diplomat, former Foreign Minister under Allende</li>
                    <li><strong>Ronni Karpen Moffitt</strong> - US citizen, American colleague, innocent bystander</li>
                  </ul>
                </div>
                <div className="crime-method">
                  <strong>Method:</strong> 🚗💣 Car bomb planted in Sheridan Circle, Washington DC
                </div>
                <div className="crime-perpetrators">
                  <strong>Perpetrators:</strong> Michael Townley (DINA agent), Cuban exile operatives
                </div>
                <div className="crime-prosecution success">
                  <strong>⚖️ Prosecution:</strong> Manuel Contreras convicted 1995 → Sentenced 7 years prison (served until 2001)
                </div>
                <div className="crime-significance">
                  <strong>🎯 Significance:</strong> International terrorism on US soil! First major conviction of Contreras. Proved DINA operated globally.
                </div>
              </div>

              <div className="crime-card prats-crime">
                <div className="crime-location">🇦🇷 BUENOS AIRES, ARGENTINA</div>
                <h3>General Carlos Prats Assassination</h3>
                <div className="crime-date">📅 September 30, 1974</div>
                <div className="crime-victims">
                  <h4>💀 Victims:</h4>
                  <ul>
                    <li><strong>General Carlos Prats</strong> - Chilean Army Commander-in-Chief (Pinochet's predecessor)</li>
                    <li><strong>Sofía Cuthbert</strong> - His wife</li>
                  </ul>
                </div>
                <div className="crime-method">
                  <strong>Method:</strong> 🚗💣 Car bomb explosion
                </div>
                <div className="crime-prosecution success">
                  <strong>⚖️ Prosecution:</strong> Manuel Contreras sentenced to <strong>2 LIFE SENTENCES</strong> (June 30, 2008)
                </div>
                <div className="crime-significance">
                  <strong>🎯 Significance:</strong> Operation Condor cross-border assassination. Eliminated Pinochet's military rival in exile. Shows Argentina-Chile DINA cooperation.
                </div>
              </div>

              <div className="crime-card leighton-crime">
                <div className="crime-location">🇮🇹 ROME, ITALY</div>
                <h3>Bernardo Leighton Attempted Assassination</h3>
                <div className="crime-date">📅 October 6, 1975</div>
                <div className="crime-victims">
                  <h4>🏥 Victims (Both Survived):</h4>
                  <ul>
                    <li><strong>Bernardo Leighton</strong> - Former Chilean Vice President, Christian Democrat leader</li>
                    <li><strong>Anita Leighton</strong> - His wife</li>
                  </ul>
                </div>
                <div className="crime-method">
                  <strong>Method:</strong> 🔫 Shooting attack in Rome
                </div>
                <div className="crime-prosecution success">
                  <strong>⚖️ Prosecution:</strong> Italian courts convicted Contreras & Raúl Iturriaga <strong>in absentia</strong> (18 years each, 1995)
                </div>
                <div className="crime-significance">
                  <strong>🎯 Significance:</strong> Proves European reach of DINA terror! International warrants issued. Shows no continent was safe from DINA operations.
                </div>
              </div>

              <div className="crime-card condor-network">
                <div className="crime-location">🌍 OPERATION CONDOR - MULTINATIONAL</div>
                <h3>🦅 Cross-Border State Terrorism Network</h3>
                <div className="crime-date">📅 Founded: November 28, 1975, Santiago, Chile</div>
                <div className="condor-info">
                  <h4>Participating Countries:</h4>
                  <div className="condor-countries">
                    <span>🇨🇱 Chile (DINA)</span>
                    <span>🇦🇷 Argentina (SIDE)</span>
                    <span>🇺🇾 Uruguay</span>
                    <span>🇵🇾 Paraguay</span>
                    <span>🇧🇷 Brazil</span>
                    <span>🇧🇴 Bolivia</span>
                  </div>
                </div>
                <div className="crime-victims">
                  <h4>💀 Notable Operation Condor Victims:</h4>
                  <ul>
                    <li><strong>Zelmar Michelini</strong> - Uruguayan former MP (assassinated Buenos Aires)</li>
                    <li><strong>Héctor Gutiérrez Ruiz</strong> - Uruguayan former MP (assassinated Buenos Aires)</li>
                    <li><strong>Juan José Torres</strong> - Former Bolivian president (assassinated Buenos Aires)</li>
                  </ul>
                </div>
                <div className="crime-significance">
                  <strong>🎯 Significance:</strong> Coordinated international state terrorism. Dictatorships hunted dissidents across borders. Dozens of cross-border assassinations documented.
                </div>
              </div>

              <div className="crime-card cia-connection">
                <div className="crime-location">🔐 CIA COLLABORATION</div>
                <h3>US Intelligence Complicity</h3>
                <div className="cia-info">
                  <p><strong>Evidence:</strong> Declassified US documents confirm DINA chief Manuel Contreras worked for CIA and received payments.</p>
                  <p><strong>Source:</strong> National Security Archive, CIA FOIA releases, US Congressional investigations</p>
                  <p><strong>🎯 Significance:</strong> US complicity in DINA operations. Intelligence sharing between CIA and DINA. Questions about US knowledge of international assassinations.</p>
                </div>
              </div>
            </div>

            <div className="contreras-final-record">
              <h3>⚖️ Manuel Contreras - Final Conviction Record</h3>
              <p className="contreras-subtitle">DINA Commander (1973-1977) - One of most convicted agents in Latin American history</p>
              <div className="contreras-stats">
                <div className="contreras-stat">
                  <div className="stat-value">59</div>
                  <div className="stat-label">Unappealable Sentences</div>
                </div>
                <div className="contreras-stat">
                  <div className="stat-value">529</div>
                  <div className="stat-label">Years in Prison</div>
                </div>
                <div className="contreras-stat">
                  <div className="stat-value">💀</div>
                  <div className="stat-label">Died in Prison</div>
                </div>
              </div>
              <div className="contreras-crimes">
                <strong>Convicted for:</strong> Kidnapping, Forced Disappearance, Assassination, Torture, Crimes Against Humanity
              </div>
              <p className="justice-note">Justice achieved through persistent prosecution across multiple jurisdictions, nyaa~! ⚖️✨</p>
            </div>
          </div>
        )}

        {/* PERPETRATOR DETAILS VIEW */}
        {viewMode === 'details' && (
          <div className="perpetrator-details">
            <button className="back-button" onClick={() => changeView('list')}>
              ← Back to List
            </button>
            {selectedPerp && (
              <div className="details-content">
                <h2>{selectedPerp.fullName}</h2>
                <div className="detail-section">
                  <h3>Role & Organization</h3>
                  <p><strong>Role:</strong> {selectedPerp.role}</p>
                  {selectedPerp.organization && selectedPerp.organization.length > 0 && (
                    <p><strong>Organizations:</strong> {selectedPerp.organization.join(', ')}</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Legal Status</h3>
                  <p className={selectedPerp.legalStatus?.convicted ? 'status-convicted' : 'status-unprosecuted'}>
                    <strong>Convicted:</strong> {selectedPerp.legalStatus?.convicted ? 'YES ⚖️' : 'NO ⚠️'}
                  </p>
                  <p><strong>Current Status:</strong> {selectedPerp.legalStatus?.currentStatus || 'Unknown'}</p>
                </div>

                {selectedPerp.crimesAccused && selectedPerp.crimesAccused.length > 0 && (
                  <div className="detail-section">
                    <h3>Crimes Accused</h3>
                    <ul className="crimes-list">
                      {selectedPerp.crimesAccused.map((crime, i) => (
                        <li key={i}>{crime}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPerp.tags && selectedPerp.tags.length > 0 && (
                  <div className="detail-section">
                    <h3>Tags</h3>
                    <div className="tags-container">
                      {selectedPerp.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section verification">
                  <p><strong>Verification Status:</strong> {selectedPerp.verificationStatus}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dina-footer">
        <p>🐾 *purrs in justice documentation* 😻⚖️</p>
        <p className="dina-mission">
          Mission: Document all DINA crimes to ensure accountability and justice for victims
        </p>
        <p className="dina-principle">
          Principle: "Justice, not vengeance" - Simon Wiesenthal
        </p>
      </div>
    </div>
  );
}

export default DinaDocumentation;
