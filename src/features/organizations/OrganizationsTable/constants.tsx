import { CellProps, Column } from 'react-table';
import { CoreTypography } from '@youscience/core';
import { TenantDocument } from '@youscience/user-service-common';
import { Option } from '@interfaces';

export const ORGANIZATIONS_TABLE_SIZE = 50;

export const ORGANIZATION_COLUMNS: Column<TenantDocument>[] = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }) => {
      const { original } = row;

      return <CoreTypography>{original.name}</CoreTypography>;
    },
  },
  {
    Header: 'State',
    accessor: 'addresses',
    Cell: ({ row }: CellProps<TenantDocument>) => {
      const addresses = row.original?.addresses;

      let state = '';

      if (addresses && addresses.length > 0) {
        const uniqueStates = new Set(addresses.map((address) => address.state));

        if (uniqueStates.size === 1) {
          state = addresses[0]?.state ?? ''; // non conflicting state
        }
      }

      return <CoreTypography>{state || '--'}</CoreTypography>;
    },
  },
  {
    id: 'deepPath',
    Header: 'Parent Organization',
    accessor: 'deepPath',
    Cell: ({ row }) => {
      const {
        original: { deepPath },
      } = row;

      // this removes all YS Root admin from "Parent Organization" column and displays the most direct parent org which is the last item in the list
      const parentOrgName = deepPath.length >= 2 ? deepPath[deepPath.length - 1]?.name ?? '--' : '--';

      return <CoreTypography>{parentOrgName}</CoreTypography>;
    },
  },
  {
    Header: 'Type',
    accessor: 'classification',
    Cell: ({ row }) => {
      const { classification } = row.original;
      const typeString = classification?.type.replace(/([A-Z])/g, ' $1') ?? '--';

      return <CoreTypography sx={{ textTransform: 'capitalize' }}>{typeString}</CoreTypography>;
    },
  },
];

export const ORG_SELECT_OPTIONS: Option[] = [
  {
    label: 'District',
    value: 'district',
  },
  {
    label: 'Public Middle School',
    value: 'publicMiddleSchool',
  },
  {
    label: 'Private Middle School',
    value: 'privateMiddleSchool',
  },
  {
    label: 'Public High School',
    value: 'publicHighSchool',
  },
  {
    label: 'Private High School',
    value: 'privateHighSchool',
  },
  {
    label: 'Charter School',
    value: 'charterSchool',
  },
  {
    label: 'College Community Trade',
    value: 'collegeCommunityTrade',
  },
  {
    label: 'Technical College',
    value: 'technicalCollege',
  },
  {
    label: 'Government',
    value: 'government',
  },
  {
    label: 'Chamber',
    value: 'chamber',
  },
  {
    label: 'Workforce Development',
    value: 'workforceDevelopment',
  },
  {
    label: 'Juvenile Justice',
    value: 'juvenileJustice',
  },
  {
    label: 'Retail',
    value: 'retail',
  },
  {
    label: 'IEC',
    value: 'iec',
  },
  {
    label: 'Strategic Partner',
    value: 'strategicPartner',
  },
  {
    label: 'Nonprofit',
    value: 'nonprofit',
  },
  {
    label: 'Internal',
    value: 'internal',
  },
  {
    label: 'Employer',
    value: 'employer',
  },
  {
    label: 'Other',
    value: 'other',
  },
];
