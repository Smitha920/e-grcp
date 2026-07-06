import React from 'react'
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Tooltip, useTheme
} from '@mui/material'
import {
  Dashboard, ShoppingCart, Business, Warning, VerifiedUser,
  ManageSearch, Approval, Notifications, Assessment, Settings
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/slices/authSlice'

const navItems = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['admin', 'manager', 'employee', 'auditor', 'compliance'] },
  { label: 'Procurement', icon: <ShoppingCart />, path: '/procurement', roles: ['admin', 'manager', 'employee'] },
  { label: 'Vendors', icon: <Business />, path: '/vendors', roles: ['admin', 'manager', 'compliance'] },
  { label: 'Risk Center', icon: <Warning />, path: '/risk', roles: ['admin', 'manager', 'compliance', 'auditor'] },
  { label: 'Compliance', icon: <VerifiedUser />, path: '/compliance', roles: ['admin', 'compliance', 'auditor'] },
  { label: 'Audit', icon: <ManageSearch />, path: '/audit', roles: ['admin', 'auditor'] },
  { label: 'Approvals', icon: <Approval />, path: '/approvals', roles: ['admin', 'manager'] },
  { label: 'Notifications', icon: <Notifications />, path: '/notifications', roles: ['admin', 'manager', 'employee', 'auditor', 'compliance'] },
  { label: 'Reports', icon: <Assessment />, path: '/reports', roles: ['admin', 'manager', 'auditor'] },
  { label: 'Settings', icon: <Settings />, path: '/settings', roles: ['admin', 'manager', 'employee', 'auditor', 'compliance'] },
]

function SidebarContent({ collapsed, onItemClick }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(selectUser)

  const handleNav = (path) => {
    navigate(path)
    if (onItemClick) onItemClick()
  }

  const visibleItems = navItems.filter(
    (item) => !user?.role || item.roles.includes(user.role)
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand */}
      <Box
        sx={{
          height: 64, display: 'flex', alignItems: 'center',
          px: collapsed ? 1.5 : 2.5, gap: 1.5, flexShrink: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 1.5, bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '0.75rem' }}>eG</Typography>
        </Box>
        {!collapsed && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main" noWrap>
              e-GRCP
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.65rem' }}>
              Enterprise Platform
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        <List dense disablePadding>
          {visibleItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <ListItem key={item.path} disablePadding sx={{ px: collapsed ? 0.5 : 1, mb: 0.25 }}>
                <Tooltip title={collapsed ? item.label : ''} placement="right">
                  <ListItemButton
                    onClick={() => handleNav(item.path)}
                    selected={isActive}
                    sx={{
                      borderRadius: 1.5,
                      minHeight: 40,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 1.5,
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                        '&:hover': { bgcolor: 'primary.dark' },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 'auto' : 36,
                        color: isActive ? 'inherit' : 'text.secondary',
                        '& svg': { fontSize: 20 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: isActive ? 600 : 400 }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* User info at bottom */}
      {!collapsed && (
        <Box
          sx={{
            px: 2, py: 1.5, borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            Signed in as
          </Typography>
          <Typography variant="caption" fontWeight={600} noWrap>
            {user?.name}
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            display="block"
            sx={{ textTransform: 'capitalize', fontSize: '0.7rem' }}
          >
            {user?.role} · {user?.department}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

function Sidebar({ width, collapsed, mobileOpen, onMobileClose, isMobile }) {
  const theme = useTheme()

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <SidebarContent collapsed={false} onItemClick={onMobileClose} />
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <SidebarContent collapsed={collapsed} />
    </Drawer>
  )
}

export default React.memo(Sidebar)
