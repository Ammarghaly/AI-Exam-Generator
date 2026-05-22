export default function CreateGroupPlaceholder() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors mb-md">
        <span className="material-symbols-outlined text-3xl">add</span>
      </div>
      <h3 className="font-h2 text-h2 text-on-surface-variant group-hover:text-primary transition-colors">Create New Group</h3>
      <p className="text-on-surface-variant font-body text-body mt-xs">Add a new class or study group</p>
    </div>
  );
}
