import type { Role } from '../../types/role';

const roleBadgeStyles: Record<Role, string> = {
  Manager: 'bg-emerald-500/90 text-white',
  Tenant: 'bg-white/90 text-slate-700',
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${roleBadgeStyles[role]} ${className}`}
    >
      {role}
    </span>
  );
}

interface CheckmarkIconProps {
  className?: string;
}

export function CheckmarkIcon({ className = 'h-4 w-4' }: CheckmarkIconProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PropertyImage({ src, alt, className = '' }: PropertyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
