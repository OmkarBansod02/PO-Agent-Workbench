"use client";

import { useState } from "react";
import type {
  ExtractedOrder,
  HumanReviewApprovals,
  WorkflowRun,
} from "@/lib/domain/types";
import { RunSectionCard } from "./RunSectionCard";

interface HumanReviewPanelProps {
  workflowRun: WorkflowRun;
  onReviewApplied: (updatedRun: WorkflowRun) => void;
}

interface ReviewFormState {
  poNumber: string;
  productName: string;
  quantity: string;
  color: string;
  sizeBreakdown: string;
  dueDate: string;
  artworkReference: string;
  shippingLocation: string;
  notes: string;
}

function initFormState(order: ExtractedOrder): ReviewFormState {
  return {
    poNumber: order.poNumber ?? "",
    productName: order.productName ?? "",
    quantity: order.quantity != null ? String(order.quantity) : "",
    color: order.color ?? "",
    sizeBreakdown: order.sizeBreakdown
      ? Object.entries(order.sizeBreakdown)
          .map(([size, qty]) => `${size}:${qty}`)
          .join(", ")
      : "",
    dueDate: order.dueDate ?? "",
    artworkReference: order.artworkReference ?? "",
    shippingLocation: order.shippingLocation ?? "",
    notes: order.notes ?? "",
  };
}

function buildCorrections(
  form: ReviewFormState,
  original: ExtractedOrder,
): Partial<ExtractedOrder> {
  const corrections: Partial<ExtractedOrder> = {};

  if (form.poNumber && form.poNumber !== (original.poNumber ?? "")) {
    corrections.poNumber = form.poNumber;
  }
  if (form.productName && form.productName !== (original.productName ?? "")) {
    corrections.productName = form.productName;
  }
  const qty = parseInt(form.quantity, 10);
  if (!isNaN(qty) && qty !== (original.quantity ?? 0)) {
    corrections.quantity = qty;
  }
  if (form.color !== (original.color ?? "")) {
    corrections.color = form.color || undefined;
  }
  if (form.dueDate && form.dueDate !== (original.dueDate ?? "")) {
    corrections.dueDate = form.dueDate;
  }
  if (
    form.artworkReference !== (original.artworkReference ?? "")
  ) {
    corrections.artworkReference = form.artworkReference || undefined;
  }
  if (
    form.shippingLocation !== (original.shippingLocation ?? "")
  ) {
    corrections.shippingLocation = form.shippingLocation || undefined;
  }
  if (form.notes !== (original.notes ?? "")) {
    corrections.notes = form.notes || undefined;
  }

  const parsedBreakdown = parseSizeBreakdown(form.sizeBreakdown);
  const originalBreakdownStr = original.sizeBreakdown
    ? Object.entries(original.sizeBreakdown)
        .map(([s, q]) => `${s}:${q}`)
        .join(", ")
    : "";
  const newBreakdownStr = parsedBreakdown
    ? Object.entries(parsedBreakdown)
        .map(([s, q]) => `${s}:${q}`)
        .join(", ")
    : "";
  if (newBreakdownStr !== originalBreakdownStr) {
    corrections.sizeBreakdown = parsedBreakdown ?? undefined;
  }

  return corrections;
}

function parseSizeBreakdown(
  value: string,
): Record<string, number> | null {
  if (!value.trim()) return null;
  const pairs = value.split(",").map((s) => s.trim());
  const result: Record<string, number> = {};
  for (const pair of pairs) {
    const [size, qtyStr] = pair.split(":").map((s) => s.trim());
    const qty = parseInt(qtyStr, 10);
    if (!size || isNaN(qty)) return null;
    result[size] = qty;
  }
  return Object.keys(result).length > 0 ? result : null;
}

function hasHardBlockers(run: WorkflowRun): boolean {
  return run.blockers.some((b) => b.blocksProgress && b.severity === "error");
}

function needsRushApproval(run: WorkflowRun): boolean {
  return run.blockers.some(
    (b) => b.code === "RUSH_ORDER" || b.code === "DUE_DATE_TOO_SOON",
  );
}

function needsArtworkApproval(run: WorkflowRun): boolean {
  return run.blockers.some(
    (b) => b.code === "ARTWORK_MISSING" || b.code === "ARTWORK_REQUIRED",
  );
}

