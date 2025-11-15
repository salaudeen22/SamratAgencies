import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { settingsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsAPI.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'business', label: 'Business Hours' },
    { id: 'payment', label: 'Payment & Tax' },
    { id: 'social', label: 'Social Media' },
    { id: 'seo', label: 'SEO' }
  ];

  return (
    <AdminLayout>
      <form onSubmit={handleSave}>
        <div className="space-y-6">
          <PageHeader
            title="Settings"
            subtitle="Configure your site settings"
            action={
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            }
          />

          {/* Tabs */}
          <Card>
            <div className="flex gap-2 border-b" style={{ borderColor: '#e2e8f0' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="px-4 py-2 font-medium transition-colors"
                  style={{
                    color: activeTab === tab.id ? '#895F42' : '#64748b',
                    borderBottom: activeTab === tab.id ? '2px solid #895F42' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

          {/* General Settings */}
          {activeTab === 'general' && (
            <Card title="General Information">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription || ''}
                    onChange={(e) => handleChange('siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.siteEmail || ''}
                      onChange={(e) => handleChange('siteEmail', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.sitePhone || ''}
                      onChange={(e) => handleChange('sitePhone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Address
                  </label>
                  <textarea
                    value={settings.siteAddress || ''}
                    onChange={(e) => handleChange('siteAddress', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Business Hours */}
          {activeTab === 'business' && (
            <Card title="Business Hours">
              <div className="space-y-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="grid grid-cols-2 gap-4 items-center">
                    <label className="text-sm font-medium capitalize" style={{ color: '#1F2D38' }}>
                      {day}
                    </label>
                    <input
                      type="text"
                      value={settings.businessHours?.[day] || ''}
                      onChange={(e) => handleNestedChange('businessHours', day, e.target.value)}
                      placeholder="9:00 AM - 6:00 PM"
                      className="px-3 py-2 border rounded-lg"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Payment & Tax */}
          {activeTab === 'payment' && (
            <Card title="Payment & Tax Settings">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settings.taxRate || 0}
                    onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Default Shipping Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultShippingCharge || 0}
                    onChange={(e) => handleChange('defaultShippingCharge', parseFloat(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold || 0}
                    onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.razorpayEnabled || false}
                      onChange={(e) => handleChange('razorpayEnabled', e.target.checked)}
                      className="w-4 h-4"
                      style={{ accentColor: '#895F42' }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#1F2D38' }}>
                      Enable Razorpay
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.codEnabled || false}
                      onChange={(e) => handleChange('codEnabled', e.target.checked)}
                      className="w-4 h-4"
                      style={{ accentColor: '#895F42' }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#1F2D38' }}>
                      Enable Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Social Media */}
          {activeTab === 'social' && (
            <Card title="Social Media Links">
              <div className="space-y-4">
                {['facebook', 'instagram', 'twitter', 'youtube', 'linkedin'].map(platform => (
                  <div key={platform}>
                    <label className="block text-sm font-medium mb-1 capitalize" style={{ color: '#1F2D38' }}>
                      {platform}
                    </label>
                    <input
                      type="url"
                      value={settings.socialMedia?.[platform] || ''}
                      onChange={(e) => handleNestedChange('socialMedia', platform, e.target.value)}
                      placeholder={`https://${platform}.com/yourpage`}
                      className="w-full px-3 py-2 border rounded-lg"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <Card title="SEO Settings">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={settings.seo?.metaTitle || ''}
                    onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Meta Description
                  </label>
                  <textarea
                    value={settings.seo?.metaDescription || ''}
                    onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={settings.seo?.metaKeywords || ''}
                    onChange={(e) => handleNestedChange('seo', 'metaKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.seo?.ogImage || ''}
                    onChange={(e) => handleNestedChange('seo', 'ogImage', e.target.value)}
                    placeholder="https://example.com/og-image.jpg"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#e2e8f0' }}
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </form>
    </AdminLayout>
  );
};

export default Settings;
