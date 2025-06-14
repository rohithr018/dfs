import React, { useState } from 'react';
import ChunkDetails from './ChunkDetails';

const mockFiles = [
    {
        name: 'data1.zip',
        size: 5242880,
        timestamp: '2025-06-14 12:30',
        chunks: [
            { id: 1, size: 1048576, node: 'Node-A' },
            { id: 2, size: 1048576, node: 'Node-B' },
            { id: 3, size: 1048576, node: 'Node-C' },
        ],
    },
    {
        name: 'report.pdf',
        size: 2097152,
        timestamp: '2025-06-14 13:00',
        chunks: [
            { id: 1, size: 1048576, node: 'Node-B' },
            { id: 2, size: 1048576, node: 'Node-A' },
        ],
    },
];

const FileList = () => {
    const [expandedFile, setExpandedFile] = useState(null);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
            {mockFiles.map((file, idx) => (
                <div key={idx} className="mb-3 border-b pb-2">
                    <div
                        className="cursor-pointer flex justify-between"
                        onClick={() => setExpandedFile(expandedFile === idx ? null : idx)}
                    >
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-600">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.timestamp}
                            </p>
                        </div>
                        <span className="text-blue-500">{expandedFile === idx ? '-' : '+'}</span>
                    </div>
                    {expandedFile === idx && (
                        <div className="mt-2">
                            <ChunkDetails chunks={file.chunks} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FileList;
