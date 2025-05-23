import React from 'react';
import { FaBell } from 'react-icons/fa';
import '../notification.css';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';

const notifications = {
  today: [
    {
      title: 'Intruder Approaching To Restricted Area',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
    {
      title: 'New Request – License Approve',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
  ],
  yesterday: [
    {
      title: 'New Request – License Renewal',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
    {
      title: 'New Request – License Approve',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam.',
    },
  ],
};

export default function NotificationPanel() {
  const handleMarkAll = e => {
    e.preventDefault();
    // TODO: implement marking all notifications as read
    console.log('Mark all as read clicked');
  };

  return (
    <>
      <AdminTop />
      <div className="notification-wrapper--large">
        <div className="notification-panel--large">
          <header className="notification-header--large">
            <a href="#" className="back">
              &#x2190;
            </a>
            <h2>Notifications</h2>
          </header>

          {['today', 'yesterday'].map(sectionKey => (
            <section className="section--large" key={sectionKey}>
              <div className="section-header--large">
                <span className="title">
                  {sectionKey === 'today' ? 'Today' : 'Yesterday'}
                </span>
                <button
                  className="mark-all-btn"
                  onClick={handleMarkAll}
                >
                  Mark all as read
                </button>
              </div>
              <ul className="notif-list--large">
                {notifications[sectionKey].map((n, i) => (
                  <li className="notif-item--large" key={i}>
                    <div className="notif-icon--large">
                      <FaBell />
                    </div>
                    <div className="notif-content--large">
                      <div className="title">{n.title}</div>
                      <div className="desc">{n.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <Footer1 />
    </>
  );
}
