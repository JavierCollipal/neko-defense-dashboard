// 🐾⏰ DINA OPERATIONS TIMELINE - Historical Justice Visualization ⏰🐾
import React, { useState } from 'react';
import '../styles/DinaTimeline.css';

const DinaTimeline = ({ language = 'en' }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const timelineEvents = [
    {
      year: 1945,
      date: { en: 'May 1945', es: 'Mayo 1945', pt: 'Maio 1945', de: 'Mai 1945' },
      title: { en: 'Nazi Defeat', es: 'Derrota Nazi', pt: 'Derrota Nazista', de: 'Nazi-Niederlage' },
      description: {
        en: 'WWII ends. Nazi war criminals begin fleeing to South America.',
        es: 'Termina la WWII. Criminales de guerra nazis comienzan a huir a Sudamérica.',
        pt: 'Segunda Guerra termina. Criminais de guerra nazistas começam a fugir para a América do Sul.',
        de: 'Zweiter Weltkrieg endet. Nazi-Kriegsverbrecher fliehen nach Südamerika.'
      },
      type: 'precedent',
      icon: '🌍'
    },
    {
      year: 1947,
      date: { en: '1947', es: '1947', pt: '1947', de: '1947' },
      title: { en: 'Wiesenthal Begins Hunt', es: 'Wiesenthal Inicia Caza', pt: 'Wiesenthal Inicia Caça', de: 'Wiesenthal Beginnt Jagd' },
      description: {
        en: 'Simon Wiesenthal begins documentation of Nazi crimes. Methodology that would prove effective 80 years later.',
        es: 'Simon Wiesenthal comienza documentación de crímenes nazis. Metodología que demostraría efectividad 80 años después.',
        pt: 'Simon Wiesenthal começa documentação de crimes nazistas. Metodologia que provaria eficácia 80 anos depois.',
        de: 'Simon Wiesenthal beginnt Dokumentation von Nazi-Verbrechen. Methodik, die sich 80 Jahre später als wirksam erweisen würde.'
      },
      type: 'precedent',
      icon: '📚'
    },
    {
      year: 1961,
      date: { en: 'April 1961', es: 'Abril 1961', pt: 'Abril 1961', de: 'April 1961' },
      title: { en: 'Eichmann Trial', es: 'Juicio Eichmann', pt: 'Julgamento Eichmann', de: 'Eichmann-Prozess' },
      description: {
        en: 'Adolf Eichmann tried in Israel. Establishes cross-border jurisdiction for crimes against humanity.',
        es: 'Adolf Eichmann juzgado en Israel. Establece jurisdicción transfronteriza para crímenes de lesa humanidad.',
        pt: 'Adolf Eichmann julgado em Israel. Estabelece jurisdição transfronteiriça para crimes contra a humanidade.',
        de: 'Adolf Eichmann in Israel vor Gericht. Etabliert grenzüberschreitende Zuständigkeit für Verbrechen gegen die Menschlichkeit.'
      },
      type: 'precedent',
      icon: '⚖️',
      significance: { en: 'Legal basis for DINA prosecutions', es: 'Base legal para enjuiciamientos DINA', pt: 'Base legal para processos DINA', de: 'Rechtsgrundlage für DINA-Verfolgungen' }
    },
    {
      year: 1967,
      date: { en: 'February 1967', es: 'Febrero 1967', pt: 'Fevereiro 1967', de: 'Februar 1967' },
      title: { en: 'Stangl Captured', es: 'Stangl Capturado', pt: 'Stangl Capturado', de: 'Stangl Gefasst' },
      description: {
        en: 'Franz Stangl captured in Brazil after 20-year Wiesenthal investigation. Proves long-term documentation works.',
        es: 'Franz Stangl capturado en Brasil tras 20 años de investigación de Wiesenthal. Prueba que documentación a largo plazo funciona.',
        pt: 'Franz Stangl capturado no Brasil após 20 anos de investigação de Wiesenthal. Prova que documentação de longo prazo funciona.',
        de: 'Franz Stangl nach 20-jähriger Wiesenthal-Untersuchung in Brasilien gefasst. Beweist, dass Langzeitdokumentation funktioniert.'
      },
      type: 'precedent',
      icon: '🎯'
    },
    {
      year: 1973,
      date: { en: 'September 11, 1973', es: '11 de Septiembre 1973', pt: '11 de Setembro 1973', de: '11. September 1973' },
      title: { en: 'Pinochet Coup', es: 'Golpe de Pinochet', pt: 'Golpe de Pinochet', de: 'Pinochet-Putsch' },
      description: {
        en: 'Military coup overthrows Salvador Allende. Augusto Pinochet seizes power. Dictatorship begins.',
        es: 'Golpe militar derroca a Salvador Allende. Augusto Pinochet toma el poder. Comienza dictadura.',
        pt: 'Golpe militar derruba Salvador Allende. Augusto Pinochet toma o poder. Ditadura começa.',
        de: 'Militärputsch stürzt Salvador Allende. Augusto Pinochet ergreift die Macht. Diktatur beginnt.'
      },
      type: 'dina_operation',
      icon: '🔴',
      victims: '3,000+ killed in first months'
    },
    {
      year: 1974,
      date: { en: 'June 1974', es: 'Junio 1974', pt: 'Junho 1974', de: 'Juni 1974' },
      title: { en: 'DINA Created', es: 'DINA Creada', pt: 'DINA Criada', de: 'DINA Gegründet' },
      description: {
        en: 'Dirección de Inteligencia Nacional (DINA) officially established. Manuel Contreras appointed director.',
        es: 'Dirección de Inteligencia Nacional (DINA) oficialmente establecida. Manuel Contreras nombrado director.',
        pt: 'Direção de Inteligência Nacional (DINA) oficialmente estabelecida. Manuel Contreras nomeado diretor.',
        de: 'Dirección de Inteligencia Nacional (DINA) offiziell gegründet. Manuel Contreras zum Direktor ernannt.'
      },
      type: 'dina_operation',
      icon: '🏢',
      perpetrators: ['Manuel Contreras']
    },
    {
      year: 1975,
      date: { en: 'November 1975', es: 'Noviembre 1975', pt: 'Novembro 1975', de: 'November 1975' },
      title: { en: 'Operation Condor Launched', es: 'Operación Cóndor Lanzada', pt: 'Operação Condor Lançada', de: 'Operation Condor Gestartet' },
      description: {
        en: 'International death squad network established. Argentina, Chile, Uruguay, Paraguay, Brazil, Bolivia collaborate.',
        es: 'Red internacional de escuadrones de la muerte establecida. Argentina, Chile, Uruguay, Paraguay, Brasil, Bolivia colaboran.',
        pt: 'Rede internacional de esquadrões da morte estabelecida. Argentina, Chile, Uruguai, Paraguai, Brasil, Bolívia colaboram.',
        de: 'Internationales Todesschwadron-Netzwerk etabliert. Argentinien, Chile, Uruguay, Paraguay, Brasilien, Bolivien kooperieren.'
      },
      type: 'dina_operation',
      icon: '🦅',
      scope: 'International'
    },
    {
      year: 1976,
      date: { en: 'September 21, 1976', es: '21 de Septiembre 1976', pt: '21 de Setembro 1976', de: '21. September 1976' },
      title: { en: 'Letelier Assassination', es: 'Asesinato de Letelier', pt: 'Assassinato de Letelier', de: 'Letelier-Attentat' },
      description: {
        en: 'DINA car bomb kills Orlando Letelier and Ronnie Moffitt in Washington DC. Crime on US soil.',
        es: 'Coche bomba DINA mata a Orlando Letelier y Ronnie Moffitt en Washington DC. Crimen en suelo estadounidense.',
        pt: 'Carro-bomba DINA mata Orlando Letelier e Ronnie Moffitt em Washington DC. Crime em solo americano.',
        de: 'DINA-Autobombe tötet Orlando Letelier und Ronnie Moffitt in Washington DC. Verbrechen auf US-Boden.'
      },
      type: 'dina_operation',
      icon: '💥',
      victims: ['Orlando Letelier', 'Ronnie Moffitt'],
      location: 'Washington DC, USA'
    },
    {
      year: 1977,
      date: { en: 'August 1977', es: 'Agosto 1977', pt: 'Agosto 1977', de: 'August 1977' },
      title: { en: 'DINA Dissolved', es: 'DINA Disuelta', pt: 'DINA Dissolvida', de: 'DINA Aufgelöst' },
      description: {
        en: 'DINA officially dissolved due to international pressure. Replaced by CNI (same personnel, new name).',
        es: 'DINA oficialmente disuelta por presión internacional. Reemplazada por CNI (mismo personal, nuevo nombre).',
        pt: 'DINA oficialmente dissolvida por pressão internacional. Substituída pela CNI (mesmo pessoal, novo nome).',
        de: 'DINA offiziell aufgelöst aufgrund internationalen Drucks. Durch CNI ersetzt (gleiche Mitarbeiter, neuer Name).'
      },
      type: 'dina_operation',
      icon: '📋'
    },
    {
      year: 1990,
      date: { en: 'March 1990', es: 'Marzo 1990', pt: 'Março 1990', de: 'März 1990' },
      title: { en: 'Dictatorship Ends', es: 'Dictadura Termina', pt: 'Ditadura Termina', de: 'Diktatur Endet' },
      description: {
        en: 'Pinochet leaves power. Democracy restored. Investigations into human rights violations begin.',
        es: 'Pinochet deja el poder. Democracia restaurada. Investigaciones sobre violaciones de derechos humanos comienzan.',
        pt: 'Pinochet deixa o poder. Democracia restaurada. Investigações sobre violações de direitos humanos começam.',
        de: 'Pinochet verlässt die Macht. Demokratie wiederhergestellt. Untersuchungen zu Menschenrechtsverletzungen beginnen.'
      },
      type: 'prosecution',
      icon: '🕊️'
    },
    {
      year: 2002,
      date: { en: '2002', es: '2002', pt: '2002', de: '2002' },
      title: { en: 'Operation Last Chance', es: 'Operación Última Oportunidad', pt: 'Operação Última Chance', de: 'Operation Letzte Chance' },
      description: {
        en: 'Wiesenthal Center launches final push to prosecute aging Nazi war criminals. Proves prosecution possible 60+ years later.',
        es: 'Centro Wiesenthal lanza impulso final para enjuiciar criminales de guerra nazis envejecidos. Prueba que enjuiciamiento es posible 60+ años después.',
        pt: 'Centro Wiesenthal lança impulso final para processar criminosos de guerra nazistas idosos. Prova que processo é possível 60+ anos depois.',
        de: 'Wiesenthal-Zentrum startet finalen Vorstoß zur Verfolgung alternder Nazi-Kriegsverbrecher. Beweist Verfolgung möglich 60+ Jahre später.'
      },
      type: 'precedent',
      icon: '⏰',
      significance: { en: 'DINA crimes (52 years old) WELL WITHIN prosecution window', es: 'Crímenes DINA (52 años) BIEN DENTRO de ventana de enjuiciamiento', pt: 'Crimes DINA (52 anos) BEM DENTRO da janela de processo', de: 'DINA-Verbrechen (52 Jahre) GUT INNERHALB des Verfolgungsfensters' }
    },
    {
      year: 2005,
      date: { en: 'November 2005', es: 'Noviembre 2005', pt: 'Novembro 2005', de: 'November 2005' },
      title: { en: 'Contreras Convicted', es: 'Contreras Condenado', pt: 'Contreras Condenado', de: 'Contreras Verurteilt' },
      description: {
        en: 'Manuel Contreras convicted for Letelier assassination. Multiple convictions follow (500+ years total).',
        es: 'Manuel Contreras condenado por asesinato de Letelier. Múltiples condenas siguen (500+ años total).',
        pt: 'Manuel Contreras condenado por assassinato de Letelier. Múltiplas condenações seguem (500+ anos total).',
        de: 'Manuel Contreras wegen Letelier-Attentat verurteilt. Mehrere Verurteilungen folgen (500+ Jahre insgesamt).'
      },
      type: 'prosecution',
      icon: '⚖️',
      perpetrators: ['Manuel Contreras'],
      result: '500 years cumulative sentence'
    },
    {
      year: 2025,
      date: { en: '2025', es: '2025', pt: '2025', de: '2025' },
      title: { en: 'DINA Documentation System', es: 'Sistema de Documentación DINA', pt: 'Sistema de Documentação DINA', de: 'DINA-Dokumentationssystem' },
      description: {
        en: 'Neko-Arc DINA Documentation Archive launched. Applying Wiesenthal methodology to Chilean context.',
        es: 'Archivo de Documentación DINA Neko-Arc lanzado. Aplicando metodología Wiesenthal al contexto chileno.',
        pt: 'Arquivo de Documentação DINA Neko-Arc lançado. Aplicando metodologia Wiesenthal ao contexto chileno.',
        de: 'Neko-Arc DINA-Dokumentationsarchiv gestartet. Wiesenthal-Methodik auf chilenischen Kontext angewandt.'
      },
      type: 'prosecution',
      icon: '🐾',
      significance: { en: 'Current system - International hunt operation active', es: 'Sistema actual - Operación de caza internacional activa', pt: 'Sistema atual - Operação de caça internacional ativa', de: 'Aktuelles System - Internationale Jagdoperation aktiv' }
    }
  ];

  const translations = {
    title: {
      en: '⏰ DINA OPERATIONS TIMELINE',
      es: '⏰ LÍNEA DE TIEMPO OPERACIONES DINA',
      pt: '⏰ LINHA DO TEMPO OPERAÇÕES DINA',
      de: '⏰ DINA-OPERATIONSZEITLINIE'
    },
    subtitle: {
      en: 'From Nazi Precedents (1945) to Current Justice Operations (2025)',
      es: 'Desde Precedentes Nazis (1945) hasta Operaciones de Justicia Actuales (2025)',
      pt: 'Desde Precedentes Nazistas (1945) até Operações de Justiça Atuais (2025)',
      de: 'Von Nazi-Präzedenzfällen (1945) bis zu Aktuellen Justizoperationen (2025)'
    },
    yearsSpan: {
      en: '80 Years of Justice Documentation',
      es: '80 Años de Documentación de Justicia',
      pt: '80 Anos de Documentação de Justiça',
      de: '80 Jahre Justizdokumentation'
    }
  };

  const getEventClass = (type) => {
    const classes = {
      precedent: 'timeline-event precedent',
      dina_operation: 'timeline-event dina-op',
      prosecution: 'timeline-event prosecution'
    };
    return classes[type] || 'timeline-event';
  };

  return (
    <div className="dina-timeline">
      <div className="timeline-header">
        <h2>{translations.title[language]}</h2>
        <p className="timeline-subtitle">{translations.subtitle[language]}</p>
        <p className="timeline-span">{translations.yearsSpan[language]}</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>

        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={getEventClass(event.type)}
            onClick={() => setSelectedEvent(event)}
          >
            <div className="timeline-marker">
              <span className="event-icon">{event.icon}</span>
              <span className="event-year">{event.year}</span>
            </div>

            <div className="timeline-content">
              <h3>{event.title[language]}</h3>
              <p className="event-date">{event.date[language]}</p>
              <p className="event-description">{event.description[language]}</p>

              {event.victims && (
                <div className="event-detail victims">
                  <strong>Victims:</strong> {typeof event.victims === 'string' ? event.victims : event.victims.join(', ')}
                </div>
              )}

              {event.perpetrators && (
                <div className="event-detail perpetrators">
                  <strong>Perpetrators:</strong> {event.perpetrators.join(', ')}
                </div>
              )}

              {event.significance && (
                <div className="event-detail significance">
                  <strong>⚡</strong> {event.significance[language]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-footer">
        <p className="timeline-message">
          ⚖️ {language === 'es' ? 'El tiempo no borra los crímenes de lesa humanidad' :
               language === 'pt' ? 'O tempo não apaga crimes contra a humanidade' :
               language === 'de' ? 'Zeit löscht Verbrechen gegen die Menschlichkeit nicht aus' :
               'Time does not erase crimes against humanity'}
        </p>
        <p className="neko-signature">
          🐾 *purrs in historical justice* 😻⚖️
        </p>
      </div>
    </div>
  );
};

export default DinaTimeline;
