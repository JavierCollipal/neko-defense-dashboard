// 🐾🌍 GLOBAL THREAT MAP - Operation Condor International Visualization 🌍🐾
import React, { useState, useEffect, useRef } from 'react';
import '../styles/GlobalThreatMap.css';

const GlobalThreatMap = ({ language = 'en' }) => {
  const canvasRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Operation Condor countries and DINA operation locations
  const locations = {
    // Chile - DINA headquarters and operations
    chile: {
      name: { en: 'Chile (DINA HQ)', es: 'Chile (Cuartel DINA)', pt: 'Chile (QG DINA)', de: 'Chile (DINA-Hauptquartier)' },
      coords: { x: 280, y: 420 }, // Relative to 800x500 map
      type: 'headquarters',
      details: {
        en: 'DINA Headquarters (1973-1977). 1,102+ disappeared, 2,095+ executed, 35,000+ tortured.',
        es: 'Cuartel General DINA (1973-1977). 1,102+ desaparecidos, 2,095+ ejecutados, 35,000+ torturados.',
        pt: 'Sede da DINA (1973-1977). 1,102+ desaparecidos, 2,095+ executados, 35,000+ torturados.',
        de: 'DINA-Hauptquartier (1973-1977). 1,102+ Verschwundene, 2,095+ Hingerichtete, 35,000+ Gefolterte.'
      },
      facilities: ['Villa Grimaldi', 'Londres 38', 'Colonia Dignidad'],
      perpetrators: ['Manuel Contreras', 'Paul Schäfer', 'Ronaldo Munzenmayer']
    },
    // Argentina - Operation Condor partner
    argentina: {
      name: { en: 'Argentina', es: 'Argentina', pt: 'Argentina', de: 'Argentinien' },
      coords: { x: 310, y: 460 },
      type: 'condor_partner',
      details: {
        en: 'Operation Condor partner. Intelligence sharing, cross-border operations.',
        es: 'Socio de Operación Cóndor. Intercambio de inteligencia, operaciones transfronterizas.',
        pt: 'Parceiro da Operação Condor. Compartilhamento de inteligência, operações transfronteiriças.',
        de: 'Operation Condor Partner. Informationsaustausch, grenzüberschreitende Operationen.'
      },
      operations: ['Joint detention operations', 'Intelligence sharing'],
      victims: '300+ Chilean refugees detained/disappeared'
    },
    // Uruguay - Operation Condor partner
    uruguay: {
      name: { en: 'Uruguay', es: 'Uruguay', pt: 'Uruguai', de: 'Uruguay' },
      coords: { x: 330, y: 450 },
      type: 'condor_partner',
      details: {
        en: 'Operation Condor partner. Detention and torture of Chilean exiles.',
        es: 'Socio de Operación Cóndor. Detención y tortura de exiliados chilenos.',
        pt: 'Parceiro da Operação Condor. Detenção e tortura de exilados chilenos.',
        de: 'Operation Condor Partner. Inhaftierung und Folter chilenischer Exilanten.'
      },
      operations: ['Detention centers', 'Cross-border kidnappings']
    },
    // Paraguay - Operation Condor coordinator
    paraguay: {
      name: { en: 'Paraguay', es: 'Paraguay', pt: 'Paraguai', de: 'Paraguay' },
      coords: { x: 320, y: 430 },
      type: 'condor_coordinator',
      details: {
        en: 'Operation Condor coordination center (Stroessner regime).',
        es: 'Centro de coordinación de Operación Cóndor (régimen de Stroessner).',
        pt: 'Centro de coordenação da Operação Condor (regime Stroessner).',
        de: 'Operation Condor Koordinationszentrum (Stroessner-Regime).'
      },
      role: 'Intelligence coordination hub'
    },
    // Brazil - Operation Condor partner + Nazi refuge precedent
    brazil: {
      name: { en: 'Brazil', es: 'Brasil', pt: 'Brasil', de: 'Brasilien' },
      coords: { x: 360, y: 400 },
      type: 'condor_partner',
      details: {
        en: 'Operation Condor partner. Nazi refuge precedent (Stangl captured here 1967).',
        es: 'Socio de Operación Cóndor. Precedente de refugio nazi (Stangl capturado aquí 1967).',
        pt: 'Parceiro da Operação Condor. Precedente de refúgio nazista (Stangl capturado aqui 1967).',
        de: 'Operation Condor Partner. Nazi-Zufluchts-Präzedenzfall (Stangl hier 1967 festgenommen).'
      },
      precedent: 'Franz Stangl (Nazi) captured 1967 after 20-year Wiesenthal investigation'
    },
    // USA - Letelier assassination
    usa_dc: {
      name: { en: 'Washington DC, USA', es: 'Washington DC, EE.UU.', pt: 'Washington DC, EUA', de: 'Washington DC, USA' },
      coords: { x: 260, y: 250 },
      type: 'international_crime',
      details: {
        en: 'Letelier-Moffitt assassination (Sept 21, 1976). DINA car bomb attack on US soil.',
        es: 'Asesinato de Letelier-Moffitt (21 sept 1976). Ataque con coche bomba de DINA en suelo estadounidense.',
        pt: 'Assassinato de Letelier-Moffitt (21 set 1976). Ataque com carro-bomba da DINA em solo americano.',
        de: 'Letelier-Moffitt Attentat (21. Sept 1976). DINA Autobombenanschlag auf US-Boden.'
      },
      victims: ['Orlando Letelier', 'Ronnie Moffitt'],
      perpetrators: ['Manuel Contreras (convicted)', 'DINA agents']
    },
    // Israel - Eichmann precedent
    israel: {
      name: { en: 'Israel', es: 'Israel', pt: 'Israel', de: 'Israel' },
      coords: { x: 530, y: 280 },
      type: 'precedent',
      details: {
        en: 'Eichmann trial (1961). Established cross-border jurisdiction for crimes against humanity.',
        es: 'Juicio de Eichmann (1961). Estableció jurisdicción transfronteriza para crímenes de lesa humanidad.',
        pt: 'Julgamento de Eichmann (1961). Estabeleceu jurisdição transfronteiriça para crimes contra a humanidade.',
        de: 'Eichmann-Prozess (1961). Etablierte grenzüberschreitende Zuständigkeit für Verbrechen gegen die Menschlichkeit.'
      },
      significance: 'Legal precedent for prosecuting crimes against humanity decades later'
    },
    // Germany - Stangl trial precedent
    germany: {
      name: { en: 'Germany', es: 'Alemania', pt: 'Alemanha', de: 'Deutschland' },
      coords: { x: 480, y: 220 },
      type: 'precedent',
      details: {
        en: 'Stangl trial (1970). Wiesenthal\'s 20-year investigation led to conviction.',
        es: 'Juicio de Stangl (1970). Investigación de 20 años de Wiesenthal llevó a condena.',
        pt: 'Julgamento de Stangl (1970). Investigação de 20 anos de Wiesenthal levou à condenação.',
        de: 'Stangl-Prozess (1970). Wiesenthals 20-jährige Untersuchung führte zur Verurteilung.'
      },
      significance: 'Proves long-term documentation enables justice'
    }
  };

  useEffect(() => {
    drawMap();
  }, [language]);

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw simplified world map outline
    ctx.strokeStyle = '#1a1a3a';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#0f0f2a';

    // Americas outline (simplified)
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(250, 180);
    ctx.lineTo(280, 250);
    ctx.lineTo(260, 300);
    ctx.lineTo(280, 380);
    ctx.lineTo(300, 480);
    ctx.lineTo(280, 500);
    ctx.lineTo(250, 480);
    ctx.lineTo(230, 400);
    ctx.lineTo(210, 300);
    ctx.lineTo(190, 200);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Europe/Africa outline (simplified)
    ctx.beginPath();
    ctx.moveTo(440, 180);
    ctx.lineTo(520, 200);
    ctx.lineTo(540, 280);
    ctx.lineTo(520, 360);
    ctx.lineTo(480, 420);
    ctx.lineTo(440, 400);
    ctx.lineTo(420, 320);
    ctx.lineTo(430, 240);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Operation Condor connections (red lines)
    ctx.strokeStyle = 'rgba(255, 50, 50, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    // Chile to all Condor partners
    const chileCoords = locations.chile.coords;
    ['argentina', 'uruguay', 'paraguay', 'brazil'].forEach(country => {
      const coords = locations[country].coords;
      ctx.beginPath();
      ctx.moveTo(chileCoords.x, chileCoords.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    });

    // Chile to USA (Letelier operation)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(chileCoords.x, chileCoords.y);
    ctx.lineTo(locations.usa_dc.coords.x, locations.usa_dc.coords.y);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw location markers
    Object.entries(locations).forEach(([key, loc]) => {
      drawLocationMarker(ctx, loc);
    });

    // Draw legend
    drawLegend(ctx, width, height);
  };

  const drawLocationMarker = (ctx, location) => {
    const { x, y } = location.coords;

    // Color based on type
    const colors = {
      headquarters: '#ff0000',
      condor_partner: '#ff6600',
      condor_coordinator: '#ff9900',
      international_crime: '#cc0000',
      precedent: '#00ccff'
    };

    const color = colors[location.type] || '#ffffff';

    // Draw pulsing circle
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    // Outer glow
    ctx.fillStyle = color + '40';
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Courier New"';
    ctx.fillText(location.name[language] || location.name.en, x + 10, y - 10);
  };

  const drawLegend = (ctx, width, height) => {
    const legendX = 10;
    const legendY = height - 150;

    ctx.fillStyle = 'rgba(10, 10, 30, 0.9)';
    ctx.fillRect(legendX, legendY, 280, 140);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(legendX, legendY, 280, 140);

    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 14px "Courier New"';
    const title = {
      en: '🌍 OPERATION CONDOR NETWORK',
      es: '🌍 RED OPERACIÓN CÓNDOR',
      pt: '🌍 REDE OPERAÇÃO CONDOR',
      de: '🌍 OPERATION CONDOR NETZWERK'
    };
    ctx.fillText(title[language] || title.en, legendX + 10, legendY + 20);

    const legendItems = [
      { color: '#ff0000', label: { en: 'DINA HQ', es: 'Cuartel DINA', pt: 'QG DINA', de: 'DINA-HQ' } },
      { color: '#ff6600', label: { en: 'Condor Partner', es: 'Socio Cóndor', pt: 'Parceiro Condor', de: 'Condor Partner' } },
      { color: '#cc0000', label: { en: 'International Crime', es: 'Crimen Internacional', pt: 'Crime Internacional', de: 'Internationales Verbrechen' } },
      { color: '#00ccff', label: { en: 'Legal Precedent', es: 'Precedente Legal', pt: 'Precedente Legal', de: 'Rechtspräzedenz' } }
    ];

    legendItems.forEach((item, i) => {
      const y = legendY + 45 + (i * 22);

      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(legendX + 20, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px "Courier New"';
      ctx.fillText(item.label[language] || item.label.en, legendX + 35, y + 4);
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is near any location
    Object.entries(locations).forEach(([key, loc]) => {
      const dx = x - loc.coords.x;
      const dy = y - loc.coords.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 15) {
        setSelectedLocation({ key, ...loc });
      }
    });
  };

  const translations = {
    title: {
      en: '🌍 GLOBAL DINA OPERATIONS MAP',
      es: '🌍 MAPA GLOBAL DE OPERACIONES DINA',
      pt: '🌍 MAPA GLOBAL DE OPERAÇÕES DINA',
      de: '🌍 GLOBALE DINA-OPERATIONSKARTE'
    },
    subtitle: {
      en: 'Operation Condor International Death Squad Network (1975-1989)',
      es: 'Red Internacional de Escuadrones de la Muerte Operación Cóndor (1975-1989)',
      pt: 'Rede Internacional de Esquadrões da Morte Operação Condor (1975-1989)',
      de: 'Operation Condor Internationales Todesschwadron-Netzwerk (1975-1989)'
    },
    clickInstruction: {
      en: 'Click on markers to view details',
      es: 'Haz clic en los marcadores para ver detalles',
      pt: 'Clique nos marcadores para ver detalhes',
      de: 'Klicken Sie auf Markierungen, um Details anzuzeigen'
    }
  };

  return (
    <div className="global-threat-map">
      <div className="map-header">
        <h2>{translations.title[language]}</h2>
        <p className="map-subtitle">{translations.subtitle[language]}</p>
        <p className="map-instruction">{translations.clickInstruction[language]}</p>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onClick={handleCanvasClick}
        className="threat-map-canvas"
      />

      {selectedLocation && (
        <div className="location-details-panel">
          <button
            className="close-details"
            onClick={() => setSelectedLocation(null)}
          >
            ✕
          </button>
          <h3>{selectedLocation.name[language]}</h3>
          <p className="location-description">
            {selectedLocation.details[language]}
          </p>

          {selectedLocation.facilities && (
            <div className="detail-section">
              <strong>{language === 'es' ? 'Instalaciones:' : language === 'pt' ? 'Instalações:' : language === 'de' ? 'Einrichtungen:' : 'Facilities:'}</strong>
              <ul>
                {selectedLocation.facilities.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {selectedLocation.perpetrators && (
            <div className="detail-section">
              <strong>{language === 'es' ? 'Perpetradores:' : language === 'pt' ? 'Perpetradores:' : language === 'de' ? 'Täter:' : 'Perpetrators:'}</strong>
              <ul>
                {selectedLocation.perpetrators.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {selectedLocation.victims && (
            <div className="detail-section">
              <strong>{language === 'es' ? 'Víctimas:' : language === 'pt' ? 'Vítimas:' : language === 'de' ? 'Opfer:' : 'Victims:'}</strong>
              <p>{selectedLocation.victims}</p>
            </div>
          )}

          {selectedLocation.significance && (
            <div className="detail-section precedent-info">
              <strong>{language === 'es' ? 'Importancia:' : language === 'pt' ? 'Importância:' : language === 'de' ? 'Bedeutung:' : 'Significance:'}</strong>
              <p>{selectedLocation.significance}</p>
            </div>
          )}
        </div>
      )}

      <div className="map-footer">
        <p className="legal-note">
          ⚖️ {language === 'es' ? 'Jurisdicción Universal: Cualquier país puede procesar crímenes de lesa humanidad' :
               language === 'pt' ? 'Jurisdição Universal: Qualquer país pode processar crimes contra a humanidade' :
               language === 'de' ? 'Universelle Gerichtsbarkeit: Jedes Land kann Verbrechen gegen die Menschlichkeit verfolgen' :
               'Universal Jurisdiction: Any country can prosecute crimes against humanity'}
        </p>
      </div>
    </div>
  );
};

export default GlobalThreatMap;
