import React from 'react';
import { withAuth } from '../components/hocs/withAuth';

const protectedHome = () => {
  return <div>protected home</div>;
};

export default withAuth(protectedHome);
