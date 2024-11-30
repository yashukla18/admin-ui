/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

export interface useLazySvgProps {
  imagePath: string;
  onCompleted?: (filename: string, SvgIcon: React.FC<React.SVGProps<SVGSVGElement>> | undefined) => void;
  onError?: any;
}

export function useLazySvgImport(
  filename: string,
  options: useLazySvgProps = {
    imagePath: '',
  },
) {
  const importedSvgRef = useRef<React.FC<React.SVGProps<SVGSVGElement>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { onCompleted, onError, imagePath } = options;

  useEffect(() => {
    setLoading(true);
    const importSvg = async (): Promise<void> => {
      if (imagePath && filename) {
        let nameToBeParsed = filename;

        // eslint-disable-next-line prefer-destructuring
        if (filename.includes('.svg')) nameToBeParsed = filename.split('.svg')[0];

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          importedSvgRef.current = (await import(`@assets/${imagePath}/${nameToBeParsed}.svg`)).ReactComponent;
          onCompleted?.(filename, importedSvgRef.current);
        } catch (err: any) {
          onError?.(err);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    void importSvg();
  }, [filename, onCompleted, onError, imagePath]);

  return { error, loading, SvgIcon: importedSvgRef.current };
}
