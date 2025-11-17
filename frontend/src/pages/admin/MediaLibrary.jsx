import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaUpload, FaImage, FaTrash, FaCopy, FaSearch, FaFileImage, FaFolder, FaCalendar, FaEye } from 'react-icons/fa';

const MediaLibrary = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await uploadAPI.getFiles();
      const s3Files = response.data.files.map(file => ({
        _id: file.key,
        url: file.url,
        name: file.name,
        size: file.size,
        type: 'image/jpeg', // S3 doesn't return mime type easily, assume images
        uploadedAt: file.lastModified
      }));
      setFiles(s3Files);
    } catch (error) {
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of selectedFiles) {
      try {
        const response = await uploadAPI.uploadImage(file);

        setFiles(prev => [...prev, {
          _id: Date.now() + Math.random(),
          url: response.data.url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        }]);

        successCount++;
      } catch (error) {
        console.error('Upload error:', error);
        failCount++;
      }
    }

    setUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} file(s) failed to upload`);
    }

    e.target.value = '';
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      await uploadAPI.deleteImage(fileId); // fileId is the S3 key
      setFiles(prev => prev.filter(f => f._id !== fileId));
      toast.success('File deleted successfully');
      if (selectedFile?._id === fileId) {
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#816047' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading media library...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Media Library"
          subtitle="Manage your S3 uploaded images and files"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Files</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>{files.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <FaFileImage className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Storage Used</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>{formatFileSize(totalSize)}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                <FaFolder className="text-xl text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Images</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>
                  {files.filter(f => f.type?.startsWith('image/')).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <FaImage className="text-xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#816047]"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ backgroundColor: '#816047', color: 'white' }}>
                  <FaUpload className="mr-2" size={12} />
                  {uploading ? 'Uploading...' : 'Upload Files'}
                </span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
        </Card>

        {/* Files Grid/List */}
        {filteredFiles.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <FaImage className="text-5xl mx-auto mb-4" style={{ color: '#cbd5e1' }} />
              <p className="text-lg font-medium mb-1" style={{ color: '#64748b' }}>
                {searchTerm ? 'No files found' : 'No files uploaded yet'}
              </p>
              <p className="text-sm mb-6" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                {searchTerm ? 'Try a different search term' : 'Upload your first file to get started'}
              </p>
              {!searchTerm && (
                <label htmlFor="file-upload-empty" className="cursor-pointer">
                  <span className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-colors" style={{ backgroundColor: '#816047', color: 'white' }}>
                    <FaUpload className="mr-2" />
                    Upload Files
                  </span>
                </label>
              )}
              <input
                id="file-upload-empty"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Files Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file._id} className="p-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                    <div onClick={() => setSelectedFile(file)}>
                      {/* Image Preview */}
                      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {file.type?.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaFileImage className="text-4xl text-gray-400" />
                        )}
                      </div>

                      {/* File Info */}
                      <div className="p-3">
                        <p className="text-sm font-medium truncate mb-1" style={{ color: '#2F1A0F' }}>
                          {file.name}
                        </p>
                        <p className="text-xs" style={{ color: '#64748b' }}>
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* File Details Sidebar */}
            <div className="lg:col-span-1">
              <Card title="File Details">
                {selectedFile ? (
                  <div className="space-y-6">
                    {/* Preview */}
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {selectedFile.type?.startsWith('image/') ? (
                        <img
                          src={selectedFile.url}
                          alt={selectedFile.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <FaFileImage className="text-6xl text-gray-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>File Name</p>
                        <p className="text-sm font-medium break-all" style={{ color: '#2F1A0F' }}>
                          {selectedFile.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>Size</p>
                        <p className="text-sm" style={{ color: '#2F1A0F' }}>
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>Type</p>
                        <p className="text-sm" style={{ color: '#2F1A0F' }}>
                          {selectedFile.type || 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>Uploaded</p>
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#2F1A0F' }}>
                          <FaCalendar size={12} />
                          {formatDate(selectedFile.uploadedAt)}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-2" style={{ color: '#64748b' }}>URL</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedFile.url}
                            readOnly
                            className="flex-1 text-xs px-3 py-2 border rounded-lg bg-gray-50"
                            style={{ borderColor: '#e2e8f0', color: '#64748b' }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyUrl(selectedFile.url)}
                          >
                            <FaCopy size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedFile.url, '_blank')}
                        className="flex-1"
                      >
                        <FaEye className="mr-2" size={12} />
                        View
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(selectedFile._id)}
                        className="flex-1"
                      >
                        <FaTrash className="mr-2" size={12} />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaImage className="text-4xl mx-auto mb-3" style={{ color: '#cbd5e1' }} />
                    <p className="text-sm" style={{ color: '#64748b' }}>
                      Select a file to view details
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaLibrary;
