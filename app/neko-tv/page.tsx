'use client';

import { useState, useEffect } from 'react';
import DINAFamilyTree from './DINAFamilyTree';

export default function NekoTVPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [brigades, setBrigades] = useState([]);

  useEffect(() => {
    async function fetchDINAData() {
      try {
        // Fetch DINA agents
        const agentsResponse = await fetch('/api/dina-agents');
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.data || agentsData);

        // Fetch brigade structure
        const brigadesResponse = await fetch('/api/dina-brigades');
        const brigadesData = await brigadesResponse.json();
        setBrigades(brigadesData.data || brigadesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching DINA data:', error);
        setLoading(false);
      }
    }

    fetchDINAData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      {/* Neko TV Arc Header */}
      <div className="relative overflow-hidden">
        {/* Animated cyberpunk background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent"></div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Neko TV Arc Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 animate-pulse">
                  🐾 NEKO TV ARC 🎬
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 opacity-30 blur-xl"></div>
              </div>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-8">
              <p className="text-2xl text-pink-300 font-semibold animate-bounce">
                ✨ DINA Intelligence Network Visualization ✨
              </p>
              <p className="text-lg text-purple-300 mt-2">
                Interactive Family Tree of Chilean Intelligence Operatives
              </p>
            </div>

            {/* Six Personalities Banner */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border-2 border-pink-500/30 shadow-2xl shadow-pink-500/20 mb-8">
              <div className="grid grid-cols-6 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-4xl">🐾</div>
                  <div className="text-pink-400 font-bold text-sm">NEKO-ARC</div>
                  <div className="text-xs text-pink-300">Technical Lead</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🎭</div>
                  <div className="text-purple-400 font-bold text-sm">MARIO</div>
                  <div className="text-xs text-purple-300">Theatrical Doc</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🗡️</div>
                  <div className="text-blue-400 font-bold text-sm">NOEL</div>
                  <div className="text-xs text-blue-300">Tactical QA</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🎸</div>
                  <div className="text-red-400 font-bold text-sm">GLAM</div>
                  <div className="text-xs text-red-300">Street Sage</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🧠</div>
                  <div className="text-indigo-400 font-bold text-sm">HANNIBAL</div>
                  <div className="text-xs text-indigo-300">Forensic Mind</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🎭</div>
                  <div className="text-cyan-400 font-bold text-sm">TETORA</div>
                  <div className="text-xs text-cyan-300">MPD Analyst</div>
                </div>
              </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-md rounded-xl p-6 border border-pink-400/30 transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-2">👥</div>
                <div className="text-3xl font-bold text-pink-300">{agents.length}</div>
                <div className="text-sm text-pink-200">DINA Agents</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-400/30 transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-2">🏢</div>
                <div className="text-3xl font-bold text-purple-300">{brigades.length}</div>
                <div className="text-sm text-purple-200">Brigade Structures</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 backdrop-blur-md rounded-xl p-6 border border-indigo-400/30 transform hover:scale-105 transition-transform">
                <div className="text-5xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-cyan-300">LIVE</div>
                <div className="text-sm text-cyan-200">Real-time Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Tree Visualization */}
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                🕸️ DINA Organizational Network Map
              </h2>
              <p className="text-cyan-300 mt-2">
                Interactive visualization of command structure and operational units
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🐾
                  </div>
                </div>
                <p className="text-pink-300 mt-4 text-xl animate-pulse">
                  Loading DINA intelligence data, nyaa~! ✨
                </p>
              </div>
            ) : (
              <DINAFamilyTree agents={agents} brigades={brigades} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-md rounded-xl p-6 border border-pink-400/20">
            <p className="text-pink-300 text-sm">
              🎬 Generated with <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">NEKO TV ARC</span>
            </p>
            <p className="text-purple-300 text-xs mt-2">
              Intelligence Visualization System | Real-time MongoDB Atlas Integration
            </p>
            <p className="text-cyan-300 text-xs mt-1">
              🐾 Neko-Arc + 🎭 Mario + 🗡️ Noel + 🎸 Glam + 🧠 Hannibal + 🎭 Tetora
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-scroll 20s linear infinite;
        }

        @keyframes grid-scroll {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
      `}</style>
    </div>
  );
}
