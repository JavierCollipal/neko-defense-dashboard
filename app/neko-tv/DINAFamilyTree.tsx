'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface DINAAgent {
  agentId: string;
  fullName: string;
  codename?: string;
  alias?: string;
  role: string;
  rank?: string;
  organization: string[];
  status: string;
  threatLevel: string;
  crimesAccused: string[];
  notableOperations?: string[];
  legalStatus: {
    convicted: boolean;
    currentStatus: string;
    sentences?: string;
  };
}

interface Brigade {
  id: string;
  name: string;
  specialty?: string;
  commanders?: any[];
  operations?: any;
  _type?: string;
}

interface Props {
  agents: DINAAgent[];
  brigades: Brigade[];
}

export default function DINAFamilyTree({ agents, brigades }: Props) {
  // Build hierarchical graph structure
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Root node: Manuel Contreras (DINA Chief)
    const contrerasAgent = agents.find((a) => a.agentId === 'contreras-manuel');

    nodes.push({
      id: 'contreras',
      type: 'input',
      data: {
        label: (
          <div className="px-6 py-4 bg-gradient-to-br from-red-600 to-red-800 rounded-lg border-2 border-red-400 shadow-2xl">
            <div className="text-white font-bold text-lg">
              👑 Manuel Contreras
            </div>
            <div className="text-red-200 text-sm">"El Mamo"</div>
            <div className="text-red-300 text-xs mt-1">
              DINA Commander & Chief
            </div>
            <div className="text-red-400 text-xs">DECEASED - CONVICTED</div>
          </div>
        ),
      },
      position: { x: 500, y: 50 },
      sourcePosition: Position.Bottom,
    });

    // Brigade nodes (Level 2)
    const brigadesFiltered = brigades.filter((b) => b._type !== 'metadata');

    const brigadeSpacing = 300;
    const startX = 150;

    brigadesFiltered.forEach((brigade, index) => {
      const brigadeId = `brigade-${brigade.id}`;

      // Determine color based on brigade type
      let colorClass = 'from-purple-600 to-purple-800 border-purple-400';
      if (
        brigade.specialty?.includes('elimination') ||
        brigade.specialty?.includes('Chemical')
      ) {
        colorClass = 'from-orange-600 to-orange-800 border-orange-400';
      } else if (
        brigade.specialty?.includes('international') ||
        brigade.specialty?.includes('Foreign')
      ) {
        colorClass = 'from-blue-600 to-blue-800 border-blue-400';
      } else if (brigade.specialty?.includes('Psychological')) {
        colorClass = 'from-pink-600 to-pink-800 border-pink-400';
      }

      nodes.push({
        id: brigadeId,
        data: {
          label: (
            <div
              className={`px-4 py-3 bg-gradient-to-br ${colorClass} rounded-lg border-2 shadow-xl hover:shadow-2xl transition-shadow`}
            >
              <div className="text-white font-semibold text-sm">
                {brigade.name}
              </div>
              {brigade.specialty && (
                <div className="text-gray-200 text-xs mt-1">
                  {brigade.specialty}
                </div>
              )}
              {brigade.commanders && brigade.commanders.length > 0 && (
                <div className="text-gray-300 text-xs mt-1">
                  👤 {brigade.commanders[0].name}
                </div>
              )}
            </div>
          ),
        },
        position: { x: startX + index * brigadeSpacing, y: 250 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Edge from Contreras to Brigade
      edges.push({
        id: `contreras-${brigadeId}`,
        source: 'contreras',
        target: brigadeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ef4444',
        },
      });
    });

    // Agent nodes (Level 3) - excluding Contreras
    const otherAgents = agents.filter((a) => a.agentId !== 'contreras-manuel');

    // Group agents by category for better layout
    const seniorAgents = otherAgents.filter(
      (a) =>
        a.role.includes('Second-in-Command') ||
        a.role.includes('Operations Chief') ||
        a.role.includes('Operations Officer')
    );
    const villaGrimaldiAgents = otherAgents.filter(
      (a) => a.role.includes('Villa Grimaldi') && !seniorAgents.includes(a)
    );
    const otherDINAAgents = otherAgents.filter(
      (a) => !seniorAgents.includes(a) && !villaGrimaldiAgents.includes(a)
    );

    // Layout senior agents (row 1)
    seniorAgents.forEach((agent, index) => {
      const agentId = `agent-${agent.agentId}`;
      let statusColor = 'from-gray-600 to-gray-800 border-gray-400';
      if (agent.status.includes('CONVICTED')) {
        statusColor = 'from-yellow-600 to-yellow-800 border-yellow-400';
      } else if (agent.status.includes('AT LARGE')) {
        statusColor = 'from-red-600 to-red-800 border-red-400';
      } else if (agent.status.includes('NEVER PROSECUTED')) {
        statusColor = 'from-green-600 to-green-800 border-green-400';
      }

      nodes.push({
        id: agentId,
        type: 'output',
        data: {
          label: (
            <div
              className={`px-4 py-3 bg-gradient-to-br ${statusColor} rounded-lg border-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <div className="text-white font-semibold text-xs">
                {agent.fullName}
              </div>
              {agent.codename && (
                <div className="text-gray-200 text-xs italic">
                  "{agent.codename}"
                </div>
              )}
              <div className="text-gray-300 text-xs mt-1">{agent.role}</div>
              <div className="text-xs mt-1 font-semibold">
                {agent.status.includes('CONVICTED') && '⚖️ CONVICTED'}
                {agent.status.includes('AT LARGE') && '🚨 AT LARGE'}
                {agent.status.includes('NEVER PROSECUTED') && '🔓 UNPROSECUTED'}
                {agent.status.includes('DECEASED') && ' 💀 DECEASED'}
              </div>
            </div>
          ),
        },
        position: { x: 200 + index * 350, y: 500 },
        targetPosition: Position.Top,
      });

      // Connect senior agents directly to Contreras
      edges.push({
        id: `contreras-${agentId}`,
        source: 'contreras',
        target: agentId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#ef4444', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ef4444',
        },
      });
    });

    // Layout Villa Grimaldi agents (row 2)
    villaGrimaldiAgents.forEach((agent, index) => {
      const agentId = `agent-${agent.agentId}`;
      let statusColor = 'from-gray-600 to-gray-800 border-gray-400';
      if (agent.status.includes('CONVICTED')) {
        statusColor = 'from-yellow-600 to-yellow-800 border-yellow-400';
      } else if (agent.status.includes('NEVER PROSECUTED')) {
        statusColor = 'from-green-600 to-green-800 border-green-400';
      }

      nodes.push({
        id: agentId,
        type: 'output',
        data: {
          label: (
            <div
              className={`px-3 py-2 bg-gradient-to-br ${statusColor} rounded-lg border-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <div className="text-white font-semibold text-xs">
                {agent.fullName}
              </div>
              {agent.codename && (
                <div className="text-gray-200 text-xs italic">
                  "{agent.codename}"
                </div>
              )}
              <div className="text-gray-300 text-xs mt-1">
                🏛️ Villa Grimaldi
              </div>
              <div className="text-xs mt-1 font-semibold">
                {agent.status.includes('CONVICTED') && '⚖️ CONVICTED'}
                {agent.status.includes('NEVER PROSECUTED') && '🔓 UNPROSECUTED'}
                {agent.status.includes('DECEASED') && ' 💀'}
              </div>
            </div>
          ),
        },
        position: { x: 100 + index * 250, y: 700 },
        targetPosition: Position.Top,
      });

      // Connect to Contreras
      edges.push({
        id: `contreras-${agentId}`,
        source: 'contreras',
        target: agentId,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#8b5cf6', strokeWidth: 1 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6',
        },
      });
    });

    // Layout other DINA agents (row 3)
    otherDINAAgents.forEach((agent, index) => {
      const agentId = `agent-${agent.agentId}`;
      let statusColor = 'from-gray-600 to-gray-800 border-gray-400';
      if (agent.status.includes('CONVICTED')) {
        statusColor = 'from-yellow-600 to-yellow-800 border-yellow-400';
      } else if (agent.status.includes('AT LARGE')) {
        statusColor = 'from-red-600 to-red-800 border-red-400';
      } else if (agent.status.includes('NEVER PROSECUTED')) {
        statusColor = 'from-green-600 to-green-800 border-green-400';
      }

      nodes.push({
        id: agentId,
        type: 'output',
        data: {
          label: (
            <div
              className={`px-3 py-2 bg-gradient-to-br ${statusColor} rounded-lg border-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <div className="text-white font-semibold text-xs">
                {agent.fullName}
              </div>
              {agent.codename && (
                <div className="text-gray-200 text-xs italic">
                  "{agent.codename}"
                </div>
              )}
              <div className="text-gray-300 text-xs mt-1">{agent.role}</div>
              <div className="text-xs mt-1 font-semibold">
                {agent.status.includes('CONVICTED') && '⚖️ CONVICTED'}
                {agent.status.includes('AT LARGE') && '🚨 AT LARGE'}
                {agent.status.includes('NEVER PROSECUTED') && '🔓 UNPROSECUTED'}
                {agent.status.includes('DECEASED') && ' 💀'}
              </div>
            </div>
          ),
        },
        position: { x: 150 + index * 280, y: 900 },
        targetPosition: Position.Top,
      });

      // Try to connect to matching brigade
      let connected = false;
      if (agent.organization && agent.organization.length > 0) {
        const matchingBrigade = brigadesFiltered.find(
          (b) =>
            (b.name.includes('Lautaro') && agent.fullName.includes('Rivas')) ||
            (b.name.includes('Caupolicán') &&
              agent.fullName.includes('Krassnoff'))
        );

        if (matchingBrigade) {
          edges.push({
            id: `brigade-${matchingBrigade.id}-${agentId}`,
            source: `brigade-${matchingBrigade.id}`,
            target: agentId,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#a855f7', strokeWidth: 1.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#a855f7',
            },
          });
          connected = true;
        }
      }

      if (!connected) {
        edges.push({
          id: `contreras-${agentId}`,
          source: 'contreras',
          target: agentId,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#6b7280', strokeWidth: 1 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6b7280',
          },
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [agents, brigades]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', node);
    // Could open modal with detailed info
  }, []);

  return (
    <div className="w-full h-[1100px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900/20 rounded-xl border border-cyan-500/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
        className="rounded-xl"
      >
        <Background color="#a855f7" gap={20} size={1} className="opacity-20" />
        <Controls className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg" />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'input') {
              return '#dc2626';
            }
            if (node.type === 'output') {
              return '#a855f7';
            }
            return '#6366f1';
          }}
          className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-lg"
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-cyan-500/30 text-xs">
        <div className="text-cyan-300 font-bold mb-2">🗺️ LEGEND</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-gray-300">DINA Chief (Contreras)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded"></div>
            <span className="text-gray-300">Brigade Structures</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded"></div>
            <span className="text-gray-300">Elimination Units</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded"></div>
            <span className="text-gray-300">⚖️ Convicted Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-gray-300">🚨 At Large</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded"></div>
            <span className="text-gray-300">🔓 Unprosecuted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
