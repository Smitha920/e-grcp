import React, { useEffect } from 'react'
import {
  Box, Card, CardContent, CardHeader, Divider, Button, Typography,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton, Tooltip
} from '@mui/material'
import { Notifications, DoneAll, Circle, Warning, CheckCircle, Error, Info } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, markAsRead, markAllAsRead, selectNotifications, selectUnreadCount } from '../../store/slices/notificationSlice'
import PageHeader from '../../components/common/PageHeader'

const TYPE_ICONS = {
  approval_required: { icon: <CheckCircle />, color: 'primary' },
  risk_alert: { icon: <Warning />, color: 'warning' },
  compliance_warning: { icon: <Error />, color: 'error' },
  request_approved: { icon: <CheckCircle />, color: 'success' },
  request_rejected: { icon: <Error />, color: 'error' },
  system: { icon: <Info />, color: 'info' },
}

const PRIORITY_COLORS = { critical: 'error', high: 'warning', normal: 'default', low: 'default' }

function NotificationCenter() {
  const dispatch = useDispatch()
  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadCount)

  useEffect(() => { dispatch(fetchNotifications()) }, [dispatch])

  return (
    <Box>
      <PageHeader
        title="Notification Center"
        subtitle="All system alerts, approvals, and notifications"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={
          unreadCount > 0 && (
            <Button startIcon={<DoneAll />} variant="outlined" size="small" onClick={() => dispatch(markAllAsRead())}>
              Mark All Read
            </Button>
          )
        }
      />

      <Card>
        <CardHeader
          title={`Notifications (${unreadCount} unread)`}
          titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
        />
        <Divider />
        <List disablePadding>
          {notifications.map((n, idx) => {
            const config = TYPE_ICONS[n.type] || { icon: <Notifications />, color: 'primary' }
            return (
              <React.Fragment key={n.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: n.read ? 'transparent' : 'action.hover',
                    '&:hover': { bgcolor: 'action.selected' },
                    cursor: 'pointer',
                    px: 3,
                  }}
                  onClick={() => !n.read && dispatch(markAsRead(n.id))}
                  secondaryAction={
                    <Chip
                      label={n.priority}
                      size="small"
                      color={PRIORITY_COLORS[n.priority]}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${config.color}.light`, width: 36, height: 36 }}>
                      {React.cloneElement(config.icon, { sx: { fontSize: 18, color: `${config.color}.main` } })}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {!n.read && <Circle sx={{ fontSize: 8, color: 'primary.main' }} />}
                        <Typography variant="body2" fontWeight={n.read ? 400 : 600}>{n.title}</Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">{n.message}</Typography>
                        <Typography variant="caption" color="text.disabled">{new Date(n.createdAt).toLocaleString()}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            )
          })}
          {notifications.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </Box>
          )}
        </List>
      </Card>
    </Box>
  )
}

export default NotificationCenter
