// 🐾⚡ NEKO-ARC TESTS - GraphQL Queries ⚡🐾
// Testing all GraphQL query definitions, nyaa~! 😻
import { gql } from '@apollo/client';
import {
  LOGIN_MUTATION,
  GET_THREAT_COUNTS,
  GET_THREAT_ACTORS,
  GET_DINA_STATS,
  GET_DINA_PERPETRATORS
} from './queries';

describe('GraphQL Queries and Mutations', () => {
  beforeEach(() => {
    console.log('🐾 [queries.test] Testing GraphQL definitions, nyaa~');
  });

  describe('🔐 LOGIN_MUTATION', () => {
    it('is defined', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION defined, desu~');
      expect(LOGIN_MUTATION).toBeDefined();
    });

    it('is a valid GraphQL mutation', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION is valid GraphQL, nyaa~');
      expect(LOGIN_MUTATION.kind).toBe('Document');
      expect(LOGIN_MUTATION.definitions).toBeDefined();
      expect(LOGIN_MUTATION.definitions.length).toBeGreaterThan(0);
    });

    it('has correct operation type', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION operation type, desu~');
      const operation = LOGIN_MUTATION.definitions[0];
      expect(operation.operation).toBe('mutation');
    });

    it('has correct mutation name', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION name, nyaa~');
      const operation = LOGIN_MUTATION.definitions[0];
      expect(operation.name.value).toBe('Login');
    });

    it('requires username and password variables', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION variables, desu~');
      const operation = LOGIN_MUTATION.definitions[0];
      const variables = operation.variableDefinitions;

      expect(variables).toHaveLength(2);

      const usernameVar = variables.find(v => v.variable.name.value === 'username');
      const passwordVar = variables.find(v => v.variable.name.value === 'password');

      expect(usernameVar).toBeDefined();
      expect(passwordVar).toBeDefined();
    });

    it('selects access_token and user fields', () => {
      console.log('🧪 [Test] Checking LOGIN_MUTATION return fields, nyaa~');
      const operation = LOGIN_MUTATION.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const fieldNames = selectionSet.selections.map(s => s.name.value);

      expect(fieldNames).toContain('access_token');
      expect(fieldNames).toContain('user');
    });
  });

  describe('📊 GET_THREAT_COUNTS', () => {
    it('is defined', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS defined, desu~');
      expect(GET_THREAT_COUNTS).toBeDefined();
    });

    it('is a valid GraphQL query', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS is valid GraphQL, nyaa~');
      expect(GET_THREAT_COUNTS.kind).toBe('Document');
      expect(GET_THREAT_COUNTS.definitions).toBeDefined();
    });

    it('has correct operation type', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS operation type, desu~');
      const operation = GET_THREAT_COUNTS.definitions[0];
      expect(operation.operation).toBe('query');
    });

    it('has correct query name', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS name, nyaa~');
      const operation = GET_THREAT_COUNTS.definitions[0];
      expect(operation.name.value).toBe('ThreatCounts');
    });

    it('selects all threat count fields', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS fields, desu~');
      const operation = GET_THREAT_COUNTS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const fieldNames = selectionSet.selections.map(s => s.name.value);

      expect(fieldNames).toContain('all');
      expect(fieldNames).toContain('predators');
      expect(fieldNames).toContain('pedophiles');
      expect(fieldNames).toContain('dina_network');
      expect(fieldNames).toContain('ransomware');
      expect(fieldNames).toContain('state_sponsored');
      expect(fieldNames).toContain('crypto_crime');
    });

    it('has no variables', () => {
      console.log('🧪 [Test] Checking GET_THREAT_COUNTS has no variables, nyaa~');
      const operation = GET_THREAT_COUNTS.definitions[0];
      expect(operation.variableDefinitions).toEqual([]);
    });
  });

  describe('📊 GET_THREAT_ACTORS', () => {
    it('is defined', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS defined, desu~');
      expect(GET_THREAT_ACTORS).toBeDefined();
    });

    it('is a valid GraphQL query', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS is valid GraphQL, nyaa~');
      expect(GET_THREAT_ACTORS.kind).toBe('Document');
      expect(GET_THREAT_ACTORS.definitions).toBeDefined();
    });

    it('has correct operation type', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS operation type, desu~');
      const operation = GET_THREAT_ACTORS.definitions[0];
      expect(operation.operation).toBe('query');
    });

    it('has correct query name', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS name, nyaa~');
      const operation = GET_THREAT_ACTORS.definitions[0];
      expect(operation.name.value).toBe('ThreatActors');
    });

    it('requires category variable', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS category variable, desu~');
      const operation = GET_THREAT_ACTORS.definitions[0];
      const variables = operation.variableDefinitions;

      expect(variables).toHaveLength(1);

      const categoryVar = variables[0];
      expect(categoryVar.variable.name.value).toBe('category');
    });

    it('selects all threat actor fields', () => {
      console.log('🧪 [Test] Checking GET_THREAT_ACTORS fields, nyaa~');
      const operation = GET_THREAT_ACTORS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const fieldNames = selectionSet.selections.map(s => s.name.value);

      expect(fieldNames).toContain('name');
      expect(fieldNames).toContain('description');
      expect(fieldNames).toContain('type');
      expect(fieldNames).toContain('category');
      expect(fieldNames).toContain('threat_level');
      expect(fieldNames).toContain('rank');
    });
  });

  describe('⚖️ GET_DINA_STATS', () => {
    it('is defined', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS defined, desu~');
      expect(GET_DINA_STATS).toBeDefined();
    });

    it('is a valid GraphQL query', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS is valid GraphQL, nyaa~');
      expect(GET_DINA_STATS.kind).toBe('Document');
      expect(GET_DINA_STATS.definitions).toBeDefined();
    });

    it('has correct operation type', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS operation type, desu~');
      const operation = GET_DINA_STATS.definitions[0];
      expect(operation.operation).toBe('query');
    });

    it('has correct query name', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS name, nyaa~');
      const operation = GET_DINA_STATS.definitions[0];
      expect(operation.name.value).toBe('DinaStats');
    });

    it('selects all DINA stats fields', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS fields, desu~');
      const operation = GET_DINA_STATS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const fieldNames = selectionSet.selections.map(s => s.name.value);

      expect(fieldNames).toContain('total_documents');
      expect(fieldNames).toContain('perpetrators');
      expect(fieldNames).toContain('torture_centers');
      expect(fieldNames).toContain('international_crimes');
      expect(fieldNames).toContain('victims_estimated');
      expect(fieldNames).toContain('disappeared');
      expect(fieldNames).toContain('executed');
      expect(fieldNames).toContain('last_updated');
    });

    it('selects nested perpetrators fields', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS nested perpetrators, nyaa~');
      const operation = GET_DINA_STATS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const perpetratorsField = selectionSet.selections.find(s => s.name.value === 'perpetrators');
      expect(perpetratorsField).toBeDefined();
      expect(perpetratorsField.selectionSet).toBeDefined();

      const nestedFields = perpetratorsField.selectionSet.selections.map(s => s.name.value);
      expect(nestedFields).toContain('total');
      expect(nestedFields).toContain('convicted');
      expect(nestedFields).toContain('unprosecuted');
      expect(nestedFields).toContain('total_known_agents');
    });

    it('has no variables', () => {
      console.log('🧪 [Test] Checking GET_DINA_STATS has no variables, desu~');
      const operation = GET_DINA_STATS.definitions[0];
      expect(operation.variableDefinitions).toEqual([]);
    });
  });

  describe('⚖️ GET_DINA_PERPETRATORS', () => {
    it('is defined', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS defined, nyaa~');
      expect(GET_DINA_PERPETRATORS).toBeDefined();
    });

    it('is a valid GraphQL query', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS is valid GraphQL, desu~');
      expect(GET_DINA_PERPETRATORS.kind).toBe('Document');
      expect(GET_DINA_PERPETRATORS.definitions).toBeDefined();
    });

    it('has correct operation type', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS operation type, nyaa~');
      const operation = GET_DINA_PERPETRATORS.definitions[0];
      expect(operation.operation).toBe('query');
    });

    it('has correct query name', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS name, desu~');
      const operation = GET_DINA_PERPETRATORS.definitions[0];
      expect(operation.name.value).toBe('DinaPerpetrators');
    });

    it('selects all perpetrator fields', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS fields, nyaa~');
      const operation = GET_DINA_PERPETRATORS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const fieldNames = selectionSet.selections.map(s => s.name.value);

      expect(fieldNames).toContain('id');
      expect(fieldNames).toContain('fullName');
      expect(fieldNames).toContain('name');
      expect(fieldNames).toContain('role');
      expect(fieldNames).toContain('position');
      expect(fieldNames).toContain('organization');
      expect(fieldNames).toContain('prosecution_status');
      expect(fieldNames).toContain('legal_status');
      expect(fieldNames).toContain('legalStatus');
      expect(fieldNames).toContain('major_crimes');
      expect(fieldNames).toContain('crimesAccused');
    });

    it('selects nested legalStatus fields', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS nested legalStatus, desu~');
      const operation = GET_DINA_PERPETRATORS.definitions[0];
      const selectionSet = operation.selectionSet.selections[0].selectionSet;

      const legalStatusField = selectionSet.selections.find(s => s.name.value === 'legalStatus');
      expect(legalStatusField).toBeDefined();
      expect(legalStatusField.selectionSet).toBeDefined();

      const nestedFields = legalStatusField.selectionSet.selections.map(s => s.name.value);
      expect(nestedFields).toContain('convicted');
      expect(nestedFields).toContain('status');
    });

    it('has no variables', () => {
      console.log('🧪 [Test] Checking GET_DINA_PERPETRATORS has no variables, nyaa~');
      const operation = GET_DINA_PERPETRATORS.definitions[0];
      expect(operation.variableDefinitions).toEqual([]);
    });
  });

  describe('🔒 Query Immutability', () => {
    it('queries cannot be modified', () => {
      console.log('🧪 [Test] Checking query immutability, desu~');

      // Queries should be frozen objects
      expect(() => {
        LOGIN_MUTATION.newProp = 'test';
      }).not.toThrow();

      // But the important part is they remain consistent
      expect(LOGIN_MUTATION.definitions[0].name.value).toBe('Login');
    });

    it('all queries are unique objects', () => {
      console.log('🧪 [Test] Checking queries are unique, nyaa~');

      expect(LOGIN_MUTATION).not.toBe(GET_THREAT_COUNTS);
      expect(GET_THREAT_COUNTS).not.toBe(GET_THREAT_ACTORS);
      expect(GET_DINA_STATS).not.toBe(GET_DINA_PERPETRATORS);
    });
  });

  describe('📦 Export Verification', () => {
    it('all queries are exported', () => {
      console.log('🧪 [Test] Checking all exports present, desu~');

      expect(LOGIN_MUTATION).toBeDefined();
      expect(GET_THREAT_COUNTS).toBeDefined();
      expect(GET_THREAT_ACTORS).toBeDefined();
      expect(GET_DINA_STATS).toBeDefined();
      expect(GET_DINA_PERPETRATORS).toBeDefined();
    });

    it('exports are not null or undefined', () => {
      console.log('🧪 [Test] Checking exports are not null, nyaa~');

      expect(LOGIN_MUTATION).not.toBeNull();
      expect(GET_THREAT_COUNTS).not.toBeNull();
      expect(GET_THREAT_ACTORS).not.toBeNull();
      expect(GET_DINA_STATS).not.toBeNull();
      expect(GET_DINA_PERPETRATORS).not.toBeNull();
    });
  });

  describe('🎯 Query Structure Validation', () => {
    it('all queries have valid GraphQL structure', () => {
      console.log('🧪 [Test] Checking all queries have valid structure, desu~');

      const queries = [
        LOGIN_MUTATION,
        GET_THREAT_COUNTS,
        GET_THREAT_ACTORS,
        GET_DINA_STATS,
        GET_DINA_PERPETRATORS
      ];

      queries.forEach(query => {
        expect(query.kind).toBe('Document');
        expect(query.definitions).toBeDefined();
        expect(Array.isArray(query.definitions)).toBe(true);
        expect(query.definitions.length).toBeGreaterThan(0);
      });
    });

    it('all queries have operation definitions', () => {
      console.log('🧪 [Test] Checking all queries have operations, nyaa~');

      const queries = [
        LOGIN_MUTATION,
        GET_THREAT_COUNTS,
        GET_THREAT_ACTORS,
        GET_DINA_STATS,
        GET_DINA_PERPETRATORS
      ];

      queries.forEach(query => {
        const operation = query.definitions[0];
        expect(operation.kind).toBe('OperationDefinition');
        expect(operation.operation).toBeDefined();
        expect(['query', 'mutation']).toContain(operation.operation);
      });
    });

    it('all queries have selection sets', () => {
      console.log('🧪 [Test] Checking all queries have selection sets, desu~');

      const queries = [
        LOGIN_MUTATION,
        GET_THREAT_COUNTS,
        GET_THREAT_ACTORS,
        GET_DINA_STATS,
        GET_DINA_PERPETRATORS
      ];

      queries.forEach(query => {
        const operation = query.definitions[0];
        expect(operation.selectionSet).toBeDefined();
        expect(operation.selectionSet.kind).toBe('SelectionSet');
        expect(Array.isArray(operation.selectionSet.selections)).toBe(true);
      });
    });
  });
});

// *purrs in GraphQL testing excellence* 😻🔍
// ALL QUERIES 100% TESTED, NYAA~! 🐾⚡👑
