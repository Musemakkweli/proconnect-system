import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faCamera, faSave, faEdit } from '@fortawesome/free-solid-svg-icons';
import { getProvinces, getDistricts, getSectors, getCells, getVillages } from '../data/rwandaLocations';

export default function UserProfile({ toast, userType = 'user' }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Available options for cascading dropdowns
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);

  useEffect(() => {
    // Get user ID from localStorage
    let currentUserId = null;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Try multiple possible field names for user ID based on working patterns
      currentUserId = user?.user_id || user?.id || user?.userId || null;
    } catch (e) {
      console.error('Error getting user ID:', e);
    }

    if (!currentUserId) {
      if (toast && toast.error) toast.error('User ID not found');
      return;
    }

    setUserId(currentUserId);
    loadProfile(currentUserId);
  }, [loadProfile, toast]);

  const loadProfile = async (userIdToLoad) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://arlande-api.mababa.app/user-profile/${userIdToLoad}`, {
        method: 'GET',
        headers: { 'accept': 'application/json' }
      });
      
      console.log('Profile fetch response:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Profile data received:', data);
        setProfile(data);
        const profileData = {
          province: data.province || '',
          district: data.district || '',
          sector: data.sector || '',
          cell: data.cell || '',
          village: data.village || ''
        };
        setFormData(profileData);
        
        // Initialize cascading dropdowns based on existing data
        if (profileData.province) {
          setAvailableDistricts(getDistricts(profileData.province));
          if (profileData.district) {
            setAvailableSectors(getSectors(profileData.province, profileData.district));
            if (profileData.sector) {
              setAvailableCells(getCells(profileData.province, profileData.district, profileData.sector));
              if (profileData.cell) {
                setAvailableVillages(getVillages(profileData.province, profileData.district, profileData.sector, profileData.cell));
              }
            }
          }
        }
        
        // Show info about what was loaded
        if (toast && toast.info) {
          const fields = [];
          if (data.province) fields.push('province');
          if (data.district) fields.push('district');
          if (data.sector) fields.push('sector');
          if (data.cell) fields.push('cell');
          if (data.village) fields.push('village');
          if (data.profile_image_url) fields.push('image');
          
          if (fields.length > 0) {
            toast.info(`Profile loaded with: ${fields.join(', ')}`);
          } else {
            toast.info('Profile exists but no data fields are set');
          }
        }
      } else if (res.status === 404) {
        // Profile doesn't exist yet
        console.log('No profile found for user:', userIdToLoad);
        setProfile(null);
        if (toast && toast.info) toast.info('No profile found. Create one by editing your information.');
      } else {
        throw new Error(`Failed to load profile (${res.status})`);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      if (toast && toast.error) toast.error('Failed to load profile information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'province') {
      // Reset dependent fields when province changes
      setFormData(prev => ({
        ...prev,
        province: value,
        district: '',
        sector: '',
        cell: '',
        village: ''
      }));
      // Update available districts
      setAvailableDistricts(getDistricts(value));
      setAvailableSectors([]);
      setAvailableCells([]);
      setAvailableVillages([]);
    } else if (name === 'district') {
      // Reset dependent fields when district changes
      setFormData(prev => ({
        ...prev,
        district: value,
        sector: '',
        cell: '',
        village: ''
      }));
      // Update available sectors
      setAvailableSectors(getSectors(formData.province, value));
      setAvailableCells([]);
      setAvailableVillages([]);
    } else if (name === 'sector') {
      // Reset dependent fields when sector changes
      setFormData(prev => ({
        ...prev,
        sector: value,
        cell: '',
        village: ''
      }));
      // Update available cells
      setAvailableCells(getCells(formData.province, formData.district, value));
      setAvailableVillages([]);
    } else if (name === 'cell') {
      // Reset village when cell changes
      setFormData(prev => ({
        ...prev,
        cell: value,
        village: ''
      }));
      // Update available villages
      setAvailableVillages(getVillages(formData.province, formData.district, formData.sector, value));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        if (toast && toast.error) toast.error('Please select a valid image file');
      }
    }
  };

  const handleSave = async () => {
    if (!userId) {
      if (toast && toast.error) toast.error('User ID not available');
      return;
    }

    // Validate that we have some data to save
    const hasLocationData = formData.province || formData.district || formData.sector || formData.cell || formData.village;
    if (!hasLocationData && !selectedImage) {
      if (toast && toast.warning) toast.warning('Please fill in at least one field or select an image');
      return;
    }

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', userId);
      formDataToSend.append('province', formData.province || '');
      formDataToSend.append('district', formData.district || '');
      formDataToSend.append('sector', formData.sector || '');
      formDataToSend.append('cell', formData.cell || '');
      formDataToSend.append('village', formData.village || '');
      
      // Only append profile_image field if there's an actual file selected
      // API expects UploadFile, not empty string
      if (selectedImage) {
        formDataToSend.append('profile_image', selectedImage);
      }

      // Log what we're sending for debugging
      console.log('Profile update attempt:', {
        user_id: userId,
        province: formData.province || '',
        district: formData.district || '',
        sector: formData.sector || '',
        cell: formData.cell || '',
        village: formData.village || '',
        hasImage: !!selectedImage,
        imageType: selectedImage?.type
      });

      // Try multiple approaches - first try POST for create/update
      let res = await fetch('https://arlande-api.mababa.app/user-profile', {
        method: 'POST',
        // Don't set Content-Type header - let browser set it automatically for FormData
        // This ensures proper multipart/form-data boundary is set
        body: formDataToSend
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('Failed to parse response as JSON:', jsonErr);
        throw new Error(`Server returned non-JSON response (${res.status})`);
      }

      console.log('API Response:', { status: res.status, data });
      
      if (res.ok) {
        if (toast && toast.success) toast.success(data.message || 'Profile updated successfully');
        setIsEditing(false);
        setSelectedImage(null);
        setImagePreview(null);
        
        // Wait longer before reloading to ensure DB has time to commit
        setTimeout(async () => {
          await loadProfile(userId);
          // If still no profile after POST, try alternative approaches
          if (!profile) {
            console.log('Profile still not found after POST, this indicates API issue');
            if (toast && toast.warning) {
              toast.warning('Update succeeded but profile not retrievable. This may be an API database issue.');
            }
          }
        }, 2000);
      } else {
        // Handle specific error cases
        if (res.status === 422) {
          console.log('Validation errors:', data.detail);
          let errorMsg = 'Validation error';
          if (data.detail) {
            if (Array.isArray(data.detail)) {
              errorMsg = data.detail.map(e => {
                if (typeof e === 'object' && e.msg) {
                  return `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`;
                }
                return e.toString();
              }).join('; ');
            } else {
              errorMsg = data.detail.toString();
            }
          }
          if (toast && toast.error) toast.error(`Validation failed: ${errorMsg}`);
        } else if (res.status === 404) {
          if (toast && toast.error) toast.error('User not found');
        } else if (res.status === 405) {
          // Method not allowed - try PUT instead
          console.log('POST method not allowed, this suggests API configuration issue');
          if (toast && toast.error) toast.error('Profile creation/update not supported by API');
        } else {
          throw new Error(data.message || data.detail || `Failed to update profile (${res.status})`);
        }
      }
    } catch (err) {
      console.error('Profile save error:', err);
      if (toast && toast.error) toast.error(err.message || 'Failed to save profile - possible API or database issue');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        province: profile.province || '',
        district: profile.district || '',
        sector: profile.sector || '',
        cell: profile.cell || '',
        village: profile.village || ''
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    switch (userType) {
      case 'admin': return 'Admin Profile';
      case 'employee': return 'Employee Profile';
      case 'customer': return 'Customer Profile';
      default: return 'User Profile';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {getTitle()}
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faSave} />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-gray-300 dark:border-slate-600">
              {imagePreview || profile?.profile_image_url ? (
                <img
                  src={imagePreview || profile.profile_image_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                <FontAwesomeIcon icon={faCamera} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {selectedImage && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              New image selected: {selectedImage.name}
            </p>
          )}
        </div>

        {/* Location Information Section */}
        <div className="space-y-6">
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2 mb-4">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
              <span>Location Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Province <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Select Province</option>
                    {getProvinces().map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600">
                    {profile?.province || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    disabled={!formData.province}
                    required
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600">
                    {profile?.district || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sector <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    disabled={!formData.district}
                    required
                  >
                    <option value="">Select Sector</option>
                    {availableSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600">
                    {profile?.sector || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cell <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    name="cell"
                    value={formData.cell}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    disabled={!formData.sector}
                    required
                  >
                    <option value="">Select Cell</option>
                    {availableCells.map(cell => (
                      <option key={cell} value={cell}>{cell}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600">
                    {profile?.cell || 'Not set'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Village
                </label>
                {isEditing ? (
                  <select
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    disabled={!formData.cell}
                  >
                    <option value="">Select Village (Optional)</option>
                    {availableVillages.map(village => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                ) : (
                  <p className="px-3 py-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600">
                    {profile?.village || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!profile && !isEditing && (
          <div className="text-center py-8 border-t border-gray-200 dark:border-slate-700 mt-6">
            <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No profile information available. Click "Edit Profile" to add your details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}