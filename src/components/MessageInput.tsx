"use client";

type Props = { value: string; onChange: (value: string) => void; onSubmit: () => void; placeholder: string; autoFocus?: boolean; onFocus?: () => void; disabled?: boolean };

export function MessageInput({ value, onChange, onSubmit, placeholder, autoFocus, onFocus, disabled }: Props) {
  return <div className="message-input">
    <span className="spark">✦</span>
    <input aria-label="여행 계획 메시지" autoFocus={autoFocus} value={value} disabled={disabled} onFocus={onFocus} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onSubmit()} placeholder={placeholder} />
    <button aria-label="메시지 보내기" type="button" onClick={onSubmit} disabled={!value.trim() || disabled}>↑</button>
  </div>;
}
