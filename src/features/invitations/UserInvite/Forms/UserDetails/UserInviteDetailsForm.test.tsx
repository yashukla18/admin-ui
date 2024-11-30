import { render, renderHook, screen } from '@testing-library/react';
import * as ReactHookForm from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import userEvent from '@testing-library/user-event';
import { UserInviteDetailsForm } from './UserInviteDetailsForm';
import { USER_INVITE_DEFAULT_VALUES, USER_INVITE_VALIDATION_SCHEMA, UserInviteSchema } from '../../constants';

describe('UserInviteDetailsForm', () => {
  let renderResult: {
    current: ReactHookForm.UseFormReturn<UserInviteSchema, unknown, undefined>;
  };

  beforeEach(() => {
    const { result } = renderHook(
      () =>
        ReactHookForm.useForm<UserInviteSchema>({
          resolver: zodResolver(USER_INVITE_VALIDATION_SCHEMA),
          defaultValues: USER_INVITE_DEFAULT_VALUES,
        }),
      {},
    );

    renderResult = result;
  });

  vi.mock('react-hook-form', async () => {
    const reactHookForm = await vi.importActual('react-hook-form');

    return {
      ...reactHookForm,
    };
  });

  it('should change the full name field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_FULL_NAME');

    await userEvent.type(inputField, 'Nathaniel Beatrice Asmus');

    expect(inputField).toHaveValue('Nathaniel Beatrice Asmus');
  });

  it('should change the displayName field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_DISPLAY_NAME');

    await userEvent.type(inputField, 'Nard Dog');

    expect(inputField).toHaveValue('Nard Dog');
  });

  it('should change the graduation date field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    await userEvent.type(screen.getByTestId('PERSONAL_INFO_GRADUATION_YEAR'), '01202021');
  });

  it('should change the personal date of birth field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    await userEvent.type(screen.getByTestId('PERSONAL_INFO_DATE_OF_BIRTH'), '01202021');
  });

  it('should change the primary email field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_EMAIL_PRIMARY');

    await userEvent.type(inputField, 'testing@test.com');

    expect(inputField).toHaveValue('testing@test.com');
  });

  it('should change the LinkedIn field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_LINKEDIN');

    await userEvent.type(inputField, 'LinkedIn');

    expect(inputField).toHaveValue('LinkedIn');
  });

  it('should change the primary phone field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_PHONE_PRIMARY');

    await userEvent.type(inputField, '8012232222');

    expect(inputField).toHaveValue('+1 801-223-2222');
  });

  it('should change the primary phone field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_PHONE_PRIMARY');

    await userEvent.type(inputField, '8012232222');

    expect(inputField).toHaveValue('+1 801-223-2222');
  });

  it('should change the primary address lines field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_ADDRESS_LINES_PRIMARY');

    await userEvent.type(inputField, '894 N 1000 W');

    expect(inputField).toHaveValue('894 N 1000 W');
  });

  it('should change the primary address zip code field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_ADDRESS_ZIP_PRIMARY');

    await userEvent.type(inputField, '84003');

    expect(inputField).toHaveValue('84003');
  });

  it('should change the primary address city field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);
    const inputField = screen.getByTestId('PERSONAL_INFO_ADDRESS_CITY_PRIMARY');

    await userEvent.type(inputField, 'American Fork');

    expect(inputField).toHaveValue('American Fork');
  });

  it('should change the primary address state field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);

    const inputField = screen.getByTestId('PERSONAL_INFO_ADDRESS_STATE_PRIMARY');

    await userEvent.click(screen.getAllByRole('combobox')[0]);
    await userEvent.click(screen.getByText('Utah'));

    expect(inputField).toHaveValue('UT');
  });

  it('should change the primary address country field', async () => {
    vi.spyOn(ReactHookForm, 'useFormContext');

    render(<UserInviteDetailsForm methods={renderResult.current} />);

    const inputField = screen.getByTestId('PERSONAL_INFO_ADDRESS_COUNTRY_PRIMARY');

    await userEvent.click(screen.getAllByRole('combobox')[1]);
    await userEvent.click(screen.getByText('United States'));

    expect(inputField).toHaveValue('US');
  });
});
