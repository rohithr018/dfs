import React, { useState } from 'react';
import NodeChunks from '../components/dashboard/NodeChunks';
import UploadedFiles from '../components/dashboard/UploadedFiles';
import NodeServers from '../components/dashboard/NodeServers';

const mockNodes = [
    {
        name: 'Node-A',
        status: 'active',
        ip: '192.168.0.1',
        location: 'Data Center 1',
        chunks: [
            { id: 'data1.zip-1', size: 1048576 },
            { id: 'report.pdf-2', size: 1048576 },
        ],
    },
    {
        name: 'Node-B',
        status: 'active',
        ip: '192.168.0.2',
        location: 'Data Center 2',
        chunks: [
            { id: 'data1.zip-2', size: 1048576 },
            { id: 'report.pdf-1', size: 1048576 },
        ],
    },
];

const mockFiles = [
    {
        name: 'data1.zip',
        size: 2097152,
        chunks: [
            { id: 'data1.zip-1', size: 1048576 },
            { id: 'data1.zip-2', size: 1048576 },
        ],
    },
    {
        name: 'report.pdf',
        size: 2097152,
        chunks: [
            { id: 'report.pdf-1', size: 1048576 },
            { id: 'report.pdf-2', size: 1048576 },
        ],
    },
];

const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('files');
    const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
    const [selectedFileIndex, setSelectedFileIndex] = useState(null);

    const clearSelection = () => {
        setSelectedFileIndex(null);
        setSelectedNodeIndex(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white w-[80%] max-w-4xl rounded-lg shadow-lg p-6 relative">
                <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

                {/* Toggle Tabs */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'files' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('files')}
                    >
                        Uploaded Files
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeTab === 'nodes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('nodes')}
                    >
                        Node Servers
                    </button>
                </div>

                {/* Fixed Height Panel View with Scroll */}
                <div
                    className={`h-[400px] ${selectedFileIndex !== null || selectedNodeIndex !== null ? 'opacity-30 pointer-events-none' : ''}`}
                >
                    <div className="h-full overflow-y-auto">
                        {activeTab === 'files' ? (
                            <UploadedFiles
                                files={mockFiles}
                                selectedFileIndex={selectedFileIndex}
                                onFileSelect={(idx) => {
                                    setSelectedFileIndex(idx);
                                    setSelectedNodeIndex(null);
                                }}
                            />
                        ) : (
                            <NodeServers
                                nodes={mockNodes}
                                selectedNodeIndex={selectedNodeIndex}
                                onNodeSelect={(idx) => {
                                    setSelectedNodeIndex(idx);
                                    setSelectedFileIndex(null);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Modal */}
                {(selectedFileIndex !== null || selectedNodeIndex !== null) && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50">
                        <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
                            {selectedFileIndex !== null ? (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">File Details</h3>
                                    <p><strong>Name:</strong> {mockFiles[selectedFileIndex].name}</p>
                                    <p><strong>Size:</strong> {(mockFiles[selectedFileIndex].size / 1024 / 1024).toFixed(2)} MB</p>
                                    <div className="mt-4">
                                        <h4 className="font-medium">Chunks:</h4>
                                        <NodeChunks chunks={mockFiles[selectedFileIndex].chunks} />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Node Details</h3>
                                    <p><strong>Name:</strong> {mockNodes[selectedNodeIndex].name}</p>
                                    <p><strong>Status:</strong> {mockNodes[selectedNodeIndex].status}</p>
                                    <p><strong>IP:</strong> {mockNodes[selectedNodeIndex].ip}</p>
                                    <p><strong>Location:</strong> {mockNodes[selectedNodeIndex].location}</p>
                                    <div className="mt-4">
                                        <h4 className="font-medium">Chunks:</h4>
                                        <NodeChunks chunks={mockNodes[selectedNodeIndex].chunks} />
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-start">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={clearSelection}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;