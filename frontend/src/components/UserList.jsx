import React, { useState, useEffect } from 'react';
import { getUsersByOrganization, deleteUser, updateUserStatus } from '../services/api';
import UserForm from './UserForm';

function UserList({ organizationId, organizationName }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [organizationId]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsersByOrganization(organizationId);
            setUsers(response.data.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user');
                console.error(err);
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedUser(null);
        fetchUsers();
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Active':
                return 'status-active';
            case 'Co-ordinator':
                return 'status-coordinator';
            case 'Inactive':
                return 'status-inactive';
            default:
                return 'status-badge bg-gray-200 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-4">{error}</div>
                <button onClick={fetchUsers} className="btn-primary">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <button onClick={handleAddNew} className="btn-primary">
                    + Add user
                </button>
            </div>

            {/* Users Table */}
            {users.length === 0 ? (
                <div className="empty-state py-12">
                    <div className="empty-state-icon">👥</div>
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm mt-2">Get started by adding your first user</p>
                    <button onClick={handleAddNew} className="btn-primary mt-4">
                        + Add user
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Sr. No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={user.id} className="table-row-hover">
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={getStatusBadgeClass(user.status)}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="action-btn"
                                                title="Edit"
                                            >
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <UserForm
                    user={selectedUser}
                    organizationId={organizationId}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default UserList;