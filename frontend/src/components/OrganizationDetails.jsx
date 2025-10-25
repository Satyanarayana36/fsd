import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrganization, updateOrganizationStatus } from '../services/api';
import UserList from './UserList';

function OrganizationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchOrganization();
    }, [id]);

    const fetchOrganization = async () => {
        try {
            setLoading(true);
            const response = await getOrganization(id);
            setOrganization(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to load organization details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateOrganizationStatus(id, newStatus);
            fetchOrganization();
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Active':
                return 'status-active';
            case 'Blocked':
                return 'status-blocked';
            case 'Inactive':
                return 'status-inactive';
            default:
                return 'status-badge bg-gray-200 text-gray-800';
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">{error || 'Organization not found'}</div>
                <button onClick={() => navigate('/organizations')} className="btn-primary">
                    Back to Organizations
                </button>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Breadcrumb */}
            <div className="breadcrumb mb-6">
                <Link to="/">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                </Link>
                <span className="breadcrumb-separator">/</span>
                <Link to="/organizations">Manage B2B organizations</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="text-gray-900">Organization details</span>
            </div>

            {/* Organization Header */}
            <div className="card p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {organization.logo_url ? (
                            <img
                                src={organization.logo_url}
                                alt={organization.name}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                {getInitials(organization.name)}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {organization.email}
                                </span>
                                <span className="hidden sm:block">•</span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {organization.organization_id}
                                </span>
                                {organization.website_url && (
                                    <>
                                        <span className="hidden sm:block">•</span>
                                        <a
                                            href={organization.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-primary hover:underline"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {organization.website_url}
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={getStatusBadgeClass(organization.status)}>
                            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                            {organization.status}
                        </div>
                        <button
                            onClick={() => navigate('/organizations')}
                            className="btn-secondary"
                        >
                            Change status
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="card mb-6">
                <div className="border-b border-gray-200">
                    <div className="flex gap-8 px-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'details'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Basic details
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'users'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Users
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'details' ? (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                                <button className="text-primary hover:text-primary-700 flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>

                            {/* Organization Details */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Organization details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Organization name</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Organization SLUD</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.slug}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Primary Admin name</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.contact || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Primary Admin Mail Id</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Support Email ID</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Phone no</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Alternative phone no</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.alternative_phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Maximum Allowed Coordinators</h3>
                                    <p className="text-sm text-gray-900">Upto {organization.max_coordinators} Coordinators</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Timezone</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Current time</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.timezone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Region</label>
                                            <p className="text-sm text-gray-900 mt-1">{organization.region || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Language</h3>
                                    <p className="text-sm text-gray-900">{organization.language || 'English'}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Official website URL</h3>
                                    {organization.website_url ? (
                                        <a
                                        
                                            href={organization.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {organization.website_url}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-900">N/A</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <UserList organizationId={id} organizationName={organization.name} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrganizationDetails;