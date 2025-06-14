import React, { useState } from 'react';
import { useToast } from '../ui/toastContext';

const sampleFiles = [
    { name: 'project.zip', size: 3_145_728, nodes: ['Node-A', 'Node-B'] },
    { name: 'video.mp4', size: 10_000_000, nodes: ['Node-C'] },
];

const DownloadBox = ({ onClose }) => {
    const { showToast } = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState({});
    const [status, setStatus] = useState('idle'); // idle | downloading | done

    const chunks = 5;

    const downloadFile = async () => {
        if (!selectedFile) return;
        setStatus('downloading');

        let downloaded = 0;
        const newProgress = {};
        const chunkSize = selectedFile.size / chunks;

        try {
            for (let i = 0; i < chunks; i++) {
                await new Promise((res) => setTimeout(res, 500));

                downloaded += chunkSize;

                newProgress[i] = 100;
                newProgress.total = ((downloaded / selectedFile.size) * 100).toFixed(2);

                setProgress({ ...newProgress });
            }

            setStatus('done');
            showToast('success', `${selectedFile.name} downloaded successfully`);

        } catch (err) {
            showToast('error', err);
            setStatus('idle');
        }
    };

    const getDownloadButtonLabel = () => {
        switch (status) {
            case 'downloading': return 'Downloading...';
            case 'done': return 'Downloaded';
            default: return 'Start Download';
        }
    };

    const canGoBack = status !== 'downloading';

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/10 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] ">
                <h2 className="text-xl font-semibold mb-4">Download Files</h2>

                {!selectedFile ? (
                    <>
                        <ul className="space-y-2">
                            {sampleFiles.map((file, idx) => (
                                <li
                                    key={idx}
                                    className="p-3 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                                    onClick={() => {
                                        setSelectedFile(file);
                                        setProgress({});
                                        setStatus('idle');
                                    }}
                                >
                                    <span className="font-medium">{file.name}</span>
                                    <span className="text-sm text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </>
                ) : (
                    <>
                        {/* File Info */}
                        <p className="font-medium mb-1">
                            {selectedFile.name} — {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="bg-gray-300 h-2 mb-4 rounded">
                            <div
                                className="bg-green-500 h-2 rounded transition-all duration-200"
                                style={{ width: `${progress.total || 0}%` }}
                            />
                        </div>

                        {/* Chunk Info */}
                        {[...Array(chunks)].map((_, i) => {
                            const chunkSize = (selectedFile.size / chunks) / 1024;
                            return (
                                <div key={i} className="mb-2">
                                    <p className="text-sm text-gray-700">
                                        Chunk {i + 1} ({chunkSize.toFixed(2)} KB) from{' '}
                                        <span className="font-semibold text-gray-800">
                                            {selectedFile.nodes[i % selectedFile.nodes.length]}
                                        </span>
                                    </p>
                                    <div className="bg-gray-200 h-1 rounded">
                                        <div
                                            className="bg-green-600 h-1 rounded transition-all duration-200"
                                            style={{ width: `${progress[i] || 0}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-6">
                            <button
                                className={`px-4 py-2 rounded text-white ${canGoBack
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-red-300 cursor-not-allowed'
                                    }`}
                                disabled={!canGoBack}
                                onClick={() => {
                                    setSelectedFile(null);
                                    setProgress({});
                                    setStatus('idle');
                                }}
                            >
                                {status === 'done' ? 'Close' : 'Back'}
                            </button>

                            <button
                                className={`px-4 py-2 rounded text-white ${status === 'downloading'
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : status === 'done'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                disabled={status !== 'idle'}
                                onClick={downloadFile}
                            >
                                {getDownloadButtonLabel()}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DownloadBox;
