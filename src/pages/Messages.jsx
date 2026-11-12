import React, { useState } from "react";

import { adminChats, userChats } from "../data/mockAdminData";

export default function Messages({ role = "user" }) {
const [chats, setChats] = useState(() =>
  role === "admin"
    ? structuredClone(adminChats)
    : structuredClone(userChats)
);
  const [selected, setSelected] = useState(1);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const active = chats.find((c) => c.id === selected);
  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === selected
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: Date.now(), from: "me", text: text.trim() },
              ],
            }
          : c,
      ),
    );
    setText("");
  }
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      <div className="grid min-h-[480px] overflow-hidden rounded-xl border bg-white md:grid-cols-[270px_1fr]">
        <aside className="border-b md:border-b-0 md:border-r">
          <input
            aria-label="Search conversations"
            className="m-3 w-[calc(100%-24px)] rounded-lg border p-3"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {chats
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={`block w-full border-b p-4 text-left ${selected === c.id ? "bg-[#f3e2d8]" : "hover:bg-stone-50"}`}
              >
                <strong>{c.name}</strong>
                <p className="truncate text-sm text-stone-500">
                  {c.messages[c.messages.length - 1]?.text}
                </p>
              </button>
            ))}
        </aside>
        <section className="flex min-h-[400px] flex-col">
          <h2 className="border-b p-4 font-bold">
            {active?.name || "Choose a conversation"}
          </h2>
          <div className="flex-1 space-y-3 p-4">
            {active?.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] rounded-xl p-3 ${m.from === "me" ? "bg-[#633725] text-white" : "bg-[#f3e2d8]"}`}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-3">
            <input
              aria-label="Message"
              className="min-w-0 flex-1 rounded-lg border p-3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
            />
            <button
              className="rounded-lg bg-[#633725] px-5 text-white"
              disabled={!text.trim()}
            >
              Send
            </button>
          </form>
        </section>
      </div>
    </>
  );
}