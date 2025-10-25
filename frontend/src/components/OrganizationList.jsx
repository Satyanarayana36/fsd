import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizations, deleteOrganization, updateOrganizationStatus } from '../services/api';
import OrganizationForm from './OrganizationForm';

function OrganizationList() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await getOrganizations();
            setOrganizations(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load organizations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all associated users.`)) {
            try {
                await deleteOrganization(id);
                fetchOrganizations();
            } catch (err) {
                alert('Failed to delete organization');
                console.error(err);
            }
        }
    };

    const handleStatusChange = async (id, currentStatus) => {
        const statuses = ['Active', 'Blocked', 'Inactive'];
        const currentIndex = statuses.indexOf(currentStatus);
        const newStatus = statuses[(currentIndex + 1) % statuses.length];

        try {
            await updateOrganizationStatus(id, newStatus);
            fetchOrganizations();
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const handleEdit = (org) => {
        setSelectedOrg(org);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setSelectedOrg(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedOrg(null);
        fetchOrganizations();
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

    const filteredOrganizations = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-4">{error}</div>
                <button onClick={fetchOrganizations} className="btn-primary">
                    Try Again
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
                <span className="text-gray-900">Manage B2B organizations</span>
            </div>

            {/* Header */}
            <div className="card p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">B2B organizations</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your business-to-business partnerships
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Search organizations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field w-full sm:w-64"
                        />
                        <button onClick={handleAddNew} className="btn-primary whitespace-nowrap">
                            + Add organization
                        </button>
                    </div>
                </div>
            </div>

            {/* Organizations Table */}
            <div className="card">
                <div className="table-container">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Sr. No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Organizations
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Pending requests
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrganizations.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <p className="text-lg font-medium">No organizations found</p>
                                            <p className="text-sm mt-2">
                                                {searchTerm
                                                    ? 'Try adjusting your search'
                                                    : 'Get started by adding your first organization'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrganizations.map((org, index) => (
                                    <tr key={org.id} className="table-row-hover">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {org.logo_url ? (
                                                    <img
                                                        src={org.logo_url}
                                                        alt={org.name}
                                                        className="w-12 h-12 rounded-lg object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="logo-placeholder mr-3">
                                                        {getInitials(org.name)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {org.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {org.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {org.pending_requests || 0} pending requests
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleStatusChange(org.id, org.status)}
                                                className={getStatusBadgeClass(org.status)}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                                {org.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    to={`/organization/${org.id}`}
                                                    className="action-btn"
                                                    title="View Details"
                                                >
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(org)}
                                                    className="action-btn"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(org.id, org.name)}
                                                    className="action-btn action-btn-delete"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <OrganizationForm
                    organization={selectedOrg}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default OrganizationList;