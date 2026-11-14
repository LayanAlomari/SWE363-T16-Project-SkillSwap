import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

// Layan2's Messages page, now using the shared messages from AppContext.
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
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      <div className="grid min-h-[480px] grid-cols-1 overflow-hidden rounded-xl border bg-white md:grid-cols-[270px_minmax(0,1fr)]">
        {/* Conversation list (hidden on phones while a chat is open) */}
        <aside className={`min-w-0 border-b md:border-b-0 md:border-r ${selected ? "hidden md:block" : ""}`}>
          <input
            aria-label="Search conversations"
            className="m-3 w-[calc(100%-24px)] rounded-lg border p-3"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {visible.map((c) => (
            <button
              key={c.otherId}
              onClick={() => open(c.otherId)}
              className={`block w-full border-b p-4 text-left ${selected === c.otherId ? "bg-[#f3e2d8]" : "hover:bg-stone-50"}`}
            >
              <span className="flex items-center justify-between gap-2">
                <strong>{c.user?.name}</strong>
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
          <div className="flex items-center gap-2 border-b p-4">
            {selected && (
              <button type="button" onClick={() => setSearchParams({})} aria-label="Back to conversations" className="rounded-lg p-1 md:hidden">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-bold">
              {other ? (
                <Link to={`/users/${other.id}`} className="hover:text-[#633725] hover:underline">{other.name}</Link>
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
                  <div className={`max-w-[80%] rounded-xl p-3 ${mine ? "bg-[#633725] text-white" : "bg-[#f3e2d8]"}`}>
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <p className={`mt-1 text-right text-[11px] ${mine ? "text-white/70" : "text-stone-500"}`}>{formatTime(m.sentAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {other && !canChat && <p className="border-t p-3 text-sm text-stone-500">This member's account isn't active, so you can't message them.</p>}
          {canChat && (
            <form onSubmit={send} className="border-t p-3">
              <div className="flex gap-2">
                <input
                  aria-label="Message"
                  className="min-w-0 flex-1 rounded-lg border p-3"
                  value={text}
                  maxLength={1000}
                  onChange={(e) => {
                    setText(e.target.value);
                    setError("");
                  }}
                  placeholder="Type a message"
                />
                <button className="rounded-lg bg-[#633725] px-5 text-white disabled:opacity-50" disabled={!text.trim()}>
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