export function HumanReviewPanel({
  workflowRun,
  onReviewApplied,
}: HumanReviewPanelProps) {
  const [form, setForm] = useState<ReviewFormState>(
    initFormState(workflowRun.extractedOrder),
  );
  const [approvals, setApprovals] = useState<HumanReviewApprovals>({
    rushApproved: false,
    artworkChangeApproved: false,
    customerConfirmed: false,
  });
  const [reviewerName, setReviewerName] = useState("Ops Reviewer");
  const [reviewerNote, setReviewerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof ReviewFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleApproval(key: keyof HumanReviewApprovals) {
    setApprovals((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const corrections = buildCorrections(form, workflowRun.extractedOrder);

    try {
      const res = await fetch("/api/workflow/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousRun: workflowRun,
          corrections,
          reviewerName: reviewerName.trim() || "Ops Reviewer",
          reviewerNote: reviewerNote.trim() || undefined,
          approvals,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error ?? `Review failed (${res.status})`,
        );
      }

      const data = await res.json();
      onReviewApplied(data.workflowRun);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const showRushApproval = needsRushApproval(workflowRun);
  const showArtworkApproval = needsArtworkApproval(workflowRun);
  const hardBlockersPresent = hasHardBlockers(workflowRun);

  return (
    <RunSectionCard title="Human Review">
      <form onSubmit={handleSubmit} className="space-y-5">
        {hardBlockersPresent && (
          <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5">
            <p className="text-xs font-medium text-danger">
              Hard blockers detected — correct the fields below before
              approving.
            </p>
          </div>
        )}

        <fieldset disabled={isSubmitting} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput
              label="PO Number"
              value={form.poNumber}
              onChange={(v) => updateField("poNumber", v)}
              placeholder="e.g. PO-2024-0142"
            />
            <FieldInput
              label="Product Name"
              value={form.productName}
              onChange={(v) => updateField("productName", v)}
              placeholder="e.g. Gildan G500 Tee"
            />
            <FieldInput
              label="Quantity"
              value={form.quantity}
              onChange={(v) => updateField("quantity", v)}
              placeholder="e.g. 250"
              type="number"
            />
            <FieldInput
              label="Color"
              value={form.color}
              onChange={(v) => updateField("color", v)}
              placeholder="e.g. Navy"
            />
            <FieldInput
              label="Size Breakdown"
              value={form.sizeBreakdown}
              onChange={(v) => updateField("sizeBreakdown", v)}
              placeholder="S:50, M:100, L:75, XL:25"
            />
            <FieldInput
              label="Due Date"
              value={form.dueDate}
              onChange={(v) => updateField("dueDate", v)}
              placeholder="e.g. 2024-08-15"
            />
            <FieldInput
              label="Artwork Reference"
              value={form.artworkReference}
              onChange={(v) => updateField("artworkReference", v)}
              placeholder="e.g. ART-2024-007"
            />
            <FieldInput
              label="Shipping Location"
              value={form.shippingLocation}
              onChange={(v) => updateField("shippingLocation", v)}
              placeholder="e.g. 123 Main St, City, ST 12345"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">
              Notes
            </label>
            <textarea
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
              rows={2}
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Additional order notes..."
            />
          </div>
        </fieldset>

        {(showRushApproval || showArtworkApproval) && (
          <div className="border-t border-border/40 pt-4">
            <h4 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
              Approvals
            </h4>
            <div className="space-y-2">
              {showRushApproval && (
                <ApprovalCheckbox
                  label="Rush approved"
                  description="Confirm the due date is acceptable under rush policy."
                  checked={!!approvals.rushApproved}
                  onChange={() => toggleApproval("rushApproved")}
                  disabled={isSubmitting}
                />
              )}
              {showArtworkApproval && (
                <ApprovalCheckbox
                  label="Artwork change approved"
                  description="Confirm the artwork reference or change is accepted."
                  checked={!!approvals.artworkChangeApproved}
                  onChange={() => toggleApproval("artworkChangeApproved")}
                  disabled={isSubmitting}
                />
              )}
              <ApprovalCheckbox
                label="Customer details confirmed"
                description="The operator has verified customer and order details."
                checked={!!approvals.customerConfirmed}
                onChange={() => toggleApproval("customerConfirmed")}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        <div className="border-t border-border/40 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldInput
              label="Reviewer"
              value={reviewerName}
              onChange={setReviewerName}
              placeholder="Your name"
            />
            <div>
              <label className="block text-xs font-medium text-muted mb-1">
                Operator Note
              </label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50 resize-none"
                rows={1}
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Reason for correction or approval..."
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5">
            <p className="text-xs text-danger">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Applying review…" : "Apply review and continue"}
          </button>
        </div>
      </form>
    </RunSectionCard>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function ApprovalCheckbox({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-accent/50"
      />
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
    </label>
  );
}
