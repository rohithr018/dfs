import React, { useState } from 'react';
import NodeChunks from './NodeChunks';

const mockNodes = [
    {
        name: 'Node-A',
        status: 'active',
        chunks: [
            { id: 'data1.zip-1', size: 1048576 },
            { id: 'report.pdf-2', size: 1048576 },
        ],
    },
    {
        name: 'Node-B',
        status: 'active',
        chunks: [
            { id: 'data1.zip-2', size: 1048576 },
            { id: 'report.pdf-1', size: 1048576 },
        ],
    },
];

const NodeList = () => {
    const [expandedNode, setExpandedNode] = useState(null);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Node Servers</h2>
            {mockNodes.map((node, idx) => (
                <div key={idx} className="mb-3 border-b pb-2">
                    <div
                        className="cursor-pointer flex justify-between"
                        onClick={() => setExpandedNode(expandedNode === idx ? null : idx)}
                    >
                        <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-sm text-gray-600">Status: {node.status}</p>
                        </div>
                        <span className="text-blue-500">{expandedNode === idx ? '-' : '+'}</span>
                    </div>
                    {expandedNode === idx && (
                        <div className="mt-2">
                            <NodeChunks chunks={node.chunks} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NodeList;
