import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Person, PersonCopy } from "../data/people";
import { resolvePerson } from "../lib/person";
import type { Locale } from "../lib/locale";

export interface PersonView extends Person, PersonCopy {
  person: Person;
  locale: Locale;
}

export function usePerson(): PersonView {
  const { i18n } = useTranslation();
  const person = useMemo(
    () => resolvePerson(window.location.hostname),
    [],
  );
  const locale: Locale = i18n.language === "zh-CN" ? "zh-CN" : "en";
  return { person, ...person, ...person.copy[locale], locale };
}
