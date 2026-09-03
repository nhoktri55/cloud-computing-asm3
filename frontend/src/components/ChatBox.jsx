import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

export default function ChatBox({ listingId, otherEmail }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    const fetchMessages = () => {
        api.get(`/chat/${listingId}/${otherEmail}`)
            .then((res) => setMessages(res.data))
            .catch(() => { });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000); // Polling after 4s
        return () => clearInterval(interval);
    }, [listingId, otherEmail]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSending(true);
        try {
            await api.post('/chat', { listingId, toEmail: otherEmail, text: text.trim() });
            setText('');
            fetchMessages();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col h-96">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center mt-8">No messages yet. Say hi!</p>
                ) : (
                    messages.map((m) => (
                        <div
                            key={m.timestamp}
                            className={`flex ${m.fromEmail === user.email ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${m.fromEmail === user.email
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-900'
                                    }`}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={sending || !text.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}