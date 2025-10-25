import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import OrganizationList from './components/OrganizationList';
import OrganizationDetails from './components/OrganizationDetails';

function App() {
    return (
        <div className="App">
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/organizations" replace />} />
                    <Route path="/organizations" element={<OrganizationList />} />
                    <Route path="/organization/:id" element={<OrganizationDetails />} />
                    <Route path="*" element={<Navigate to="/organizations" replace />} />
                </Routes>
            </Layout>
        </div>
    );
}

export default App;