import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/Header';
import { useRouter } from 'next/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  receiverId: number;
  sender: User;
  receiver: User;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !user.id) {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, [user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (otherUserId: number) => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/messages?userId=${user.id}&otherUserId=${otherUserId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user?.id) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          senderId: user.id,
          receiverId: selectedUser.id
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        fetchConversations(); // Güncel konuşma listesi için
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim() || !user?.id) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Kendi kendine mesaj atmasını engelle
      const filteredResults = data.filter((u: User) => u.id !== user.id);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const selectUser = (selectedUser: User) => {
    setSelectedUser(selectedUser);
    setSearchQuery('');
    setSearchResults([]);
    fetchMessages(selectedUser.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user || !user.id) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 120px)', 
      backgroundColor: '#f0f2f5' 
    }}>
      {/* Sol Panel - Konuşmalar */}
      <div style={{ 
        width: '400px', 
        backgroundColor: '#fff', 
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Arama Alanı */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e0e0e0' 
        }}>
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '25px',
              outline: 'none',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Arama Sonuçları */}
        {searchResults.length > 0 && (
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            borderBottom: '1px solid #e0e0e0' 
          }}>
            {searchResults.map((searchUser) => (
              <div
                key={searchUser.id}
                onClick={() => selectUser(searchUser)}
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: '#f8f9fa'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                <div style={{ fontWeight: 'bold' }}>{searchUser.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{searchUser.email}</div>
              </div>
            ))}
          </div>
        )}

        {/* Konuşma Listesi */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#666' 
            }}>
              Henüz hiç konuşmanız yok. Yukarıdaki arama kutusunu kullanarak kullanıcı arayın.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.user.id}
                onClick={() => selectUser(conv.user)}
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: selectedUser?.id === conv.user.id ? '#e3f2fd' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (selectedUser?.id !== conv.user.id) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedUser?.id !== conv.user.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{conv.user.name}</div>
                <div style={{ 
                  fontSize: '13px', 
                  color: '#666',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {conv.lastMessage.content}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                  {formatTime(conv.lastMessage.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sağ Panel - Mesajlaşma Alanı */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            {/* Sohbet Başlığı */}
            <div style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#4e66d1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedUser.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{selectedUser.email}</div>
              </div>
            </div>

            {/* Mesajlar Alanı */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              backgroundColor: '#e5ddd5'
            }}>
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user.id;
                return (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '8px 12px',
                        borderRadius: '18px',
                        backgroundColor: isOwnMessage ? '#dcf8c6' : '#fff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ marginBottom: '5px' }}>{message.content}</div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#666', 
                        textAlign: 'right' 
                      }}>
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Mesaj Gönderme Alanı */}
            <div style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '10px'
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesajınızı yazın..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '25px',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#4e66d1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                  opacity: newMessage.trim() ? 1 : 0.5
                }}
              >
                Gönder
              </button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e5ddd5',
            color: '#666',
            fontSize: '18px'
          }}>
            Mesajlaşmaya başlamak için sol taraftan bir kullanıcı seçin
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage; 