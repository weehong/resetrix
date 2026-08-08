import { DEFAULT_PERSON, people, type Person } from "../data/people";

export function subdomainFromHostname(hostname: string): string {
  return hostname.split(".")[0] ?? "";
}

export function resolvePerson(hostname: string): Person {
  return people[subdomainFromHostname(hostname)] ?? DEFAULT_PERSON;
}
