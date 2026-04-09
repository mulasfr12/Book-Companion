"use client";

import { useEffect, useState } from "react";
import { Target, CheckCircle2 } from "lucide-react";
import {
  getReadingGoal,
  setReadingGoal,
  getBooksFinishedThisMonth,
} from "@/lib/utils/storageHelpers";

export default function ReadingGoalCard() {
  const [goal, setGoalState] = useState<number | null>(null);
  const [finished, setFinished] = useState(0);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  function reload() {
    const g = getReadingGoal();
    setGoalState(g?.target ?? null);
    setFinished(getBooksFinishedThisMonth());
  }

  useEffect(() => { reload(); }, []);

  function handleSave() {
    const val = parseInt(input, 10);
    if (!val || val < 1) return;
    setReadingGoal(val);
    setGoalState(val);
    setEditing(false);
    reload();
  }

  const monthName = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (!goal && !editing) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Reading Goal</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Set a monthly reading goal to track your progress.
        </p>
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Set Goal
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Reading Goal</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          How many books do you want to finish in {monthName}?
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 3"
            className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((finished / goal!) * 100));
  const done = finished >= goal!;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {done ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Target className="h-4 w-4 text-primary" />
          )}
          <h3 className="text-sm font-semibold text-foreground">Reading Goal</h3>
        </div>
        <button
          onClick={() => { setInput(String(goal)); setEditing(true); }}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Edit
        </button>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{monthName}</p>

      {/* Progress bar */}
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>{finished} of {goal} books finished</span>
        <span className={done ? "text-green-500 font-semibold" : ""}>{percent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${done ? "bg-green-500" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {done && (
        <p className="mt-3 text-xs font-semibold text-green-500">
          🎉 Goal reached! Amazing work.
        </p>
      )}
    </div>
  );
}
