/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not `tailwind-merge`: the primitives in components/ui build
 * their classes so that a caller's `className` always comes last and therefore
 * wins on cascade order for the properties it sets. That covers the cases a
 * small primitive set actually hits, and avoids a dependency whose job is to
 * paper over conflicting utilities we can simply not emit.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
	return parts.filter(Boolean).join(" ");
}
