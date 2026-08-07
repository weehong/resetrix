import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
	ApiForbiddenError,
	ApiUnauthorizedError,
	useApiClient,
} from "@/features/api/client";
import { ProfileSchema, type Profile } from "@/features/profile/profile";

export const PROFILE_QUERY_KEY = ["profile"] as const;

/**
 * Load the signed-in User's Profile from the API. 401/403 are terminal
 * states handled by the ProfileGate (login redirect vs. no-access), so only
 * transient failures are retried. Components under the gate share one cached
 * result for the stale-time window.
 */
export function useProfile(): UseQueryResult<Profile, Error> {
	const apiClient = useApiClient();

	return useQuery<Profile, Error>({
		queryKey: PROFILE_QUERY_KEY,
		queryFn: () => apiClient.get("/api/v1/me", ProfileSchema),
		retry: (failureCount, error) => {
			if (
				error instanceof ApiUnauthorizedError ||
				error instanceof ApiForbiddenError
			) {
				return false;
			}
			return failureCount < 2;
		},
		staleTime: 60_000,
	});
}
