import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronRight,
} from 'react-icons/fa';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import '../setting.css';

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out…');
    // e.g. auth.signOut().then(() => navigate('/login'));
  };

  return (
    <div className="settings-page-container">
      <AdminTop />

      <main className="settings-wrapper">
        <div className="settings-panel">
          {/* Header */}
          <header className="settings-header">
            <Link to="/" className="settings-back">
              <FaArrowLeft />
            </Link>
            <h2 className="settings-title">
              <FaCog className="settings-cog" />
              Settings
            </h2>
          </header>

          {/* Menu */}
          <ul className="settings-list">
            <li className="settings-item">
              <Link to="/accounts" className="settings-link">
                <div className="settings-item-left">
                  <FaUserCircle className="settings-item-icon" />
                  <span className="settings-item-text">Accounts</span>
                </div>
                <FaChevronRight className="settings-item-arrow" />
              </Link>
            </li>

            <li className="settings-item">
              <button
                className="settings-link logout-btn"
                onClick={handleLogout}
              >
                <div className="settings-item-left">
                  <FaSignOutAlt className="settings-item-icon" />
                  <span className="settings-item-text">Log Out</span>
                </div>
                <FaChevronRight className="settings-item-arrow" />
              </button>
            </li>
          </ul>
        </div>
      </main>

      <Footer1 />
    </div>
  )
}
