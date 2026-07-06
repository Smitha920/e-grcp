import React, { useEffect } from 'react'
import { Alert, Collapse } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { clearAlert, selectGlobalAlert } from '../../store/slices/uiSlice'

function GlobalAlert() {
  const dispatch = useDispatch()
  const alert = useSelector(selectGlobalAlert)

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => dispatch(clearAlert()), 5000)
      return () => clearTimeout(timer)
    }
  }, [alert, dispatch])

  return (
    <Collapse in={Boolean(alert)} sx={{ mb: alert ? 2 : 0 }}>
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => dispatch(clearAlert())}
          sx={{ mb: 1 }}
        >
          {alert.message}
        </Alert>
      )}
    </Collapse>
  )
}

export default GlobalAlert
