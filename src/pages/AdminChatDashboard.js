import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import '../StyleWeb/AdminChat.css';

const AdminChatDashboard = () => {
  const { adminToken, adminInfo } = useAdminAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const messagesEndRef = useRef(null);
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.2:5001';

  // Check if user is admin
  const isAdmin = adminInfo?.role === 'admin';

  // Debug logging
  console.log('Admin Info:', adminInfo);
  console.log('Admin Token:', adminToken);
  console.log('Is Admin:', isAdmin);

  useEffect(() => {
    if (adminInfo && adminToken && isAdmin) {
      loadAdminChats();
      setupSocketConnection();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [adminInfo, adminToken, isAdmin]);

  const setupSocketConnection = () => {
    const newSocket = io(API_BASE_URL, {
      transports: ['websocket'],
      auth: {
        token: adminToken
      }
    });

    newSocket.on('connect', () => {
      console.log('🔌 Admin connected to socket:', newSocket.id);
      newSocket.emit('adminConnect', { adminId: adminInfo._id || adminInfo.username });
    });

    newSocket.on('newUserMessage', (data) => {
      console.log('📱 New user message received:', data);
      // Refresh sessions list to show new message
      loadAdminChats();
      
      // If this session is currently selected, add message to chat
      if (selectedSession && selectedSession.session_id === data.sessionId) {
        addMessageToChat(data.message);
      }
    });

    newSocket.on('userTyping', (data) => {
      console.log('⌨️ User typing:', data);
      // You can add typing indicator here
    });

    newSocket.on('userOnline', (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    newSocket.on('userOffline', (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    setSocket(newSocket);
  };

  const loadAdminChats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/chat/admin/all-chats`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.data.success) {
        setSessions(response.data.data.sessions);
      }
    } catch (error) {
      console.error('Error loading admin chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSession = async (session) => {
    setSelectedSession(session);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/admin/sessions/${session.session_id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.data.success) {
        setMessages(response.data.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendAdminResponse = async () => {
    if (!inputText.trim() || !selectedSession) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/admin/sessions/${selectedSession.session_id}/respond`,
        { message: inputText.trim() },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );

      if (response.data.success) {
        // Add message to local state
        addMessageToChat(response.data.data.message);
        setInputText('');
        
        // Refresh sessions list to update last message
        loadAdminChats();
      }
    } catch (error) {
      console.error('Error sending admin response:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    }
  };

  const addMessageToChat = (message) => {
    setMessages(prev => [...prev, message]);
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSessionStatus = (session) => {
    if (session.status === 'active') {
      return <span className="status-badge active">Đang hoạt động</span>;
    } else if (session.status === 'closed') {
      return <span className="status-badge closed">Đã đóng</span>;
    } else {
      return <span className="status-badge archived">Đã lưu trữ</span>;
    }
  };

  const getUnreadCount = (session) => {
    // Count user messages since last admin response
    let count = 0;
    for (let i = session.messages?.length - 1; i >= 0; i--) {
      if (session.messages[i].is_user) {
        count++;
      } else {
        break; // Stop at first admin message
      }
    }
    return count;
  };

  if (!adminInfo || !isAdmin) {
    return (
      <div className="admin-chat-container">
        <div className="access-denied">
          <h2>🔒 Truy cập bị từ chối</h2>
          <p>Bạn cần đăng nhập với quyền admin để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-header">
        <h1>💬 Admin Chat Dashboard</h1>
        <p>Quản lý chat với khách hàng từ ứng dụng di động</p>
        <div className="admin-info">
          <span>👨‍💼 {adminInfo.name}</span>
          <span>🟢 Online</span>
        </div>
      </div>

      <div className="admin-chat-content">
        {/* Sessions List */}
        <div className="sessions-panel">
          <div className="sessions-header">
            <h3>Danh sách Chat ({sessions.length})</h3>
            <button 
              className="refresh-btn"
              onClick={loadAdminChats}
              disabled={loading}
            >
              🔄 {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
          
          <div className="sessions-list">
            {sessions.length === 0 ? (
              <div className="no-sessions">
                <p>📭 Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              sessions.map((session) => {
                const unreadCount = getUnreadCount(session);
                const isOnline = onlineUsers.has(session.user?._id);
                
                return (
                  <div
                    key={session.session_id}
                    className={`session-item ${selectedSession?.session_id === session.session_id ? 'selected' : ''}`}
                    onClick={() => selectSession(session)}
                  >
                    <div className="session-header">
                      <div className="user-info">
                        <div className="user-avatar">
                          {session.user?.full_name?.charAt(0) || 'K'}
                        </div>
                        <div className="user-details">
                          <h4>{session.user?.full_name || 'Khách hàng'}</h4>
                          <p>{session.user?.email}</p>
                        </div>
                      </div>
                      <div className="session-meta">
                        {getSessionStatus(session)}
                        <span className={`online-status ${isOnline ? 'online' : 'offline'}`}>
                          {isOnline ? '🟢' : '🔴'}
                        </span>
                      </div>
                    </div>
                    
                    {session.last_message && (
                      <div className="last-message">
                        <p className="message-preview">
                          {session.last_message.is_user ? '👤 ' : '👨‍💼 '}
                          {session.last_message.text}
                        </p>
                        <span className="message-time">
                          {formatTimestamp(session.last_message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    {unreadCount > 0 && (
                      <div className="unread-badge">
                        {unreadCount} tin nhắn mới
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-panel">
          {selectedSession ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <h3>💬 Chat với {selectedSession.user?.full_name || 'Khách hàng'}</h3>
                  <p>{selectedSession.user?.email}</p>
                  <div className="chat-meta">
                    <span>Session: {selectedSession.session_id}</span>
                    <span>Tin nhắn: {selectedSession.total_messages}</span>
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="action-btn close-btn"
                    onClick={() => {
                      // Implement close session functionality
                      alert('Tính năng đóng session sẽ được thêm sau');
                    }}
                  >
                    🔒 Đóng session
                  </button>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>📝 Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.message_id}_${index}`}
                        className={`message ${message.is_user ? 'user-message' : 'admin-message'}`}
                      >
                        <div className="message-content">
                          <div className="message-header">
                            <span className="message-sender">
                              {message.is_user ? '👤 Khách hàng' : '👨‍💼 Bạn'}
                            </span>
                            <span className="message-time">
                              {formatTimestamp(message.timestamp)}
                            </span>
                          </div>
                          <p className="message-text">{message.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="chat-input">
                <div className="input-container">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nhập tin nhắn phản hồi cho khách hàng..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendAdminResponse();
                      }
                    }}
                  />
                  <button
                    className="send-btn"
                    onClick={sendAdminResponse}
                    disabled={!inputText.trim()}
                  >
                    📤 Gửi
                  </button>
                </div>
                <div className="input-tips">
                  <small>💡 Nhấn Enter để gửi, Shift+Enter để xuống dòng</small>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="welcome-message">
                <h2>👋 Chào mừng đến với Admin Chat Dashboard</h2>
                <p>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hỗ trợ khách hàng.</p>
                <div className="stats">
                  <div className="stat-item">
                    <span className="stat-number">{sessions.length}</span>
                    <span className="stat-label">Cuộc trò chuyện</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{sessions.filter(s => s.status === 'active').length}</span>
                    <span className="stat-label">Đang hoạt động</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{onlineUsers.size}</span>
                    <span className="stat-label">Người dùng online</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
