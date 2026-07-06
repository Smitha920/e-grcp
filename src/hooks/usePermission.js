import { useSelector } from 'react-redux'
import { selectUserRole } from '../store/slices/authSlice'

const PERMISSIONS = {
  admin: ['create', 'read', 'update', 'delete', 'approve', 'audit', 'configure'],
  manager: ['create', 'read', 'update', 'approve'],
  employee: ['create', 'read'],
  compliance: ['read', 'update'],
  auditor: ['read', 'audit'],
}

/**
 * Returns whether the current user has a given permission.
 * Usage: const canApprove = usePermission('approve')
 */
function usePermission(action) {
  const role = useSelector(selectUserRole)
  if (!role) return false
  return PERMISSIONS[role]?.includes(action) ?? false
}

export default usePermission
