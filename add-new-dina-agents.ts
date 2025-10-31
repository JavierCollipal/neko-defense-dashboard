#!/usr/bin/env ts-node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

const newDINAAgents = [
  {
    agentId: "moren-brito-marcelo",
    fullName: "Marcelo Luis Manuel Moren Brito",
    codename: "El Ronco",
    alias: "El Coronta",
    role: "DINA Operations Chief & Villa Grimaldi Commander",
    rank: "Colonel (Chilean Army)",
    organization: ["DINA", "Chilean Army", "Brigada Caupolicán"],
    status: "DECEASED - CONVICTED",
    threatLevel: "HISTORICAL-DOCUMENTED",
    legalStatus: {
      convicted: true,
      currentStatus: "Died September 11, 2015 (age 80)",
      sentences: "Multiple convictions for kidnapping and forced disappearance",
      prisonLocation: "Died in Punta Peuco prison"
    },
    crimesAccused: [
      "Commander of Villa Grimaldi torture center",
      "Kidnapping (multiple counts)",
      "Forced Disappearance",
      "Torture",
      "Crimes Against Humanity"
    ],
    notableOperations: [
      "Villa Grimaldi torture operations",
      "Brigada Caupolicán commander",
      "DINA Chief of Operations"
    ],
    detentionCentersCommanded: ["Villa Grimaldi (Cuartel Terranova)"],
    tags: ["CONVICTED", "DECEASED", "VILLA GRIMALDI", "TORTURE CENTER COMMANDER"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "espinoza-pedro",
    fullName: "Pedro Octavio Espinoza Bravo",
    codename: "Don Rodrigo",
    role: "DINA Second-in-Command & Director of Operations",
    rank: "Brigadier General (Chilean Army)",
    organization: ["DINA", "Chilean Army"],
    status: "CONVICTED - IMPRISONED",
    threatLevel: "CONTAINED",
    legalStatus: {
      convicted: true,
      currentStatus: "SERVING SENTENCE",
      sentences: "Multiple convictions - Letelier assassination (6 years), Caravan of Death, Horman/Teruggi murders",
      prisonLocation: "Penal Punta Peuco, Chile"
    },
    crimesAccused: [
      "Orlando Letelier assassination (Washington DC, 1976)",
      "International terrorism",
      "Caravan of Death participation",
      "Murder of Charles Horman and Frank Teruggi",
      "Kidnapping",
      "Forced Disappearance",
      "Crimes Against Humanity"
    ],
    notableOperations: [
      "Letelier-Moffitt Assassination (USA, 1976)",
      "Caravan of Death",
      "DINA Director of Operations"
    ],
    tags: ["CONVICTED", "IMPRISONED", "INTERNATIONAL CRIMES", "LETELIER ASSASSINATION", "SECOND IN COMMAND"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "romo-osvaldo",
    fullName: "Osvaldo Enrique Romo Mena",
    codename: "El Guatón Romo",
    role: "DINA Torturer & Interrogator - Villa Grimaldi",
    organization: ["DINA", "Former Socialist Party (Usopo)"],
    status: "DECEASED - CONVICTED",
    threatLevel: "HISTORICAL-DOCUMENTED",
    legalStatus: {
      convicted: true,
      currentStatus: "Died July 2007 in Punta Peuco prison (age 69)",
      charges: "Author of 34 qualified kidnappings, co-author of 22, author of 14 torture cases",
      prisonLocation: "Died in Punta Peuco"
    },
    crimesAccused: [
      "Torture (extensive sadistic torture at Villa Grimaldi and Venda Sexy)",
      "Qualified Kidnapping (34 counts as author, 22 as co-author)",
      "Torture (14 documented cases)",
      "Forced Disappearance",
      "Dismantling MIR apparatus",
      "Psychological torture"
    ],
    psychologicalProfile: {
      diagnosis: "Documented psychopathic behavior",
      notableQuotes: "Lo haría igual y peor aún. Y no dejaría periquito vivo. (1995 TV interview)",
      behavioralPatterns: "Enjoyed extensive torture sessions, documented sadism"
    },
    notableOperations: [
      "Villa Grimaldi torture operations",
      "Venda Sexy torture operations",
      "MIR dismantling operations"
    ],
    detentionCentersWorked: ["Villa Grimaldi", "Londres 38", "Venda Sexy"],
    tags: ["DECEASED", "CONVICTED", "PSYCHOPATH", "SADISTIC TORTURER", "VILLA GRIMALDI", "VENDA SEXY"],
    addedToSystem: new Date().toISOString(),
    verified: true,
    legacy: "Left 48 notebooks with torture memoirs (restricted access at Parque por la Paz Villa Grimaldi)"
  },
  
  {
    agentId: "zapata-basclay",
    fullName: "Basclay Zapata Reyes",
    role: "DINA Agent - Villa Grimaldi",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    detentionCentersWorked: ["Villa Grimaldi"],
    tags: ["VILLA GRIMALDI", "DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "wenderoth-rolf",
    fullName: "Rolf Wenderoth Pozo",
    role: "DINA Agent - Villa Grimaldi",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    detentionCentersWorked: ["Villa Grimaldi"],
    tags: ["VILLA GRIMALDI", "DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "lauriani-fernando",
    fullName: "Fernando Lauriani Maturana",
    role: "DINA Agent - Villa Grimaldi",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    detentionCentersWorked: ["Villa Grimaldi"],
    tags: ["VILLA GRIMALDI", "DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "ferrer-francisco",
    fullName: "Francisco Ferrer Lima",
    role: "DINA Agent - Villa Grimaldi",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    detentionCentersWorked: ["Villa Grimaldi"],
    tags: ["VILLA GRIMALDI", "DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "ferrer-maximiliano",
    fullName: "Maximiliano Ferrer Lima",
    role: "DINA Agent",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    tags: ["DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "lawrence-ricardo",
    fullName: "Ricardo Lawrence",
    role: "DINA Agent",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    tags: ["DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "urrich-gerardo",
    fullName: "Gerardo Urrich",
    role: "DINA Agent",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    tags: ["DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "pacheco-conrado",
    fullName: "Conrado Pacheco",
    role: "DINA Agent",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    tags: ["DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  },
  
  {
    agentId: "alfaro-pedro",
    fullName: "Pedro Alfaro",
    role: "DINA Agent",
    organization: ["DINA"],
    status: "DOCUMENTED",
    threatLevel: "HISTORICAL",
    tags: ["DINA AGENT"],
    addedToSystem: new Date().toISOString(),
    verified: true
  }
];

async function addNewDINAAgents() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-defense-system');
    const dinaAgents = db.collection('dina-agents');

    // Check existing agents
    const existing = await dinaAgents.find({}).toArray();
    console.log(`\n📊 Existing DINA agents: ${existing.length}`);

    // Add new agents
    console.log(`\n🔄 Adding ${newDINAAgents.length} new DINA agents...`);
    
    for (const agent of newDINAAgents) {
      // Check if agent already exists
      const existingAgent = await dinaAgents.findOne({ agentId: agent.agentId });
      
      if (existingAgent) {
        console.log(`⚠️  Agent ${agent.fullName} already exists - SKIPPING`);
      } else {
        await dinaAgents.insertOne(agent);
        console.log(`✅ Added: ${agent.fullName} (${agent.role})`);
      }
    }

    // Get final count
    const finalCount = await dinaAgents.countDocuments();
    console.log(`\n✨ COMPLETE! Total DINA agents in database: ${finalCount}`);
    
    // Display all agents
    const allAgents = await dinaAgents.find({}).sort({ fullName: 1 }).toArray();
    console.log('\n👥 ALL DINA AGENTS IN DATABASE:');
    allAgents.forEach((agent: any, idx: number) => {
      console.log(`${idx + 1}. ${agent.fullName} - ${agent.role}`);
      console.log(`   Status: ${agent.status || 'DOCUMENTED'}`);
      console.log(`   Tags: ${(agent.tags || []).join(', ')}`);
    });

  } finally {
    await client.close();
  }
}

addNewDINAAgents();
