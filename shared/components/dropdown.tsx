import { useState, useRef, useEffect, Fragment } from "react";
import clsx from "clsx";

export interface DropdownItem {
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    dividerAfter?: boolean;
}

interface DropdownProps {
    items: DropdownItem[];
    trigger: React.ReactNode;
    align?: "left" | "right";
}

export default function Dropdown({ items, trigger, align = "left" }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
                {trigger}
            </div>

            {open && (
                <ul
                    role="menu"
                    className={clsx(
                        "absolute z-50 mt-1.5 min-w-40 list-none rounded-lg border border-slate-200 bg-background p-1 shadow-md",
                        align === "right" ? "right-0" : "left-0"
                    )}
                >
                    {items.map((item, i) => (
                        <span key={`${item}-${i}`}>
                            <li
                                role="menuitem"
                                onClick={() => {
                                    if (item.disabled) return;
                                    item.onClick();
                                    setOpen(false);
                                }}
                                className={clsx(
                                    "select-none rounded-md px-3 py-2 text-sm transition-colors",
                                    item.disabled
                                        ? "cursor-not-allowed text-slate-400"
                                        : item.danger
                                            ? "cursor-pointer text-error hover:bg-error/10"
                                            : "cursor-pointer text-slate-900 hover:bg-surface-low"
                                )}
                            >
                                {item.label}
                            </li>

                            {item.dividerAfter && (
                                <li key={`divider-${i}`} className="my-1 h-px bg-slate-200" />
                            )}
                        </span>
                    ))}
                </ul>
            )}
        </div>
    );
}