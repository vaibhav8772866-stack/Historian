import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Share2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  Info,
  ExternalLink
} from 'lucide-react';
import { GRAPH_NODES, GRAPH_EDGES } from '../../data/causalGraphData';
import Drawer from '../common/Drawer';

export default function GraphPreview() {
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.15));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHoveredNode(null);
  };

  const getNode = (id) => GRAPH_NODES.find((n) => n.id === id);

  const isEdgeHighlighted = (edge) => {
    const activeId = hoveredNode?.id || selectedNode?.id;
    if (!activeId) return false;
    return edge.source === activeId || edge.target === activeId;
  };

  return (
    <>
      <div className="historian-card p-6 flex flex-col justify-between h-full bg-white border-[#E8E4D0] relative">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0E0] text-[#FF8000] border border-[#FFD1A4]">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F2937]">Knowledge Graph Preview</h3>
                <p className="text-xs text-[#6B7280] font-medium">Multi-entity causal relation topography</p>
              </div>
            </div>

            {/* Graph Controls */}
            <div className="flex items-center gap-1 bg-[#FFFDF7] p-1 rounded-lg border border-[#E8E4D0]">
              <button
                onClick={handleZoomIn}
                className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] hover:bg-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] hover:bg-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="p-1 rounded text-[#6B7280] hover:text-[#1F2937] hover:bg-white transition-colors cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas Area */}
          <div className="relative mt-4 h-[330px] rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] overflow-hidden select-none">
            {/* Subtle Grid pattern */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(#D6CE9A 1px, transparent 1px)',
                backgroundSize: '16px 16px'
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
                  id="arrow-default"
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
                  id="arrow-active"
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

              {/* Render Edges */}
              {GRAPH_EDGES.map((edge) => {
                const source = getNode(edge.source);
                const target = getNode(edge.target);
                if (!source || !target) return null;

                const isHighlight = isEdgeHighlighted(edge);
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
                      strokeDasharray={isHighlight ? "none" : "3,3"}
                      markerEnd={isHighlight ? "url(#arrow-active)" : "url(#arrow-default)"}
                      className="transition-all duration-300"
                    />
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-38"
                        y="-10"
                        width="76"
                        height="20"
                        rx="10"
                        fill={isHighlight ? "#FFF0E0" : "#FFFFFF"}
                        stroke={isHighlight ? "#FF8000" : "#E5E7EB"}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill={isHighlight ? "#804000" : "#6B7280"}
                      >
                        {edge.relationship}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Render Nodes */}
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
                        r={node.r + 8}
                        fill="#FF8000"
                        opacity="0.25"
                        className="animate-pulse"
                      />
                    )}

                    <circle
                      r={node.r}
                      fill={node.bg}
                      stroke={isHovered || isSelected ? "#FF8000" : node.stroke}
                      strokeWidth={isHovered || isSelected ? 3 : 2}
                      className="transition-all duration-200"
                    />

                    <circle
                      r={node.r / 3}
                      fill={node.color}
                    />

                    <text
                      y={node.r + 14}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#1F2937"
                      className="select-none pointer-events-none drop-shadow-2xs"
                    >
                      {node.label}
                    </text>

                    <text
                      y={node.r + 26}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="#6B7280"
                      className="select-none pointer-events-none"
                    >
                      {node.metrics}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Quick Node Tooltip */}
            {hoveredNode && !selectedNode && (
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#E8E4D0] shadow-md flex items-center justify-between text-xs animate-fade-in pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                  <span className="font-bold text-[#1F2937]">{hoveredNode.label}</span>
                  <span className="text-[#9CA3AF]">• {hoveredNode.type}</span>
                </div>
                <span className="text-emerald-600 font-bold">{hoveredNode.confidence}% Confidence</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigate('/graph')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#FF8000] hover:text-white bg-[#FFF0E0] hover:bg-[#FF8000] transition-all flex items-center justify-center gap-2 group cursor-pointer border border-[#FFD1A4] hover:border-[#FF8000]"
          >
            <span>Explore Full Graph</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Entity Inspector Drawer */}
      <Drawer
        isOpen={Boolean(selectedNode)}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.label || "Entity Overview"}
        subtitle={`Knowledge Graph Node • ${selectedNode?.type}`}
      >
        {selectedNode && (
          <div className="space-y-5 text-sm text-[#4B5563]">
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#E8E4D0] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">Department</span>
                <div className="font-bold text-[#1F2937] text-sm mt-0.5">{selectedNode.department}</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#9CA3AF] uppercase">Attribution Confidence</span>
                <div className="font-bold text-emerald-600 text-sm mt-0.5">{selectedNode.confidence}%</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Causal Summary
              </h4>
              <p className="text-xs text-[#1F2937] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E8E4D0] font-medium">
                {selectedNode.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#E8E4D0] bg-white">
                <div className="text-[10px] font-bold uppercase text-[#9CA3AF]">Measured Metric</div>
                <div className="text-xs font-bold text-[#1F2937] mt-1">{selectedNode.metrics}</div>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E4D0] bg-white">
                <div className="text-[10px] font-bold uppercase text-[#9CA3AF]">Historical Frequency</div>
                <div className="text-xs font-semibold text-[#6B7280] mt-1">{selectedNode.historicalFreq}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                Connected Relationships
              </h4>
              <div className="space-y-1.5 text-xs">
                {GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map(edge => {
                  const otherNode = getNode(edge.source === selectedNode.id ? edge.target : edge.source);
                  const isOut = edge.source === selectedNode.id;

                  return (
                    <div key={edge.id} className="p-2.5 rounded-xl bg-[#FFFDF7] border border-[#E8E4D0] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#FFF0E0] text-[#E67300] font-bold text-[10px] border border-[#FFD1A4]">
                          {edge.relationship}
                        </span>
                        <span className="font-semibold text-[#1F2937]">{otherNode?.label}</span>
                      </div>
                      <span className="text-[10px] text-[#9CA3AF]">{isOut ? 'Outputs to' : 'Triggered by'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B7280] hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  navigate('/graph');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF8000] hover:bg-[#E67300] shadow-xs cursor-pointer"
              >
                Inspect in Graph Explorer
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}
