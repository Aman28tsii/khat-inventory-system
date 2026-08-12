import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield,
  Camera,
  Save,
  X,
  Edit2,
  UserCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { getCurrentUser, updateUser } from '../../users/slices/usersSlice';
import { useLanguage } from '../../../context/LanguageContext';

const UserProfile = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branchId: '',
    avatarUrl: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        branchId: user.branchId || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({
          ...formData,
          avatarUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      await dispatch(updateUser({ id: user.id, data: formData })).unwrap();
      await dispatch(getCurrentUser()).unwrap();
      toast.success(t('users.editProfile') + ' ' + t('common.success'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('errors.generic'));
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              {isEditing ? (
                <label className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 hover:bg-white/30 transition-colors">
                    {avatarPreview || formData.avatarUrl ? (
                      <img 
                        src={avatarPreview || formData.avatarUrl} 
                        alt={t('users.avatar')} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-16 h-16 text-white/70" />
                    )}
                    <Camera className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full p-1 text-primary-600" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.firstName} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-primary-100">{user.role?.name || t('user')}</p>
              <p className="text-primary-200 text-sm">
                {t('users.joined')} {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('users.profileInformation')}</h2>
            {!isEditing ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {t('users.editProfile')}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phone: user.phone || '',
                      branchId: user.branchId || '',
                      avatarUrl: user.avatarUrl || ''
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('users.saveChanges')}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label={t('users.firstName')}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('users.firstName')}
                  />
                  <Input
                    label={t('users.lastName')}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('users.lastName')}
                  />
                  <Input
                    label={t('email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('email')}
                    disabled
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.fullName')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('email')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <Input
                    label={t('users.phone')}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('users.phone')}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('users.role')}
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.role?.name || t('user')}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.phone')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.phone || t('common.none')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('users.role')}</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.role?.name || t('user')}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {user.branch && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('branches.branch')}</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.branch.name} ({user.branch.code})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;


