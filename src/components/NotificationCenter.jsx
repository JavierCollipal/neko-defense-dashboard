/**
 * 🔔 Notification Center Component
 * Real-time notifications using Socket.io
 */

import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Comment as CommentIcon,
  ThumbUp as LikeIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { io } from 'socket.io-client';

/**
 * NotificationCenter Component
 * @param {Object} currentUser - Current authenticated user
 */
const NotificationCenter = ({ currentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Initialize Socket.io connection
  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to Socket.io server');
      // Join user notification room
      newSocket.emit('join-notifications', currentUser._id);
    });

    newSocket.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      setNotifications((prev) => [notification, ...prev].slice(0, 20)); // Keep last 20
      setUnreadCount((prev) => prev + 1);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentUser, API_URL]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUnreadCount(0); // Mark all as read when opening
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <CommentIcon color="primary" />;
      case 'like':
        return <LikeIcon color="error" />;
      case 'featured':
        return <StarIcon color="warning" />;
      case 'trending':
        return <TrendingIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const open = Boolean(anchorEl);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 350, maxHeight: 500 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {notification.message}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {notification.time || 'Just now'}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && (
                    <Divider component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          )}

          <Divider />

          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button size="small" onClick={() => setNotifications([])}>
              Clear All
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationCenter;
