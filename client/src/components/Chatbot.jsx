import React, { useState, useRef, useEffect } from 'react';

const faqPairs = [
  {
    q: 'How do I submit a new User ID request?',
    a: 'Click on "Fill Form" in the Navbar, fill out the required details, and submit the form.'
  },
  {
    q: 'How can I track my application status?',
    a: 'Go to "Track Application Status" and enter your Ticket No. or Email ID to see the current status.'
  },
  {
    q: 'Who can approve my request?',
    a: 'Your request is approved stepwise by IT Assistant, IT Officer, and IT Head in order.'
  },
  {
    q: 'How do I download my application as PDF?',
    a: 'Open your application in Dashboard > View Details and click the "Download PDF" button.'
  },
  {
    q: 'Need more help?',
    a: 'Contact support at support@nagarpalika.gov.in.'
  }
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text: msg }]);
    // Find answer
    const found = faqPairs.find(faq => faq.q.toLowerCase() === msg.toLowerCase());
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: found ? found.a : 'Sorry, I can only answer common questions. Please check the Help/FAQ or contact support.' }
      ]);
    }, 600);
    setInput('');
  };

  const handleFaqClick = (faq) => {
    handleSend(faq.q);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 right-24 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setOpen((o) => !o)}
        aria-label="Chatbot"
      >
        💬
      </button>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between bg-green-600 text-white px-4 py-2">
            <span className="font-bold">Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-xl">×</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto max-h-80" style={{ minHeight: 180 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-wrap gap-2 mb-2">
              {faqPairs.map((faq, idx) => (
                <button
                  key={idx}
                  className="bg-green-100 hover:bg-green-200 text-green-800 rounded-full px-3 py-1 text-xs font-semibold"
                  onClick={() => handleFaqClick(faq)}
                >
                  {faq.q}
                </button>
              ))}
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                className="flex-1 rounded-full px-3 py-2 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm bg-white dark:bg-gray-900"
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 font-semibold text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 