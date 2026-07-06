import React, { useState, useCallback } from 'react'
import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar,
  Menu, MenuItem, Divider, Badge, Tooltip, InputBase, useTheme
} from '@mui/material'
import {
  Menu as MenuIcon, Search, Notifications, Brightness4, Brightness7,
  AccountCircle, Settings, Logout, KeyboardArrowDown
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleTheme, toggleSidebar, toggleMobileSidebar } from '../../store/slices/uiSlice'
import { logoutUser } from '../../store/slices/authSlice'
import { selectUnreadCount } from '../../store/slices/notificationSlice'
import { selectUser } from '../../store/slices/authSlice'

function Header({ isMobile }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const user = useSelector(selectUser)
  const unreadCount = useSelector(selectUnreadCount)
  const isDark = theme.palette.mode === 'dark'

  const [anchorEl, setAnchorEl] = useState(null)
  const [searchFocused, setSearchFocused] = useState(false)

  const handleProfileOpen = (e) => setAnchorEl(e.currentTarget)
  const handleProfileClose = () => setAnchorEl(null)

  const handleLogout = useCallback(async () => {
    handleProfileClose()
    await dispatch(logoutUser())
    navigate('/login')
  }, [dispatch, navigate])

  const handleSidebarToggle = () => {
    if (isMobile) dispatch(toggleMobileSidebar())
    else dispatch(toggleSidebar())
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: '64px !important' }}>
        {/* Sidebar toggle */}
        <IconButton onClick={handleSidebarToggle} size="small" sx={{ color: 'text.secondary' }}>
          <MenuIcon />
        </IconButton>

        {/* Logo / Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          <Box
            sx={{
              width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, fontSize: '0.7rem' }}>
              eG
            </Typography>
          </Box>
          {!isMobile && (
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" noWrap>
              e-GRCP
            </Typography>
          )}
        </Box>

        {/* Global Search */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 480,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: searchFocused ? 'action.focus' : 'action.hover',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            border: `1px solid ${searchFocused ? theme.palette.primary.main : 'transparent'}`,
            transition: 'all 0.2s',
          }}
        >
          <Search sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search requests, vendors, risks…"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            sx={{ fontSize: '0.875rem', flexGrow: 1 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Theme toggle */}
          <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={() => dispatch(toggleTheme())} size="small" sx={{ color: 'text.secondary' }}>
              {isDark ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="error" max={99}>
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer',
              px: 1, py: 0.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={handleProfileOpen}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            {!isMobile && (
              <Box sx={{ lineHeight: 1.2 }}>
                <Typography variant="caption" display="block" fontWeight={600} noWrap sx={{ maxWidth: 100 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                  {user?.role}
                </Typography>
              </Box>
            )}
            <KeyboardArrowDown sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/settings'); handleProfileClose() }}>
              <AccountCircle sx={{ mr: 1.5, fontSize: 18 }} /> My Profile
            </MenuItem>
            <MenuItem onClick={() => { navigate('/settings'); handleProfileClose() }}>
              <Settings sx={{ mr: 1.5, fontSize: 18 }} /> Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <Logout sx={{ mr: 1.5, fontSize: 18 }} /> Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default React.memo(Header)
