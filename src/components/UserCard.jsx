const UserCard = ({
  user,
  showActions = true,
  onIgnore,
  onInterested,
  className = "",
  style,
  actionsDisabled = false,
}) => {
  const { firstName, lastName, age, gender, about, photoUrl } = user;
  const displayName = `${firstName} ${lastName}`;

  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden rounded-2xl bg-slate-900 shadow-xl ring-1 ring-white/10 select-none touch-none ${className}`}
      style={style}
    >
      <figure className="relative aspect-[3/4] w-full">
        <img
          src={photoUrl}
          alt={displayName}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {displayName}
            {age ? `, ${age}` : ""}
          </h2>
          {gender && (
            <p className="mt-1 text-sm text-slate-300">{gender}</p>
          )}
        </div>
      </figure>

      <div className="px-5 py-4">
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          About
        </p>
        <p
          data-no-swipe
          className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-300"
        >
          {about || "No bio yet."}
        </p>

        {showActions && (
          <div
            data-no-swipe
            className="mt-5 flex items-center justify-center gap-4"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Pass"
              disabled={actionsDisabled}
              onClick={onIgnore}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-rose-400/40 bg-slate-800 font-mono text-xl leading-none text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/10 active:scale-95 disabled:opacity-50"
            >
              ×
            </button>
            <button
              type="button"
              aria-label="Interested"
              disabled={actionsDisabled}
              onClick={onInterested}
              className="flex h-12 w-12 items-center justify-center rounded-md border border-emerald-400/40 bg-emerald-500/15 font-mono text-xl leading-none text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/25 active:scale-95 disabled:opacity-50"
            >
              ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
