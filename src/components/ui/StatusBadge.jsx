// src/components/ui/StatusBadge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const statusStyles = {
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Not Started': 'bg-gray-100 text-gray-800',
  'Upcoming': 'bg-yellow-100 text-yellow-800',
  'Overdue': 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', style)}>
      {status}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};
