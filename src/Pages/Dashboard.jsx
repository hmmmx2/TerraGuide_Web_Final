import React from 'react';
import AdminTop from '../components/AdminTop';
import Footer1 from '../components/Footer1';
import DCharts from '../components/DCharts';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  return (
    <>
      <AdminTop />
      <StatsCard/>
      <Footer1 />
    </>
  );
}
