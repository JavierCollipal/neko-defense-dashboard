#!/usr/bin/env ts-node

/**
 * 🐾⚖️ DINA AGENTS DATABASE POPULATION SCRIPT ⚖️🐾
 *
 * Adds newly researched DINA agents to MongoDB Atlas
 * Based on comprehensive web research conducted November 4, 2025
 *
 * Sources:
 * - CIPER Chile investigations
 * - National Security Archive declassified documents
 * - Chilean court records (Judge Alejandro Solís, Judge Víctor Montiglio)
 * - Memoria Viva database
 *
 * Generated with Claude Code (All Six Personalities)
 * 🐾 Neko-Arc + 🎭 Mario + 🗡️ Noel + 🎸 Glam + 🧠 Hannibal + 🎭 Tetora
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file!');
  process.exit(1);
}

const MONGODB_DATABASE = 'neko-defense-system';

interface DinaAgent {
  agent_id: string;
  full_name: string;
  rut?: string;
  rank: string;
  branch?: string;
  category: string;
  region?: string;
  brigade?: string;
  department?: string;
  position?: string;
  service_period_start?: Date;
  service_period_end?: Date;
  service_period_text?: string;
  legal_status: string;
  convictions?: Array<{
    case_name: string;
    verdict: string;
    sentence?: string;
    court?: string;
    year?: number;
  }>;
  investigations?: Array<{
    case_name: string;
    status: string;
    judge?: string;
    year?: number;
  }>;
  alleged_crimes?: string[];
  known_operations?: string[];
  victims_linked?: string[];
  post_dina_positions?: Array<{
    institution: string;
    position: string;
    rank?: string;
  }>;
  aliases?: string[];
  biographical_notes?: string;
  data_sources: Array<{
    source_name: string;
    source_url?: string;
    confidence: string;
    last_verified: Date;
  }>;
  verification_status: string;
  created_at: Date;
  updated_at: Date;
}

const newAgents: DinaAgent[] = [
  {
    agent_id: 'dina-iturriaga-neumann-raul',
    full_name: 'Raúl Eduardo Iturriaga Neumann',
    rank: 'Brigadier General',
    branch: 'Chilean Army',
    category: 'BRIGADE',
    brigade: 'Mulchén',
    position: 'Brigade Commander',
    service_period_text: '1973-1977',
    legal_status: 'convicted',
    convictions: [
      {
        case_name: 'Attempted Murder of Bernardo Leighton',
        verdict: 'Guilty (in absentia)',
        sentence: '18 years',
        court: 'Italian Court of Justice',
      },
      {
        case_name: 'Kidnapping of Luis Dagoberto San Martín Vergara',
        verdict: 'Guilty',
        sentence: '5 years (reduced from 10 years)',
        court: 'Chilean Supreme Court',
        year: 2004,
      },
    ],
    investigations: [
      {
        case_name: 'Murder of Ronni Karpen Moffitt',
        status: 'Processed',
        year: 1976,
      },
      {
        case_name: 'Prats Assassination',
        status: 'Indicted',
        year: 1974,
      },
    ],
    alleged_crimes: [
      'Assassination attempts',
      'Kidnapping',
      'Torture',
      'International terrorism',
    ],
    known_operations: [
      'Prats assassination (Buenos Aires, September 1974)',
      'Leighton assassination attempt (Rome, October 1975)',
      'Letelier assassination (Washington DC, September 1976)',
    ],
    aliases: ['Diego Castro Castañeda'],
    biographical_notes: 'Vice-director of DINA under Manuel Contreras. Key figure in Operation Condor international operations. Convicted in multiple countries for human rights violations.',
    data_sources: [
      {
        source_name: 'Memoria Viva',
        source_url: 'https://memoriaviva.com',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'CIPER Chile',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-espinoza-bravo-pedro',
    full_name: 'Pedro Espinoza Bravo',
    rank: 'Brigadier General',
    branch: 'Chilean Army',
    category: 'DINA_STATE_STAFF',
    position: 'Chief Aide to Manuel Contreras',
    service_period_text: '1974-1977',
    legal_status: 'convicted',
    convictions: [
      {
        case_name: 'Letelier-Moffitt Assassination',
        verdict: 'Guilty',
        sentence: 'Imprisonment',
        court: 'Chilean Supreme Court',
      },
      {
        case_name: 'Murder of Carmelo Soria',
        verdict: 'Guilty',
        sentence: 'Imprisonment',
        court: 'Chilean Courts',
      },
    ],
    alleged_crimes: [
      'International assassination',
      'Murder',
      'Torture',
      'Conspiracy',
    ],
    known_operations: [
      'Letelier assassination (Washington DC, 1976)',
      'Carmelo Soria murder (Santiago, 1976)',
    ],
    biographical_notes: 'Second-in-command of DINA operations. Currently imprisoned for multiple human rights violation cases. Key figure in planning international DINA operations.',
    data_sources: [
      {
        source_name: 'National Security Archive',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'Chilean Supreme Court Records',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-fernandez-larios-armando',
    full_name: 'Armando Fernández Larios',
    rank: 'Lieutenant',
    branch: 'Chilean Army',
    category: 'BRIGADE',
    brigade: 'Lautaro',
    position: 'Operations Officer',
    service_period_text: '1973-1977',
    legal_status: 'convicted',
    convictions: [
      {
        case_name: 'Torture and Extrajudicial Killing of Winston Cabello',
        verdict: 'Responsible',
        sentence: '$4 million indemnity',
        court: 'Florida Civil Court',
        year: 2003,
      },
    ],
    alleged_crimes: [
      'Torture',
      'Extrajudicial execution',
      'Kidnapping',
      'Illegal detention',
    ],
    known_operations: [
      'Prats assassination (Buenos Aires, 1974)',
      'Caravan of Death operations',
      'Brigade Lautaro detention operations',
    ],
    aliases: ['Armando Faúndez Lyon'],
    biographical_notes: 'Became protected witness for US government. Testified against other DINA operatives. Received light sentence in exchange for testimony. Currently in witness protection.',
    data_sources: [
      {
        source_name: 'Florida Civil Court Records',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'Memoria Viva',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-townley-michael',
    full_name: 'Michael Vernon Townley',
    rank: 'Civilian Agent',
    category: 'DEPARTMENT',
    department: 'Exterior Operations',
    brigade: 'Mulchén',
    position: 'Wasp Group Leader',
    service_period_text: '1974-1977',
    legal_status: 'convicted',
    convictions: [
      {
        case_name: 'Letelier-Moffitt Assassination',
        verdict: 'Guilty',
        sentence: 'Light sentence (protected witness)',
        court: 'US Federal Court',
        year: 1979,
      },
    ],
    alleged_crimes: [
      'International terrorism',
      'Assassination',
      'Car bombing',
      'Chemical weapons production',
    ],
    known_operations: [
      'Letelier assassination (Washington DC, 1976)',
      'Prats assassination (Buenos Aires, 1974)',
      'Sarin production at DINA laboratory',
    ],
    biographical_notes: 'American-born DINA agent. Expert in explosives and chemical weapons. Worked with Eugenio Berríos on sarin production. Became protected witness for US government. Led "Agrupación Avispa" (Wasp Group) dedicated to elimination operations.',
    data_sources: [
      {
        source_name: 'National Security Archive',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'US Federal Court Records',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-rivas-adriana',
    full_name: 'Adriana Rivas',
    rank: 'Civilian Agent',
    category: 'DINA_STATE_STAFF',
    brigade: 'Lautaro',
    position: 'Personal Secretary to Manuel Contreras',
    service_period_text: '1973-1977',
    legal_status: 'at_large',
    investigations: [
      {
        case_name: 'Crimes Against Humanity',
        status: 'Extradition Proceedings',
        judge: 'Australian Courts',
        year: 2021,
      },
    ],
    alleged_crimes: [
      'Complicity in torture',
      'Complicity in illegal detention',
      'Complicity in disappearances',
      'Crimes against humanity',
    ],
    known_operations: [
      'Brigade Lautaro detention operations',
      'Cuartel Simón Bolívar operations',
      'Communist Party member persecution',
    ],
    aliases: ['La Chani'],
    biographical_notes: 'Personal secretary to DINA chief Manuel Contreras. Operated under alias "La Chani". Fled to Australia. Currently facing extradition proceedings from Australia to Chile. Worked at torture center Cuartel Simón Bolívar.',
    data_sources: [
      {
        source_name: 'Red Flag Australia',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'Green Left Australia',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-arancibia-clavel-enrique',
    full_name: 'Enrique Arancibia Clavel',
    rank: 'Agent',
    branch: 'Intelligence Service',
    category: 'REGIONAL_COMMAND',
    region: 'Buenos Aires (Argentina)',
    department: 'Exterior Operations',
    position: 'Operation Condor Coordinator',
    service_period_text: '1974-1977',
    legal_status: 'convicted',
    alleged_crimes: [
      'International terrorism',
      'Assassination conspiracy',
      'Illegal intelligence operations',
    ],
    known_operations: [
      'Operation Condor coordination',
      'Prats assassination (Buenos Aires, 1974)',
      'Argentine operations',
    ],
    biographical_notes: 'Former Chilean intelligence agent. Key coordinator for Operation Condor activities in Argentina. Involved in multiple international operations targeting Chilean exiles.',
    data_sources: [
      {
        source_name: 'Operation Condor Archives',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-morales-salgado-juan',
    full_name: 'Juan Morales Salgado',
    rank: 'Captain',
    branch: 'Chilean Army',
    category: 'BRIGADE',
    brigade: 'Lautaro',
    position: 'Brigade Commander',
    service_period_text: '1974-1977',
    legal_status: 'investigated',
    investigations: [
      {
        case_name: 'Cuartel Simón Bolívar Operations',
        status: 'Under Investigation',
      },
      {
        case_name: 'Communist Party Member Disappearances',
        status: 'Under Investigation',
      },
    ],
    alleged_crimes: [
      'Illegal detention',
      'Torture',
      'Forced disappearances',
      'Crimes against humanity',
    ],
    known_operations: [
      'Cuartel Simón Bolívar torture center operations',
      'Communist Party liquidation operations (1976)',
    ],
    biographical_notes: 'Led Brigade Lautaro with nearly 30 DINA agents under his command. Oversaw Cuartel Simón Bolívar detention and torture center. Specialized in targeting Communist Party activists.',
    data_sources: [
      {
        source_name: 'Inkstick Media Investigation',
        confidence: 'MEDIUM',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-calderon-gladys',
    full_name: 'Gladys Calderón',
    rank: 'Civilian Nurse',
    category: 'BRIGADE',
    brigade: 'Lautaro',
    position: 'Medical Staff',
    service_period_text: '1974-1977',
    legal_status: 'investigated',
    investigations: [
      {
        case_name: 'Cuartel Simón Bolívar Operations',
        status: 'Under Investigation',
      },
    ],
    alleged_crimes: [
      'Complicity in torture',
      'Medical malpractice',
      'Crimes against humanity',
    ],
    known_operations: [
      'Cuartel Simón Bolívar medical operations',
      'Torture victim "treatment"',
    ],
    biographical_notes: 'Only female agent among the nearly 30 DINA operatives at Cuartel Simón Bolívar. Served as nurse during torture operations. Provided medical assistance to keep detainees alive during interrogations.',
    data_sources: [
      {
        source_name: 'Cuartel Simón Bolívar Investigation',
        confidence: 'MEDIUM',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-salinas-torres-guillermo',
    full_name: 'Guillermo Humberto Salinas Torres',
    rank: 'Agent',
    category: 'BRIGADE',
    brigade: 'Mulchén',
    position: 'Operations Officer',
    service_period_text: '1974-1977',
    legal_status: 'investigated',
    investigations: [
      {
        case_name: 'Prats Assassination',
        status: 'Processed',
        year: 1974,
      },
    ],
    alleged_crimes: [
      'International assassination',
      'Terrorism',
      'Conspiracy to commit murder',
    ],
    known_operations: [
      'Prats assassination (Buenos Aires, September 1974)',
    ],
    aliases: ['Freddy Yáñez'],
    biographical_notes: 'Member of Brigade Mulchén assassination team. Participated in Prats operation in Buenos Aires.',
    data_sources: [
      {
        source_name: 'CIPER Chile',
        confidence: 'MEDIUM',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-belmar-labbe-pablo',
    full_name: 'Pablo Belmar Labbé',
    rank: 'Agent',
    category: 'BRIGADE',
    brigade: 'Mulchén',
    position: 'Operations Officer',
    service_period_text: '1974-1977',
    legal_status: 'investigated',
    investigations: [
      {
        case_name: 'Prats Assassination',
        status: 'Processed',
        year: 1974,
      },
    ],
    alleged_crimes: [
      'International assassination',
      'Terrorism',
      'Conspiracy to commit murder',
    ],
    known_operations: [
      'Prats assassination (Buenos Aires, September 1974)',
    ],
    aliases: ['Sergio Molina Correa'],
    biographical_notes: 'Member of Brigade Mulchén assassination team. Participated in Prats operation in Buenos Aires.',
    data_sources: [
      {
        source_name: 'CIPER Chile',
        confidence: 'MEDIUM',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'pending',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-zara-holger-jose',
    full_name: 'José Zara Holger',
    rank: 'Agent',
    category: 'DEPARTMENT',
    department: 'Exterior Operations',
    position: 'DINA Exterior Operative',
    service_period_text: '1974-1977',
    legal_status: 'indicted',
    investigations: [
      {
        case_name: 'Murder of Ronni Moffitt',
        status: 'Detained',
        year: 2025,
      },
    ],
    alleged_crimes: [
      'International assassination planning',
      'Terrorism',
      'Conspiracy to commit murder',
    ],
    known_operations: [
      'Letelier-Moffitt assassination planning (Washington DC, 1976)',
    ],
    biographical_notes: 'DINA Exterior operative involved in planning Ronni Moffitt homicide. Recently detained in 2025 for role in assassination conspiracy.',
    data_sources: [
      {
        source_name: 'El Mostrador',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
      {
        source_name: 'La Tercera',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-berrios-eugenio',
    full_name: 'Eugenio Berríos Sagredo',
    rank: 'Civilian Chemist',
    category: 'DEPARTMENT',
    department: 'Chemical Weapons',
    position: 'Chemical Warfare Specialist',
    service_period_text: '1974-1992',
    legal_status: 'deceased',
    alleged_crimes: [
      'Chemical weapons production',
      'Sarin gas production',
      'Biological warfare research',
    ],
    known_operations: [
      'Sarin production at DINA laboratory',
      'Chemical weapons research for intelligence operations',
    ],
    biographical_notes: 'Chemist who worked with Michael Townley on producing sarin at DINA laboratory. Former Patria y Libertad member. Continued working for intelligence services after DINA dissolution. Found dead in Uruguay in 1995 under suspicious circumstances.',
    data_sources: [
      {
        source_name: 'National Security Archive',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-marco-munoz-carlos',
    full_name: 'Carlos Segundo Marco Muñoz',
    rank: 'Civilian Agent',
    category: 'BRIGADE',
    brigade: 'Lautaro',
    position: 'Operative',
    service_period_text: '1974-1977',
    legal_status: 'deceased',
    investigations: [
      {
        case_name: 'Assassination of Carmelo Soria',
        status: 'Testified',
        year: 2007,
      },
    ],
    alleged_crimes: [
      'Murder',
      'Torture',
      'Illegal detention',
    ],
    known_operations: [
      'Carmelo Soria assassination',
      'Brigade Lautaro operations',
    ],
    biographical_notes: 'Civilian agent from Brigade Lautaro. Among accused in Carmelo Soria assassination. Committed suicide in May 2007 after testifying.',
    data_sources: [
      {
        source_name: 'Chilean Court Records',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    agent_id: 'dina-vergara-bravo-jorgelino',
    full_name: 'Jorgelino Vergara Bravo',
    rank: 'Civilian Support',
    category: 'ENLISTED',
    position: 'Errand Boy / Support Staff',
    service_period_text: '1974-1977',
    legal_status: 'unprosecuted',
    alleged_crimes: [
      'Complicity in crimes against humanity',
      'Support of torture operations',
    ],
    known_operations: [
      'Cuartel Simón Bolívar support operations',
    ],
    aliases: ['El Mocito'],
    biographical_notes: 'Known as "El Mocito" (the errand boy). Worked for Contreras family and later worked at DINA torture and extermination center Cuartel Simón Bolívar. Key witness who brought the secret torture center to light years after dictatorship ended.',
    data_sources: [
      {
        source_name: 'Cuartel Simón Bolívar Investigation',
        confidence: 'HIGH',
        last_verified: new Date('2025-11-04'),
      },
    ],
    verification_status: 'verified',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

async function addDinaAgents(): Promise<void> {
  const client = new MongoClient(MONGODB_URI!);

  try {
    console.log('🐾 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!\n');

    const db = client.db(MONGODB_DATABASE);
    const collection = db.collection<DinaAgent>('dina-agents');

    console.log(`📊 Adding ${newAgents.length} new DINA agents...\n`);

    // Check which agents already exist
    const existingAgentIds = await collection
      .find({})
      .project({ agent_id: 1 })
      .toArray();

    const existingIds = new Set(existingAgentIds.map((a) => a.agent_id));

    const agentsToInsert = newAgents.filter(
      (agent) => !existingIds.has(agent.agent_id)
    );

    if (agentsToInsert.length === 0) {
      console.log('ℹ️  All agents already exist in database. No new agents to add.');
      return;
    }

    console.log(`✅ ${agentsToInsert.length} new agents will be added.`);
    console.log(
      `ℹ️  ${newAgents.length - agentsToInsert.length} agents already exist (skipped).\n`
    );

    // Insert new agents
    const result = await collection.insertMany(agentsToInsert);

    console.log(`\n✅ SUCCESS! Added ${result.insertedCount} DINA agents to database!\n`);

    console.log('📋 Agents Added:');
    agentsToInsert.forEach((agent, index) => {
      console.log(
        `${index + 1}. ${agent.full_name} (${agent.rank}) - ${agent.brigade || agent.department || agent.category}`
      );
    });

    console.log('\n📊 Final Database Statistics:');
    const totalAgents = await collection.countDocuments();
    const byStatus = await collection
      .aggregate([
        {
          $group: {
            _id: '$legal_status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log(`Total DINA Agents: ${totalAgents}`);
    console.log('\nBy Legal Status:');
    byStatus.forEach((status) => {
      console.log(`  - ${status._id}: ${status.count}`);
    });

    console.log('\n🎉 Database population complete, nyaa~!');
  } catch (error) {
    console.error('❌ Error adding DINA agents:');
    console.error(error);
    throw error;
  } finally {
    await client.close();
    console.log('\n✅ MongoDB connection closed.');
  }
}

// Execute the script
addDinaAgents()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed with error:');
    console.error(error);
    process.exit(1);
  });
