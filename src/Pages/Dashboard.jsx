import React from 'react';
import AdminTop from '../components/AdminTop';
import RMO_Alert from '../components/RMO_Alert';
import Footer1 from '../components/Footer1';
import DCharts from '../components/DCharts';
import RMO from '../components/RMO'; 
import Sample from "../assets/sample.png";

export default function Dashboard() {

  return (
    <>
      <AdminTop />
      <RMO_Alert/>
      <DCharts/>
      <Footer1 />
    </>
  );
}
