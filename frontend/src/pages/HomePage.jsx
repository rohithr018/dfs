import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/upload/UploadBox';
import DownloadBox from '../components/download/DownloadBox';

const HomePage = () => {
    const [showUpload, setShowUpload] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
            <h1 className="text-4xl font-bold mb-8">Distributed File System</h1>

            <div className="flex flex-wrap gap-4 justify-center">
                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                    onClick={() => setShowUpload(true)}
                >
                    Upload
                </button>

                <button
                    className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
                    onClick={() => setShowDownload(true)}
                >
                    Download
                </button>

                <button
                    className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition"
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard
                </button>
            </div>

            {showUpload && <UploadBox onClose={() => setShowUpload(false)} />}
            {showDownload && <DownloadBox onClose={() => setShowDownload(false)} />}
        </div>
    );
};

export default HomePage;
