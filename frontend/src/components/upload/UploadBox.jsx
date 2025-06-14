import React, { useState, useRef } from 'react';
import { useToast } from '../ui/toastContext';

const chunkFile = (file, chunkSize = 1024 * 1024) => {
    const chunks = [];
    for (let i = 0; i < file.size; i += chunkSize) {
        chunks.push(file.slice(i, i + chunkSize));
    }
    return chunks;
};

const UploadBox = ({ onClose }) => {
    const { showToast } = useToast();
    const [file, setFile] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [progress, setProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState('idle');
    const fileInputRef = useRef();

    const handleFile = (f) => {
        if (!f) return;
        const ch = chunkFile(f);
        setFile(f);
        setChunks(ch);
        setProgress({});
        setUploadStatus('idle');
    };

    const handleFileSelect = (e) => {
        if (uploadStatus === 'uploading') return;
        handleFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (uploadStatus === 'uploading') return;
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const startUpload = async () => {
        if (!file) return;
        setUploadStatus('uploading');
        let uploaded = 0;

        try {
            for (let i = 0; i < chunks.length; i++) {
                await new Promise((res) => setTimeout(res, 300));
                uploaded += chunks[i].size;
                setProgress((prev) => ({
                    ...prev,
                    [i]: 100,
                    total: ((uploaded / file.size) * 100).toFixed(2),
                }));
            }

            setUploadStatus('success');
            showToast('success', `${file.name} uploaded successfully`);
        } catch (err) {
            console.error('Upload error:', err);
            setUploadStatus('failure');
            showToast('error', `Upload failed for ${file.name}`);
        }
    };

    const uploadButtonText = {
        idle: 'Start Upload',
        uploading: 'Uploading...',
        success: 'Uploaded',
        failure: 'Retry Upload',
    };

    return (
        <div
            className="fixed top-0 left-0 w-full h-full bg-black/10 bg-opacity-50 flex items-center justify-center z-50"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg relative">
                <h2 className="text-xl font-semibold mb-4">Upload File</h2>

                {/* Drag & Drop Zone */}
                <div
                    className={`border-2 border-dashed p-4 rounded text-center transition ${uploadStatus === 'uploading'
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'border-gray-400 hover:border-blue-500 cursor-pointer text-gray-600'
                        }`}
                    onClick={() => {
                        if (uploadStatus !== 'uploading') fileInputRef.current.click();
                    }}
                >
                    <p>Drag & Drop file here</p>
                </div>

                {/* Browse Button + Hidden Input */}
                <div className="mt-2 flex justify-center">
                    <button
                        onClick={() => {
                            if (uploadStatus !== 'uploading') fileInputRef.current.click();
                        }}
                        disabled={uploadStatus === 'uploading'}
                        className={`px-4 py-2 rounded text-white ${uploadStatus === 'uploading'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        Browse File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* File Info */}
                {file && (
                    <div className="mt-5">
                        <div className="mb-2">
                            <p className="font-medium">
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                            <div className="bg-gray-300 h-2 rounded">
                                <div
                                    className="bg-blue-500 h-2 rounded transition-all duration-200"
                                    style={{ width: `${progress.total || 0}%` }}
                                />
                            </div>
                        </div>
                        {chunks.map((chunk, index) => (
                            <div key={index} className="mb-1">
                                <p className="text-xs text-gray-700">
                                    Chunk {index + 1} - {(chunk.size / 1024).toFixed(2)} KB
                                </p>
                                <div className="bg-gray-200 h-1 rounded">
                                    <div
                                        className="bg-blue-600 h-1 rounded transition-all duration-200"
                                        style={{ width: `${progress[index] || 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    {file && (
                        <button
                            className={`px-4 py-2 rounded text-white ${uploadStatus === 'uploading'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                            onClick={startUpload}
                            disabled={uploadStatus === 'uploading' || uploadStatus === 'success'}
                        >
                            {uploadButtonText[uploadStatus]}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadBox;
