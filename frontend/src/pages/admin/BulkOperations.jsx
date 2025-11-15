import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { bulkAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaUpload, FaDownload, FaFileImport, FaFileExport, FaBox, FaUsers, FaShoppingCart, FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const BulkOperations = () => {
  const [importType, setImportType] = useState('products');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  const operationTypes = [
    { id: 'products', label: 'Products', icon: FaBox, color: 'blue' },
    { id: 'users', label: 'Users', icon: FaUsers, color: 'purple' },
    { id: 'orders', label: 'Orders', icon: FaShoppingCart, color: 'green' },
  ];

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      e.target.value = '';
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      let response;

      switch (importType) {
        case 'products':
          response = await bulkAPI.importProducts(file);
          break;
        case 'users':
          response = await bulkAPI.importUsers(file);
          break;
        default:
          throw new Error('Invalid import type');
      }

      const results = response.data.results;
      setImportResults(results);

      if (results.success > 0) {
        toast.success(`Successfully imported ${results.success} ${importType}`);
      }
      if (results.failed > 0) {
        toast.error(`${results.failed} ${importType} failed to import`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
      setImportResults({
        total: 0,
        success: 0,
        failed: 0,
        errors: [{ row: 0, error: error.response?.data?.message || 'Import failed' }]
      });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleExport = async (type) => {
    setExporting(true);

    try {
      let response;

      switch (type) {
        case 'products':
          response = await bulkAPI.exportProducts();
          break;
        case 'users':
          response = await bulkAPI.exportUsers();
          break;
        case 'orders':
          response = await bulkAPI.exportOrders();
          break;
        default:
          throw new Error('Invalid export type');
      }

      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_export_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const generateSampleCSV = (type) => {
    switch (type) {
      case 'products':
        return 'SKU,Name,Description,Category,Price,Stock,Images\nPROD001,Sample Product,Sample description,category-id,999,50,https://example.com/image.jpg\n';
      case 'users':
        return 'Email,Name,Phone,Role\nuser@example.com,John Doe,9876543210,customer\n';
      case 'orders':
        return 'OrderID,CustomerEmail,Total,Status,Date\nORD001,customer@example.com,5000,delivered,2025-01-15\n';
      default:
        return '';
    }
  };

  const downloadTemplate = async (type) => {
    try {
      const response = await bulkAPI.downloadTemplate(type);

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_template.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Template downloaded');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Bulk Operations"
          subtitle="Import and export data using CSV files"
        />

        {/* Operation Type Selector */}
        <Card title="Select Data Type">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {operationTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = importType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setImportType(type.id);
                    setImportResults(null);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-[#895F42] bg-[#895F42] bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-[#895F42]' : `bg-${type.color}-100`
                    }`}>
                      <Icon className={`text-2xl ${
                        isSelected ? 'text-white' : `text-${type.color}-600`
                      }`} />
                    </div>
                    <span className={`text-lg font-semibold ${
                      isSelected ? 'text-[#895F42]' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Import Section */}
        <Card title="Import Data">
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Important Guidelines</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• CSV file must match the template format exactly</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Existing records with matching IDs will be updated</li>
                    <li>• Invalid rows will be skipped and reported</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <label htmlFor="csv-import">
                <Button variant="primary" disabled={importing}>
                  <FaFileImport className="mr-2" />
                  {importing ? 'Importing...' : `Import ${importType.charAt(0).toUpperCase() + importType.slice(1)} CSV`}
                </Button>
              </label>
              <input
                id="csv-import"
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
                disabled={importing}
              />

              <Button
                variant="outline"
                size="md"
                onClick={() => downloadTemplate(importType)}
              >
                <FaDownload className="mr-2" size={14} />
                Download Template
              </Button>
            </div>

            {/* Import Results */}
            {importResults && (
              <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                <h3 className="text-lg font-semibold" style={{ color: '#1F2D38' }}>Import Results</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: '#64748b' }}>Total Rows</span>
                      <span className="text-2xl font-bold" style={{ color: '#1F2D38' }}>{importResults.total}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Successful</span>
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-2xl font-bold text-green-600">{importResults.success}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-700">Failed</span>
                      <div className="flex items-center gap-2">
                        <FaTimes className="text-red-600" />
                        <span className="text-2xl font-bold text-red-600">{importResults.failed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>
                      Errors ({importResults.errors.length})
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg max-h-64 overflow-y-auto">
                      {importResults.errors.map((error, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 border-b border-red-100 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-semibold text-red-700 bg-red-200 px-2 py-1 rounded">
                              Row {error.row}
                            </span>
                            <span className="text-sm text-red-800 flex-1">{error.error}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Export Section */}
        <Card title="Export Data">
          <div className="space-y-4">
            <p className="text-sm" style={{ color: '#64748b' }}>
              Export your data to CSV format for backup or analysis. The exported file will include all current data.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {operationTypes.map((type) => {
                const Icon = type.icon;

                return (
                  <div key={type.id} className="border rounded-lg p-6" style={{ borderColor: '#e2e8f0' }}>
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-${type.color}-100`}>
                        <Icon className={`text-xl text-${type.color}-600`} />
                      </div>
                      <div className="text-center">
                        <h3 className="text-base font-semibold mb-1" style={{ color: '#1F2D38' }}>
                          {type.label}
                        </h3>
                        <p className="text-xs mb-4" style={{ color: '#64748b' }}>
                          Export all {type.label.toLowerCase()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(type.id)}
                        disabled={exporting}
                        className="w-full"
                      >
                        <FaFileExport className="mr-2" size={12} />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Help Section */}
        <Card title="CSV Format Guidelines">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>Products CSV</h4>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <div style={{ color: '#64748b' }}>SKU,Name,Description,Category,Price,Stock,Images</div>
                <div style={{ color: '#895F42' }}>P001,Chair,Wooden,cat-id,999,50,url</div>
              </div>
              <ul className="mt-3 text-xs space-y-1" style={{ color: '#64748b' }}>
                <li>• SKU must be unique</li>
                <li>• Price in rupees (no symbols)</li>
                <li>• Multiple images: semicolon separated</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>Users CSV</h4>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <div style={{ color: '#64748b' }}>Email,Name,Phone,Role</div>
                <div style={{ color: '#895F42' }}>user@mail.com,John,9876543210,customer</div>
              </div>
              <ul className="mt-3 text-xs space-y-1" style={{ color: '#64748b' }}>
                <li>• Email must be valid & unique</li>
                <li>• Role: customer or admin</li>
                <li>• Phone: 10 digits</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>Orders CSV</h4>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <div style={{ color: '#64748b' }}>OrderID,Email,Total,Status,Date</div>
                <div style={{ color: '#895F42' }}>ORD001,user@mail.com,5000,delivered,2025-01-15</div>
              </div>
              <ul className="mt-3 text-xs space-y-1" style={{ color: '#64748b' }}>
                <li>• OrderID must be unique</li>
                <li>• Status: pending/processing/shipped/delivered</li>
                <li>• Date: YYYY-MM-DD format</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default BulkOperations;
