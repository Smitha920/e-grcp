import React, { useState } from 'react'
import {
  Box, Grid, Card, CardContent, CardHeader, Divider, TextField, Button,
  Typography, Switch, FormControlLabel, Avatar, Tabs, Tab, Select, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { Save, Security, Palette, Person } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, updateProfile } from '../../store/slices/authSlice'
import { toggleTheme, selectThemeMode } from '../../store/slices/uiSlice'
import { showAlert } from '../../store/slices/uiSlice'
import PageHeader from '../../components/common/PageHeader'

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
}

function UserSettings() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const themeMode = useSelector(selectThemeMode)
  const [tab, setTab] = useState(0)
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')

  const handleSaveProfile = () => {
    dispatch(updateProfile({ name }))
    dispatch(showAlert({ type: 'success', message: 'Profile updated successfully.' }))
  }

  return (
    <Box>
      <PageHeader
        title="User Settings"
        subtitle="Manage your profile, appearance and security preferences"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem', mx: 'auto', mb: 1.5 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="subtitle1" fontWeight={700}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary" display="block">{user?.email}</Typography>
            <Typography variant="caption" color="primary" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab label="Profile" icon={<Person fontSize="small" />} iconPosition="start" />
                <Tab label="Appearance" icon={<Palette fontSize="small" />} iconPosition="start" />
                <Tab label="Security" icon={<Security fontSize="small" />} iconPosition="start" />
              </Tabs>
            </Box>

            <CardContent>
              <TabPanel value={tab} index={0}>
                <Grid container spacing={2.5} sx={{ maxWidth: 500 }}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Full Name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email Address" size="small" value={email} disabled helperText="Email cannot be changed." />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Department" size="small" value={user?.department || ''} disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Role" size="small" value={user?.role || ''} disabled sx={{ textTransform: 'capitalize' }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" startIcon={<Save />} onClick={handleSaveProfile}>Save Changes</Button>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={tab} index={1}>
                <Box sx={{ maxWidth: 400 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>Color Theme</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={themeMode === 'dark'}
                        onChange={() => dispatch(toggleTheme())}
                      />
                    }
                    label={`${themeMode === 'dark' ? 'Dark' : 'Light'} Mode`}
                  />
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Choose between light and dark color schemes.
                  </Typography>
                </Box>
              </TabPanel>

              <TabPanel value={tab} index={2}>
                <Box sx={{ maxWidth: 500 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>Change Password</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}><TextField fullWidth label="Current Password" type="password" size="small" /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="New Password" type="password" size="small" /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Confirm New Password" type="password" size="small" /></Grid>
                    <Grid item xs={12}><Button variant="contained" startIcon={<Security />}>Update Password</Button></Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserSettings
