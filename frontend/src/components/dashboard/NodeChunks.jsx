import React from 'react';

const NodeChunks = ({ chunks }) => {
    return (
        <div className="mt-2 space-y-1">
            {chunks.map((chunk, index) => (
                <div key={index} className="text-sm text-gray-700">
                    Chunk {chunk.id} - {(chunk.size / 1024).toFixed(2)} KB
                </div>
            ))}
        </div>
    );
};

export default NodeChunks;
