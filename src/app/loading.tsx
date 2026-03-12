export default function Loading() {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-[var(--bg)]">
            <div
                className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--brand-light)", borderTopColor: "var(--brand)" }}
            />
        </div>
    );
}
