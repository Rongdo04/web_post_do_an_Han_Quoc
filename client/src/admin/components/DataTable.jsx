/**
 * DataTable Component
 * Props:
 *  - columns: [{ id, header, accessor?: (row)=>any, cell?: (value,row)=>ReactNode, sortable?: bool }]
 *  - rows: [{ id, ...data }]
 *  - selectable: boolean
 *  - onBulkAction?: (selectedIds)=>void
 *  - sort: { id: string|null, direction: 'asc'|'desc'|null }
 *  - onSortChange?: ({ id, direction }) => void
 *  - emptyMessage?: string
 *  - loading?: boolean
 *
 * Story (demo):
 *  const cols = [
 *    { id: 'title', header: 'Title', sortable: true },
 *    { id: 'status', header: 'Status', cell: (v)=> <StatusPill status={v}/> },
 *    { id: 'author', header: 'Author', sortable: true },
 *  ];
 *  <DataTable
 *    columns={cols}
 *    rows={recipes}
 *    selectable
 *    sort={sort}
 *    onSortChange={setSort}
 *    onBulkAction={(ids)=> console.log('Bulk delete', ids)}
 *  />
 */
import React, { useState, useEffect } from "react";
import { t } from "../../i18n";
import StatusPill from "./StatusPill.jsx";

function SortIndicator({ active, direction }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-1 inline-block w-3 h-3 text-[10px] ${
        active ? "opacity-100" : "opacity-30"
      }`}
    >
      {direction === "asc" && "▲"}
      {direction === "desc" && "▼"}
      {!direction && "↕"}
    </span>
  );
}

export default function DataTable({
  columns = [],
  rows = [],
  selectable = false,
  onBulkAction,
  sort = { id: null, direction: null },
  onSortChange,
  emptyMessage = t("table.empty", "No data"),
  loading = false,
}) {
  const [selected, setSelected] = useState([]);

  // Reset selection if rows change
  useEffect(() => {
    setSelected([]);
  }, [rows]);

  const allChecked =
    selectable && rows.length > 0 && selected.length === rows.length;
  const indeterminate =
    selectable && selected.length > 0 && selected.length < rows.length;

  const toggleAll = () => {
    if (allChecked || indeterminate) setSelected([]);
    else setSelected(rows.map((r) => r.id || r._id));
  };

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleHeaderClick = (col) => {
    if (!col.sortable) return;
    let direction = "asc";
    if (sort.id === col.id) {
      if (sort.direction === "asc") direction = "desc";
      else if (sort.direction === "desc")
        direction = null; // cycle to unsorted
      else direction = "asc";
    }
    const payload = { id: direction ? col.id : null, direction };
    onSortChange && onSortChange(payload);
  };

  return (
    <div
      className="overflow-hidden rounded-[24px] border border-[rgba(74,23,23,0.08)] bg-[rgba(255,250,242,0.96)] shadow-[0_18px_44px_-36px_rgba(74,23,23,0.45)]"
      role="table"
      aria-rowcount={rows.length}
    >
      {selectable && selected.length > 0 && (
        <div className="flex items-center gap-3 border-b border-[rgba(74,23,23,0.08)] bg-[#fbf2e5] px-4 py-3 text-sm">
          <span className="font-medium text-[#311818]">
            {selected.length} {t("table.selected", "selected")}
          </span>
          {onBulkAction && (
            <button
              className="rounded-2xl bg-brand px-3 py-1.5 text-xs font-medium text-white shadow-brand focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              onClick={() => onBulkAction(selected)}
            >
              {t("table.bulkAction", "Bulk Action")}
            </button>
          )}
          <button
            className="ml-auto text-xs text-[#7f1d1d] hover:underline"
            onClick={() => setSelected([])}
          >
            {t("table.clear", "Clear")}
          </button>
        </div>
      )}
      <div className="overflow-auto" role="rowgroup">
        <table className="w-full text-sm">
          <thead className="bg-[rgba(46,22,22,0.96)] text-[#f7ead6] text-left">
            <tr role="row">
              {selectable && (
                <th scope="col" className="px-3 py-2 w-8 align-middle">
                  <input
                    type="checkbox"
                    aria-label={t("common.selectAll", "Select all rows")}
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = indeterminate;
                    }}
                    onChange={toggleAll}
                    className="accent-[#d4a373] cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const active = sort.id === col.id;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    className={`px-4 py-2 font-semibold text-xs uppercase tracking-wide select-none ${
                      col.sortable ? "cursor-pointer hover:bg-white/10" : ""
                    }`}
                    onClick={() => handleHeaderClick(col)}
                    aria-sort={
                      active
                        ? sort.direction === "asc"
                          ? "ascending"
                          : sort.direction === "desc"
                            ? "descending"
                            : "none"
                        : "none"
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable && (
                        <SortIndicator
                          active={active}
                          direction={active ? sort.direction : null}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-6 text-center text-[#7f1d1d] text-sm"
                >
                  {t("table.loading", "Loading...")}
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-[#8b776a] text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((row) => {
                const rowId = row.id || row._id;
                return (
                  <tr
                    key={rowId}
                    className="border-b border-[rgba(74,23,23,0.08)] last:border-b-0 hover:bg-[#fbf2e5] focus-within:bg-[#fbf2e5]"
                    role="row"
                  >
                    {selectable && (
                      <td className="px-3 py-2 align-middle">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${rowId}`}
                          checked={selected.includes(rowId)}
                          onChange={() => toggleOne(rowId)}
                          className="accent-[#d4a373] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const raw = col.accessor
                        ? col.accessor(row)
                        : row[col.id];
                      const content = col.cell ? col.cell(raw, row) : raw;
                      return (
                        <td
                          key={col.id}
                          className="px-4 py-2 align-middle text-[#311818] text-sm"
                          role="cell"
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
