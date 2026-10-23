"use client";

import { useMemo, useState } from "react";
import {
  Search, Plus, ArrowUpRight, MapPin, CalendarDays, Mail, X,
  Sparkles, ShieldCheck, PackageSearch, CheckCircle2, ChevronDown,
  Compass, HeartHandshake, SlidersHorizontal, SearchX, CircleHelp
} from "lucide-react";

const categories = ["All categories", "ID / Cards", "Electronics", "Bags", "Books", "Clothing", "Keys", "Accessories", "Other"];
const emptyForm = {
  title: "", type: "LOST", category: "Other", description: "",
  location: "", itemDate: new Date().toISOString().slice(0, 10),
  contactEmail: "", imageUrl: ""
};

function prettyDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function HomeClient({ initialItems, loadError }) {
  const [items, setItems] = useState(initialItems || []);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = typeFilter === "ALL" || item.type === typeFilter;
      const matchesCategory = categoryFilter === "All categories" || item.category === categoryFilter;
      const haystack = `${item.title} ${item.description} ${item.location} ${item.category}`.toLowerCase();
      return matchesType && matchesCategory && (!q || haystack.includes(q));
    });
  }, [items, query, typeFilter, categoryFilter]);

  const lostCount = items.filter((item) => item.type === "LOST").length;
  const foundCount = items.filter((item) => item.type === "FOUND").length;

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitReport(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit report.");
      setItems((current) => [data, ...current]);
      setForm({ ...emptyForm, itemDate: new Date().toISOString().slice(0, 10) });
      setModalOpen(false);
      setNotice("Your report is live. Keep an eye on new matches.");
      setTypeFilter("ALL");
      setCategoryFilter("All categories");
      setQuery("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function markReturned(item) {
    const confirmed = window.confirm("Mark this report as returned? It will disappear from the open listings.");
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/items/${item.id}/claim`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update item.");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setNotice("Marked as returned. Thank you for helping reunite an item with its owner.");
    } catch (err) {
      setError(err.message || "Could not update item.");
    }
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <nav className="topbar">
        <a className="brand" href="#" aria-label="Campus Find home">
          <span className="brand-mark"><Compass size={21} strokeWidth={2.3} /></span>
          <span>campus<span className="brand-light">find</span><small>THE CAMPUS LOST & FOUND</small></span>
        </a>
        <div className="nav-links">
          <a href="#browse">Browse items</a>
          <a href="#how-it-works">How it works</a>
        </div>
        <button className="button button-dark nav-cta" onClick={() => { setError(""); setModalOpen(true); }}>
          <Plus size={17} /> Post a report
        </button>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> A LITTLE KINDNESS GOES A LONG WAY</div>
          <h1>Lost something?<br /><span>Let’s bring it</span><br />back to you.</h1>
          <p className="hero-subtitle">Your campus is full of good people. Find your missing essentials or help someone get theirs back — all in one thoughtful place.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => { setForm({ ...emptyForm, type: "LOST" }); setError(""); setModalOpen(true); }}>
              I lost something <ArrowUpRight size={17} />
            </button>
            <button className="button button-soft" onClick={() => { setForm({ ...emptyForm, type: "FOUND" }); setError(""); setModalOpen(true); }}>
              I found something <HeartHandshake size={17} />
            </button>
          </div>
          <div className="trust-note"><ShieldCheck size={17} /> Made for your campus community <span>·</span> Simple. Helpful. Human.</div>
        </div>
        <div className="hero-visual" aria-label="Illustration of a lost and found card">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="float-pill float-top"><span className="mini-icon mini-mint"><CheckCircle2 size={16} /></span><span><b>Good news!</b><small>Someone found your ID</small></span><span className="pill-spark">✦</span></div>
          <div className="hero-object">
            <div className="object-glow" />
            <div className="card-shadow" />
            <div className="id-card">
              <div className="id-top"><span className="id-chip">STUDENT ID</span><Sparkles size={19} /></div>
              <div className="avatar-shape"><span /></div>
              <div className="id-lines"><i /><i /><i /></div>
              <div className="id-bottom"><span>CAMPUS PASS</span><span>•••• 2048</span></div>
            </div>
            <div className="key-ring"><div className="key-loop" /><div className="key-body"><i /><i /></div></div>
            <div className="sparkle sparkle-a">✦</div><div className="sparkle sparkle-b">✧</div>
          </div>
          <div className="float-pill float-bottom"><span className="mini-icon mini-lilac"><HeartHandshake size={16} /></span><span><b>Community powered</b><small>Small acts. Big relief.</small></span></div>
          <div className="visual-caption">A better way to find what matters.</div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Current open reports">
        <div className="stat"><span className="stat-icon stat-lost"><PackageSearch size={19} /></span><span><b>{lostCount}</b><small>Items reported lost</small></span></div>
        <div className="stat-divider" />
        <div className="stat"><span className="stat-icon stat-found"><HeartHandshake size={19} /></span><span><b>{foundCount}</b><small>Items found by students</small></span></div>
        <div className="stat-divider" />
        <div className="stat stat-message"><span className="stat-icon stat-kind"><Sparkles size={19} /></span><span><b>One campus</b><small>One helpful community</small></span></div>
      </section>

      <section className="browse-section" id="browse">
        <div className="section-heading">
          <div><div className="eyebrow">THE COMMUNITY BOARD</div><h2>Let’s find <span>your thing.</span></h2><p>Every post is a chance to turn someone’s day around.</p></div>
          <div className="heading-note"><span className="note-icon"><Sparkles size={16} /></span> You might be one search away.</div>
        </div>
        <div className="filter-panel">
          <div className="search-field"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item, place, or keyword..." aria-label="Search reports" />{query && <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</div>
          <div className="filter-separator" />
          <div className="type-tabs" role="group" aria-label="Filter by report type">
            {[["ALL", "Everything"], ["LOST", "Lost"], ["FOUND", "Found"]].map(([value, label]) => <button key={value} className={`type-tab ${typeFilter === value ? "active" : ""}`} onClick={() => setTypeFilter(value)}>{label}</button>)}
          </div>
          <div className="category-select-wrap"><SlidersHorizontal size={16} /><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter category">{categories.map((cat) => <option key={cat}>{cat}</option>)}</select><ChevronDown className="select-chevron" size={14} /></div>
        </div>

        {loadError && <div className="inline-alert"><CircleHelp size={18} /> The database could not be reached. Start the app and run <code>npx prisma db push</code> to initialize it.</div>}
        {notice && <div className="success-alert"><CheckCircle2 size={18} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button></div>}
        {error && !modalOpen && <div className="inline-alert">{error}<button onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div>}

        <div className="results-line"><span>{filteredItems.length} {filteredItems.length === 1 ? "report" : "reports"} to explore</span><span className="results-sort">Newest first <ChevronDown size={14} /></span></div>
        {filteredItems.length > 0 ? <div className="item-grid">
          {filteredItems.map((item) => <article className="item-card" key={item.id}>
            <div className={`item-image ${item.type === "LOST" ? "image-lost" : "image-found"}`}>
              {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <div className="image-placeholder"><span className="placeholder-orb" />{item.category === "Electronics" ? "⌁" : item.category === "ID / Cards" ? "▤" : item.category === "Books" ? "▥" : item.category === "Keys" ? "⚿" : item.category === "Bags" ? "▱" : "✳"}</div>}
              <span className={`status-label ${item.type === "LOST" ? "label-lost" : "label-found"}`}>{item.type === "LOST" ? "Lost item" : "Found item"}</span>
              <span className="category-label">{item.category}</span>
            </div>
            <div className="item-content">
              <div className="item-card-top"><h3>{item.title}</h3><span className="card-arrow"><ArrowUpRight size={16} /></span></div>
              <p className="item-description">{item.description}</p>
              <div className="item-meta"><span><MapPin size={14} />{item.location}</span><span><CalendarDays size={14} />{prettyDate(item.itemDate)}</span></div>
              <div className="card-footer"><a className="contact-link" href={`mailto:${encodeURIComponent(item.contactEmail)}?subject=${encodeURIComponent(`Campus Find: ${item.title}`)}`}><Mail size={15} /> Contact poster</a><button className="returned-button" onClick={() => markReturned(item)} title="Hide this listing after the item is returned"><CheckCircle2 size={15} /> Returned</button></div>
            </div>
          </article>)}
        </div> : <div className="empty-state"><span className="empty-icon"><SearchX size={27} /></span><h3>No matches just yet</h3><p>Try a different keyword or category. Or post a report to help the community.</p><button className="button button-primary" onClick={() => { setError(""); setModalOpen(true); }}>Post a report <Plus size={16} /></button></div>}
      </section>

      <section className="how-section" id="how-it-works">
        <div className="how-intro"><div className="eyebrow">THREE LITTLE STEPS</div><h2>Good things find<br /><span>their way home.</span></h2><p>No complicated process. Just people helping people.</p></div>
        <div className="steps">
          <div className="step"><span className="step-number">01</span><div className="step-icon step-peach"><PackageSearch size={22} /></div><h3>Post what happened</h3><p>Lost something or spotted an item? Share a few details so others can help.</p></div>
          <div className="step-connector">✳</div>
          <div className="step"><span className="step-number">02</span><div className="step-icon step-blue"><Search size={22} /></div><h3>Search the board</h3><p>Look through recent reports and filter by item, category, or campus location.</p></div>
          <div className="step-connector">✳</div>
          <div className="step"><span className="step-number">03</span><div className="step-icon step-green"><HeartHandshake size={22} /></div><h3>Make the reunion</h3><p>Contact the poster, verify ownership privately, and arrange a safe handover.</p></div>
        </div>
      </section>

      <section className="kindness-banner"><div className="banner-star">✳</div><div><h2>Found something? <span>Be someone’s good news.</span></h2><p>A small post could save someone’s whole day.</p></div><button className="button button-white" onClick={() => { setForm({ ...emptyForm, type: "FOUND" }); setError(""); setModalOpen(true); }}>Report a found item <ArrowUpRight size={17} /></button></section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark"><Compass size={19} /></span><span>campus<span className="brand-light">find</span><small>THE CAMPUS LOST & FOUND</small></span></a><span>Built with care for campus communities.</span><span>Be kind. Return what isn’t yours. <span className="footer-heart">♥</span></span></footer>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><div><div className="eyebrow">HELP THE COMMUNITY</div><h2 id="modal-title">Post a <span>report.</span></h2><p>Share the details. Someone might have the answer.</p></div><button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close form"><X size={20} /></button></div>
          <form onSubmit={submitReport}>
            <div className="form-type-switch"><button type="button" className={form.type === "LOST" ? "selected lost-selected" : ""} onClick={() => setForm({ ...form, type: "LOST" })}>I lost an item</button><button type="button" className={form.type === "FOUND" ? "selected found-selected" : ""} onClick={() => setForm({ ...form, type: "FOUND" })}>I found an item</button></div>
            <div className="form-grid">
              <label>Item name *<input name="title" value={form.title} onChange={updateField} required maxLength={100} placeholder="e.g. Blue water bottle" /></label>
              <label>Category *<select name="category" value={form.category} onChange={updateField} required>{categories.slice(1).map((cat) => <option key={cat}>{cat}</option>)}</select></label>
              <label className="form-full">Description *<textarea name="description" value={form.description} onChange={updateField} required maxLength={1000} rows={3} placeholder="Colour, brand, identifying details (don't share sensitive information)." /></label>
              <label>Campus location *<input name="location" value={form.location} onChange={updateField} required maxLength={150} placeholder="e.g. Library, 2nd floor" /></label>
              <label>Date *<input type="date" name="itemDate" value={form.itemDate} onChange={updateField} required /></label>
              <label className="form-full">Contact email *<input type="email" name="contactEmail" value={form.contactEmail} onChange={updateField} required maxLength={254} placeholder="you@example.com" /><small className="field-help">Visible on the listing in this demo. Use a dedicated email and avoid personal phone numbers.</small></label>
              <label className="form-full">Image URL (optional)<input type="url" name="imageUrl" value={form.imageUrl} onChange={updateField} placeholder="https://example.com/item-photo.jpg" /></label>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-bottom"><span><ShieldCheck size={16} /> Be careful with personal information.</span><button className="button button-primary" type="submit" disabled={busy}>{busy ? "Publishing..." : "Publish report"} <ArrowUpRight size={17} /></button></div>
          </form>
        </section>
      </div>}
    </main>
  );
}