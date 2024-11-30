import { useAuthStore } from '@stores/authStore';
import { act, render, renderHook, screen, userEvent, waitFor } from '@utils/test-utils';
import * as CustomDialogModule from './CustomDialog';

describe('CustomDialog Tests', () => {
  beforeEach(async () => {
    useAuthStore.setState({
      authSession: {
        isAuthenticated: false,
        currentAccess: undefined,
        userData: undefined,
        userType: undefined,
      },
    });

    vi.clearAllMocks();
  });

  const onConfirmMock = vi.fn();
  const onCancelMock = vi.fn();

  test('should open and close dialog', () => {
    const { result } = renderHook(() => CustomDialogModule.useCustomDialog());

    expect(result.current.dialogOpen).toBe(false);

    act(() => {
      result.current.openDialog();
    });

    expect(result.current.dialogOpen).toBe(true);

    act(() => {
      result.current.closeDialog();
    });

    expect(result.current.dialogOpen).toBe(false);
  });

  test('should render dialog with custom text', async () => {
    const customTitle = 'Custom Title';
    const customContentText = 'Custom content text';
    const customConfirmText = 'Custom Confirm';
    const customCancelText = 'Custom Cancel';
    const { result } = renderHook(() => CustomDialogModule.useCustomDialog());

    act(() => {
      result.current.openDialog();
    });

    render(
      <result.current.CustomDialog
        cancelText={customCancelText}
        confirmText={customConfirmText}
        contentText={customContentText}
        title={customTitle}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />,
    );

    expect(result.current.dialogOpen).toBe(true);

    await waitFor(() => expect(screen.queryByText(customTitle)).toBeTruthy());
    expect(screen.queryByText(customContentText)).toBeTruthy();
    expect(screen.queryByText(customConfirmText)).toBeTruthy();
    expect(screen.queryByText(customCancelText)).toBeTruthy();
  });

  it('should render dialog with default text if no values provided', async () => {
    const customTitle = 'Custom Title';

    const { result } = renderHook(() => CustomDialogModule.useCustomDialog());

    act(() => {
      result.current.openDialog();
    });

    render(<result.current.CustomDialog title={customTitle} onConfirm={onConfirmMock} onCancel={onCancelMock} />);

    expect(result.current.dialogOpen).toBe(true);

    await waitFor(() => expect(screen.queryByText(customTitle)).toBeTruthy());
    expect(screen.queryByText(customTitle)).toBeTruthy();
    expect(screen.queryByText('Are you sure?')).toBeTruthy();
    expect(screen.queryByText('Confirm')).toBeTruthy();
    expect(screen.queryByText('Cancel')).toBeTruthy();
  });

  it('should call onConfirm and onCancel functions', async () => {
    const customTitle = 'Custom Title';

    const { result } = renderHook(() => CustomDialogModule.useCustomDialog());

    act(() => {
      result.current.openDialog();
    });

    render(<result.current.CustomDialog title={customTitle} onConfirm={onConfirmMock} onCancel={onCancelMock} />);

    const confirmButton = screen.getByRole('button', { name: 'Confirm' });

    await userEvent.click(confirmButton);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await userEvent.click(cancelButton);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
