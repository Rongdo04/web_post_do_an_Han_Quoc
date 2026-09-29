/**
 * Filters (faceted)
 * Props:
 *  - facets: [{ id, label, type: 'checkbox'|'select'|'chips', options: [{ value, label, count? }]}]
 *  - values: { [facetId]: value | value[] }
 *  - onChange: (updatedValues)=>void
 * Story:
 *  const facets = [
 *    { id: 'status', label: 'Status', type: 'chips', options:[{value:'draft',label:'Draft'},{value:'published',label:'Published'}]},
 *    { id: 'category', label: 'Category', type: 'select', options:[{value:'cat-1',label:'Healthy'}]},
 *    { id: 'tags', label: 'Tags', type: 'checkbox', options:[{value:'vegan',label:'Vegan'}]},
 *  ];
 *  <Filters facets={facets} values={values} onChange={setValues} />
 */
import React from "react";
import StatusPill from "./StatusPill.jsx";
import { t } from "../../i18n";

export default function Filters({ facets = [], values = {}, onChange }) {
  const update = (facetId, next) => {
    onChange && onChange({ ...values, [facetId]: next });
  };

  return (
    <div className="flex flex-wrap gap-4 items-start">
      {facets.map((f) => (
        <div key={f.id} className="flex flex-col gap-2 min-w-[160px]">
          <label
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a6b47]"
            htmlFor={`facet-${f.id}`}
          >
            {f.label}
          </label>
          {f.type === "select" && (
            <select
              id={`facet-${f.id}`}
              value={values[f.id] || ""}
              onChange={(e) => update(f.id, e.target.value || null)}
              className="rounded-2xl border border-[rgba(74,23,23,0.12)] bg-white px-3 py-2.5 text-sm text-[#2f1818] focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            >
              <option value="">{t("common.all", "All")}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          {f.type === "checkbox" && (
            <div className="flex flex-col gap-1">
              {f.options.map((o) => {
                const current = values[f.id] || [];
                const checked = current.includes(o.value);
                return (
                  <label
                    key={o.value}
                    className="inline-flex items-center gap-2 text-sm text-[#311818] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="accent-[#d4a373]"
                      checked={checked}
                      onChange={() => {
                        if (checked)
                          update(
                            f.id,
                            current.filter((x) => x !== o.value),
                          );
                        else update(f.id, [...current, o.value]);
                      }}
                    />
                    <span>{o.label}</span>
                    {typeof o.count === "number" && (
                      <span className="text-xs text-[#8b776a]">{o.count}</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
          {f.type === "chips" && (
            <div className="flex flex-wrap gap-2">
              {f.options.map((o) => {
                const active = values[f.id] === o.value;
                const statusChip = f.id === "status";
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => update(f.id, active ? null : o.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition border inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#d4a373] ${
                      active
                        ? "bg-brand text-white border-transparent shadow-brand"
                        : "bg-white border-[rgba(74,23,23,0.12)] text-[#7f1d1d] hover:bg-[#fff5e8]"
                    }`}
                    aria-pressed={active}
                  >
                    {statusChip ? (
                      <StatusPill status={o.value} minimal />
                    ) : (
                      o.label
                    )}
                    {!statusChip && typeof o.count === "number" && (
                      <span className="text-[#8b776a]">{o.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
