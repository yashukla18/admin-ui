export const mockPropsWithIdentities = {
  isResetPassword: true,
  isRemoveIdentity: true,
  initialIdentities: [
    {
      idpId: 'ca6ds5h',
      provider: 'cognito',
      email: 'bryan.campbell+test1@youscience.com',
    },
    {
      idpId: '675dfuh',
      provider: 'cognito',
      email: 'bryan.campbell+test2@youscience.com',
    },
    {
      idpId: 'Google_76765',
      provider: 'Google',
      email: 'bryan.campbell+test3@youscience.com',
      name: 'Rebecca Barton',
    },
    {
      idpId: 'Clever_34ugyg',
      provider: 'Clever',
      email: 'bryan.campbell+test4@youscience.com',
      name: 'Rebecca',
    },
  ],
};

export const rosteringIdentities = [
  { idpId: '1', email: 'test@example.com', provider: 'ClassLink' },
  { idpId: '2', email: 'test2@example.com', provider: 'Clever' },
  { idpId: '3', email: 'test3@example.com', provider: 'GADOE' },
];
