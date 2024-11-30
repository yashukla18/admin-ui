import { useLazySvgImport, useLazySvgProps } from '@hooks/useLazySvg';
import { Skeleton } from '@mui/material';

export interface LazyLoadSvgProps extends React.SVGProps<SVGSVGElement> {
  imagePath: string;
  loadingElement?: React.ReactNode;
  fileName: string;
  onCompleted?: useLazySvgProps['onCompleted'];
  onError?: useLazySvgProps['onError'];
}

export const LazyLoadSvg: React.FC<LazyLoadSvgProps> = ({
  imagePath,
  loadingElement,
  fileName,
  onCompleted,
  onError,
  ...rest
}): React.ReactNode | null => {
  const { error, loading, SvgIcon } = useLazySvgImport(fileName, {
    onCompleted,
    imagePath,
    onError,
  });

  if (error) {
    return error.message;
  }
  if (loading) {
    return loadingElement ?? <Skeleton />;
  }
  if (SvgIcon) {
    return <SvgIcon {...rest} />;
  }
  return null;
};
