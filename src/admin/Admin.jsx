import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { rs } from "../utils/format.js";
import {
  useProducts, updateProduct, addProduct, deleteProduct,
  discountPercent, priceFromDiscount,
} from "../utils/productStore.js";
import "./admin.css";
import { BRAND } from "../config/brand.js";

const BUCKET = "product-images";
const BLANK = { name: "", productCode: "", category: "Bracelets", mrp: "", price: "", discount: "", caption: "", clearance: false, inStock: true, images: [] };

// photo lahan karun (max 1000px) Supabase Storage madhe upload karto, public link det
async function uploadImage(file) {
  const bitmap = await createImageBitmap(file);
  const k = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bitmap.width * k);
  c.height = Math.round(bitmap.height * k);
  c.getContext("2d").drawImage(bitmap, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw new Error(error.message);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function Editor({ initial, onSave, onCancel }) {
  const [f, setF] = useState(() => ({
    ...BLANK, ...initial,
    mrp: initial?.mrp ?? "", price: initial?.price ?? "",
    discount: initial ? discountPercent(initial) : "",
  }));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const onMrp = (v) => setF((s) => ({ ...s, mrp: v, price: s.discount !== "" && v !== "" ? priceFromDiscount(v, s.discount) : s.price }));
  const onDiscount = (v) => setF((s) => ({ ...s, discount: v, price: s.mrp !== "" && v !== "" ? priceFromDiscount(s.mrp, v) : s.price }));
  const onPrice = (v) => setF((s) => ({
    ...s, price: v,
    discount: s.mrp > 0 && v !== "" ? Math.max(0, Math.round(((s.mrp - v) / s.mrp) * 100)) : s.discount,
  }));

  async function addFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setErr("");
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadImage(file));
      setF((s) => ({ ...s, images: [...s.images, ...urls] }));
    } catch (x) {
      setErr("Photo upload fail: " + x.message);
    }
    setBusy(false);
  }

  async function save(e) {
    e.preventDefault();
    const mrp = Number(f.mrp), price = Number(f.price);
    if (!f.name.trim()) return setErr("Product che nav taka.");
    if (!(price > 0)) return setErr("Selling price taka (kinva MRP + discount %).");
    if (mrp && mrp < price) return setErr("MRP selling price peksha kami nasava.");
    setErr("");
    setBusy(true);
    try {
      await onSave({
        name: f.name.trim(), productCode: String(f.productCode || "").trim(), category: f.category.trim() || "Bracelets",
        caption: f.caption, clearance: f.clearance, inStock: f.inStock, images: f.images,
        mrp: mrp || price, price,
      });
    } catch (x) {
      setErr("Save fail: " + x.message);
      setBusy(false);
    }
  }

  return (
    <form className="adm__form" onSubmit={save} noValidate>
      <h2>{initial ? "Edit product" : "Add new product"}</h2>
      <label>Product name<input value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
      <div className="adm__row3">
        <label>Product code<input value={f.productCode} onChange={(e) => set("productCode", e.target.value)} /></label>
        <label>Category<input value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="Bracelets, Earrings…" /></label>
        <span />
      </div>
      <div className="adm__row3">
        <label>MRP (₹)<input type="number" min="0" value={f.mrp} onChange={(e) => onMrp(e.target.value)} /></label>
        <label>Discount (%)<input type="number" min="0" max="100" value={f.discount} onChange={(e) => onDiscount(e.target.value)} /></label>
        <label>Selling price (₹)<input type="number" min="0" value={f.price} onChange={(e) => onPrice(e.target.value)} /></label>
      </div>
      <label>Description<textarea rows={3} value={f.caption} onChange={(e) => set("caption", e.target.value)} /></label>
      <label className="adm__check"><input type="checkbox" checked={f.clearance} onChange={(e) => set("clearance", e.target.checked)} /> Put in <b>Stock Clearance Sale</b></label>
      <label className="adm__check"><input type="checkbox" checked={f.inStock} onChange={(e) => set("inStock", e.target.checked)} /> In stock</label>

      <div>
        <p className="adm__label">Photos {busy && "(uploading…)"}</p>
        <div className="adm__imgs">
          {f.images.map((src, i) => (
            <div key={src + i} className="adm__img">
              <img src={src} alt="" />
              <button type="button" aria-label="Remove photo" onClick={() => set("images", f.images.filter((_, j) => j !== i))}>×</button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={addFiles} />
      </div>

      {err && <p className="login__error" role="alert">{err}</p>}
      <div className="adm__actions">
        <button type="submit" className="btn btn--solid" disabled={busy}>{busy ? "Please wait…" : "Save"}</button>
        <button type="button" className="btn btn--outline" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}

function Panel({ email }) {
  const products = useProducts();
  const [editing, setEditing] = useState(null); // product | "new" | null

  const run = async (fn) => {
    try { await fn(); } catch (e) { alert(e.message); }
  };

  return (
    <main className="adm">
      <div className="adm__top">
        <h1>Admin panel</h1>
        <div className="adm__top-btns">
          <span className="adm__note" style={{ margin: 0, padding: "4px 10px" }}>{email}</span>
          <Link to="/" className="adm__link">View shop</Link>
          <button type="button" className="adm__link" onClick={() => supabase.auth.signOut()}>Log out</button>
        </div>
      </div>

      {editing ? (
        <Editor
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSave={async (data) => {
            if (editing === "new") await addProduct(data);
            else await updateProduct(editing.id, data);
            setEditing(null);
          }}
        />
      ) : (
        <>
          <div className="adm__bar">
            <button type="button" className="btn btn--solid" onClick={() => setEditing("new")}>+ Add product</button>
            <span className="adm__note" style={{ margin: 0 }}>{products.length} products</span>
          </div>

          <ul className="adm__list">
            {products.map((p) => {
              const off = discountPercent(p);
              return (
                <li key={p.id} className="adm__item">
                  <img src={p.images?.[0]} alt="" className="adm__thumb" />
                  <div className="adm__info">
                    <b>{p.name}</b>
                    <span>{p.category} · Code {p.productCode || p.id}</span>
                    <span><s>{rs(p.mrp)}</s> <b>{rs(p.price)}</b> {off > 0 && <em>({off}% off)</em>}</span>
                    <label className="adm__check">
                      <input type="checkbox" checked={!!p.clearance} onChange={(e) => run(() => updateProduct(p.id, { clearance: e.target.checked }))} />
                      Stock clearance sale
                    </label>
                    <label className="adm__check">
                      <input type="checkbox" checked={p.inStock !== false} onChange={(e) => run(() => updateProduct(p.id, { inStock: e.target.checked }))} />
                      In stock
                    </label>
                  </div>
                  <div className="adm__btns">
                    <button type="button" className="btn btn--outline" onClick={() => setEditing(p)}>Edit</button>
                    <button type="button" className="adm__del" onClick={() => confirm(`Delete "${p.name}"?`) && run(() => deleteProduct(p.id))}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined = checking
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return setSession(null);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <main className="adm adm--login">
        <h1>Admin</h1>
        <p className="adm__note">Supabase connect nahi. Project chya main folder madhe <b>.env</b> file banva, mag <b>npm run dev</b> parat chalva.</p>
      </main>
    );
  }
  if (session === undefined) return <main className="adm adm--login"><p>Loading…</p></main>;

  // Google ne login kelelya customer la admin panel dakhvu naka
  if (session && session.user.email?.toLowerCase() !== BRAND.adminEmail.toLowerCase()) {
    return (
      <main className="adm adm--login">
        <div className="adm__form">
          <h1>Admin only</h1>
          <p className="adm__note">Ha page fakt admin sathi aahe. Tumhi {session.user.email} ne login aahat.</p>
          <button type="button" className="btn btn--solid" onClick={() => supabase.auth.signOut()}>Log out</button>
          <Link to="/" className="adm__link" style={{ textAlign: "center" }}>Back to shop</Link>
        </div>
      </main>
    );
  }
  if (session) return <Panel email={session.user.email} />;

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) setErr(error.message);
    setBusy(false);
  }

  return (
    <main className="adm adm--login">
      <form className="adm__form" onSubmit={login}>
        <h1>Admin login</h1>
        <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" aria-label="Admin email" autoFocus />
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" aria-label="Password" />
        {err && <p className="login__error" role="alert">{err}</p>}
        <button type="submit" className="btn btn--solid" disabled={busy}>{busy ? "Please wait…" : "Log in"}</button>
      </form>
    </main>
  );
}