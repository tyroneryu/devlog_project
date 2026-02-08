import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, User, Loader2, Radio } from 'lucide-react';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  date: string;
}

const API_BASE = '';

const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  // Honeypot state: Humans won't see this, bots will fill it
  const [honey, setHoney] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/guestbook`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load guestbook", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      // Send the _honey field as well
      const res = await fetch(`${API_BASE}/api/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, _honey: honey }),
      });

      if (res.ok) {
        // Even if it was a honeypot trap, we clear the form to simulate success for the user (or bot)
        await fetchMessages(); // Refresh real messages
        setMessage('');
        setHoney('');
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Failed to post message", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
      <section id="guestbook" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Header & Form */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <Radio size={20} className="text-pink-500 animate-pulse" />
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest font-mono">Communication Log</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Leave a <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Signal</span>.
            </h2>
            <p className="text-neutral-400 text-lg mb-12">
              Connect with the network. Drop a message, a query, or just say hello to the system.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900/30 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">

              {/* HONEYPOT FIELD (Hidden from humans) */}
              <div className="opacity-0 absolute -z-10 h-0 w-0 overflow-hidden">
                <label htmlFor="honey">Do not fill this out if you are human</label>
                <input
                    type="text"
                    id="honey"
                    name="honey"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-2 uppercase">Identify Yourself</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-neutral-600" size={18} />
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Codename / Name"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors"
                      maxLength={30}
                      required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-2 uppercase">Transmission Data</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    className="w-full h-32 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                    maxLength={280}
                    required
                />
              </div>

              <button
                  type="submit"
                  disabled={submitting || !name || !message}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {submitting ? 'Transmitting...' : 'Transmit Signal'}
              </button>
            </form>
          </div>

          {/* Message Feed */}
          <div className="lg:col-span-7">
            <div className="h-[600px] overflow-y-auto custom-scrollbar bg-black/20 rounded-3xl border border-white/5 p-2">
              {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 gap-4">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="font-mono text-sm">SYNCING LOGS...</p>
                  </div>
              ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600 gap-4">
                    <MessageSquare size={32} />
                    <p className="font-mono text-sm">NO SIGNALS DETECTED. BE THE FIRST.</p>
                  </div>
              ) : (
                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {messages.map((msg) => (
                          <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-white/10 transition-colors group"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-pink-500/20">
                                  <span className="text-xs font-bold text-pink-400">{msg.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <span className="font-bold text-neutral-200">{msg.name}</span>
                              </div>
                              <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">{formatDate(msg.date)}</span>
                            </div>
                            <p className="text-neutral-400 leading-relaxed text-sm md:text-base pl-11">
                              {msg.message}
                            </p>
                          </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
              )}
            </div>
          </div>

        </div>
      </section>
  );
};

export default Guestbook;
