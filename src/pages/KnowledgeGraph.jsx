import React, { useState } from 'react';
import { 
  Share2, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  SlidersHorizontal, 
  Layers, 
  Info, 
  FileText, 
  Clock, 
  TrendingDown, 
  CheckCircle2,
  Filter,
  Eye,
  ExternalLink
} from 'lucide-react';
import { GRAPH_NODES, GRAPH_EDGES } from '../data/causalGraphData';
import ConfidenceBar from '../components/common/ConfidenceBar';

export default function KnowledgeGraph() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(GRAPH_NODES[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, z - 0.2));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNode = (id) => GRAPH_NODES.find((n) => n.id === id);

  const filteredNodes = GRAPH_NODES.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.type.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.department.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = selectedCategory === 'All' || node.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const isEdgeActive = (edge) => {
    const activeId = hoveredNode?.id || selectedNode?.id;
    if (!activeId) return false;
    return edge.source === activeId || edge.target === activeId;
  };

  const connectedEdges = GRAPH_EDGES.filter(
    (e) => e.source === selectedNode?.id || e.target === selectedNode?.id
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight flex items-center gap-2.5">
            <span>Knowledge Graph Explorer</span>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-[#FFF0E0] text-[#E67300] border border-[#FFD1A4] rounded-lg">
              Enterprise Neural Topology
            </span>
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-1">
            Explore causal linkages, operational dependencies, and multi-variable ripple effects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-bold text-[#4B5563] bg-white hover:bg-[#FFF0E0] hover:text-[#FF8000] border border-[#E8E4D0] flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Canvas</span>
          </button>
        </div>
      </div>

      {/* Main Graph Workspace: 3-column interactive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Filters & Entity Directory (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="historian-card p-4 bg-white border-[#E8E4D0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#FF8000]" />
                <span>Filter Entities</span>
              </span>
              <span className="text-[11px] font-bold text-[#9CA3AF]">
                {filteredNodes.length} of {GRAPH_NODES.length}
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter nodes..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs text-[#1F2937] placeholder:text-[#9CA3AF] focus:bg-white focus:border-[#FF8000] outline-none font-medium"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50/80 border border-[#E8E4D0] rounded-xl text-xs font-semibold text-[#1F2937] outline-none focus:border-[#FF8000] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Cost Event">Cost Event</option>
                <option value="Operations">Operations</option>
                <option value="Logistics">Logistics</option>
                <option value="Financial Impact">Financial Impact</option>
                <option value="Customer Experience">Customer Experience</option>
              </select>
            </div>

            {/* List of nodes */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pt-1">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between text-xs border ${
                      isSelected 
                        ? 'bg-[#FFF0E0] border-[#FFD1A4] text-[#804000] font-bold' 
                        : 'bg-white hover:bg-[#FFFDF7] border-[#E8E4D0] text-[#4B5563]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
                      <span className="truncate">{node.label}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#9CA3AF] shrink-0">
                      {node.confidence}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: Interactive Graph Canvas (6 cols) */}
        <div className="lg:col-span-6">
          <div className="historian-card bg-white p-3 border-[#E8E4D0] shadow-sm relative overflow-hidden">
            {/* Top Canvas Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-[#FFFDF7] rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#FF8000]" />
                <span className="text-xs font-bold text-[#1F2937]">Topology Canvas</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded-lg hover:bg-white text-[#6B7280] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded-lg hover:bg-white text-[#6B7280] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 rounded-lg hover:bg-white text-[#6B7280] cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="h-[480px] bg-[#FFFDF7] rounded-xl border border-[#E8E4D0] overflow-hidden relative select-none">
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#D6CE9A 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              <svg
                viewBox="0 0 950 450"
                className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-150"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: 'center center'
                }}
              >
                <defs>
                  <marker
                    id="g-arrow-default"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#9CA3AF" />
                  </marker>
                  <marker
                    id="g-arrow-active"
                    viewBox="0 0 10 10"
                    refX="22"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0.5 L 10 5 L 0 9.5 z" fill="#FF8000" />
                  </marker>
                </defs>

                {/* Edges */}
                {GRAPH_EDGES.map((edge) => {
                  const source = getNode(edge.source);
                  const target = getNode(edge.target);
                  if (!source || !target) return null;

                  const isHighlight = isEdgeActive(edge);
                  const midX = (source.x + target.x) / 2;
                  const midY = (source.y + target.y) / 2;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isHighlight ? "#FF8000" : "#D1D5DB"}
                        strokeWidth={isHighlight ? 2.5 : 1.5}
                        strokeDasharray={isHighlight ? "none" : "4,4"}
                        markerEnd={isHighlight ? "url(#g-arrow-active)" : "url(#g-arrow-default)"}
                        className="transition-all duration-200"
                      />
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x="-36"
                          y="-9"
                          width="72"
                          height="18"
                          rx="9"
                          fill={isHighlight ? "#FFF0E0" : "#FFFFFF"}
                          stroke={isHighlight ? "#FF8000" : "#E5E7EB"}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="700"
                          fill={isHighlight ? "#804000" : "#6B7280"}
                        >
                          {edge.relationship}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Nodes */}
                {GRAPH_NODES.map((node) => {
                  const isHovered = hoveredNode?.id === node.id;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                    >
                      {(isHovered || isSelected) && (
                        <circle
                          r={node.r + 10}
                          fill="#FF8000"
                          opacity="0.25"
                          className="animate-pulse"
                        />
                      )}

                      <circle
                        r={node.r}
                        fill={node.bg}
                        stroke={isSelected ? "#FF8000" : node.stroke}
                        strokeWidth={isSelected ? 3.5 : 2}
                        className="transition-all duration-200"
                      />

                      <circle r={node.r / 3} fill={node.color} />

                      <text
                        y={node.r + 14}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="700"
                        fill="#1F2937"
                      >
                        {node.label}
                      </text>

                      <text
                        y={node.r + 26}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="600"
                        fill="#6B7280"
                      >
                        {node.metrics}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Entity Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="historian-card p-5 bg-white border-[#E8E4D0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#1F2937] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#FF8000]" />
                <span>Entity Inspector</span>
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {selectedNode?.confidence}% Match
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-extrabold text-[#1F2937]">{selectedNode.label}</h3>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] mt-0.5">
                    {selectedNode.type} • {selectedNode.department}
                  </p>
                </div>

                <div className="p-3 bg-[#FFFDF7] rounded-xl border border-[#E8E4D0] leading-relaxed text-[#4B5563]">
                  {selectedNode.description}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-[#E8E4D0]">
                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Impact</span>
                    <div className="font-bold text-[#1F2937] mt-0.5">{selectedNode.metrics}</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#E8E4D0]">
                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Evidence</span>
                    <div className="font-bold text-[#FF8000] mt-0.5">{selectedNode.evidenceCount} Citations</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                    Active Causal Connections ({connectedEdges.length})
                  </div>
                  <div className="space-y-1.5">
                    {connectedEdges.map((edge) => {
                      const other = getNode(edge.source === selectedNode.id ? edge.target : edge.source);
                      const isOutgoing = edge.source === selectedNode.id;

                      return (
                        <div key={edge.id} className="p-2 rounded-lg bg-[#FFFDF7] border border-[#E8E4D0] flex items-center justify-between">
                          <span className="font-semibold text-[#1F2937] truncate">{other?.label}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#FFF0E0] text-[#E67300] font-bold text-[10px] border border-[#FFD1A4]">
                            {edge.relationship}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#9CA3AF]">Select a node from the canvas to view detailed telemetry.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
