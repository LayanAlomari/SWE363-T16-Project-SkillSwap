import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

// Chat between two members.
// - Each member only sees their own conversations.
// - /messages?with=4 opens the chat with user 4 (used by the Message buttons), even if it's a new chat.
// - On phones the list and the chat are shown one at a time.
const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

export default function Messages() {
  const { currentUser, getUser, myConversations, sendMessage, markConversationRead } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = Number(searchParams.get("with")) || null;
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef(null);

  // The member I'm chatting with (can be someone I haven't messaged yet)
  const other = selected && selected !== currentUser.id ? getUser(selected) : null;
  const canChat = other && other.role !== "admin" && other.status === "Active";
  const active = myConversations.find((c) => c.otherId === selected);
  const chatMessages = active?.messages || [];

  // A new chat (no messages yet) is shown at the top of the list
  const list =
    other && !active ? [{ otherId: other.id, user: other, messages: [], last: null, unread: 0, isNew: true }, ...myConversations] : myConversations;
  const visible = list.filter((c) => c.user?.name.toLowerCase().includes(search.toLowerCase()));

  // Opening a chat marks it as read; new messages scroll into view
  useEffect(() => {
    if (selected) markConversationRead(selected);
  }, [selected, chatMessages.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [selected, chatMessages.length]);

  function open(id) {
    setSearchParams({ with: String(id) });
    setText("");
    setError("");
  }

  function send(e) {
    e.preventDefault();
    const result = sendMessage(selected, text);
    if (!result.ok) return setError(result.error);
    setText("");
    setError("");
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-stone-900">Messages</h1>
      <p className="mb-6 mt-1 text-stone-600">Chat with members to arrange your sessions.</p>
      <div className="grid min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border border-brand-light bg-white md:grid-cols-[270px_minmax(0,1fr)]">
        {/* Conversation list (hidden on phones while a chat is open) */}
        <aside className={`min-w-0 border-b border-brand-light md:border-b-0 md:border-r ${selected ? "hidden md:block" : ""}`}>
          <input
            aria-label="Search conversations"
            className="m-3 w-[calc(100%-24px)] rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {visible.map((c) => (
            <button
              key={c.otherId}
              onClick={() => open(c.otherId)}
              className={`block w-full border-b border-brand-light p-4 text-left ${selected === c.otherId ? "bg-brand-light" : "hover:bg-cream"}`}
            >
              <span className="flex items-center justify-between gap-2">
                <strong className="text-stone-900">{c.user?.name}</strong>
                {c.unread > 0 && (
                  <span className="rounded-full bg-red-600 px-2 text-xs font-bold text-white" aria-label={`${c.unread} unread`}>
                    {c.unread}
                  </span>
                )}
              </span>
              <p className={`truncate text-sm ${c.unread ? "font-semibold text-stone-800" : "text-stone-500"}`}>
                {c.isNew ? "New conversation" : `${c.last.fromId === currentUser.id ? "You: " : ""}${c.last.text}`}
              </p>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="p-4 text-sm text-stone-500">
              {search ? "No conversations found." : "No conversations yet. Use the Message button on a request or a profile to start one."}
            </p>
          )}
        </aside>

        {/* Chat */}
        <section className={`flex min-h-[400px] min-w-0 flex-col ${selected ? "" : "hidden md:flex"}`}>
          <div className="flex items-center gap-2 border-b border-brand-light p-4">
            {selected && (
              <button type="button" onClick={() => setSearchParams({})} aria-label="Back to conversations" className="rounded-lg p-1 md:hidden">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-bold text-stone-900">
              {other ? (
                <Link to={`/users/${other.id}`} className="hover:text-brand hover:underline">{other.name}</Link>
              ) : (
                "Choose a conversation"
              )}
            </h2>
          </div>

          <div className="max-h-[60vh] flex-1 space-y-3 overflow-y-auto p-4">
            {other && chatMessages.length === 0 && (
              <p className="py-10 text-center text-stone-500">Say hello to {other.name.split(" ")[0]}!</p>
            )}
            {chatMessages.map((m) => {
              const mine = m.fromId === currentUser.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 ${mine ? "bg-brand text-white" : "bg-brand-light text-stone-900"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={`mt-1 text-right text-[11px] ${mine ? "text-white/70" : "text-stone-500"}`}>{formatTime(m.sentAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {other && !canChat && <p className="border-t border-brand-light p-3 text-sm text-stone-500">This member's account isn't active, so you can't message them.</p>}
          {canChat && (
            <form onSubmit={send} className="border-t border-brand-light p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  value={text}
                  maxLength={1000}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError("");
                  }}
                  placeholder="Type a message"
                />
                <button className="rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50" disabled={!text.trim()}>
                  Send
                </button>
              </div>
              {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
            </form>
          )}
        </section>
      </div>
    </>
  );
}
