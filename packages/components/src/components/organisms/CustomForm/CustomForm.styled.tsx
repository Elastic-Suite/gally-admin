import { styled } from '@mui/system'

export const MainSectionFieldSet = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  '.MuiAutocomplete-inputRoot:not(.combinationRules .MuiAutocomplete-inputRoot, .textFieldTagsMultiple .MuiAutocomplete-inputRoot)':
    {
      width: 300,
      maxWidth: 300,
    },
}))

export const SectionFieldSet = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
  background: theme.palette.colors.white,
  border: '1px solid ',
  borderColor: theme.palette.colors.neutral[300],
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  '.switch': {
    marginBottom: '-10px',
  },
}))

export const ListItemForm = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}))

export const LabelFieldSet = styled('div')(({ theme }) => ({
  fontWeight: '600',
  fontSize: '20px',
  lineHeight: '30px',
  color: theme.palette.colors.neutral[900],
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  alignItems: 'center',
  fontFamily: 'var(--gally-font)',
}))
