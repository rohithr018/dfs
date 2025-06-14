import React from 'react';

const NodeServers = ({ nodes, selectedNodeIndex, onNodeSelect }) => {
    return (
        <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-3">
            {nodes.map((node, idx) => (
                <div
                    key={idx}
                    className={`p-3 border rounded shadow cursor-pointer flex justify-between items-center hover:bg-blue-50 ${selectedNodeIndex === idx ? 'border-blue-500' : 'border-gray-300'
                        }`}
                    onClick={() => onNodeSelect(idx)}
                >
                    <div>
                        <p className="font-medium">{node.name}</p>
                        <p className="text-xs text-gray-500">{node.location}</p>
                    </div>
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${node.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {node.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default NodeServers;
