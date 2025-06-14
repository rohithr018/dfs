import React from 'react';

const UploadedFiles = ({ files, selectedFileIndex, onFileSelect }) => {
    return (
        <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-3">
            {files.map((file, idx) => (
                <div
                    key={idx}
                    className={`p-3 border rounded shadow cursor-pointer hover:bg-blue-50 ${selectedFileIndex === idx ? 'border-blue-500' : 'border-gray-300'
                        }`}
                    onClick={() => onFileSelect(idx)}
                >
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            ))}
        </div>
    );
};

export default UploadedFiles;
