"use client";

export function WpLoading({ label = "読み込み中…" }: { label?: string }) {
  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <p>{label}</p>
      </div>
    </div>
  );
}

export function WpError({ message = "読み込みに失敗しました。" }: { message?: string }) {
  return (
    <div className="category elm">
      <div className="category-inr elm-inr">
        <p>{message}</p>
      </div>
    </div>
  );
}
