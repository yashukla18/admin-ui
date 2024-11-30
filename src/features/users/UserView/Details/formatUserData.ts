import { returnPresentKeyVals } from '@utils/returnPresentKeyVals';
import { UserDocument } from '@youscience/user-service-common';
import { SingleObject } from '@interfaces';
import { isAllEmptyEntries } from '@utils/helper';

export const formatUserData = (userData: UserDocument) => {
  const months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = userData?.profile?.dateOfBirth ? new Date(userData?.profile.dateOfBirth) : null;
  const month = date?.getUTCMonth?.();
  const year = date?.getUTCFullYear?.();
  const day = date?.getUTCDate?.();
  const formattedDate = `${month}/${day}/${year}`;

  const formattedDateOfBirth: string = !formattedDate.includes('undefined')
    ? `${months[Number(formattedDate.split('/')[0]).valueOf()]} ${Number(formattedDate.split('/')[1]).valueOf()}, ${
        formattedDate.split('/')[2]
      }`
    : '';

  const filteredDetails = [];

  filteredDetails.push(returnPresentKeyVals({ name: userData?.fullName }) as SingleObject);
  filteredDetails.push(returnPresentKeyVals({ preferredName: userData?.displayName }) as SingleObject);
  filteredDetails.push(returnPresentKeyVals({ graduationYear: userData?.profile?.graduationYear }) as SingleObject);
  filteredDetails.push(returnPresentKeyVals({ dateOfBirth: formattedDateOfBirth }) as SingleObject);
  const filteredEmails = userData?.profile?.emails?.map((email: SingleObject, i: number) => {
    if ((JSON.parse(email?.isPrimary as string) === false && i === 0) || JSON.parse(email?.isPrimary as string)) {
      return returnPresentKeyVals({ primaryEmail: email.address }) as SingleObject;
    }
    return returnPresentKeyVals({ secondaryEmail: email.address }) as SingleObject;
  });

  const linkedIn = returnPresentKeyVals({
    linkedin: userData?.profile?.linkedIn,
  }) as SingleObject;

  const filteredPhones = userData?.profile?.phones?.map((phone, i) => {
    if (i === 0) {
      return returnPresentKeyVals({ 'phoneNumber 1': phone.number }) as SingleObject;
    }

    return returnPresentKeyVals({ 'phoneNumber 2': phone.number }) as SingleObject;
  });

  const filteredAddresses = userData?.profile?.addresses
    ?.filter((address) => {
      return !isAllEmptyEntries([
        address.lines?.[0] ?? '',
        address.city ?? '',
        address.state ?? '',
        address.postCode ?? '',
      ]);
    })
    .map((address, i) => {
      if (i === 0) {
        return returnPresentKeyVals({
          'address 1': address.lines?.[0] !== '' ? address.lines?.[0] : '--',
          city: address.city ?? '--',
          state: address.state ?? '--',
          zip: address.postCode ?? '--',
        }) as SingleObject;
      }
      return returnPresentKeyVals({
        'address 2': address.lines?.[0] !== '' ? address.lines?.[0] : '--',
        city: address.city ?? '--',
        state: address.state ?? '--',
        zip: address.postCode ?? '--',
      }) as SingleObject;
    });

  const race = returnPresentKeyVals({
    'race/ethnicity': userData?.profile?.ethnicity
      ?.map((data) => {
        let ethnicityString = data;

        if (data.includes('---') || data.includes('--')) {
          ethnicityString = data.replace('---', '-') || data.replace('--', '-');
        }

        return (
          ethnicityString
            ?.split('-')
            // eslint-disable-next-line no-unsafe-optional-chaining
            ?.map((word) => word[0]?.toUpperCase() + word.slice(1))
            ?.join(' ') || data
        );
      })
      .join(', '),
  }) as SingleObject;

  const filteredUserData = {
    details: filteredDetails,
    emails: filteredEmails,
    linkedIn,
    phones: filteredPhones,
    addresses: filteredAddresses,
    race,
  };

  return filteredUserData;
};
