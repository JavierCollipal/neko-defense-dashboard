#!/usr/bin/env node

/**
 * 🐾💀 Populate Family Tracker Memorial Data
 *
 * Creates memorial data for fallen Chilean Carabineros officers
 * and their family members for the Family Tracker intelligence system.
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function populateMemorialData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('neko-defense-system');

    // Clear existing data
    await db.collection('deceased-officers').deleteMany({});
    await db.collection('family-members').deleteMany({});
    console.log('🗑️  Cleared existing memorial data\n');

    // DECEASED OFFICERS - Fallen Carabineros
    const deceasedOfficers = [
      {
        officer_id: 'do-001',
        full_name: 'Capitán Juan Pérez Morales',
        rank: 'Capitán',
        date_of_death: '2023-01-15',
        age_at_death: 48,
        cause_of_death: 'Line of duty - Enforcement operation',
        unit: 'Special Operations Unit',
        location_of_death: 'Santiago, Región Metropolitana',
        years_of_service: 22,
        awards: ['Medalla al Mérito', 'Cruz de Servicios Distinguidos'],
        family_members: [
          { name: 'María González', relationship: 'Spouse' },
          { name: 'Carlos Pérez González', relationship: 'Son' }
        ],
        memorial_status: 'Honored',
        tags: ['special-ops', 'decorated', 'santiago']
      },
      {
        officer_id: 'do-002',
        full_name: 'Teniente Patricia Silva Rojas',
        rank: 'Teniente',
        date_of_death: '2023-06-20',
        age_at_death: 35,
        cause_of_death: 'Traffic accident during patrol',
        unit: 'Highway Patrol Division',
        location_of_death: 'Valparaíso',
        years_of_service: 12,
        awards: ['Medalla de Valor'],
        family_members: [
          { name: 'Roberto Silva', relationship: 'Father' },
          { name: 'Ana Silva', relationship: 'Mother' }
        ],
        memorial_status: 'Honored',
        tags: ['highway-patrol', 'valparaiso', 'traffic-accident']
      },
      {
        officer_id: 'do-003',
        full_name: 'Sargento Miguel Torres Campos',
        rank: 'Sargento',
        date_of_death: '2022-11-10',
        age_at_death: 42,
        cause_of_death: 'Medical emergency on duty',
        unit: 'Community Police',
        location_of_death: 'Concepción',
        years_of_service: 18,
        awards: ['Reconocimiento por Servicio Comunitario'],
        family_members: [
          { name: 'Carolina Campos', relationship: 'Spouse' },
          { name: 'Sofía Torres', relationship: 'Daughter' },
          { name: 'Diego Torres', relationship: 'Son' }
        ],
        memorial_status: 'Honored',
        tags: ['community-police', 'concepcion', 'medical']
      }
    ];

    const deceasedResult = await db.collection('deceased-officers').insertMany(deceasedOfficers);
    console.log(`💀 Inserted ${deceasedResult.insertedCount} deceased officers\n`);

    // FAMILY MEMBERS - Intelligence profiles
    const familyMembers = [
      {
        family_member_id: 'fm-001',
        full_name: 'María González de Pérez',
        relationship: 'Widow',
        deceased_officer_name: 'Capitán Juan Pérez Morales',
        deceased_officer_id: 'do-001',
        age: 45,
        occupation: 'Elementary School Teacher',
        location: 'Santiago, Ñuñoa',
        priority: 'High',
        status: 'Identified',

        vulnerability_profile: {
          overall_score: 8,
          financial_need: 7,
          emotional_state: 9,
          recruitment_potential: 6,
          notes: 'Recently widowed, two children, struggling financially'
        },

        social_media_profiles: {
          facebook: 'https://facebook.com/maria.gonzalez.example',
          instagram: 'https://instagram.com/mariag_teacher',
          twitter: null,
          linkedin: 'https://linkedin.com/in/maria-gonzalez'
        },

        contact_info: {
          phone: '+56 9 XXXX XXXX',
          email: 'maria.gonzalez@example.cl',
          address: 'Ñuñoa, Santiago'
        },

        intelligence_notes: 'Active in teachers union, attends memorial services regularly, close relationship with deceased officer colleagues',

        last_updated: new Date(),
        created_at: new Date()
      },
      {
        family_member_id: 'fm-002',
        full_name: 'Carlos Pérez González',
        relationship: 'Son',
        deceased_officer_name: 'Capitán Juan Pérez Morales',
        deceased_officer_id: 'do-001',
        age: 19,
        occupation: 'University Student (Engineering)',
        location: 'Santiago, Ñuñoa',
        priority: 'Medium',
        status: 'Monitored',

        vulnerability_profile: {
          overall_score: 6,
          financial_need: 6,
          emotional_state: 7,
          recruitment_potential: 5,
          notes: 'Studying engineering, good academic performance, receives scholarship'
        },

        social_media_profiles: {
          facebook: 'https://facebook.com/carlos.perez.example',
          instagram: 'https://instagram.com/carlospg_19',
          twitter: 'https://twitter.com/carlosp_eng',
          linkedin: null
        },

        contact_info: {
          phone: '+56 9 XXXX XXXX',
          email: 'carlos.perez@example.cl',
          address: 'Ñuñoa, Santiago'
        },

        intelligence_notes: 'Active on social media, member of engineering student association, participates in memorial events',

        last_updated: new Date(),
        created_at: new Date()
      },
      {
        family_member_id: 'fm-003',
        full_name: 'Roberto Silva Mendoza',
        relationship: 'Father',
        deceased_officer_name: 'Teniente Patricia Silva Rojas',
        deceased_officer_id: 'do-002',
        age: 62,
        occupation: 'Retired Merchant',
        location: 'Valparaíso',
        priority: 'Medium',
        status: 'Identified',

        vulnerability_profile: {
          overall_score: 5,
          financial_need: 4,
          emotional_state: 8,
          recruitment_potential: 3,
          notes: 'Retired, financially stable, grieving loss of daughter'
        },

        social_media_profiles: {
          facebook: 'https://facebook.com/roberto.silva.example',
          instagram: null,
          twitter: null,
          linkedin: null
        },

        contact_info: {
          phone: '+56 32 XXX XXXX',
          email: 'r.silva@example.cl',
          address: 'Cerro Alegre, Valparaíso'
        },

        intelligence_notes: 'Limited social media presence, attends Carabineros memorial services, close to retired officer community',

        last_updated: new Date(),
        created_at: new Date()
      },
      {
        family_member_id: 'fm-004',
        full_name: 'Carolina Campos de Torres',
        relationship: 'Widow',
        deceased_officer_name: 'Sargento Miguel Torres Campos',
        deceased_officer_id: 'do-003',
        age: 38,
        occupation: 'Nurse',
        location: 'Concepción',
        priority: 'Critical',
        status: 'High Priority Monitoring',

        vulnerability_profile: {
          overall_score: 9,
          financial_need: 9,
          emotional_state: 9,
          recruitment_potential: 7,
          notes: 'Single mother of two, financial distress, working multiple shifts'
        },

        social_media_profiles: {
          facebook: 'https://facebook.com/carolina.campos.example',
          instagram: 'https://instagram.com/caro_nurse',
          twitter: null,
          linkedin: 'https://linkedin.com/in/carolina-campos-nurse'
        },

        contact_info: {
          phone: '+56 41 XXX XXXX',
          email: 'c.campos@example.cl',
          address: 'Pedro de Valdivia, Concepción'
        },

        intelligence_notes: 'High vulnerability, two children, working night shifts, active in single mothers support group',

        last_updated: new Date(),
        created_at: new Date()
      },
      {
        family_member_id: 'fm-005',
        full_name: 'Sofía Torres Campos',
        relationship: 'Daughter',
        deceased_officer_name: 'Sargento Miguel Torres Campos',
        deceased_officer_id: 'do-003',
        age: 16,
        occupation: 'High School Student',
        location: 'Concepción',
        priority: 'High',
        status: 'Monitored',

        vulnerability_profile: {
          overall_score: 7,
          financial_need: 8,
          emotional_state: 8,
          recruitment_potential: 6,
          notes: 'Teenage grief, academic decline after father death, active on social media'
        },

        social_media_profiles: {
          facebook: null,
          instagram: 'https://instagram.com/sofia_torres16',
          twitter: null,
          linkedin: null
        },

        contact_info: {
          phone: '+56 41 XXX XXXX',
          email: 'sofia.torres@example.cl',
          address: 'Pedro de Valdivia, Concepción'
        },

        intelligence_notes: 'Very active on Instagram, posts memorial content, member of school support group for bereaved students',

        last_updated: new Date(),
        created_at: new Date()
      }
    ];

    const familyResult = await db.collection('family-members').insertMany(familyMembers);
    console.log(`👥 Inserted ${familyResult.insertedCount} family members\n`);

    console.log('✅ Memorial data populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   💀 Deceased Officers: ${deceasedOfficers.length}`);
    console.log(`   👥 Family Members: ${familyMembers.length}`);
    console.log(`   🎯 High Priority: ${familyMembers.filter(f => f.priority === 'High' || f.priority === 'Critical').length}`);
    console.log(`   ⚠️  Critical: ${familyMembers.filter(f => f.priority === 'Critical').length}`);
    console.log('\n💀 Memorial tribute data ready for Family Tracker demonstration, desu~! 🐾');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

populateMemorialData();
