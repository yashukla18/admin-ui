export const formFieldsSx = {
  containerSx: {
    display: 'grid',
    gap: 1,
    // gridTemplateColumns: '200px auto',
    mb: 3,
    overflowWrap: 'anywhere',
  },
  addressContainerSx: {
    display: 'grid',
    gap: 6,
    gridTemplateColumns: '50% auto',
    mb: 3,
    overflowWrap: 'anywhere',
  },
  fieldHeading: {
    fontWeight: 'bold',
    // mb: 3,
  },
  controllerContainerSx: {
    maxWidth: '45%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    rowGap: 4,
  },
  inputPropsSx: {
    borderRadius: '6px',
    width: '100%',
  },
  requiredInputLabelSx: {
    span: { color: 'red' },
  },
  rootParentLabelSx: {
    mb: 2,
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: '#000000',
    },
  },
  rootLabelContainerSx: { mt: 4, display: 'flex', flexDirection: 'column' },
};
