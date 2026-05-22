import { useQuery } from '@tanstack/react-query';
import GroupCard from '../components/groups/GroupCard';
import CreateGroupPlaceholder from '../components/groups/CreateGroupPlaceholder';
import { useSearchStore } from '../stores/use-search-store';
import { useModalStore } from '../stores/use-modal-store';
import { getMyGroups } from '../api/groups';

export default function MyGroups() {
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const { openModal } = useModalStore();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['myGroups'],
    queryFn: getMyGroups,
  });

  const backendGroups = response?.data || [];

  const groups = backendGroups.map((g: any, index: number) => {
    // Array of fallback colors and icons to make the list look colorful
    const styles = [
      { icon: 'functions', bg: 'bg-primary-fixed-dim', text: 'text-primary' },
      { icon: 'terminal', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
      { icon: 'biotech', bg: 'bg-tertiary-fixed-dim', text: 'text-tertiary' },
      { icon: 'history_edu', bg: 'bg-primary-fixed-dim', text: 'text-primary' },
      { icon: 'calculate', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    ];
    
    const style = styles[index % styles.length];

    return {
      id: g._id,
      title: g.groupName,
      studentsCount: g.students?.length || 0,
      examsCount: 0, // Hardcoded for now until backend supports it
      isActive: true,
      icon: style.icon,
      iconBgClass: style.bg,
      iconTextClass: style.text,
      avatars: [],
      extraAvatarsCount: g.students?.length || 0,
    };
  });

  const filteredGroups = groups.filter((group: any) =>
    group.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-xl">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface">My Groups</h2>
          <p className="text-on-surface-variant font-body text-body mt-xs">
            Manage and monitor your active learning communities
          </p>
        </div>
        <button 
          onClick={() => openModal('createGroup')}
          className="bg-primary text-on-primary px-lg py-md rounded-xl font-h3 text-h3 flex items-center gap-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined">group_add</span>
          Create New Group
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-xl">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>
      ) : error ? (
        <div className="bg-error-container text-on-error-container p-lg rounded-xl text-center">
          Failed to load groups. Please try again.
        </div>
      ) : (
        /* Bento Grid Layout for Groups */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredGroups.map((group: any) => (
            <GroupCard key={group.id} {...group} />
          ))}
          <div onClick={() => openModal('createGroup')} className="cursor-pointer">
            <CreateGroupPlaceholder />
          </div>
        </div>
      )}
    </div>
  );
}
