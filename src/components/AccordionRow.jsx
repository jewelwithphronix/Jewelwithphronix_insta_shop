import { useState } from "react";

export default function AccordionRow({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-row">
      <button
        type="button"
        className="accordion-row__header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {title}
        <span className={"accordion-row__chevron" + (open ? " accordion-row__chevron--open" : "")}>
          ⌄
        </span>
      </button>
      {open && <div className="accordion-row__body">{children}</div>}
    </div>
  );
}