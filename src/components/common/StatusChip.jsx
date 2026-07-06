import React from 'react'
import { Chip } from '@mui/material'

const STATUS_CONFIG = {
  // Procurement statuses
  pending: { label: 'Pending', color: 'warning' },
  approved: { label: 'Approved', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  escalated: { label: 'Escalated', color: 'info' },
  draft: { label: 'Draft', color: 'default' },

  // Vendor statuses
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'default' },
  under_review: { label: 'Under Review', color: 'warning' },

  // Risk levels
  critical: { label: 'Critical', color: 'error' },
  high: { label: 'High', color: 'error' },
  medium: { label: 'Medium', color: 'warning' },
  low: { label: 'Low', color: 'success' },

  // Document statuses
  valid: { label: 'Valid', color: 'success' },
  expired: { label: 'Expired', color: 'error' },
  expiring: { label: 'Expiring Soon', color: 'warning' },

  // Priority
  normal: { label: 'Normal', color: 'default' },
  urgent: { label: 'Urgent', color: 'warning' },
}

function StatusChip({ status, size = 'small', ...props }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'default' }
  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      {...props}
    />
  )
}

export default StatusChip
