import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import GlobalAlert from '../common/GlobalAlert'
import { selectSidebarCollapsed, selectSidebarMobileOpen, setMobileSidebarOpen } from '../../store/slices/uiSlice'
import { fetchNotifications } from '../../store/slices/notificationSlice'

const SIDEBAR_WIDTH = 260
const SIDEBAR_COLLAPSED_WIDTH = 72

function AppLayout() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const sidebarCollapsed = useSelector(selectSidebarCollapsed)
  const mobileOpen = useSelector(selectSidebarMobileOpen)

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  const handleMobileClose = () => dispatch(setMobileSidebarOpen(false))

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Sidebar
        width={sidebarWidth}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={handleMobileClose}
        isMobile={isMobile}
      />

      {/* Main area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ml: isMobile ? 0 : `${sidebarWidth}px`,
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Header isMobile={isMobile} />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: '64px', // header height
            overflow: 'auto',  //enables scrolling
          }}
        >
          <GlobalAlert />
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default AppLayout
