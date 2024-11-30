export const rosteringOptions = {
  Clever: {
    districtId: 'District ID',
    schoolId: 'School ID',
  },
  ClassLink: {
    districtId: 'Tenant ID',
    schoolId: 'Source ID',
  },
  GADOE: {
    systemId: 'System ID',
    schoolId: 'School ID',
  },
  GG4L: {
    districtId: 'District ID',
    schoolId: 'School ID',
  },
};

export const rosteringOptionsKeys = Object.keys(rosteringOptions) as (keyof typeof rosteringOptions)[];
export type RosteringOptionsKeys = typeof rosteringOptionsKeys;
export const rosteringTypes = Object.values(rosteringOptions);
export type RosteringAttributes = typeof rosteringTypes;
export type RosteringOptions = typeof rosteringOptions;

export type RosteringTypes = keyof typeof rosteringOptions;

export type NewRosterOptions = {
  [Key in RosteringTypes]: Record<string, string> & { type: Key };
};

export const allowedRosteringOrgTypes = [
  'charterSchool',
  'privateHighSchool',
  'privateMiddleSchool',
  'publicHighSchool',
  'publicMiddleSchool',
];
