import React, { useState, useEffect } from 'react';
import { createOrganization, updateOrganization } from '../services/api';

function OrganizationForm({ organization, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        contact: '',
        phone: '',
        alternative_phone: '',
        timezone: 'Asia/Colombo',
        region: '',
        language: 'English',
        website_url: '',
        max_coordinators: 5,
        logo_url: ''
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                slug: organization.slug || '',
                email: organization.email || '',
                contact: organization.contact || '',
                phone: organization.phone || '',
                alternative_phone: organization.alternative_phone || '',
                timezone: organization.timezone || 'Asia/Colombo',
                region: organization.region || '',
                language: organization.language || 'English',
                website_url: organization.website_url || '',
                max_coordinators: organization.max_coordinators || 5,
                logo_url: organization.logo_url || ''
            });
        }
    }, [organization]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from name
        if (name === 'name' && !organization) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));
        }

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Organization name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.website_url && !/^https?:\/\/.+\..+/.test(formData.website_url)) {
            newErrors.website_url = 'Invalid URL format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setSubmitting(true);

        try {
            if (organization) {
                await updateOrganization(organization.id, formData);
            } else {
                await createOrganization(formData);
            }
            onClose();
        } catch (err) {
            console.error('Error saving organization:', err);
            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert('Failed to save organization. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-backdrop">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {organization ? 'Edit Organization' : 'Add Organization'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name of the organization <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Text"
                                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="Type here"
                                className={`input-field ${errors.slug ? 'border-red-500' : ''}`}
                            />
                            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organization mail <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Type here"
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact
                            </label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="Type here"
                                className="input-field"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1-234-567-8900"
                                className="input-field"
                            />
                        </div>

                        {/* Alternative Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Alternative Phone
                            </label>
                            <input
                                type="tel"
                                name="alternative_phone"
                                value={formData.alternative_phone}
                                onChange={handleChange}
                                placeholder="+1-234-567-8900"
                                className="input-field"
                            />
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timezone
                            </label>
                            <select
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="Asia/Colombo">Asia/Colombo</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="Europe/London">Europe/London</option>
                                <option value="Asia/Tokyo">Asia/Tokyo</option>
                                <option value="Australia/Sydney">Australia/Sydney</option>
                            </select>
                        </div>

                        {/* Region */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Region
                            </label>
                            <input
                                type="text"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="Type here"
                                className="input-field"
                            />
                        </div>

                        {/* Language */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Language
                            </label>
                            <select
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                        </div>

                        {/* Website URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Official website URL
                            </label>
                            <input
                                type="url"
                                name="website_url"
                                value={formData.website_url}
                                onChange={handleChange}
                                placeholder="Gitam.edu"
                                className={`input-field ${errors.website_url ? 'border-red-500' : ''}`}
                            />
                            {errors.website_url && <p className="text-red-500 text-sm mt-1">{errors.website_url}</p>}
                        </div>

                        {/* Max Coordinators */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Allowed Coordinators
                            </label>
                            <input
                                type="number"
                                name="max_coordinators"
                                value={formData.max_coordinators}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                className="input-field"
                            />
                        </div>

                        {/* Logo URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo URL
                            </label>
                            <input
                                type="url"
                                name="logo_url"
                                value={formData.logo_url}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="input-field"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Saving...' : organization ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrganizationForm;