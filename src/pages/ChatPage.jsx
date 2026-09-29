import React, { useState } from 'react';
import { Send, Image as ImageIcon, MapPin, Search, Check, CheckCheck, MoreVertical, Phone } from 'lucide-react';

const MOCK_DIALOGS = [
  {
    id: 1,
    name: "Alisher Vohidov",
    role: "Gid",
    avatar: "https://i.pravatar.cc/150?u=alisher",
    lastMessage: "Xo'p, ertaga soat 08:00 da vokzalda ko'rishamiz.",
    time: "10:45",
    unread: 0,
    online: true,
  },
  {
    id: 2,
    name: "Zuhra Karimova",
    role: "Turoperator",
    avatar: "https://i.pravatar.cc/150?u=zuhra",
    lastMessage: "Rahmat, sayohat yoqganidan xursandmiz!",
    time: "Kecha",
    unread: 2,
    online: false,
  }
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Assalomu alaykum! Sayohat dasturi bo'yicha savolim bor edi.", sender: 'me', time: '10:30' },
  { id: 2, text: "Va alaykum assalom! Eshitaman, qanday savol?", sender: 'them', time: '10:35' },
  { id: 3, text: "Ertalabki uchrashuv joyini aniqlashtirib olsak bo'ladimi?", sender: 'me', time: '10:38' },
  { id: 4, text: "Xo'p, ertaga soat 08:00 da vokzalda ko'rishamiz.", sender: 'them', time: '10:45' },
];

export default function ChatPage() {
  const [activeDialog, setActiveDialog] = useState(MOCK_DIALOGS[0]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
    
    // Auto-reply mock
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Tushunarli, aytganingizdek qilamiz.",
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-64px)]">
      <div className="flex h-full bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Xabarlar</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Qidirish..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm outline-none focus:border-neutral-900"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {MOCK_DIALOGS.map(dialog => (
              <div 
                key={dialog.id} 
                onClick={() => setActiveDialog(dialog)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-neutral-100 ${activeDialog.id === dialog.id ? 'bg-white' : 'hover:bg-neutral-100'}`}
              >
                <div className="relative">
                  <img src={dialog.avatar} alt={dialog.name} className="h-12 w-12 rounded-full object-cover" />
                  {dialog.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-neutral-900 truncate">{dialog.name}</h4>
                    <span className="text-[10px] text-neutral-500">{dialog.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${dialog.unread ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}>
                      {dialog.lastMessage}
                    </p>
                    {dialog.unread > 0 && (
                      <span className="h-4 w-4 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center ml-2 flex-shrink-0">
                        {dialog.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {/* Chat Header */}
          <div className="h-16 border-b border-neutral-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeDialog.avatar} alt={activeDialog.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-neutral-900 leading-tight">{activeDialog.name}</h3>
                <p className="text-xs text-neutral-500">{activeDialog.role} • {activeDialog.online ? 'Onlayn' : 'Yaqinda kirdi'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-neutral-500 hover:text-neutral-900 transition-colors">
                <Phone className="h-5 w-5" />
              </button>
              <button className="text-neutral-500 hover:text-neutral-900 transition-colors">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-neutral-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender === 'me' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-sm'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === 'me' ? 'text-emerald-200' : 'text-neutral-400'}`}>
                    <span className="text-[10px]">{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-neutral-200 bg-white">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <button type="button" className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
                <ImageIcon className="h-5 w-5" />
              </button>
              <button type="button" className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
                <MapPin className="h-5 w-5" />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Xabar yozing..." 
                className="flex-1 bg-neutral-100 border-none px-4 py-2.5 rounded-full text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button type="submit" disabled={!inputText.trim()} className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <Send className="h-5 w-5 ml-0.5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
