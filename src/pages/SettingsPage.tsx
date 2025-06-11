
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Eye, EyeOff, Save, X, User, Settings, Bell, Globe } from 'lucide-react';

interface SettingsData {
  profile: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    bio: string;
    avatar: string;
  };
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    emailNotifications: boolean;
    language: string;
    timezone: string;
  };
}

interface SettingsPageProps {
  onNavigate?: (path: string) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      bio: 'Creative storyteller and digital marketing enthusiast.',
      avatar: '',
    },
    preferences: {
      darkMode: false,
      notifications: true,
      emailNotifications: true,
      language: 'english',
      timezone: 'UTC-5',
    },
  });

  const [originalSettings, setOriginalSettings] = useState<SettingsData>(settings);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      setOriginalSettings(parsedSettings);
    }
  }, []);

  // Check for changes
  useEffect(() => {
    const hasProfileChanges = JSON.stringify(settings.profile) !== JSON.stringify(originalSettings.profile);
    const hasPreferenceChanges = JSON.stringify(settings.preferences) !== JSON.stringify(originalSettings.preferences);
    setHasChanges(hasProfileChanges || hasPreferenceChanges);
  }, [settings, originalSettings]);

  // Apply dark mode
  useEffect(() => {
    if (settings.preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.preferences.darkMode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!settings.profile.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!settings.profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(settings.profile.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only if trying to change password)
    if (settings.profile.newPassword) {
      if (!settings.profile.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (settings.profile.newPassword.length < 8) {
        newErrors.newPassword = 'New password must be at least 8 characters';
      }
      if (settings.profile.newPassword !== settings.profile.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (field: keyof SettingsData['profile'], value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handlePreferenceChange = (field: keyof SettingsData['preferences'], value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleProfileChange('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setOriginalSettings(settings);
    setHasChanges(false);

    // Clear password fields after successful save
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
    }));

    alert('Settings saved successfully!');
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setErrors({});
    setHasChanges(false);
  };

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
  ];

  const timezones = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+5:30', label: 'India Standard Time (UTC+5:30)' },
    { value: 'UTC+8', label: 'Singapore Time (UTC+8)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and settings</p>
          </div>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={settings.profile.avatar} alt="Profile picture" />
                <AvatarFallback className="text-lg">
                  {settings.profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Change Avatar
                  </Button>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </Label>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={settings.profile.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            {/* Password Change */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? 'text' : 'password'}
                      value={settings.profile.currentPassword}
                      onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                      className={errors.currentPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword.new ? 'text' : 'password'}
                      value={settings.profile.newPassword}
                      onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                      className={errors.newPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={settings.profile.confirmPassword}
                      onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                </div>
                <Switch
                  id="darkMode"
                  checked={settings.preferences.darkMode}
                  onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailNotifications"
                    checked={settings.preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked as boolean)}
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Language & Region */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <RadioGroup
                    value={settings.preferences.language}
                    onValueChange={(value) => handlePreferenceChange('language', value)}
                  >
                    {languages.map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={lang.value} id={lang.value} />
                        <Label htmlFor={lang.value}>{lang.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={settings.preferences.timezone}
                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Sticky */}
        {hasChanges && (
          <div className="sticky bottom-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">You have unsaved changes</p>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
