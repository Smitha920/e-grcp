import React from 'react'
import { render, screen } from '@testing-library/react'
import StatusChip from '../../components/common/StatusChip'

describe('StatusChip', () => {
  it('renders "Pending" for status pending', () => {
    render(<StatusChip status="pending" />)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('renders "Approved" for status approved', () => {
    render(<StatusChip status="approved" />)
    expect(screen.getByText('Approved')).toBeInTheDocument()
  })

  it('renders "Rejected" for status rejected', () => {
    render(<StatusChip status="rejected" />)
    expect(screen.getByText('Rejected')).toBeInTheDocument()
  })

  it('renders "Critical" for status critical', () => {
    render(<StatusChip status="critical" />)
    expect(screen.getByText('Critical')).toBeInTheDocument()
  })

  it('renders "Active" for status active', () => {
    render(<StatusChip status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('falls back to status string for unknown status', () => {
    render(<StatusChip status="unknown_status" />)
    expect(screen.getByText('unknown_status')).toBeInTheDocument()
  })
})
